import json
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA

def forecast_arima(series, steps=1):
    try:
        model = ARIMA(series, order=(1, 1, 1))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=steps)
        return forecast.iloc[0] if steps == 1 else forecast.tolist()
    except Exception as e:
        return f"ARIMA Error: {str(e)}"

def generate_ml_insight(df, selected_year, selected_charts=None):
    selected_year = str(selected_year)

    try:
        with open("data/event_annotations.json") as f:
            event_annotations = json.load(f)
    except:
        event_annotations = {}

    if selected_year not in df.columns:
        return [f"No financial data available for year {selected_year}"]

    years = list(df.columns)
    year_idx = years.index(selected_year)
    if year_idx == 0:
        return ["Not enough historical data for comparison."]

    prev_year = years[year_idx - 1]
    insights = []

    chart_to_metric_map = {
        "Revenue": "Total Revenue",
        "Cost vs Expenses": ["Cost of Sales", "Operating Expenses"],
        "Gross Profit Margin": "Gross Profit",
        "Net Profit": "Net Profit",
        "EPS": ["Basic EPS", "Diluted EPS"],
        "Net Assets": "Net assets per share",
        "Total Equity": "Total equity and liabilities"
    }

    # Flatten and normalize selected metrics
    selected_metrics = []
    if selected_charts:
        for chart in selected_charts:
            metrics = chart_to_metric_map.get(chart, [])
            if isinstance(metrics, str):
                selected_metrics.append(metrics)
            else:
                selected_metrics.extend(metrics)
    else:
        selected_metrics = df.index.tolist()

    emoji_map = {
        "Total Revenue": "💼",
        "Cost of Sales": "📦",
        "Gross Profit": "📊",
        "Operating Expenses": "🧾",
        "Net Profit": "💰",
        "Basic EPS": "📉",
        "Diluted EPS": "📉",
        "Net assets per share": "🏦",
        "Total equity and liabilities": "🏛️"
    }

    metric_keywords = {
        "Total Revenue": ["revenue", "sales", "demand", "growth"],
        "Cost of Sales": ["cost", "supply", "currency", "inflation"],
        "Operating Expenses": ["investment", "expansion", "infrastructure", "analytics"],
        "Net Profit": ["profit", "earnings", "loss", "expansion", "cost"],
        "Basic EPS": ["earnings", "shareholders", "dilution"],
        "Diluted EPS": ["earnings", "shareholders", "stock"],
        "Net assets per share": ["assets", "valuation"],
        "Total equity and liabilities": ["equity", "borrowing", "capital", "investment"]
    }

    for metric in df.index:
        if metric not in selected_metrics:
            continue

        try:
            current = df.at[metric, selected_year]
            previous = df.at[metric, prev_year]
            change = current - previous
            pct_change = (change / abs(previous)) * 100 if previous != 0 else 0

            tag = emoji_map.get(metric, "📈")
            if pct_change > 10:
                trend = f"{tag} {metric} increased by {pct_change:.2f}% in {selected_year} compared to {prev_year}."
            elif pct_change < -10:
                trend = f"{tag} {metric} dropped by {abs(pct_change):.2f}% in {selected_year} compared to {prev_year}."
            elif abs(pct_change) > 2:
                direction = "rose" if change > 0 else "fell"
                trend = f"{tag} {metric} slightly {direction} ({pct_change:.2f}%) in {selected_year} vs {prev_year}."
            else:
                continue

            events = event_annotations.get(selected_year, [])
            matched_reason = None
            for e in events:
                for kw in metric_keywords.get(metric, []):
                    if kw.lower() in e.lower():
                        matched_reason = e
                        break
                if matched_reason:
                    break

            insight = f"{trend} Reason: {matched_reason}" if matched_reason else trend
            insights.append(insight)

            series = df.loc[metric].dropna()
            arima_pred = forecast_arima(series)

            forecast_text = (
                f"Forecast for {metric} in {int(selected_year) + 1}: ARIMA = {arima_pred:.2f}"
                if isinstance(arima_pred, (float, int))
                else f"Forecast error for {metric}"
            )
            insights.append(forecast_text)

        except Exception as e:
            insights.append(f"Could not compute insight for {metric}: {str(e)}")

    return insights
