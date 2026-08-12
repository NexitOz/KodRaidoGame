# Art Bible 01 — Kod Raido: Resonance

Living brief for **Art Pack 01**: real commissioned/licensed key art for the six Content Pack 01
faction-flagship Legendaries, to eventually replace their `generatePlaceholderArt()` SVG. This doc
is guidance and review tracking only.

**Scope guardrail:** this pass is documentation only. No image file is committed to the repo, no
card's `artworkUrl`/`coverUrl` or `rightsStatus` in `apps/game-server/prisma/seed.ts` changes, the
six-card drop-in pipeline and placeholders are untouched, and nothing here touches gameplay,
balance, Battlefield logic, card data, or economy.

## Approval status — DO NOT mark Art Pack 01 FINAL APPROVED until all six are reviewed

| # | Faction | Flagship card | Slug | Status |
| - | --- | --- | --- | --- |
| 1 | SHADOW | Некромант Сумеречного Ордена (Necromancer of the Twilight Order) | `necromancer-of-the-twilight-order` | **Reference 01 received** — benchmark set, see below |
| 2 | PURIFICATION | Верховная Хранительница Руны | `high-warden-of-the-white-rune` | Pending reference |
| 3 | BOND | Матриарх Дома Весеннего Света | `matriarch-of-the-spring-light` | Pending reference |
| 4 | VEIL | Владыка Безымянной Тени | `lord-of-the-nameless-shadow` | Pending reference |
| 5 | MYSTERY | Хранитель Серого Тумана | `keeper-of-the-grey-mist` | Pending reference |
| 6 | COSMIC | Владыка Звёздного Потока | `lord-of-the-stellar-stream` | Pending reference |

Slugs for #2–6 confirmed directly against `apps/game-server/prisma/seed.ts`.

**Gate:** Art Pack 01 ships / merges as artwork only when every row above is reviewed and marked
approved. A single approved faction (SHADOW) does not authorize touching the placeholder pipeline
for any card, including SHADOW's.

## Global Art Direction (baseline, already shipped)

From `packages/config/tailwind-preset.js` / `docs/visual-polish-01.md` — Dark Premium CCG +
cinematic energy + Mystic Technology + the Kod Raido rune language. Base palette near-black /
graphite / cold grey / mist-white; deep crimson (`raido.red` / `redGlow`) as an accent that is
never a flat fill; restrained gold (`raido.gold`) reserved for LEGENDARY; violet only for EPIC;
cyan only for the Track zone. Art Pack 01 key art extends this language into full character
illustration — it does not replace it.

Reference 01 (below) refines these pillars for the whole game, not just SHADOW:

- **Premium collectible-card key-art quality** — full painted/rendered illustration, not a game
  render or 3D asset flattened to 2D.
- **Cinematic anime/donghua-inspired semi-realism** — stylized proportions, but anatomically
  coherent; not chibi, not photobash.
- **Realistic facial rendering** — skin, eyes, and hair must read as painted/rendered with real
  material variation, not the flat "plastic AI skin" look. This is a quality bar for every faction,
  not a SHADOW-only note.
- **Strong, readable silhouette** even before color/detail resolve — every flagship must pass a
  silhouette-only readability check (see Composition spec below).
- **Dramatic rim lighting + deep shadow** as the default lighting approach across factions; each
  faction changes the *color and intensity* of the rim light and how much shadow dominates (see the
  differentiation table), not whether this technique is used at all.

## Composition & technical spec (all six factions)

- **Master canvas: vertical 2:3** (portrait, wider than the final in-game crop). The extra width
  gives room for environment/VFX bleed at the edges that a tighter crop can lose without losing the
  character.
- **Safe central area:** face, torso, signature weapon/object, and the major VFX read must all sit
  inside the center of the canvas, clear of the outer margins on all sides. This safe area is what
  gets cropped for the in-game card — currently `packages/ui/src/components/CardView.tsx` renders
  card art at `aspect-[3/4]` (Card Frame 2.0, the shipped version in `packages/ui/src/rarity.ts` /
  `docs/visual-polish-01.md`; if a "2.1" iteration exists elsewhere it isn't in this codebase yet —
  flag it if you're tracking it separately). A 2:3 master with the character composed centrally
  crops cleanly to that 3:4 in-game frame without losing the head or weapon.
- **Character remains the visual focus** even with a rich background — background architecture/VFX
  should frame and contextualize, never compete with, the character's silhouette and face.
- **Mobile legibility:** the character must stay clearly readable after the card is cropped and
  scaled down to hand/collection thumbnail size on a phone screen. Fine background detail can be
  lost at that scale; the character's read (pose, weapon, faction color) cannot.

## SHADOW — Орден Сумеречного Эха (benchmark set)

**Reference 01** (received 2026-08-12, mood/style benchmark — not committed to the repo, not
production art itself) is the primary visual benchmark for SHADOW and one of the anchors for the
overall game art direction, per the above. Target card: **Necromancer of the Twilight Order**
(`necromancer-of-the-twilight-order`, LEGENDARY, cost 5, 4/5 — its actual ability, "on play: return
your first eligible Shadow character from the discard pile at 100% stats," makes the "leader flanked
by spectral echoes" composition in Reference 01 a literal illustration of the card's mechanic, not
just a mood match).

What Reference 01 establishes and must be preserved for SHADOW illustrations:

- Premium CCG key-art finish, cinematic anime/donghua semi-realism, realistic (non-plastic) facial
  rendering — the global quality bar above, demonstrated concretely.
- Dark gothic fantasy with restrained mystic technology — magic reads as controlled/ritual, not a
  chaotic special-effects dump.
- Black layered cloth over light dark-metal armor accents, rather than bulky plate — silhouette
  stays lean and readable, not blocky.
- Ruined monumental architecture (gothic arches, distant spires) as the environment.
- Ash, embers, and controlled red/crimson energy — matches `FACTION_ACCENT.SHADOW` (`#c24855`)
  layered over the shared `raido.red`/`redGlow`, as embers/particles rather than a flat wash.
- Spectral memory/echo silhouettes standing behind the main character — this is SHADOW's
  signature crowd motif; no other faction should use ghostly duplicate-figures-behind-the-lead as
  its background device (see differentiation table).
- Dramatic rim lighting with deep shadow.
- Strong readable silhouette that survives the mobile card crop.

SHADOW-specific recurring props/motifs going forward: a curved dark blade with red rune inlay (the
Order's weapon language), the Эхо-Тень (Echo-Shadow) token as a smaller/simpler version of the same
spectral-silhouette motif wherever the token itself needs art.

## The other five factions — briefed, awaiting their own reference

Per your direction, SHADOW's reference sets SHADOW's benchmark only. Each of the remaining factions
keeps its own materials, palette, architecture, silhouette, weapon, and VFX — none should read as
"SHADOW repainted." The table below is the standing brief until each faction's own reference image
arrives and gets folded in the same way SHADOW's was.

| Faction | Accent / glyph | Mood & architecture | Materials / silhouette | Light source | Signature weapon/prop | Background crowd device |
| --- | --- | --- | --- | --- | --- | --- |
| **SHADOW** — Орден Сумеречного Эха | `#c24855` crimson / ⟁ | Gothic ruin, mourning cult | Black layered cloth + light dark-metal accents | Cold violet ambient + warm ember accent from the caster's hand | Curved dark blade, red rune inlay | Translucent echo-figures behind the lead |
| **PURIFICATION** — Стражи Белой Руны | `#e7e2d3` ivory / ✦ | Ordered temple, clean stonework | Ceremonial plate/vestment, straight structured lines | Diffuse white/near-shadowless — the opposite of SHADOW's chiaroscuro | Raised rune-seal / warding sigil, radiant shield | None — a single figure, order/isolation rather than a crowd |
| **BOND** — Дом Весеннего Света | `#e0a458` amber / ❖ | Warm domestic sanctuary, spring garden | Soft flowing fabric, minimal armor | Golden-hour side light, low contrast, no harsh shadow | Staff or lantern glowing warm amber | Small warm light-motes drifting near allies, not humanoid figures |
| **VEIL** — Двор Безымянной Тени | `#9b7ec2` violet / ☾ | Court intrigue, moonlit ambush | Fitted dark leathers, half the figure dissolving into shadow | Single cool moonlight rim-light, rest near-total silhouette | Twin daggers | None — deliberately solitary; a crowd would contradict Hidden/ambush identity |
| **MYSTERY** — Архив Серого Тумана | `#9fb4c6` grey-blue / ◎ | Fog-drowned archive/library | Layered robes, indistinct lower body in fog | Flat, hazy, low-saturation — deliberately the least dramatic lighting of the six | Open scroll/tome with self-reordering glyphs | Floating pages/fragments, not figures |
| **COSMIC** — Наследники Звёздного Потока | `#6fe2ec` cyan / ✵ | Open starfield rather than architecture | Sleek fitted silhouette, energy visibly ascending off the body | Cyan rim-light against a dark starfield, energy visibly *building* | Ring of orbiting star-motes, denser toward Legendary rarity | Orbiting star-motes, not figures — energy scaling up is COSMIC's "crowd" |

Rule of thumb for the two closest-reading factions: **SHADOW and VEIL both read "dark,"** but
SHADOW is warm-ember and communal (a leader with followers, ruins, ash), while VEIL is cool-moonlight
and solitary (a lone figure dissolving into shadow, no crowd). If a piece could be mistaken for
either, push SHADOW warmer/more crowded and VEIL cooler/more isolated. Only SHADOW gets the
ghostly-echo-crowd device — it is reserved as SHADOW's signature, not a general "dark faction" motif.

## Next steps

1. User supplies references for PURIFICATION, BOND, VEIL, MYSTERY, COSMIC, one at a time.
2. Each reference gets folded into this doc the same way SHADOW's was: a dedicated section under
   its faction confirming what's preserved, and the differentiation table above gets tightened
   against the real image rather than the current placeholder brief.
3. Only after all six rows in the Approval status table are marked approved does Art Pack 01 become
   eligible to be called FINAL APPROVED — and even then, that authorizes commissioning/production
   art, not an automatic change to `rightsStatus` or the in-game placeholder pipeline, which is a
   separate, later step with its own review.
