# Art Pack 04 Card 01 transport correction

Target: `child-of-the-spring-light` / «Дитя Весеннего Света».

## Why this record exists

The first candidate transport attempt correctly stopped because the Firestorage share recorded in the task returned HTTP 404. The approved artwork itself was not rejected and no candidate bytes were committed.

A local re-verification of the exact approved files then found that the previously written SHA-256 values and expected Git blob SHA were transcription errors in the documentation. The visual approved by the owner is unchanged. This record supersedes the old transport tuple and old share identity everywhere they appear.

## Canonical approved PNG

The exact PNG shown to and approved by the owner was re-read from the conversation runtime:

- dimensions: `1024 × 1536`
- mode: RGB
- byte size: `2902102`
- SHA-256: `b67e65b3d6cfc944002a863ded275ca8d5cb6cee2b8f4de3be30338c8de7b3c9`
- full decode: PASS

The prior documented PNG digest beginning `b67d2e52...` is superseded and must not be used.

## Canonical candidate WebP

The already-created WebP derivative in the runtime was re-read byte-for-byte. It remains `1024 × 1536` and was made without crop, resize or recomposition.

Canonical exact tuple:

- filename: `child-of-the-spring-light.webp`
- byte size: `596976`
- SHA-256: `bc2de762075121604d24756478e1d89a9d4e176207a3d8e45a8622b90893eca3`
- expected Git blob SHA: `a52de8f99b5d775e6c85c9db7e139a09196bdd7c`
- RIFF-declared total: `596976`
- FourCC: plain `VP8 `
- dimensions: `1024 × 1536`
- full decode: PASS

The prior documented WebP digest beginning `bc2e5abc...` and Git blob beginning `a52fb443...` are superseded and must not be used.

## Fresh machine-owned source

The exact canonical WebP above was uploaded again through the connected Firestorage tool.

Fresh source:

- share URL: `https://firestorage.ai/ja/f/1CULOcsXBz8s`
- share ID: `1CULOcsXBz8s`
- file id: `01a05f186bd77166bf4f998d657b94c2`
- public id: `A9mj0NshF09Yuhiv`
- provider-reported size: `596976`
- provider status: `active`
- created: `2026-09-01T22:30:31.126992Z`
- expires: `2026-09-15T22:30:31.126992Z`

The previous recorded share `aZIlHM-TkPI7` is invalid and must not be retried.

## Authorization and next action

This correction does not broaden owner authorization. It authorizes only a retry of the established candidate transport followed by the already-authorized nine-surface candidate QA.

The transport workflow must use the corrected share ID and canonical tuple above, retain all hard gates, push the exact binary to `assets/child-of-the-spring-light-candidate-v1`, fetch the remote object back, verify it again, then continue the current QA task.

No production path, `seed.ts`, integration PR, production sync, Railway, production database or Vercel operation is authorized.
