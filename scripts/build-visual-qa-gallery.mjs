#!/usr/bin/env node
/**
 * Builds the publishable Battlefield Visual QA gallery from an already-captured screenshot run.
 *
 * Input:  artifacts/battlefield-visual-qa/ containing the PNGs + manifest.json that
 *         apps/web/e2e/battlefield-visual-qa.spec.ts just produced.
 * Output: the same directory, plus `contact-sheet.jpg` (all shots on one page, captioned with
 *         state/viewport/overflow) and `index.html` (the browsable gallery).
 *
 * Deliberately a separate step from the capture spec: the gallery is a presentation concern, it
 * can be rebuilt from an existing artifact without re-running a browser against a live stack, and
 * keeping it out of the spec means a gallery bug can never fail the actual QA run.
 *
 * The contact sheet is rasterised with the Playwright Chromium the e2e suite already installs
 * rather than an image-composition library, so this adds no new dependency to the repo.
 *
 * Everything rendered here comes from manifest.json (SHAs, branch, run id, viewport, overflow
 * metrics) and the captured game screenshots. No environment variables, credentials, or logs are
 * read or emitted - this output is published to a public GitHub Pages site.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(REPO_ROOT, 'artifacts', 'battlefield-visual-qa');
const CONTACT_SHEET = 'contact-sheet.jpg';

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

const shortSha = (sha) => (sha && sha.length >= 7 ? sha.slice(0, 7) : sha ?? 'n/a');

function loadManifest() {
  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`No manifest at ${manifestPath} - run the visual QA spec first.`);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest.screenshots) || manifest.screenshots.length === 0) {
    throw new Error('manifest.json contains no screenshots - refusing to build an empty gallery.');
  }
  const missing = manifest.screenshots
    .map((s) => s.filename)
    .filter((f) => !fs.existsSync(path.join(OUT_DIR, f)));
  if (missing.length > 0) {
    throw new Error(`manifest references screenshots that are not on disk: ${missing.join(', ')}`);
  }
  return manifest;
}

/** Shared palette so the contact sheet and the gallery page read as one artifact. */
const STYLE = `
  :root {
    --bg: #0b0b10; --panel: #14141c; --line: #2a2a38;
    --text: #e8e6f0; --muted: #9a97ad; --gold: #c9a35f;
    --ok: #3fb950; --bad: #f85149;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .badge {
    display: inline-block; padding: 2px 8px; border-radius: 999px;
    font-size: 11px; font-weight: 700; letter-spacing: .04em;
  }
  .badge-ok { background: rgba(63,185,80,.14); color: var(--ok); border: 1px solid rgba(63,185,80,.35); }
  .badge-bad { background: rgba(248,81,73,.14); color: var(--bad); border: 1px solid rgba(248,81,73,.35); }
  .state { font-size: 14px; font-weight: 700; color: var(--text); }
  .vp { font-size: 12px; color: var(--gold); font-variant-numeric: tabular-nums; }
`;

function overflowBadge(shot) {
  const bad = shot.hOverflow || shot.vOverflow;
  const label = bad
    ? `OVERFLOW${shot.hOverflow ? ' H' : ''}${shot.vOverflow ? ' V' : ''}`
    : 'no overflow';
  return `<span class="badge ${bad ? 'badge-bad' : 'badge-ok'}">${label}</span>`;
}

function contactSheetHtml(manifest) {
  const cells = manifest.screenshots
    .map(
      (s) => `
      <figure class="cell">
        <div class="shot"><img src="${escapeHtml(s.filename)}" alt="${escapeHtml(s.state)}"></div>
        <figcaption>
          <div class="state">${escapeHtml(s.state)}</div>
          <div class="vp">${s.viewport.width}x${s.viewport.height}</div>
          <div>${overflowBadge(s)}</div>
        </figcaption>
      </figure>`,
    )
    .join('');

  return `<!doctype html><html><head><meta charset="utf-8"><style>${STYLE}
    body { width: 1480px; padding: 24px; }
    header { border-bottom: 2px solid var(--gold); padding-bottom: 12px; margin-bottom: 20px; }
    h1 { margin: 0 0 6px; font-size: 24px; letter-spacing: .02em; }
    .meta { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .cell { margin: 0; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 10px; }
    .shot {
      height: 400px; display: flex; align-items: center; justify-content: center;
      background: #05050a; border-radius: 6px; overflow: hidden;
    }
    .shot img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
    figcaption { padding-top: 8px; display: flex; flex-direction: column; gap: 3px; }
  </style></head><body>
    <header>
      <h1>Kod Raido - Battlefield Visual QA contact sheet</h1>
      <div class="meta">
        tested ${escapeHtml(shortSha(manifest.testedSha))}
        &middot; PR head ${escapeHtml(shortSha(manifest.prHeadSha))}
        &middot; base ${escapeHtml(shortSha(manifest.baseSha))}
        &middot; ${escapeHtml(manifest.branch ?? 'unknown')}
        &middot; ${escapeHtml(manifest.eventName ?? 'local')}
        &middot; ${escapeHtml(manifest.timestamp ?? '')}
      </div>
    </header>
    <div class="grid">${cells}</div>
  </body></html>`;
}

function galleryHtml(manifest) {
  const overflowing = manifest.screenshots.filter((s) => s.hOverflow || s.vOverflow);
  const runLink = manifest.runId
    ? `<a href="https://github.com/NexitOz/KodRaidoGame/actions/runs/${escapeHtml(manifest.runId)}">run ${escapeHtml(manifest.runId)}</a>`
    : 'local run';

  const metaRow = (label, value, mono = true) =>
    `<div class="row"><dt>${escapeHtml(label)}</dt><dd${mono ? ' class="mono"' : ''}>${value}</dd></div>`;

  const commitLink = (sha) =>
    sha
      ? `<a href="https://github.com/NexitOz/KodRaidoGame/commit/${escapeHtml(sha)}">${escapeHtml(sha)}</a>`
      : '<span class="muted">n/a (no pull_request context)</span>';

  const cards = manifest.screenshots
    .map(
      (s) => `
      <figure class="card">
        <a class="shot" href="${escapeHtml(s.filename)}" title="Open full size">
          <img loading="lazy" src="${escapeHtml(s.filename)}" alt="${escapeHtml(s.state)} at ${s.viewport.width}x${s.viewport.height}">
        </a>
        <figcaption>
          <div class="caption-top">
            <span class="state">${escapeHtml(s.state)}</span>
            <span class="vp">${s.viewport.width}x${s.viewport.height}</span>
          </div>
          <div>${overflowBadge(s)}</div>
          <div class="metrics">
            scroll ${s.scrollWidth}x${s.scrollHeight} / client ${s.clientWidth}x${s.clientHeight}
          </div>
          <a class="file" href="${escapeHtml(s.filename)}">${escapeHtml(s.filename)}</a>
        </figcaption>
      </figure>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Kod Raido - Battlefield Visual QA</title>
<style>${STYLE}
  body { padding: 0 0 64px; }
  .wrap { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
  header.top { border-bottom: 1px solid var(--line); background: linear-gradient(180deg,#12121a,#0b0b10); padding: 28px 0 22px; margin-bottom: 24px; }
  h1 { margin: 0 0 4px; font-size: 26px; letter-spacing: .02em; }
  .sub { color: var(--muted); font-size: 14px; margin-bottom: 20px; }
  dl { margin: 0; display: grid; gap: 6px; }
  .row { display: grid; grid-template-columns: 130px 1fr; gap: 12px; font-size: 13px; align-items: baseline; }
  dt { color: var(--muted); }
  dd { margin: 0; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; word-break: break-all; }
  .muted { color: var(--muted); }
  a { color: var(--gold); }
  a:hover { color: #e6c98d; }
  .links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
  .links a {
    background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
    padding: 8px 14px; text-decoration: none; font-size: 13px; font-weight: 600;
  }
  .links a:hover { border-color: var(--gold); }
  .summary {
    margin: 0 0 22px; padding: 12px 16px; border-radius: 10px; font-size: 14px;
    border: 1px solid; display: flex; align-items: center; gap: 10px;
  }
  .summary.ok { border-color: rgba(63,185,80,.4); background: rgba(63,185,80,.08); }
  .summary.bad { border-color: rgba(248,81,73,.4); background: rgba(248,81,73,.08); }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .12em; color: var(--gold); margin: 28px 0 14px; font-weight: 700; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
  .card { margin: 0; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 12px; }
  .shot { display: flex; align-items: center; justify-content: center; height: 340px; background: #05050a; border-radius: 8px; overflow: hidden; }
  .shot img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
  figcaption { padding-top: 10px; display: flex; flex-direction: column; gap: 6px; }
  .caption-top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .metrics { font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .file { font-size: 11.5px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  footer { color: var(--muted); font-size: 12px; margin-top: 40px; border-top: 1px solid var(--line); padding-top: 16px; }
</style></head>
<body>
<header class="top"><div class="wrap">
  <h1>Kod Raido &mdash; Battlefield Visual QA</h1>
  <div class="sub">${manifest.screenshots.length} screenshots captured from the live app &middot; ${runLink}</div>
  <dl>
    ${metaRow('Tested SHA', commitLink(manifest.testedSha))}
    ${metaRow('PR head SHA', commitLink(manifest.prHeadSha))}
    ${metaRow('Base SHA', commitLink(manifest.baseSha))}
    ${metaRow('Branch', escapeHtml(manifest.branch ?? 'unknown'))}
    ${metaRow('Event', escapeHtml(manifest.eventName ?? 'local'))}
    ${metaRow('Generated', escapeHtml(manifest.timestamp ?? ''))}
  </dl>
  <div class="links">
    <a href="${CONTACT_SHEET}">Contact sheet (all ${manifest.screenshots.length})</a>
    <a href="manifest.json">manifest.json</a>
    <a href="summary.md">summary.md</a>
  </div>
</div></header>

<div class="wrap">
  <div class="summary ${overflowing.length > 0 ? 'bad' : 'ok'}">
    ${
      overflowing.length > 0
        ? `<strong>${overflowing.length} of ${manifest.screenshots.length}</strong> screenshot(s) report document overflow: ${overflowing
            .map((s) => escapeHtml(s.state))
            .join(', ')}.`
        : `<strong>No overflow detected.</strong> All ${manifest.screenshots.length} screenshots have scrollWidth &le; clientWidth and scrollHeight &le; clientHeight.`
    }
  </div>

  <h2>Screenshots</h2>
  <div class="grid">${cards}</div>

  <footer>
    Generated by <code>.github/workflows/battlefield-visual-qa.yml</code> from
    <code>apps/web/e2e/battlefield-visual-qa.spec.ts</code>. Screenshots are captured against a
    throwaway CI stack (ephemeral Postgres/Redis service containers seeded with reference content)
    and contain no production data.
  </footer>
</div>
</body></html>`;
}

async function main() {
  const manifest = loadManifest();

  fs.writeFileSync(path.join(OUT_DIR, '_contact-sheet.html'), contactSheetHtml(manifest));

  const browser = await chromium.launch(
    fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {},
  );
  try {
    const page = await browser.newPage({ viewport: { width: 1480, height: 1200 } });
    await page.goto(pathToFileURL(path.join(OUT_DIR, '_contact-sheet.html')).href, {
      waitUntil: 'networkidle',
    });
    await page.screenshot({
      path: path.join(OUT_DIR, CONTACT_SHEET),
      fullPage: true,
      type: 'jpeg',
      quality: 82,
    });
  } finally {
    await browser.close();
  }

  // The scratch HTML exists only to be rasterised; leaving it in the published gallery would just
  // be a second, unstyled copy of index.html.
  fs.rmSync(path.join(OUT_DIR, '_contact-sheet.html'));

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), galleryHtml(manifest));

  const sheetKb = Math.round(fs.statSync(path.join(OUT_DIR, CONTACT_SHEET)).size / 1024);
  console.log(`[visual-qa-gallery] ${CONTACT_SHEET} (${sheetKb} KB) + index.html for ${manifest.screenshots.length} screenshots`);
}

main().catch((error) => {
  console.error('[visual-qa-gallery] failed:', error);
  process.exit(1);
});
