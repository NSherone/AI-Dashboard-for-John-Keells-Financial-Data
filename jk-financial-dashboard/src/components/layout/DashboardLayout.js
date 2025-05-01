import React from 'react';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <main className="dashboard-grid">
      {children}
    </main>
  );
};

export default DashboardLayout;
