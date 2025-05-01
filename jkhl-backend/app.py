from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import pandas as pd
from generate_ml_insight import generate_ml_insight
from extract_keywords import extract_keywords_by_year


app = Flask(__name__)
CORS(app)


with open("data/formatted_financial_data.json") as f:
    raw_data = json.load(f)


df = pd.DataFrame(raw_data).T
df = df.apply(lambda col: col.map(lambda x: float(str(x).replace(",", ""))))
df = df.astype(float)

financial_data = raw_data
print("Columns in df:", df.columns.tolist())
@app.route('/api/all-metrics', methods=['GET'])
def get_all_metrics():
    return jsonify(financial_data)

@app.route('/api/revenue', methods=['GET'])
def get_revenue():
    return jsonify(financial_data.get("Total Revenue", {}))

@app.route('/api/net-profit', methods=['GET'])
def get_net_profit():
    return jsonify(financial_data.get("Net Profit", {}))

@app.route('/api/eps', methods=['GET'])
def get_eps():
    return jsonify({
        "Basic EPS": financial_data.get("Basic EPS", {}),
        "Diluted EPS": financial_data.get("Diluted EPS", {})
    })

@app.route('/api/gross-profit', methods=['GET'])
def get_gross_profit():
    return jsonify(financial_data.get("Gross Profit", {}))

@app.route('/api/cost-of-sales', methods=['GET'])
def get_cost_of_sales():
    return jsonify(financial_data.get("Cost of Sales", {}))

@app.route("/api/ai-insight/<year>", methods=["GET"])
def get_insight(year):
    charts = request.args.getlist("charts")  
    insight = generate_ml_insight(df, year, charts)
    return jsonify({"year": year, "insights": insight})

@app.route("/api/events/<year>")
def get_key_events(year):
    try:
        with open("data/event_annotations.json") as f:
            annotations = json.load(f)
        events = annotations.get(year, [])
        return jsonify({"year": year, "events": events})
    except Exception as e:
        return jsonify({"error": str(e), "events": []}), 500
    
@app.route('/api/event-keywords', methods=['GET'])
def get_event_keywords():
    keywords = extract_keywords_by_year()
    return jsonify(keywords)

@app.route("/api/top-shareholders", methods=["GET"])
def get_top_shareholders():
    try:
        df = pd.read_json("data/shareholders.json")
        records = df.to_dict(orient="records")
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route("/api/quarterly-ebitda", methods=["GET"])
def get_quarterly_ebitda():
    try:
        df = pd.read_json("data/combined_quarterly_ebitda.json")
        records = df.to_dict(orient="records")
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
