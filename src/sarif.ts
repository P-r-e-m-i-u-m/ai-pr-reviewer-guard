import type { ReviewSummary } from "./types.js";

export function renderSarif(summary: ReviewSummary): string {
  const rules = new Map(summary.findings.map((finding) => [
    finding.ruleId,
    {
      id: finding.ruleId,
      name: finding.title,
      shortDescription: { text: finding.title },
      fullDescription: { text: finding.detail },
      properties: {
        category: finding.category,
        riskLevel: finding.level
      }
    }
  ]));

  const results = summary.findings.flatMap((finding) =>
    finding.files.map((file) => ({
      ruleId: finding.ruleId,
      level: finding.level === "critical" || finding.level === "high" ? "error" : "warning",
      message: { text: finding.detail },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri: file.replaceAll("\\", "/") }
          }
        }
      ],
      properties: {
        riskLevel: finding.level,
        points: finding.points
      }
    }))
  );

  return JSON.stringify({
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: "AI PR Reviewer Guard",
            informationUri: "https://github.com/P-r-e-m-i-u-m/ai-pr-reviewer-guard",
            rules: [...rules.values()]
          }
        },
        results
      }
    ]
  }, null, 2);
}
