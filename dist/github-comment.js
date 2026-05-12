import * as github from "@actions/github";
const marker = "<!-- ai-pr-reviewer-guard -->";
export async function upsertPullRequestComment(token, body) {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return;
    }
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const issue_number = pullRequest.number;
    const comments = await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number,
        per_page: 100
    });
    const previous = comments.data.find((comment) => comment.body?.includes(marker));
    if (previous) {
        await octokit.rest.issues.updateComment({
            owner,
            repo,
            comment_id: previous.id,
            body
        });
        return;
    }
    await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body
    });
}
//# sourceMappingURL=github-comment.js.map