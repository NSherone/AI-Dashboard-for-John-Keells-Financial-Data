import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const TopShareholdersChart = ({ selectedYear }) => {
  const [shareholders, setShareholders] = useState([]);
  const [hovered, setHovered] = useState(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/top-shareholders')
      .then(res => setShareholders(res.data))
      .catch(err => console.error('Failed to load shareholders:', err));
  }, []);

  const filtered = shareholders
    .filter(s => Number(s.Year) === Number(selectedYear))
    .sort((a, b) => b.Percentage - a.Percentage);

  const prototypeColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#6366F1', '#EC4899', '#14B8A6', '#EAB308', '#22D3EE',
    '#4B5563', '#6EE7B7', '#FCD34D', '#FB7185', '#A78BFA',
    '#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#818CF8'
  ];

  const chartData = {
    labels: filtered.map(s => s.Shareholder),
    datasets: [
      {
        label: '% Ownership',
        data: filtered.map(s => s.Percentage),
        backgroundColor: prototypeColors.slice(0, filtered.length),
        borderColor: '#1E293B',
        borderWidth: 1,
        cutout: '65%'
      }
    ]
  };

  const getLineData = (shareholderName) => {
    const trend = shareholders
      .filter(s => s.Shareholder === shareholderName)
      .sort((a, b) => a.Year - b.Year);

    return {
      labels: trend.map(t => t.Year),
      datasets: [
        {
          label: '% Over Years',
          data: trend.map(t => t.Percentage),
          fill: false,
          borderColor: '#38BDF8',
          backgroundColor: '#38BDF8',
          tension: 0.3
        }
      ]
    };
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          boxWidth: 12,
          padding: 12
        }
      },
      tooltip: {
        enabled: false,
        external: (context) => {
          const index = context.tooltip?.dataPoints?.[0]?.dataIndex;
          const label = context.tooltip?.dataPoints?.[0]?.label;
          if (label) setHovered(label);
        }
      }
    }
  };

  return (
    <div id="top-shareholders-chart" className="chart-card"  style={{ maxWidth: '700px', margin: 'auto', position: 'relative' }}>
      <h3 className="chart-title" style={{ color: '#ffffff' }}>
        Top Shareholders – {selectedYear}
      </h3>
      {filtered.length > 0 ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <p style={{ color: '#ccc' }}>No data available for {selectedYear}</p>
      )}

      {hovered && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-550px',
            transform: 'translateY(-50%)',
            backgroundColor: '#1e293b',
            padding: '4rem',
            borderRadius: '8px',
            width: '400px',
            height: '350px',
            color: '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <strong>{hovered}</strong>
          <Line
            data={getLineData(hovered)}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
                y: { ticks: { color: '#ccc' }, grid: { color: '#333' } }
              },
              responsive: true,
              maintainAspectRatio: false
            }}
            height={200}
          />
        </div>
      )}
    </div>
  );
};

export default TopShareholdersChart;
