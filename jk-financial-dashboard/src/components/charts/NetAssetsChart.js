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

const NetAssetsChart = ({ selectedYear, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1); // Default = LKR

  useEffect(() => {
    const fetchData = async () => {
      const [metricsRes, rateRes] = await Promise.all([
        axios.get('http://localhost:5000/api/all-metrics'),
        axios.get('https://api.exchangerate-api.com/v4/latest/LKR')
      ]);

      const assets = metricsRes.data["Net assets per share"];
      const years = Object.keys(assets);
      const baseValues = Object.values(assets).map(v => parseFloat(v));

      const rate = currency === 'USD'
        ? (rateRes.data.rates?.USD || 1)
        : 1;

      setExchangeRate(rate);

      const values = baseValues.map(v => v / rate);

      const highlightIndex = years.indexOf(selectedYear);

      setChartData({
        labels: years,
        datasets: [
          {
            label: `Net Assets Per Share (${currency})`,
            data: values,
            backgroundColor: years.map((_, i) =>
              i === highlightIndex ? '#EC4899' : 'rgba(236, 72, 153, 0.3)'
            ),
            borderColor: years.map((_, i) =>
              i === highlightIndex ? '#ffffff' : 'transparent'
            ),
            borderWidth: 1
          }
        ]
      });
    };

    fetchData();
  }, [selectedYear, currency]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#ffffff' } }
    },
    scales: {
      x: { ticks: { color: '#B0B3C2' }, grid: { color: '#333' } },
      y: {
        ticks: {
          color: '#B0B3C2',
          callback: value => currency === 'USD' ? `${value}` : `Rs. ${value}`
        },
        grid: { color: '#333' }
      }
    }
  };

  return (
    <div id="net-assets-chart" className="chart-card">
      <h3 className="chart-title">Net Assets Per Share ({currency})</h3>
      <div style={{ height: '100%' }}>
        {chartData ? <Bar data={chartData} options={options} /> : <p>Loading…</p>}
      </div>
    </div>
  );
};

export default NetAssetsChart;
