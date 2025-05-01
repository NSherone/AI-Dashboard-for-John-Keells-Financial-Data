
# Financial Data Extraction & AI Insight Documentation

## Objective
To automate the extraction, transformation, and insight generation of key financial data and shareholder information from annual PDF reports (2019–2024).

---

## Modules Overview
- PDF Table Extraction using Camelot
- DataFrame loading
- Metric extraction and formatting
- Insight generation
- Quarterly sector analysis

---

## Financial Metrics
Metrics extracted:
- Total Revenue
- Cost of Sales
- Gross Profit
- Operating Expenses
- Basic EPS
- Diluted EPS
- Net assets per share
- Net Profit
- Total equity and liabilities

---

## Functions Used
- `extract_data_from_pdf()`
- `get_all_tables_as_dfs()`
- `extract_from_df()`
- `extract_specific()`
- `generate_ml_insight()`
- `extract_text_from_pdf()`
- `call_openrouter_llm()`

---

## Output Files
- `formatted_financial_data.json`
- `shareholders.json`
- `event_annotations.json`
- `combined_quarterly_ebitda.json`

---

## AI Integration
**LLM**: DeepSeek-R1 via OpenRouter  
Prompts were designed to extract bullet-point economic disruptions from full PDF text.

---

## Shareholder & Quarterly Data
- Top 20 Shareholders were parsed by year into a single dataset.
- Quarterly EBITDA & YoY % were restructured into JSON records per year, sector, and quarter.

---

## Tech Stack
- **Python Libraries**: `pandas`, `camelot`, `fitz (PyMuPDF)`, `re`, `json`, `requests`
- **Model API**: OpenRouter.ai
- **Data Format**: JSON
- **Sources**: PDF reports (2019–2024)
