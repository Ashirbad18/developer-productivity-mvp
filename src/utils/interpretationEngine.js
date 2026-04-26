/**
 * Interprets the 5 metrics and returns a health signal, pattern story,
 * and 1-2 actionable next steps.
 *
 * Thresholds derived from the assignment's Metric_Examples sheet signals:
 *   - "Healthy flow"    : no escaped bugs, lead time < 5, cycle time < 5
 *   - "Quality watch"   : ≥ 1 escaped bug in month (bug rate > 0)
 *   - "Needs review"    : lead time ≥ 6 or cycle time ≥ 6 (no bug this month)
 */
export function interpretMetrics(metrics) {
  const { leadTime, cycleTime, bugRate, deploymentFrequency } = metrics;

  let status = "";
  let signal = "";
  let pattern = "";
  let nextSteps = [];
  let healthColor = "gray";
  let summary = "";

  const lt = leadTime ?? 0;
  const ct = cycleTime ?? 0;

  // --- Decision tree matching the workbook's signal logic ---
  if (bugRate > 0 && (lt >= 5 || ct >= 5)) {
    // Slow AND has bugs
    status = "⚠️ At Risk";
    signal = "At Risk";
    pattern = "Slow delivery with quality issues";
    healthColor = "red";
    summary = `Your lead time (${lt}d) and cycle time (${ct}d) are on the longer side, and ${metrics.rawData.bugsCount} escaped bug(s) were found this month. Speed and quality are both under pressure.`;
    nextSteps = [
      "Break work into smaller PRs (aim for < 300 lines changed) to reduce review time and bug surface area.",
      "Add targeted tests around the areas where bugs escaped before merging.",
    ];
  } else if (bugRate > 0) {
    // Bugs present but speed is okay
    status = "👀 Quality Watch";
    signal = "Quality watch";
    pattern = "Quality needs attention";
    healthColor = "amber";
    summary = `Your delivery speed looks reasonable (${lt}d lead time, ${ct}d cycle time), but ${metrics.rawData.bugsCount} bug(s) escaped to production this month.`;
    nextSteps = [
      "Review the root cause of the escaped bug(s) — are tests missing for edge cases?",
      "Consider a brief checklist before marking a PR ready for review.",
    ];
  } else if (lt >= 6 || ct >= 6) {
    // Slow but no bugs
    status = "🔍 Needs Review";
    signal = "Needs review";
    pattern = "Delivery is slower than expected";
    healthColor = "amber";
    summary = `No escaped bugs this month — great quality signal. But your lead time (${lt}d) or cycle time (${ct}d) suggests something is slowing delivery.`;
    nextSteps = [
      `Lead time of ${lt}d suggests PRs may be waiting too long for review or deployment. Try to get PRs reviewed within 24h.`,
      "Look for blockers or dependencies causing cycle time to stretch — a quick standup sync can help.",
    ];
  } else {
    // Healthy
    status = "✅ Healthy Flow";
    signal = "Healthy flow";
    pattern = "Sustainable delivery pace";
    healthColor = "green";
    summary = `No escaped bugs, ${lt}d average lead time, ${ct}d cycle time, and ${deploymentFrequency} deployment(s) this month. You're in a healthy delivery rhythm.`;
    nextSteps = [
      "Keep this pace — consistent delivery is more valuable than occasional bursts.",
      "You're in a good position to help teammates: consider pairing on a review or sharing your workflow.",
    ];
  }

  return {
    status,
    signal,
    pattern,
    nextSteps,
    healthColor,
    summary,
  };
}

/**
 * Interpret team-level metrics for the manager view
 */
export function interpretTeamMetrics(teamMetrics) {
  const { avgLeadTime, avgCycleTime, avgBugRate } = teamMetrics;
  const lt = avgLeadTime ?? 0;
  const ct = avgCycleTime ?? 0;

  if (avgBugRate > 0 && lt >= 5) {
    return { signal: "Watch bottlenecks", color: "amber", summary: `Avg lead time ${lt}d with ${avgBugRate}% team bug rate — quality and speed both need attention.` };
  } else if (avgBugRate > 0) {
    return { signal: "Watch bottlenecks", color: "amber", summary: `Delivery speed is OK, but the team has escaped bugs this month (${avgBugRate}% bug rate).` };
  } else if (lt >= 5) {
    return { signal: "Watch bottlenecks", color: "amber", summary: `No bugs, but avg lead time of ${lt}d suggests a delivery bottleneck.` };
  } else {
    return { signal: "Healthy flow", color: "green", summary: `Team is delivering well — ${lt}d avg lead time, ${ct}d avg cycle time, no escaped bugs.` };
  }
}
