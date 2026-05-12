import assert from "node:assert/strict";
import test from "node:test";
import { analyzeRules } from "./rules.js";
function file(path, patch = "+const ok = true;") {
    return {
        path,
        additions: 10,
        deletions: 1,
        status: "modified",
        patch
    };
}
test("flags dependency and missing test changes", () => {
    const findings = analyzeRules([
        file("package.json"),
        file("src/app.ts"),
        file("src/router.ts")
    ]);
    assert.ok(findings.some((finding) => finding.ruleId === "dependency-change"));
    assert.ok(findings.some((finding) => finding.ruleId === "missing-tests"));
});
test("flags possible secrets as critical", () => {
    const findings = analyzeRules([
        file("src/config.ts", "+const token = 'ghp_abcdefghijklmnopqrstuvwxyz123456';")
    ]);
    assert.equal(findings.find((finding) => finding.ruleId === "possible-secret")?.level, "critical");
});
test("does not flag missing tests when tests changed", () => {
    const findings = analyzeRules([
        file("src/app.ts"),
        file("src/router.ts"),
        file("tests/app.test.ts")
    ]);
    assert.equal(findings.some((finding) => finding.ruleId === "missing-tests"), false);
});
//# sourceMappingURL=rules.test.js.map