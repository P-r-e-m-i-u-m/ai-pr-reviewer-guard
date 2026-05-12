import { execFileSync } from "node:child_process";
function git(args, cwd) {
    return execFileSync("git", args, {
        cwd,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
    }).trimEnd();
}
export function resolveRef(ref, fallback, cwd) {
    return ref?.trim() || process.env[fallback] || "";
}
export function getDefaultBase(cwd) {
    try {
        const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], cwd);
        if (upstream) {
            return upstream;
        }
    }
    catch {
        // No upstream on new branches. Fall through to common defaults.
    }
    for (const candidate of ["origin/main", "origin/master", "main", "master"]) {
        try {
            git(["rev-parse", "--verify", candidate], cwd);
            return candidate;
        }
        catch {
            // Try the next common branch name.
        }
    }
    return "HEAD~1";
}
export function getDiff(baseInput, headInput, cwd = process.cwd()) {
    const base = baseInput || process.env.PR_BASE_SHA || process.env.GITHUB_BASE_REF || getDefaultBase(cwd);
    const head = headInput || process.env.PR_HEAD_SHA || process.env.GITHUB_SHA || "HEAD";
    const nameStatus = git(["diff", "--name-status", "--find-renames", `${base}...${head}`], cwd);
    const numstat = git(["diff", "--numstat", "--find-renames", `${base}...${head}`], cwd);
    const patch = git(["diff", "--unified=0", "--find-renames", `${base}...${head}`], cwd);
    const stats = new Map();
    for (const line of numstat.split("\n").filter(Boolean)) {
        const [addedRaw, deletedRaw, ...pathParts] = line.split("\t");
        const path = normalizeRenamePath(pathParts.join("\t"));
        stats.set(path, {
            additions: Number.parseInt(addedRaw, 10) || 0,
            deletions: Number.parseInt(deletedRaw, 10) || 0
        });
    }
    const patchByFile = splitPatchByFile(patch);
    const files = nameStatus
        .split("\n")
        .filter(Boolean)
        .map((line) => {
        const [statusRaw, ...pathParts] = line.split("\t");
        const statusCode = statusRaw[0];
        const path = normalizeRenamePath(pathParts.join("\t"));
        const status = statusCode === "A" ? "added" :
            statusCode === "M" ? "modified" :
                statusCode === "D" ? "deleted" :
                    statusCode === "R" ? "renamed" :
                        "unknown";
        const fileStats = stats.get(path) ?? { additions: 0, deletions: 0 };
        return {
            path,
            status,
            additions: fileStats.additions,
            deletions: fileStats.deletions,
            patch: patchByFile.get(path)
        };
    });
    return { base, head, files };
}
function normalizeRenamePath(path) {
    const parts = path.split("\t").filter(Boolean);
    if (parts.length > 1) {
        return parts.at(-1) ?? path;
    }
    return path.replace(/^\{.* => /, "").replace(/\}$/, "");
}
function splitPatchByFile(patch) {
    const result = new Map();
    let currentPath;
    let currentLines = [];
    for (const line of patch.split("\n")) {
        if (line.startsWith("diff --git ")) {
            if (currentPath) {
                result.set(currentPath, currentLines.join("\n"));
            }
            currentLines = [line];
            currentPath = undefined;
            continue;
        }
        const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
        if (fileMatch) {
            currentPath = fileMatch[1];
        }
        currentLines.push(line);
    }
    if (currentPath) {
        result.set(currentPath, currentLines.join("\n"));
    }
    return result;
}
//# sourceMappingURL=git.js.map