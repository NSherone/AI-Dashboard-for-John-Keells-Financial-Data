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
import './charts.css';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const GrossProfitMarginChart = ({ selectedYear }) => {
  const [chartData, setChartData] = useState(null);
  const [eventKeywords, setEventKeywords] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, keywordRes] = await Promise.all([
          axios.get('http://localhost:5000/api/all-metrics'),
          axios.get('http://localhost:5000/api/event-keywords')
        ]);

        const revenue = metricsRes.data["Total Revenue"];
        const cost = metricsRes.data["Cost of Sales"];
        const years = Object.keys(revenue);
        setEventKeywords(keywordRes.data || {});

        const margin = years.map((year) => {
          const rev = +revenue[year].replace(/,/g, '');
          const cogs = Math.abs(+cost[year].replace(/,/g, ''));
          return (((rev - cogs) / rev) * 100).toFixed(2);
        });

        const highlightIndex = years.indexOf(selectedYear);

        const gpmDataset = {
          label: 'Gross Profit Margin (%)',
          data: margin,
          borderColor: '#F472B6',
          backgroundColor: 'rgba(244, 114, 182, 0.2)',
          pointBackgroundColor: years.map((_, i) =>
            i === highlightIndex ? '#ffffff' : '#F472B6'
          ),
          pointRadius: years.map((_, i) => (i === highlightIndex ? 6 : 3)),
          fill: true,
          borderWidth: 2,
          tension: 0.4
        };

        const keywordPoints = {
          label: 'Event Keywords',
          data: years.map((year, i) =>
            eventKeywords[year] ? +margin[i] : NaN
          ),
          backgroundColor: years.map((year) =>
            eventKeywords[year] ? '#FFA500' : 'transparent'
          ),
          borderColor: years.map((year) =>
            eventKeywords[year] ? '#ffffff' : 'transparent'
          ),
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 10,
          pointStyle: 'circle',
          fill: false,
          tension: 0
        };

        setChartData({
          labels: years,
          datasets: [gpmDataset, keywordPoints]
        });
      } catch (err) {
        console.error("Failed to load Gross Profit Margin chart:", err);
      }
    };

    fetchData();
  }, [selectedYear]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#ffffff' } },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const year = ctx.label;
            const keywords = eventKeywords[year];
            if (keywords && ctx.dataset.label === 'Event Keywords') {
              return ['📌 Event Keywords:', ...keywords.map(k => `• ${k}`)];
            } else {
              return `${ctx.dataset.label}: ${ctx.formattedValue}%`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#B0B3C2' },
        grid: { color: '#333' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#B0B3C2' },
        grid: { color: '#333' }
      }
    }
  };

  return (
    <div id="gpm-chart" className="chart-card" >
      <h3 className="chart-title">Gross Profit Margin (%)</h3>
      <div className="chart-container">
        {chartData ? <Line data={chartData} options={options} /> : <p>Loading…</p>}
      </div>
    </div>
  );
};

export default GrossProfitMarginChart;
