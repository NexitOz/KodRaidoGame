/**
 * One-off manual verification script for the Player Progression & Economy 1.0 concurrency
 * closure pass - exercises MatchRewardService.grantMatchReward against a REAL local PostgreSQL
 * instance (not the fake-Prisma test double), because Vitest's fake transaction/lock simulation
 * cannot prove real Postgres row-level locking actually serializes the two transactions.
 *
 * Not part of the test suite or CI (this repo has no DB-backed integration test infrastructure
 * and none is being added here per the closure-pass spec) - run manually with:
 *   npx tsx scripts/verify-concurrency.ts
 * from apps/game-server, against the local dev Postgres (DATABASE_URL in .env).
 *
 * Creates its own throwaway user/matches, prints the verification results, then deletes
 * everything it created (cascades via onDelete: Cascade on Match/MatchReward/UserUnlock).
 */
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../src/prisma/prisma.service';
import { AnalyticsEventsService } from '../src/analytics-events/analytics-events.service';
import { MatchRewardService } from '../src/progression/match-reward.service';
import { REWARD_TABLE, FIRST_WIN_OF_DAY_BONUS, LEVEL_REWARDS, levelForXp } from '@kod-raido/shared';

function expectedCurrencyWithLevelRewards(baseCurrency: number, expectedXp: number): number {
  let currency = baseCurrency;
  for (let level = 2; level <= levelForXp(expectedXp); level += 1) {
    const def = LEVEL_REWARDS[level];
    if (def?.type === 'CURRENCY') currency += def.amount;
  }
  return currency;
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
  console.log(`  OK: ${message}`);
}

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  // PrismaService extends PrismaClient; MatchRewardService only calls prisma.$transaction /
  // analyticsEvents.log, so a plain PrismaClient cast works fine as its dependency here.
  const prismaService = prisma as unknown as PrismaService;
  const analyticsEvents = new AnalyticsEventsService(prismaService);
  const rewardService = new MatchRewardService(prismaService, analyticsEvents);

  const stamp = Date.now();
  const email = `concurrency-verify-${stamp}@test.local`;
  const passwordHash = await argon2.hash('irrelevant');

  console.log('=== Scenario 1: two concurrent WINs, same user, different matches ===');
  const user1 = await prisma.user.create({
    data: { email, username: `verify1-${stamp}`, passwordHash, xp: 0, softCurrency: 0, level: 1 },
  });
  const [matchA, matchB] = await Promise.all([
    prisma.match.create({ data: { player1Id: user1.id, seed: 's1', status: 'FINISHED' } }),
    prisma.match.create({ data: { player1Id: user1.id, seed: 's2', status: 'FINISHED' } }),
  ]);

  try {
    const [resA, resB] = await Promise.all([
      rewardService.grantMatchReward({ userId: user1.id, matchId: matchA.id, mode: 'PVE', result: 'WIN' }),
      rewardService.grantMatchReward({ userId: user1.id, matchId: matchB.id, mode: 'PVE', result: 'WIN' }),
    ]);

    const finalUser1 = await prisma.user.findUniqueOrThrow({ where: { id: user1.id } });
    const rewards1 = await prisma.matchReward.findMany({ where: { userId: user1.id } });
    const win = REWARD_TABLE.PVE.WIN;
    const expectedXp = win.xp * 2 + FIRST_WIN_OF_DAY_BONUS.xp;
    const expectedLevel = levelForXp(expectedXp);
    const expectedCurrency = expectedCurrencyWithLevelRewards(
      win.softCurrency * 2 + FIRST_WIN_OF_DAY_BONUS.softCurrency,
      expectedXp,
    );

    assert(resA.granted && resB.granted, 'both concurrent grants report granted=true');
    assert(rewards1.length === 2, `exactly 2 MatchReward rows exist (found ${rewards1.length})`);
    assert(
      finalUser1.xp === expectedXp,
      `final User.xp === ${expectedXp} (win.xp*2 + firstWinBonus.xp), got ${finalUser1.xp}`,
    );
    assert(
      finalUser1.softCurrency === expectedCurrency,
      `final User.softCurrency === ${expectedCurrency} (win.softCurrency*2 + bonus + any level rewards), got ${finalUser1.softCurrency}`,
    );
    assert(
      finalUser1.level === expectedLevel,
      `final User.level === levelForXp(finalXp) === ${expectedLevel}, got ${finalUser1.level}`,
    );
    assert(
      finalUser1.highestRewardedLevel === expectedLevel,
      `final User.highestRewardedLevel === ${expectedLevel}, got ${finalUser1.highestRewardedLevel}`,
    );
    const firstWinFlags = rewards1.map((r) => r.firstWinBonus);
    const trueCount = firstWinFlags.filter(Boolean).length;
    assert(trueCount === 1, `exactly one MatchReward.firstWinBonus === true (found ${trueCount})`);
    assert(finalUser1.lastFirstWinBonusDate !== null, 'lastFirstWinBonusDate was set');

    console.log('Scenario 1 PASSED: no lost update, exactly one first-win bonus.\n');
  } finally {
    await prisma.match.deleteMany({ where: { player1Id: user1.id } });
    await prisma.user.delete({ where: { id: user1.id } });
  }

  console.log('=== Scenario 2: two concurrent matches, one WIN + one LOSS, same user ===');
  const email2 = `concurrency-verify2-${stamp}@test.local`;
  const user2 = await prisma.user.create({
    data: { email: email2, username: `verify2-${stamp}`, passwordHash, xp: 0, softCurrency: 0, level: 1 },
  });
  const [matchC, matchD] = await Promise.all([
    prisma.match.create({ data: { player1Id: user2.id, seed: 's3', status: 'FINISHED' } }),
    prisma.match.create({ data: { player1Id: user2.id, seed: 's4', status: 'FINISHED' } }),
  ]);

  try {
    const [resWin, resLoss] = await Promise.all([
      rewardService.grantMatchReward({ userId: user2.id, matchId: matchC.id, mode: 'PVE', result: 'WIN' }),
      rewardService.grantMatchReward({ userId: user2.id, matchId: matchD.id, mode: 'PVE', result: 'LOSS' }),
    ]);

    const finalUser2 = await prisma.user.findUniqueOrThrow({ where: { id: user2.id } });
    const rewards2 = await prisma.matchReward.findMany({ where: { userId: user2.id } });
    const win = REWARD_TABLE.PVE.WIN;
    const loss = REWARD_TABLE.PVE.LOSS;
    const expectedXp2 = win.xp + loss.xp + FIRST_WIN_OF_DAY_BONUS.xp;
    const expectedCurrency2 = expectedCurrencyWithLevelRewards(
      win.softCurrency + loss.softCurrency + FIRST_WIN_OF_DAY_BONUS.softCurrency,
      expectedXp2,
    );

    assert(resWin.granted && resLoss.granted, 'both concurrent grants report granted=true');
    assert(rewards2.length === 2, `exactly 2 MatchReward rows exist (found ${rewards2.length})`);
    assert(
      finalUser2.xp === expectedXp2,
      `final User.xp === ${expectedXp2} (win.xp + loss.xp + firstWinBonus.xp), got ${finalUser2.xp}`,
    );
    assert(
      finalUser2.softCurrency === expectedCurrency2,
      `final User.softCurrency === ${expectedCurrency2} (win + loss + bonus + any level rewards), got ${finalUser2.softCurrency}`,
    );
    assert(resWin.firstWinBonus === true, 'the WIN grant carries firstWinBonus=true');
    assert(resLoss.firstWinBonus === false, 'the LOSS grant carries firstWinBonus=false');

    console.log('Scenario 2 PASSED: no lost update, only the WIN carries the bonus.\n');
  } finally {
    await prisma.match.deleteMany({ where: { player1Id: user2.id } });
    await prisma.user.delete({ where: { id: user2.id } });
  }

  console.log('=== Scenario 3: same match, concurrent duplicate calls (idempotency unweakened) ===');
  const email3 = `concurrency-verify3-${stamp}@test.local`;
  const user3 = await prisma.user.create({
    data: { email: email3, username: `verify3-${stamp}`, passwordHash, xp: 0, softCurrency: 0, level: 1 },
  });
  const matchE = await prisma.match.create({ data: { player1Id: user3.id, seed: 's5', status: 'FINISHED' } });

  try {
    const [r1, r2] = await Promise.all([
      rewardService.grantMatchReward({ userId: user3.id, matchId: matchE.id, mode: 'PVE', result: 'WIN' }),
      rewardService.grantMatchReward({ userId: user3.id, matchId: matchE.id, mode: 'PVE', result: 'WIN' }),
    ]);
    const finalUser3 = await prisma.user.findUniqueOrThrow({ where: { id: user3.id } });
    const rewards3 = await prisma.matchReward.findMany({ where: { userId: user3.id } });
    const win = REWARD_TABLE.PVE.WIN;
    const expectedXp3 = win.xp + FIRST_WIN_OF_DAY_BONUS.xp;

    assert(rewards3.length === 1, `exactly 1 MatchReward row for the duplicated matchId (found ${rewards3.length})`);
    assert(finalUser3.xp === expectedXp3, `final User.xp === ${expectedXp3} (granted exactly once), got ${finalUser3.xp}`);
    assert(
      [r1.granted, r2.granted].filter(Boolean).length === 1,
      'exactly one of the two concurrent same-match calls reports granted=true',
    );

    console.log('Scenario 3 PASSED: same-match idempotency holds under real Postgres.\n');
  } finally {
    await prisma.match.deleteMany({ where: { player1Id: user3.id } });
    await prisma.user.delete({ where: { id: user3.id } });
  }

  console.log('ALL REAL-POSTGRES CONCURRENCY SCENARIOS PASSED.');
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
