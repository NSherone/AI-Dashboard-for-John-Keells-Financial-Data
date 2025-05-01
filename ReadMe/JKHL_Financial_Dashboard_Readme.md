
# John Keells Financial Analytics Dashboard – Fullstack

This is a fullstack AI-powered financial dashboard application built using:

-  Annual Reports from John Keells Holdings PLC (2019–2024)
-  AI & Statistical Forecasting (ARIMA + LLMs)
- React.js for frontend visualizations
- Flask for backend APIs

---

## Project Structure

```
project-root/
├── jkhl-backend/               # Flask + AI + Financial Data APIs
│   ├── app.py
│   ├── data/
│   ├── generate_ml_insight.py
│   └── extract_keywords.py
└── jk-financial-dashboard/     # React Frontend
    ├── src/
    ├── public/
    ├── App.js
    └── ...
```

---

##  How to Run the Application

### 1. Start the Backend

```bash
cd jkhl-backend

# (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

Backend runs at: `http://localhost:5000`

---

### 2. 📊 Start the Frontend

```bash
cd jk-financial-dashboard

# Install frontend dependencies
npm install

# Start the React app
npm start
```

Frontend runs at: `http://localhost:3000`

---

##  Features Summary

- AI Insights with bullet-point explanations
- Yearly and Quarterly chart visualizations
- Top 20 Shareholders (with trend)
- Export to PDF / CSV
- Dynamic currency conversion (LKR ↔ USD)

---

## Notes

- Ensure that the backend is up and running before launching the frontend.
- All data is locally derived from PDF annual reports (2019–2024).
- Only for educational and research purposes.

---

