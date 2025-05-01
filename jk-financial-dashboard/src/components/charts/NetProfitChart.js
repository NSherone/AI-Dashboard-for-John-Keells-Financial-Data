import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import './charts.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const NetProfitChart = ({ selectedYear, currency }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, rateRes] = await Promise.all([
          axios.get('http://localhost:5000/api/all-metrics'),
          axios.get('https://api.exchangerate-api.com/v4/latest/LKR')
        ]);

        const profit = metricsRes.data["Net Profit"];
        const years = Object.keys(profit);
        const lkrValues = Object.values(profit).map(v => parseFloat(v.replace(/,/g, '')));

        const exchangeRate = currency === 'USD' ? (rateRes.data.rates?.USD || 1) : 1;
        const convertedValues = lkrValues.map(v => v * exchangeRate);

        const highlightIndex = years.indexOf(selectedYear);

        setChartData({
          labels: years,
          datasets: [
            {
              label: `Net Profit (${currency})`,
              data: convertedValues,
              backgroundColor: years.map((_, i) =>
                i === highlightIndex ? '#10B981' : 'rgba(16, 185, 129, 0.3)'
              ),
              borderColor: years.map((_, i) =>
                i === highlightIndex ? '#ffffff' : 'transparent'
              ),
              borderWidth: 1
            }
          ]
        });
      } catch (err) {
        console.error("Failed to load Net Profit data:", err);
      }
    };

    fetchData();
  }, [selectedYear, currency]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#ffffff' } },
      tooltip: {
        callbacks: {
          label: ctx =>
            currency === 'USD'
              ? `USD ${ctx.raw.toFixed(2)}`
              : `LKR ${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#B0B3C2' }, grid: { color: '#333' } },
      y: {
        ticks: {
          color: '#B0B3C2',
          callback: value =>
            currency === 'USD' ? `$${value}` : `Rs. ${value.toLocaleString()}`
        },
        grid: { color: '#333' }
      }
    }
  };

  return (
    <div id="net-profit-chart" className="chart-card">
      <h3 className="chart-title">Net Profit({currency})</h3>
      <div style={{ height: '100%' }}>
        {chartData ? <Bar data={chartData} options={options} /> : <p>Loading…</p>}
      </div>
    </div>
  );
};

export default NetProfitChart;
