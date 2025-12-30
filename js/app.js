/**
 * Version II
 * App Controller
 * Handles UI interactions and screen navigation
 */

var App = {
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
  init: function() {
    this.renderPeriodList();
    this.bindEvents();
    this.updateLanguage();
  },

  /**
   * Show a screen
   */
  showScreen: function(screenId) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('active');
    }
    document.getElementById(screenId).classList.add('active');
    this.state.currentScreen = screenId;
    
    // Scroll to top
    window.scrollTo(0, 0);
  },

  /**
   * Set language
   */
  setLanguage: function(lang) {
    this.state.language = lang;
    var btns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].dataset.lang === lang) {
        btns[i].classList.add('active');
      } else {
        btns[i].classList.remove('active');
      }
    }
    this.updateLanguage();
  },

  /**
   * Update all language-dependent text
   */
  updateLanguage: function() {
    var lang = this.state.language;
    var elements = document.querySelectorAll('[data-zh][data-en]');
    for (var i = 0; i < elements.length; i++) {
      elements[i].textContent = elements[i].dataset[lang];
    }
  },

  /**
   * Render period selection list
   */
  renderPeriodList: function() {
    var container = document.getElementById('period-list');
    var lang = this.state.language;
    var self = this;

    var html = '';
    for (var i = 0; i < HARPER_DATA.time_periods.length; i++) {
      var period = HARPER_DATA.time_periods[i];
      html += '<div class="period-card" onclick="App.selectPeriod(\'' + period.id + '\')">' +
        '<div class="period-icon">' +
          '<img src="assets/icons/period-' + period.icon + '.svg" alt="" ' +
               'onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' +
          '<span class="period-icon-fallback" style="display:none;">' + self.getPeriodEmoji(period.id) + '</span>' +
        '</div>' +
        '<div class="period-info">' +
          '<div class="period-name">' + (lang === 'zh' ? period.name_zh : period.name_en) + '</div>' +
          '<div class="period-years">' + period.start_year + ' - ' + period.end_year + ' CE</div>' +
          '<div class="period-desc">' + (lang === 'zh' ? period.description_zh : period.description_en) + '</div>' +
        '</div>' +
      '</div>';
    }
    container.innerHTML = html;
  },

  /**
   * Get fallback emoji for period
   */
  getPeriodEmoji: function(periodId) {
    var emojis = {
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
  selectPeriod: function(periodId) {
    this.state.selectedPeriod = periodId;
    var period = Calculator.getPeriod(periodId);
    var lang = this.state.language;

    // Update badge
    document.getElementById('period-badge-icon').src = 'assets/icons/period-' + period.icon + '.svg';
    document.getElementById('period-badge-name').textContent = lang === 'zh' ? period.name_zh : period.name_en;
    document.getElementById('period-badge-years').textContent = period.start_year + '-' + period.end_year + ' CE';

    this.showScreen('screen-input');
  },

  /**
   * Set input type (currency or metal)
   */
  setInputType: function(type) {
    this.state.inputType = type;
    
    var tabs = document.querySelectorAll('.input-tab');
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].dataset.type === type) {
        tabs[i].classList.add('active');
      } else {
        tabs[i].classList.remove('active');
      }
    }

    if (type === 'currency') {
      document.getElementById('panel-currency').classList.remove('hidden');
      document.getElementById('panel-metal').classList.add('hidden');
    } else {
      document.getElementById('panel-currency').classList.add('hidden');
      document.getElementById('panel-metal').classList.remove('hidden');
    }
  },

  /**
   * Perform calculation
   */
  calculate: function() {
    var input = {};

    if (this.state.inputType === 'currency') {
      var amount = parseFloat(document.getElementById('input-amount').value) || 0;
      var currency = document.getElementById('input-currency').value;
      input = { type: 'currency', amount: amount, currency: currency };
    } else {
      var gold = parseFloat(document.getElementById('input-gold').value) || 0;
      var silver = parseFloat(document.getElementById('input-silver').value) || 0;
      input = { type: 'metal', gold: gold, silver: silver };
    }

    if ((input.type === 'currency' && input.amount <= 0) ||
        (input.type === 'metal' && input.gold <= 0 && input.silver <= 0)) {
      alert(this.state.language === 'zh' ? '请输入金额或金属重量' : 'Please enter amount or metal weight');
      return;
    }

    var result = Calculator.calculate(input, this.state.selectedPeriod, this.state.language);
    this.state.lastResult = result;
    this.renderResults(result);
    this.showScreen('screen-results');
  },

  /**
   * Render results
   */
  renderResults: function(result) {
    var container = document.getElementById('results-container');
    var lang = this.state.language;

    container.innerHTML = 
      this.renderCoinsSection(result) +
      this.renderPurchasingSection(result) +
      this.renderStatusSection(result);
  },

  /**
   * Render coins section
   */
  renderCoinsSection: function(result) {
    var coins = result.coins;
    var period = result.period;
    var lang = this.state.language;

    var coinsHtml = '';

    if (period.id === 'late_roman' || period.id === 'byzantine_early') {
      coinsHtml = 
        '<div class="coin-item">' +
          '<div class="coin-icon">' +
            '<img src="assets/icons/coin-solidus.svg" alt="" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="coin-info">' +
            '<div class="coin-name">' + (lang === 'zh' ? '索立独斯(金币)' : 'Solidus') + '</div>' +
            '<div class="coin-amount">' + Calculator.formatNumber(coins.solidus) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="coin-item">' +
          '<div class="coin-icon">' +
            '<img src="assets/icons/coin-tremissis.svg" alt="" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="coin-info">' +
            '<div class="coin-name">' + (lang === 'zh' ? '特雷米西斯' : 'Tremissis') + '</div>' +
            '<div class="coin-amount">' + Calculator.formatNumber(coins.tremissis) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="coin-item">' +
          '<div class="coin-icon">' +
            '<img src="assets/icons/coin-siliqua.svg" alt="" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="coin-info">' +
            '<div class="coin-name">' + (lang === 'zh' ? '西里夸(银币)' : 'Siliqua') + '</div>' +
            '<div class="coin-amount">' + Calculator.formatNumber(coins.siliqua) + '</div>' +
          '</div>' +
        '</div>';
    } else {
      coinsHtml = 
        '<div class="coin-item">' +
          '<div class="coin-icon">' +
            '<img src="assets/icons/coin-aureus.svg" alt="" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="coin-info">' +
            '<div class="coin-name">' + (lang === 'zh' ? '奥里斯(金币)' : 'Aureus') + '</div>' +
            '<div class="coin-amount">' + Calculator.formatNumber(coins.aureus) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="coin-item">' +
          '<div class="coin-icon">' +
            '<img src="assets/icons/coin-denarius.svg" alt="" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="coin-info">' +
            '<div class="coin-name">' + (lang === 'zh' ? '第纳尔(银币)' : 'Denarii') + '</div>' +
            '<div class="coin-amount">' + Calculator.formatNumber(coins.denarii) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="coin-item">' +
          '<div class="coin-icon">' +
            '<img src="assets/icons/coin-sestertius.svg" alt="" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="coin-info">' +
            '<div class="coin-name">' + (lang === 'zh' ? '塞斯特斯(铜币)' : 'Sestertii') + '</div>' +
            '<div class="coin-amount">' + Calculator.formatNumber(coins.sestertii) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="coin-item">' +
          '<div class="coin-icon">' +
            '<img src="assets/icons/coin-as.svg" alt="" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="coin-info">' +
            '<div class="coin-name">' + (lang === 'zh' ? '阿斯(铜币)' : 'Asses') + '</div>' +
            '<div class="coin-amount">' + Calculator.formatNumber(coins.asses) + '</div>' +
          '</div>' +
        '</div>';
    }

    return '<div class="result-coins">' +
        '<div class="result-section-title">' + (lang === 'zh' ? '换算为古罗马钱币' : 'Converted to Roman Coins') + '</div>' +
        '<div class="coin-grid">' + coinsHtml + '</div>' +
      '</div>';
  },

  /**
   * Render purchasing power section
   */
  renderPurchasingSection: function(result) {
    var lang = this.state.language;
    var self = this;

    if (result.purchases.length === 0) {
      return '<div class="result-purchasing">' +
          '<div class="result-section-title">' + (lang === 'zh' ? '购买力' : 'Purchasing Power') + '</div>' +
          '<div class="purchase-empty">' +
            (lang === 'zh' ? '该时期暂无充足的价格数据' : 'Insufficient price data for this period') +
          '</div>' +
        '</div>';
    }

    var purchasesHtml = '';
    for (var i = 0; i < result.purchases.length; i++) {
      var p = result.purchases[i];
      purchasesHtml += '<div class="purchase-item">' +
        '<div class="purchase-icon">' +
          '<img src="assets/icons/item-' + p.icon + '.svg" alt="" ' +
               'onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' +
          '<span class="purchase-icon-fallback" style="display:none;">' + self.getItemEmoji(p.icon) + '</span>' +
        '</div>' +
        '<div class="purchase-info">' +
          '<div class="purchase-name">' + (lang === 'zh' ? p.name_zh : p.name_en) + '</div>' +
          '<div class="purchase-price">' + p.price + '</div>' +
        '</div>' +
        '<div class="purchase-quantity">' +
          Calculator.formatNumber(p.quantity, 1) +
          '<span class="purchase-unit">' + (lang === 'zh' ? p.unit_zh : p.unit) + '</span>' +
        '</div>' +
      '</div>';
    }

    return '<div class="result-purchasing">' +
        '<div class="result-section-title">' + (lang === 'zh' ? '可购买的商品' : 'Purchasing Power') + '</div>' +
        '<div class="purchase-list">' + purchasesHtml + '</div>' +
      '</div>';
  },

  /**
   * Get item emoji fallback (only Harper-sourced items)
   */
  getItemEmoji: function(icon) {
    var emojis = {
      'wheat': '🌾',
      'land': '🏞️'
    };
    return emojis[icon] || '📦';
  },

  /**
   * Render status section
   */
  renderStatusSection: function(result) {
    var lang = this.state.language;
    var status = result.status;
    var self = this;

    var comparisonsHtml = '';
    for (var i = 0; i < status.comparisons.length; i++) {
      var c = status.comparisons[i];
      comparisonsHtml += '<div class="comparison-item ' + (i === 0 ? 'highlight' : '') + '">' +
        '<span class="comparison-profession">' + (lang === 'zh' ? c.occupation_zh : c.occupation) + '</span>' +
        '<span class="comparison-value">' + c.value.toFixed(1) + ' ' + c.unit + '</span>' +
      '</div>';
    }

    var comparisonSection = '';
    if (status.comparisons.length > 0) {
      comparisonSection = '<div class="profession-comparison">' +
          '<div class="comparison-title">' + (lang === 'zh' ? '与同时代职业相比' : 'Compared to Contemporary Professions') + '</div>' +
          '<div class="comparison-list">' + comparisonsHtml + '</div>' +
        '</div>';
    }

    return '<div class="result-status">' +
        '<div class="status-icon">' +
          '<img src="assets/icons/status-' + status.icon + '.svg" alt="" ' +
               'onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' +
          '<span class="status-icon-fallback" style="display:none;">' + self.getStatusEmoji(status.level) + '</span>' +
        '</div>' +
        '<div class="status-title">' + status.title + '</div>' +
        '<div class="status-desc">' + status.description + '</div>' +
        comparisonSection +
      '</div>';
  },

  /**
   * Get status emoji fallback
   */
  getStatusEmoji: function(level) {
    var emojis = {
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
  showSources: function() {
    if (!this.state.lastResult) return;

    var container = document.getElementById('sources-container');
    var lang = this.state.language;
    var result = this.state.lastResult;
    var self = this;

    // Group sources by type
    var wheatSources = [];
    var rentSources = [];
    for (var i = 0; i < result.sources.length; i++) {
      if (result.sources[i].type === 'wheat') {
        wheatSources.push(result.sources[i]);
      } else if (result.sources[i].type === 'rent') {
        rentSources.push(result.sources[i]);
      }
    }
    var wageData = Calculator.getWagesForPeriod(this.state.selectedPeriod);

    var wheatSection = '';
    if (wheatSources.length > 0) {
      var wheatItems = '';
      for (var i = 0; i < wheatSources.length; i++) {
        wheatItems += self.renderSourceItem(wheatSources[i]);
      }
      wheatSection = '<div class="source-group">' +
          '<div class="source-group-header">' +
            '<div class="source-group-title">' + (lang === 'zh' ? '小麦价格' : 'Wheat Prices') + '</div>' +
          '</div>' +
          '<div class="source-list">' + wheatItems + '</div>' +
        '</div>';
    }

    var rentSection = '';
    if (rentSources.length > 0) {
      var rentItems = '';
      for (var i = 0; i < rentSources.length; i++) {
        rentItems += self.renderSourceItem(rentSources[i]);
      }
      rentSection = '<div class="source-group">' +
          '<div class="source-group-header">' +
            '<div class="source-group-title">' + (lang === 'zh' ? '土地租金' : 'Land Rents') + '</div>' +
          '</div>' +
          '<div class="source-list">' + rentItems + '</div>' +
        '</div>';
    }

    var wageSection = '';
    if (wageData.daily.length > 0 || wageData.yearly.length > 0) {
      var wageItems = '';
      for (var i = 0; i < wageData.daily.length; i++) {
        wageItems += self.renderWageSourceItem(wageData.daily[i], false);
      }
      for (var i = 0; i < wageData.yearly.length; i++) {
        wageItems += self.renderWageSourceItem(wageData.yearly[i], true);
      }
      wageSection = '<div class="source-group">' +
          '<div class="source-group-header">' +
            '<div class="source-group-title">' + (lang === 'zh' ? '工资数据' : 'Wage Data') + '</div>' +
          '</div>' +
          '<div class="source-list">' + wageItems + '</div>' +
        '</div>';
    }

    // Note about drachma/denarius simplification
    var introText = lang === 'zh' 
      ? '以下价格数据来自纸草文献,由Kyle Harper整理收录。' 
      : 'The price data below comes from documentary papyri, compiled by Kyle Harper. Note: Egyptian drachma is treated as approximately equal to denarius (both contained ~3.5-4g silver).';

    container.innerHTML = 
      '<div class="sources-intro">' +
        '<div class="sources-intro-title">' + (lang === 'zh' ? '数据来源说明' : 'About the Data') + '</div>' +
        '<div class="sources-intro-text">' + introText + '</div>' +
      '</div>' +
      wheatSection +
      rentSection +
      wageSection +
      '<div class="sources-intro" style="margin-top: var(--space-lg);">' +
        '<div class="sources-intro-title">' + (lang === 'zh' ? '引用' : 'Citation') + '</div>' +
        '<div class="sources-intro-text">' +
          'Harper, K. 2016. "People, Plagues, and Prices in the Roman World: The Evidence from Egypt." ' +
          '<em>Journal of Economic History</em> 76, 803-839.' +
          '<br><br>' +
          'DARMC Scholarly Data Series 2016-5: Database of Prices, Wages, and Rents for Roman Egypt, 1-700 CE.' +
        '</div>' +
      '</div>';

    this.showScreen('screen-sources');
  },

  /**
   * Render a source item
   */
  renderSourceItem: function(source) {
    return '<div class="source-item">' +
        '<div>' +
          '<div class="source-citation">' + source.source + '</div>' +
          '<div class="source-details">' + source.nome + ', c. ' + Math.round(source.year) + ' CE</div>' +
        '</div>' +
        '<div class="source-value">' +
          '<div class="source-price">' + source.value + ' ' + source.unit + '</div>' +
        '</div>' +
      '</div>';
  },

  /**
   * Render wage source item
   */
  renderWageSourceItem: function(wage, isYearly) {
    var lang = this.state.language;
    var occupation = lang === 'zh' ? Calculator.translateOccupation(wage.occupation) : wage.occupation;
    
    return '<div class="source-item">' +
        '<div>' +
          '<div class="source-citation">' + wage.source + '</div>' +
          '<div class="source-details">' + occupation + ', ' + wage.nome + ', c. ' + Math.round(wage.year) + ' CE</div>' +
        '</div>' +
        '<div class="source-value">' +
          '<div class="source-price">' + wage.amount + ' ' + wage.unit + (isYearly ? '/year' : '/day') + '</div>' +
        '</div>' +
      '</div>';
  },

  /**
   * Share result
   */
  shareResult: function() {
    if (!this.state.lastResult) return;
    this.renderShareCard();
    document.getElementById('share-modal').classList.remove('hidden');
  },

  /**
   * Close share modal
   */
  closeShareModal: function() {
    document.getElementById('share-modal').classList.add('hidden');
  },

  /**
   * Render share card
   */
  renderShareCard: function() {
    var result = this.state.lastResult;
    var lang = this.state.language;
    var period = result.period;
    var status = result.status;
    var coins = result.coins;
    var self = this;

    // Build coins display
    var coinsHtml = '';
    if (coins.solidus !== undefined) {
      coinsHtml = 
        '<div class="share-summary-item"><span>索里独斯</span><span>' + Calculator.formatNumber(coins.solidus) + '</span></div>' +
        '<div class="share-summary-item"><span>特雷米西斯(1/3索里独斯)</span><span>' + Calculator.formatNumber(coins.tremissis) + '</span></div>';
    } else {
      coinsHtml = 
        '<div class="share-summary-item"><span>奥里斯(金)</span><span>' + Calculator.formatNumber(coins.aureus) + '</span></div>' +
        '<div class="share-summary-item"><span>第纳尔(银)</span><span>' + Calculator.formatNumber(coins.denarii) + '</span></div>' +
        '<div class="share-summary-item"><span>塞斯特斯</span><span>' + Calculator.formatNumber(coins.sestertii) + '</span></div>';
    }

    // Build purchases display (only Harper-sourced: wheat and land)
    var purchasesHtml = '';
    for (var i = 0; i < result.purchases.length; i++) {
      var p = result.purchases[i];
      purchasesHtml += '<div class="share-summary-item">' +
        '<span>' + (lang === 'zh' ? p.name_zh : p.name_en) + '</span>' +
        '<span>' + Calculator.formatNumber(p.quantity, 1) + ' ' + (lang === 'zh' ? p.unit_zh : p.unit) + '</span>' +
      '</div>';
    }

    // Build comparisons display
    var comparisonsHtml = '';
    var maxComparisons = Math.min(3, status.comparisons.length);
    for (var i = 0; i < maxComparisons; i++) {
      var c = status.comparisons[i];
      comparisonsHtml += '<div class="share-summary-item">' +
        '<span>' + (lang === 'zh' ? c.occupation_zh : c.occupation) + '</span>' +
        '<span>' + c.value.toFixed(1) + ' ' + c.unit + '</span>' +
      '</div>';
    }

    // Input section
    var inputHtml = '';
    if (result.input.type === 'currency') {
      inputHtml = '<div class="share-summary-item">' +
        '<span>' + result.input.original.currency + '</span>' +
        '<span>' + Calculator.formatNumber(result.input.original.amount) + '</span>' +
      '</div>';
    } else {
      inputHtml = '<div class="share-summary-item"><span>黄金</span><span>' + Calculator.formatNumber(result.input.gold_g) + 'g</span></div>' +
        '<div class="share-summary-item"><span>白银</span><span>' + Calculator.formatNumber(result.input.silver_g) + 'g</span></div>';
    }

    // Purchase section
    var purchaseSection = '';
    if (purchasesHtml) {
      purchaseSection = '<div class="share-section">' +
          '<div class="share-section-title">' + (lang === 'zh' ? '购买力' : 'Purchasing Power') + '</div>' +
          purchasesHtml +
        '</div>';
    }

    // Comparison section
    var comparisonSection = '';
    if (comparisonsHtml) {
      comparisonSection = '<div class="share-section">' +
          '<div class="share-section-title">' + (lang === 'zh' ? '职业对比' : 'Compared to') + '</div>' +
          comparisonsHtml +
        '</div>';
    }

    document.getElementById('share-card').innerHTML = 
      '<div class="share-header">' +
        '<div class="share-brand">' +
          '<img src="assets/icons/logo-placeholder.svg" alt="" class="share-brand-logo" ' +
               'onerror="this.style.display=\'none\'">' +
          '<span class="share-brand-name">古典乱炖</span>' +
        '</div>' +
        '<div class="share-title">罗马斩杀线</div>' +
        '<div class="share-subtitle">Roman Kill Line</div>' +
      '</div>' +
      '<div class="share-period">' +
        '<div class="share-period-name">' + (lang === 'zh' ? period.name_zh : period.name_en) + '</div>' +
        '<div class="share-period-years">' + period.start_year + ' - ' + period.end_year + ' CE</div>' +
      '</div>' +
      '<div class="share-status">' +
        '<div class="share-status-icon">' +
          '<img src="assets/icons/status-' + status.icon + '.svg" alt="" ' +
               'onerror="this.outerHTML=\'' + self.getStatusEmoji(status.level) + '\'">' +
        '</div>' +
        '<div class="share-status-title">' + status.title + '</div>' +
      '</div>' +
      '<div class="share-section">' +
        '<div class="share-section-title">' + (lang === 'zh' ? '投入' : 'Input') + '</div>' +
        inputHtml +
      '</div>' +
      '<div class="share-section">' +
        '<div class="share-section-title">' + (lang === 'zh' ? '换算钱币' : 'Coins') + '</div>' +
        coinsHtml +
      '</div>' +
      purchaseSection +
      comparisonSection +
      '<div class="share-footer">' +
        '<div class="share-footer-text">基于 Kyle Harper 罗马埃及经济数据库</div>' +
      '</div>';
  },

  /**
   * Save share image
   */
  saveShareImage: function() {
    var card = document.getElementById('share-card');
    var self = this;

    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
      // Load html2canvas dynamically
      var script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = function() { self.captureAndSave(card); };
      document.head.appendChild(script);
    } else {
      this.captureAndSave(card);
    }
  },

  /**
   * Capture and save image
   */
  captureAndSave: function(element) {
    var self = this;
    html2canvas(element, {
      backgroundColor: '#1a1612',
      scale: 2
    }).then(function(canvas) {
      var link = document.createElement('a');
      link.download = 'roman-kill-line-result.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(function(error) {
      console.error('Failed to capture image:', error);
      alert(self.state.language === 'zh' ? '保存失败,请截图保存' : 'Save failed, please take a screenshot');
    });
  },

  /**
   * Bind events
   */
  bindEvents: function() {
    var self = this;
    var inputs = document.querySelectorAll('.input-field');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          self.calculate();
        }
      });
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  App.init();
});
