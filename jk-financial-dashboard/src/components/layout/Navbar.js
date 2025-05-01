import React, { useState } from "react";
import "./layout.css";

const availableCharts = [
  "Revenue",
  "Net Profit",
  "EPS",
  "Gross Profit Margin",
  "Cost vs Expenses",
  "Net Assets",
  "Total Equity",
  "Top Shareholders",
  "Quarterly EBITDA (Line)",
  "Quarterly EBITDA (Grouped)",
  "Quarterly YoY Growth",
  "Cumulative EBITDA",
];

const Navbar = ({
  selectedYear,
  setSelectedYear,
  currency,
  setCurrency,
  group,
  setGroup,
  selectedCharts,
  setSelectedCharts,
  onExport,
}) => {
  const [chartDropdownOpen, setChartDropdownOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  const toggleChart = (chart) => {
    if (chart === "All") {
      const allSelected = selectedCharts.length === availableCharts.length;
      setSelectedCharts(allSelected ? [] : [...availableCharts]);
    } else {
      if (selectedCharts.includes(chart)) {
        setSelectedCharts(selectedCharts.filter((c) => c !== chart));
      } else {
        setSelectedCharts([...selectedCharts, chart]);
      }
    }
  };

  const allSelected = selectedCharts.length === availableCharts.length;

  const handleExport = (type) => {
    if (onExport && typeof onExport === "function") {
      onExport(type, selectedCharts);
    } else {
      alert(`Exporting ${type} for: ${selectedCharts.join(", ")}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>John Keells Dashboard</h1>
      </div>

      <div className="navbar-filters">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option>2019</option>
          <option>2020</option>
          <option>2021</option>
          <option>2022</option>
          <option>2023</option>
          <option>2024</option>
        </select>

        <div className="dropdown-container">
          <button onClick={() => setChartDropdownOpen(!chartDropdownOpen)}>
            Charts ▾
          </button>
          {chartDropdownOpen && (
            <div className="dropdown-menu">
              <label className="dropdown-item">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => toggleChart("All")}
                />
                All
              </label>
              {availableCharts.map((chart) => (
                <label key={chart} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={selectedCharts.includes(chart)}
                    onChange={() => toggleChart(chart)}
                  />
                  {chart}
                </label>
              ))}
            </div>
          )}
        </div>

        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option>LKR</option>
          <option>USD</option>
        </select>

        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option>Annual</option>
          <option>Quarterly</option>
        </select>

        <div className="dropdown-container">
          <button onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}>
            Download ▾
          </button>
          {downloadDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => handleExport('PDF')}>
                📄PDF
              </button>
              <button className="dropdown-item" onClick={() => handleExport('CSV')}>
                📊CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
