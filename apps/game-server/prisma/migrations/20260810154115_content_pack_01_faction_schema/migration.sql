-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "archetypeTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "faction" TEXT NOT NULL DEFAULT 'NEUTRAL',
ADD COLUMN     "isCrossoverEligible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isNeutral" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isReferenceContent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subFactions" TEXT[] DEFAULT ARRAY[]::TEXT[];
