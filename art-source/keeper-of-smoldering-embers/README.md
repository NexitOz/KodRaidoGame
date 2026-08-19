# Keeper of Smoldering Embers - candidate source

Production review candidate only. Do not use as shipped card art until owner approval.

- Card slug: `keeper-of-smoldering-embers`
- Source render: 1024 x 1536, 2:3
- Review WebP target: 1024 x 1536
- Expected SHA256: `7bde6a98e36bdd9155f315ce3adc22d50d574a5f8581711126ffa99739eca696`
- Source transport: `q60-00.b64` through `q60-15.b64`, concatenated in numeric order.

Reconstruct locally:

```bash
cat q60-00.b64 q60-01.b64 q60-02.b64 q60-03.b64 q60-04.b64 q60-05.b64 q60-06.b64 q60-07.b64 q60-08.b64 q60-09.b64 q60-10.b64 q60-11.b64 q60-12.b64 q60-13.b64 q60-14.b64 q60-15.b64 \
  | base64 --decode > keeper-of-smoldering-embers.webp
sha256sum keeper-of-smoldering-embers.webp
```

For local owner review, place the reconstructed file at:

`apps/web/public/art-review-candidates/keeper-of-smoldering-embers.webp`

The review candidate is intentionally separate from `seed.ts`, the production `artworkUrl`, the database, and Railway.
