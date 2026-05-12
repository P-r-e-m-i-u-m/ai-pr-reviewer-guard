import assert from "node:assert/strict";
import test from "node:test";
import { applyConfig, applyRuleWeights } from "./config.js";
const config = {
    ignorePaths: ["dist/**", "package-lock.json"],
    ruleWeights: {
        "large-pr": 7
    }
};
function file(path) {
    return {
        path,
        additions: 1,
        deletions: 0,
        status: "modified"
    };
}
test("filters ignored paths", () => {
    const files = applyConfig([
        file("dist/index.js"),
        file("package-lock.json"),
        file("src/index.ts")
    ], config);
    assert.deepEqual(files.map((item) => item.path), ["src/index.ts"]);
});
test("applies configured rule weights", () => {
    const finding = {
        ruleId: "large-pr",
        title: "Large PR",
        detail: "Large PR",
        category: "reviewability",
        level: "medium",
        points: 18,
        files: ["src/index.ts"]
    };
    assert.equal(applyRuleWeights([finding], config)[0].points, 7);
});
//# sourceMappingURL=config.test.js.map