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

const QuarterlyEBITDALineChart = ({ selectedYear, currency }) => {
  const [chartData, setChartData] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);
  const [drilledSector, setDrilledSector] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currency === 'USD') {
        try {
          const res = await axios.get('https://api.exchangerate-api.com/v4/latest/LKR');
          setConversionRate(res.data.rates.USD || 1);
        } catch (err) {
          console.error('Exchange rate fallback to 1', err);
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
        const res = await axios.get('http://localhost:5000/api/quarterly-ebitda');
        const data = res.data.filter(d => d.Year === parseInt(selectedYear));

        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const sectors = [...new Set(data.map(d => d.Sector))];

        const datasets = sectors.map((sector, idx) => {
          const sectorData = quarters.map(q => {
            const entry = data.find(e => e.Sector === sector && e.Quarter === q);
            const val = entry?.EBITDA?.[0]?.replace(/,/g, '');
            const num = parseFloat(val);
            return !isNaN(num) ? num * conversionRate : 0;
          });

          return {
            label: sector,
            data: sectorData,
            borderColor: `hsl(${(idx * 47) % 360}, 70%, 50%)`,
            backgroundColor: `hsla(${(idx * 47) % 360}, 70%, 50%, 0.3)`,
            pointRadius: 3,
            tension: 0.4,
            hidden: drilledSector && sector !== drilledSector
          };
        });

        setChartData({
          labels: quarters,
          datasets
        });
      } catch (err) {
        console.error('Error fetching EBITDA data:', err);
      }
    };

    fetchChartData();
  }, [selectedYear, conversionRate, drilledSector]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#FFFFFF' },
        onClick: (e, legendItem, legend) => {
          const sector = legendItem.text;
          setDrilledSector(prev => (prev === sector ? null : sector));
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${currency} ${ctx.raw?.toLocaleString() || 0}`
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
    <div id="ebitda-line-chart" className="chart-card">
      <h3 className="chart-title">
        Quarterly EBITDA ({currency}) - {selectedYear}
      </h3>
      <div style={{ height: '400px' }}>
        {chartData ? <Line data={chartData} options={options} /> : <p>Loading chart…</p>}
      </div>
    </div>
  );
};

export default QuarterlyEBITDALineChart;
