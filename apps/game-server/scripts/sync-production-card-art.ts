/* eslint-disable no-console -- This one-time operational script emits a machine-checked audit log. */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

import { PrismaClient, RightsStatus } from '@prisma/client';

// Pinned to the merged `main` commit whose seed.ts is the source of truth for the target slugs.
// Extended 11 -> 12 for Art Pack 03 Card 02 (`seal-of-the-curse`).
//
// DELIBERATELY STALE UNTIL THE CARD 02 INTEGRATION MERGES. This pin still points at the eleven-card
// commit, whose seed.ts has no production artwork fields for `seal-of-the-curse`. That makes the
// script fail closed: `deriveDesiredValues` throws
// "Missing explicit production artwork fields in seed.ts for seal-of-the-curse" before it can read
// or write anything, so no twelve-card sync can run by accident.
//
// AFTER the Card 02 integration PR merges, repoint this constant (and the two workflow pins) to that
// merge commit. Only then can a sync be dispatched, and only with a fresh owner confirmation using
// `SYNC-12-CARD-ART-PRODUCTION`.
const REQUIRED_SOURCE_COMMIT = '92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9';
const TARGET_SLUGS = [
  'necromancer-of-the-twilight-order',
  'high-warden-of-the-white-rune',
  'matriarch-of-the-spring-light',
  'lord-of-the-nameless-shadow',
  'keeper-of-the-grey-mist',
  'lord-of-the-stellar-stream',
  'whisper-of-the-forgotten',
  'ashen-blade',
  'keeper-of-smoldering-embers',
  'rune-of-the-echoing-dusk',
  'acolyte-of-the-white-rune',
  'seal-of-the-curse',
] as const;

type Mode = 'check' | 'apply';
type DesiredCardArt = {
  artworkUrl: string;
  rightsStatus: RightsStatus;
};

const prisma = new PrismaClient();

function parseArguments(): { mode: Mode; expectedSnapshot?: string } {
  const mode: Mode | undefined = process.argv.includes('--check')
    ? 'check'
    : process.argv.includes('--apply')
      ? 'apply'
      : undefined;
  const snapshotIndex = process.argv.indexOf('--expected-snapshot');
  const expectedSnapshot = snapshotIndex >= 0 ? process.argv[snapshotIndex + 1] : undefined;

  if (!mode || (process.argv.includes('--check') && process.argv.includes('--apply'))) {
    throw new Error('Exactly one mode is required: --check or --apply');
  }
  if (mode === 'apply' && !expectedSnapshot) {
    throw new Error('--apply requires --expected-snapshot from the immediately preceding --check');
  }
  if (expectedSnapshot && !/^[a-f0-9]{64}$/.test(expectedSnapshot)) {
    throw new Error('The expected snapshot must be a SHA-256 digest');
  }

  return { mode, expectedSnapshot };
}

function readSeedAtRequiredCommit(): string {
  const sourceCommit = process.env.SOURCE_COMMIT ?? REQUIRED_SOURCE_COMMIT;
  if (sourceCommit !== REQUIRED_SOURCE_COMMIT) {
    throw new Error(`SOURCE_COMMIT must equal ${REQUIRED_SOURCE_COMMIT}`);
  }

  return execFileSync('git', ['show', `${sourceCommit}:apps/game-server/prisma/seed.ts`], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
}

function deriveDesiredValues(seedSource: string): Map<string, DesiredCardArt> {
  const desired = new Map<string, DesiredCardArt>();

  for (const slug of TARGET_SLUGS) {
    const slugMarker = `slug: '${slug}'`;
    const start = seedSource.indexOf(slugMarker);
    if (start < 0 || seedSource.indexOf(slugMarker, start + slugMarker.length) >= 0) {
      throw new Error(`Expected exactly one seed definition for ${slug}`);
    }

    const nextSlug = seedSource.indexOf("slug: '", start + slugMarker.length);
    const cardSource = seedSource.slice(start, nextSlug < 0 ? seedSource.length : nextSlug);
    const artworkMatch = cardSource.match(/artworkUrl:\s*'([^']+)'/);
    const rightsMatch = cardSource.match(/rightsStatus:\s*'([^']+)'/);
    if (!artworkMatch || !rightsMatch) {
      throw new Error(`Missing explicit production artwork fields in seed.ts for ${slug}`);
    }
    if (rightsMatch[1] !== RightsStatus.owned) {
      throw new Error(`Unexpected seed rightsStatus for ${slug}: ${rightsMatch[1]}`);
    }
    if (artworkMatch[1] !== `/art/cards/${slug}.webp`) {
      throw new Error(`Unexpected seed artworkUrl for ${slug}: ${artworkMatch[1]}`);
    }

    desired.set(slug, {
      artworkUrl: artworkMatch[1],
      rightsStatus: RightsStatus.owned,
    });
  }

  if (desired.size !== TARGET_SLUGS.length) {
    throw new Error(`Source-of-truth derivation did not produce exactly ${TARGET_SLUGS.length} targets`);
  }
  return desired;
}

type CardRow = Awaited<ReturnType<typeof readTargets>>[number];

async function readTargets(client: Pick<PrismaClient, 'card'>) {
  return client.card.findMany({
    where: { slug: { in: [...TARGET_SLUGS] } },
    orderBy: { slug: 'asc' },
  });
}

function assertTargetRows(rows: CardRow[]): void {
  const uniqueSlugs = new Set(rows.map((row) => row.slug));
  const unexpected = rows.filter((row) => !TARGET_SLUGS.includes(row.slug as (typeof TARGET_SLUGS)[number]));
  if (rows.length !== TARGET_SLUGS.length || uniqueSlugs.size !== TARGET_SLUGS.length || unexpected.length > 0) {
    throw new Error(
      `Target invariant failed: rows=${rows.length}, unique=${uniqueSlugs.size}, unexpected=${unexpected.length}`,
    );
  }
  for (const slug of TARGET_SLUGS) {
    if (!uniqueSlugs.has(slug)) throw new Error(`Missing target row: ${slug}`);
  }
}

function canonicalize(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }
  return value;
}

function digest(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');
}

function preWriteSnapshot(rows: CardRow[]): string {
  return digest(rows);
}

function nonTargetFingerprint(row: CardRow): string {
  const { artworkUrl: _artworkUrl, rightsStatus: _rightsStatus, updatedAt: _updatedAt, ...nonTarget } = row;
  return digest(nonTarget);
}

function fingerprintMap(rows: CardRow[]): Map<string, string> {
  return new Map(rows.map((row) => [row.slug, nonTargetFingerprint(row)]));
}

function needsChange(row: CardRow, desired: Map<string, DesiredCardArt>): boolean {
  const target = desired.get(row.slug);
  if (!target) throw new Error(`No desired values for ${row.slug}`);
  return row.artworkUrl !== target.artworkUrl || row.rightsStatus !== target.rightsStatus;
}

function assertSourceOfTruth(rows: CardRow[], desired: Map<string, DesiredCardArt>): void {
  const mismatches = rows.filter((row) => needsChange(row, desired));
  if (mismatches.length > 0) {
    throw new Error(`Source-of-truth mismatch after update: ${mismatches.map((row) => row.slug).join(', ')}`);
  }
}

function assertNonTargetIntegrity(before: Map<string, string>, afterRows: CardRow[]): void {
  const changed = afterRows.filter((row) => before.get(row.slug) !== nonTargetFingerprint(row));
  if (changed.length > 0) {
    throw new Error(`Non-target fields changed: ${changed.map((row) => row.slug).join(', ')}`);
  }
}

function printSafeReport(rows: CardRow[], desired: Map<string, DesiredCardArt>): void {
  let mutationCount = 0;
  console.log(`TARGET_ROWS=${rows.length}`);
  console.log(`UNIQUE_SLUGS=${new Set(rows.map((row) => row.slug)).size}`);
  for (const row of rows) {
    const target = desired.get(row.slug);
    if (!target) throw new Error(`No desired values for ${row.slug}`);
    const change = needsChange(row, desired);
    if (change) mutationCount += 1;
    console.log(`CARD slug=${row.slug}`);
    console.log(`id=${row.id}`);
    console.log(`currentArtworkUrl=${row.artworkUrl}`);
    console.log(`currentRightsStatus=${row.rightsStatus}`);
    console.log(`desiredArtworkUrl=${target.artworkUrl}`);
    console.log(`desiredRightsStatus=${target.rightsStatus}`);
    console.log(`needsChange=${change ? 'YES' : 'NO'}`);
  }
  console.log(`ROWS_REQUIRING_MUTATION=${mutationCount}`);
  console.log(`SOURCE_OF_TRUTH_MATCH=${rows.length - mutationCount}/${TARGET_SLUGS.length}`);
  console.log(`PRE_WRITE_SNAPSHOT=${preWriteSnapshot(rows)}`);
  console.log(`NON_TARGET_FINGERPRINTS=${fingerprintMap(rows).size}`);
}

async function check(desired: Map<string, DesiredCardArt>): Promise<void> {
  const rows = await readTargets(prisma);
  assertTargetRows(rows);
  printSafeReport(rows, desired);
}

async function apply(desired: Map<string, DesiredCardArt>, expectedSnapshot: string): Promise<void> {
  const immediateRows = await readTargets(prisma);
  assertTargetRows(immediateRows);
  if (preWriteSnapshot(immediateRows) !== expectedSnapshot) {
    throw new Error('PRE-WRITE state changed between --check and --apply');
  }

  console.log('TRANSACTION_STARTED=YES');
  const result = await prisma.$transaction(
    async (transaction) => {
      const beforeRows = await readTargets(transaction);
      assertTargetRows(beforeRows);
      if (preWriteSnapshot(beforeRows) !== expectedSnapshot) {
        throw new Error('PRE-WRITE state changed before the transaction acquired its snapshot');
      }

      const beforeFingerprints = fingerprintMap(beforeRows);
      const totalCardsBefore = await transaction.card.count();
      const changedRows = beforeRows.filter((row) => needsChange(row, desired));

      for (const row of changedRows) {
        const target = desired.get(row.slug);
        if (!target) throw new Error(`No desired values for ${row.slug}`);
        await transaction.card.update({
          where: { slug: row.slug },
          data: {
            artworkUrl: target.artworkUrl,
            rightsStatus: target.rightsStatus,
          },
        });
      }

      const afterRows = await readTargets(transaction);
      assertTargetRows(afterRows);
      assertSourceOfTruth(afterRows, desired);
      assertNonTargetIntegrity(beforeFingerprints, afterRows);
      const totalCardsAfter = await transaction.card.count();
      if (totalCardsAfter !== totalCardsBefore) throw new Error('Card count changed inside the transaction');

      return { changedRows: changedRows.length, beforeFingerprints };
    },
    { isolationLevel: 'Serializable', maxWait: 10_000, timeout: 30_000 },
  );

  const committedRows = await readTargets(prisma);
  assertTargetRows(committedRows);
  assertSourceOfTruth(committedRows, desired);
  assertNonTargetIntegrity(result.beforeFingerprints, committedRows);
  console.log('TRANSACTION_COMMITTED=YES');
  console.log(`ROWS_CHANGED=${result.changedRows}`);
  console.log(`TARGET_ROWS_FINAL=${committedRows.length}`);
  console.log(`SOURCE_OF_TRUTH_MATCH=${committedRows.length}/${TARGET_SLUGS.length}`);
  console.log('NON_TARGET_FIELD_CHANGES=0');
}

async function main(): Promise<void> {
  const { mode, expectedSnapshot } = parseArguments();
  const desired = deriveDesiredValues(readSeedAtRequiredCommit());
  if (mode === 'check') await check(desired);
  else await apply(desired, expectedSnapshot!);
}

main()
  .catch((error: unknown) => {
    if (process.argv.includes('--apply')) console.error('TRANSACTION_COMMITTED=NO');
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
