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

