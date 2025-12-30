/**
 * Version II
 * Roman Egypt Economic Calculator
 * Converts modern currency to ancient Roman coins and calculates purchasing power
 * 
 * NOTE: All purchasing power calculations use only data from Harper's database
 * (wheat prices, land rents, wages from documentary papyri).
 * 
 * IMPORTANT: Egyptian drachma is treated as approximately equal to denarius.
 * Both coins contained ~3.5-4g silver in the 1st-2nd centuries. This is a
 * standard simplification in ancient economic history.
 */

const Calculator = {
  // Current metal prices (update periodically)
  metalPrices: {
    gold_usd_g: 65.0,
    silver_usd_g: 0.8,
    cny_per_usd: 7.2,
    eur_per_usd: 0.92
  },

  /**
   * Convert modern currency to gold/silver grams
   */
  currencyToMetal: function(amount, currency) {
    var usd = amount;
    if (currency === 'CNY') {
      usd = amount / this.metalPrices.cny_per_usd;
    } else if (currency === 'EUR') {
      usd = amount / this.metalPrices.eur_per_usd;
    }

    return {
      gold_g: usd / this.metalPrices.gold_usd_g,
      silver_g: usd / this.metalPrices.silver_usd_g,
      usd: usd
    };
  },

  /**
   * Get period data by ID
   */
  getPeriod: function(periodId) {
    return HARPER_DATA.time_periods.find(function(p) { return p.id === periodId; });
  },

  /**
   * Calculate Roman coins from metal weight
   */
  calculateCoins: function(gold_g, silver_g, period) {
    var periodData = this.getPeriod(period);
    var coins = {};

    if (period === 'late_roman' || period === 'byzantine_early') {
      // Gold solidus era
      var solidus_g = periodData.gold_content_solidus_g || 4.5;
      coins.solidus = gold_g / solidus_g;
      coins.tremissis = coins.solidus * 3;
      coins.siliqua = silver_g / 2.0;
      coins.primaryCoin = 'solidus';
      coins.primaryAmount = coins.solidus;
    } else if (period === 'tetrarchy_constantine') {
      // Transition period
      var solidus_g = periodData.gold_content_solidus_g || 4.5;
      coins.solidus = gold_g / solidus_g;
      coins.follis = (silver_g / 3.0) + (gold_g * 10);
      coins.primaryCoin = 'solidus';
      coins.primaryAmount = coins.solidus;
    } else {
      // Silver denarius era
      var aureus_g = periodData.gold_content_aureus_g || 7.0;
      var denarius_g = periodData.silver_content_denarius_g || 3.0;
      
      coins.aureus = gold_g / aureus_g;
      coins.denarii = (coins.aureus * 25) + (silver_g / denarius_g);
      coins.sestertii = coins.denarii * 4;
      coins.asses = coins.sestertii * 4;
      coins.primaryCoin = 'denarii';
      coins.primaryAmount = coins.denarii;
    }

    return coins;
  },

  /**
   * Get wheat prices for a period with sources
   */
  getWheatPricesForPeriod: function(periodId) {
    var allPrices = [].concat(
      HARPER_DATA.wheat_prices["1_3c"],
      HARPER_DATA.wheat_prices["4c"],
      HARPER_DATA.wheat_prices["5_7c"]
    );
    
    return allPrices.filter(function(p) { return p.period === periodId; });
  },

  /**
   * Get average wheat price for a period
   */
  getAverageWheatPrice: function(periodId) {
    var prices = this.getWheatPricesForPeriod(periodId);
    if (prices.length === 0) return null;

    var period = this.getPeriod(periodId);
    
    if (periodId === 'late_roman' || periodId === 'byzantine_early') {
      // Art per solidus
      var sum = 0;
      for (var i = 0; i < prices.length; i++) {
        sum += (prices[i].art_per_sol || 10);
      }
      var avgArtPerSol = sum / prices.length;
      return { type: 'solidus', value: avgArtPerSol, unit: 'art/sol' };
    } else if (periodId === 'tetrarchy_constantine') {
      // Denarii per artaba (hyperinflation)
      var sum = 0;
      for (var i = 0; i < prices.length; i++) {
        sum += (prices[i].price_den_art || 1000);
      }
      var avgDenArt = sum / prices.length;
      return { type: 'denarii', value: avgDenArt, unit: 'den/art' };
    } else {
      // Drachmai per artaba (treated as denarii - see note above)
      var sum = 0;
      for (var i = 0; i < prices.length; i++) {
        sum += (prices[i].price_dr_art || 10);
      }
      var avgDrArt = sum / prices.length;
      return { type: 'drachmai', value: avgDrArt, unit: 'dr/art' };
    }
  },

  /**
   * Calculate purchasing power (Harper data only: wheat, land rent)
   */
  calculatePurchasingPower: function(coins, periodId) {
    var period = this.getPeriod(periodId);
    var purchases = [];
    var sources = [];

    // Get wheat prices
    var wheatPrices = this.getWheatPricesForPeriod(periodId);
    var avgWheat = this.getAverageWheatPrice(periodId);

    // Calculate wheat artabas
    if (avgWheat) {
      var wheatQuantity = 0;
      var priceDisplay = '';

      if (avgWheat.type === 'solidus') {
        wheatQuantity = coins.solidus * avgWheat.value;
        priceDisplay = '1 solidus = ' + avgWheat.value.toFixed(1) + ' artabas';
      } else if (avgWheat.type === 'denarii') {
        wheatQuantity = (coins.denarii || coins.solidus * 1000) / avgWheat.value;
        priceDisplay = this.formatNumber(avgWheat.value) + ' denarii/artaba';
      } else {
        // Drachmai treated as denarii
        wheatQuantity = (coins.denarii * 4) / avgWheat.value;
        priceDisplay = avgWheat.value.toFixed(1) + ' dr/art';
      }

      purchases.push({
        id: 'wheat',
        name_zh: '小麦',
        name_en: 'Wheat',
        icon: 'wheat',
        quantity: wheatQuantity,
        unit: 'artabas',
        unit_zh: '阿塔巴',
        description: '1 able = ca. 40L, one person one month',
        description_zh: '约40升,够一人吃一个月',
        price: priceDisplay
      });

      // Add sources
      var maxSources = Math.min(5, wheatPrices.length);
      for (var i = 0; i < maxSources; i++) {
        var p = wheatPrices[i];
        sources.push({
          type: 'wheat',
          source: p.source,
          year: p.year,
          nome: p.nome,
          value: p.price_dr_art || p.price_den_art || p.art_per_sol,
          unit: p.price_dr_art ? 'dr/art' : (p.price_den_art ? 'den/art' : 'art/sol')
        });
      }
    }

    // Calculate land rent (year) - Harper data
    var rentData = this.getRentForPeriod(periodId);
    if (rentData && coins.denarii && coins.denarii > 0) {
      var rentQuantity = (coins.denarii * 4) / rentData.avgRent;
      purchases.push({
        id: 'land',
        name_zh: '土地年租',
        name_en: 'Land Rent (year)',
        icon: 'land',
        quantity: rentQuantity,
        unit: 'arourai',
        unit_zh: '阿鲁拉',
        description: '1 able = 0.27 hectares',
        description_zh: '约0.27公顷',
        price: rentData.avgRent.toFixed(0) + ' drachmai/aroura/year'
      });
      
      for (var i = 0; i < rentData.sources.length; i++) {
        var s = rentData.sources[i];
        sources.push({
          type: 'rent',
          source: s.source,
          year: s.year,
          nome: s.nome,
          value: s.rent_dr_ar,
          unit: 'dr/ar'
        });
      }
    } else if (coins.solidus && coins.solidus > 0) {
      var solidusRent = this.getSolidusRentForPeriod(periodId);
      if (solidusRent) {
        var rentQuantity = coins.solidus / solidusRent.avgRent;
        purchases.push({
          id: 'land',
          name_zh: '土地年租',
          name_en: 'Land Rent (year)',
          icon: 'land',
          quantity: rentQuantity,
          unit: 'arourai',
          unit_zh: '阿鲁拉',
          description: '1 able = 0.27 hectares',
          description_zh: '约0.27公顷',
          price: solidusRent.avgRent.toFixed(2) + ' solidi/aroura/year'
        });

        for (var i = 0; i < solidusRent.sources.length; i++) {
          var s = solidusRent.sources[i];
          sources.push({
            type: 'rent',
            source: s.source,
            year: s.year,
            nome: s.nome,
            value: s.rent_sol_ar,
            unit: 'sol/ar'
          });
        }
      }
    }

    return { purchases: purchases, sources: sources };
  },

  /**
   * Get rent data for a period (cash rents in drachmai)
   */
  getRentForPeriod: function(periodId) {
    var rents = HARPER_DATA.rents.cash.filter(function(r) { return r.period === periodId; });
    if (rents.length === 0) return null;
    
    var sum = 0;
    for (var i = 0; i < rents.length; i++) {
      sum += rents[i].rent_dr_ar;
    }
    var avgRent = sum / rents.length;
    return { avgRent: avgRent, sources: rents.slice(0, 3) };
  },

  /**
   * Get solidus-based rent for late periods
   */
  getSolidusRentForPeriod: function(periodId) {
    var rents = HARPER_DATA.rents.solidi.filter(function(r) { return r.period === periodId; });
    if (rents.length === 0) return null;
    
    var sum = 0;
    for (var i = 0; i < rents.length; i++) {
      sum += rents[i].rent_sol_ar;
    }
    var avgRent = sum / rents.length;
    return { avgRent: avgRent, sources: rents };
  },

  /**
   * Get wages for period with sources
   */
  getWagesForPeriod: function(periodId) {
    var dailyWages = HARPER_DATA.wages.daily.filter(function(w) { return w.period === periodId; });
    var yearlyWages = HARPER_DATA.wages.yearly.filter(function(w) { return w.period === periodId; });
    return { daily: dailyWages, yearly: yearlyWages };
  },

  /**
   * Determine social status based on wealth
   */
  determineSocialStatus: function(coins, periodId, lang) {
    lang = lang || 'zh';
    var period = this.getPeriod(periodId);
    var wealthLevel = 0;
    var comparisons = [];

    // Get wages for comparison
    var wages = this.getWagesForPeriod(periodId);
    var self = this;

    if (periodId === 'late_roman' || periodId === 'byzantine_early') {
      // Solidus-based economy
      var solidi = coins.solidus || 0;

      // Compare to annual wages
      for (var i = 0; i < wages.yearly.length; i++) {
        var w = wages.yearly[i];
        var yearsOfWages = solidi / w.amount;
        comparisons.push({
          occupation: w.occupation,
          occupation_zh: self.translateOccupation(w.occupation),
          value: yearsOfWages,
          unit: lang === 'zh' ? '年工资' : 'years wage',
          source: w.source
        });
      }

      // Determine wealth level
      if (solidi >= 100) wealthLevel = 5; // Wealthy landowner
      else if (solidi >= 20) wealthLevel = 4; // Comfortable
      else if (solidi >= 5) wealthLevel = 3; // Skilled worker
      else if (solidi >= 1) wealthLevel = 2; // Day laborer
      else wealthLevel = 1; // Poor

    } else {
      // Denarii-based economy
      var denarii = coins.denarii || 0;
      
      // Convert daily wages to annual (assume 250 working days)
      for (var i = 0; i < wages.daily.length; i++) {
        var w = wages.daily[i];
        var dailyDenarii = 0;
        if (w.unit === 'obols') {
          dailyDenarii = w.amount / 6; // 6 obols = 1 drachma
        } else if (w.unit === 'denarii') {
          dailyDenarii = w.amount;
        }
        var annualWage = dailyDenarii * 250;
        var yearsOfWages = (denarii * 4) / annualWage;
        
        comparisons.push({
          occupation: w.occupation,
          occupation_zh: self.translateOccupation(w.occupation),
          value: yearsOfWages,
          unit: lang === 'zh' ? '年工资' : 'years wage',
          source: w.source
        });
      }

      // Determine wealth level
      if (denarii >= 5000) wealthLevel = 5;
      else if (denarii >= 1000) wealthLevel = 4;
      else if (denarii >= 200) wealthLevel = 3;
      else if (denarii >= 50) wealthLevel = 2;
      else wealthLevel = 1;
    }

    // Sort comparisons by value
    comparisons.sort(function(a, b) { return b.value - a.value; });

    // Get status info
    var statusInfo = this.getStatusInfo(wealthLevel, lang);

    return {
      level: wealthLevel,
      title: statusInfo.title,
      description: statusInfo.description,
      icon: statusInfo.icon,
      comparisons: comparisons.slice(0, 5) // Top 5 comparisons
    };
  },

  /**
   * Translate occupation names
   */
  translateOccupation: function(occupation) {
    var translations = {
      'unskilled farm labor': '农业散工',
      'irrigation': '灌溉工人',
      'workers': '普通工人',
      'harvest': '收割工人',
      'misc farm work': '农活杂工',
      'farm work': '农业劳动',
      'transport': '运输工人',
      'construction': '建筑工人',
      'rug weaving': '织毯工',
      'police officer': '治安官',
      'farm supervisor': '农场监工',
      'cook': '厨师',
      'workman': '普通工人',
      'bath service': '浴场服务',
      'goldsmith helper': '金匠助手',
      'irrigation work': '灌溉工作',
      'chief helper': '地方主管',
      'estate paramilitary': '庄园护卫',
      'carpentry': '木匠'
    };
    return translations[occupation] || occupation;
  },

  /**
   * Get status information
   */
  getStatusInfo: function(level, lang) {
    var statuses = {
      1: {
        title_zh: '贫民',
        title_en: 'Pauper',
        desc_zh: '勉强维持生存,可能需要依靠救济。这是罗马社会最底层的生活。',
        desc_en: 'Barely surviving, may need charity. This is life at the bottom of Roman society.',
        icon: 'poor'
      },
      2: {
        title_zh: '底层劳工',
        title_en: 'Day Laborer',
        desc_zh: '能养活自己,但没有积蓄。一天不工作就没饭吃。',
        desc_en: 'Can feed yourself but no savings. One day without work means one day without food.',
        icon: 'laborer'
      },
      3: {
        title_zh: '工匠阶层',
        title_en: 'Artisan Class',
        desc_zh: '有稳定收入,能维持体面生活。可能有小房产或作坊。',
        desc_en: 'Stable income, decent living. May own a small property or workshop.',
        icon: 'worker'
      },
      4: {
        title_zh: '中产阶级',
        title_en: 'Middle Class',
        desc_zh: '生活舒适,有余钱享受生活。可能拥有土地或生意。',
        desc_en: 'Comfortable life with money to spare. May own land or a business.',
        icon: 'comfortable'
      },
      5: {
        title_zh: '富裕阶层',
        title_en: 'Wealthy Elite',
        desc_zh: '属于地方精英阶层。拥有大量财产,可能参与地方政治。',
        desc_en: 'Local elite. Owns substantial property, may participate in local politics.',
        icon: 'wealthy'
      }
    };

    var status = statuses[level] || statuses[1];
    return {
      title: lang === 'zh' ? status.title_zh : status.title_en,
      description: lang === 'zh' ? status.desc_zh : status.desc_en,
      icon: status.icon
    };
  },

  /**
   * Format number with locale
   */
  formatNumber: function(num, decimals) {
    decimals = decimals || 2;
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  },

  /**
   * Full calculation
   */
  calculate: function(input, periodId, lang) {
    lang = lang || 'zh';
    var gold_g = 0;
    var silver_g = 0;

    if (input.type === 'currency') {
      var metal = this.currencyToMetal(input.amount, input.currency);
      gold_g = metal.gold_g;
      silver_g = metal.silver_g;
    } else {
      gold_g = input.gold || 0;
      silver_g = input.silver || 0;
    }

    var coins = this.calculateCoins(gold_g, silver_g, periodId);
    var purchasing = this.calculatePurchasingPower(coins, periodId);
    var status = this.determineSocialStatus(coins, periodId, lang);

    return {
      input: {
        type: input.type,
        gold_g: gold_g,
        silver_g: silver_g,
        original: input
      },
      period: this.getPeriod(periodId),
      coins: coins,
      purchases: purchasing.purchases,
      sources: purchasing.sources,
      status: status
    };
  }
};
