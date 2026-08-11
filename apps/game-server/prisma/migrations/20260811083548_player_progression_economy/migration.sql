-- AlterTable
ALTER TABLE "users" ADD COLUMN     "highestRewardedLevel" INTEGER,
ADD COLUMN     "lastFirstWinBonusDate" TEXT;

-- CreateTable
CREATE TABLE "match_rewards" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "xpGranted" INTEGER NOT NULL,
    "softCurrencyGranted" INTEGER NOT NULL,
    "firstWinBonus" BOOLEAN NOT NULL DEFAULT false,
    "previousLevel" INTEGER NOT NULL,
    "newLevel" INTEGER NOT NULL,
    "economyVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_unlocks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "match_rewards_userId_createdAt_idx" ON "match_rewards"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "match_rewards_matchId_userId_key" ON "match_rewards"("matchId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_unlocks_userId_key_key" ON "user_unlocks"("userId", "key");

-- AddForeignKey
ALTER TABLE "match_rewards" ADD CONSTRAINT "match_rewards_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_rewards" ADD CONSTRAINT "match_rewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_unlocks" ADD CONSTRAINT "user_unlocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
