import React, { useEffect, useState } from 'react';
import './AIInsightsBox.css';

const AIInsightsBox = ({ selectedYear, selectedCharts }) => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedYear || !selectedCharts || selectedCharts.length === 0) return;

    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        selectedCharts.forEach(chart => params.append("charts", chart));

        const res = await fetch(`http://localhost:5000/api/ai-insight/${selectedYear}?${params.toString()}`);
        const data = await res.json();
        setInsights(data.insights || []);
      } catch (err) {
        setInsights(["Failed to fetch insights."]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [selectedYear, selectedCharts]);

  return (
    <div className="ai-insight-box">
      <h3 className="insight-title">AI Insights for {selectedYear}</h3>
      {isLoading ? (
        <p className="insight-text">Generating insights...</p>
      ) : insights.length > 0 ? (
        <ul className="insight-list">
          {insights.map((insight, idx) => (
            <li key={idx} className="insight-text">{insight}</li>
          ))}
        </ul>
      ) : (
        <p className="insight-text">No insights available for this year.</p>
      )}
    </div>
  );
};

export default AIInsightsBox;
