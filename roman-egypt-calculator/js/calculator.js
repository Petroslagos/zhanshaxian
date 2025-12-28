/**
 * Roman Egypt Economic Calculator Engine
 * Handles all currency conversions and purchasing power calculations
 */

const Calculator = {
  // Current state
  state: {
    modernAmount: 0,
    modernCurrency: 'CNY',
    selectedPeriod: null,
    metalGrams: { gold: 0, silver: 0 },
    ancientCoins: {},
    purchasingPower: {}
  },

  // ============================================
  // MODERN CURRENCY TO METAL CONVERSION
  // ============================================
  
  /**
   * Convert modern currency to USD
   * @param {number} amount - Amount in source currency
   * @param {string} currency - Source currency code (CNY, EUR, USD)
   * @returns {number} - Amount in USD
   */
  toUSD(amount, currency) {
    const rates = HARPER_DATA.currency_data.modern_to_metal;
    switch (currency) {
      case 'CNY': return amount / rates.cny_per_usd;
      case 'EUR': return amount / rates.eur_per_usd;
      case 'USD': return amount;
      default: return amount;
    }
  },

  /**
   * Convert USD to precious metals
   * @param {number} usd - Amount in USD
   * @param {number} goldRatio - Ratio of gold (0-1), remainder is silver
   * @returns {Object} - { gold_g, silver_g }
   */
  usdToMetal(usd, goldRatio = 0.5) {
    const rates = HARPER_DATA.currency_data.modern_to_metal;
    const goldUsd = usd * goldRatio;
    const silverUsd = usd * (1 - goldRatio);
    
    return {
      gold_g: goldUsd / rates.gold_usd_per_gram,
      silver_g: silverUsd / rates.silver_usd_per_gram
    };
  },

  /**
   * Convert raw metal input to standardized format
   * @param {number} goldGrams - Grams of gold
   * @param {number} silverGrams - Grams of silver
   * @returns {Object} - { gold_g, silver_g, usd_equivalent }
   */
  metalToValue(goldGrams, silverGrams) {
    const rates = HARPER_DATA.currency_data.modern_to_metal;
    const usdEquivalent = (goldGrams * rates.gold_usd_per_gram) + 
                          (silverGrams * rates.silver_usd_per_gram);
    return {
      gold_g: goldGrams,
      silver_g: silverGrams,
      usd_equivalent: usdEquivalent
    };
  },

  // ============================================
  // METAL TO ANCIENT COINS CONVERSION
  // ============================================

  /**
   * Get period-specific coin parameters
   * @param {string} periodId - Period identifier
   * @returns {Object} - Period data with coin specifications
   */
  getPeriodData(periodId) {
    return HARPER_DATA.time_periods.find(p => p.id === periodId);
  },

  /**
   * Convert metal to ancient coins for a specific period
   * @param {number} goldGrams - Grams of gold available
   * @param {number} silverGrams - Grams of silver available
   * @param {string} periodId - Historical period
   * @returns {Object} - Coin breakdown
   */
  metalToCoins(goldGrams, silverGrams, periodId) {
    const period = this.getPeriodData(periodId);
    const coins = HARPER_DATA.currency_data.roman_coins;
    
    let result = {
      period: periodId,
      coins: {},
      total_denarii_equivalent: 0,
      total_solidi_equivalent: 0,
      description_zh: '',
      description_en: ''
    };

    // Different coin systems for different periods
    switch (period.currency_system) {
      case 'silver_denarius':
      case 'silver_denarius_debased':
        result = this._convertToSilverSystem(goldGrams, silverGrams, period, coins);
        break;
      case 'antoninianus':
        result = this._convertToAntoninianusSystem(goldGrams, silverGrams, period, coins);
        break;
      case 'solidus_transition':
      case 'solidus_gold':
        result = this._convertToSolidusSystem(goldGrams, silverGrams, period, coins);
        break;
    }

    return result;
  },

  /**
   * Convert to Principate silver-based coinage (1st-2nd century)
   */
  _convertToSilverSystem(goldGrams, silverGrams, period, coins) {
    // Determine denarius silver content based on period
    let denariusSilver = period.silver_content_denarius_g || 3.4;
    let aureusGold = period.gold_content_aureus_g || 7.3;
    
    // Calculate aurei from gold
    const aurei = Math.floor(goldGrams / aureusGold);
    const remainingGold = goldGrams % aureusGold;
    
    // Calculate denarii from silver
    const denariiFromSilver = Math.floor(silverGrams / denariusSilver);
    
    // Convert remaining gold to denarii equivalent
    const denariiFromGold = Math.floor((remainingGold / aureusGold) * period.denarii_per_aureus);
    
    // Calculate sestertii and asses for small change
    const totalDenarii = denariiFromSilver + denariiFromGold;
    const sestertii = (totalDenarii % 1) * 4; // 4 sestertii = 1 denarius
    
    // Total value in denarii
    const totalDenariiEquiv = (aurei * period.denarii_per_aureus) + totalDenarii;

    return {
      period: period.id,
      coins: {
        aureus: { count: aurei, gold_g: aureusGold, icon: '🥇' },
        denarius: { count: Math.floor(totalDenarii), silver_g: denariusSilver, icon: '🪙' },
        sestertius: { count: Math.floor(sestertii), brass_g: 25, icon: '🟤' }
      },
      total_denarii_equivalent: totalDenariiEquiv,
      description_zh: `${aurei} 奥里斯金币 + ${Math.floor(totalDenarii)} 第纳里银币`,
      description_en: `${aurei} aurei + ${Math.floor(totalDenarii)} denarii`
    };
  },

  /**
   * Convert to Crisis-era antoninianus system (3rd century)
   */
  _convertToAntoninianusSystem(goldGrams, silverGrams, period, coins) {
    // Antoninianus had very little silver by this point
    const denariusSilver = period.silver_content_denarius_g || 1.5;
    const aureusGold = period.gold_content_aureus_g || 5.5;
    
    const aurei = Math.floor(goldGrams / aureusGold);
    const antoniniani = Math.floor(silverGrams / denariusSilver); // Roughly same as debased denarii
    
    const totalDenariiEquiv = (aurei * period.denarii_per_aureus) + antoniniani;

    return {
      period: period.id,
      coins: {
        aureus: { count: aurei, gold_g: aureusGold, icon: '🥇' },
        antoninianus: { count: antoniniani, silver_g: denariusSilver, icon: '🪙' }
      },
      total_denarii_equivalent: totalDenariiEquiv,
      description_zh: `${aurei} 奥里斯金币 + ${antoniniani} 安东尼尼银币（已严重贬值）`,
      description_en: `${aurei} aurei + ${antoniniani} antoniniani (heavily debased)`
    };
  },

  /**
   * Convert to Late Roman solidus system (4th-7th century)
   */
  _convertToSolidusSystem(goldGrams, silverGrams, period, coins) {
    const solidusGold = period.gold_content_solidus_g || 4.5;
    const siliquaSilver = coins.siliqua.silver_g;
    
    // Calculate solidi
    const solidi = Math.floor(goldGrams / solidusGold);
    const remainingGold = goldGrams % solidusGold;
    
    // Tremisses (1/3 solidus) from remaining gold
    const tremisses = Math.floor(remainingGold / coins.tremissis.gold_g);
    
    // Siliquae from silver (24 siliquae = 1 solidus)
    const siliquae = Math.floor(silverGrams / siliquaSilver);
    
    // Total in solidi
    const totalSolidiEquiv = solidi + (tremisses * 0.333) + (siliquae / 24);

    return {
      period: period.id,
      coins: {
        solidus: { count: solidi, gold_g: solidusGold, icon: '🌟' },
        tremissis: { count: tremisses, gold_g: 1.5, icon: '✨' },
        siliqua: { count: siliquae, silver_g: 2.0, icon: '🪙' }
      },
      total_solidi_equivalent: totalSolidiEquiv,
      total_denarii_equivalent: null, // Not applicable in this period
      description_zh: `${solidi} 索里杜斯金币 + ${tremisses} 特雷米西斯 + ${siliquae} 西里夸银币`,
      description_en: `${solidi} solidi + ${tremisses} tremisses + ${siliquae} siliquae`
    };
  },

  // ============================================
  // PURCHASING POWER CALCULATIONS
  // ============================================

  /**
   * Calculate what can be purchased with ancient money
   * @param {Object} coinData - Result from metalToCoins
   * @param {string} periodId - Historical period
   * @returns {Object} - Purchasing power breakdown
   */
  calculatePurchasingPower(coinData, periodId) {
    const period = this.getPeriodData(periodId);
    
    // Get representative prices for this period
    const wheatPrice = this._getAverageWheatPrice(periodId);
    const rentData = this._getAverageRent(periodId);
    const wageData = this._getAverageWage(periodId);
    
    let result = {
      period: periodId,
      wheat: {},
      land: {},
      labor: {},
      lifestyle: {}
    };

    // Calculate based on currency system
    if (coinData.total_solidi_equivalent !== null && coinData.total_solidi_equivalent > 0) {
      // Late Roman/Byzantine gold standard
      result = this._calculateSolidusPurchasing(coinData.total_solidi_equivalent, period, wheatPrice, rentData, wageData);
    } else if (coinData.total_denarii_equivalent > 0) {
      // Principate silver standard
      result = this._calculateDenariusPurchasing(coinData.total_denarii_equivalent, period, wheatPrice, rentData, wageData);
    }

    return result;
  },

  /**
   * Get average wheat price for a period
   */
  _getAverageWheatPrice(periodId) {
    const period = this.getPeriodData(periodId);
    
    // Check different price arrays based on period
    if (['julio_claudian', 'flavian_antonine', 'severan', 'crisis_3c'].includes(periodId)) {
      const prices = HARPER_DATA.wheat_prices['1_3c'].filter(p => p.period === periodId);
      if (prices.length > 0) {
        const avg = prices.reduce((sum, p) => sum + p.price_dr_art, 0) / prices.length;
        return { price: avg, unit: 'drachmai_per_artaba', currency: 'denarii' };
      }
      return { price: period.avg_wheat_price_dr_art || 8, unit: 'drachmai_per_artaba', currency: 'denarii' };
    }
    
    if (periodId === 'tetrarchy_constantine') {
      const prices = HARPER_DATA.wheat_prices['4c'].filter(p => p.period === periodId);
      if (prices.length > 0) {
        const avg = prices.reduce((sum, p) => sum + p.price_den_art, 0) / prices.length;
        return { price: avg, unit: 'denarii_per_artaba', currency: 'denarii_communes' };
      }
      return { price: period.avg_wheat_price_den_art || 1000000, unit: 'denarii_per_artaba', currency: 'denarii_communes' };
    }
    
    if (['late_roman', 'byzantine_early'].includes(periodId)) {
      const prices = HARPER_DATA.wheat_prices['5_7c'].filter(p => p.period === periodId);
      if (prices.length > 0) {
        const avg = prices.reduce((sum, p) => sum + p.art_per_sol, 0) / prices.length;
        return { price: avg, unit: 'artabae_per_solidus', currency: 'solidi' };
      }
      return { price: period.avg_wheat_art_per_sol || 10, unit: 'artabae_per_solidus', currency: 'solidi' };
    }
    
    return { price: 8, unit: 'drachmai_per_artaba', currency: 'denarii' };
  },

  /**
   * Get average rent for a period
   */
  _getAverageRent(periodId) {
    const cashRents = HARPER_DATA.rents.cash.filter(r => r.period === periodId);
    const kindRents = HARPER_DATA.rents.kind.filter(r => r.period === periodId);
    const solidiRents = HARPER_DATA.rents.solidi.filter(r => r.period === periodId);
    
    let result = { cash: null, kind: null, solidi: null };
    
    if (cashRents.length > 0) {
      result.cash = cashRents.reduce((sum, r) => sum + r.rent_dr_ar, 0) / cashRents.length;
    }
    if (kindRents.length > 0) {
      result.kind = kindRents.reduce((sum, r) => sum + r.rent_art_ar, 0) / kindRents.length;
    }
    if (solidiRents.length > 0) {
      result.solidi = solidiRents.reduce((sum, r) => sum + r.rent_sol_ar, 0) / solidiRents.length;
    }
    
    return result;
  },

  /**
   * Get average wage for a period
   */
  _getAverageWage(periodId) {
    const dailyWages = HARPER_DATA.wages.daily.filter(w => w.period === periodId);
    const yearlyWages = HARPER_DATA.wages.yearly.filter(w => w.period === periodId);
    
    let result = { daily: null, yearly: null, unit: 'obols' };
    
    if (dailyWages.length > 0) {
      result.daily = dailyWages.reduce((sum, w) => sum + w.amount, 0) / dailyWages.length;
      result.unit = dailyWages[0].unit;
    }
    if (yearlyWages.length > 0) {
      result.yearly = yearlyWages.reduce((sum, w) => sum + w.amount, 0) / yearlyWages.length;
      result.yearly_unit = yearlyWages[0].unit;
    }
    
    return result;
  },

  /**
   * Calculate purchasing power in denarii-based periods
   */
  _calculateDenariusPurchasing(totalDenarii, period, wheatPrice, rentData, wageData) {
    // Convert denarii to drachmai (1 denarius ≈ 1 drachma in Roman Egypt)
    const drachmai = totalDenarii;
    
    // Wheat calculation
    const artabae = drachmai / wheatPrice.price;
    const monthsOfFood = artabae; // 1 artaba ≈ 1 person-month of wheat
    
    // Rent calculation (if data available)
    let arouraeYears = 0;
    if (rentData.cash) {
      arouraeYears = drachmai / rentData.cash;
    }
    
    // Labor calculation
    let laborDays = 0;
    if (wageData.daily) {
      // Convert obols to drachmai (6 obols = 1 drachma)
      const dailyDrachmai = wageData.daily / 6;
      laborDays = drachmai / dailyDrachmai;
    }
    
    // Lifestyle assessment
    const lifestyle = this._assessLifestyle(drachmai, period.id, 'denarii');
    
    return {
      period: period.id,
      currency_used: 'denarii/drachmai',
      wheat: {
        artabae: Math.round(artabae * 100) / 100,
        months_food: Math.round(monthsOfFood * 10) / 10,
        kg_equivalent: Math.round(artabae * 30), // 1 artaba ≈ 30 kg
        description_zh: `${Math.round(artabae)} 阿塔巴小麦（约${Math.round(monthsOfFood)}个月口粮）`,
        description_en: `${Math.round(artabae)} artabae of wheat (≈${Math.round(monthsOfFood)} months' food)`
      },
      land: {
        rent_years: Math.round(arouraeYears * 100) / 100,
        description_zh: rentData.cash ? 
          `可支付约 ${Math.round(arouraeYears * 10) / 10} 亩地一年租金` : 
          '数据不可用',
        description_en: rentData.cash ? 
          `Can pay rent for ${Math.round(arouraeYears * 10) / 10} aroura-years` : 
          'Data not available'
      },
      labor: {
        days: Math.round(laborDays),
        description_zh: laborDays > 0 ? 
          `相当于普通工人 ${Math.round(laborDays)} 天工资` : 
          '数据不可用',
        description_en: laborDays > 0 ? 
          `Equals ${Math.round(laborDays)} days of common labor` : 
          'Data not available'
      },
      lifestyle: lifestyle
    };
  },

  /**
   * Calculate purchasing power in solidus-based periods
   */
  _calculateSolidusPurchasing(totalSolidi, period, wheatPrice, rentData, wageData) {
    // Wheat calculation (artabae per solidus)
    const artabae = totalSolidi * wheatPrice.price;
    const monthsOfFood = artabae;
    
    // Rent calculation
    let arouraeYears = 0;
    if (rentData.solidi) {
      arouraeYears = totalSolidi / rentData.solidi;
    }
    
    // Labor calculation (yearly wages in solidi)
    let yearsOfLabor = 0;
    if (wageData.yearly) {
      yearsOfLabor = totalSolidi / wageData.yearly;
    }
    
    const lifestyle = this._assessLifestyle(totalSolidi, period.id, 'solidi');
    
    return {
      period: period.id,
      currency_used: 'solidi',
      wheat: {
        artabae: Math.round(artabae * 100) / 100,
        months_food: Math.round(monthsOfFood * 10) / 10,
        kg_equivalent: Math.round(artabae * 30),
        description_zh: `${Math.round(artabae)} 阿塔巴小麦（约${Math.round(monthsOfFood)}个月口粮）`,
        description_en: `${Math.round(artabae)} artabae of wheat (≈${Math.round(monthsOfFood)} months' food)`
      },
      land: {
        rent_years: Math.round(arouraeYears * 100) / 100,
        description_zh: rentData.solidi ? 
          `可支付约 ${Math.round(arouraeYears * 10) / 10} 亩地一年租金` : 
          '数据不可用',
        description_en: rentData.solidi ? 
          `Can pay rent for ${Math.round(arouraeYears * 10) / 10} aroura-years` : 
          'Data not available'
      },
      labor: {
        years: Math.round(yearsOfLabor * 10) / 10,
        description_zh: yearsOfLabor > 0 ? 
          `相当于普通工人 ${Math.round(yearsOfLabor * 10) / 10} 年收入` : 
          '数据不可用',
        description_en: yearsOfLabor > 0 ? 
          `Equals ${Math.round(yearsOfLabor * 10) / 10} years of common labor income` : 
          'Data not available'
      },
      lifestyle: lifestyle
    };
  },

  /**
   * Assess social class and lifestyle based on wealth
   */
  _assessLifestyle(amount, periodId, currency) {
    // Thresholds vary by period and currency
    let tier, class_zh, class_en, description_zh, description_en, icon;
    
    if (currency === 'solidi') {
      // Byzantine/Late Roman thresholds (annual income basis)
      if (amount >= 100) {
        tier = 'elite';
        class_zh = '贵族/高级官员';
        class_en = 'Elite/High Official';
        description_zh = '你拥有相当于大地主或高级官员的财富。可以购置多处房产，雇佣众多仆人。';
        description_en = 'You have wealth equivalent to a major landowner or high official. You could buy multiple properties and employ many servants.';
        icon = '👑';
      } else if (amount >= 20) {
        tier = 'upper_middle';
        class_zh = '富裕商人/中级地主';
        class_en = 'Wealthy Merchant/Medium Landowner';
        description_zh = '相当于成功商人或中等规模地主。生活舒适，有余力投资。';
        description_en = 'Equivalent to a successful merchant or medium landowner. Comfortable life with surplus for investment.';
        icon = '🏛️';
      } else if (amount >= 5) {
        tier = 'middle';
        class_zh = '工匠/小商人';
        class_en = 'Craftsman/Small Merchant';
        description_zh = '可以维持体面生活，养家糊口绰绰有余，略有积蓄。';
        description_en = 'Can maintain a decent life, support a family comfortably, with some savings.';
        icon = '🔨';
      } else if (amount >= 1) {
        tier = 'lower_middle';
        class_zh = '普通劳工';
        class_en = 'Common Laborer';
        description_zh = '可以维持基本生活几个月，但需要持续工作。';
        description_en = 'Can sustain basic living for a few months, but needs continuous work.';
        icon = '⛏️';
      } else {
        tier = 'poor';
        class_zh = '贫民';
        class_en = 'Poor';
        description_zh = '勉强糊口，需要立即找到工作。';
        description_en = 'Barely subsisting, needs to find work immediately.';
        icon = '🥣';
      }
    } else {
      // Principate denarii thresholds
      if (amount >= 10000) {
        tier = 'elite';
        class_zh = '骑士阶层/富商';
        class_en = 'Equestrian Class/Wealthy Merchant';
        description_zh = '你拥有骑士阶层的财富！可以参与政治，拥有大量土地和奴隶。';
        description_en = 'You have equestrian-level wealth! Could participate in politics, own extensive land and slaves.';
        icon = '👑';
      } else if (amount >= 2000) {
        tier = 'upper_middle';
        class_zh = '成功工匠/商人';
        class_en = 'Successful Craftsman/Merchant';
        description_zh = '相当于成功的工匠或商人，生活富裕，社会地位较高。';
        description_en = 'Equivalent to a successful craftsman or merchant, wealthy life with higher social status.';
        icon = '🏛️';
      } else if (amount >= 400) {
        tier = 'middle';
        class_zh = '中等工匠/自耕农';
        class_en = 'Medium Craftsman/Smallholder';
        description_zh = '可以维持稳定的中产生活，养活全家无忧。';
        description_en = 'Can maintain stable middle-class life, support a family without worry.';
        icon = '🔨';
      } else if (amount >= 100) {
        tier = 'lower_middle';
        class_zh = '普通农民/雇工';
        class_en = 'Common Farmer/Hired Worker';
        description_zh = '相当于普通农民几个月的收入，可以维持基本生活。';
        description_en = "Equals a few months' income for a common farmer, can maintain basic living.";
        icon = '⛏️';
      } else {
        tier = 'poor';
        class_zh = '贫苦劳工';
        class_en = 'Poor Laborer';
        description_zh = '只够维持短期生活，需要尽快找到工作。';
        description_en = 'Only enough for short-term survival, need to find work quickly.';
        icon = '🥣';
      }
    }
    
    return {
      tier,
      class_zh,
      class_en,
      description_zh,
      description_en,
      icon
    };
  },

  // ============================================
  // MAIN CONVERSION PIPELINE
  // ============================================

  /**
   * Full conversion from modern money to ancient purchasing power
   * @param {number} amount - Amount of money
   * @param {string} currency - Modern currency (CNY, EUR, USD, GOLD, SILVER)
   * @param {string} periodId - Target historical period
   * @param {number} goldRatio - Ratio for gold/silver split (0-1)
   * @returns {Object} - Complete conversion results
   */
  convert(amount, currency, periodId, goldRatio = 0.5) {
    let metal;
    
    // Handle direct metal input
    if (currency === 'GOLD') {
      metal = { gold_g: amount, silver_g: 0 };
    } else if (currency === 'SILVER') {
      metal = { gold_g: 0, silver_g: amount };
    } else {
      // Convert modern currency to metal
      const usd = this.toUSD(amount, currency);
      metal = this.usdToMetal(usd, goldRatio);
    }
    
    // Convert metal to ancient coins
    const coins = this.metalToCoins(metal.gold_g, metal.silver_g, periodId);
    
    // Calculate purchasing power
    const purchasing = this.calculatePurchasingPower(coins, periodId);
    
    // Get period info
    const period = this.getPeriodData(periodId);
    
    return {
      input: {
        amount,
        currency,
        period: periodId
      },
      metal: {
        gold_g: Math.round(metal.gold_g * 100) / 100,
        silver_g: Math.round(metal.silver_g * 100) / 100
      },
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
  },

  /**
   * Get all available periods for UI
   */
  getPeriods() {
    return HARPER_DATA.time_periods.map(p => ({
      id: p.id,
      name_zh: p.name_zh,
      name_en: p.name_en,
      name_alt: p.name_alt,
      year_range: `${p.start_year}-${p.end_year}`,
      icon: p.icon,
      color: p.color,
      description_zh: p.description_zh
    }));
  },

  /**
   * Get all occupations for comparison
   */
  getOccupations() {
    return HARPER_DATA.occupations;
  },

  /**
   * Get purchasable items list
   */
  getItems() {
    return HARPER_DATA.purchasable_items;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}
