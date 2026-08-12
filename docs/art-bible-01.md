# Art Bible 01 — Kod Raido: Resonance

Living brief for **Art Pack 01**: real commissioned/licensed key art for the six Content Pack 01
faction-flagship Legendaries, to eventually replace their `generatePlaceholderArt()` SVG. This doc
is guidance and review tracking only.

**Scope guardrail:** this pass is documentation only. No image file is committed to the repo, no
card's `artworkUrl`/`coverUrl` or `rightsStatus` in `apps/game-server/prisma/seed.ts` changes, the
six-card drop-in pipeline and placeholders are untouched, and nothing here touches gameplay,
balance, Battlefield logic, card data, or economy. **A reference image never replaces a placeholder
on its own** — that only happens when the project owner explicitly marks a specific file as final
production artwork, a separate step from adding/locking a reference in this doc.

## Reference vs. production-format note

Some reference images arrive with a baked-in card frame, title, logo, stats, or other UI — that is
still valid as a **mood/style reference** (palette, lighting, materials, silhouette), but it must
never define the production asset format. The clean character illustration, with no overlay, is
always the primary reference for pose/rendering/environment. **Final production artwork format is
fixed:** vertical 2:3, no text, no logo, no stats, no UI, no baked-in card frame — a clean
illustration that the app's own `CardView` frame/badges/rarity glow render on top of at display
time, not art with a frame pre-composited into the file.

## Approval status — DO NOT mark Art Pack 01 FINAL APPROVED until all six faction references AND all six final production illustrations are reviewed

| # | Faction | Flagship card | Slug | Status |
| - | --- | --- | --- | --- |
| 1 | SHADOW | Некромант Сумеречного Ордена (Necromancer of the Twilight Order) | `necromancer-of-the-twilight-order` | **Reference 01 LOCKED (baseline)** — see below |
| 2 | PURIFICATION | Верховная Хранительница Руны (High Warden of the White Rune) | `high-warden-of-the-white-rune` | **Reference 02 LOCKED** — see below |
| 3 | BOND | Матриарх Дома Весеннего Света | `matriarch-of-the-spring-light` | Pending reference |
| 4 | VEIL | Владыка Безымянной Тени | `lord-of-the-nameless-shadow` | Pending reference |
| 5 | MYSTERY | Хранитель Серого Тумана | `keeper-of-the-grey-mist` | Pending reference |
| 6 | COSMIC | Владыка Звёздного Потока | `lord-of-the-stellar-stream` | Pending reference |

Slugs for #2–6 confirmed directly against `apps/game-server/prisma/seed.ts`.

**Gate:** Art Pack 01 ships / merges as artwork only when every row above has both its reference
locked *and* its final production illustration reviewed. A locked reference (SHADOW) does not
authorize touching the placeholder pipeline for any card, including SHADOW's — that requires the
separate explicit "this file is final production artwork" call-out described above.

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
  gets cropped for the in-game card. Two real crops exist in the shipped codebase today (Card Frame
  2.0 — no "2.1" exists anywhere in this repo; flag it if you're tracking that version elsewhere):
  `packages/ui/src/components/CardView.tsx` renders art at `aspect-[3/4]` (collection grid, hand,
  battlefield), and `apps/web/src/components/CardDetailDrawer.tsx` renders it at a `h-40 w-32`
  container (**4:5**, the card-detail "cinematic" thumbnail). Both use `object-cover` at the default
  center anchor.
  **Verified crop math** (source master 2:3 = width/height 0.667, always narrower per unit height
  than either target crop): `object-cover` always scales to match container **width** first, so
  **the left/right edges of the master are never trimmed** — full width is always preserved. The
  overflow is entirely vertical, trimmed evenly off the top and bottom:
  - 3:4 crop (CardView): ~11% of the master's height is lost, ~5.5% off the top and ~5.5% off the
    bottom.
  - 4:5 crop (CardDetailDrawer): ~17% of the master's height is lost, ~8.5% off the top and ~8.5%
    off the bottom — this is the **binding, tighter constraint**.
  Practical rule: keep everything essential — face, crown/head ornament, weapon tips, VFX reads —
  within the middle ~83% of the canvas height, centered. Side content close to the left/right edge
  is safe; content close to the very top or very bottom edge is not.
- **Character remains the visual focus** even with a rich background — background architecture/VFX
  should frame and contextualize, never compete with, the character's silhouette and face.
- **Mobile legibility:** the character must stay clearly readable after the card is cropped and
  scaled down to hand/collection thumbnail size on a phone screen. Fine background detail can be
  lost at that scale; the character's read (pose, weapon, faction color) cannot.

## SHADOW — Орден Сумеречного Эха (Reference 01, LOCKED baseline)

**Reference 01** (received 2026-08-12, clean character illustration, mood/style reference — not
committed to the repo, not itself the final production file) is now **locked** as the primary
visual benchmark for SHADOW and one of the anchors for the overall game art direction. Target card:
**Necromancer of the Twilight Order** (`necromancer-of-the-twilight-order`, LEGENDARY, cost 5,
4/5 — its actual ability, "on play: return your first eligible Shadow character from the discard
pile at 100% stats," makes the "leader flanked by spectral echoes" composition in Reference 01 a
literal illustration of the card's mechanic, not just a mood match).

**Silhouette:** lean, upright, one arm raised/extended casting; not blocky or wide-stanced —
readable at thumbnail scale from outline alone.
**Costume/materials:** black layered cloth (coat/cloak) over light dark-metal clasp/accent armor —
never bulky plate.
**Architecture:** ruined monumental gothic structure — arches, distant spires, open ceiling to a
stormy sky.
**Lighting:** cold violet ambient fill + warm ember rim/accent light from the caster's hand;
dramatic rim lighting, deep controlled shadow.
**Signature weapon/object:** curved dark blade with red rune inlay.
**VFX language:** ash and embers drifting, not a particle-effect overload; magic reads as a single
controlled rune/sigil of light in the caster's palm, not a screen-filling spell effect.
**Palette:** near-black base, `FACTION_ACCENT.SHADOW` crimson (`#c24855`) layered over the shared
`raido.red`/`redGlow`, cold violet fog as the only non-warm color in the frame.
**Forbidden drift:** no bulky plate armor, no bright/saturated non-crimson accent color, no flat
even lighting (must stay chiaroscuro), no crowded VFX that competes with the character read, no
gore/graphic horror beyond ash-and-ruin implication.

**Background crowd device (SHADOW-exclusive):** spectral memory/echo silhouettes standing behind
the main character. This is reserved as SHADOW's signature — no other faction may use
ghostly-duplicate-figures-behind-the-lead as its background device. Also doubles as the visual for
the Эхо-Тень (Echo-Shadow) token, rendered smaller/simpler.

**Comparison against other approved references:** none yet — SHADOW is Reference 01, the first
locked. Every subsequent faction gets compared against it explicitly (see differentiation table
below and each new faction's own section going forward).

**Crop/readability check against the actual current implementation (corrected):** per the verified
crop math above, `object-cover` centered on a 2:3 master never trims left/right — only top and
bottom, up to ~17% total height lost in `CardDetailDrawer`'s tighter 4:5 crop. (An earlier version
of this doc incorrectly flagged the echo-figures at the left/right edges as the clipping risk —
that was wrong; side content is safe.) The real risk for SHADOW: keep the necromancer's face, raised
casting hand, and blade tip within the middle ~83% of canvas height — if the blade or hand is raised
close to the very top edge of a tall 2:3 pose, it can be trimmed in the `CardDetailDrawer` view. The
echo-figures themselves are lower priority background reads and can safely bleed toward the left/right
margins.

## PURIFICATION — Стражи Белой Руны (Reference 02, LOCKED)

**Reference 02** (received 2026-08-12, clean character illustration, mood/style reference — not
committed to the repo, not itself the final production file) is now **locked** for PURIFICATION.
Target card: **High Warden of the White Rune** (`high-warden-of-the-white-rune`, LEGENDARY, cost 6,
5/7 — its choose-one ability, "cleanse+shield an ally OR curse an enemy," fits a figure whose entire
kit — raised rune-shield, ordered congregation, warding light — reads as protective/consecrating).

**Silhouette:** frontal, symmetrical, statuesque and wide — cape/shoulder-mantle and a large round
shield spread the outline broad rather than lean. A tall crown/tiara adds a vertical spike at
top-center. This is a direct silhouette contrast to SHADOW's lean off-center diagonal casting pose.
**Costume/materials:** fitted white/silver plate armor (structured breastplate, pauldrons,
gauntlets) with gold filigree trim, layered under a flowing white cape/mantle — this is armor, not
robes/vestment (correcting the earlier placeholder brief's "vestment" guess now that a real
reference exists). Edges stay clean and pressed, never tattered.
**Architecture:** monumental symmetrical white/silver gothic cathedral facade, a huge glowing
rune-circle rose window forming a literal halo directly behind the head, twin spires, Order banners,
a grand ceremonial staircase.
**Lighting:** bright, diffuse, near-shadowless ambient light with a soft front-above key light —
confirms the placeholder brief's "opposite of SHADOW's chiaroscuro" prediction. No deep cast
shadows anywhere on the figure.
**Signature weapon/object:** dual-wield — an ornate ceremonial spear/polearm in one hand, a large
rune-engraved round shield with a compass/star emblem in the other. (Placeholder brief had guessed
a single raised sigil; the real reference confirms spear+shield as the pair, both rune-inscribed.)
**VFX language:** cold light particles and frost motes drifting upward; magic reads as *ambient and
architectural* — runes are engraved/static on the armor, shield, and halo-window — rather than
actively cast from an open hand the way SHADOW's ember sigil is.
**Palette:** white/silver/ivory base (`FACTION_ACCENT.PURIFICATION` `#e7e2d3`) with gold filigree
accents. Note: this gold is diegetic (part of the costume), distinct from the UI's `raido.gold`
rarity-tier color. For this specific card that's harmless reinforcement since it's already
LEGENDARY — but future non-Legendary PURIFICATION cards should dial the gold trim back so it
doesn't misread as a false rarity signal against Common/Rare card frames.
**Forbidden drift:** no crimson/red or violet accent color (reads as SHADOW/VEIL), no deep
chiaroscuro shadow, no ash/ember particles (frost/light motes only, never warm embers), no
tattered/ragged cloth, no actively-cast open-hand spell effect (PURIFICATION's magic is
built into the armor/architecture, not conjured in the hand).

**Background crowd device:** PRESENT, but categorically distinct from SHADOW's — this corrects the
placeholder brief, which had guessed "no crowd, solitary figure" for PURIFICATION before a real
reference existed. Reference 02 shows solid, opaque, hooded acolytes in **symmetric ranked
formation** flanking the leader on the staircase — a living congregation/honor-guard, not memory.
Contrast with SHADOW's crowd: SHADOW = loose, translucent/spectral, asymmetric echo-figures
(implying death/memory); PURIFICATION = solid, symmetric, ranked, living order members (implying
hierarchy/faith).

**Comparison against already-locked references:** PURIFICATION and SHADOW are now the closest
structural match in the whole set — both compose a lone leader in front of a monumental gothic
facade with background figures flanking them. Two of six factions now share this
"leader + flanking crowd + cathedral" template, so the two must lean hard on palette and material to
stay distinct at a glance: SHADOW is near-black/crimson/tattered-cloth/translucent-asymmetric-crowd;
PURIFICATION is white-gold/pressed-plate/solid-symmetric-crowd. If a future faction's reference also
lands on "leader + monumental architecture," push that faction toward an open/non-architectural
setting instead (COSMIC's brief already does this with an open starfield) rather than adding a third
cathedral-facade composition.

**Crop/readability check against the actual current implementation:** using the verified crop math
above (full width always preserved; ~11% total height trimmed in `CardView`'s 3:4, ~17% in
`CardDetailDrawer`'s 4:5, split evenly top/bottom), Reference 02's crown/tiara apex and the raised
spear tip sit very close to the top edge of the composition — under the drawer's ~8.5% top trim
these are at real risk of being clipped. Recommend production art bring the crown apex and spear tip
down with headroom so both survive the tighter 4:5 crop, not just the looser 3:4 one. The shield and
face sit comfortably mid-frame and are safe in both crops; the stair/hem detail at the very bottom
edge is lower-priority background and an acceptable loss.

## The other four factions — briefed, awaiting their own reference

Per your direction, each locked reference sets its own faction's benchmark only. Each of the
remaining factions keeps its own materials, palette, architecture, silhouette, weapon, and VFX —
none should read as a repaint of an already-locked faction. The table below is the standing brief
until each faction's own reference image arrives and gets folded in the same way SHADOW's and
PURIFICATION's were.

| Faction | Accent / glyph | Mood & architecture | Materials / silhouette | Light source | Signature weapon/prop | Background crowd device |
| --- | --- | --- | --- | --- | --- | --- |
| **SHADOW** — Орден Сумеречного Эха | `#c24855` crimson / ⟁ | Gothic ruin, mourning cult | Black layered cloth + light dark-metal accents | Cold violet ambient + warm ember accent from the caster's hand | Curved dark blade, red rune inlay | Translucent echo-figures behind the lead |
| **PURIFICATION** — Стражи Белой Руны | `#e7e2d3` ivory / ✦ | Monumental cathedral facade, rose-window halo | Fitted pressed plate armor + gold filigree + flowing cape, wide symmetrical silhouette | Diffuse white/near-shadowless — the opposite of SHADOW's chiaroscuro | Ceremonial spear + rune-engraved round shield (dual) | Solid, symmetric, ranked hooded acolytes (living order, not memory) |
| **BOND** — Дом Весеннего Света | `#e0a458` amber / ❖ | Warm domestic sanctuary, spring garden | Soft flowing fabric, minimal armor | Golden-hour side light, low contrast, no harsh shadow | Staff or lantern glowing warm amber | Small warm light-motes drifting near allies, not humanoid figures |
| **VEIL** — Двор Безымянной Тени | `#9b7ec2` violet / ☾ | Court intrigue, moonlit ambush | Fitted dark leathers, half the figure dissolving into shadow | Single cool moonlight rim-light, rest near-total silhouette | Twin daggers | None — deliberately solitary; a crowd would contradict Hidden/ambush identity |
| **MYSTERY** — Архив Серого Тумана | `#9fb4c6` grey-blue / ◎ | Fog-drowned archive/library | Layered robes, indistinct lower body in fog | Flat, hazy, low-saturation — deliberately the least dramatic lighting of the six | Open scroll/tome with self-reordering glyphs | Floating pages/fragments, not figures |
| **COSMIC** — Наследники Звёздного Потока | `#6fe2ec` cyan / ✵ | Open starfield rather than architecture | Sleek fitted silhouette, energy visibly ascending off the body | Cyan rim-light against a dark starfield, energy visibly *building* | Ring of orbiting star-motes, denser toward Legendary rarity | Orbiting star-motes, not figures — energy scaling up is COSMIC's "crowd" |

Two collision risks to actively guard against as more references arrive:

- **SHADOW vs. VEIL** both read "dark." SHADOW is warm-ember and communal (a leader with followers,
  ruins, ash); VEIL is cool-moonlight and solitary (a lone figure dissolving into shadow, no crowd).
  Push SHADOW warmer/more crowded and VEIL cooler/more isolated if a piece could be mistaken for
  either. Only SHADOW gets the ghostly-echo-crowd device.
- **SHADOW vs. PURIFICATION** both now use "leader + flanking background crowd + monumental gothic
  facade." They stay distinct purely on palette/material/crowd-solidity (near-black/crimson/
  tattered/translucent-asymmetric vs. white-gold/pressed/solid-symmetric) — but a third faction
  landing on the same architecture-plus-crowd template would blur the set, so BOND/VEIL/MYSTERY/
  COSMIC references should be steered toward non-cathedral settings (their briefs below already do
  this — domestic garden, court/moonlight, fog-archive, open starfield).

## Process for each incoming reference (02–06)

For every new reference image supplied:

1. Map it to its exact existing flagship card and canonical `slug` (verified against
   `prisma/seed.ts`, not guessed).
2. Add/update that faction's dedicated section in this doc using the same structure as SHADOW's:
   Silhouette, Costume/materials, Architecture, Lighting, Signature weapon/object, VFX language,
   Palette, Forbidden drift, Background crowd device.
3. Explicitly compare it against every already-locked faction so the six stay visually distinct —
   call out the closest-reading neighbor and how this faction pushes away from it (as the
   SHADOW/VEIL note already does).
4. Re-verify the central safe-crop/readability claim against the actual current `CardView.tsx`
   implementation (not an assumed frame version) and flag any clipping risk.
5. Update the Approval status table row to reflect the locked reference.

After each reference is folded in, report: (1) what changed in this doc, (2) what visual rules are
now locked for that faction, (3) what differentiates it from already-approved factions, (4) any
crop/readability risk found against the real `CardView` implementation, (5) confirmation that no
gameplay/card-data/balance/Battlefield/database values changed.

**Reference 03 (next faction, TBD by the user) is expected next** — not yet supplied as of this
update. SHADOW (01) and PURIFICATION (02) are now locked; BOND, VEIL, MYSTERY, and COSMIC remain
Pending.

Only after all six rows show **both** a locked reference **and** a reviewed final production
illustration does Art Pack 01 become eligible to be called FINAL APPROVED — and even then, that
authorizes commissioning/production art, not an automatic change to `rightsStatus` or the in-game
placeholder pipeline. Swapping any specific card's placeholder happens only when the project owner
explicitly marks a specific file as final production artwork for that card — a separate, later step
with its own review, per card.
