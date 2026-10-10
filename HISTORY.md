# battleship — what changed, in plain words

Newest first. Entries before the first one here are still to be written (the backfill).

## October 2026

**battleship #22: security updates for the borrowed building blocks, in one go** · [PR #22](https://github.com/travis-horton/battleship/pull/22) · merged 26.1010.1150 · v1.0.0
- Fixed: a fresh copy of the project could no longer be installed with the standard clean-install step, because its record of exact versions had drifted from its list of requirements. That record has been rebuilt, and a clean install works again.
  Behind the scenes: brought 10 smaller borrowed building blocks up to their makers' patched versions, replacing 10 separate automatic update requests; known security warnings go from 112 to 109. The project also now keeps a plain-language history that adds an entry by itself each time a change is merged.
