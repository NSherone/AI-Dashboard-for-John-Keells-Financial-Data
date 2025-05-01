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

const QuarterlyYoYGrowthLineChart = ({ selectedYear }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quarterly-ebitda');
        const data = res.data.filter(d => d.Year === parseInt(selectedYear));
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const sectors = [...new Set(data.map(d => d.Sector))];

        const datasets = sectors.map((sector, idx) => {
          const yoyValues = quarters.map(q => {
            const entry = data.find(e => e.Sector === sector && e.Quarter === q);
            const val = entry?.['YoY %']?.[1]?.replace(/,/g, '');
            const num = parseFloat(val);
            return !isNaN(num) ? num : 0;
          });

          return {
            label: sector,
            data: yoyValues,
            borderColor: `hsl(${(idx * 40) % 360}, 70%, 50%)`,
            backgroundColor: `hsla(${(idx * 40) % 360}, 70%, 50%, 0.3)`,
            pointRadius: 3,
            tension: 0.4
          };
        });

        setChartData({
          labels: quarters,
          datasets
        });
      } catch (err) {
        console.error('Failed to load YoY % growth data:', err);
      }
    };

    fetchChartData();
  }, [selectedYear]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#FFFFFF' } },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw?.toFixed(2)}%`
        }
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
    <div id="yoy-growth-chart" className="chart-card">
      <h3 className="chart-title">YoY % Change in EBITDA ({selectedYear})</h3>
      <div style={{ height: '400px' }}>
        {chartData ? <Line data={chartData} options={options} /> : <p>Loading chart…</p>}
      </div>
    </div>
  );
};

export default QuarterlyYoYGrowthLineChart;
