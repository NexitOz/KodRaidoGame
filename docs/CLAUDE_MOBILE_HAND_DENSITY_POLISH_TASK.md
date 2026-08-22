# Claude Task — Mobile Battlefield: Dense Hand Polish

## Baseline

Work **only** from branch `claude/mobile-hand-density-polish-v1`.

Baseline commit: `0df1eb0c9e6dcbe93a2aec99bbebd8d23df20343` (`main`, merged PR #23).

PR #23 / Mobile Battlefield Controls V2 is already accepted. Treat it as production baseline, not as a redesign target.

## Goal

Finish the remaining mobile visual polish visible after the accepted 14-screenshot Controls V2 QA pass:

1. make dense hands (especially 8–10 cards) read as one controlled fan instead of a crowded strip;
2. keep the selected/previewed card immediately readable;
3. preserve the accepted battlefield geometry and all existing gameplay interactions;
4. if the deck/discard pair still visually collapses into one heavy cluster at 390×844, fix only its mobile spacing/scale, without moving the battlefield slots or Core.

This is a **mobile-only visual/UX polish pass**, not a gameplay task and not a battlefield redesign.

## Frozen / do not change

Do **not** change:

- game rules, server logic, matchmaking, DB, card balance, drag/drop semantics;
- central Raido Core;
- 5 + 5 creature slot geometry;
- accepted V2 arena artwork;
- commander art/state behavior from PR #23;
- End Turn state logic or accepted active/idle/disabled assets;
- Resonance behavior;
- desktop layout or desktop visual result at `>= 1024px`;
- the existing portal-based selected/previewed-card escalation behavior unless a regression is proven.

## Primary files

Start by inspecting:

- `apps/web/src/components/battlefield/HandFan.tsx`
- `apps/web/src/components/battlefield/HandFan.module.css`
- `packages/ui/src/components/CardView.tsx`
- `apps/web/src/components/MatchBoard.module.css`

Deck/discard files may be touched only if the visual QA below confirms that spacing still needs adjustment:

- `apps/web/src/components/battlefield/DeckPile.tsx`
- `apps/web/src/components/battlefield/DiscardPile.tsx`

## Dense-hand design requirements

Current `HandFan` uses a constant overlap and `CardView size="xs"`. In a dense 8–10 card hand the separate name strip below each card makes the row visually noisy and the cards read like stacked labels instead of a coherent fan.

Implement an adaptive mobile presentation with these constraints:

- 1–5 cards: preserve comfortable readability and current interaction feel;
- 6–7 cards: modestly increase overlap only as needed;
- 8–10 cards: use a denser, deliberate fan that fits the supported mobile viewport without forcing the user to hunt horizontally for the hand state;
- cost must remain visible on every resting card;
- artwork identity must remain readable enough to distinguish neighboring cards;
- the engaged/previewed card must still escape the dock through the existing portal and show the full readable card/name;
- do not solve density by simply shrinking everything into illegibility.

For the dense mobile state, prefer an **opt-in hand-specific compact presentation** instead of changing every `CardView` caller globally. A good solution is to remove/suppress the separate `xs` name strip only for dense resting hand cards and, if useful, place a very compact name treatment over the artwork with a controlled bottom gradient. Do not obscure character ATK/HP. Full name remains available in the engaged/preview overlay.

If you add a `CardView` prop, it must default to the current behavior so Collection, Deck Builder, Admin review and other callers remain unchanged.

Avoid arbitrary new panels, pills or generic UI boxes. Keep the accepted premium battlefield/art-object visual language.

## Deck / discard acceptance check

At 390×844, inspect both upper and lower deck/discard pairs with populated and empty discard states.

Only if they still visually merge into one cluster:

- slightly reduce mobile art scale and/or increase the local separation between Deck and Discard;
- keep them aligned to their painted arena housings;
- keep count badges readable;
- do not alter desktop values;
- do not change Core, commander, Resonance, End Turn or creature slots to make room.

## Required mobile QA

Primary viewport: `390×844`.

Also check:

- `360×800`
- `412×915`
- `430×932`

Capture evidence for at least these hand states at 390×844:

- 1 card
- 3 cards
- 5 cards
- 8 cards
- 10 cards
- 10 cards with an engaged center card
- 10 cards with an engaged edge card
- drag ghost in a dense hand

Also capture:

- populated upper deck/discard pair;
- populated lower deck/discard pair;
- empty discard state;
- one desktop regression screenshot at `1440×900`.

Acceptance criteria:

- no horizontal page scroll;
- no clipping outside viewport;
- no selected-card collision with commander/Resonance band;
- no regression in tap-to-preview, press-hold/drag/release, cancel or target drop zones;
- dense hand reads intentionally, not as accidental overlap;
- cost remains readable;
- desktop screenshot remains visually unchanged.

## Validation

Run the repo-standard checks before reporting completion:

- lint
- typecheck
- full test suite
- production build

Report exact results and test counts.

## Git discipline

- Keep all work on `claude/mobile-hand-density-polish-v1`.
- Do not merge to `main`.
- Do not touch unrelated files or open PRs.
- Before commit, show the exact diff/file list and verify scope.
- Use one focused commit unless a follow-up fix is required by QA.
- Push the branch and return the commit SHA plus screenshot evidence.

## Definition of done

The task is done only when the 8–10 card mobile hand is visually controlled at 390×844, engaged cards remain fully readable and safe, deck/discard no longer visually collapse if that issue is reproduced, desktop remains unchanged, and all validation is green.