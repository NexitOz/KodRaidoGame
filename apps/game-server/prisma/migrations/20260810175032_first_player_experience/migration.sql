-- AlterEnum
ALTER TYPE "BotDifficulty" ADD VALUE 'TUTORIAL';

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "isTutorial" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tutorialCompletedAt" TIMESTAMP(3),
ADD COLUMN     "tutorialCurrentStep" INTEGER,
ADD COLUMN     "tutorialRewardClaimedAt" TIMESTAMP(3),
ADD COLUMN     "tutorialSkippedAt" TIMESTAMP(3),
ADD COLUMN     "tutorialStartedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "payloadJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_type_createdAt_idx" ON "analytics_events"("type", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_userId_idx" ON "analytics_events"("userId");
