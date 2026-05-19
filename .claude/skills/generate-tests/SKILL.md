---
name: generate-tests
description: Write, run, and validate Playwright E2E tests for VaultPay using the POM framework. Reads existing page objects and flows, generates the spec, runs it, then self-reviews. A test plan is recommended but not required.
argument-hint: [feature name or TC IDs — e.g. "auth", "cards", "Send-TC-001", "Cards-TC-004 Cards-TC-005"]
---

# Generate Tests Skill — VaultPay

## Step 1 — Load References

Read the following for domain knowledge and conventions:
- `.claude/references/business-rules.md` — every exact toast string and error message used in assertions
- `.claude/references/test-spec-template.md` — code structure, async patterns, anti-patterns
- `tests/e2e/CLAUDE.md` — import rules, locator conventions, TC naming, async patterns, authoring rules

For selectors and existing implementations, read the source directly — these are the authoritative sources:
- `tests/e2e/pages/*.ts` — all page objects (locators, methods)
- `tests/e2e/flows/*.ts` — all flow classes (multi-step sequences)

Do NOT read `references/ui-selectors.md` for implementation — it may lag behind the code.

## Step 2 — Load Test Plan (Optional)

If `docs/test-plans/{feature}.md` exists → read it.

If it does NOT exist → proceed using the user's description or conversation context to identify what scenarios to automate. Record these scenarios — a test plan will be written at Step 8.

Do NOT stop if no test plan exists.

If specific TC IDs are given (e.g. `Send-TC-001`), locate them in the appropriate test plan file using the prefix to identify the feature (see TC ID Convention table in `references/test-planning.md`).

## Step 3 — Filter to E2E Layer

From the test plan or user scenarios, retain only TCs assigned **E2E** layer. For TCs assigned Component or Unit, skip them and note in the spec file header:

```typescript
// Skipped (Component): Cards-TC-002, Cards-TC-003 — isolated render, no browser navigation
// Skipped (Unit): Auth-TC-004 — email regex logic, no DOM interaction
```

This step is required whether the test plan was read or described inline.

## Step 4 — Check Existing Page Objects and Flows

Inspect `tests/e2e/pages/` and `tests/e2e/flows/`:

- If the feature already has a page object → reuse its methods and locators in the spec.
- If it already has a flow → reuse it for multi-step sequences.
- If the feature needs a **new page object** → create it before writing the spec. Follow the patterns in existing page objects:
  - Extend `BasePage`; `path` as readonly; `requiredElements` as a getter
  - Sidebar-only pages: set `path = ''`, override `navigate()` to throw, expose `navigateViaSidebar()` as public
  - Dynamic locators (parameterized by ID): methods returning `Locator`, not pre-bound properties
  - Register in `tests/e2e/fixtures/base-fixture.ts`
- If the feature needs a **new flow** → create it before writing the spec. Follow the patterns in existing flows:
  - Constructor takes one page object
  - Call page object methods only — **never access `page` directly**
  - Register in `tests/e2e/fixtures/base-fixture.ts`

## Step 5 — Write the Spec

Write to `tests/e2e/tests/{feature}.spec.ts`. If the file already exists, add to it rather than creating a duplicate.

Follow `tests/e2e/CLAUDE.md` (always-on conventions) and `references/test-spec-template.md` for code structure. Key requirements:

- **File header**: open with the JSDoc block — feature name, test plan path, E2E TC IDs covered, skipped TCs with layer and reason.
- **Imports**: from `../fixtures/base-fixture` and `../fixtures/test-users` — never from `@playwright/test` directly.
- **Auth**: `authFlow.loginAsDemo()` in `beforeEach` for authenticated feature tests.
- **Navigation**: `<featurePage>.navigateViaSidebar()` — not raw sidebar clicks.
- **Interactions**: page object methods — not raw `page.getByTestId(...).click()` in test body.
- **TC naming**: test title starts with `{Prefix}-TC-NNN:`.
- **Step comments**: `// Step N:` for any test with more than 3 actions.
- **Known limitations**: `// KNOWN LIMITATION: {description}` as the first line in those test bodies.
- **Async waits**: no `waitForTimeout` — use page object methods or `.waitFor({ state: 'visible' })` on outcome locators.

Verify every asserted string against `references/business-rules.md` — character for character.

## Step 6 — Run and Debug

```bash
npx playwright test tests/e2e/tests/{feature}.spec.ts --reporter=line
```

Read failure output → diagnose (timeout = wrong selector or missing wait; assertion mismatch = wrong text string) → fix → rerun. Repeat until all tests pass.

## Step 7 — Self-Review

After tests pass, run `references/review-checklist.md` against the generated spec and any new page objects or flows:
- Check Page Object & Fixture Usage section (POM pattern compliance)
- Check Async Delay Handling section
- Verify every asserted string matches `references/business-rules.md`
- Check for anti-patterns from `test-spec-template.md`

Tag any issues `[CRITICAL]` / `[IMPORTANT]` / `[SUGGESTION]`. Fix all `[CRITICAL]` items before declaring done.

## Step 8 — Backfill Test Plan (if missing)

If no test plan existed in Step 2, save the implemented scenarios now to `docs/test-plans/{feature}.md` using the TC format from `references/test-planning.md`. This ensures the test record is preserved for future developers.

## Output

After all tests pass and review is clean:

```
## Generated: tests/e2e/tests/{feature}.spec.ts
TCs covered: {Prefix}-TC-001, {Prefix}-TC-002, …
Page objects used/created: [list]
Flows used/created: [list]
Business rules verified: [list]
Async delays handled: [list]
Known limitations noted: [list if any]
Test plan backfilled: [yes/no — path if yes]
```
