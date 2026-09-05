---
name: trim-comments
description: Remove unnecessary comments from code and tighten the ones that remain. Use whenever the user asks to clean up, trim, or remove comments, says there are "too many comments" or "불필요한 주석," or asks for a comment pass on a file, diff, or PR — even if they don't name this skill directly.
---

# Trim Comments

Strip out comments that don't earn their place, and cut the survivors down to the essential point.

## Scope

If the user names specific files, work on those. Otherwise default to the current diff (uncommitted changes, or the current branch's diff against its base branch) — don't go comment-hunting across the whole codebase unless asked.

## Remove a comment if it:

- **Restates the code.** Anything a competent reader gets from the identifiers and structure alone — including comments that just narrate a type keyword or language feature (e.g. explaining that `Partial<X>` makes fields optional).
- **Is outdated.** Describes behavior, a rationale, or a shape that no longer matches the code next to it.
- **Is low-value.** Trivia, a restatement of the function/variable name in sentence form, or context nobody will need to safely read or modify this code.
- **Duplicates another comment.** If the same explanation already lives on a type, function, or nearby line, keep it in the one place it's most useful and delete the rest.

## Keep a comment only if it:

- States something **not expressible in the code itself** — a hidden constraint, a non-obvious invariant, a platform/library quirk, the reason a workaround or type assertion exists, or a subtle behavior that would surprise a future reader (including yourself).
- Is **necessary to understand the logic** — removing it would leave a real gap, not just a nice-to-have.

If a comment doesn't clear both bars, delete it.

## Keep survivors short

A surviving comment must carry only its essential point — no restating context the code already shows, no multi-clause justification. If it's currently 3+ lines, compress it to 1–2. If you can't compress it without losing the actual non-obvious fact, that's a sign the comment was trying to do too much — keep only the fact, drop the rest.

## Procedure

1. Identify the comments in scope.
2. Classify each one against the remove/keep criteria above. When unsure, prefer removing — comments are proven necessary by what breaks or confuses without them, not by default.
3. For keepers, rewrite to the shortest form that still states the non-obvious fact.
4. If the project has a type-check, build, or test command (check `package.json` scripts, `CLAUDE.md`, or ask), run it after editing — comment removal should never be paired with silent code changes, but double-check nothing was accidentally altered.
5. Report what was removed and why, briefly — don't just show a diff without explanation.
