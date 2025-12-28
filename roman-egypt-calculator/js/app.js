/**
 * Roman Egypt Time Travel Calculator - Main Application
 * Handles UI interactions, screen navigation, and result display
 */

const App = {
  // Application state
  state: {
    currentScreen: 'welcome',
    language: 'zh', // 'zh' or 'en'
    input: {
      amount: 0,
      currency: 'CNY',
      inputMode: 'currency', // 'currency' or 'metal'
      goldGrams: 0,
      silverGrams: 0,
      goldRatio: 0.5
    },
    selectedPeriod: null,
    results: null
  },

  // Screen order for navigation
  screens: ['welcome', 'input', 'period', 'coins', 'results', 'compare'],

  // ============================================
  // INITIALIZATION
  // ============================================
  
  init() {
    this.bindEvents();
    this.renderPeriods();
    this.renderOccupations();
    this.showScreen('welcome');
    this.updateLanguage();
    
    console.log('🏛️ Roman Egypt Calculator initialized');
  },

  // ============================================
  // EVENT BINDING
  // ============================================
  
  bindEvents() {
    // Navigation buttons
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screen = e.currentTarget.dataset.nav;
        this.showScreen(screen);
      });
    });

    // Bottom navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screen = e.currentTarget.dataset.screen;
        if (screen) this.showScreen(screen);
      });
    });

    // Amount input
    const amountInput = document.getElementById('amount-input');
    if (amountInput) {
      amountInput.addEventListener('input', (e) => {
        this.state.input.amount = parseFloat(e.target.value) || 0;
      });
    }

    // Currency selector
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
      currencySelect.addEventListener('change', (e) => {
        this.state.input.currency = e.target.value;
        this.updateInputMode();
      });
    }

    // Gold/Silver ratio slider
    const ratioSlider = document.getElementById('gold-ratio');
    if (ratioSlider) {
      ratioSlider.addEventListener('input', (e) => {
        this.state.input.goldRatio = parseFloat(e.target.value);
        this.updateRatioDisplay();
      });
    }

    // Metal inputs
    const goldInput = document.getElementById('gold-grams');
    if (goldInput) {
      goldInput.addEventListener('input', (e) => {
        this.state.input.goldGrams = parseFloat(e.target.value) || 0;
      });
    }

    const silverInput = document.getElementById('silver-grams');
    if (silverInput) {
      silverInput.addEventListener('input', (e) => {
        this.state.input.silverGrams = parseFloat(e.target.value) || 0;
      });
    }

    // Period selection
    document.querySelectorAll('.period-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectPeriod(e.currentTarget.dataset.period);
      });
    });

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        this.state.language = this.state.language === 'zh' ? 'en' : 'zh';
        this.updateLanguage();
      });
    }

    // Calculate button
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => this.calculate());
    }

    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareResults());
    }
  },

  // ============================================
  // SCREEN NAVIGATION
  // ============================================
  
  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.state.currentScreen = screenId;
    }

    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === screenId);
    });

    // Scroll to top
    window.scrollTo(0, 0);
  },

  nextScreen() {
    const currentIndex = this.screens.indexOf(this.state.currentScreen);
    if (currentIndex < this.screens.length - 1) {
      this.showScreen(this.screens[currentIndex + 1]);
    }
  },

  prevScreen() {
    const currentIndex = this.screens.indexOf(this.state.currentScreen);
    if (currentIndex > 0) {
      this.showScreen(this.screens[currentIndex - 1]);
    }
  },

  // ============================================
  // INPUT HANDLING
  // ============================================
  
  updateInputMode() {
    const currency = this.state.input.currency;
    const metalInputs = document.getElementById('metal-inputs');
    const currencyInputs = document.getElementById('currency-inputs');
    const ratioControl = document.getElementById('ratio-control');

    if (currency === 'METAL') {
      this.state.input.inputMode = 'metal';
      if (metalInputs) metalInputs.classList.remove('hidden');
      if (currencyInputs) currencyInputs.classList.add('hidden');
      if (ratioControl) ratioControl.classList.add('hidden');
    } else {
      this.state.input.inputMode = 'currency';
      if (metalInputs) metalInputs.classList.add('hidden');
      if (currencyInputs) currencyInputs.classList.remove('hidden');
      if (ratioControl) ratioControl.classList.remove('hidden');
    }
  },

  updateRatioDisplay() {
    const ratio = this.state.input.goldRatio;
    const goldPercent = Math.round(ratio * 100);
    const silverPercent = 100 - goldPercent;
    
    const display = document.getElementById('ratio-display');
    if (display) {
      display.textContent = `🥇 ${goldPercent}% | 🪙 ${silverPercent}%`;
    }
  },

  // ============================================
  // PERIOD SELECTION
  // ============================================
  
  renderPeriods() {
    const container = document.getElementById('period-list');
    if (!container) return;

    const periods = Calculator.getPeriods();
    container.innerHTML = periods.map(period => `
      <div class="period-card" data-period="${period.id}">
        <div class="period-icon" style="background-color: ${period.color}20; border-color: ${period.color}">
          ${period.icon}
        </div>
        <div class="period-info">
          <div class="period-name" data-lang-zh="${period.name_zh}" data-lang-en="${period.name_en}">
            ${this.state.language === 'zh' ? period.name_zh : period.name_en}
          </div>
          <div class="period-years">${period.year_range} CE</div>
          <div class="period-desc">${period.description_zh}</div>
        </div>
      </div>
    `).join('');

    // Re-bind events
    container.querySelectorAll('.period-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectPeriod(e.currentTarget.dataset.period);
      });
    });
  },

  selectPeriod(periodId) {
    this.state.selectedPeriod = periodId;
    
    // Update UI
    document.querySelectorAll('.period-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.period === periodId);
    });

    // Auto-advance to next screen after short delay
    setTimeout(() => {
      this.calculate();
    }, 300);
  },

  // ============================================
  // OCCUPATION COMPARISON
  // ============================================
  
  renderOccupations() {
    const container = document.getElementById('occupation-list');
    if (!container) return;

    const occupations = Calculator.getOccupations();
    const icons = {
      'farmer_tenant': '🌾',
      'farm_laborer': '⛏️',
      'craftsman': '🔨',
      'soldier_legionary': '⚔️',
      'estate_manager': '📋',
      'scribe': '📜',
      'merchant': '🏺',
      'landowner_small': '🏡',
      'priest': '⛪',
      'landowner_large': '🏛️'
    };

    container.innerHTML = occupations.map(occ => `
      <div class="occupation-item" data-occupation="${occ.id}">
        <div class="occupation-icon">${icons[occ.id] || '👤'}</div>
        <div class="occupation-info">
          <div class="occupation-name" data-lang-zh="${occ.name_zh}" data-lang-en="${occ.name_en}">
            ${this.state.language === 'zh' ? occ.name_zh : occ.name_en}
          </div>
          <div class="occupation-desc">${occ.desc_zh}</div>
        </div>
      </div>
    `).join('');
  },

  // ============================================
  // CALCULATION & RESULTS
  // ============================================
  
  calculate() {
    if (!this.state.selectedPeriod) {
      this.showScreen('period');
      return;
    }

    const input = this.state.input;
    let results;

    if (input.inputMode === 'metal') {
      // Direct metal input
      const metal = Calculator.metalToValue(input.goldGrams, input.silverGrams);
      const coins = Calculator.metalToCoins(input.goldGrams, input.silverGrams, this.state.selectedPeriod);
      const purchasing = Calculator.calculatePurchasingPower(coins, this.state.selectedPeriod);
      const period = Calculator.getPeriodData(this.state.selectedPeriod);
      
      results = {
        input: { amount: 0, currency: 'METAL', period: this.state.selectedPeriod },
        metal: { gold_g: input.goldGrams, silver_g: input.silverGrams },
        coins,
        purchasing,
        period_info: {
          name_zh: period.name_zh,
          name_en: period.name_en,
          year_range: `${period.start_year}-${period.end_year} CE`,
          description_zh: period.description_zh,
          description_en: period.description_en,
          icon: period.icon
        }
      };
    } else {
      // Currency input
      results = Calculator.convert(
        input.amount,
        input.currency,
        this.state.selectedPeriod,
        input.goldRatio
      );
    }

    this.state.results = results;
    this.renderResults();
    this.showScreen('coins');
  },

  renderResults() {
    const results = this.state.results;
    if (!results) return;

    // Render coins
    this.renderCoins(results.coins);
    
    // Render purchasing power
    this.renderPurchasingPower(results.purchasing);
    
    // Render period info
    this.renderPeriodInfo(results.period_info);
  },

  renderCoins(coinData) {
    const container = document.getElementById('coin-display');
    if (!container) return;

    const isZh = this.state.language === 'zh';
    
    // Coin names in Chinese
    const coinNames = {
      aureus: { zh: '奥里斯金币', en: 'Aureus' },
      denarius: { zh: '第纳里银币', en: 'Denarius' },
      sestertius: { zh: '塞斯特斯', en: 'Sestertius' },
      antoninianus: { zh: '安东尼尼', en: 'Antoninianus' },
      solidus: { zh: '索里杜斯', en: 'Solidus' },
      tremissis: { zh: '特雷米西斯', en: 'Tremissis' },
      siliqua: { zh: '西里夸', en: 'Siliqua' }
    };

    let html = '<div class="coin-stack">';
    
    for (const [coinType, data] of Object.entries(coinData.coins)) {
      if (data.count > 0) {
        const coinClass = data.silver_g ? 'silver' : (data.gold_g ? '' : 'bronze');
        const name = coinNames[coinType] || { zh: coinType, en: coinType };
        
        html += `
          <div class="coin-item animate-slide-up">
            <div class="coin-icon ${coinClass}">${data.icon || '🪙'}</div>
            <div class="coin-count">${data.count}</div>
            <div class="coin-name">${isZh ? name.zh : name.en}</div>
          </div>
        `;
      }
    }
    
    html += '</div>';
    
    // Summary text
    html += `
      <div class="card mt-md">
        <p class="text-center">${isZh ? coinData.description_zh : coinData.description_en}</p>
      </div>
    `;

    container.innerHTML = html;
  },

  renderPurchasingPower(purchasing) {
    const container = document.getElementById('purchasing-display');
    if (!container) return;

    const isZh = this.state.language === 'zh';
    
    let html = '';

    // Wheat section
    html += `
      <div class="result-section card-pixel animate-slide-up">
        <div class="result-header">
          <div class="result-icon">🌾</div>
          <div class="result-title">${isZh ? '小麦购买力' : 'Wheat Purchasing Power'}</div>
        </div>
        <div class="result-value">
          ${purchasing.wheat.artabae}
          <span class="result-unit">${isZh ? '阿塔巴' : 'artabae'}</span>
        </div>
        <div class="result-desc">
          ${isZh ? purchasing.wheat.description_zh : purchasing.wheat.description_en}
        </div>
        <div class="info-panel mt-md">
          <div class="info-panel-text">
            ${isZh ? 
              `约 ${purchasing.wheat.kg_equivalent} 公斤，相当于一人 ${purchasing.wheat.months_food} 个月的口粮` :
              `About ${purchasing.wheat.kg_equivalent} kg, enough for ${purchasing.wheat.months_food} months of food for one person`
            }
          </div>
        </div>
      </div>
    `;

    // Land/Rent section
    html += `
      <div class="result-section card-pixel animate-slide-up delay-1">
        <div class="result-header">
          <div class="result-icon">🏡</div>
          <div class="result-title">${isZh ? '土地租赁' : 'Land Rental'}</div>
        </div>
        <div class="result-value">
          ${purchasing.land.rent_years}
          <span class="result-unit">${isZh ? '亩·年' : 'aroura-years'}</span>
        </div>
        <div class="result-desc">
          ${isZh ? purchasing.land.description_zh : purchasing.land.description_en}
        </div>
      </div>
    `;

    // Labor section
    html += `
      <div class="result-section card-pixel animate-slide-up delay-2">
        <div class="result-header">
          <div class="result-icon">⛏️</div>
          <div class="result-title">${isZh ? '劳动价值' : 'Labor Value'}</div>
        </div>
        <div class="result-value">
          ${purchasing.labor.days || purchasing.labor.years || '—'}
          <span class="result-unit">${isZh ? (purchasing.labor.days ? '天' : '年') : (purchasing.labor.days ? 'days' : 'years')}</span>
        </div>
        <div class="result-desc">
          ${isZh ? purchasing.labor.description_zh : purchasing.labor.description_en}
        </div>
      </div>
    `;

    // Lifestyle assessment
    const lifestyle = purchasing.lifestyle;
    html += `
      <div class="lifestyle-badge animate-slide-up delay-3">
        <div class="lifestyle-icon">${lifestyle.icon}</div>
        <div class="lifestyle-info">
          <div class="lifestyle-class">${isZh ? lifestyle.class_zh : lifestyle.class_en}</div>
          <div class="lifestyle-desc">${isZh ? lifestyle.description_zh : lifestyle.description_en}</div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  renderPeriodInfo(periodInfo) {
    const container = document.getElementById('period-info-display');
    if (!container) return;

    const isZh = this.state.language === 'zh';
    
    container.innerHTML = `
      <div class="history-callout">
        <strong>${periodInfo.icon} ${isZh ? periodInfo.name_zh : periodInfo.name_en}</strong>
        <br>
        <span class="text-mono">${periodInfo.year_range}</span>
        <p class="mt-sm text-small">
          ${isZh ? periodInfo.description_zh : periodInfo.description_en}
        </p>
      </div>
    `;
  },

  // ============================================
  // LANGUAGE SWITCHING
  // ============================================
  
  updateLanguage() {
    const isZh = this.state.language === 'zh';
    
    // Update all elements with language data
    document.querySelectorAll('[data-lang-zh]').forEach(el => {
      const text = isZh ? el.dataset.langZh : el.dataset.langEn;
      if (text) el.textContent = text;
    });

    // Update language toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.textContent = isZh ? 'EN' : '中';
    }

    // Re-render dynamic content
    this.renderPeriods();
    this.renderOccupations();
    if (this.state.results) {
      this.renderResults();
    }
  },

  // ============================================
  // SHARING
  // ============================================
  
  shareResults() {
    const results = this.state.results;
    if (!results) return;

    const isZh = this.state.language === 'zh';
    const lifestyle = results.purchasing.lifestyle;
    
    const text = isZh ? 
      `🏛️ 千年穿越计算器\n\n如果我带着 ${results.input.amount} ${results.input.currency} 穿越到${results.period_info.name_zh}...\n\n${lifestyle.icon} 我将成为：${lifestyle.class_zh}\n🌾 可买 ${results.purchasing.wheat.artabae} 阿塔巴小麦\n\n${lifestyle.description_zh}` :
      `🏛️ Time Travel Calculator\n\nIf I traveled to ${results.period_info.name_en} with ${results.input.amount} ${results.input.currency}...\n\n${lifestyle.icon} I would be: ${lifestyle.class_en}\n🌾 Could buy ${results.purchasing.wheat.artabae} artabae of wheat\n\n${lifestyle.description_en}`;

    // Try native share API first
    if (navigator.share) {
      navigator.share({
        title: isZh ? '千年穿越计算器' : 'Time Travel Calculator',
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert(isZh ? '结果已复制到剪贴板！' : 'Results copied to clipboard!');
      }).catch(console.error);
    }
  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  formatNumber(num, decimals = 2) {
    return num.toLocaleString(this.state.language === 'zh' ? 'zh-CN' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  },

  // ============================================
  // SOURCE CITATIONS
  // ============================================

  /**
   * Toggle the source citations panel
   */
  toggleSources() {
    const panel = document.getElementById('sources-panel');
    if (panel) {
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        this.renderSources();
      }
    }
  },

  /**
   * Render source citations for the current period
   */
  renderSources() {
    const container = document.getElementById('sources-list');
    if (!container || !this.state.selectedPeriod) return;

    const periodId = this.state.selectedPeriod;
    const isZh = this.state.language === 'zh';
    
    // Collect all sources for this period
    const sources = this.getSourcesForPeriod(periodId);
    
    let html = '';
    
    // Wheat price sources
    if (sources.wheat.length > 0) {
      html += `<div class="mb-md">
        <strong>🌾 ${isZh ? '小麦价格来源' : 'Wheat Price Sources'}:</strong>
        <ul style="margin: 8px 0; padding-left: 20px;">`;
      sources.wheat.forEach(s => {
        const papyriLink = this.getPapyriInfoLink(s.source);
        html += `<li style="margin: 4px 0;">
          <span class="text-mono">${s.source}</span> 
          (${s.year} CE, ${s.nome})
          ${papyriLink ? `<a href="${papyriLink}" target="_blank" style="color: var(--color-lapis);">🔗</a>` : ''}
        </li>`;
      });
      html += '</ul></div>';
    }
    
    // Wage sources
    if (sources.wages.length > 0) {
      html += `<div class="mb-md">
        <strong>⛏️ ${isZh ? '工资来源' : 'Wage Sources'}:</strong>
        <ul style="margin: 8px 0; padding-left: 20px;">`;
      sources.wages.forEach(s => {
        const papyriLink = this.getPapyriInfoLink(s.source);
        html += `<li style="margin: 4px 0;">
          <span class="text-mono">${s.source}</span> 
          (${s.year} CE, ${s.occupation})
          ${papyriLink ? `<a href="${papyriLink}" target="_blank" style="color: var(--color-lapis);">🔗</a>` : ''}
        </li>`;
      });
      html += '</ul></div>';
    }
    
    // Rent sources
    if (sources.rents.length > 0) {
      html += `<div class="mb-md">
        <strong>🏡 ${isZh ? '地租来源' : 'Rent Sources'}:</strong>
        <ul style="margin: 8px 0; padding-left: 20px;">`;
      sources.rents.forEach(s => {
        const papyriLink = this.getPapyriInfoLink(s.source);
        html += `<li style="margin: 4px 0;">
          <span class="text-mono">${s.source}</span> 
          (${s.year} CE, ${s.nome})
          ${papyriLink ? `<a href="${papyriLink}" target="_blank" style="color: var(--color-lapis);">🔗</a>` : ''}
        </li>`;
      });
      html += '</ul></div>';
    }
    
    if (html === '') {
      html = `<p>${isZh ? '此时期暂无详细来源数据' : 'No detailed source data for this period'}</p>`;
    }
    
    container.innerHTML = html;
  },

  /**
   * Get all sources for a specific period
   */
  getSourcesForPeriod(periodId) {
    const result = {
      wheat: [],
      wages: [],
      rents: []
    };
    
    // Wheat prices from different eras
    const allWheat = [
      ...(HARPER_DATA.wheat_prices['1_3c'] || []),
      ...(HARPER_DATA.wheat_prices['4c'] || []),
      ...(HARPER_DATA.wheat_prices['5_7c'] || [])
    ];
    result.wheat = allWheat.filter(w => w.period === periodId);
    
    // Wages
    const allWages = [
      ...(HARPER_DATA.wages.daily || []),
      ...(HARPER_DATA.wages.yearly || [])
    ];
    result.wages = allWages.filter(w => w.period === periodId);
    
    // Rents
    const allRents = [
      ...(HARPER_DATA.rents.cash || []),
      ...(HARPER_DATA.rents.kind || []),
      ...(HARPER_DATA.rents.solidi || [])
    ];
    result.rents = allRents.filter(r => r.period === periodId);
    
    return result;
  },

  /**
   * Generate papyri.info search link from source citation
   * @param {string} source - Source citation like "P. Mich. 2.127"
   * @returns {string|null} - URL or null if not linkable
   */
  getPapyriInfoLink(source) {
    // Common papyrus collections that are on papyri.info
    const collections = {
      'P. Mich.': 'p.mich',
      'P. Oxy.': 'p.oxy',
      'P. Cair.': 'p.cair',
      'P. Lond.': 'p.lond',
      'P. Tebt.': 'p.tebt',
      'P. Fay.': 'p.fay',
      'P. Flor.': 'p.flor',
      'P. Sarap.': 'p.sarap',
      'BGU': 'bgu',
      'SB': 'sb',
      'PSI': 'psi',
      'CPR': 'cpr'
    };
    
    // Try to match and create a search link
    for (const [prefix, collection] of Object.entries(collections)) {
      if (source.startsWith(prefix)) {
        // Create a search query
        const searchTerm = encodeURIComponent(source);
        return `https://papyri.info/search?STRING=${searchTerm}&no_caps=on&no_marks=on&target=text&DATE_MODE=LOOSE&DOCS_PER_PAGE=15`;
      }
    }
    
    // Fallback: general search
    return `https://papyri.info/search?STRING=${encodeURIComponent(source)}&no_caps=on&no_marks=on&target=text`;
  }
};

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
