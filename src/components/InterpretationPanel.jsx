import React from "react";

const COLOR_MAP = {
  green: { border: "#3fb950", bg: "rgba(63,185,80,0.06)" },
  amber: { border: "#d29922", bg: "rgba(210,153,34,0.06)" },
  red: { border: "#f85149", bg: "rgba(248,81,73,0.06)" },
  gray: { border: "#6e7681", bg: "transparent" },
};

export function InterpretationPanel({ interpretation }) {
  const colors = COLOR_MAP[interpretation.healthColor] || COLOR_MAP.gray;

  return (
    <div
      className="interpretation-panel"
      style={{
        borderLeftColor: colors.border,
        background: colors.bg,
      }}
    >
      <div className="interp-top">
        <div>
          <div className="status-badge">{interpretation.status}</div>
          <div className="pattern">{interpretation.pattern}</div>
        </div>
        <div
          className={`signal-chip signal-${interpretation.healthColor}`}
        >
          {interpretation.signal}
        </div>
      </div>

      <div className="summary">{interpretation.summary}</div>

      <div className="next-steps">
        <h3>🎯 What to do next</h3>
        <ol>
          {interpretation.nextSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      {interpretation.bugs && interpretation.bugs.length > 0 && (
        <div className="bug-detail">
          <h4>🐛 Escaped bugs this month</h4>
          <table className="bug-table">
            <thead>
              <tr>
                <th>Bug ID</th>
                <th>Linked Issue</th>
                <th>Severity</th>
                <th>Root Cause</th>
              </tr>
            </thead>
            <tbody>
              {interpretation.bugs.map((b) => (
                <tr key={b.bug_id}>
                  <td>{b.bug_id}</td>
                  <td>{b.linked_issue_id}</td>
                  <td>
                    <span className={`sev sev-${b.severity}`}>{b.severity}</span>
                  </td>
                  <td>{b.root_cause_bucket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
