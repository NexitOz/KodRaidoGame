# KodRaidoGame — Mobile Battlefield V2 Production Integration

## Status

Owner-approved visual direction. This is a production integration task, not a redesign task.

The approved Mobile Battlefield V2 master is transported losslessly in this branch as base64 parts under:

`art-source/mobile-battlefield-v2/`

Materialize the exact production asset before changing UI code:

```bash
node scripts/materialize-mobile-battlefield-v2.mjs
```

Expected output:

`apps/web/public/art/battlefield/kod-raido-arena-mobile-v2.webp`

Asset invariants:

- exact dimensions: `852 × 1846`
- exact WebP byte size: `140088`
- SHA256: `5f02adc98c53ff3c794020e733af119a8359b9a0a2b44d72f437e1d4cdc4d22d`
- source parts: `chunk-00.b64` through `chunk-07.b64`, `chunk-08a.b64` through `chunk-08d.b64`, and `chunk-09.b64`

The materializer verifies byte size, SHA256 and RIFF/WEBP signature before writing the production file.
Do not regenerate, repaint, crop, stretch, or replace the owner-approved battlefield art.

---

## 1. Goal

Integrate the approved Mobile Battlefield V2 into the existing `MatchBoard` while preserving all gameplay logic, current tap/drag interactions, PvE/PvP behavior, and the approved desktop battlefield.

The mobile match must read as one physical dark-fantasy KodRaido game table. Painted structures in the asset are the real visual housings for gameplay components, not decorative background behind generic CSS panels.

## 2. Hard visual constraints

The approved battlefield contains:

- exactly 5 opponent creature slots;
- exactly 5 player creature slots;
- upper commander socket;
- lower commander socket;
- upper Resonance housing;
- lower Resonance housing;
- four left-side Deck / Discard housings;
- central Raido Core mechanism;
- right-side End Turn housing;
- dark stone / metal / chain architecture;
- red influence in the opponent half;
- blue / violet influence in the player half.

Do not redesign the composition.

Forbidden:

- changing the number of battlefield slots;
- replacing painted housings with generic rectangles, pills or circles;
- inventing additional side panels;
- embedding dynamic text/numbers into the background;
- cropping or stretching the mobile arena asset;
- changing desktop visuals while doing this task.

## 3. Desktop is frozen

Everything at `@media (min-width: 1024px)` is a regression-sensitive approved surface.

Do not change desktop battlefield art, coordinates, creature lane geometry, hand behavior, commander layout, Deck / Discard, Resonance, End Turn, or viewport-fit behavior.

Any shared-component change must be proven visually neutral on desktop.

## 4. Existing architecture to preserve

Use the existing `MatchBoard.tsx` and existing gameplay components. Do not create a second independent mobile match implementation.

Preserve the current component/handler structure around:

- `CreatureRow`;
- `CreatureSlot`;
- `ConductorPanel`;
- `DeckPile`;
- `DiscardPile`;
- `ArenaCore`;
- `TrackZone`;
- `CardPlayReveal`;
- `ResonanceMeter`;
- `EndTurnArtifact`;
- `HandFan`;
- selection / targeting / drag-to-play handlers.

This task is a UI/UX geometry and art integration pass.

## 5. Five physical slots per player

`MAX_BOARD_UNITS` remains `5`.

The painted field contains five fixed physical slots on each side. Every real `CreatureSlot` must land inside its corresponding painted slot.

Do not center only the occupied cards as a group.

Board array order maps to fixed visual positions:

- 1 card -> slot 1 occupied, slots 2–5 remain visibly empty;
- 3 cards -> slots 1–3 occupied, slots 4–5 remain visibly empty;
- 5 cards -> all five occupied.

Empty painted slot borders must remain visible. The approved slot footprint is intentionally close to a real battlefield-card ratio. Do not make the slots taller/narrower again.

## 6. Battlefield cards

Board cards should be compact and art-first.

Priority at battlefield scale:

1. artwork;
2. cost;
3. attack;
4. health;
5. interactive/targeting state.

Do not attempt to render full rules text at board scale.

A board card must fit inside the painted slot, preserve a small amount of painted border around it, and never overlap a neighboring slot.

## 7. Commanders

Place the opponent `ConductorPanel` inside the upper painted commander socket and the player `ConductorPanel` inside the lower painted commander socket.

Keep portrait/icon, HP, current dynamic secondary values, active/target states, damage/combat feedback, and rank data where applicable dynamic in React. Do not bake these values into the arena image.

The player commander must remain tappable even where the hand dock visually approaches the lower band.

## 8. Deck / Discard

The four left-side housings map to:

Upper band:
- opponent deck;
- opponent discard.

Lower band:
- player deck;
- player discard.

Continue using `DeckPile` and `DiscardPile` for dynamic counts/state. The painted housing is the frame. Do not draw a second generic panel over it on mobile.

## 9. Resonance

Use the upper and lower painted Resonance housings as visual sockets for dynamic Resonance UI.

Do not add new gameplay rules or fake opponent data that the current model does not expose. Where current data exists, fit the existing UI into the painted housing instead of floating it elsewhere.

## 10. Raido Core

The large central painted mechanism is the battlefield's visual anchor.

Keep the existing functional `ArenaCore`, resonance heat/tier state, trigger animation, `TrackZone`, and `CardPlayReveal`.

Align dynamic core content to the painted central mechanism. Do not place a redundant CSS disc/mechanism over the art.

## 11. End Turn

Place existing `EndTurnArtifact` into the empty right-side circular housing.

Preserve tap/click, disabled state, enemy-turn state, pending state, and current handler semantics.

It must look physically installed in the painted mechanism. Do not replace it with a normal button/card/pill.

## 12. HandFan

The hand is dynamic and is not part of the background asset.

Keep the current mobile bottom-dock interaction model:

- compact rest state;
- tap preview;
- selection;
- drag-to-play;
- target resolution;
- disabled/pending states;
- preview modal.

The resting hand must not cover the player's creature row, commander, Resonance, or End Turn control. Continue to respect roughly 15–20% viewport height at rest.

## 13. Stage and viewport fit

Mobile match route must remain a hard viewport-fit workspace:

- `100dvh`;
- no document-level vertical scroll;
- no horizontal overflow;
- no crop of gameplay-critical artwork;
- no distortion.

The V2 master is exactly `852:1846`.

Use percentage coordinates relative to `.stage` so gameplay overlays track the image at every supported phone size. A small letterbox/pillarbox on unusual aspect ratios is acceptable. Stretching or cropping the arena is not.

Respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.

## 14. Layering and hit-testing

Target conceptual stack:

- arena background: base layer;
- creature cards: gameplay layer;
- resting hand: below critical lower-band controls;
- commanders / Resonance / End Turn: above resting hand where required;
- drag ghost / selection feedback / preview / combat feedback: top gameplay layer.

Decorative wrappers must not steal pointer events. Re-test every drop zone after geometry changes.

## 15. Required viewport matrix

At minimum verify:

- `360 × 800`
- `375 × 812`
- `390 × 844`
- `393 × 873`
- `412 × 915`
- `430 × 932`

Also test one short/wide Android viewport if practical.

## 16. Required board states

Inspect real rendered states, not standalone mock HTML:

### Empty
- opponent 0/5;
- player 0/5.

### Partial
- opponent 3/5;
- player 3/5.

### Full
- opponent 5/5;
- player 5/5.

### Hand density
- 3 cards;
- 7 cards;
- 10 cards.

### Interaction
- default;
- selected hand card;
- selected own creature;
- targetable enemy;
- active End Turn;
- disabled End Turn;
- card preview;
- drag-to-play.

## 17. Critical acceptance criteria

The task is not complete if any of the following is true:

- fewer or more than five slots appear on either side;
- cards float between painted slots;
- occupied cards are centered as a changing group instead of mapping to fixed positions;
- card footprint visibly mismatches the painted slot;
- commander content falls outside its socket;
- Resonance is detached from the painted housing;
- End Turn floats away from the right-side mechanism;
- HandFan covers core gameplay controls at rest;
- the arena crops/stretches;
- page scroll returns;
- desktop changes visually;
- generic CSS panels are drawn over artwork that already contains a physical housing;
- gameplay logic changes as a side effect of the visual pass.

## 18. Expected files

Expected primary changes:

- `apps/web/src/components/MatchBoard.module.css`
- optionally `apps/web/src/components/MatchBoard.tsx`
- generated `apps/web/public/art/battlefield/kod-raido-arena-mobile-v2.webp`

Only if needed for accurate fitting:

- `apps/web/src/components/battlefield/CreatureRow.tsx`
- `apps/web/src/components/battlefield/CreatureSlot.tsx`
- `apps/web/src/components/battlefield/ConductorPanel.tsx`
- `apps/web/src/components/battlefield/arena/EndTurnArtifact.tsx`
- `apps/web/src/components/battlefield/arena/ResonanceMeter.tsx`

Do not touch game engine, matchmaking, database, card balance, or server rules for this task.

## 19. Verification

Before completion run the repository's normal lint, typecheck, tests, and production build. Fix only failures introduced by this task.

Required evidence:

### Mobile
At least `390 × 844` and `412 × 915` screenshots showing:

- empty battlefield;
- 3 vs 3;
- 5 vs 5;
- 7-card resting hand;
- selected hand card;
- card preview;
- active End Turn.

### Desktop regression
Provide one screenshot of the current approved desktop battlefield and confirm it remains visually unchanged.

## 20. Final report

Report:

1. branch;
2. final commit SHA;
3. exact changed-file list;
4. lint/typecheck/test/build results;
5. mobile screenshot evidence;
6. desktop regression screenshot;
7. explicit confirmation: `MAX_BOARD_UNITS remains 5`;
8. explicit confirmation: `desktop battlefield unchanged`;
9. explicit confirmation: `gameplay logic unchanged`;
10. any remaining visual deviation from the approved battlefield master.

## Definition of Done

The mobile match reads as one coherent physical KodRaido battlefield with five fixed slots per player, correctly seated cards, the Raido Core as the center anchor, embedded commander/Deck/Discard/Resonance/End Turn controls, a usable bottom-dock hand, zero page scroll, stable phone viewport fit, unchanged desktop behavior, and unchanged gameplay rules.
