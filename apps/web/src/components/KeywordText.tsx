'use client';

import { useState } from 'react';
import { KEYWORD_REGISTRY, type KeywordId } from '@kod-raido/shared';

interface KeywordMatch {
  start: number;
  end: number;
  keyword: KeywordId;
}

interface Segment {
  text: string;
  keyword: KeywordId | null;
}

const CYRILLIC_TAIL = /[а-яёА-ЯЁ]/;

/**
 * Finds every keyword stem occurrence in free-form ability text (not just the first per
 * keyword, unlike findKeywordsInText which is for the objective evaluator). Extends each match
 * to the end of its Cyrillic word so "Скрыт" highlights the full "Скрытым" it matched inside.
 * Purely textual pattern matching against the shared registry - never inspects which card the
 * text came from.
 */
function findAllMatches(text: string): KeywordMatch[] {
  const lower = text.toLowerCase();
  const matches: KeywordMatch[] = [];

  for (const def of Object.values(KEYWORD_REGISTRY)) {
    for (const stem of def.matchStems) {
      const needle = stem.toLowerCase();
      let from = 0;
      for (;;) {
        const idx = lower.indexOf(needle, from);
        if (idx === -1) break;
        let end = idx + needle.length;
        while (end < text.length && CYRILLIC_TAIL.test(text[end]!)) end++;
        matches.push({ start: idx, end, keyword: def.id });
        from = idx + needle.length;
      }
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const deduped: KeywordMatch[] = [];
  let lastEnd = -1;
  for (const match of matches) {
    if (match.start < lastEnd) continue;
    deduped.push(match);
    lastEnd = match.end;
  }
  return deduped;
}

function segmentText(text: string): Segment[] {
  const matches = findAllMatches(text);
  if (matches.length === 0) return [{ text, keyword: null }];

  const segments: Segment[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start > cursor) segments.push({ text: text.slice(cursor, match.start), keyword: null });
    segments.push({ text: text.slice(match.start, match.end), keyword: match.keyword });
    cursor = match.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), keyword: null });
  return segments;
}

/**
 * Renders ability text with any mentioned keyword (Shield, Hidden, Curse, Cleanse, Impulse,
 * Resonance, ...) as a tappable span that opens a short explanation - driven entirely by the
 * shared KEYWORD_REGISTRY, never hardcoded per card.
 */
export function KeywordText({ text, className }: { text: string; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const segments = segmentText(text);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (!segment.keyword) return <span key={index}>{segment.text}</span>;
        const def = KEYWORD_REGISTRY[segment.keyword];
        const open = openIndex === index;
        return (
          <span key={index} className="relative">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              aria-describedby={open ? `keyword-tip-${index}` : undefined}
              className="rounded px-0.5 font-semibold text-raido-gold underline decoration-dotted underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-raido-gold"
            >
              {segment.text}
            </button>
            {open ? (
              <span
                id={`keyword-tip-${index}`}
                role="tooltip"
                className="absolute left-1/2 top-full z-50 mt-1 w-[min(14rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-raido-gold/40 bg-raido-black px-3 py-2 text-left text-xs normal-case leading-snug shadow-rune"
              >
                <span className="block font-bold text-raido-gold">{def.title}</span>
                <span className="mt-0.5 block text-raido-mist">{def.description}</span>
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}
