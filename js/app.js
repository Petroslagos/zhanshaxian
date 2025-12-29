/**
 * App Controller
 * Handles UI interactions and screen navigation
 */

const App = {
  state: {
    language: 'zh',
    currentScreen: 'screen-home',
    selectedPeriod: null,
    inputType: 'currency',
    lastResult: null
  },

  /**
   * Initialize application
   */
  init() {
    this.renderPeriodList();
    this.bindEvents();
    this.updateLanguage();
  },

  /**
   * Show a screen
   */
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    this.state.currentScreen = screenId;
    
    // Scroll to top
    window.scrollTo(0, 0);
  },

  /**
   * Set language
   */
  setLanguage(lang) {
    this.state.language = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    this.updateLanguage();
  },

  /**
   * Update all language-dependent text
   */
  updateLanguage() {
    const lang = this.state.language;
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
  },

  /**
   * Render period selection list
   */
  renderPeriodList() {
    const container = document.getElementById('period-list');
    const lang = this.state.language;

    container.innerHTML = HARPER_DATA.time_periods.map(period => `
      <div class="period-card" onclick="App.selectPeriod('${period.id}')">
        <div class="period-icon">
          <img src="assets/icons/period-${period.icon}.svg" alt="" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span class="period-icon-fallback" style="display:none;">${this.getPeriodEmoji(period.id)}</span>
        </div>
        <div class="period-info">
          <div class="period-name">${lang === 'zh' ? period.name_zh : period.name_en}</div>
          <div class="period-years">${period.start_year} - ${period.end_year} CE</div>
          <div class="period-desc">${lang === 'zh' ? period.description_zh : period.description_en}</div>
        </div>
      </div>
    `).join('');
  },

  /**
   * Get fallback emoji for period
   */
  getPeriodEmoji(periodId) {
    const emojis = {
      'julio_claudian': 'I',
      'flavian_antonine': 'II',
      'severan': 'III',
      'crisis_3c': 'IV',
      'late_roman': 'V-VI',
      'byzantine_early': 'VII'
    };
    return emojis[periodId] || 'I';
  },

  /**
   * Select a period
   */
  selectPeriod(periodId) {
    this.state.selectedPeriod = periodId;
    const period = Calculator.getPeriod(periodId);
    const lang = this.state.language;

    // Update badge
    document.getElementById('period-badge-icon').src = `assets/icons/period-${period.icon}.svg`;
    document.getElementById('period-badge-name').textContent = lang === 'zh' ? period.name_zh : period.name_en;
    document.getElementById('period-badge-years').textContent = `${period.start_year}-${period.end_year} CE`;

    this.showScreen('screen-input');
  },

  /**
   * Set input type (currency or metal)
   */
  setInputType(type) {
    this.state.inputType = type;
    
    document.querySelectorAll('.input-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.type === type);
    });

    document.getElementById('panel-currency').classList.toggle('hidden', type !== 'currency');
    document.getElementById('panel-metal').classList.toggle('hidden', type !== 'metal');
  },

  /**
   * Perform calculation
   */
  calculate() {
    let input = {};

    if (this.state.inputType === 'currency') {
      const amount = parseFloat(document.getElementById('input-amount').value) || 0;
      const currency = document.getElementById('input-currency').value;
      input = { type: 'currency', amount, currency };
    } else {
      const gold = parseFloat(document.getElementById('input-gold').value) || 0;
      const silver = parseFloat(document.getElementById('input-silver').value) || 0;
      input = { type: 'metal', gold, silver };
    }

    if ((input.type === 'currency' && input.amount <= 0) ||
        (input.type === 'metal' && input.gold <= 0 && input.silver <= 0)) {
      alert(this.state.language === 'zh' ? '请输入金额或金属重量' : 'Please enter amount or metal weight');
      return;
    }

    const result = Calculator.calculate(input, this.state.selectedPeriod, this.state.language);
    this.state.lastResult = result;
    this.renderResults(result);
    this.showScreen('screen-results');
  },

  /**
   * Render results
   */
  renderResults(result) {
    const container = document.getElementById('results-container');
    const lang = this.state.language;

    container.innerHTML = `
      ${this.renderCoinsSection(result)}
      ${this.renderPurchasingSection(result)}
      ${this.renderStatusSection(result)}
    `;
  },

  /**
   * Render coins section
   */
  renderCoinsSection(result) {
    const coins = result.coins;
    const period = result.period;
    const lang = this.state.language;

    let coinsHtml = '';

    if (period.id === 'late_roman' || period.id === 'byzantine_early') {
      coinsHtml = `
        <div class="coin-item">
          <div class="coin-icon">
            <img src="assets/icons/coin-solidus.svg" alt="" onerror="this.style.display='none'">
          </div>
          <div class="coin-info">
            <div class="coin-name">${lang === 'zh' ? '索立独斯(金币)' : 'Solidus'}</div>
            <div class="coin-amount">${Calculator.formatNumber(coins.solidus)}</div>
          </div>
        </div>
        <div class="coin-item">
          <div class="coin-icon">
            <img src="assets/icons/coin-tremissis.svg" alt="" onerror="this.style.display='none'">
          </div>
          <div class="coin-info">
            <div class="coin-name">${lang === 'zh' ? '特雷米西斯' : 'Tremissis'}</div>
            <div class="coin-amount">${Calculator.formatNumber(coins.tremissis)}</div>
          </div>
        </div>
        <div class="coin-item">
          <div class="coin-icon">
            <img src="assets/icons/coin-siliqua.svg" alt="" onerror="this.style.display='none'">
          </div>
          <div class="coin-info">
            <div class="coin-name">${lang === 'zh' ? '西里夸(银币)' : 'Siliqua'}</div>
            <div class="coin-amount">${Calculator.formatNumber(coins.siliqua)}</div>
          </div>
        </div>
      `;
    } else {
      coinsHtml = `
        <div class="coin-item">
          <div class="coin-icon">
            <img src="assets/icons/coin-aureus.svg" alt="" onerror="this.style.display='none'">
          </div>
          <div class="coin-info">
            <div class="coin-name">${lang === 'zh' ? '奥里斯(金币)' : 'Aureus'}</div>
            <div class="coin-amount">${Calculator.formatNumber(coins.aureus)}</div>
          </div>
        </div>
        <div class="coin-item">
          <div class="coin-icon">
            <img src="assets/icons/coin-denarius.svg" alt="" onerror="this.style.display='none'">
          </div>
          <div class="coin-info">
            <div class="coin-name">${lang === 'zh' ? '第纳尔(银币)' : 'Denarii'}</div>
            <div class="coin-amount">${Calculator.formatNumber(coins.denarii)}</div>
          </div>
        </div>
        <div class="coin-item">
          <div class="coin-icon">
            <img src="assets/icons/coin-sestertius.svg" alt="" onerror="this.style.display='none'">
          </div>
          <div class="coin-info">
            <div class="coin-name">${lang === 'zh' ? '塞斯特斯(铜币)' : 'Sestertii'}</div>
            <div class="coin-amount">${Calculator.formatNumber(coins.sestertii)}</div>
          </div>
        </div>
        <div class="coin-item">
          <div class="coin-icon">
            <img src="assets/icons/coin-as.svg" alt="" onerror="this.style.display='none'">
          </div>
          <div class="coin-info">
            <div class="coin-name">${lang === 'zh' ? '阿斯(铜币)' : 'Asses'}</div>
            <div class="coin-amount">${Calculator.formatNumber(coins.asses)}</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="result-coins">
        <div class="result-section-title">${lang === 'zh' ? '换算为古罗马钱币' : 'Converted to Roman Coins'}</div>
        <div class="coin-grid">
          ${coinsHtml}
        </div>
      </div>
    `;
  },

  /**
   * Render purchasing power section
   */
  renderPurchasingSection(result) {
    const lang = this.state.language;

    const purchasesHtml = result.purchases.map(p => `
      <div class="purchase-item">
        <div class="purchase-icon">
          <img src="assets/icons/item-${p.icon}.svg" alt="" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span class="purchase-icon-fallback" style="display:none;">${this.getItemEmoji(p.icon)}</span>
        </div>
        <div class="purchase-info">
          <div class="purchase-name">${lang === 'zh' ? p.name_zh : p.name_en}</div>
          <div class="purchase-price">${p.price}</div>
        </div>
        <div class="purchase-quantity">
          ${Calculator.formatNumber(p.quantity, 1)}
          <span class="purchase-unit">${lang === 'zh' ? p.unit_zh : p.unit}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="result-purchasing">
        <div class="result-section-title">${lang === 'zh' ? '可购买的商品' : 'Purchasing Power'}</div>
        <div class="purchase-list">
          ${purchasesHtml}
        </div>
      </div>
    `;
  },

  /**
   * Get item emoji fallback
   */
  getItemEmoji(icon) {
    const emojis = {
      'wheat': '🌾',
      'wine': '🍷',
      'oil': '🫒',
      'tunic': '👕',
      'donkey': '🫏',
      'slave': '👤',
      'land': '🏞️'
    };
    return emojis[icon] || '📦';
  },

  /**
   * Render status section
   */
  renderStatusSection(result) {
    const lang = this.state.language;
    const status = result.status;

    const comparisonsHtml = status.comparisons.map((c, i) => `
      <div class="comparison-item ${i === 0 ? 'highlight' : ''}">
        <span class="comparison-profession">${lang === 'zh' ? c.occupation_zh : c.occupation}</span>
        <span class="comparison-value">${c.value.toFixed(1)} ${c.unit}</span>
      </div>
    `).join('');

    return `
      <div class="result-status">
        <div class="status-icon">
          <img src="assets/icons/status-${status.icon}.svg" alt="" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span class="status-icon-fallback" style="display:none;">${this.getStatusEmoji(status.level)}</span>
        </div>
        <div class="status-title">${status.title}</div>
        <div class="status-desc">${status.description}</div>
        
        ${status.comparisons.length > 0 ? `
          <div class="profession-comparison">
            <div class="comparison-title">${lang === 'zh' ? '与同时代职业相比' : 'Compared to Contemporary Professions'}</div>
            <div class="comparison-list">
              ${comparisonsHtml}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Get status emoji fallback
   */
  getStatusEmoji(level) {
    const emojis = {
      1: '😢',
      2: '😐',
      3: '🙂',
      4: '😊',
      5: '👑'
    };
    return emojis[level] || '😐';
  },

  /**
   * Show sources screen
   */
  showSources() {
    if (!this.state.lastResult) return;

    const container = document.getElementById('sources-container');
    const lang = this.state.language;
    const result = this.state.lastResult;

    // Group sources by type
    const wheatSources = result.sources.filter(s => s.type === 'wheat');
    const rentSources = result.sources.filter(s => s.type === 'rent');
    const wageData = Calculator.getWagesForPeriod(this.state.selectedPeriod);

    container.innerHTML = `
      <div class="sources-intro">
        <div class="sources-intro-title">${lang === 'zh' ? '数据来源说明' : 'About the Data'}</div>
        <div class="sources-intro-text">
          ${lang === 'zh' 
            ? '以下价格数据来自纸草数据' 
            : 'The price data below comes from papyri'}
        </div>
      </div>

      ${wheatSources.length > 0 ? `
        <div class="source-group">
          <div class="source-group-header">
            <div class="source-group-title">${lang === 'zh' ? '小麦价格' : 'Wheat Prices'}</div>
          </div>
          <div class="source-list">
            ${wheatSources.map(s => this.renderSourceItem(s)).join('')}
          </div>
        </div>
      ` : ''}

      ${rentSources.length > 0 ? `
        <div class="source-group">
          <div class="source-group-header">
            <div class="source-group-title">${lang === 'zh' ? '土地租金' : 'Land Rents'}</div>
          </div>
          <div class="source-list">
            ${rentSources.map(s => this.renderSourceItem(s)).join('')}
          </div>
        </div>
      ` : ''}

      ${wageData.daily.length > 0 || wageData.yearly.length > 0 ? `
        <div class="source-group">
          <div class="source-group-header">
            <div class="source-group-title">${lang === 'zh' ? '工资数据' : 'Wage Data'}</div>
          </div>
          <div class="source-list">
            ${wageData.daily.map(w => this.renderWageSourceItem(w)).join('')}
            ${wageData.yearly.map(w => this.renderWageSourceItem(w, true)).join('')}
          </div>
        </div>
      ` : ''}

      <div class="sources-intro" style="margin-top: var(--space-lg);">
        <div class="sources-intro-title">${lang === 'zh' ? '引用' : 'Citation'}</div>
        <div class="sources-intro-text">
          Harper, K. 2016. "People, Plagues, and Prices in the Roman World: The Evidence from Egypt." 
          <em>Journal of Economic History</em> 76, 803-839.
          <br><br>
          DARMC Scholarly Data Series 2016-5: Database of Prices, Wages, and Rents for Roman Egypt, 1-700 CE.
        </div>
      </div>
    `;

    this.showScreen('screen-sources');
  },

  /**
   * Render a source item
   */
  renderSourceItem(source) {
    return `
      <div class="source-item">
        <div>
          <div class="source-citation">${source.source}</div>
          <div class="source-details">${source.nome}, c. ${Math.round(source.year)} CE</div>
        </div>
        <div class="source-value">
          <div class="source-price">${source.value} ${source.unit}</div>
        </div>
      </div>
    `;
  },

  /**
   * Render wage source item
   */
  renderWageSourceItem(wage, isYearly = false) {
    const lang = this.state.language;
    const occupation = lang === 'zh' ? Calculator.translateOccupation(wage.occupation) : wage.occupation;
    
    return `
      <div class="source-item">
        <div>
          <div class="source-citation">${wage.source}</div>
          <div class="source-details">${occupation}, ${wage.nome}, c. ${Math.round(wage.year)} CE</div>
        </div>
        <div class="source-value">
          <div class="source-price">${wage.amount} ${wage.unit}${isYearly ? '/year' : '/day'}</div>
        </div>
      </div>
    `;
  },

  /**
   * Share result
   */
  shareResult() {
    if (!this.state.lastResult) return;
    this.renderShareCard();
    document.getElementById('share-modal').classList.remove('hidden');
  },

  /**
   * Close share modal
   */
  closeShareModal() {
    document.getElementById('share-modal').classList.add('hidden');
  },

  /**
   * Render share card
   */
  renderShareCard() {
    const result = this.state.lastResult;
    const lang = this.state.language;
    const period = result.period;
    const status = result.status;

    const primaryPurchase = result.purchases[0];

    document.getElementById('share-card').innerHTML = `
      <div class="share-header">
        <div class="share-brand">
          <img src="assets/icons/logo-placeholder.svg" alt="" class="share-brand-logo" 
               onerror="this.style.display='none'">
          <span class="share-brand-name">古典乱炖</span>
        </div>
        <div class="share-title">罗马斩杀线</div>
        <div class="share-subtitle">Roman Kill Line</div>
      </div>

      <div class="share-period">
        <div class="share-period-name">${lang === 'zh' ? period.name_zh : period.name_en}</div>
        <div class="share-period-years">${period.start_year} - ${period.end_year} CE</div>
      </div>

      <div class="share-status">
        <div class="share-status-icon">
          <img src="assets/icons/status-${status.icon}.svg" alt="" 
               onerror="this.outerHTML='${this.getStatusEmoji(status.level)}'">
        </div>
        <div class="share-status-title">${status.title}</div>
      </div>

      <div class="share-summary">
        ${result.input.type === 'currency' ? `
          <div class="share-summary-item">
            <span class="share-summary-label">${lang === 'zh' ? '投入' : 'Input'}</span>
            <span class="share-summary-value">${result.input.original.currency} ${Calculator.formatNumber(result.input.original.amount)}</span>
          </div>
        ` : `
          <div class="share-summary-item">
            <span class="share-summary-label">${lang === 'zh' ? '黄金' : 'Gold'}</span>
            <span class="share-summary-value">${Calculator.formatNumber(result.input.gold_g)}g</span>
          </div>
          <div class="share-summary-item">
            <span class="share-summary-label">${lang === 'zh' ? '白银' : 'Silver'}</span>
            <span class="share-summary-value">${Calculator.formatNumber(result.input.silver_g)}g</span>
          </div>
        `}
        <div class="share-summary-item">
          <span class="share-summary-label">${lang === 'zh' ? '可买小麦' : 'Wheat'}</span>
          <span class="share-summary-value">${primaryPurchase ? Calculator.formatNumber(primaryPurchase.quantity, 1) + ' artabas' : '-'}</span>
        </div>
      </div>

      <div class="share-footer">
        <div class="share-footer-text">基于 Kyle Harper 罗马埃及经济数据库</div>
      </div>
    `;
  },

  /**
   * Save share image
   */
  async saveShareImage() {
    const card = document.getElementById('share-card');
    
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
      // Load html2canvas dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => this.captureAndSave(card);
      document.head.appendChild(script);
    } else {
      this.captureAndSave(card);
    }
  },

  /**
   * Capture and save image
   */
  async captureAndSave(element) {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1a1612',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = 'roman-kill-line-result.svg';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to capture image:', error);
      alert(this.state.language === 'zh' ? '保存失败，请截图保存' : 'Save failed, please take a screenshot');
    }
  },

  /**
   * Bind events
   */
  bindEvents() {
    // Enter key on input fields
    document.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.calculate();
        }
      });
    });
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
