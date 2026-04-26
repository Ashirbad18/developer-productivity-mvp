import React from "react";

const METRIC_DEFS = [
  {
    key: "leadTime",
    label: "Lead Time",
    unit: "days",
    icon: "⚡",
    description: "PR opened → deployed to prod",
    good: (v) => v !== null && v < 5,
    warn: (v) => v !== null && v >= 5,
  },
  {
    key: "cycleTime",
    label: "Cycle Time",
    unit: "days",
    icon: "⏱️",
    description: "Issue started → marked Done",
    good: (v) => v !== null && v < 5,
    warn: (v) => v !== null && v >= 5,
  },
  {
    key: "bugRate",
    label: "Bug Rate",
    unit: "%",
    icon: "🐛",
    description: "Escaped bugs ÷ completed issues",
    good: (v) => v === 0,
    warn: (v) => v > 0,
  },
  {
    key: "deploymentFrequency",
    label: "Deploy Freq.",
    unit: "/mo",
    icon: "🚀",
    description: "Successful prod deploys this month",
    good: (v) => v >= 2,
    warn: (v) => v < 2,
  },
  {
    key: "prThroughput",
    label: "PR Throughput",
    unit: "merged",
    icon: "📝",
    description: "Merged pull requests this month",
    good: (v) => v >= 2,
    warn: (v) => v < 2,
  },
];

export function MetricsDisplay({ metrics }) {
  return (
    <div className="metrics-grid">
      {METRIC_DEFS.map((def) => {
        const val = metrics[def.key];
        const isNull = val === null || val === undefined;
        const colorClass = isNull
          ? ""
          : def.good(val)
          ? "metric-good"
          : def.warn(val)
          ? "metric-warn"
          : "";

        return (
          <div key={def.key} className={`metric-card ${colorClass}`}>
            <div className="metric-icon">{def.icon}</div>
            <div className="metric-label">{def.label}</div>
            <div className="metric-value">
              {isNull ? (
                <span className="metric-null">—</span>
              ) : (
                <>
                  {val}
                  <span className="metric-unit"> {def.unit}</span>
                </>
              )}
            </div>
            <div className="metric-description">{def.description}</div>
          </div>
        );
      })}
    </div>
  );
}
