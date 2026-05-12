import { writeFile } from "node:fs/promises";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { analyzePullRequest } from "./analyzer.js";
import { upsertPullRequestComment } from "./github-comment.js";
import { renderConsole, renderMarkdown } from "./report.js";
import { renderSarif } from "./sarif.js";
import { parseThreshold, shouldFail } from "./threshold.js";
export async function run() {
    try {
        const pullRequest = github.context.payload.pull_request;
        const base = core.getInput("base") || pullRequest?.base?.sha || undefined;
        const head = core.getInput("head") || pullRequest?.head?.sha || undefined;
        const configPath = core.getInput("config") || undefined;
        const sarifFile = core.getInput("sarif-file") || undefined;
        const failOn = parseThreshold(core.getInput("fail-on"));
        const shouldComment = core.getBooleanInput("comment");
        const token = core.getInput("token");
        const summary = analyzePullRequest({ base, head, configPath });
        const markdown = renderMarkdown(summary);
        core.info(renderConsole(summary));
        core.setOutput("risk-score", String(summary.score));
        core.setOutput("risk-level", summary.level);
        core.setOutput("findings", String(summary.findings.length));
        await core.summary.addRaw(markdown).write();
        if (sarifFile) {
            await writeFile(sarifFile, renderSarif(summary), "utf8");
            core.setOutput("sarif-file", sarifFile);
        }
        if (shouldComment && token) {
            await upsertPullRequestComment(token, markdown);
        }
        if (shouldFail(summary.level, failOn)) {
            core.setFailed(`AI PR Reviewer Guard blocked this PR: risk level ${summary.level} is at or above ${failOn}.`);
        }
    }
    catch (error) {
        core.setFailed(error instanceof Error ? error.message : String(error));
    }
}
run();
//# sourceMappingURL=index.js.map