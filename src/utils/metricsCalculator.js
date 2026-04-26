export function calculateMetrics(developerId, month, data) {
  // Issues completed by this developer in this month
  const devIssues = data.issues.filter(
    (i) =>
      i.developer_id === developerId &&
      i.month_done === month &&
      i.status === "Done"
  );

  // PRs merged by this developer in this month
  const devPRs = data.prs.filter(
    (p) =>
      p.developer_id === developerId &&
      p.month_merged === month &&
      p.status === "merged"
  );

  // Successful prod deployments by this developer in this month
  const devDeployments = data.deployments.filter(
    (d) =>
      d.developer_id === developerId &&
      d.month_deployed === month &&
      d.environment === "prod" &&
      d.status === "success"
  );

  // Escaped bugs attributed to this developer in this month
  const devBugs = data.bugs.filter(
    (b) =>
      b.developer_id === developerId &&
      b.month_found === month &&
      b.escaped_to_prod === "Yes"
  );

  // --- Metric calculations (using assignment definitions) ---

  // Lead Time: avg days from PR opened → prod deployment
  const leadTime =
    devDeployments.length > 0
      ? parseFloat(
          (
            devDeployments.reduce((sum, d) => sum + d.lead_time_days, 0) /
            devDeployments.length
          ).toFixed(2)
        )
      : null;

  // Cycle Time: avg days from issue In Progress → Done
  const cycleTime =
    devIssues.length > 0
      ? parseFloat(
          (
            devIssues.reduce((sum, i) => sum + i.cycle_time_days, 0) /
            devIssues.length
          ).toFixed(2)
        )
      : null;

  // Bug Rate: escaped bugs / issues completed (as a ratio, display as %)
  const bugRate =
    devIssues.length > 0
      ? parseFloat(
          ((devBugs.length / devIssues.length) * 100).toFixed(1)
        )
      : 0;

  // Deployment Frequency: count of prod deployments
  const deploymentFrequency = devDeployments.length;

  // PR Throughput: count of merged PRs
  const prThroughput = devPRs.length;

  return {
    leadTime,
    cycleTime,
    bugRate,
    deploymentFrequency,
    prThroughput,
    rawData: {
      issuesCompleted: devIssues.length,
      prsCount: devPRs.length,
      deploymentsCount: devDeployments.length,
      bugsCount: devBugs.length,
      bugs: devBugs,
      issues: devIssues,
    },
  };
}

/**
 * Calculate team-level aggregate metrics for manager view
 */
export function calculateTeamMetrics(managerId, month, data) {
  const teamDevs = data.developers.filter((d) => d.manager_id === managerId);
  const teamDevIds = teamDevs.map((d) => d.developer_id);

  const teamResults = teamDevs.map((dev) => ({
    developer: dev,
    metrics: calculateMetrics(dev.developer_id, month, data),
  }));

  // Aggregate
  const validLeadTimes = teamResults
    .map((r) => r.metrics.leadTime)
    .filter((v) => v !== null);
  const validCycleTimes = teamResults
    .map((r) => r.metrics.cycleTime)
    .filter((v) => v !== null);

  const avgLeadTime =
    validLeadTimes.length > 0
      ? parseFloat(
          (validLeadTimes.reduce((s, v) => s + v, 0) / validLeadTimes.length).toFixed(2)
        )
      : null;

  const avgCycleTime =
    validCycleTimes.length > 0
      ? parseFloat(
          (validCycleTimes.reduce((s, v) => s + v, 0) / validCycleTimes.length).toFixed(2)
        )
      : null;

  const totalIssues = teamResults.reduce(
    (s, r) => s + r.metrics.rawData.issuesCompleted, 0
  );
  const totalBugs = teamResults.reduce(
    (s, r) => s + r.metrics.rawData.bugsCount, 0
  );
  const avgBugRate =
    totalIssues > 0
      ? parseFloat(((totalBugs / totalIssues) * 100).toFixed(1))
      : 0;

  const totalDeployments = teamResults.reduce(
    (s, r) => s + r.metrics.deploymentFrequency, 0
  );
  const totalPRs = teamResults.reduce(
    (s, r) => s + r.metrics.prThroughput, 0
  );

  return {
    avgLeadTime,
    avgCycleTime,
    avgBugRate,
    totalDeployments,
    totalPRs,
    teamSize: teamDevs.length,
    memberResults: teamResults,
  };
}
