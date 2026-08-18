/** Dynamic-match routes only (`/play/[matchId]`, `/pvp/[matchId]`, `/tutorial/[matchId]`) - never
 * the `/play` lobby (mode/deck select) or the static `/tutorial/victory` and `/tutorial/archetypes`
 * pages, which keep the normal app chrome (TopBar/BottomNav/page padding). Single shared predicate
 * so route-awareness (AppShell chrome, mobile match viewport-fit) can't drift between call sites. */
const TUTORIAL_NON_MATCH_SLUGS = new Set(['victory', 'archetypes']);

export function isActiveMatchRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 2) return false;
  const [root, slug] = segments;
  if (root === 'play' || root === 'pvp') return true;
  if (root === 'tutorial') return !TUTORIAL_NON_MATCH_SLUGS.has(slug ?? '');
  return false;
}
