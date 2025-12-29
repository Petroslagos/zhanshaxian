# Roman Kill Line (罗马斩杀线)

A web application that converts modern currency to ancient Roman coins and calculates purchasing power in Roman Egypt (1st-7th century CE). All calculations are derived from documentary papyri preserved in the Egyptian desert.

## Data Source

All economic data comes from:

> Harper, K. 2016. "People, Plagues, and Prices in the Roman World: The Evidence from Egypt." *Journal of Economic History* 76, 803-839.

> DARMC Scholarly Data Series 2016-5: Database of Prices, Wages, and Rents for Roman Egypt, 1-700 CE.

The database includes wheat prices, daily and annual wages, and land rents from papyri spanning seven centuries.

## Features

- Currency conversion from CNY, USD, or EUR to ancient Roman coins
- Direct metal weight input (gold and silver in grams)
- Seven historical periods from Julio-Claudian to Early Byzantine
- Purchasing power calculation for multiple goods (wheat, wine, oil, clothing, livestock, land)
- Social status assessment with profession comparisons from the same period
- Full papyri source citations for all calculations
- Bilingual interface (Chinese and English)
- Shareable result cards with branding

## Project Structure

```
roman-kill-line/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── harper-data.js
│   ├── calculator.js
│   └── app.js
├── assets/
│   ├── icons/
│   └── images/
└── README.md
```

## Icon Files

The application loads icons from the assets/icons/ directory. Placeholder filenames are referenced throughout the code. Replace these files with custom graphics as needed:

### Period Icons
- period-julio-claudian.svg
- period-flavian-antonine.svg
- period-severan.svg
- period-crisis.svg
- period-constantine.svg
- period-late-roman.svg
- period-byzantine.svg

### Coin Icons
- coin-aureus.svg
- coin-denarius.svg
- coin-sestertius.svg
- coin-as.svg
- coin-solidus.svg
- coin-tremissis.svg
- coin-siliqua.svg

### Item Icons
- item-wheat.svg
- item-wine.svg
- item-oil.svg
- item-tunic.svg
- item-donkey.svg
- item-slave.svg
- item-land.svg

### Status Icons
- status-wealthy.svg
- status-comfortable.svg
- status-worker.svg
- status-laborer.svg
- status-poor.svg

### UI Icons
- logo-placeholder.svg
- hero-coins.svg
- arrow-left.svg
- arrow-right.svg
- input-currency.svg
- input-metal.svg
- gold.svg
- silver.svg
- papyrus.svg
- share.svg
- save.svg

Recommended specifications:
- Period icons: 96x96 viewBox, SVG format
- Coin icons: 64x64 viewBox, SVG format
- Item icons: 64x64 viewBox, SVG format
- Status icons: 128x128 viewBox, SVG format
- Logo: 72x72 viewBox, SVG format

All icons are SVG format for scalability. Replace with your own 8-bit style graphics using the same filenames (keep .svg extension, or change to .png and update the code).

If an icon file is missing, the application displays a text fallback.

## Deployment

### GitHub Pages

1. Create a GitHub repository
2. Upload all files maintaining the directory structure
3. Navigate to Settings, then Pages
4. Select the main branch as source
5. The site will be available at https://[username].github.io/[repository]/

### Gitee Pages (for China access)

1. Create a Gitee account (requires phone verification)
2. Import from GitHub or create a new repository
3. Navigate to Services, then Gitee Pages
4. Enable the service

## Technical Notes

The application is built with vanilla JavaScript and requires no build step. All dependencies are loaded from CDN when needed (html2canvas for image export).

Currency conversion uses current metal prices (gold at approximately $65/gram, silver at $0.80/gram) to calculate equivalent ancient coin quantities based on documented metal content.

Social status assessment compares user wealth against documented wages from the same historical period, providing context for what the input amount would mean for daily life in Roman Egypt.

## Branding

The application displays "古典乱炖" (Classical Hodgepodge) as the blog/brand title. The logo placeholder can be replaced with a custom logo file at assets/icons/logo-placeholder.png.

Share cards include the branding and are designed for social media distribution.

## License

MIT License. Data attribution to Kyle Harper and DARMC required.

## Citation

When referencing this application or its data:

Harper, Kyle. 2016. "People, Plagues, and Prices in the Roman World: The Evidence from Egypt." Journal of Economic History 76 (3): 803-839.

Harper, Kyle. 2016. Database of Prices, Wages, and Rents for Roman Egypt, 1-700 CE. DARMC Scholarly Data Series 2016-5. https://darmc.harvard.edu/
