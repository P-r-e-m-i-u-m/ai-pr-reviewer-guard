# Contributing

Thanks for helping improve AI PR Reviewer Guard.

## Good First Contributions

- add a new deterministic rule
- improve a rule explanation
- add tests for risky patterns
- add docs for a real maintainer workflow
- add examples for a specific ecosystem

## Rule Guidelines

A good rule should be:

- deterministic
- explainable in one paragraph
- low-noise
- useful to a maintainer before deep code review

Avoid rules that guess contributor intent. The project should flag risky diffs, not accuse people.

## Local Setup

```bash
npm install
npm run check
```

## Pull Request Checklist

- tests added or updated
- README/docs updated when behavior changes
- rule output is clear and respectful
- no external AI/API calls added without discussion
