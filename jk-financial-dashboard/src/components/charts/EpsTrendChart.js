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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const EpsTrendChart = ({ selectedYear }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:5000/api/all-metrics');
      const eps = res.data["Basic EPS"];
      const years = Object.keys(eps);
      const values = Object.values(eps).map(v => parseFloat(v));

      const highlightIndex = years.indexOf(selectedYear);

      setChartData({
        labels: years,
        datasets: [
          {
            label: 'Basic EPS',
            data: values,
            borderColor: '#EAB308',
            backgroundColor: 'rgba(234, 179, 8, 0.2)',
            pointBackgroundColor: years.map((_, i) =>
              i === highlightIndex ? '#ffffff' : '#EAB308'
            ),
            pointRadius: years.map((_, i) => (i === highlightIndex ? 6 : 3)),
            tension: 0.4,
            fill: true,
            borderWidth: 2
          }
        ]
      });
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
          label: ctx => `EPS: ${ctx.raw}`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#B0B3C2' }, grid: { color: '#333' } },
      y: { ticks: { color: '#B0B3C2' }, grid: { color: '#333' } }
    }
  };

  return (
    <div id="eps-chart" className="chart-card">
      <h3 className="chart-title">EPS Trend</h3>
      <div style={{ height: '100%' }}>
        {chartData ? <Line data={chartData} options={options} /> : <p>Loading…</p>}
      </div>
    </div>
  );
};

export default EpsTrendChart;
