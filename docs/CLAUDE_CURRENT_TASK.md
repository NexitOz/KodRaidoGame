# CURRENT TASK — Art Pack 03 Card 04: authorized 14-card production artwork sync

## Status

Card 04 `rune-of-curse-breaking` / «Руна Разрушения Проклятий» is FINAL OWNER APPROVED, repository-integrated, and the controlled 14-card production artwork sync is prepared on `main`.

Repository preparation:

- Card 04 integration PR `#41`: MERGED
- immutable artwork source: `b792be37b32f73906d104642689afaa88a47b1c2`
- 14-card sync preparation PR `#42`: MERGED
- sync-preparation merge: `81a550200b06a889a751f3c78535c1b917bd5b41`
- prepared target count: `14`
- workflow: `.github/workflows/production-card-art-sync.yml`

## OWNER PRODUCTION AUTHORIZATION — ACTIVE, ONE USE

On 2026-09-01 the owner explicitly supplied the exact required confirmation:

`SYNC-14-CARD-ART-PRODUCTION`

This task therefore AUTHORIZES exactly one production workflow dispatch using that exact confirmation.

Authorization state before dispatch:

- `SYNC-13-CARD-ART-PRODUCTION`: CONSUMED, invalid forever
- `SYNC-14-CARD-ART-PRODUCTION`: **AUTHORIZED / NOT YET CONSUMED**

The authorization is one-use. The moment GitHub accepts the workflow dispatch and a new run is created, mark `SYNC-14-CARD-ART-PRODUCTION` **CONSUMED**, regardless of the eventual run result. Do not create a second dispatch and do not rerun a failed/cancelled job or run without a fresh owner decision.

If the dispatch API clearly rejects the request before any run is created, STOP as BLOCKED and do not improvise another production route.

## Goal

Dispatch the reviewed 14-card controlled production artwork workflow once, then audit the complete PRE-WRITE → APPLY (if required) → POST-WRITE evidence. Mark Card 04 live only if every required gate passes.

## Required sequence

1. Read `CLAUDE.md`, `docs/AGENT_STATE.md`, this task, PR #42 handoff, and the Card 03 production-sync report.
2. Sync fresh `main` and verify:
   - PR #42 is merged as `81a550200b06a889a751f3c78535c1b917bd5b41`;
   - current workflow gate is exactly `SYNC-14-CARD-ART-PRODUCTION`;
   - workflow and script target 14 cards;
   - all three immutable-source pins resolve to `b792be37b32f73906d104642689afaa88a47b1c2`;
   - no protected-path drift has appeared since the audited preparation that would make the immutable-source gate unsafe or stale.
3. Do not edit code before dispatch. Do not weaken or bypass any gate.
4. Dispatch `.github/workflows/production-card-art-sync.yml` on `main` exactly once with input:
   - `confirmation = SYNC-14-CARD-ART-PRODUCTION`
5. As soon as GitHub confirms a new workflow run exists, record:
   - run ID / run number / URL;
   - head branch/ref;
   - head SHA;
   - `SYNC-14-CARD-ART-PRODUCTION = CONSUMED`.
6. Wait for the run to finish. Do not rerun anything automatically.
7. Audit the actual job logs, not only the run conclusion. Require all applicable evidence below.

### Immutable/repository gates

Require:

- exact manual confirmation step PASS;
- immutable source SHA verified as `b792be37b32f73906d104642689afaa88a47b1c2`;
- `ARTWORK_FILES_PRESENT=14/14`;
- current `main` satisfies the immutable-source drift gate.

### Production-scope preflight

Require:

- `RAILWAY_TOKEN_PRESENT=YES`;
- `TOKEN_PROJECT_ID_VERIFIED=YES`;
- `TOKEN_ENVIRONMENT_ID_VERIFIED=YES`;
- `GAME_SERVER_DB_LINK_VERIFIED=YES`;
- `PRODUCTION_SCOPE_VERIFIED=YES`;
- `READ_ONLY_DB_PREFLIGHT=YES`.

### PRE-WRITE

Require:

- `TARGET_ROWS=14`;
- `UNIQUE_SLUGS=14`;
- valid 64-character `PRE_WRITE_SNAPSHOT`;
- `ROWS_REQUIRING_MUTATION` between 0 and 14;
- record each card's `needsChange` result;
- specifically record `rune-of-curse-breaking` current vs desired art fields.

Expected normal case after Cards 01–03 are already live: exactly Card 04 should require mutation. If the actual safe report differs, do not assume. Audit what the workflow reports.

### APPLY

If `ROWS_REQUIRING_MUTATION > 0`, require:

- `TRANSACTION_STARTED=YES`;
- `TRANSACTION_COMMITTED=YES`;
- `ROWS_CHANGED` equals the actual PRE-WRITE mutation count;
- `TARGET_ROWS_FINAL=14`;
- `SOURCE_OF_TRUTH_MATCH=14/14`;
- `NON_TARGET_FIELD_CHANGES=0`.

If `ROWS_REQUIRING_MUTATION=0`, require the explicit already-synchronized path and no APPLY transaction.

### POST-WRITE

Always require:

- `TARGET_ROWS=14`;
- `UNIQUE_SLUGS=14`;
- `ROWS_REQUIRING_MUTATION=0`;
- `SOURCE_OF_TRUTH_MATCH=14/14`;
- production scope still verified.

8. If ANY required gate fails, the workflow conclusion is not success, or the evidence is ambiguous: status `REJECTED / BLOCKED`. Do not retry, repair production manually, run ad-hoc DB commands, or reuse the consumed confirmation.
9. If all gates pass, record Card 04 as **LIVE IN PRODUCTION** and Art Pack 03 Cards 01–04 as complete end to end.
10. Update `docs/art-pack-03.md` with the exact run/job identifiers, rows changed, final 14/14 result, non-target field result, immutable source, and consumed authorization state.
11. Write durable report:
    `docs/agent-reports/2026-09-01-art-pack-03-card-04-production-sync.md`
12. Update `docs/AGENT_STATE.md` **last** with the final production status, run/job IDs, evidence summary, and `SYNC-14-CARD-ART-PRODUCTION = CONSUMED`.
13. Fetch `docs/AGENT_STATE.md` back from GitHub and verify it.
14. Stop.

## Hard exclusions

Do NOT:

- dispatch more than once;
- rerun a failed/cancelled run or job without a fresh owner decision;
- reuse `SYNC-13-CARD-ART-PRODUCTION`;
- reuse `SYNC-14-CARD-ART-PRODUCTION` after a run is created;
- edit gameplay, seed source, schema, migrations, artwork or application UI as part of the production run;
- bypass immutable-source checks, snapshot checks, production-scope checks, Serializable transaction, non-target fingerprints or POST-WRITE verification;
- perform ad-hoc production DB repairs;
- begin another card before this production closeout is recorded.

## Final status

End at exactly one of:

- **COMPLETE END TO END — CARD 04 LIVE IN PRODUCTION**
- **REJECTED / BLOCKED — AUTHORIZATION CONSUMED IF DISPATCH OCCURRED**
