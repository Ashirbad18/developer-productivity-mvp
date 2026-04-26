import React, { useState, useMemo } from "react";
import { DeveloperPicker } from "./components/DeveloperPicker";
import { MetricsDisplay } from "./components/MetricsDisplay";
import { InterpretationPanel } from "./components/InterpretationPanel";
import { ManagerView } from "./components/ManagerView";
import { calculateMetrics } from "./utils/metricsCalculator";
import { interpretMetrics } from "./utils/interpretationEngine";
import data from "./data/data.json";
import "./App.css";

// Unique managers from data
const MANAGERS = [
  { manager_id: "MGR-01", manager_name: "Rina Kapoor", team_name: "Payments API" },
  { manager_id: "MGR-02", manager_name: "Samir Gupta", team_name: "Checkout Web" },
  { manager_id: "MGR-03", manager_name: "Priya Nair", team_name: "Mobile Growth" },
];

const LEVEL_COLOR = {
  SDE3: "level-senior",
  SDE2: "level-mid",
  SDE1: "level-junior",
};

const MONTH_LABEL = {
  "2026-03": "March 2026",
  "2026-04": "April 2026",
};

export default function App() {
  const [view, setView] = useState("ic"); // "ic" | "manager"
  const [selectedDevId, setSelectedDevId] = useState("DEV-001");
  const [selectedMonth, setSelectedMonth] = useState("2026-04");

  const metrics = useMemo(
    () => calculateMetrics(selectedDevId, selectedMonth, data),
    [selectedDevId, selectedMonth]
  );

  const interpretation = useMemo(() => {
    const result = interpretMetrics(metrics);
    result.bugs = metrics.rawData.bugs;
    return result;
  }, [metrics]);

  const developer = data.developers.find((d) => d.developer_id === selectedDevId);

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">DevPulse</span>
          </div>
          <span className="header-tag">Developer Productivity Dashboard</span>
        </div>
        <p className="header-sub">
          From raw metrics to clear understanding and better action.
        </p>

        {/* View toggle */}
        <div className="view-toggle">
          <button
            id="tab-ic"
            className={`toggle-btn ${view === "ic" ? "active" : ""}`}
            onClick={() => setView("ic")}
          >
            👤 My Dashboard
          </button>
          <button
            id="tab-manager"
            className={`toggle-btn ${view === "manager" ? "active" : ""}`}
            onClick={() => setView("manager")}
          >
            👥 Manager View
          </button>
        </div>
      </header>

      <main className="main">
        <div className="container">

          {/* ── IC VIEW ── */}
          {view === "ic" && (
            <>
              {/* Pickers */}
              <DeveloperPicker
                developers={data.developers}
                selectedId={selectedDevId}
                onSelect={setSelectedDevId}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />

              {/* Developer Profile Card */}
              <section className="developer-info">
                <div className="dev-avatar">
                  {developer?.developer_name?.charAt(0)}
                </div>
                <div className="dev-details">
                  <h2>{developer?.developer_name}</h2>
                  <div className="dev-meta">
                    <span className="badge badge-team">{developer?.team_name}</span>
                    <span className={`badge ${LEVEL_COLOR[developer?.level] || "badge-level"}`}>
                      {developer?.level}
                    </span>
                    <span className="badge badge-service">{developer?.service_type}</span>
                    <span className="badge badge-month">{MONTH_LABEL[selectedMonth]}</span>
                  </div>
                  <div className="dev-manager">
                    Reports to: <strong>{
                      data.developers.find(d => d.developer_id === selectedDevId)
                        ? (() => {
                            const mgr = MANAGERS.find(m => m.manager_id === developer?.manager_id);
                            return mgr ? mgr.manager_name : developer?.manager_id;
                          })()
                        : "—"
                    }</strong>
                  </div>
                </div>
                <div className={`health-chip health-${interpretation.healthColor}`}>
                  {interpretation.status}
                </div>
              </section>

              {/* Raw Counts */}
              <div className="raw-counts">
                <div className="rc-item">
                  <span className="rc-num">{metrics.rawData.issuesCompleted}</span>
                  <span className="rc-label">Issues Done</span>
                </div>
                <div className="rc-divider" />
                <div className="rc-item">
                  <span className="rc-num">{metrics.rawData.prsCount}</span>
                  <span className="rc-label">PRs Merged</span>
                </div>
                <div className="rc-divider" />
                <div className="rc-item">
                  <span className="rc-num">{metrics.rawData.deploymentsCount}</span>
                  <span className="rc-label">Prod Deploys</span>
                </div>
                <div className="rc-divider" />
                <div className="rc-item">
                  <span className={`rc-num ${metrics.rawData.bugsCount > 0 ? "rc-danger" : ""}`}>
                    {metrics.rawData.bugsCount}
                  </span>
                  <span className="rc-label">Escaped Bugs</span>
                </div>
              </div>

              {/* Metrics */}
              <section className="section">
                <div className="section-header">
                  <h3>The 5 Metrics</h3>
                  <span className="section-sub">{MONTH_LABEL[selectedMonth]} · Production data</span>
                </div>
                <MetricsDisplay metrics={metrics} />
              </section>

              {/* Interpretation */}
              <section className="section">
                <div className="section-header">
                  <h3>What This Means</h3>
                  <span className="section-sub">Story behind the numbers</span>
                </div>
                <InterpretationPanel interpretation={interpretation} />
              </section>

              {/* Metric Definitions Legend */}
              <section className="legend glass-card">
                <h4>📖 Metric Definitions (per assignment)</h4>
                <div className="legend-grid">
                  <div className="legend-item">
                    <span>⚡</span>
                    <div>
                      <strong>Lead Time for Changes</strong>
                      <p>Avg days from PR opened → successful prod deployment.</p>
                    </div>
                  </div>
                  <div className="legend-item">
                    <span>⏱️</span>
                    <div>
                      <strong>Cycle Time</strong>
                      <p>Avg days from issue moved to In Progress → marked Done.</p>
                    </div>
                  </div>
                  <div className="legend-item">
                    <span>🐛</span>
                    <div>
                      <strong>Bug Rate</strong>
                      <p>Escaped prod bugs found ÷ issues completed in the month (%).</p>
                    </div>
                  </div>
                  <div className="legend-item">
                    <span>🚀</span>
                    <div>
                      <strong>Deployment Frequency</strong>
                      <p>Count of successful prod deployments in the month.</p>
                    </div>
                  </div>
                  <div className="legend-item">
                    <span>📝</span>
                    <div>
                      <strong>PR Throughput</strong>
                      <p>Count of merged pull requests in the month.</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── MANAGER VIEW ── */}
          {view === "manager" && (
            <>
              <div className="month-picker-bar">
                <label htmlFor="mgr-month">Month</label>
                <div className="select-wrapper" style={{ width: 200 }}>
                  <select
                    id="mgr-month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="2026-03">March 2026</option>
                    <option value="2026-04">April 2026</option>
                  </select>
                </div>
              </div>
              <ManagerView
                managers={MANAGERS}
                data={data}
                selectedMonth={selectedMonth}
              />
            </>
          )}

        </div>
      </main>

      <footer className="footer">
        <p>DevPulse · Developer Productivity MVP · Data from intern_assignment_support_pack_dev_only_v3.xlsx</p>
      </footer>
    </div>
  );
}
