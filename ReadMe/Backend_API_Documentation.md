# Backend Documentation: Financial Insights API

This backend serves AI-powered insights, key metrics, and annotated events for John Keells Holdings' financial reports (2019–2024). It uses Flask, Pandas, ARIMA forecasting, and OpenRouter-based event annotation.

---

## Technologies Used

- **Framework**: Flask
- **Data**: JSON, CSV
- **Libraries**: pandas, statsmodels, KeyBERT, SentenceTransformers, flask_cors
- **Model**: ARIMA (forecasting), DeepSeek-R1 (OpenRouter for event extraction)

---

## File Structure

```
/app.py                    # Main Flask application
/data/
  - formatted_financial_data.json
  - event_annotations.json
  - shareholders.json
  - combined_quarterly_ebitda.json
/generate_ml_insight.py   # AI-driven insight generator
/extract_keywords.py      # Keyword extractor using KeyBERT
```

---

## Endpoints

### `/api/all-metrics`

Returns all available metrics from `formatted_financial_data.json`.

### `/api/revenue`

Returns yearly revenue.

### `/api/net-profit`

Returns yearly net profit.

### `/api/eps`

Returns both basic and diluted EPS per year.

### `/api/gross-profit`

Returns gross profit over the years.

### `/api/cost-of-sales`

Returns cost of sales over the years.

### `/api/ai-insight/<year>?charts=<ChartName>`

Generates ML-driven insights for a selected year and optional selected charts.

- **Methods**: GET
- **Query Param**: `charts` (e.g., Revenue, EPS)

### `/api/events/<year>`

Returns major annotated economic or company-specific events from report text.

### `/api/event-keywords`

Returns top 5 keywords extracted by KeyBERT per year from annotated events.

### `/api/top-shareholders`

Returns structured shareholder data (2019–2024).

### `/api/quarterly-ebitda`

Returns quarterly EBITDA + YoY % growth across all sectors and years.

---

## AI Insight Generation: `generate_ml_insight.py`

- **Comparison**: Current vs Previous year % difference
- **Event Matching**: Finds keywords in annotated events relevant to each metric
- **Forecasting**: ARIMA predictions for the following year

---

## Keyword Extraction: `extract_keywords_by_year()`

Uses `KeyBERT` with SentenceTransformers to extract keywords from annual event summaries.

---

## Example Insight Output

```json
[
  "Total Revenue increased by 15.21% in 2022 compared to 2021. Reason: Revenue growth due to recovery in tourism sector.",
  "Forecast for Total Revenue in 2023: ARIMA = 145302.18"
]
```

---

## Run the Server

```bash
python app.py
```

Make sure you have installed all dependencies using:

```bash
pip install -r requirements.txt
```
