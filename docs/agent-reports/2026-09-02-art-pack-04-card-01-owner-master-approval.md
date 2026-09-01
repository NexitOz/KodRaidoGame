# Art Pack 04 Card 01 — owner master approval

Card: `child-of-the-spring-light` / «Дитя Весеннего Света».

## Owner decision

On 2026-09-02 the owner explicitly approved the generated image after approving the canonical brief.

**Decision: OWNER MASTER APPROVED FOR CANDIDATE INTAKE / QA.**

This approval authorizes transport of this exact generated master into a candidate branch and the full nine-surface candidate QA. It does **not** authorize seed changes, production-path integration, merge, Railway/production DB access, or a production artwork sync.

A separate post-QA owner decision is required before repository integration if QA surfaces any caveat or brief deviation.

## Generated master

Image-generation ID:

`615e529f-173b-4c42-826b-814da3de8b96`

Approved original PNG:

- dimensions: `1024 × 1536`
- mode: RGB
- byte size: `2902102`
- SHA-256: `b67d2e520ed7b967e724e47f6de52809ea44da9efaca3d48a33a3265da759635`
- full decode: PASS

The approved visual is the image the owner viewed in chat. No crop, resize, retouch, recomposition or regeneration is authorized by this record.

## Candidate transport derivative

For the repository candidate pipeline, a WebP transport derivative was produced from the approved PNG with **no crop, resize or recomposition**. Candidate QA must audit this exact WebP and must not infer a QA pass merely from the owner's PNG approval.

Exact WebP tuple:

- filename: `child-of-the-spring-light.webp`
- dimensions: `1024 × 1536`
- byte size: `596976`
- SHA-256: `bc2e5abcfcedacfad6b98816229c0bb1205cb71d7177f09e88568442ecaaf9c2`
- expected Git blob SHA: `a52fb443ff296c4411c7dc0e640be98befbc12bc`
- RIFF-declared total: `596976`
- FourCC: plain `VP8 `
- full decode: PASS

The conversion is a transport/production-format derivative, not a new visual concept and not an owner waiver of objective brief gates.

## Machine-owned transport source

The exact WebP was uploaded for runner-owned transport so the owner is not used as a manual file courier.

- Firestorage share: `https://firestorage.ai/ja/f/aZIlHM-TkPI7`
- share UUID: `aZIlHM-TkPI7`
- primary file id: `fl_f0555165aaff4598bed07f2e0f44c487`
- expires: `2026-09-16T21:44:37.912662Z`

A temporary GitHub Actions transport branch may fetch this source and must hard-gate byte size, SHA-256, Git blob SHA, RIFF/FourCC, dimensions and full decode before committing the candidate. The transport branch must never merge into `main`.

## QA still required

The canonical brief remains:

`docs/art-review/child-of-the-spring-light-master-art-brief.md`

The candidate must undergo the full nine-surface CHARACTER review, including raw master, CardView, CardDetailDrawer, HandCardPreview, CreatureSlot, admin desktop, admin 390 px, 92 px thumbnail and hierarchy beside the BOND flagship.

Every objective acceptance criterion in brief §16 must be measured and reported honestly. Owner visual approval does not override crop geometry, metric bands, safeguarding, motif-reservation or faction-differentiation checks.

If any criterion is outside the brief, do not silently waive it and do not regenerate automatically. Record the exact deviation and stop for an explicit post-QA owner decision.

## Safety boundary

Do not:

- edit `seed.ts`, schema, migrations, gameplay, balance or application UI as part of this approval;
- place the artwork at the production card path;
- open an integration PR;
- run or prepare a production artwork sync;
- access Railway or the production database;
- reuse `SYNC-13-CARD-ART-PRODUCTION` or `SYNC-14-CARD-ART-PRODUCTION`.

Both previous production confirmations remain consumed.