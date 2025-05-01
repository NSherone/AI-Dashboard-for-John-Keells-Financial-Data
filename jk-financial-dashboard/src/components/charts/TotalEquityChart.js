import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './charts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const TotalEquityChart = ({ selectedYear, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currency === 'USD') {
        try {
          const res = await axios.get('https://api.exchangerate-api.com/v4/latest/LKR');
          setExchangeRate(res.data.rates?.USD || 1);
        } catch (err) {
          console.error('Failed to fetch exchange rate:', err);
          setExchangeRate(1);
        }
      } else {
        setExchangeRate(1);
      }
    };

    fetchExchangeRate();
  }, [currency]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:5000/api/all-metrics');
      const equity = res.data["Total equity and liabilities"];
      const years = Object.keys(equity);

      const values = Object.values(equity).map(val => {
        const parsed = parseFloat(val.replace(/,/g, ''));
        return parsed * exchangeRate;
      });

      const selectedIndex = years.indexOf(selectedYear);

      setChartData({
        labels: years,
        datasets: [
          {
            label: `Total Equity (${currency})`,
            data: values,
            backgroundColor: years.map((_, i) =>
              i === selectedIndex ? '#38BDF8' : 'rgba(59, 130, 246, 0.2)'
            ),
            borderColor: years.map((_, i) =>
              i === selectedIndex ? '#ffffff' : 'transparent'
            ),
            borderWidth: years.map((_, i) => (i === selectedIndex ? 2 : 1)),
            hoverOffset: 8
          }
        ]
      });
    };

    if (exchangeRate) {
      fetchData();
    }
  }, [selectedYear, currency, exchangeRate]);

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#ffffff' } }
    }
  };

  return (
    <div id="equity-chart" className="chart-card" style={{ height: '500px' }}>
      <h3 className="chart-title">Total Equity and Liabilities ({currency})</h3>
      <div style={{ height: '100%' }}>
        {chartData ? <Pie data={chartData} options={options} /> : <p>Loading…</p>}
      </div>
    </div>
  );
};

export default TotalEquityChart;
