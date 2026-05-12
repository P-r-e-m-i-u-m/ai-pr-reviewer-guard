import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
const configSchema = z.object({
    ignorePaths: z.array(z.string()).default([]),
    ruleWeights: z.record(z.number().int().min(0).max(100)).default({})
}).default({
    ignorePaths: [],
    ruleWeights: {}
});
export function loadConfig(cwd, configPath) {
    const candidates = configPath
        ? [resolve(cwd, configPath)]
        : [join(cwd, ".aiprguard.json"), join(cwd, ".ai-pr-reviewer-guard.json")];
    const found = candidates.find((candidate) => existsSync(candidate));
    if (!found) {
        return { ignorePaths: [], ruleWeights: {} };
    }
    const parsed = JSON.parse(readFileSync(found, "utf8"));
    return configSchema.parse(parsed);
}
export function applyConfig(files, config) {
    if (config.ignorePaths.length === 0) {
        return files;
    }
    return files.filter((file) => !config.ignorePaths.some((pattern) => matchesPath(pattern, file.path)));
}
export function applyRuleWeights(findings, config) {
    return findings.map((finding) => {
        const override = config.ruleWeights[finding.ruleId];
        return override === undefined ? finding : { ...finding, points: override };
    });
}
function matchesPath(pattern, path) {
    const normalizedPattern = pattern.replaceAll("\\", "/");
    const normalizedPath = path.replaceAll("\\", "/");
    const escaped = normalizedPattern
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replaceAll("**", ".*")
        .replaceAll("*", "[^/]*");
    return new RegExp(`^${escaped}$`).test(normalizedPath);
}
//# sourceMappingURL=config.js.map