# 千年穿越计算器 | Millennium Time Travel Calculator

[![Roman Egypt](https://img.shields.io/badge/Period-27%20BCE%20--%20641%20CE-gold)]()
[![Data Source](https://img.shields.io/badge/Data-Kyle%20Harper%20DARMC-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

A mobile-first H5 web application that lets users input modern currency and see what their money could buy in Roman Egypt (1st-7th century CE). Based on Kyle Harper's scholarly database of papyri economic data.

## 🏛️ Features

- **Modern Currency Input**: Convert CNY, USD, or EUR to ancient Roman coins
- **7 Historical Periods**: From Julio-Claudian dynasty (27 CE) to Early Byzantine (641 CE)
- **Purchasing Power Calculation**: See how much wheat, land, and labor your money could afford
- **Lifestyle Assessment**: Find out your social class if you time-traveled
- **Bilingual Support**: Chinese and English interface

## 📁 Project Structure

```
roman-egypt-calculator/
├── index.html              # Main application (single-page app)
├── css/
│   └── styles.css          # All styles with CSS variables for theming
├── js/
│   ├── harper-data.js      # Economic data from Harper's database
│   ├── calculator.js       # Core calculation engine
│   └── app.js              # UI interactions and navigation
├── assets/
│   ├── icons/              # [PLACEHOLDER] Icon assets
│   │   ├── logo.png
│   │   ├── coin-aureus.png
│   │   ├── coin-denarius.png
│   │   ├── coin-solidus.png
│   │   ├── period-*.png
│   │   └── nav-*.png
│   └── images/             # [PLACEHOLDER] Illustrations
│       ├── hero.png
│       ├── share-preview.png
│       └── backgrounds/
└── README.md
```

## 🎨 Adding Visual Assets

The code is structured to easily swap in custom graphics. Look for `[ASSET]` comments in the code.

### CSS Variables for Theming

Edit `css/styles.css` to customize colors:

```css
:root {
  --color-papyrus: #F5E6C8;     /* Main background */
  --color-gold: #C9A227;         /* Accent color */
  --color-ink: #2C1810;          /* Text color */
  /* ... more variables */
}
```

### Icon Placeholders

Replace emoji icons with pixel art by updating these selectors:

```css
/* Example: Coin icons */
.coin-icon {
  /* Currently using CSS gradient */
  /* Replace with: */
  background-image: url('../assets/icons/coin-aureus.png');
  background-size: contain;
}

/* Example: Period icons */
.period-icon {
  /* Replace emoji with custom art */
  background-image: url('../assets/icons/period-julio-claudian.png');
}
```

### Image Sizes Guide

| Asset Type | Recommended Size | Format |
|------------|-----------------|--------|
| Logo | 80×80px | PNG (transparent) |
| Coin icons | 64×64px or 128×128px | PNG (transparent) |
| Period icons | 96×96px | PNG (transparent) |
| Nav icons | 56×56px | PNG (transparent) |
| Hero illustration | 320×320px | PNG or SVG |
| Share preview | 1200×630px | PNG (WeChat/social) |
| Background texture | Tileable | PNG or CSS pattern |

## 🚀 Deployment

### Option 1: GitHub Pages (Recommended for global access)

1. Create a GitHub repository
2. Push all files
3. Go to Settings → Pages → Select "main" branch
4. Your site will be at `https://username.github.io/repo-name`

**For better China access**, add a custom domain:
- Register a `.cn` domain or use an existing domain
- Add CNAME record pointing to GitHub Pages
- Enable HTTPS in GitHub settings

### Option 2: Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Build command: (none - static files)
3. Output directory: `/`

### Option 3: Netlify

1. Drag and drop the project folder to Netlify
2. Or connect via Git for auto-deployment

### Option 4: Chinese Hosting (Best for mainland China)

For guaranteed China access:

- **Alibaba Cloud OSS** + CDN: ~¥5/month
- **Tencent Cloud COS** + CDN: ~¥5/month
- **21YunBox**: Enterprise solution (expensive but reliable)

Upload all files to object storage, enable static website hosting.

## 📊 Data Sources

All economic data is from:

> Harper, K. 2016. **Database of Prices, Wages, and Rents for Roman Egypt, 1-700 CE**
> DARMC Scholarly Data Series 2016-5
> 
> Original article: "People, Plagues, and Prices in the Roman World"
> *Journal of Economic History* 76 (2016), 803-39

### Data Categories

- **Wheat Prices**: 50+ data points across 3 currency regimes
- **Wages**: Daily and yearly wages for various occupations
- **Rents**: Cash rents, rents in kind, and solidus-era rents
- **Currency Specs**: Metal content of coins across periods

## 🔧 Customization Guide

### Adding New Periods

Edit `js/harper-data.js`:

```javascript
{
  id: "new_period",
  name_en: "New Period Name",
  name_zh: "新时期名称",
  start_year: 700,
  end_year: 800,
  // ... other properties
}
```

### Adjusting Currency Conversion Rates

Update modern metal prices in `currency_data.modern_to_metal`:

```javascript
modern_to_metal: {
  gold_usd_per_gram: 65.0,   // Update with current gold price
  silver_usd_per_gram: 0.8,  // Update with current silver price
  cny_per_usd: 7.2,          // Update exchange rate
  eur_per_usd: 0.92
}
```

### Adding New Languages

1. Add data attributes to HTML elements:
```html
<span data-lang-zh="中文" data-lang-en="English" data-lang-fr="Français">中文</span>
```

2. Update `App.updateLanguage()` to support new language codes

## 📱 WeChat Integration

### Embedding in WeChat Article

Use an iframe or link directly:
```html
<iframe src="https://your-domain.com/calculator/" width="100%" height="600"></iframe>
```

### WeChat Sharing

The page includes Open Graph meta tags. Add your share image:

```html
<meta property="og:image" content="https://your-domain.com/assets/images/share-preview.png">
```

## 🧪 Testing

Open `index.html` directly in a browser for development. No build step required!

For mobile testing:
1. Start a local server: `python -m http.server 8000`
2. Access via your phone on the same network

## 📝 License

MIT License. Data attribution to Kyle Harper and DARMC required.

## 🙏 Acknowledgments

- **Kyle Harper** - For the comprehensive Roman Egypt economic database
- **DARMC** (Digital Atlas of Roman and Medieval Civilizations) - Harvard's digital humanities initiative
- **Papyri.info** - For making Greek papyri accessible

---

Made with 🏛️ for understanding ancient economies

*"穿越千年，了解古人的经济生活"*
