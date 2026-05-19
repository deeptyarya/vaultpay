# Skill Authoring Guide — VaultPay

Use this when updating an existing skill or adding a new one. It captures the architecture decisions behind the current skill design so changes stay consistent.

---

## Architecture Principles

**Two sources of truth — never three.**
- Domain facts (exact strings, mock data, timing delays) live in `.claude/references/`.
- Implementation (selectors, multi-step sequences) lives in `tests/e2e/pages/` and `tests/e2e/flows/`.
- Skills read from both — they do NOT maintain a third copy.

**Page objects own selectors. References do not.**
`/generate-tests` reads `tests/e2e/pages/*.ts` directly for locators. `ui-selectors.md` exists only as planning context for `/test-plan`. If you add a skill step that reads `ui-selectors.md` for implementation, it will silently use stale data whenever a testid changes.

**References contain assertions, not steps.**
`business-rules.md` holds character-perfect toast strings and validation messages — the values to assert against. It does not describe how to interact with the UI. Those are in the flow classes.

---

## Prompt to Update a Skill

Copy this into a new Claude Code session when modifying a skill:

```
You are updating the VaultPay test automation skills.

Architecture context:
- Framework: Playwright + POM (Page Object Model) with TypeScript
- Page objects: tests/e2e/pages/*.ts — authoritative source for all selectors
- Flows: tests/e2e/flows/*.ts — multi-step sequences (call PO methods only, never page directly)
- Fixtures: tests/e2e/fixtures/base-fixture.ts — wires all pages and flows as Playwright test fixtures
- Spec files: tests/e2e/tests/{feature}.spec.ts — import from base-fixture, not @playwright/test
- Test plans: docs/test-plans/{feature}.md — TC format defined in .claude/references/test-planning.md
- Domain facts: .claude/references/domain.md + business-rules.md
- Always-on rules: tests/e2e/CLAUDE.md (applies to all code in tests/e2e/)

Key constraints (must not be violated by any skill step):
1. Flows call page object methods only — never page.getByTestId() or page.goto() directly
2. Spec files import test/expect from '../fixtures/base-fixture', not '@playwright/test'
3. /generate-tests reads tests/e2e/pages/*.ts for selectors — NOT ui-selectors.md (stale)
4. /generate-tests does not require a test plan — it backfills docs/test-plans/ at the end if missing
5. Assertions use exact strings from business-rules.md — no paraphrasing

The skill to update is: [SKILL NAME]
The change I need: [DESCRIBE THE CHANGE]
```

---

## Prompt to Add a New Skill

```
You are adding a new Claude Code skill to the VaultPay test automation repo.

Existing skills for reference:
- .claude/skills/test-plan/SKILL.md — 4-step skill that drafts TC scenarios
- .claude/skills/generate-tests/SKILL.md — 8-step skill that writes, runs, and reviews Playwright specs

A skill file must:
- Open with YAML frontmatter: name, description, argument-hint
- List numbered steps that can be followed mechanically
- Reference only files that actually exist in the repo
- Not duplicate knowledge already in tests/e2e/CLAUDE.md or .claude/references/

Register the new skill by adding its directory and SKILL.md to .claude/skills/,
then add a row to the Skills table in .claude/README.md.

The new skill should: [DESCRIBE WHAT IT DOES]
```

---

## Validation After a Skill Change

Run this sequence to confirm the skill still works end-to-end:

```bash
# 1. TypeScript — zero errors after any PO or fixture change
npx tsc --noEmit

# 2. Full suite — 0 failures (current baseline: 18 tests)
npx playwright test --reporter=line

# 3. Manual skill run — pick a feature with a test plan but no spec, or re-run an existing one
#    In Claude Code CLI: /generate-tests dashboard
#    Verify: spec written to tests/e2e/tests/, tests pass, self-review is clean

# 4. Ad-hoc path — confirm /generate-tests works without a pre-existing test plan
#    Delete docs/test-plans/budget.md, run /generate-tests budget,
#    verify spec + plan are both created
```

---

## What NOT to put in a skill

| Do not add to skill steps | Reason |
|---|---|
| Inline selector strings (`data-testid="freeze-CARD-001"`) | Page objects own selectors — will go stale |
| Step-by-step UI flow descriptions | Flows implement these — duplicating creates drift |
| `import { test } from '@playwright/test'` in examples | Anti-pattern — use base-fixture |
| Hard-coded credential strings | Reference `DEMO_USER` from `test-users.ts` |
| `page.waitForTimeout(N)` patterns | Anti-pattern — wait on outcome elements |
| New reference files for things already in pages/*.ts or flows/*.ts | Adds a third copy that will drift |
