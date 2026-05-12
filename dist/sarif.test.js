import assert from "node:assert/strict";
import test from "node:test";
import { renderSarif } from "./sarif.js";
test("renders SARIF 2.1.0", () => {
    const summary = {
        score: 50,
        level: "high",
        changedFiles: 1,
        additions: 10,
        deletions: 0,
        recommendations: [],
        findings: [
            {
                ruleId: "dangerous-code-pattern",
                title: "Dangerous code pattern found",
                detail: "Unsafe pattern.",
                category: "security",
                level: "high",
                points: 28,
                files: ["src/app.ts"]
            }
        ]
    };
    const parsed = JSON.parse(renderSarif(summary));
    assert.equal(parsed.version, "2.1.0");
    assert.equal(parsed.runs[0].results[0].ruleId, "dangerous-code-pattern");
    assert.equal(parsed.runs[0].results[0].locations[0].physicalLocation.artifactLocation.uri, "src/app.ts");
});
//# sourceMappingURL=sarif.test.js.map