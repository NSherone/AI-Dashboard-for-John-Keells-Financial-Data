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
  Legend,
  Filler
} from 'chart.js';
import './charts.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const CumulativeEBITDAAreaChart = ({ currency }) => {
  const [chartData, setChartData] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'USD') {
        try {
          const res = await axios.get('https://api.exchangerate-api.com/v4/latest/LKR');
          setConversionRate(res.data.rates.USD || 1);
        } catch {
          setConversionRate(1);
        }
      } else {
        setConversionRate(1);
      }
    };

    fetchRate();
  }, [currency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quarterly-ebitda');
        const data = res.data.filter(d => d.Sector === 'Group');

        // Create "2021 Q1", "2021 Q2", ... as time points
        const points = data.map(d => ({
          x: `${d.Year} ${d.Quarter}`,
          y: parseFloat(d.EBITDA[0].replace(/,/g, '')) * conversionRate
        }));

        const sorted = points.sort((a, b) => {
          const [ay, aq] = a.x.split(' ');
          const [by, bq] = b.x.split(' ');
          return (parseInt(ay) * 10 + parseInt(aq.slice(1))) - (parseInt(by) * 10 + parseInt(bq.slice(1)));
        });

        setChartData({
          labels: sorted.map(p => p.x),
          datasets: [{
            label: `Group EBITDA (${currency})`,
            data: sorted.map(p => p.y),
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            borderColor: '#3B82F6',
            tension: 0.4,
            pointRadius: 3
          }]
        });
      } catch (err) {
        console.error('Failed to load cumulative data', err);
      }
    };

    fetchData();
  }, [conversionRate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#FFFFFF' } },
      tooltip: {
        callbacks: {
          label: ctx => `${currency} ${ctx.raw?.toLocaleString()}`
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
    <div id="cumulative-chart" className="chart-card">
      <h3 className="chart-title">Cumulative Group EBITDA Over Time</h3>
      <div style={{ height: '400px' }}>
        {chartData ? <Line data={chartData} options={options} /> : <p>Loading chart…</p>}
      </div>
    </div>
  );
};

export default CumulativeEBITDAAreaChart;
