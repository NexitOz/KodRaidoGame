import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { parseMetricsCsv } from './metrics-csv';

describe('parseMetricsCsv', () => {
  it('parses a full row with every column', () => {
    const csv = [
      'provider,externalId,type,url,trackSlug,capturedAt,views,listens,likes,comments,shares,soundUses,saves',
      'tiktok,vid-1,video,https://tiktok.com/vid-1,resonance-track,2026-08-01T00:00:00.000Z,1000,900,300,40,20,150,10',
    ].join('\n');

    const rows = parseMetricsCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      provider: 'tiktok',
      externalId: 'vid-1',
      type: 'video',
      url: 'https://tiktok.com/vid-1',
      trackSlug: 'resonance-track',
      views: 1000,
      listens: 900,
      likes: 300,
      comments: 40,
      shares: 20,
      soundUses: 150,
      saves: 10,
    });
    expect(rows[0]!.capturedAt.toISOString()).toBe('2026-08-01T00:00:00.000Z');
  });

  it('defaults optional columns when the CSV only has externalId', () => {
    const csv = ['externalId', 'manual-entry-1'].join('\n');
    const rows = parseMetricsCsv(csv);
    expect(rows[0]).toMatchObject({
      provider: 'manual',
      externalId: 'manual-entry-1',
      type: 'video',
      views: 0,
      listens: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      soundUses: 0,
      saves: 0,
    });
    expect(rows[0]!.trackSlug).toBeUndefined();
    expect(rows[0]!.url).toBeUndefined();
  });

  it('parses multiple data rows', () => {
    const csv = ['externalId,listens', 'a,10', 'b,20', 'c,30'].join('\n');
    const rows = parseMetricsCsv(csv);
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.externalId)).toEqual(['a', 'b', 'c']);
  });

  it('ignores blank lines', () => {
    const csv = ['externalId,listens', '', 'a,10', '   ', 'b,20', ''].join('\n');
    const rows = parseMetricsCsv(csv);
    expect(rows).toHaveLength(2);
  });

  it('rejects a CSV with no data rows', () => {
    expect(() => parseMetricsCsv('externalId,listens')).toThrow(BadRequestException);
  });

  it('rejects a CSV missing the externalId column', () => {
    expect(() => parseMetricsCsv('provider,listens\ntiktok,10')).toThrow(BadRequestException);
  });

  it('rejects a row with an empty externalId', () => {
    expect(() => parseMetricsCsv('externalId,listens\n,10')).toThrow(BadRequestException);
  });

  it('rejects a non-numeric metric value', () => {
    expect(() => parseMetricsCsv('externalId,listens\na,not-a-number')).toThrow(BadRequestException);
  });

  it('rejects an invalid capturedAt', () => {
    expect(() => parseMetricsCsv('externalId,capturedAt\na,not-a-date')).toThrow(BadRequestException);
  });
});
