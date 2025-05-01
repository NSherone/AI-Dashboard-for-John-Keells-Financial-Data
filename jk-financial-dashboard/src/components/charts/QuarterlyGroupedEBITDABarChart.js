import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import './charts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const QuarterlyGroupedEBITDABarChart = ({ selectedYear, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  useEffect(() => {
    if (currency === 'USD') {
      axios.get('https://api.exchangerate-api.com/v4/latest/LKR')
        .then(res => setConversionRate(res.data.rates.USD || 1))
        .catch(() => setConversionRate(1));
    } else {
      setConversionRate(1);
    }
  }, [currency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quarterly-ebitda');
        const data = res.data.filter(d => d.Year === parseInt(selectedYear));
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const sectors = [...new Set(data.map(d => d.Sector))];

        const datasets = quarters.map((quarter, idx) => {
          const values = sectors.map(sector => {
            const entry = data.find(e => e.Sector === sector && e.Quarter === quarter);
            const val = entry?.EBITDA?.[0]?.replace(/,/g, '');
            const num = parseFloat(val);
            return !isNaN(num) ? num * conversionRate : 0;
          });

          return {
            label: quarter,
            data: values,
            backgroundColor: `hsl(${(idx * 90) % 360}, 70%, 60%)`
          };
        });

        setChartData({
          labels: sectors,
          datasets
        });
      } catch (error) {
        console.error('Error loading grouped bar chart:', error);
      }
    };

    fetchData();
  }, [selectedYear, conversionRate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#FFFFFF' }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${currency} ${ctx.raw?.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#B0B3C2' },
        grid: { color: '#444' }
      },
      y: {
        ticks: { color: '#B0B3C2' },
        grid: { color: '#444' }
      }
    }
  };

  return (
    <div id="ebitda-grouped-chart" className="chart-card">
      <h3 className="chart-title">Grouped EBITDA by Sector ({selectedYear})</h3>
      <div style={{ height: '400px' }}>
        {chartData ? <Bar data={chartData} options={options} /> : <p>Loading chart…</p>}
      </div>
    </div>
  );
};

export default QuarterlyGroupedEBITDABarChart;
