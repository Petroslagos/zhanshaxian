/**
 * Roman Egypt Economic Calculator
 * Converts modern currency to ancient Roman coins and calculates purchasing power
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
  currencyToMetal(amount, currency) {
    let usd = amount;
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
  getPeriod(periodId) {
    return HARPER_DATA.time_periods.find(p => p.id === periodId);
  },

  /**
   * Calculate Roman coins from metal weight
   */
  calculateCoins(gold_g, silver_g, period) {
    const periodData = this.getPeriod(period);
    const coins = {};

    if (period === 'late_roman' || period === 'byzantine_early') {
      // Gold solidus era
      const solidus_g = periodData.gold_content_solidus_g || 4.5;
      coins.solidus = gold_g / solidus_g;
      coins.tremissis = coins.solidus * 3;
      coins.siliqua = silver_g / 2.0;
      coins.primaryCoin = 'solidus';
      coins.primaryAmount = coins.solidus;
    } else if (period === 'tetrarchy_constantine') {
      // Transition period
      const solidus_g = periodData.gold_content_solidus_g || 4.5;
      coins.solidus = gold_g / solidus_g;
      coins.follis = (silver_g / 3.0) + (gold_g * 10);
      coins.primaryCoin = 'solidus';
      coins.primaryAmount = coins.solidus;
    } else {
      // Silver denarius era
      const aureus_g = periodData.gold_content_aureus_g || 7.0;
      const denarius_g = periodData.silver_content_denarius_g || 3.0;
      
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
  getWheatPricesForPeriod(periodId) {
    const allPrices = [
      ...HARPER_DATA.wheat_prices["1_3c"],
      ...HARPER_DATA.wheat_prices["4c"],
      ...HARPER_DATA.wheat_prices["5_7c"]
    ];
    
    return allPrices.filter(p => p.period === periodId);
  },

  /**
   * Get average wheat price for a period
   */
  getAverageWheatPrice(periodId) {
    const prices = this.getWheatPricesForPeriod(periodId);
    if (prices.length === 0) return null;

    const period = this.getPeriod(periodId);
    
    if (periodId === 'late_roman' || periodId === 'byzantine_early') {
      // Art per solidus
      const avgArtPerSol = prices.reduce((sum, p) => sum + (p.art_per_sol || 10), 0) / prices.length;
      return { type: 'solidus', value: avgArtPerSol, unit: 'art/sol' };
    } else if (periodId === 'tetrarchy_constantine') {
      // Denarii per artaba (hyperinflation)
      const avgDenArt = prices.reduce((sum, p) => sum + (p.price_den_art || 1000), 0) / prices.length;
      return { type: 'denarii', value: avgDenArt, unit: 'den/art' };
    } else {
      // Drachmai per artaba
      const avgDrArt = prices.reduce((sum, p) => sum + (p.price_dr_art || 10), 0) / prices.length;
      return { type: 'drachmai', value: avgDrArt, unit: 'dr/art' };
    }
  },

  /**
   * Calculate purchasing power
   */
  calculatePurchasingPower(coins, periodId) {
    const period = this.getPeriod(periodId);
    const purchases = [];
    const sources = [];

    // Get wheat prices
    const wheatPrices = this.getWheatPricesForPeriod(periodId);
    const avgWheat = this.getAverageWheatPrice(periodId);

    // Calculate wheat artabas
    if (avgWheat) {
      let wheatQuantity = 0;
      let priceDisplay = '';

      if (avgWheat.type === 'solidus') {
        wheatQuantity = coins.solidus * avgWheat.value;
        priceDisplay = `1 solidus = ${avgWheat.value.toFixed(1)} artabas`;
      } else if (avgWheat.type === 'denarii') {
        wheatQuantity = (coins.denarii || coins.solidus * 1000) / avgWheat.value;
        priceDisplay = `${this.formatNumber(avgWheat.value)} denarii/artaba`;
      } else {
        wheatQuantity = coins.denarii / avgWheat.value;
        priceDisplay = `${avgWheat.value.toFixed(1)} drachmai/artaba`;
      }

      purchases.push({
        id: 'wheat',
        name_zh: '小麦',
        name_en: 'Wheat',
        icon: 'wheat',
        quantity: wheatQuantity,
        unit: 'artabas',
        unit_zh: '阿塔巴(约40升)',
        description: '约40升/个，够一人吃一个月',
        price: priceDisplay
      });

      // Add sources
      wheatPrices.slice(0, 5).forEach(p => {
        sources.push({
          type: 'wheat',
          source: p.source,
          year: p.year,
          nome: p.nome,
          value: p.price_dr_art || p.price_den_art || p.art_per_sol,
          unit: p.price_dr_art ? 'dr/art' : (p.price_den_art ? 'den/art' : 'art/sol')
        });
      });
    }

    // Calculate wine (estimate: 1 keramion = ~8 drachmai in early period)
    if (coins.denarii && coins.denarii > 0) {
      const winePrice = period.avg_wheat_price_dr_art ? period.avg_wheat_price_dr_art * 1.2 : 8;
      const wineQuantity = coins.denarii / winePrice;
      purchases.push({
        id: 'wine',
        name_zh: '葡萄酒',
        name_en: 'Wine',
        icon: 'wine',
        quantity: wineQuantity,
        unit: 'keramia',
        unit_zh: '陶罐(约40升)',
        price: `${winePrice.toFixed(1)} drachmai/keramion`
      });
    } else if (coins.solidus && coins.solidus > 0) {
      // Late period wine estimate
      const wineQuantity = coins.solidus * 5; // Roughly 5 keramia per solidus
      purchases.push({
        id: 'wine',
        name_zh: '葡萄酒',
        name_en: 'Wine',
        icon: 'wine',
        quantity: wineQuantity,
        unit: 'keramia',
        unit_zh: '陶罐(约40升)',
        price: '~0.2 solidi/keramion'
      });
    }

    // Calculate olive oil
    if (coins.denarii && coins.denarii > 0) {
      const oilObols = 2; // 2 obols per kotyle
      const oilDrachmai = oilObols / 6; // 6 obols = 1 drachma
      const oilQuantity = coins.denarii / oilDrachmai;
      purchases.push({
        id: 'oil',
        name_zh: '橄榄油',
        name_en: 'Olive Oil',
        icon: 'oil',
        quantity: oilQuantity,
        unit: 'kotylai',
        unit_zh: '科提拉(0.27L)',
        price: '2 obols/kotyle'
      });
    }

    // Calculate tunic (basic clothing)
    if (coins.denarii && coins.denarii > 0) {
      const tunicPrice = 20; // ~20 drachmai
      const tunicQuantity = coins.denarii / tunicPrice;
      purchases.push({
        id: 'tunic',
        name_zh: '普通衣服',
        name_en: 'Tunic',
        icon: 'tunic',
        quantity: tunicQuantity,
        unit: 'pieces',
        unit_zh: '件',
        price: '~20 drachmai/piece'
      });
    } else if (coins.solidus && coins.solidus > 0) {
      const tunicQuantity = coins.solidus * 2; // ~0.5 solidus per tunic
      purchases.push({
        id: 'tunic',
        name_zh: '普通衣服',
        name_en: 'Tunic',
        icon: 'tunic',
        quantity: tunicQuantity,
        unit: 'pieces',
        unit_zh: '件',
        price: '~0.5 solidi/piece'
      });
    }

    // Calculate donkey
    if (coins.denarii && coins.denarii > 0) {
      const donkeyPrice = 200;
      const donkeyQuantity = coins.denarii / donkeyPrice;
      purchases.push({
        id: 'donkey',
        name_zh: '驴',
        name_en: 'Donkey',
        icon: 'donkey',
        quantity: donkeyQuantity,
        unit: 'heads',
        unit_zh: '头',
        price: '~200 drachmai/head'
      });
    } else if (coins.solidus && coins.solidus > 0) {
      const donkeyQuantity = coins.solidus / 3; // ~3 solidi per donkey
      purchases.push({
        id: 'donkey',
        name_zh: '驴',
        name_en: 'Donkey',
        icon: 'donkey',
        quantity: donkeyQuantity,
        unit: 'heads',
        unit_zh: '头',
        price: '~3 solidi/head'
      });
    }

    // Calculate land rent (year)
    const rentData = this.getRentForPeriod(periodId);
    if (rentData && coins.denarii && coins.denarii > 0) {
      const rentQuantity = coins.denarii / rentData.avgRent;
      purchases.push({
        id: 'land',
        name_zh: '土地年租',
        name_en: 'Land Rent (year)',
        icon: 'land',
        quantity: rentQuantity,
        unit: 'arourai',
        unit_zh: '阿鲁拉(0.27公顷)',
        price: `${rentData.avgRent.toFixed(0)} drachmai/aroura/year`
      });
      
      rentData.sources.forEach(s => {
        sources.push({
          type: 'rent',
          source: s.source,
          year: s.year,
          nome: s.nome,
          value: s.rent_dr_ar,
          unit: 'dr/ar'
        });
      });
    } else if (rentData && coins.solidus && coins.solidus > 0) {
      const solidusRent = this.getSolidusRentForPeriod(periodId);
      if (solidusRent) {
        const rentQuantity = coins.solidus / solidusRent.avgRent;
        purchases.push({
          id: 'land',
          name_zh: '土地年租',
          name_en: 'Land Rent (year)',
          icon: 'land',
          quantity: rentQuantity,
          unit: 'arourai',
          unit_zh: '阿鲁拉(0.27公顷)',
          price: `${solidusRent.avgRent.toFixed(2)} solidi/aroura/year`
        });

        solidusRent.sources.forEach(s => {
          sources.push({
            type: 'rent',
            source: s.source,
            year: s.year,
            nome: s.nome,
            value: s.rent_sol_ar,
            unit: 'sol/ar'
          });
        });
      }
    }

    return { purchases, sources };
  },

  /**
   * Get rent data for a period
   */
  getRentForPeriod(periodId) {
    const rents = HARPER_DATA.rents.cash.filter(r => r.period === periodId);
    if (rents.length === 0) return null;
    
    const avgRent = rents.reduce((sum, r) => sum + r.rent_dr_ar, 0) / rents.length;
    return { avgRent, sources: rents.slice(0, 3) };
  },

  /**
   * Get solidus-based rent for late periods
   */
  getSolidusRentForPeriod(periodId) {
    const rents = HARPER_DATA.rents.solidi.filter(r => r.period === periodId);
    if (rents.length === 0) return null;
    
    const avgRent = rents.reduce((sum, r) => sum + r.rent_sol_ar, 0) / rents.length;
    return { avgRent, sources: rents };
  },

  /**
   * Get wages for period with sources
   */
  getWagesForPeriod(periodId) {
    const dailyWages = HARPER_DATA.wages.daily.filter(w => w.period === periodId);
    const yearlyWages = HARPER_DATA.wages.yearly.filter(w => w.period === periodId);
    return { daily: dailyWages, yearly: yearlyWages };
  },

  /**
   * Determine social status based on wealth
   */
  determineSocialStatus(coins, periodId, lang = 'zh') {
    const period = this.getPeriod(periodId);
    let wealthLevel = 0;
    let comparisons = [];

    // Get wages for comparison
    const wages = this.getWagesForPeriod(periodId);

    if (periodId === 'late_roman' || periodId === 'byzantine_early') {
      // Solidus-based economy
      const solidi = coins.solidus || 0;

      // Compare to annual wages
      wages.yearly.forEach(w => {
        const yearsOfWages = solidi / w.amount;
        comparisons.push({
          occupation: w.occupation,
          occupation_zh: this.translateOccupation(w.occupation),
          value: yearsOfWages,
          unit: lang === 'zh' ? '年工资' : 'years wage',
          source: w.source
        });
      });

      // Determine wealth level
      if (solidi >= 100) wealthLevel = 5; // Wealthy landowner
      else if (solidi >= 20) wealthLevel = 4; // Comfortable
      else if (solidi >= 5) wealthLevel = 3; // Skilled worker
      else if (solidi >= 1) wealthLevel = 2; // Day laborer
      else wealthLevel = 1; // Poor

    } else {
      // Denarii-based economy
      const denarii = coins.denarii || 0;
      
      // Convert daily wages to annual (assume 250 working days)
      wages.daily.forEach(w => {
        let dailyDenarii = 0;
        if (w.unit === 'obols') {
          dailyDenarii = w.amount / 6; // 6 obols = 1 drachma
        } else if (w.unit === 'denarii') {
          dailyDenarii = w.amount;
        }
        const annualWage = dailyDenarii * 250;
        const yearsOfWages = denarii / annualWage;
        
        comparisons.push({
          occupation: w.occupation,
          occupation_zh: this.translateOccupation(w.occupation),
          value: yearsOfWages,
          unit: lang === 'zh' ? '年工资' : 'years wage',
          source: w.source
        });
      });

      // Determine wealth level
      if (denarii >= 5000) wealthLevel = 5;
      else if (denarii >= 1000) wealthLevel = 4;
      else if (denarii >= 200) wealthLevel = 3;
      else if (denarii >= 50) wealthLevel = 2;
      else wealthLevel = 1;
    }

    // Sort comparisons by value
    comparisons.sort((a, b) => b.value - a.value);

    // Get status info
    const statusInfo = this.getStatusInfo(wealthLevel, lang);

    return {
      level: wealthLevel,
      ...statusInfo,
      comparisons: comparisons.slice(0, 5) // Top 5 comparisons
    };
  },

  /**
   * Translate occupation names
   */
  translateOccupation(occupation) {
    const translations = {
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
  getStatusInfo(level, lang) {
    const statuses = {
      1: {
        title_zh: '贫民',
        title_en: 'Pauper',
        desc_zh: '勉强维持生存，可能需要依靠救济。这是罗马社会最底层的生活。',
        desc_en: 'Barely surviving, may need charity. This is life at the bottom of Roman society.',
        icon: 'poor'
      },
      2: {
        title_zh: '底层劳工',
        title_en: 'Day Laborer',
        desc_zh: '能养活自己，但没有积蓄。一天不工作就没饭吃。',
        desc_en: 'Can feed yourself but no savings. One day without work means one day without food.',
        icon: 'laborer'
      },
      3: {
        title_zh: '工匠阶层',
        title_en: 'Artisan Class',
        desc_zh: '有稳定收入，能维持体面生活。可能有小房产或作坊。',
        desc_en: 'Stable income, decent living. May own a small property or workshop.',
        icon: 'worker'
      },
      4: {
        title_zh: '中产阶级（该阶层是否存在有争议）',
        title_en: 'Middle Class',
        desc_zh: '生活舒适，有余钱享受生活。可能拥有土地或生意。',
        desc_en: 'Comfortable life with money to spare. May own land or a business.',
        icon: 'comfortable'
      },
      5: {
        title_zh: '富裕阶层',
        title_en: 'Wealthy Elite',
        desc_zh: '属于地方精英阶层。拥有大量财产，可能参与地方政治。',
        desc_en: 'Local elite. Owns substantial property, may participate in local politics.',
        icon: 'wealthy'
      }
    };

    const status = statuses[level] || statuses[1];
    return {
      title: lang === 'zh' ? status.title_zh : status.title_en,
      description: lang === 'zh' ? status.desc_zh : status.desc_en,
      icon: status.icon
    };
  },

  /**
   * Format number with locale
   */
  formatNumber(num, decimals = 2) {
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
  calculate(input, periodId, lang = 'zh') {
    let gold_g = 0;
    let silver_g = 0;

    if (input.type === 'currency') {
      const metal = this.currencyToMetal(input.amount, input.currency);
      gold_g = metal.gold_g;
      silver_g = metal.silver_g;
    } else {
      gold_g = input.gold || 0;
      silver_g = input.silver || 0;
    }

    const coins = this.calculateCoins(gold_g, silver_g, periodId);
    const purchasing = this.calculatePurchasingPower(coins, periodId);
    const status = this.determineSocialStatus(coins, periodId, lang);

    return {
      input: {
        type: input.type,
        gold_g,
        silver_g,
        original: input
      },
      period: this.getPeriod(periodId),
      coins,
      purchases: purchasing.purchases,
      sources: purchasing.sources,
      status
    };
  }
};
