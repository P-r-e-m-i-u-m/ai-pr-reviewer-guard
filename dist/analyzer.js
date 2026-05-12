import { getDiff } from "./git.js";
import { analyzeRules } from "./rules.js";
export function analyzePullRequest(options = {}) {
    const diff = getDiff(options.base, options.head, options.cwd);
    const findings = analyzeRules(diff.files);
    const score = Math.min(100, findings.reduce((sum, finding) => sum + finding.points, 0));
    const additions = diff.files.reduce((sum, file) => sum + file.additions, 0);
    const deletions = diff.files.reduce((sum, file) => sum + file.deletions, 0);
    return {
        score,
        level: scoreToLevel(score, findings.some((finding) => finding.level === "critical")),
        changedFiles: diff.files.length,
        additions,
        deletions,
        findings,
        recommendations: buildRecommendations(score, findings.length)
    };
}
export function scoreToLevel(score, hasCritical = false) {
    if (hasCritical || score >= 75)
        return "critical";
    if (score >= 50)
        return "high";
    if (score >= 20)
        return "medium";
    return "low";
}
function buildRecommendations(score, findingCount) {
    if (findingCount === 0) {
        return [
            "No high-signal risk patterns were detected.",
            "Still review the code behavior, tests, and product impact before merging."
        ];
    }
    const recommendations = [
        "Ask the author to explain why each risky area changed.",
        "Verify tests cover the behavior changed by this PR."
    ];
    if (score >= 50) {
        recommendations.push("Consider requiring a second reviewer before merge.");
    }
    if (score >= 75) {
        recommendations.push("Block merge until critical findings are resolved or explicitly accepted.");
    }
    return recommendations;
}
//# sourceMappingURL=analyzer.js.map