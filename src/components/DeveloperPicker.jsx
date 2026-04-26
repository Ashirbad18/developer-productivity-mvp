import React from "react";

const MONTHS = [
  { value: "2026-03", label: "March 2026" },
  { value: "2026-04", label: "April 2026" },
];

export function DeveloperPicker({ developers, selectedId, onSelect, selectedMonth, onMonthChange }) {
  return (
    <div className="picker-bar">
      <div className="picker-field">
        <label htmlFor="dev-select">Developer</label>
        <div className="select-wrapper">
          <select
            id="dev-select"
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
          >
            {developers.map((dev) => (
              <option key={dev.developer_id} value={dev.developer_id}>
                {dev.developer_name} — {dev.team_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="picker-field">
        <label htmlFor="month-select">Month</label>
        <div className="select-wrapper">
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
