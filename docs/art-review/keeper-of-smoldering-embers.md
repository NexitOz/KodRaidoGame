# Keeper of Smoldering Embers - owner review notes

Status: **candidate only**. No production art mutation is allowed before owner approval.

## Master

- Source: 1024 x 1536
- Aspect ratio: 2:3
- Faction: SHADOW
- Card slug: `keeper-of-smoldering-embers`

## Visual read

The candidate succeeds at the intended role:

- heavy elite guardian rather than agile assassin;
- ritual/ceremonial silhouette;
- ember-cracked blackened armor;
- signature shadow-forged polearm;
- subtle Echo-Shadow behind the main figure;
- cinematic, realistic SHADOW identity.

## Crop review

The existing review surfaces use wider aspect ratios than the 2:3 master, so centered `object-cover` crops vertically.

Approximate centered crop loss from the 1536 px master:

| Surface | Ratio | Visible height at 1024 px width | Approx. trim |
| --- | --- | ---: | ---: |
| CardView / CreatureSlot | 3:4 | 1365 px | ~85 px top + ~86 px bottom |
| Hand preview | 7:9 | 1317 px | ~109 px top + ~110 px bottom |
| Card detail | 4:5 | 1280 px | ~128 px top + ~128 px bottom |

### Risk

`4:5` is the tightest crop. The polearm reaches very close to the top edge of the 2:3 master, so its upper tip can be clipped in a centered 4:5 cover crop. Lower boots / foreground also lose some breathing room. The Echo-Shadow remains comparatively safe because the crop removes vertical area rather than horizontal area.

## Recommended review decision

Do **not** replace the master art yet. First review the candidate in the real UI. If the 4:5 detail crop feels too tight, prefer one of these fixes before regenerating the character:

1. tune the review/display focal position if a small vertical shift is enough;
2. use a crop-safe derivative for the 4:5 detail surface;
3. only if both fail, create a crop-safe 2:3 master with the same design and slightly smaller character scale / more vertical breathing room.

No changes to `seed.ts`, production `artworkUrl`, database, Railway, balance, abilities, or gameplay are part of this candidate review.
