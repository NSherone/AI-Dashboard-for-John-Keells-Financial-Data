import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import './charts.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, annotationPlugin);

const RevenueLineChart = ({ selectedYear, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [eventKeywords, setEventKeywords] = useState({});
  const [conversionRate, setConversionRate] = useState(1);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currency === 'USD') {
        try {
          const res = await axios.get('https://api.exchangerate-api.com/v4/latest/LKR');
          const rate = res.data.rates.USD || 1;
          setConversionRate(rate);
        } catch (err) {
          console.error('Failed to fetch exchange rate, defaulting to 1', err);
          setConversionRate(1);
        }
      } else {
        setConversionRate(1);
      }
    };

    fetchExchangeRate();
  }, [currency]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [metricsRes, keywordRes] = await Promise.all([
          axios.get('http://localhost:5000/api/all-metrics'),
          axios.get('http://localhost:5000/api/event-keywords')
        ]);

        const revenue = metricsRes.data["Total Revenue"];
        const years = Object.keys(revenue);
        const rawValues = Object.values(revenue).map(val => parseFloat(val.replace(/,/g, '')));
        const values = rawValues.map(v => v * conversionRate);
        const highlightIndex = years.indexOf(selectedYear);

        setEventKeywords(keywordRes.data);

        setChartData({
          labels: years,
          datasets: [
            {
              label: `Total Revenue (${currency})`,
              data: values,
              borderColor: '#3B82F6',
              backgroundColor: years.map((_, i) =>
                i === highlightIndex ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.2)'
              ),
              pointBackgroundColor: years.map((_, i) =>
                i === highlightIndex ? '#ffffff' : '#3B82F6'
              ),
              pointRadius: years.map((_, i) => (i === highlightIndex ? 6 : 3)),
              borderWidth: 2,
              tension: 0.3,
              fill: true
            }
          ]
        });
      } catch (err) {
        console.error('Failed to fetch chart data or annotations:', err);
      }
    };

    fetchChartData();
  }, [selectedYear, conversionRate]);

  const generateAnnotations = () => {
    const annotations = {};
    if (!chartData?.labels || !eventKeywords) return annotations;

    Object.entries(eventKeywords).forEach(([year, keywords]) => {
      if (!chartData.labels.includes(year)) return;

      annotations[`event_${year}`] = {
        type: 'line',
        scaleID: 'x',
        value: year,
        borderColor: '#FFA500',
        borderWidth: 1.5,
        label: {
          content: keywords[0],
          enabled: true,
          backgroundColor: '#FFA500',
          color: '#000',
          font: { size: 10 },
          position: 'top'
        }
      };
    });

    return annotations;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#FFFFFF' } },
      tooltip: {
        callbacks: {
          label: ctx => `${currency} ${ctx.raw?.toLocaleString()}`
        }
      },
      annotation: {
        annotations: generateAnnotations()
      }
    },
    scales: {
      x: {
        ticks: { color: '#B0B3C2' },
        grid: { color: '#333' }
      },
      y: {
        ticks: { color: '#B0B3C2' },
        grid: { color: '#333' }
      }
    }
  };

  return (
    <div id="revenue-chart" className="chart-card">
      <h3 className="chart-title">Total Revenue ({currency})</h3>
      <div style={{ height: '100%' }}>
        {chartData ? <Line data={chartData} options={options} /> : <p>Loading chart…</p>}
      </div>
    </div>
  );
};

export default RevenueLineChart;
