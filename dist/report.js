const levelEmoji = {
    low: "OK",
    medium: "WARN",
    high: "HIGH",
    critical: "CRITICAL"
};
export function renderMarkdown(summary) {
    const findings = summary.findings.length
        ? summary.findings.map(renderFinding).join("\n\n")
        : "No rule findings. Review normally.";
    const recommendations = summary.recommendations.map((item) => `- ${item}`).join("\n");
    return [
        "<!-- ai-pr-reviewer-guard -->",
        "# AI PR Reviewer Guard",
        "",
        `**Risk:** ${levelEmoji[summary.level]} ${summary.level.toUpperCase()} (${summary.score}/100)`,
        "",
        "| Changed files | Additions | Deletions | Findings |",
        "| ---: | ---: | ---: | ---: |",
        `| ${summary.changedFiles} | ${summary.additions} | ${summary.deletions} | ${summary.findings.length} |`,
        "",
        "## Findings",
        "",
        findings,
        "",
        "## Recommended Review Steps",
        "",
        recommendations,
        "",
        "_This report uses deterministic diff rules. It does not send repository code to an AI provider._"
    ].join("\n");
}
export function renderConsole(summary) {
    const lines = [
        `AI PR Reviewer Guard: ${summary.level.toUpperCase()} (${summary.score}/100)`,
        `Files: ${summary.changedFiles}, +${summary.additions}, -${summary.deletions}`,
        ""
    ];
    if (summary.findings.length === 0) {
        lines.push("No findings.");
        return lines.join("\n");
    }
    for (const finding of summary.findings) {
        lines.push(`[${finding.level.toUpperCase()}] ${finding.title}`);
        lines.push(`  ${finding.detail}`);
        lines.push(`  Files: ${finding.files.join(", ")}`);
    }
    return lines.join("\n");
}
function renderFinding(finding) {
    const files = finding.files.slice(0, 10).map((file) => `\`${file}\``).join(", ");
    const extra = finding.files.length > 10 ? ` and ${finding.files.length - 10} more` : "";
    return [
        `### ${finding.title}`,
        "",
        `- **Rule:** \`${finding.ruleId}\``,
        `- **Level:** ${finding.level}`,
        `- **Category:** ${finding.category}`,
        `- **Why it matters:** ${finding.detail}`,
        `- **Files:** ${files}${extra}`
    ].join("\n");
}
//# sourceMappingURL=report.js.map