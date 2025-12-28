/**
 * Harper Database - Roman Egypt Economic Data
 * Source: Kyle Harper, DARMC Scholarly Data Series 2016-5
 * "Database of Prices, Wages, and Rents for Roman Egypt, 1-700 CE"
 * Original article: "People, Plagues, and Prices in the Roman World: JEH 76 (2016), 803-39"
 * 
 * This data powers the "千年穿越计算器" (Millennium Time Travel Calculator)
 */

const HARPER_DATA = {
  metadata: {
    source: "Kyle Harper, DARMC Scholarly Data Series 2016-5",
    citation: "Harper, K. 2016. Database of Prices, Wages, and Rents for Roman Egypt, 1-700 CE",
    original_article: "People, Plagues, and Prices in the Roman World: JEH 76 (2016), 803-39",
    app_name: "千年穿越计算器",
    app_name_en: "Millennium Time Travel Calculator"
  },

  // ============================================
  // HISTORICAL PERIODS (7 eras from 27 BCE - 641 CE)
  // ============================================
  time_periods: [
    {
      id: "julio_claudian",
      name_en: "Julio-Claudian Dynasty",
      name_zh: "儒略-克劳狄王朝",
      name_alt: "早期罗马帝国",
      start_year: 27,
      end_year: 68,
      currency_system: "silver_denarius",
      primary_coins: ["aureus", "denarius", "sestertius", "as"],
      description_en: "The golden age of the early Empire. Stable currency, prosperous Egypt.",
      description_zh: "帝国初期的黄金时代。货币稳定，埃及繁荣。这是《出埃及记》之后、耶稣时代的罗马。",
      historical_events: ["Augustus reforms", "Tiberius", "Caligula", "Claudius conquest of Britain", "Nero's Great Fire"],
      avg_wheat_price_dr_art: 7.0,
      avg_daily_wage_obols: 5.0,
      silver_content_denarius_g: 3.9,
      gold_content_aureus_g: 7.87,
      denarii_per_aureus: 25,
      icon: "🏛️",
      color: "#C9A227" // Imperial gold
    },
    {
      id: "flavian_antonine",
      name_en: "Flavian-Antonine Era",
      name_zh: "弗拉维-安敦尼时代",
      name_alt: "罗马盛世",
      start_year: 69,
      end_year: 192,
      currency_system: "silver_denarius",
      primary_coins: ["aureus", "denarius", "sestertius", "as"],
      description_en: "The Five Good Emperors. Peak of Roman prosperity and stability.",
      description_zh: "五贤帝时代。罗马繁荣与稳定的巅峰。图拉真征服达契亚，哈德良建长城，马可·奥勒留写《沉思录》。",
      historical_events: ["Colosseum built", "Trajan conquests", "Hadrian's Wall", "Marcus Aurelius", "Antonine Plague 165-180"],
      avg_wheat_price_dr_art: 8.0,
      avg_daily_wage_obols: 7.0,
      silver_content_denarius_g: 3.4,
      gold_content_aureus_g: 7.3,
      denarii_per_aureus: 25,
      icon: "⚔️",
      color: "#8B4513" // Saddle brown - legionary
    },
    {
      id: "severan",
      name_en: "Severan Dynasty",
      name_zh: "塞维鲁王朝",
      name_alt: "军人皇帝前期",
      start_year: 193,
      end_year: 235,
      currency_system: "silver_denarius_debased",
      primary_coins: ["aureus", "denarius", "sestertius"],
      description_en: "Military emperors. Currency debasement begins in earnest.",
      description_zh: "军人皇帝时代。货币贬值开始加速。卡拉卡拉大浴场建成，罗马公民权扩展到全帝国。",
      historical_events: ["Septimius Severus", "Caracalla's Edict 212", "Baths of Caracalla"],
      avg_wheat_price_dr_art: 16.0,
      avg_daily_wage_obols: 14.0,
      silver_content_denarius_g: 2.5,
      gold_content_aureus_g: 6.5,
      denarii_per_aureus: 25,
      icon: "🗡️",
      color: "#722F37" // Wine red - military
    },
    {
      id: "crisis_3c",
      name_en: "Crisis of the Third Century",
      name_zh: "三世纪危机",
      name_alt: "军营皇帝时代",
      start_year: 235,
      end_year: 284,
      currency_system: "antoninianus",
      primary_coins: ["aureus", "antoninianus", "denarius"],
      description_en: "50 years of chaos. Rapid inflation, barbarian invasions, plague.",
      description_zh: "五十年混乱。恶性通胀、蛮族入侵、瘟疫肆虐。皇帝如走马灯更换。银币几乎变成铜币。",
      historical_events: ["26 emperors in 50 years", "Plague of Cyprian", "Gallic Empire", "Palmyrene Empire"],
      avg_wheat_price_dr_art: 20.0,
      avg_daily_wage_obols: 28.0,
      silver_content_denarius_g: 1.5,
      gold_content_aureus_g: 5.5,
      denarii_per_aureus: 25,
      icon: "🔥",
      color: "#8B0000" // Dark red - crisis
    },
    {
      id: "tetrarchy_constantine",
      name_en: "Tetrarchy & Constantine",
      name_zh: "四帝共治与君士坦丁",
      name_alt: "晚期罗马帝国初期",
      start_year: 284,
      end_year: 363,
      currency_system: "solidus_transition",
      primary_coins: ["solidus", "follis", "nummus"],
      description_en: "Diocletian's reforms. Constantine's solidus. Hyperinflation then stabilization.",
      description_zh: "戴克里先改革。君士坦丁创立金索里杜斯。从恶性通胀到金本位稳定。基督教合法化。",
      historical_events: ["Diocletian's Price Edict 301", "Constantine I", "Edict of Milan 313", "Council of Nicaea 325", "Constantinople founded 330"],
      avg_wheat_price_den_art: 5000000,
      solidus_introduced: 309,
      silver_content_follis_g: 3.0,
      gold_content_solidus_g: 4.5,
      icon: "✝️",
      color: "#4B0082" // Indigo - transition
    },
    {
      id: "late_roman",
      name_en: "Late Roman Empire",
      name_zh: "晚期罗马帝国",
      name_alt: "拜占庭前期",
      start_year: 364,
      end_year: 476,
      currency_system: "solidus_gold",
      primary_coins: ["solidus", "tremissis", "siliqua", "nummus"],
      description_en: "Gold solidus standard. Western Empire falls. Eastern Empire continues.",
      description_zh: "金索里杜斯本位。西罗马帝国灭亡（476年），东罗马继续存在。日耳曼蛮族建立王国。",
      historical_events: ["Valentinian I", "Theodosius I", "Visigoths sack Rome 410", "Vandals sack Rome 455", "Romulus Augustulus deposed 476"],
      avg_wheat_art_per_sol: 10.0,
      gold_content_solidus_g: 4.5,
      icon: "👑",
      color: "#DAA520" // Goldenrod
    },
    {
      id: "byzantine_early",
      name_en: "Early Byzantine",
      name_zh: "拜占庭早期",
      name_alt: "查士丁尼时代",
      start_year: 476,
      end_year: 641,
      currency_system: "solidus_gold",
      primary_coins: ["solidus", "tremissis", "follis", "nummus"],
      description_en: "Justinian's reconquests. Hagia Sophia. Last era of Harper's Egyptian data.",
      description_zh: "查士丁尼大帝的光复战争。圣索菲亚大教堂建成。这是哈珀埃及数据的最后时代。",
      historical_events: ["Justinian I", "Nika Riots 532", "Hagia Sophia 537", "Plague of Justinian 541", "Arab conquest of Egypt 641"],
      avg_wheat_art_per_sol: 12.0,
      gold_content_solidus_g: 4.5,
      icon: "🕌",
      color: "#800080" // Purple - Byzantine
    }
  ],

  // ============================================
  // CURRENCY CONVERSION DATA
  // ============================================
  currency_data: {
    // Modern currency to precious metal conversion (approximate 2024 values)
    modern_to_metal: {
      gold_usd_per_gram: 65.0,
      silver_usd_per_gram: 0.8,
      bronze_usd_per_gram: 0.008,
      cny_per_usd: 7.2,
      eur_per_usd: 0.92
    },
    // Roman coin specifications
    roman_coins: {
      aureus_early: { gold_g: 7.87, value_denarii: 25 },
      aureus_late: { gold_g: 6.5, value_denarii: 25 },
      denarius_augustan: { silver_g: 3.9, value_sestertii: 4 },
      denarius_neronian: { silver_g: 3.4, value_sestertii: 4 },
      denarius_severan: { silver_g: 2.5, value_sestertii: 4 },
      denarius_crisis: { silver_g: 1.5, value_sestertii: 4 },
      sestertius: { brass_g: 25.0, value_asses: 4 },
      dupondius: { brass_g: 12.5, value_asses: 2 },
      as: { copper_g: 10.0, value_base: 1 },
      solidus: { gold_g: 4.5, value_base: 1, standard: "72_per_pound" },
      tremissis: { gold_g: 1.5, value_solidi: 0.333 },
      siliqua: { silver_g: 2.0, value_per_solidus: 24 },
      follis_early: { bronze_g: 10.0, silver_wash: true },
      nummus: { bronze_g: 3.0 }
    }
  },

  // ============================================
  // WHEAT PRICES (primary economic indicator)
  // ============================================
  wheat_prices: {
    // 1st-3rd Century: prices in drachmai per artaba
    "1_3c": [
      { year: 45, price_dr_art: 6.83, nome: "Arsinoites", source: "P. Mich. 2.127", period: "julio_claudian" },
      { year: 46, price_dr_art: 8.73, nome: "Arsinoites", source: "P. Mich. 2.123", period: "julio_claudian" },
      { year: 46.5, price_dr_art: 6.0, nome: "Arsinoites", source: "SB 20.14576.34", period: "julio_claudian" },
      { year: 78.5, price_dr_art: 10.67, nome: "Hermopolites", source: "SB 8.9699", period: "flavian_antonine" },
      { year: 100, price_dr_art: 5.0, nome: "Arsinoites", source: "P. Louvre 2.103", period: "flavian_antonine" },
      { year: 124, price_dr_art: 9.0, nome: "Hermopolites", source: "P. Sarap. 60.10", period: "flavian_antonine" },
      { year: 128, price_dr_art: 12.0, nome: "Hermopolites", source: "P. Sarap. 79b", period: "flavian_antonine" },
      { year: 138.5, price_dr_art: 5.6, nome: "Oxyrhynchites", source: "PSI 4.281", period: "flavian_antonine" },
      { year: 160, price_dr_art: 10.0, nome: "Arsinoites", source: "P. Berl. Leigh. 2.39", period: "flavian_antonine" },
      { year: 192, price_dr_art: 18.67, nome: "Arsinoites", source: "P. Cair. Goodsp. 30", period: "flavian_antonine" },
      { year: 216.5, price_dr_art: 20.0, nome: "Arsinoites", source: "P. Lund 4.11", period: "severan" },
      { year: 216, price_dr_art: 16.4, nome: "Arsinoites", source: "P. Louvre 1.51", period: "severan" },
      { year: 217.5, price_dr_art: 14.57, nome: "Arsinoites", source: "P. Louvre 1.54", period: "severan" },
      { year: 234, price_dr_art: 12.0, nome: "Arsinoites", source: "P. Laur. 1.11", period: "severan" },
      { year: 249, price_dr_art: 24.0, nome: "Arsinoites", source: "P. Flor. 1.9b", period: "crisis_3c" },
      { year: 250, price_dr_art: 20.0, nome: "Arsinoites", source: "P. Prag. Varcl. 2.2", period: "crisis_3c" },
      { year: 251, price_dr_art: 20.0, nome: "Arsinoites", source: "SB 20.14645", period: "crisis_3c" },
      { year: 252, price_dr_art: 24.0, nome: "Arsinoites", source: "P. Prag. Varcl. 2.4", period: "crisis_3c" },
      { year: 253, price_dr_art: 16.0, nome: "Arsinoites", source: "SB 20.14197", period: "crisis_3c" },
      { year: 255, price_dr_art: 16.0, nome: "Arsinoites", source: "BGU 1.14", period: "crisis_3c" },
      { year: 259, price_dr_art: 16.0, nome: "Arsinoites", source: "P. Prag. 3.236", period: "crisis_3c" },
      { year: 260, price_dr_art: 16.0, nome: "Oxyrhynchites", source: "P. Oxy. 49.3513", period: "crisis_3c" },
      { year: 263, price_dr_art: 12.0, nome: "Arsinoites", source: "P. Prag. 3.238", period: "crisis_3c" },
      { year: 270, price_dr_art: 24.0, nome: "Oxyrhynchites", source: "P. Erl. 101", period: "crisis_3c" },
      { year: 282.5, price_dr_art: 240.0, nome: "Oxyrhynchites", source: "P. Oxy. 75.5063", period: "crisis_3c" }
    ],
    // 4th Century: hyperinflation era - prices in denarii communes per artaba
    "4c": [
      { year: 301, price_den_art: 640, nome: "Hermopolites", source: "CPR 6.75", period: "tetrarchy_constantine" },
      { year: 304.5, price_den_art: 1200, nome: "Oxyrhynchites", source: "P. Oxy. 36.2798", period: "tetrarchy_constantine" },
      { year: 305, price_den_art: 852, nome: "Hermopolites", source: "SB 20.14657", period: "tetrarchy_constantine" },
      { year: 311, price_den_art: 1200, nome: "Arsinoites", source: "P. Cair. Isid. 11", period: "tetrarchy_constantine" },
      { year: 312.5, price_den_art: 2000, nome: "Arsinoites", source: "P. NYU 1.18", period: "tetrarchy_constantine" },
      { year: 314, price_den_art: 7000, nome: "Hermopolites", source: "CPR 8.22", period: "tetrarchy_constantine" },
      { year: 315, price_den_art: 3000, nome: "Arsinoites", source: "SB 5.7621", period: "tetrarchy_constantine" },
      { year: 327, price_den_art: 17333, nome: "Oxyrhynchites", source: "PSI 4.309", period: "tetrarchy_constantine" },
      { year: 335, price_den_art: 84000, nome: "Alexandria", source: "P. Lond. 6.1914", period: "tetrarchy_constantine" },
      { year: 338, price_den_art: 144000, nome: "Oxyrhynchites", source: "SB 16.12648", period: "tetrarchy_constantine" },
      { year: 340, price_den_art: 275000, nome: "Oxyrhynchites", source: "P. Oxy. 54.3773", period: "tetrarchy_constantine" },
      { year: 345, price_den_art: 300000, nome: "Arsinoites", source: "P. Abinn. 68", period: "tetrarchy_constantine" },
      { year: 352.5, price_den_art: 2004000, nome: "Middle Egypt", source: "P. Princ. 3.183", period: "tetrarchy_constantine" },
      { year: 357.5, price_den_art: 5076000, nome: "Middle Egypt", source: "P. Stras. 6.595", period: "tetrarchy_constantine" },
      { year: 359, price_den_art: 8202000, nome: "Oxyrhynchites", source: "P. Oxy. 51.3625", period: "tetrarchy_constantine" }
    ],
    // 5th-7th Century: gold standard - artabae per solidus
    "5_7c": [
      { year: 370, art_per_sol: 8.75, nome: "Dakhla Oasis", source: "P. Kellis 4.96", period: "late_roman" },
      { year: 375, art_per_sol: 11.2, nome: "Oxyrhynchites", source: "P.Col. 8.238", period: "late_roman" },
      { year: 423, art_per_sol: 11.5, nome: "various", source: "P. Oxy. 51.3628-3636", period: "late_roman" },
      { year: 445, art_per_sol: 8.62, nome: "Numidia/Mauretania", source: "Nov. Val. III 13.4", period: "late_roman" },
      { year: 450, art_per_sol: 10.0, nome: "Hermopolites", source: "Kl. Form. 769", period: "late_roman" },
      { year: 500, art_per_sol: 14.0, nome: "Hermopolites", source: "PSI 46", period: "byzantine_early" },
      { year: 504, art_per_sol: 4.5, nome: "Oxyrhynchites", source: "P. Oxy. 62.4349", period: "byzantine_early" },
      { year: 512.5, art_per_sol: 12.0, nome: "Hermopolites", source: "P. Baden 4.95", period: "byzantine_early" },
      { year: 538, art_per_sol: 8.0, nome: "Aphrodites", source: "P.Cair. Masp. 1.67062", period: "byzantine_early" },
      { year: 540, art_per_sol: 10.37, nome: "Antaiopolites", source: "P.Cair. Masp. 2.67229", period: "byzantine_early" },
      { year: 541, art_per_sol: 8.62, nome: "Antinoopolites", source: "P.Cair. Masp. 3.67320", period: "byzantine_early" },
      { year: 545, art_per_sol: 5.02, nome: "Aphrodites", source: "P.Cair. Masp. 2.67138", period: "byzantine_early" },
      { year: 550, art_per_sol: 10.0, nome: "Lycopolites", source: "P.Cair. Masp. 3.67289", period: "byzantine_early" },
      { year: 557, art_per_sol: 20.0, nome: "Oxyrhynchites", source: "P. Oxy. 16.1911", period: "byzantine_early" },
      { year: 566, art_per_sol: 14.0, nome: "Oxyrhynchites", source: "P. Oxy. 55.3805", period: "byzantine_early" },
      { year: 575, art_per_sol: 10.0, nome: "Oxyrhynchites", source: "P. Oxy. 16.1920", period: "byzantine_early" },
      { year: 587.5, art_per_sol: 10.0, nome: "Oxyrhynchites", source: "P. Oxy. 16.2024", period: "byzantine_early" },
      { year: 592, art_per_sol: 10.0, nome: "Oxyrhynchites", source: "P. Oxy. 16.1909", period: "byzantine_early" },
      { year: 609, art_per_sol: 28.8, nome: "Memphites", source: "CPR 10.1", period: "byzantine_early" },
      { year: 650, art_per_sol: 13.5, nome: "Hermopolites", source: "P. Lond. 5.1907", period: "byzantine_early" },
      { year: 650, art_per_sol: 15.0, nome: "Arsinoites", source: "CPR 4.86", period: "byzantine_early" }
    ]
  },

  // ============================================
  // WAGES DATA
  // ============================================
  wages: {
    daily: [
      { year: 78, occupation: "unskilled farm labor", amount: 3.42, unit: "obols", period: "flavian_antonine" },
      { year: 100, occupation: "irrigation", amount: 7, unit: "obols", period: "flavian_antonine" },
      { year: 104, occupation: "workers", amount: 6, unit: "obols", period: "flavian_antonine" },
      { year: 105, occupation: "harvest", amount: 6, unit: "obols", period: "flavian_antonine" },
      { year: 109.5, occupation: "unskilled farm labor", amount: 3.8, unit: "obols", period: "flavian_antonine" },
      { year: 128, occupation: "misc farm work", amount: 6, unit: "obols", period: "flavian_antonine" },
      { year: 150, occupation: "farm work", amount: 7, unit: "obols", period: "flavian_antonine" },
      { year: 155, occupation: "unskilled farm labor", amount: 6.02, unit: "obols", period: "flavian_antonine" },
      { year: 168, occupation: "unskilled farm labor", amount: 10.77, unit: "obols", period: "flavian_antonine" },
      { year: 175, occupation: "misc farm work", amount: 18, unit: "obols", period: "flavian_antonine" },
      { year: 240, occupation: "misc farm work", amount: 18.2, unit: "obols", period: "crisis_3c" },
      { year: 255, occupation: "unskilled farm labor", amount: 50, unit: "obols", period: "crisis_3c" },
      { year: 258.5, occupation: "unskilled farm labor", amount: 14, unit: "obols", period: "crisis_3c" },
      { year: 301, occupation: "transport", amount: 250, unit: "denarii", period: "tetrarchy_constantine" },
      { year: 314, occupation: "workers", amount: 500, unit: "denarii", period: "tetrarchy_constantine" },
      { year: 325, occupation: "transport", amount: 2000, unit: "denarii", period: "tetrarchy_constantine" },
      { year: 375, occupation: "construction", amount: 0.033, unit: "solidus", period: "late_roman" }
    ],
    yearly: [
      { year: 432, occupation: "rug weaving", amount: 3, unit: "solidi", period: "late_roman" },
      { year: 500, occupation: "police officer", amount: 3, unit: "solidi", period: "byzantine_early" },
      { year: 519, occupation: "farm supervisor", amount: 2, unit: "solidi", period: "byzantine_early" },
      { year: 550, occupation: "cook", amount: 2.4, unit: "solidi", period: "byzantine_early" },
      { year: 550, occupation: "workman", amount: 3, unit: "solidi", period: "byzantine_early" },
      { year: 550, occupation: "bath service", amount: 1.2, unit: "solidi", period: "byzantine_early" },
      { year: 588, occupation: "goldsmith helper", amount: 3, unit: "solidi", period: "byzantine_early" },
      { year: 593, occupation: "irrigation work", amount: 1, unit: "solidi", period: "byzantine_early" },
      { year: 600, occupation: "chief helper", amount: 2, unit: "solidi", period: "byzantine_early" },
      { year: 612, occupation: "estate paramilitary", amount: 4, unit: "solidi", period: "byzantine_early" },
      { year: 650, occupation: "carpentry", amount: 1.44, unit: "solidi", period: "byzantine_early" }
    ]
  },

  // ============================================
  // RENTS DATA
  // ============================================
  rents: {
    // Cash rents in drachmai per aroura
    cash: [
      { year: 14, rent_dr_ar: 12.5, nome: "Arsinoites", notes: "private vineyard", period: "julio_claudian" },
      { year: 42, rent_dr_ar: 20.0, nome: "Arsinoites", notes: "grain land", period: "julio_claudian" },
      { year: 45, rent_dr_ar: 40.0, nome: "Arsinoites", notes: "good land", period: "julio_claudian" },
      { year: 46, rent_dr_ar: 28.0, nome: "Arsinoites", period: "julio_claudian" },
      { year: 62, rent_dr_ar: 36.0, nome: "Arsinoites", period: "julio_claudian" },
      { year: 78, rent_dr_ar: 60.0, nome: "Hermopolites", notes: "Didymos estate", period: "flavian_antonine" },
      { year: 84, rent_dr_ar: 32.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 89, rent_dr_ar: 48.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 95, rent_dr_ar: 50.0, nome: "Oxyrhynchites", period: "flavian_antonine" },
      { year: 99, rent_dr_ar: 40.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 102, rent_dr_ar: 44.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 117, rent_dr_ar: 60.0, nome: "Hermopolites", period: "flavian_antonine" },
      { year: 120, rent_dr_ar: 64.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 134, rent_dr_ar: 48.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 138, rent_dr_ar: 52.0, nome: "Oxyrhynchites", period: "flavian_antonine" },
      { year: 150, rent_dr_ar: 60.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 155, rent_dr_ar: 56.0, nome: "Hermopolites", period: "flavian_antonine" },
      { year: 163, rent_dr_ar: 80.0, nome: "Arsinoites", notes: "high quality", period: "flavian_antonine" },
      { year: 175, rent_dr_ar: 100.0, nome: "Oxyrhynchites", period: "flavian_antonine" },
      { year: 185, rent_dr_ar: 72.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 197, rent_dr_ar: 120.0, nome: "Oxyrhynchites", period: "severan" },
      { year: 211, rent_dr_ar: 140.0, nome: "Hermopolites", period: "severan" },
      { year: 224, rent_dr_ar: 160.0, nome: "Oxyrhynchites", period: "severan" },
      { year: 248, rent_dr_ar: 200.0, nome: "Arsinoites", notes: "Appianus estate", period: "crisis_3c" },
      { year: 255, rent_dr_ar: 240.0, nome: "Arsinoites", notes: "Appianus estate", period: "crisis_3c" },
      { year: 260, rent_dr_ar: 320.0, nome: "Arsinoites", period: "crisis_3c" }
    ],
    // Rents in kind (artabae of wheat per aroura)
    kind: [
      { year: 10, rent_art_ar: 2.5, nome: "Arsinoites", period: "julio_claudian" },
      { year: 26, rent_art_ar: 3.0, nome: "Arsinoites", period: "julio_claudian" },
      { year: 42, rent_art_ar: 4.0, nome: "Arsinoites", period: "julio_claudian" },
      { year: 46, rent_art_ar: 3.5, nome: "Arsinoites", period: "julio_claudian" },
      { year: 78, rent_art_ar: 5.0, nome: "Hermopolites", period: "flavian_antonine" },
      { year: 86, rent_art_ar: 4.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 93, rent_art_ar: 5.5, nome: "Oxyrhynchites", period: "flavian_antonine" },
      { year: 100, rent_art_ar: 5.0, nome: "Hermopolites", period: "flavian_antonine" },
      { year: 110, rent_art_ar: 6.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 125, rent_art_ar: 5.0, nome: "Hermopolites", period: "flavian_antonine" },
      { year: 138, rent_art_ar: 6.5, nome: "Oxyrhynchites", period: "flavian_antonine" },
      { year: 150, rent_art_ar: 6.0, nome: "Tebtynis", period: "flavian_antonine" },
      { year: 165, rent_art_ar: 8.0, nome: "Arsinoites", period: "flavian_antonine" },
      { year: 180, rent_art_ar: 7.0, nome: "Oxyrhynchites", period: "flavian_antonine" },
      { year: 200, rent_art_ar: 8.0, nome: "Hermopolites", period: "severan" },
      { year: 220, rent_art_ar: 9.0, nome: "Oxyrhynchites", period: "severan" },
      { year: 248, rent_art_ar: 10.0, nome: "Arsinoites", period: "crisis_3c" },
      { year: 255, rent_art_ar: 10.0, nome: "Arsinoites", period: "crisis_3c" },
      { year: 338, rent_art_ar: 3.0, nome: "Hermonthis", period: "tetrarchy_constantine" },
      { year: 400, rent_art_ar: 5.0, nome: "various", period: "late_roman" },
      { year: 450, rent_art_ar: 6.0, nome: "Hermopolites", period: "late_roman" },
      { year: 500, rent_art_ar: 7.0, nome: "Oxyrhynchites", period: "byzantine_early" },
      { year: 550, rent_art_ar: 6.5, nome: "Aphrodites", period: "byzantine_early" },
      { year: 600, rent_art_ar: 5.5, nome: "Arsinoites", period: "byzantine_early" }
    ],
    // Late antique rents in solidi per aroura
    solidi: [
      { year: 375, rent_sol_ar: 0.25, nome: "Oxyrhynchites", period: "late_roman" },
      { year: 400, rent_sol_ar: 0.33, nome: "various", period: "late_roman" },
      { year: 450, rent_sol_ar: 0.5, nome: "Hermopolites", period: "late_roman" },
      { year: 500, rent_sol_ar: 0.4, nome: "Oxyrhynchites", period: "byzantine_early" },
      { year: 538, rent_sol_ar: 0.5, nome: "Aphrodites", period: "byzantine_early" },
      { year: 566, rent_sol_ar: 0.45, nome: "Oxyrhynchites", period: "byzantine_early" },
      { year: 600, rent_sol_ar: 0.5, nome: "Arsinoites", period: "byzantine_early" }
    ]
  },

  // ============================================
  // OCCUPATIONS (for comparison)
  // ============================================
  occupations: [
    { id: "farmer_tenant", name_zh: "佃农", name_en: "Tenant Farmer", desc_zh: "租种他人土地，缴纳实物或现金地租", social_class: "lower" },
    { id: "farm_laborer", name_zh: "农业雇工", name_en: "Farm Day Laborer", desc_zh: "按日计酬的农业工人", social_class: "lower" },
    { id: "craftsman", name_zh: "工匠", name_en: "Craftsman/Artisan", desc_zh: "木匠、铁匠、陶工、织工等", social_class: "middle_lower" },
    { id: "soldier_legionary", name_zh: "军团士兵", name_en: "Legionary Soldier", desc_zh: "罗马军团正规士兵", social_class: "middle" },
    { id: "estate_manager", name_zh: "庄园管家", name_en: "Estate Manager", desc_zh: "管理大庄园的专业人员", social_class: "middle" },
    { id: "scribe", name_zh: "书记员", name_en: "Scribe/Secretary", desc_zh: "专业文书工作者", social_class: "middle" },
    { id: "merchant", name_zh: "小商贩", name_en: "Small Merchant", desc_zh: "本地市场的商人", social_class: "middle" },
    { id: "landowner_small", name_zh: "自耕农/小地主", name_en: "Small Landowner", desc_zh: "拥有小块土地的农民", social_class: "middle" },
    { id: "priest", name_zh: "祭司/神父", name_en: "Temple/Church Priest", desc_zh: "宗教职业者", social_class: "middle_upper" },
    { id: "landowner_large", name_zh: "大地主", name_en: "Large Landowner", desc_zh: "拥有大量土地的富人", social_class: "upper" }
  ],

  // ============================================
  // PURCHASABLE ITEMS (for shopping comparison)
  // ============================================
  purchasable_items: [
    { id: "wheat_artaba", name_zh: "一阿塔巴小麦", name_en: "Artaba of Wheat", desc_zh: "约40升，够一个人吃一个月", category: "food" },
    { id: "bread_loaf", name_zh: "一块面包", name_en: "Loaf of Bread", desc_zh: "约1斤重的面包", category: "food", typical_price_obols: 0.5 },
    { id: "wine_keramion", name_zh: "一坛葡萄酒", name_en: "Keramion of Wine", desc_zh: "约40升普通葡萄酒", category: "food", typical_price_drachmai: 8 },
    { id: "olive_oil_kotyle", name_zh: "一升橄榄油", name_en: "Kotyle of Olive Oil", desc_zh: "约0.27升", category: "food", typical_price_obols: 2 },
    { id: "land_aroura", name_zh: "一亩地（阿鲁拉）", name_en: "One Aroura of Land", desc_zh: "约0.68英亩/0.27公顷", category: "property" },
    { id: "rent_annual", name_zh: "一年土地租金", name_en: "Annual Land Rent", desc_zh: "一亩地一年的租金", category: "rent" },
    { id: "tunic_basic", name_zh: "普通束腰外衣", name_en: "Basic Tunic", desc_zh: "工人穿的基本服装", category: "clothing", typical_price_drachmai: 20 },
    { id: "donkey", name_zh: "驴", name_en: "Donkey", desc_zh: "农用驮畜", category: "animal", typical_price_drachmai: 200 },
    { id: "slave_adult", name_zh: "成年奴隶", name_en: "Adult Slave", desc_zh: "普通劳动力", category: "slave", typical_price_drachmai: 500 }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HARPER_DATA;
}
