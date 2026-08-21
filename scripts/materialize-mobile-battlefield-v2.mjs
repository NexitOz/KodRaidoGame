import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceDir = resolve(root, 'art-source/mobile-battlefield-v2');
const output = resolve(root, 'apps/web/public/art/battlefield/kod-raido-arena-mobile-v2.webp');

const parts = [
  'chunk-00.b64',
  'chunk-01.b64',
  'chunk-02.b64',
  'chunk-03.b64',
  'chunk-04.b64',
  'chunk-05.b64',
  'chunk-06.b64',
  'chunk-07.b64',
  'chunk-08a.b64',
  'chunk-08b.b64',
  'chunk-08c.b64',
  'chunk-08d.b64',
  'chunk-09.b64',
];

const EXPECTED_BYTES = 140088;
const EXPECTED_SHA256 = '5f02adc98c53ff3c794020e733af119a8359b9a0a2b44d72f437e1d4cdc4d22d';

const encoded = (await Promise.all(parts.map((name) => readFile(resolve(sourceDir, name), 'utf8'))))
  .map((chunk) => chunk.trim())
  .join('');
const buffer = Buffer.from(encoded, 'base64');
const sha256 = createHash('sha256').update(buffer).digest('hex');

if (buffer.length !== EXPECTED_BYTES) {
  throw new Error(`Unexpected Mobile Battlefield V2 byte size: ${buffer.length} (expected ${EXPECTED_BYTES})`);
}
if (sha256 !== EXPECTED_SHA256) {
  throw new Error(`Unexpected Mobile Battlefield V2 SHA256: ${sha256}`);
}
if (buffer.subarray(0, 4).toString('ascii') !== 'RIFF' || buffer.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Materialized file is not a RIFF WebP');
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, buffer);

console.log('MOBILE_BATTLEFIELD_V2_MATERIALIZED=YES');
console.log(`OUTPUT=${output}`);
console.log(`BYTES=${buffer.length}`);
console.log(`SHA256=${sha256}`);
