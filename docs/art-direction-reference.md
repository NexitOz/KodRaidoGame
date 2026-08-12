# Art Direction Reference — mood board, not production art

**Scope of this doc: guidance only.** No image files are committed to the repo, no
`artworkUrl`/`coverUrl` in `prisma/seed.ts` is changed, and no card's `rightsStatus` moves off
`'placeholder'`. Per `docs/content-pack-01.md`, all card art today is `generatePlaceholderArt()` —
inline SVG, rune motifs, rarity gradients — deliberately with **no anime screenshots, no fan art,
no third-party-style imagery**, because rights are unresolved. This doc exists so that whenever
real art gets commissioned or licensed (with a clear `rightsStatus` other than `placeholder`), the
brief for each of the six Content Pack 01 factions is already written down and consistent with the
palette/mood established in `docs/visual-polish-01.md`.

## Baseline (already shipped, `packages/config/tailwind-preset.js`)

Dark Premium CCG + cinematic energy + Mystic Technology + the Kod Raido rune language. Base
palette near-black/graphite/cold grey/mist-white; deep crimson (`raido.red` / `redGlow`) as an
accent that is never a fill; restrained gold (`raido.gold`) reserved for LEGENDARY; violet only for
EPIC; cyan only for the Track zone. This reference doc does not change any of that — it extends it
per-faction.

## Reference image received (2026-08-12) — calibrates SHADOW

A dark-fantasy character illustration was shared as **mood-board reference only** (unknown
provenance/rights, per the user's decision not committed to the repo). It reads as an excellent
tonal match for the **SHADOW — «Орден Сумеречного Эха»** faction specifically:

- Black tattered coat/cloak with metal clasp details, crimson-and-violet spell light in the open
  hand — lines up directly with `FACTION_ACCENT.SHADOW` (`#c24855` text/border) layered over the
  shared `raido.red`/`redGlow` accent, plus embers rather than a flat fill.
- Gothic cathedral ruins, arches, distant spires in cold violet fog — reads as the Order's home
  turf; distinct from the game's general Battlefield backdrop, reserved for Shadow key art only.
- Ghostly translucent figures standing behind the lead character — an almost literal match for the
  faction's actual mechanical identity (summon-token, death-trigger, graveyard/revive; the
  **Эхо-Тень** token and the Legendary **Некромант Сумеречного Ордена**, who returns a fallen
  Shadow character from the discard pile). A commissioned key art for that card should keep this
  "leader flanked by spectral echoes" composition — it's not just mood, it's the card's ability
  illustrated.
- A curved dark blade with red rune inlay — usable as a recurring Shadow weapon/prop motif, distinct
  from Veil's daggers-in-hidden-motion or Bond's staff-and-light props (see below).

Use this reference for **palette, lighting, and composition mood on SHADOW cards only** — not as a
template for the other five factions, which need their own distinct identity so the six flagships
don't collapse into "same painter, different hue."

## Per-faction art brief (extends `FACTION_ACCENT`, `packages/ui/src/factions.ts`)

Each faction keeps its established accent color + glyph; the brief below adds mood, lighting, and
prop language so a future artist can differentiate all six at a glance, even in thumbnail size.

| Faction | Accent / glyph | Mood | Light source | Signature prop |
| --- | --- | --- | --- | --- |
| **SHADOW** — Орден Сумеречного Эха | `#c24855` crimson / ⟁ | Gothic ruin, mourning cult, tattered black cloaks | Cold violet ambient + warm ember accent from the caster's hand | Rune-etched blade; translucent echo-figures in the background |
| **PURIFICATION** — Стражи Белой Руны | `#e7e2d3` ivory / ✦ | Ordered temple architecture, clean stonework, ceremonial armor | Diffuse white/near-shadowless — the opposite of Shadow's chiaroscuro | Raised rune-seal / warding sigil, cleansing light radiating outward from a shield |
| **BOND** — Дом Весеннего Света | `#e0a458` amber / ❖ | Warm domestic sanctuary, spring garden, soft fabric | Golden-hour side light, low contrast, no harsh shadows | Staff or lantern glowing warm amber; healing light pooling at the feet |
| **VEIL** — Двор Безымянной Тени | `#9b7ec2` violet / ☾ | Court intrigue, masks, moonlit ambush | Single cool moonlight rim-light, rest in near-total silhouette | Twin daggers, half the figure dissolving into shadow (Hidden as a literal visual) |
| **MYSTERY** — Архив Серого Тумана | `#9fb4c6` grey-blue / ◎ | Archive/library drowned in fog, floating pages | Flat, hazy, low-saturation — deliberately the least dramatic lighting of the six | Open scroll/tome with characters that reorder themselves, fog obscuring the lower body |
| **COSMIC** — Наследники Звёздного Потока | `#6fe2ec` cyan / ✵ | Starfield, ascendant/growing energy, open sky rather than architecture | Cyan rim-light against a dark starfield, energy visibly *building* rather than static | Ring of orbiting star-motes that grows denser toward the Legendary |

Distinguishing rule of thumb: **Shadow and Veil both read "dark,"** but Shadow is warm-ember/
communal (a leader with followers, ruins), while Veil is cool-moonlight/solitary (a lone figure
dissolving into shadow, court intrigue rather than mourning cult). If a piece could be mistaken for
either faction, push Shadow warmer and more crowded, Veil cooler and more isolated.

## The six flagship Legendaries (natural first commissions)

One Legendary per faction already exists in `docs/content-pack-01.md` and is the obvious flagship
if/when real art is commissioned — each brief above was written with that character in mind:

1. Shadow — Некромант Сумеречного Ордена (leader + echo-figures, per the reference image)
2. Purification — Верховная Хранительница Руны
3. Bond — Матриарх Дома Весеннего Света
4. Veil — Владыка Безымянной Тени
5. Mystery — Хранитель Серого Тумана
6. Cosmic — Владыка Звёздного Потока

All six remain on `generatePlaceholderArt()` SVG placeholders (`rightsStatus: 'placeholder'`) for
now. This doc is the brief to hand an artist later — it does not, by itself, authorize swapping any
card's artwork.
