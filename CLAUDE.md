# Claude Code — repository instructions

Permanent instructions for Claude Code working in `KodRaidoGame`. These apply to every session
and outlive any individual chat.

# Repository bootstrap

`docs/AGENT_STATE.md` is the canonical cross-agent handoff pointer.

At the start of every session or resumed task:

1. Read `docs/AGENT_STATE.md` first.
2. Read the `docs/CLAUDE_CURRENT_TASK.md` referenced by it.
3. Read the latest handoff report or PR referenced by `docs/AGENT_STATE.md`.
4. Resolve the current branch/HEAD from GitHub before acting.
5. Treat repository state as authoritative over chat summaries when they differ.

This bootstrap exists so Claude, ChatGPT, Codex or another agent can resume work from GitHub without
the owner manually copying previous reports between chats.

# Agent Handoff Protocol

The chat window is **not** the record of what happened. Chat scrolls away, gets truncated, and
cannot be read by the next agent or reviewer. GitHub is the canonical handoff record — write the
report there, then keep the chat reply short.

This exists so a human or another agent can pick up work later without anyone re-pasting a long
report by hand.

**This protocol applies after every completed task**, including implementation, operations,
concept-only, analysis-only, review-only, QA-only and no-code tasks. A task is not complete until
its GitHub handoff record has been written, pushed, fetched back and verified.

## A) Task **with** a Pull Request

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

## B) Task **without** a Pull Request

Always save the handoff report to:

```
docs/agent-reports/YYYY-MM-DD-<task-slug>.md
```

Use `docs/agent-reports/TEMPLATE.md` as the starting structure. See
`docs/agent-reports/README.md` for details.

For a small concept/review/no-code task, the report may be concise, but it must still include:

- task and status
- repository branch and current HEAD SHA
- exact files changed, or `none`
- what was reviewed / decided / produced
- verification performed
- confirmed untouched areas
- recommended next action

If the task itself says "do not modify repository files", creating or updating this handoff report
is the **one required exception**, unless the owner explicitly says not to write a report. Do not
use that exception to change code, assets, data, workflows or any other task output.

The report must be committed/pushed to GitHub. A local-only report does not satisfy the handoff
requirement.

## C) Update the canonical state pointer

After the PR report/comment or no-PR report has been written and pushed, update:

```
docs/AGENT_STATE.md
```

This is mandatory after every completed task and is always permitted as handoff metadata, even when
the task otherwise forbids repository modifications.

The state file must point to the latest authoritative record and include at minimum:

- current phase / task
- status
- current task path
- latest report path or PR number
- latest task-result commit SHA
- branch / PR
- exact scope of changes
- open blockers / owner decisions
- recommended next action

`latest task-result commit` means the commit containing the actual task result or handoff report,
not the later metadata-only commit that updates `docs/AGENT_STATE.md`.

Update `docs/AGENT_STATE.md` **last**, then fetch it back from GitHub and verify its contents before
declaring completion.

## D) Keep the chat reply short

Once the report and `docs/AGENT_STATE.md` are in GitHub, the reply in chat is a pointer to them, not
a duplicate of the full report. Roughly:

```
Completed.
PR: #XX / none
Task-result commit: <sha>
Full report: <PR comment or report path>
State: docs/AGENT_STATE.md
Merged: YES / NO / n/a
```

About 5–8 short lines. Expand only if the user explicitly asks for the full report in chat.

## E) GitHub is canonical

Never treat a chat message as the task history. If it is not in the PR comment, in
`docs/agent-reports/`, or referenced by `docs/AGENT_STATE.md`, it is effectively lost.

## F) Never commit large QA artifacts

Do not commit screenshot matrices, PNG/JPG QA output, or other large binaries. Use GitHub Actions
artifacts and the existing Visual QA infrastructure
(`.github/workflows/battlefield-visual-qa.yml`) instead. `artifacts/` is gitignored — keep it that
way.

## G) Verify before declaring completion

Do not report success on the strength of having _intended_ to do these. Check each one:

1. The PR comment (or report file) was actually created and pushed to GitHub — fetch it back and confirm.
2. `docs/AGENT_STATE.md` was updated last, pushed, fetched back and confirmed.
3. State the GitHub report location and state-file path in the reply.
4. Verify the branch name and task-result SHA are what you claim.
5. Verify no unrelated files changed (`git status`, `git diff --check`, read the diff).
