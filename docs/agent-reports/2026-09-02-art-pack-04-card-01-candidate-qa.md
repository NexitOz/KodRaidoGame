# Agent Handoff — Art Pack 04 Card 01 candidate transport + QA

Task: transport the owner-approved `child-of-the-spring-light` master into a candidate branch and run
the nine-surface CHARACTER QA
Date: 2026-09-01 22:20–22:35 UTC (the report path uses the 2026-09-02 filename the task specified)
Branch: `main` for this report; `assets/child-of-the-spring-light-candidate-v1` and
`transport/art-pack-04-card01-github-actions` created
PR: none
Base SHA: `730efda9b615d2f9a22079dfb09df3131a413ea1`
Status: **REJECTED / BLOCKED — NO INTEGRATION**

## Outcome in one line

The approved master could not be transported because **the provider reports that the supplied
Firestorage share does not exist**. No candidate bytes entered the repository, so the nine-surface QA
could not be run at all. Nothing was substituted, reconstructed or improvised.

## The blocker, with evidence

The transport ran on a GitHub-hosted runner using the exact pattern that worked for Art Pack 03
Cards 02, 03 and 04.

**Run 1 — transport** (`33565829125`, job `100048651134`, conclusion **failure**):

```
GET https://api.firestorage.ai/prod/file/shares/aZIlHM-TkPI7/files?maxResults=1000
urllib.error.HTTPError: HTTP Error 404: Not Found
```

It failed at the first provider call, before any download, any gate and any git operation.

**Run 2 — read-only probe** (`33565969881`, job `100049098557`, conclusion success):

| Probe                                                  | Result                                                            |
| ------------------------------------------------------ | ----------------------------------------------------------------- |
| `GET /prod/file/shares/aZIlHM-TkPI7/files`             | **404** — `{"detail":"Share link not found"}`                     |
| `GET /prod/file/shares/aZIlHM-TkPI7`                   | **404** — `{"message":"Not Found"}`                               |
| `POST /prod/file/shares/…/files/fl_f055…c487/download` | **422** — `file_id` "String should have at most 32 characters"    |
| `GET https://firestorage.ai/ja/f/aZIlHM-TkPI7`         | 200, 11 099 bytes, generic title `共有ファイル \| firestorage.ai` |

Two things worth reading carefully:

- The share **page** returning 200 proves nothing. It is a client-rendered SPA shell that renders for
  any id, carries no share id, file id, filename or size in its HTML, and shows no password or
  expiry marker. Only the API is authoritative, and the API says the share is not found.
- The supplied file id `fl_f0555165aaff4598bed07f2e0f44c487` is 35 characters and the API rejects it
  as too long — its file ids are at most 32. So the supplied id is not an API file id in the first
  place, which is consistent with the share record itself not being one the API knows.

**Run 3 — probe with a positive control** (`33566091089`, job `100049488634`, conclusion success):

```
CONTROL_CARD04_SHARE=8hmlyOzbah75 STATUS=200
  BODY={"title":"KodRaidoGame Card 04 approved master", … "expiresAt":"2026-09-14T21:25:11.384668Z" …}
ENDPOINT_STILL_WORKS= YES
AS_SUPPLIED=aZIlHM-TkPI7 STATUS=404 BODY={"detail":"Share link not found"}
AMBIGUOUS_POSITIONS= [2, 3, 10] VARIANTS= 8
VARIANT=aZIIHM-TkPI7 STATUS=404
VARIANT=aZIIHM-TkPl7 STATUS=404
VARIANT=aZIlHM-TkPl7 STATUS=404
VARIANT=aZlIHM-TkPI7 STATUS=404
VARIANT=aZlIHM-TkPl7 STATUS=404
VARIANT=aZllHM-TkPI7 STATUS=404
VARIANT=aZllHM-TkPl7 STATUS=404
RESOLVABLE_SHARE_FOUND= NO
```

The control is what makes this conclusive. The **Card 04 share from 2026-08-31 still resolves right
now**, so the endpoint, the API contract, the runner's egress and the transport method are all
working. The failure is specific to this one share.

The only speculative step taken was a bounded check of the ambiguous capital-`I` / lowercase-`l`
positions in the supplied id — the classic transcription confusion for this id format, three
positions, seven alternatives. All seven 404. Nothing else was guessed, and any hit would still have
had to clear the full SHA-256 / blob / size gates before a byte was committed.

**Expiry is not the explanation.** The approval record gives `expires 2026-09-16T21:44:37Z` and the
probes ran on 2026-09-01, two weeks inside that window. The share was either never created under
that id or has since been deleted.

## What this means

The exact approved bytes — `596976`, SHA-256
`bc2e5abcfcedacfad6b98816229c0bb1205cb71d7177f09e88568442ecaaf9c2`, expected blob
`a52fb443ff296c4411c7dc0e640be98befbc12bc` — are not reachable from any machine route available to
this session. The session's own egress is GitHub-only, which is why the runner is used at all; the
runner is not behind that restriction and still could not find the share.

No QA result exists for this card, and none should be inferred. The owner's pre-QA visual approval of
the PNG is not a QA pass and was never treated as one.

## What was NOT done

- No artwork bytes were committed anywhere.
- No substitute, re-render, re-encode, re-upload or reconstruction of the master was attempted.
- No alternative transport route was improvised after the provider route failed.
- `apps/web/public/art/cards/child-of-the-spring-light.webp` does not exist and was not created.
- `apps/web/public/art-review-candidates/` staging and the `/admin/art-review` candidate row were not
  added — they exist only to review bytes, and there are no bytes.
- `seed.ts`, `rightsStatus`, schema, migrations, gameplay, balance and UI are untouched.
- No integration PR, no production-sync preparation, no dispatch, no Railway / production DB / Vercel
  access. `SYNC-13-CARD-ART-PRODUCTION` and `SYNC-14-CARD-ART-PRODUCTION` remain consumed and unused.

## Branches created

| Branch                                          | Head SHA  | Contents                                                                                    |
| ----------------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `assets/child-of-the-spring-light-candidate-v1` | `730efda` | Created from fresh `main`. **Carries no artwork** — identical to `main`.                    |
| `transport/art-pack-04-card01-github-actions`   | `73c6b96` | The temporary transport workflow and the read-only probe. **Must never merge into `main`.** |

The candidate branch is left in place and ready: when a working source exists, the transport workflow
commits onto it and its own guard refuses to overwrite an object that is already there.

## Verification of the gates that never got to run

For the record, the gate set was fully in place and would have hard-failed on any mismatch: byte size
`596976`, SHA-256, expected Git blob SHA, RIFF-declared total, FourCC `VP8 `, dimensions 1024 × 1536,
and a full Pillow decode to 4 718 592 RGB bytes, followed by a local git-object check and an
independent remote re-read after push. None of these was reached, loosened or bypassed — the run died
at the provider lookup.

## Recommended next action

The blocker is entirely on the source side and needs one thing from the owner:

1. **Re-upload the exact approved WebP** (`596976` bytes, SHA-256 `bc2e5abc…f9c2`) and supply a fresh
   share link. Any provider with a machine-readable file API works; Firestorage is proven, and its
   API is confirmed healthy right now.
2. Paste the new share URL into `docs/CLAUDE_CURRENT_TASK.md` or the approval record. The share id in
   the path is the only value the transport needs — the file id is discovered from the listing and
   selected by **size + MIME**, never by filename.
3. Re-run the transport by pushing to `transport/art-pack-04-card01-github-actions`; the workflow is
   already in place with the correct expected tuple. Then the nine-surface QA can run for real.

If the owner would rather verify the link first: a share is live when
`https://api.firestorage.ai/prod/file/shares/<SHARE_ID>/files?maxResults=1000` returns HTTP 200. The
web page returning 200 is not evidence — it renders for non-existent shares too.

## Confirmed untouched

`apps/game-server/prisma/seed.ts`; schema and migrations; every file under
`apps/web/public/art/cards`; all gameplay, balance and UI code; the production sync script and
workflow; `main`'s application code. Art Pack 03 remains closed. No production confirmation phrase
was created or reused.
