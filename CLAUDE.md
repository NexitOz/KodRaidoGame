# Claude Code — repository instructions

Permanent instructions for Claude Code working in `KodRaidoGame`. These apply to every session
and outlive any individual chat.

# Agent Handoff Protocol

The chat window is **not** the record of what happened. Chat scrolls away, gets truncated, and
cannot be read by the next agent or reviewer. GitHub is the canonical handoff record — write the
report there, then keep the chat reply short.

This exists so a human or another agent can pick up work later without anyone re-pasting a long
report by hand.

## A) Substantial task **with** a Pull Request

Publish the full final implementation report as a **comment on that PR**. Start the comment with
exactly this heading:

```
## AGENT HANDOFF — FINAL REPORT
```

The report must cover all of:

- **Task**
- **Branch**
- **PR**
- **Base SHA**
- **Head SHA**
- **Status:** OPEN / NOT MERGED
- **Scope**
- **Exact changed files**
- **What changed**
- **Why the changes were necessary**
- **Validation results** — lint, typecheck, tests, build
- **CI / workflow runs**
- **Visual QA** (if applicable)
- **Screenshot / artifact names and locations** (if applicable)
- **Overflow / responsive results** (if applicable)
- **Known issues / caveats**
- **Confirmed untouched areas**
- **Recommended next action**

Rules for the content:

- Give exact commit SHAs and workflow run IDs/URLs wherever they exist. "CI passed" without a run
  ID is not verifiable later.
- When CI generates screenshots, link the GitHub Actions artifact or the Visual QA gallery. Never
  paste images into chat as the record.
- Report what actually happened, including failures and anything left undone. A report that hides a
  problem is worse than no report, because the next agent trusts it.

## B) Substantial task **without** a Pull Request

Save the full report to:

```
docs/agent-reports/YYYY-MM-DD-<task-slug>.md
```

Use `docs/agent-reports/TEMPLATE.md` as the starting structure. See
`docs/agent-reports/README.md` for details.

## C) Keep the chat reply short

Once the report is in GitHub, the reply in chat is a pointer to it, not a duplicate of it. Roughly:

```
Completed.
PR: #XX
HEAD: <sha>
CI: green / status
Full report: PR comment / report path
Merged: NO
```

About 5–8 short lines. Expand only if the user explicitly asks for the full report in chat.

## D) GitHub is canonical

Never treat a chat message as the task history. If it is not in the PR comment or in
`docs/agent-reports/`, it is effectively lost.

## E) Never commit large QA artifacts

Do not commit screenshot matrices, PNG/JPG QA output, or other large binaries. Use GitHub Actions
artifacts and the existing Visual QA infrastructure
(`.github/workflows/battlefield-visual-qa.yml`) instead. `artifacts/` is gitignored — keep it that
way.

## F) Verify before declaring completion

Do not report success on the strength of having _intended_ to do these. Check each one:

1. The PR comment (or report file) was actually created — fetch it back and confirm.
2. State its GitHub location in the reply.
3. Verify the branch name and head SHA are what you claim.
4. Verify no unrelated files changed (`git status`, `git diff --check`, read the diff).
