# AI PR Reviewer Guard

AI PR Reviewer Guard is a GitHub Action and CLI that helps maintainers review AI-assisted pull requests faster.

It does **not** try to guess whether a human or AI wrote the code. Instead, it checks the diff for review risks that maintainers actually care about:

- dependency and lockfile changes
- CI workflow edits
- auth, security, infrastructure, and container changes
- possible secrets in the diff
- risky patterns like dynamic evaluation or shell execution
- large pull requests that are hard to review
- implementation changes without tests

The result is a simple risk score, a pull request comment, and an optional workflow failure when the risk is too high.

## Why This Exists

AI coding tools make it easier to open pull requests, but they also increase review pressure on maintainers. A reviewer still needs to know:

- What changed?
- Is this risky?
- Did dependencies change?
- Did tests change?
- Did the PR touch security-sensitive files?
- Should this wait for a second reviewer?

This project gives maintainers a fast first-pass guardrail before they spend deep review time.

## Quick Start

Create `.github/workflows/ai-pr-reviewer-guard.yml` in your repository:

```yaml
name: AI PR Reviewer Guard

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

permissions:
  contents: read
  pull-requests: write

jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: P-r-e-m-i-u-m/ai-pr-reviewer-guard@v1
        with:
          fail-on: high
          comment: true
```

## Local CLI

Install it from GitHub and run it locally in any Git repository:

```bash
npm install -D github:P-r-e-m-i-u-m/ai-pr-reviewer-guard
npx ai-pr-reviewer-guard --base origin/main --head HEAD
```

Markdown output:

```bash
npx ai-pr-reviewer-guard --base origin/main --head HEAD --format markdown
```

## Action Inputs

| Input | Default | Description |
| --- | --- | --- |
| `base` | pull request base | Base ref, branch, or SHA. |
| `head` | pull request head | Head ref, branch, or SHA. |
| `fail-on` | `high` | Fail at or above `low`, `medium`, `high`, `critical`, or use `never`. |
| `comment` | `true` | Post or update a sticky pull request comment. |
| `token` | `${{ github.token }}` | Token used for PR comments. |

## Risk Levels

| Level | Meaning |
| --- | --- |
| `low` | No strong signals found. Review normally. |
| `medium` | Needs focused maintainer attention. |
| `high` | Risky enough to require careful review before merge. |
| `critical` | Block until resolved or explicitly accepted. |

## Example Report

```text
AI PR Reviewer Guard: HIGH (66/100)
Files: 12, +730, -44

[HIGH] Security-sensitive files changed
  The pull request touches CI, auth, secrets, infrastructure, containers, or security-related paths.
  Files: .github/workflows/deploy.yml, src/auth/session.ts

[MEDIUM] No test files changed
  Multiple implementation files changed without any test or spec file updates.
  Files: src/auth/session.ts, src/api/router.ts, src/db/user.ts
```

## What It Does Not Do

- It does not send code to an AI provider.
- It does not replace human review.
- It does not accuse contributors of using AI.
- It does not make merge decisions alone.

## Recommended Policy

For open-source projects:

```yaml
with:
  fail-on: critical
  comment: true
```

For production applications:

```yaml
with:
  fail-on: high
  comment: true
```

For learning projects:

```yaml
with:
  fail-on: never
  comment: true
```

## Development

```bash
npm install
npm run check
```

Build output is committed because GitHub JavaScript actions execute the `dist` entrypoint.

## Roadmap

- configurable rule weights
- SARIF output for code scanning
- ignore file support
- organization-level policy presets
- better language-specific risky pattern packs

## License

MIT
