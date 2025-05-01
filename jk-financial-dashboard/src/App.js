import React, { useState } from "react";
import "./styles/variables.css";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";

import RevenueLineChart from "./components/charts/RevenueLineChart";
import CostVsExpenseChart from "./components/charts/CostVsExpenseChart";
import EpsTrendChart from "./components/charts/EpsTrendChart";
import NetAssetsChart from "./components/charts/NetAssetsChart";
import NetProfitChart from "./components/charts/NetProfitChart";
import GrossProfitMarginChart from "./components/charts/GrossProfitMarginChart";
import TotalEquityChart from "./components/charts/TotalEquityChart";
import TopShareholdersChart from "./components/charts/TopShareholdersChart";

import QuarterlyEBITDALineChart from "./components/charts/QuarterlyEBITDALineChart";
import QuarterlyGroupedEBITDABarChart from "./components/charts/QuarterlyGroupedEBITDABarChart";
import QuarterlyYoYGrowthLineChart from "./components/charts/QuarterlyYoYGrowthLineChart";
import CumulativeEBITDAAreaChart from "./components/charts/CumulativeEBITDAAreaChart";

import AIInsightsBox from "./components/insights/AIInsightsBox";
import KeyEventsBox from "./components/insights/KeyEventsBox";

import { exportToPDF, exportToCSV } from "./components/utils/exportUtils";
import { Chart } from "chart.js"; 

const allCharts = [
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
  "Cumulative EBITDA"
];

const chartIdMap = {
  "Revenue": "revenue-chart",
  "Net Profit": "net-profit-chart",
  "EPS": "eps-chart",
  "Gross Profit Margin": "gpm-chart",
  "Cost vs Expenses": "cost-vs-expense-chart",
  "Net Assets": "net-assets-chart",
  "Total Equity": "equity-chart",
  "Top Shareholders": "top-shareholders-chart",
  "Quarterly EBITDA (Line)": "ebitda-line-chart",
  "Quarterly EBITDA (Grouped)": "ebitda-grouped-chart",
  "Quarterly YoY Growth": "yoy-growth-chart",
  "Cumulative EBITDA": "cumulative-chart"
};

function App() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [industry, setIndustry] = useState("All");
  const [currency, setCurrency] = useState("LKR");
  const [group, setGroup] = useState("Annual");
  const [selectedCharts, setSelectedCharts] = useState([...allCharts]);

  const showAll = selectedCharts.length === 0 || selectedCharts.length === allCharts.length;

  const handleExport = async (type, charts) => {
    const ids = charts.map(name => chartIdMap[name]).filter(Boolean);

    if (type === "PDF") {
      await exportToPDF(ids);
    } else if (type === "CSV") {
      const datasetsMap = {};
      ids.forEach(id => {
        const chart = Chart.getChart(id); 
        if (chart) datasetsMap[id] = chart.data.datasets;
      });
      exportToCSV(datasetsMap);
    }
  };

  return (
    <div className="dark-mode">
      <Navbar
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        industry={industry}
        setIndustry={setIndustry}
        currency={currency}
        setCurrency={setCurrency}
        group={group}
        setGroup={setGroup}
        selectedCharts={selectedCharts}
        setSelectedCharts={setSelectedCharts}
        onExport={handleExport}
      />

      {group === "Annual" && (
        <DashboardLayout>
          {(showAll || selectedCharts.includes("Revenue")) && (
            <div id="revenue-chart">
              <RevenueLineChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Net Profit")) && (
            <div id="net-profit-chart">
              <NetProfitChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("EPS")) && (
            <div id="eps-chart">
              <EpsTrendChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Gross Profit Margin")) && (
            <div id="gpm-chart">
              <GrossProfitMarginChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Cost vs Expenses")) && (
            <div id="cost-vs-expense-chart">
              <CostVsExpenseChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Net Assets")) && (
            <div id="net-assets-chart">
              <NetAssetsChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Total Equity")) && (
            <div id="equity-chart">
              <TotalEquityChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Top Shareholders")) && (
            <div id="top-shareholders-chart">
              <TopShareholdersChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
        </DashboardLayout>
      )}

      {group === "Annual" && (
        <div className="dashboard-grid">
          <AIInsightsBox selectedYear={selectedYear} selectedCharts={selectedCharts} />
          <KeyEventsBox selectedYear={selectedYear} />
        </div>
      )}

      {group === "Quarterly" && (
        <DashboardLayout>
          {(showAll || selectedCharts.includes("Quarterly EBITDA (Line)")) && (
            <div id="ebitda-line-chart">
              <QuarterlyEBITDALineChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Quarterly EBITDA (Grouped)")) && (
            <div id="ebitda-grouped-chart">
              <QuarterlyGroupedEBITDABarChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          {(showAll || selectedCharts.includes("Quarterly YoY Growth")) && (
            <div id="yoy-growth-chart">
              <QuarterlyYoYGrowthLineChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
          <div></div>
          {(showAll || selectedCharts.includes("Cumulative EBITDA")) && (
            <div id="cumulative-chart">
              <CumulativeEBITDAAreaChart selectedYear={selectedYear} currency={currency} />
            </div>
          )}
        </DashboardLayout>
      )}
    </div>
  );
}

export default App;
