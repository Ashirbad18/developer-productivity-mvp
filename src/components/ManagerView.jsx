import React from "react";

const SIGNAL_COLOR = {
  "Healthy flow": "green",
  "Watch bottlenecks": "amber",
  "Needs review": "amber",
  "Quality watch": "amber",
  "At Risk": "red",
};

function SignalBadge({ signal }) {
  const color = SIGNAL_COLOR[signal] || "gray";
  return <span className={`mgr-signal mgr-signal-${color}`}>{signal}</span>;
}

export function ManagerView({ managers, data, selectedMonth }) {
  return (
    <div className="manager-view">
      <div className="section-header">
        <h3>Manager Summary</h3>
        <span className="section-sub">Team-level aggregates · {selectedMonth === "2026-03" ? "March 2026" : "April 2026"}</span>
      </div>

      {managers.map((mgr) => {
        const teamDevs = data.developers.filter(
          (d) => d.manager_id === mgr.manager_id
        );

        // Aggregate metrics for this manager's team
        const memberRows = teamDevs.map((dev) => {
          const devIssues = data.issues.filter(
            (i) =>
              i.developer_id === dev.developer_id &&
              i.month_done === selectedMonth &&
              i.status === "Done"
          );
          const devDeps = data.deployments.filter(
            (d) =>
              d.developer_id === dev.developer_id &&
              d.month_deployed === selectedMonth &&
              d.environment === "prod" &&
              d.status === "success"
          );
          const devBugs = data.bugs.filter(
            (b) =>
              b.developer_id === dev.developer_id &&
              b.month_found === selectedMonth &&
              b.escaped_to_prod === "Yes"
          );

          const leadTime =
            devDeps.length > 0
              ? parseFloat(
                  (
                    devDeps.reduce((s, d) => s + d.lead_time_days, 0) /
                    devDeps.length
                  ).toFixed(2)
                )
              : null;
          const cycleTime =
            devIssues.length > 0
              ? parseFloat(
                  (
                    devIssues.reduce((s, i) => s + i.cycle_time_days, 0) /
                    devIssues.length
                  ).toFixed(2)
                )
              : null;
          const bugRate =
            devIssues.length > 0
              ? parseFloat(
                  ((devBugs.length / devIssues.length) * 100).toFixed(1)
                )
              : 0;

          let signal;
          if (bugRate > 0 && (leadTime ?? 0) >= 5) signal = "At Risk";
          else if (bugRate > 0) signal = "Quality watch";
          else if ((leadTime ?? 0) >= 6) signal = "Needs review";
          else signal = "Healthy flow";

          return { dev, leadTime, cycleTime, bugRate, signal, bugsCount: devBugs.length, issuesCount: devIssues.length };
        });

        const teamSize = teamDevs.length;
        const validLT = memberRows.map((r) => r.leadTime).filter((v) => v !== null);
        const validCT = memberRows.map((r) => r.cycleTime).filter((v) => v !== null);
        const avgLT = validLT.length > 0 ? parseFloat((validLT.reduce((s, v) => s + v, 0) / validLT.length).toFixed(2)) : null;
        const avgCT = validCT.length > 0 ? parseFloat((validCT.reduce((s, v) => s + v, 0) / validCT.length).toFixed(2)) : null;
        const totalIssues = memberRows.reduce((s, r) => s + r.issuesCount, 0);
        const totalBugs = memberRows.reduce((s, r) => s + r.bugsCount, 0);
        const teamBugRate = totalIssues > 0 ? parseFloat(((totalBugs / totalIssues) * 100).toFixed(1)) : 0;

        let teamSignal;
        if (teamBugRate > 0 && (avgLT ?? 0) >= 5) teamSignal = "Watch bottlenecks";
        else if (teamBugRate > 0) teamSignal = "Watch bottlenecks";
        else if ((avgLT ?? 0) >= 5) teamSignal = "Watch bottlenecks";
        else teamSignal = "Healthy flow";

        return (
          <div key={mgr.manager_id} className="mgr-card">
            <div className="mgr-header">
              <div className="mgr-avatar">{mgr.manager_name.charAt(0)}</div>
              <div>
                <div className="mgr-name">{mgr.manager_name}</div>
                <div className="mgr-sub">{mgr.manager_id} · {teamSize} reports · {mgr.team_name}</div>
              </div>
              <SignalBadge signal={teamSignal} />
            </div>

            <div className="mgr-agg-strip">
              <div className="mgr-agg-item">
                <span className="mgr-agg-val">{avgLT ?? "—"}</span>
                <span className="mgr-agg-label">Avg Lead Time (d)</span>
              </div>
              <div className="mgr-agg-item">
                <span className="mgr-agg-val">{avgCT ?? "—"}</span>
                <span className="mgr-agg-label">Avg Cycle Time (d)</span>
              </div>
              <div className="mgr-agg-item">
                <span className="mgr-agg-val">{teamBugRate}%</span>
                <span className="mgr-agg-label">Team Bug Rate</span>
              </div>
            </div>

            <table className="mgr-table">
              <thead>
                <tr>
                  <th>Developer</th>
                  <th>Level</th>
                  <th>Lead Time</th>
                  <th>Cycle Time</th>
                  <th>Bug Rate</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                {memberRows.map(({ dev, leadTime, cycleTime, bugRate, signal }) => (
                  <tr key={dev.developer_id}>
                    <td className="mgr-devname">{dev.developer_name}</td>
                    <td>{dev.level}</td>
                    <td>{leadTime !== null ? `${leadTime}d` : "—"}</td>
                    <td>{cycleTime !== null ? `${cycleTime}d` : "—"}</td>
                    <td>{bugRate}%</td>
                    <td><SignalBadge signal={signal} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
