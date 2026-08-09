-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('ACTIVE', 'FINISHED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "BotDifficulty" AS ENUM ('EASY', 'NORMAL', 'HARD');

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT,
    "player2IsBot" BOOLEAN NOT NULL DEFAULT false,
    "botDifficulty" "BotDifficulty",
    "status" "MatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "seed" TEXT NOT NULL,
    "winnerId" TEXT,
    "boostSnapshotJson" JSONB NOT NULL DEFAULT '[]',
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "softCurrencyAwarded" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_events" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matches_player1Id_idx" ON "matches"("player1Id");

-- CreateIndex
CREATE INDEX "match_events_matchId_sequence_idx" ON "match_events"("matchId", "sequence");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
