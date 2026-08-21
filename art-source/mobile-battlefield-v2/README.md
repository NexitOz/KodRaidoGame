# Mobile Battlefield V2 source transport

This directory contains the lossless base64 transport for the owner-approved Mobile Battlefield V2 production WebP.

Do not edit, reorder, regenerate, repaint, crop, or stretch the chunks.

## Materialize

From the repository root run:

```bash
node scripts/materialize-mobile-battlefield-v2.mjs
```

The script writes:

`apps/web/public/art/battlefield/kod-raido-arena-mobile-v2.webp`

and fails unless the reconstructed asset matches all production invariants.

## Production invariants

- dimensions: `852 × 1846`
- WebP byte size: `140088`
- SHA256: `5f02adc98c53ff3c794020e733af119a8359b9a0a2b44d72f437e1d4cdc4d22d`

## Part order

1. `chunk-00.b64`
2. `chunk-01.b64`
3. `chunk-02.b64`
4. `chunk-03.b64`
5. `chunk-04.b64`
6. `chunk-05.b64`
7. `chunk-06.b64`
8. `chunk-07.b64`
9. `chunk-08a.b64`
10. `chunk-08b.b64`
11. `chunk-08c.b64`
12. `chunk-08d.b64`
13. `chunk-09.b64`

Implementation requirements live in `docs/CLAUDE_MOBILE_BATTLEFIELD_V2_TASK.md`.
