---
name: generate-tests
description: Write, run, and validate Playwright E2E tests for VaultPay. Reads the test plan, generates the spec, runs it, then self-reviews.
argument-hint: [feature name or TC IDs — e.g. "auth", "cards", "Send-TC-001", "Cards-TC-004 Cards-TC-005"]
---

# Generate Tests Skill — VaultPay

## Step 1 — Load References

Read all files in `.claude/references/`:
- `domain.md` — app facts, mock data, timing delays
- `business-rules.md` — every exact error message and toast string used in assertions
- `ui-selectors.md` — all valid `data-testid` values
- `user-flows.md` — flows, async delay details, known limitations
- `test-spec-template.md` — required code structure, async patterns, anti-patterns

## Step 2 — Read the Test Plan

Read `docs/test-plans/{feature}.md` for the TCs to implement.

If the file does not exist: stop and tell the user to run `/test-plan {feature}` first.

If specific TC IDs are given (e.g. `Send-TC-001`), locate them in the appropriate test plan file using the prefix to identify the feature (see TC ID Convention table in `references/test-planning.md`).

## Step 3 — Filter to E2E Layer

Only write Playwright specs for TCs assigned **E2E** in the test plan. For TCs assigned Component or Unit, note them and skip — they belong in a different test runner.

## Step 4 — Write the Spec

Write to `tests/e2e/{feature}.spec.ts`. If a file already exists for this feature, add to it rather than creating a duplicate.

Follow `tests/e2e/CLAUDE.md` (always-on conventions) and `references/test-spec-template.md` for code structure. Key requirements:

- **File header**: open with the JSDoc block defined in `tests/e2e/CLAUDE.md` — feature name, test plan path, E2E TC IDs covered, skipped TC IDs with layer and reason.
- **Imports**: from `./fixtures` only — no inline credentials.
- **TC naming**: test title starts with `{Prefix}-TC-NNN:`.
- **Step comments**: `// Step N:` for any test with more than 3 actions.
- **Known limitations**: `// KNOWN LIMITATION: {description}` as the first line in those test bodies.
- **Async waits**: no `waitForTimeout` — wait on outcome elements.

Verify every `data-testid` against `references/ui-selectors.md` before use.
Verify every asserted string against `references/business-rules.md` — character for character.

## Step 5 — Run and Debug

```bash
npx playwright test tests/e2e/{feature}.spec.ts --reporter=line
```

Read failure output → diagnose (timeout = wrong selector or missing wait; assertion mismatch = wrong text string) → fix → rerun. Repeat until all tests pass.

## Step 6 — Self-Review

After tests pass, run `references/review-checklist.md` against the generated spec:
- Verify every `data-testid` in the spec exists in `references/ui-selectors.md`
- Verify every asserted string matches `references/business-rules.md`
- Check for anti-patterns from `test-spec-template.md`

Tag any issues `[CRITICAL]` / `[IMPORTANT]` / `[SUGGESTION]`. Fix all `[CRITICAL]` items before declaring done.

## Output

After all tests pass and review is clean:

```
## Generated: tests/e2e/{feature}.spec.ts
TCs covered: {Prefix}-TC-001, {Prefix}-TC-002, …
Business rules verified: [list]
Async delays handled: [list]
Known limitations noted: [list if any]
```
