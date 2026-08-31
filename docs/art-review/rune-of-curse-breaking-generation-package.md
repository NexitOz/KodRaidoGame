# Generation package — Art Pack 03 Card 04

# `rune-of-curse-breaking` / «Руна Разрушения Проклятий»

**Status:** DRAFT — do not generate until the owner approves
[`rune-of-curse-breaking-master-art-brief.md`](rune-of-curse-breaking-master-art-brief.md).

**Claude does not generate this image.** See §6.

---

## 1. Generation thesis

A carved white-stone font, alone in a pale quiet hall, brimming and overflowing in continuous thin
sheets that run away down straight cut channels in the floor and out of frame. No people. Nothing
being cast. A permanent installation in steady state — because the card cleanses **every turn**, not
once.

---

## 2. Output contract

| Property   | Required value                                                          |
| ---------- | ----------------------------------------------------------------------- |
| Dimensions | **1024 × 1536** (vertical 2:3) — same as Cards 01–03                    |
| Format     | WebP, original export                                                   |
| Container  | plain `VP8 ` — a `VP8X` container indicates a transcode and is rejected |
| Colour     | sRGB                                                                    |
| Content    | artwork only — no frame, no text, no stats, no UI, no border            |
| Filename   | any; the repository path is assigned at intake                          |

At intake the candidate is gated on byte size, SHA-256, RIFF-declared total, FourCC, dimensions and
a full decode. Re-encoding, resizing, cropping or "optimising" the approved master after generation
invalidates it.

---

## 3. Positive prompt

> A tall vertical fantasy card illustration, 2:3, cinematic realistic premium collectible-card art
> with a subtle painterly finish.
>
> A single carved white-stone ceremonial font stands alone at the centre of a pale, empty stone
> hall. The font is a wide, shallow basin on a short stepped plinth, cut from dense ivory-white
> stone, matte and finely dressed, with crisp tool-worked chamfers and faint mineral staining
> beneath the overflow points from years of use. Around the outer rim runs a continuous unbroken
> band of small angular incised ornamental marks, filled with a thin pale silver-white inlay that
> catches the ambient light — decorative rhythm only, not readable writing.
>
> The basin is full past its brim. Clear cold water slides over the rim on every side in thin,
> smooth, glass-like unbroken sheets, silent and laminar. The water runs down onto the pale
> flagstone floor and away along several straight shallow channels cut into the stone with clean
> square edges, each carrying a thin film of moving water outward and off the edges of the frame in
> different directions.
>
> Camera slightly above eye level, angled gently down about fifteen degrees, so both the still water
> surface inside the basin and the radiating floor channels are clearly readable. The font sits
> low-centre in the frame; the upper third is quiet, empty hall with no architectural detail.
>
> Lighting is soft, high and diffuse — cool ambient daylight already present in the room, from an
> unseen source above. Palette is white, silver and ivory with cool grey-blue in the water and in
> the shadowed stone. Deep true shadow under the basin rim, inside the cut channels and on the shaded
> face of the plinth gives the image a firm dark anchor against its pale field.
>
> Absolutely no people, no figures, no hands. Nothing is being cast or summoned. The scene is calm,
> permanent and already working.

---

## 4. Negative prompt / forbidden elements

> people, person, figure, human, face, hands, silhouette, crowd, ranked figures, acolytes, monk,
> knight, priest,
> explosion, burst, shatter, shattering, snapping, breaking, impact, shockwave, splash, spray, foam,
> churning water, turbulence, waterfall roar,
> cast spell, spellcasting, open palm, conjuring, floating sigil, magic circle, **rune circle on the
> ground, closed inscribed ring on the floor**, halo, halo ring, floating rune ring,
> tall monolith, standing stone, obelisk, menhir, stepped pyramid plinth in a cavern,
> handheld tablet, small stone slab held up, hinged panel, folding screen, segmented barrier,
> round shield, spear, compass emblem, star emblem, heraldry, crest, insignia,
> cathedral, cathedral facade, gothic architecture, rose window, stained glass, columns in detail,
> archway, gate, banners, statues, altar cloth, furniture,
> crimson, red, scarlet, blood red, violet, purple, magenta, ember orange, warm firelight,
> embers, ash, smoke, fire, sparks, cinders,
> deep chiaroscuro, dark cavern, gloom, heavy black shadow, night,
> spectral, ghostly, translucent, dissolving, wispy,
> god rays, light beams, volumetric shafts, lens flare, bloom, glow aura, neon, emissive glow,
> heavy gold, gold filigree, ornate gilding, jewels, gemstones,
> text, letters, lettering, script, runic writing, readable characters, numerals, watermark,
> signature, logo, UI, interface, card frame, border, stat box, caption,
> photograph, photorealistic skin pores, photobash, 3D render, CGI, octane render, plastic,
> airbrushed, oversaturated, HDR, cluttered, busy, noisy detail

---

## 5. Composition and crop anchors

Master is 1024 × 1536. Width is never trimmed by any surface; only rows are cut.

| Anchor                                | Target rows    |
| ------------------------------------- | -------------- |
| Quiet hall, no essential content      | 0 – 260        |
| Basin rim / water lip (primary focal) | ≈ 760 – 900    |
| Rune band on the rim                  | ≈ 820 – 950    |
| Plinth base                           | ≈ 1240         |
| Floor channels legibly established by | **≤ 1280**     |
| **Strict safe zone — all essentials** | **260 – 1280** |

Live crop windows, for reference:

| Aspect          | Rows kept      |
| --------------- | -------------- |
| 3:4             | 85 – 1450      |
| 7:9             | 110 – 1426     |
| **4:5 BINDING** | **128 – 1408** |

The basin is centred horizontally. Nothing essential may sit in the outer 60 px on either side.

---

## 6. Claude does not generate this image

Claude Code has no image-generation capability in this environment, and this package does not
authorize it to acquire one. Claude's responsibilities are:

- writing and maintaining the brief and this package;
- byte-exact candidate intake once a master exists;
- the **eight**-surface QA defined in the brief §10 (a RUNE has no `CreatureSlot` surface);
- reporting deviations without ever silently altering approved artwork.

**Art generation is owned by ChatGPT (or the owner's chosen generator) after owner approval of the
brief.** The generator returns the master; the owner approves it; only then does Claude take it in.

---

## 7. Handoff note

On approval, the generator should produce the 1024 × 1536 WebP master to §2's contract using §3 and
§4, then transport it into the repository by a route that preserves bytes exactly. The proven route
on this project is the GitHub web UI upload (**Add file → Upload files**) onto a candidate branch, or
a GitHub Actions runner fetching the object; the Contents API / base64-in-JSON path has silently
truncated masters on this project and must not be used.

Claude will then verify the integrity gates, stage to the gitignored review path, run the eight
surfaces, and report **READY FOR OWNER VISUAL APPROVAL** or **REJECTED / BLOCKED**.
