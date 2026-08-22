import fs from 'node:fs';

const pagePath = 'apps/web/src/app/admin/art-review/page.tsx';
const source = fs.readFileSync(pagePath, 'utf8');
const slug = 'keeper-of-smoldering-embers';

if (source.includes(`slug: '${slug}'`)) {
  console.log(`${slug} is already registered in REVIEW_TARGETS`);
  process.exit(0);
}

const ashenBladeTarget = /\{\s*slug:\s*'ashen-blade',[\s\S]*?\},/m;
const match = source.match(ashenBladeTarget);

if (!match) {
  throw new Error('Could not find the ashen-blade REVIEW_TARGETS entry; refusing to patch an unknown page shape.');
}

const keeperTarget = `\n  {\n    slug: '${slug}',\n    faction: 'SHADOW',\n    referenceLabel: 'ART PACK 02 - PRODUCTION CANDIDATE / OWNER REVIEW',\n  },`;

const updated = source.replace(match[0], `${match[0]}${keeperTarget}`);

if (!updated.includes(`slug: '${slug}'`)) {
  throw new Error('Keeper review target was not inserted.');
}

fs.writeFileSync(pagePath, updated);
console.log(`Registered ${slug} in ${pagePath}`);
console.log('No seed, artworkUrl, DB, Railway, or gameplay files were touched.');
