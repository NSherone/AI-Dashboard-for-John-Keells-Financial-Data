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

const CostVsExpenseChart = ({ selectedYear, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);

  
  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'USD') {
        try {
          const res = await axios.get('https://api.exchangerate-api.com/v4/latest/LKR');
          setConversionRate(res.data.rates.USD || 1);
        } catch (err) {
          console.error('Exchange rate fallback to 1:', err);
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
      const costRes = await axios.get('http://localhost:5000/api/cost-of-sales');
      const allRes = await axios.get('http://localhost:5000/api/all-metrics');

      const years = Object.keys(costRes.data);
      const costOfSalesRaw = Object.values(costRes.data).map(val => parseFloat(val.replace(/,/g, '')));
      const operatingExpensesRaw = Object.values(allRes.data["Operating Expenses"]).map(val => parseFloat(val.replace(/,/g, '')));

     
      const costOfSales = costOfSalesRaw.map(val => val * conversionRate);
      const operatingExpenses = operatingExpensesRaw.map(val => val * conversionRate);

      const highlightIndex = years.indexOf(selectedYear);

      setChartData({
        labels: years,
        datasets: [
          {
            label: `Cost of Sales (${currency})`,
            data: costOfSales,
            backgroundColor: years.map((_, i) =>
              i === highlightIndex ? '#288CFA' : 'rgba(40, 140, 250, 0.3)'
            ),
            borderColor: years.map((_, i) =>
              i === highlightIndex ? '#ffffff' : 'transparent'
            ),
            borderWidth: 1
          },
          {
            label: `Operating Expenses (${currency})`,
            data: operatingExpenses,
            backgroundColor: years.map((_, i) =>
              i === highlightIndex ? '#2E865F' : 'rgba(46, 134, 95, 0.3)'
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
  }, [selectedYear, conversionRate]);

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
      x: { ticks: { color: '#B0B3C2' }, grid: { color: '#333' } },
      y: { ticks: { color: '#B0B3C2' }, grid: { color: '#333' } }
    }
  };

  return (
    <div id="cost-vs-expense-chart" className="chart-card">
      <h3 className="chart-title">Cost of Sales vs Operating Expenses ({currency})</h3>
      <div style={{ height: '100%' }}>
        {chartData ? <Bar data={chartData} options={options} /> : <p>Loading…</p>}
      </div>
    </div>
  );
};

export default CostVsExpenseChart;
