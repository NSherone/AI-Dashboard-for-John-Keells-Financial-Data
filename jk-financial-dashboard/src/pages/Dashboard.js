import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid-container">
        <h1>Dashboard Content Goes Here</h1>
        {/* Insert your chart and card components here */}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
