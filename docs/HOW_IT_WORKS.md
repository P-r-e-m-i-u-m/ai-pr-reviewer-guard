# How AI PR Reviewer Guard Works

AI PR Reviewer Guard follows a simple pipeline.

## 1. Read the Pull Request Diff

The action runs:

```bash
git diff --name-status --find-renames BASE...HEAD
git diff --numstat --find-renames BASE...HEAD
git diff --unified=0 --find-renames BASE...HEAD
```

This gives it:

- changed file names
- added and deleted line counts
- exact changed lines for pattern detection

## 2. Run Deterministic Rules

Each rule looks for a practical review signal:

- dependency files changed
- security-sensitive paths changed
- possible secrets added
- dangerous code patterns added
- multiple implementation files changed without tests
- large pull request size
- generated files changed
- CI changed without documentation context

If a `.aiprguard.json` file exists, the guard applies ignored paths and custom rule weights before scoring.

## 3. Score the Pull Request

Each finding adds points. The final score maps to:

- `low`: 0-19
- `medium`: 20-49
- `high`: 50-74
- `critical`: 75-100 or any critical finding

## 4. Report the Result

The action writes:

- GitHub step summary
- optional sticky pull request comment
- action outputs: `risk-score`, `risk-level`, `findings`
- optional SARIF report file for code scanning workflows

## 5. Optionally Block Merge

Use `fail-on` to decide when the workflow should fail.

Examples:

- `fail-on: never` only reports
- `fail-on: critical` blocks only the highest-risk changes
- `fail-on: high` blocks high and critical changes
