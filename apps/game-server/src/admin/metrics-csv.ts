import { BadRequestException } from '@nestjs/common';

export interface MetricsImportRow {
  provider: string;
  externalId: string;
  type: string;
  url?: string;
  trackSlug?: string;
  capturedAt: Date;
  views: number;
  listens: number;
  likes: number;
  comments: number;
  shares: number;
  soundUses: number;
  saves: number;
}

const NUMERIC_COLUMNS = ['views', 'listens', 'likes', 'comments', 'shares', 'soundUses', 'saves'] as const;

/**
 * Deliberately simple comma-split parser (no quoted-field escaping) — this
 * is an internal admin tool fed a controlled export format, not
 * user-uploaded arbitrary CSV, so full RFC 4180 support isn't worth the
 * complexity. Expected header: provider,externalId,type,url,trackSlug,
 * capturedAt,views,listens,likes,comments,shares,soundUses,saves — every
 * column but externalId is optional and defaults sensibly.
 */
export function parseMetricsCsv(csv: string): MetricsImportRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new BadRequestException('CSV must have a header row and at least one data row.');
  }

  const header = lines[0]!.split(',').map((cell) => cell.trim());
  const columnIndex = (name: string) => header.indexOf(name);

  if (columnIndex('externalId') === -1) {
    throw new BadRequestException('CSV header must include an "externalId" column.');
  }

  return lines.slice(1).map((line, i) => {
    const rowNumber = i + 2; // +1 for the header row, +1 for 1-indexing
    const cells = line.split(',').map((cell) => cell.trim());
    const get = (name: string): string | undefined => {
      const index = columnIndex(name);
      return index === -1 ? undefined : (cells[index] || undefined);
    };

    const externalId = get('externalId');
    if (!externalId) {
      throw new BadRequestException(`Row ${rowNumber}: externalId is required.`);
    }

    const capturedAtRaw = get('capturedAt');
    const capturedAt = capturedAtRaw ? new Date(capturedAtRaw) : new Date();
    if (Number.isNaN(capturedAt.getTime())) {
      throw new BadRequestException(`Row ${rowNumber}: capturedAt "${capturedAtRaw}" is not a valid date.`);
    }

    const numbers: Record<(typeof NUMERIC_COLUMNS)[number], number> = {
      views: 0,
      listens: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      soundUses: 0,
      saves: 0,
    };
    for (const column of NUMERIC_COLUMNS) {
      const raw = get(column);
      const value = raw ? Number(raw) : 0;
      if (Number.isNaN(value)) {
        throw new BadRequestException(`Row ${rowNumber}: ${column} must be a number, got "${raw}".`);
      }
      numbers[column] = value;
    }

    return {
      provider: get('provider') ?? 'manual',
      externalId,
      type: get('type') ?? 'video',
      url: get('url'),
      trackSlug: get('trackSlug'),
      capturedAt,
      ...numbers,
    };
  });
}
