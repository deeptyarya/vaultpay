---
name: test-plan
description: Draft a structured test plan for a VaultPay feature. Saves to docs/test-plans/{feature}.md. Recommended before /generate-tests, but /generate-tests can run without it and will create the plan at the end.
argument-hint: [feature name — e.g. "auth", "send-money", "cards", or blank for full suite]
---

# Test Plan Skill — VaultPay

## Step 1 — Load References

Read the following reference files:
- `domain.md` — app facts, mock data, all timing delays, page state machine
- `business-rules.md` — exact validation rules, error messages, toast text, visual thresholds
- `test-planning.md` — required TC structure, category buckets, coverage checklist, TC ID convention table


## Step 2 — Draft Scenarios

For the requested feature, work through the 6 category buckets defined in `references/test-planning.md`:
**Happy Path | Business Rule | Negative | Edge Case | Security | UI State**

Use the coverage checklist in `test-planning.md` to ensure no scenario type is missed.

## Step 3 — Assign Layer

For each scenario, assign its test layer inline:
- Multi-step browser flow with navigation, timing, or toast/modal → **E2E**
- Single component rendering in isolation → **Component**
- Pure logic (validators, filter functions, score calculation) → **Unit**
- Never assign API layer — VaultPay has no backend

## Step 4 — Write Output

Save the scenarios to `docs/test-plans/{feature}.md` using the `{Prefix}-TC-NNN` format defined in `references/test-planning.md` (TC ID Convention table). Each file's numbering starts at 001.

If no feature is specified, generate the full suite in order:
Auth → Navigation → Dashboard → Transactions → Send Money → Cards → Budget → Settings → Toast/Modal → Security

When appending to an existing file, continue numbering from the last existing TC in that file.
