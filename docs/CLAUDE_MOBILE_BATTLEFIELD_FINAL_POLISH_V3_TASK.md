# KodRaidoGame — Mobile Battlefield Final Polish V3

## Status

This is a **final visual QA + surgical polish pass** on top of the already merged Mobile Battlefield Controls V2.

Baseline:
- `main` contains PR #23 / Mobile Battlefield Controls V2.
- Current main HEAD when this task was created: `c3ead3f84757bfd7ce4c96d2edd0c55be26568ab`.
- The project Claude skills are now present under `.claude/skills/`.

This is **not** a redesign and not a gameplay task.

Before changing code, use the project skills that match this work, especially:
- `qa-testing`
- `art-direction`
- `design-standards`
- `code-review-web`
- `media-asset-management` if any image asset is touched
- `accessibility-audit` only for interaction/focus regressions that are actually relevant

Do not invoke skills mechanically just to mention them. Apply the useful guidance to the real task.

---

## 1. Goal

Run the current mobile battlefield as it exists on this branch, reproduce the important states on real rendered pages, and make only the smallest verified changes needed so the mobile battlefield reads as one coherent premium dark-fantasy physical game table.

The owner-approved direction is already established:
- painted arena is the physical UI surface;
- no generic floating web panels over painted housings;
- red opponent half, blue/violet player half;
- exactly five creature slots per side;
- ornate commander, deck, discard and End Turn mechanisms;
- compact usable hand dock;
- no document scroll;
- desktop remains frozen.

Do not replace this direction with a new one.

---

## 2. Mandatory first step: audit current `main` result before editing

Do not assume old screenshots still represent the current code.

The merged V2 controls pass already added production mobile commander/deck/discard/End Turn art and later QA fixed at least:
- player deck-count / `СБРОС` collision;
- mobile-only asset fetches leaking into desktop;
- selected-card overlay positioning above commander/Resonance.

Therefore:

1. start from the current branch exactly as checked out;
2. run the real app;
3. capture current screenshots first;
4. list only issues that are still reproducible now;
5. do not re-fix issues that are already solved.

If the current result is already correct in an area, leave that area untouched.

---

## 3. Frozen constraints

Do not change:
- gameplay rules;
- game engine;
- matchmaking;
- database schema;
- card balance;
- server rules;
- `MAX_BOARD_UNITS` (must remain `5`);
- number/order of the five opponent slots;
- number/order of the five player slots;
- desktop battlefield appearance at `>=1024px`;
- current tap-to-preview / drag-to-play interaction model;
- the approved Mobile Battlefield V2 background composition.

Do not create a second mobile battlefield implementation.

---

## 4. Visual audit checklist

Check these areas in the **real mobile match**, not in isolated mock HTML.

### A. Left Deck / Discard rail

Verify both opponent and player rails at counts including `0`, `1`, normal mid values and `25+` where practical.

Check:
- `КОЛОДА` and `СБРОС` remain readable;
- labels are not clipped by the viewport edge;
- counts do not collide with labels;
- count belongs visually to its own physical mechanism;
- deck/discard art is seated inside the painted housing;
- no generic rectangle is drawn over the painted rail.

Only change code if a defect is reproduced on the current build.

### B. Commanders

Verify both commander controls at normal HP and low HP.

Check:
- portrait/frame remains legible at actual phone size;
- HP is clearly readable and visually anchored to the frame;
- BOT / ТЫ label does not collide with hand pips or nearby mechanisms;
- targetable, damage and heal feedback still works;
- player commander remains tappable when targetable;
- no overlap with resting hand or Resonance makes important information unreadable.

### C. Opponent hand indicator

Check counts `0`, `1`, `3`, `8+` where reachable.

It must stay seated in the upper painted mechanism and never collide with the commander or creature row.

### D. Creature lanes

Verify `0/5`, `3/5`, `5/5` on each side.

Requirements:
- five fixed physical positions remain visible;
- occupied cards sit inside their matching painted slot;
- no centering-as-a-group behavior;
- no adjacent slot overlap;
- cost / ATK / HP remain readable at battlefield scale;
- empty slots do not gain generic card panels over the arena art.

### E. Raido Core / TIER

Verify at least `TIER 0` and one non-zero state if practical using a safe local fixture only.

Check:
- `TIER N` remains legible against the central mechanism;
- dynamic content is aligned to the painted Core;
- no extra chip/panel appears unless already part of the accepted design.

### F. Resonance

Verify at least `0/5` and a populated state if practical.

Check:
- label, nodes and value fit the lower painted housing;
- no clipping;
- readable but not neon-heavy;
- does not fight with commander or hand.

### G. End Turn

Verify:
- ready/active;
- disabled/enemy turn;
- pending/processing;
- pressed interaction.

The current production art must remain physically installed in the right-side mechanism. Preserve current click/disabled/pending semantics.

### H. Hand dock

Verify live hands of `1`, `3`, `5`, `7`, `10` cards where practical.

Check:
- no horizontal document overflow;
- no document-level vertical scroll;
- resting hand stays roughly within the established ~17% viewport-height design;
- first and last cards remain tappable;
- dense overlap remains readable enough to identify cost / faction accent / short name;
- selected/engaged card clears commander + Resonance and remains fully on-screen;
- drag ghost remains above the battlefield;
- preview modal opens/closes correctly;
- no card becomes impossible to select because of overlapping control hitboxes.

### I. Card preview / selected-card overlay

Verify character and event cards.

Check:
- modal is fully inside viewport;
- action buttons remain reachable;
- long names do not break layout;
- selected overlay does not clip left/right/top;
- selected overlay does not paint underneath commander/Resonance.

---

## 5. Required viewport matrix

At minimum test:
- `360 × 800`
- `390 × 844`
- `412 × 915`
- `430 × 932`

Also verify the breakpoint pair:
- one viewport just below `1024px`;
- desktop at `1024px` or above.

No document-level scroll or horizontal overflow may be introduced.

---

## 6. Desktop is regression-sensitive and frozen

At `>=1024px`, the approved desktop battlefield must remain visually unchanged.

Any shared React/component edit must be demonstrated to be neutral on desktop.

Required desktop check:
- `1440 × 900`

If practical, compare before/after screenshots pixel-wise or at minimum visually side-by-side.

Do not "improve" desktop while working on this task.

---

## 7. Change policy

Prefer tiny, measured fixes.

Good examples:
- a few percent coordinate adjustment inside an existing mobile slot;
- small mobile-only size/offset correction;
- text-shadow/contrast correction;
- mobile-only overlap/stacking fix;
- correcting an image fit mode or responsive `<picture>` path;
- restoring pointer-events to the intended interactive child.

Bad examples:
- new visual system;
- replacing painted mechanisms with CSS cards/panels;
- broad refactor without a reproduced defect;
- rewriting MatchBoard architecture;
- touching gameplay to make a visual screenshot easier;
- changing desktop styles as collateral damage.

Every source change must point to a reproduced current defect and a before/after observation.

---

## 8. Production asset rules

Current mobile production controls are already wired.

Do not regenerate or replace art unless a current, reproducible asset defect requires it.

If an image asset must change:
- use the existing asset family and naming conventions;
- keep transparency correct;
- use WebP where the current mobile-control family uses WebP;
- keep mobile-only asset loading mobile-only;
- verify no mobile-control asset is requested on desktop;
- report exact dimensions and file size;
- do not silently repaint/recompose approved art.

---

## 9. Verification

Before finalizing, run the repository's normal checks:
- lint;
- typecheck;
- full tests;
- production build.

Expected existing test baseline is currently in the ~349-test range. Report the actual current result, do not hard-code success.

Also run focused live-browser QA for the states above.

---

## 10. Required evidence

Attach current **before** and **after** screenshots for any area you changed.

At minimum provide final screenshots for:
- `390 × 844` resting battlefield;
- `390 × 844` dense hand;
- `390 × 844` selected hand card;
- `390 × 844` card preview;
- `412 × 915` resting battlefield;
- `1440 × 900` desktop regression.

If you changed Deck / Discard, include a screenshot proving the label/count spacing.

If you changed End Turn, show relevant state screenshots.

---

## 11. Git discipline

Work only on:

`claude/mobile-battlefield-final-polish-v3`

Before committing:
- show `git status --short`;
- show `git diff --stat`;
- verify there are no unrelated changes;
- verify all changed files are justified by reproduced defects.

Do not touch unrelated open PRs/branches.

Do not merge to `main`.

Push only this feature branch.

---

## 12. Final report

Report:
1. branch name;
2. baseline commit;
3. reproduced issues found before editing;
4. exact fixes made;
5. exact changed-file list;
6. final commit SHA;
7. lint result;
8. typecheck result;
9. test result;
10. build result;
11. mobile screenshot evidence;
12. desktop regression screenshot;
13. explicit confirmation: `MAX_BOARD_UNITS remains 5`;
14. explicit confirmation: `desktop battlefield unchanged`;
15. explicit confirmation: `gameplay logic unchanged`;
16. anything intentionally left unchanged because the current V2 result was already correct.

## Definition of Done

The current Mobile Battlefield V2 has been audited live, only real remaining defects were changed, all mobile controls still read as one physical premium KodRaido table, dense-hand interaction remains usable, five fixed slots per side remain intact, viewport-fit behavior remains scroll-free, desktop is visually unchanged, and all repository checks are green.
