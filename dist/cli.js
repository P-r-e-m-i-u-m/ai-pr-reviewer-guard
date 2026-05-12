import { Command } from "commander";
import pc from "picocolors";
import { analyzePullRequest } from "./analyzer.js";
import { renderConsole, renderMarkdown } from "./report.js";
import { parseThreshold, shouldFail } from "./threshold.js";
const program = new Command()
    .name("ai-pr-reviewer-guard")
    .description("Score pull request risk using deterministic diff rules.")
    .option("--base <ref>", "Base ref, branch, or SHA")
    .option("--head <ref>", "Head ref, branch, or SHA", "HEAD")
    .option("--cwd <path>", "Repository path", process.cwd())
    .option("--format <format>", "Output format: text or markdown", "text")
    .option("--fail-on <level>", "Exit non-zero at or above: low, medium, high, critical, never", "high")
    .parse(process.argv);
const options = program.opts();
try {
    const summary = analyzePullRequest({
        base: options.base,
        head: options.head,
        cwd: options.cwd
    });
    const output = options.format === "markdown" ? renderMarkdown(summary) : renderConsole(summary);
    const color = summary.level === "critical" ? pc.red :
        summary.level === "high" ? pc.magenta :
            summary.level === "medium" ? pc.yellow :
                pc.green;
    console.log(options.format === "text" ? color(output) : output);
    const threshold = parseThreshold(options.failOn);
    if (shouldFail(summary.level, threshold)) {
        process.exitCode = 1;
    }
}
catch (error) {
    console.error(pc.red(error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
}
//# sourceMappingURL=cli.js.map