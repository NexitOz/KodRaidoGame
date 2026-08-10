-- CreateTable
CREATE TABLE "metric_snapshots" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "listens" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "soundUses" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resonance_snapshots" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "tier" INTEGER NOT NULL,
    "boostPercent" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "reasonsJson" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "resonance_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "metric_snapshots_mediaAssetId_capturedAt_idx" ON "metric_snapshots"("mediaAssetId", "capturedAt");

-- CreateIndex
CREATE INDEX "resonance_snapshots_cardId_calculatedAt_idx" ON "resonance_snapshots"("cardId", "calculatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_provider_externalId_key" ON "media_assets"("provider", "externalId");

-- AddForeignKey
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resonance_snapshots" ADD CONSTRAINT "resonance_snapshots_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

