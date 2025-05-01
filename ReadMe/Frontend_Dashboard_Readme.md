# John Keells Financial Dashboard – Frontend (React)

This is the React.js frontend for the AI-powered financial analytics dashboard built using annual reports from John Keells Holdings PLC (2019–2024). It visualizes key financial metrics, sector-wise quarterly performance, and AI-generated insights with advanced charting and export features.

---

## Tech Stack

- React.js (CRA)
- Chart.js + react-chartjs-2
- chartjs-plugin-annotation
- Axios for API integration
- Flet + Flask (Backend)
- CSS Modules for styling
- jspdf / html2canvas for PDF export

---

## Features

### Charts

**Annual & Quarterly data view**

Interactive visualizations:

- Revenue trend (Line)
- Net Profit, EPS, Net Assets
- Cost vs Operating Expenses (Bar)
- Gross Profit Margin (% Line)
- Total Equity (Donut)
- Top 20 Shareholders (Donut + Trend)
- Quarterly EBITDA charts (Line, Grouped Bar, Area, YoY%)

### AI Insights

- Bullet-point insights generated from ARIMA + LLM
- Keyword annotations shown on revenue line chart

### Filters & Controls

- Year selector (2019–2024)
- Grouping: Annual / Quarterly
- Chart multi-selector with “All” option
- Currency: LKR ↔ USD with live exchange rate
- Responsive dashboard layout

### Export Options

Export visible charts to:

- 📄 PDF
- 📊 CSV

---

## Project Structure

```
src/
├── App.js                       # Main app entry
├── components/
│   ├── charts/                  # All chart components
│   ├── insights/                # AIInsightsBox, KeyEventsBox
│   ├── layout/                  # Navbar, DashboardLayout
│   └── utils/exportUtils.js    # PDF/CSV export logic
├── styles/                     # Global & theme styles
```

---

## Installation

Make sure your backend is running on http://localhost:5000

```bash
# Install dependencies
npm install

# Start the frontend
npm start
```

---

## 📦 Required Packages

```bash
npm install react-chartjs-2 chart.js chartjs-plugin-annotation axios jspdf html2canvas
```

---

## 🖼 Available Charts

| Chart Title                | Component                         | Group     |
| -------------------------- | --------------------------------- | --------- |
| Revenue                    | RevenueLineChart.js               | Annual    |
| Net Profit                 | NetProfitChart.js                 | Annual    |
| EPS                        | EpsTrendChart.js                  | Annual    |
| Gross Profit Margin        | GrossProfitMarginChart.js         | Annual    |
| Cost vs Operating Expenses | CostVsExpenseChart.js             | Annual    |
| Net Assets Per Share       | NetAssetsChart.js                 | Annual    |
| Total Equity               | TotalEquityChart.js               | Annual    |
| Top Shareholders           | TopShareholdersChart.js           | Annual    |
| EBITDA (Line)              | QuarterlyEBITDALineChart.js       | Quarterly |
| EBITDA (Grouped Bar)       | QuarterlyGroupedEBITDABarChart.js | Quarterly |
| YoY Growth (%)             | QuarterlyYoYGrowthLineChart.js    | Quarterly |
| Cumulative EBITDA          | CumulativeEBITDAAreaChart.js      | Quarterly |

---

## Export Usage

In the Navbar:

- Select charts via the "Charts" dropdown
- Click Export as PDF or Export as CSV

The export function grabs only visible charts using `Chart.getChart(id)` and `html2canvas`.

---
