# battleship — what changed, in plain words

Newest first, back to the project's first day.

## October 2026

**battleship #32: the change log catches up on entries it missed** · [PR #32](https://github.com/travis-horton/battleship/pull/32) · merged 26.1015.0728 · v1.0.6
- Behind the scenes: the robot that writes this file after each change now also writes in any earlier finished change it missed, oldest first, with a "recorded late" note when it is more than an hour late. If GitHub won't answer one of its lookups, it skips only that one, records the newest change anyway, and fills the gap on a later run.

**battleship #25: Bump brace-expansion from 1.1.11 to 1.1.21** · [PR #25](https://github.com/travis-horton/battleship/pull/25) · merged 26.1010.1335 · v1.0.5
- Behind the scenes: an automatic dependency update — "Bump brace-expansion from 1.1.11 to 1.1.21".

**battleship #31: Bump semver and core-js-compat** · [PR #31](https://github.com/travis-horton/battleship/pull/31) · merged 26.1010.1334 · v1.0.4
- Behind the scenes: an automatic dependency update — "Bump semver and core-js-compat".

**battleship #30: five more security updates for the borrowed building blocks, in one go** · [PR #30](https://github.com/travis-horton/battleship/pull/30) · merged 26.1010.1329 · v1.0.3
- Behind the scenes: brought five borrowed building blocks up to their makers' patched versions — two parts of the tool that translates the game's code for browsers, a password-hashing library, a pattern-matching library and a library for live connections — replacing five separate automatic update requests. Known security warnings go from 109 to 104; the game builds and all 14 automatic checks pass as before.

**battleship #29: the game can be played again** · [PR #29](https://github.com/travis-horton/battleship/pull/29) · merged 26.1010.1230 · v1.0.2
- **[Getting past setup](https://github.com/travis-horton/battleship/commit/b724662)** · merged 26.1010.1230
  Fixed: since 20.0217, submitting the setup form stopped with an error, so no game could be started or joined, and drawing a board and showing the game screen failed the same way. All three work again, and the waiting screen lists the connected players by name.
- **[The right winner and loser](https://github.com/travis-horton/battleship/commit/b724662)** · merged 26.1010.1230
  Fixed: since 20.0217, the end-of-game check looked at an opponent's fleet instead of your own, so the winner was told "You lost!" and the real loser heard nothing. Now the loser sees "You lost!" and the winner sees "You won!!", a message that had never appeared before.
- **[Ships sink again](https://github.com/travis-horton/battleship/commit/be402c7)** · merged 26.1010.1230
  Fixed: since 20.0127, if you had fired at a square yourself, an opponent's later hit on your ship in that same square did not count, so that ship could never sink. Now it counts; a square another player already hit still counts only once.
- **[Automatic checks](https://github.com/travis-horton/battleship/commit/2499419)** · merged 26.1010.1230
  Behind the scenes: added 14 automatic checks covering the setup form, counting placed ships, drawing boards, joining a game, hits and sinking, and the end of the game; 13 of them fail on the old code and all pass now.
  Try it: open Terminal and paste
      cd ~/code/battleship && npm test

**battleship #23: the project's past, written down** · [PR #23](https://github.com/travis-horton/battleship/pull/23) · merged 26.1010.1210 · v1.0.1
- Behind the scenes: the history file now covers every change from the game's first day (18.1221), not only those since 26.1010, numbered 0.1.0 through 0.1.52 so today's entry stays 1.0.0.

**battleship #22: security updates for the borrowed building blocks, in one go** · [PR #22](https://github.com/travis-horton/battleship/pull/22) · merged 26.1010.1150 · v1.0.0
- Fixed: a fresh copy of the project could no longer be installed with the standard clean-install step, because its record of exact versions had drifted from its list of requirements. That record has been rebuilt, and a clean install works again.
  Behind the scenes: brought 10 smaller borrowed building blocks up to their makers' patched versions, replacing 10 separate automatic update requests; known security warnings go from 112 to 109. The project also now keeps a plain-language history that adds an entry by itself each time a change is merged.

## October 2020

**Newer build tools, and two automatic security updates merged in** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2020-10-07&until=2020-10-07) · merged 20.1007.1458 · v0.1.52
- **[Two automatic security updates merged in](https://github.com/travis-horton/battleship/commit/33b77c3)** · merged 20.1007.1458
  Behind the scenes: brought in two automatic security updates that had been accepted on GitHub on 20.0801 ([PR #10](https://github.com/travis-horton/battleship/pull/10) and [PR #11](https://github.com/travis-horton/battleship/pull/11): newer versions of two small borrowed libraries, lodash and elliptic). The update made a minute earlier already covered them, so no file actually changed.
- **[Newer build tools](https://github.com/travis-horton/battleship/commit/6a3b167)** · merged 20.1007.1457
  Behind the scenes: moved the tools that translate the game's code for the browser (Babel) and two of the code-style checker's add-ons to newer minor versions. Nothing a player would see changed.

## August 2020

**Automatic security repair** · [commit](https://github.com/travis-horton/battleship/commit/04d8b57) · merged 20.0801.0833 · v0.1.51
- Behind the scenes: ran npm's automatic security repair, which moved React (the library the game's screens are built with), Babel, and the code-style checker's add-ons to newer versions within the same major releases.

## March 2020

**Automatic security repair** · [commit](https://github.com/travis-horton/battleship/commit/573902a) · merged 20.0319.1355 · v0.1.50
- Behind the scenes: ran npm's automatic security repair, which changed only the record of exact versions: the code reader acorn (in four places), kind-of, minimist and isarray moved to patched releases.

## February 2020

**Code tidy-up finishes** · [commit](https://github.com/travis-horton/battleship/commit/a8ce23b) · merged 20.0218.2210 · v0.1.49
- Behind the scenes: the last code-style pass, over the board, row, setup, instructions and shots-list pieces. Apostrophes and quotation marks in the instructions are now written in a form the checker accepts; they look the same on screen.
  Behind the scenes: by mistake, it also rewrote the "is this square one of your planned shots?" check and the list of connected players in a way that cannot work, so drawing a board stops with an error. Together with the slips of 20.0216 and 20.0217 this leaves the game unable to get past setup; none of the three has been fixed since. (Later fixed on 26.1010, in battleship #29: setup, drawing a board and the game screen all work again.)

**Code tidy-up continues** · [commit](https://github.com/travis-horton/battleship/commit/61fdb99) · merged 20.0217.0109 · v0.1.48
- Behind the scenes: more code-style fixes across the setup check, joining, ships and shooting code, and the board square was rewritten in the newer, simpler style the rest of the screens already used.
  Behind the scenes: by mistake, it also rewrote three checks in a way that cannot work: the check of your player name, game ID, board size and number of players when you submit the setup form, and the two "are all the ships placed?" checks. Submitting the setup form now stops with an error instead of starting or joining a game; this has not been fixed since. (Later fixed on 26.1010, in battleship #29: the setup form works again.)

**Code tidy-up begins, and the database settings move out of the page** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2020-02-16&until=2020-02-16) · merged 20.0216.2350 · v0.1.47
- **[Tidy-up, part 4](https://github.com/travis-horton/battleship/commit/e7111d4)** · merged 20.0216.2350
  Behind the scenes: rewrapped the welcome page's long paragraphs, and every screen got a fallback message ("Oops. Something went wrong.") for an unexpected state.
  Behind the scenes: by mistake, it also rewrote two spots, the list of each player's color on the game screen and the tally of earlier hits after a round of shooting, in a way that cannot work, so the game screen fails to appear once play begins. This has not been fixed since. (Later fixed on 26.1010, in battleship #29: the game screen appears again.)
- **[Tidy-up, part 3](https://github.com/travis-horton/battleship/commit/d8f5cb3)** · merged 20.0216.1141
  Behind the scenes: small code-style fixes in how the screen updates when you place a ship or take a shot. It also stopped printing the database's connection settings to the browser's developer console, which the change at 11:13 had started doing.
- **[Database settings out of the page](https://github.com/travis-horton/battleship/commit/f5d4071)** · merged 20.0216.1113
  Behind the scenes: the online database's connection settings, including its key, had been written straight into the game's public web page. They now live in a separate settings file that git is told to leave out, so they are gone from the current files, but they are still readable in the project's earlier history. A fresh copy of the project now needs its own settings file before it can connect.
- **[Code reformatted](https://github.com/travis-horton/battleship/commit/481ea6a)** · merged 20.0216.1058
  Behind the scenes: ran a code-style checker over the whole game and reformatted every file to its rules (spacing, quotation marks, line lengths), starting with the main game file ten minutes earlier ([534449c](https://github.com/travis-horton/battleship/commit/534449c)). The game worked the same afterward.
- **[Files git leaves out](https://github.com/travis-horton/battleship/commit/595bb18)** · merged 20.0216.1030
  Behind the scenes: the list of files git ignores grew to cover logs, npm's cache, the code-style checker's settings, and private settings files.
- **[Code-style checker and a color menu draft](https://github.com/travis-horton/battleship/commit/fcd4180)** · merged 20.0216.1026
  Behind the scenes: added a code-style checker (the widely used Airbnb rules, with React support) and a first draft of a small menu listing four colors (green, blue, black, red) for marking squares. The menu was never connected to the game.
## January 2020

**Hits that land on a ship work again** · [commit](https://github.com/travis-horton/battleship/commit/6e5603c) · merged 20.0127.1029 · v0.1.46
- Fixed: since the 20.0107 repeat-hit fix, any volley that landed on a ship stalled the game: the shots weren't saved and the turn never passed to the next player. Now it works again.
  Behind the scenes: the repair went back to the 20.0106 way of spotting repeat hits, so the problem the 20.0107 fix was aimed at came back: a square the board's own owner fired at earlier still counts as "already hit", and a ship can fail to sink. (Later fixed on 26.1010, in battleship #29: an opponent's hit on a square you fired at yourself now counts, and the ship sinks.)

**Intro rewrite, repeat-hit fix, record table order** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2020-01-07&until=2020-01-07) · merged 20.0107.1755 · v0.1.45
- **[Player colours show on every shot](https://github.com/travis-horton/battleship/commit/b9ba99d)** · merged 20.0107.0630
  Fixed: a square that was shot at now always shows the colour of the player who fired, instead of being covered by other colouring. Red and black, two of the right-click note colours, still show on top.
- **[Intro rewrite and repeat-hit fix](https://github.com/travis-horton/battleship/commit/49756b5)** · merged 20.0107.1233
  New: the opening page is rewritten and broken into short paragraphs. It now recommends a 12x12 board or smaller for two players and 16 to 20 for four, and it warns that game IDs are case-sensitive.
  Fixed: the repeat-hit check from the day before also counted squares that the board's own owner had fired at (a shot hits every board except the shooter's), so a ship could fail to sink. A typo in the fix meant that from now on, any volley that landed on a ship stalled the game. (Later corrected on 20.0127: volleys work again, but the original repeat-hit problem came back.) (Later fixed on 26.1010, in battleship #29: the repeat-hit problem is gone.)
- **[Record table back in turn order; your own board shows just your ships](https://github.com/travis-horton/battleship/commit/c67644e)** · merged 20.0107.1752
  New: the turn-by-turn record lists turns oldest first again. Your own ships board no longer prints turn numbers on squares that were shot; it shows only your ship letters, with each shot square coloured by the player who fired. This version had a typo that stopped the game from starting at all.
- **[Game starts again](https://github.com/travis-horton/battleship/commit/7e56f3f)** · merged 20.0107.1755
  Fixed: the typo from three minutes earlier is gone, so the game starts again.

**Player colours and turn highlighting** · [commit](https://github.com/travis-horton/battleship/commit/6cf8f84) · merged 20.0106.1633 · v0.1.44
- **[Player colours](https://github.com/travis-horton/battleship/commit/6cf8f84)** · merged 20.0106.1633
  New: each player has a colour: green, purple, yellow or brown. Whoever creates the game picks one on the setup form; players who join choose from the colours still free, or get the last one automatically. Every shot on the boards is coloured by the player who fired it, and a "Player colors" list explains which is which.
- **[Your turn stands out](https://github.com/travis-horton/battleship/commit/6cf8f84)** · merged 20.0106.1633
  New: when it's your turn, the other players' boards and the "It is your turn" line turn a pale white. The separate blank shooting board is gone, because clicking any other player's board already aims a shot, and the instructions now say so.
- **[Clearer firing and record table](https://github.com/travis-horton/battleship/commit/6cf8f84)** · merged 20.0106.1633
  New: if you press Fire before you've aimed all your shots, it tells you how many you get and how many you've aimed. The record table shows the newest turn first and fills empty cells with "Not shot yet", "No hits", or "n/a" for your own column.
  New: a square hit by more than one player now counts only once toward sinking a ship.

**serialize-to-js version bump** · [PR #8](https://github.com/travis-horton/battleship/pull/8) · merged 20.0105.2118 · v0.1.43
- Behind the scenes: the record of exact library versions now asks for serialize-to-js 3.0.1 or a later 3.x version, instead of 3.0.0.

**The game rebuilt: welcome page, shooting on any board, note colours** · [PR #7](https://github.com/travis-horton/battleship/pull/7) · merged 20.0105.2115 · v0.1.42
- **[Welcome page](https://github.com/travis-horton/battleship/commit/d8908b4)** · merged 20.0105.2115
  New: the opening page explains the game before you choose New game or Join game. It covers the classic rules, then this version's twists: you choose the board size, up to 4 people can play, and each shot hits every board except the shooter's.
- **[Placing ships](https://github.com/travis-horton/battleship/commit/e40b3bb)** · merged 20.0105.2115
  New: the placement screen spells out the rules: ships go in a straight line (across, down or diagonal), may not cross, and may not share a square. A square that breaks a rule gets a message saying why (not next to the rest of that ship, or not in line with it), and clearing a letter removes that whole ship. The Commit Ships button stays grey until every ship is placed.
- **[Waiting room and turn order](https://github.com/travis-horton/battleship/commit/7ef38e0)** · merged 20.0105.2115
  New: once you've committed your ships, you see a welcome, who is connected, and a note that you're waiting for the others. The turn order is shuffled as players join, and the first player in it gets the turn when the game is full. ([Waiting-screen fix](https://github.com/travis-horton/battleship/commit/c7d2bf6) on 20.0105.)
- **[Shooting](https://github.com/travis-horton/battleship/commit/a3e94ea)** · merged 20.0105.2115
  New: you aim by clicking squares right on the other players' boards. Each aimed square shows the turn it will count for, a "Shots taken" counter tracks how many you've aimed, and you can't aim at a square you've already fired at. The Fire button stays grey until it's your turn and all your shots are aimed.
- **[Sinking ships and losing](https://github.com/travis-horton/battleship/commit/492c462)** · merged 20.0105.2115
  New: a message pops up when your volley sinks someone's ship. When you run out of shots, you get a "You lost!" message and the game ends for you. A "You won!!" message was started too, but as written it never appears ([commit](https://github.com/travis-horton/battleship/commit/3ac70de)). (Later fixed on 26.1010, in battleship #29: "You won!!" now appears.)
- **[Record table](https://github.com/travis-horton/battleship/commit/a3e94ea)** · merged 20.0105.2115
  New: the turn-by-turn record shows each shot as a column letter and row number (like "C5"), and lists which ship letters each player hit.
- **[Note colours](https://github.com/travis-horton/battleship/commit/7ef38e0)** · merged 20.0105.2115
  New: right-click a square on another player's board to cycle it through blue, red, grey, black and green, to keep track of your guesses. The colours [stay put](https://github.com/travis-horton/battleship/commit/a76ac55) when the game updates after someone else's move.
- **[New game data layout and build tools](https://github.com/travis-horton/battleship/commit/93f70d5)** · merged 20.0105.2115
  Behind the scenes: the game's saved data is organised in a new way: settings, the state of play, and each player's ships are kept separately. Games created before this can't be rejoined. The boards were rebuilt to match, the tools that build the game were [upgraded to a newer version](https://github.com/travis-horton/battleship/commit/e2109c2), and the old built copy is [cleared out](https://github.com/travis-horton/battleship/commit/542ba42) every time the game is built or started ([build too](https://github.com/travis-horton/battleship/commit/ae9b59f)).

## December 2019

**Turn-by-turn record table** · [commit](https://github.com/travis-horton/battleship/commit/b284d5d) · merged 19.1226.1507 · v0.1.41
- New: a table beside the boards lists every turn: who fired, the squares they shot, and which ships they hit on each other player.
  Fixed: this table had been part of the game since 19.1222 but was never saved to the repo, so a fresh copy of the game couldn't start. Now it can.

**Main game code wired to the rebuilt boards** · [PR #6](https://github.com/travis-horton/battleship/pull/6) · merged 19.1226.1501 · v0.1.40
- Behind the scenes: the main game code now uses clearer names when it hands placing ships, committing ships and the setup form to the rebuilt boards. Nothing changes for players.

**Boards rebuilt in a simpler style** · [PR #5](https://github.com/travis-horton/battleship/pull/5) · merged 19.1226.1456 · v0.1.39
- Behind the scenes: the board area, each board, each row and each square were rewritten in a shorter, simpler style. Play works the same way it did before.

**A working game: fewer shots as ships sink, and a way to lose** · [commit](https://github.com/travis-horton/battleship/commit/a087e27) · merged 19.1226.1024 · v0.1.38
- New: you start with 6 shots per turn and lose one for each of your ships that is sunk, or two for your battleship. When you're down to zero you see "You lost.", and everyone else sees that you lost.
  Fixed: the shot count used to stay at 6 no matter what. The Fire button now also refuses until you've aimed every shot you get.

**Record table works with more than two players** · [commit](https://github.com/travis-horton/battleship/commit/d61f532) · merged 19.1224.1436 · v0.1.37
- Fixed: in games with three or four players, the hits record lumped all the other players into one column. Each player now gets their own column.

**Shooting finished, and hits recorded** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-12-23&until=2019-12-23) · merged 19.1223.2030 · v0.1.36
- **[Rounds and new layout](https://github.com/travis-horton/battleship/commit/84a5366)** · merged 19.1223.1307
  New: when the last player in the turn order fires, the turn number goes up and the round starts over. The screen is rearranged: your shooting board and your own ships sit side by side, the Fire button is below them, and the other players' boards come after, with the information panel alongside.
- **[Hits tracker](https://github.com/travis-horton/battleship/commit/40f59f8)** · merged 19.1223.2030
  New: every volley is checked against each other player's ships, and the hits are saved turn by turn for a record in the information panel. That record needed the table that wasn't saved to the repo until 19.1226.

**Turns pass from player to player** · [commit](https://github.com/travis-horton/battleship/commit/8c34ed1) · merged 19.1222.2046 · v0.1.35
- New: pressing Fire hands the turn to the next player in the order, and the information panel says whose turn it is. Shots already fired now show in red on the boards they hit, including your own. This version also asked for a turn-by-turn record table that wasn't saved to the repo until 19.1226, so a fresh copy of the game couldn't start until then.

**The first turn goes to someone** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-12-21&until=2019-12-21) · merged 19.1221.1826 · v0.1.34
- **[Groundwork for the squares](https://github.com/travis-horton/battleship/commit/87c25e5)** · merged 19.1221.0740
  Behind the scenes: a start on rewriting each board square in a simpler style, not used yet. The squares also get ready to mark shots that were fired, separately from shots being aimed.
- **[First turn](https://github.com/travis-horton/battleship/commit/ddce7cf)** · merged 19.1221.1826
  Fixed: once everyone has placed their ships, the first player in the shuffled order now gets the turn. Before this, nobody's turn ever started, so Fire always said "It's not your turn!".

**Aimed shots, a working turn order, and one way to start a game** · [commit](https://github.com/travis-horton/battleship/commit/7b7eab7) · merged 19.1219.2116 · v0.1.33
- New: the squares you aim at stay on your own screen, in orange, until you press Fire. Only then are they sent to the game. Fire first checks that everyone has placed their ships and that it's your turn, and player names and game IDs may now contain spaces.
  Fixed: the shuffled turn order is now actually created once everyone has placed their ships; a mistake meant it never was. Creating a new game now joins you through the same steps as joining one, using the name from the setup form, and the command that builds the game points at the right folder.

**Who's playing, and what turn it is** · [commit](https://github.com/travis-horton/battleship/commit/a6f444e) · merged 19.1217.2101 · v0.1.32
- New: during shooting, an information panel shows how many players are connected out of the total, their names, and the turn number. The ship-placement board no longer shows shots.
  Behind the scenes: groundwork for shuffling the turn order once everyone has placed their ships. (A mistake kept it from running until 19.1219.)

**Library updates; notes kept private** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-12-16&until=2019-12-16) · merged 19.1216.2147 · v0.1.31
- **[Build tool update](https://github.com/travis-horton/battleship/commit/726ebbf)** · merged 19.1216.1622
  Behind the scenes: one of the tools that builds the game was updated to a newer version. This accidentally set serialize-to-js back to 3.0.0.
- **[serialize-to-js again](https://github.com/travis-horton/battleship/commit/677146d)** · merged 19.1216.1624
  Behind the scenes: serialize-to-js is back on 3.0.1 or later, two minutes after the slip.
- **[Notes folder ignored](https://github.com/travis-horton/battleship/commit/42d699f)** · merged 19.1216.2147
  Behind the scenes: a local notes folder is no longer saved to the repo.

**Shooting screen works again** · [commit](https://github.com/travis-horton/battleship/commit/f5d78c8) · merged 19.1215.1053 · v0.1.30
- Fixed: since the 19.1130 reshuffle, the board squares couldn't check whether they had been shot at, which broke the shooting screen. They can again.

**Housekeeping and a security update** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-12-06&until=2019-12-06) · merged 19.1206.1807 · v0.1.29
- **[Editor index file ignored](https://github.com/travis-horton/battleship/commit/9637fdd)** · merged 19.1206.1559
  Behind the scenes: an index file that a code editor creates is no longer saved to the repo.
- **[serialize-to-js update](https://github.com/travis-horton/battleship/commit/054627c)** · merged 19.1206.1807
  Behind the scenes: following GitHub's recommendation, the record of exact library versions now asks for serialize-to-js 3.0.1 or later, instead of 3.0.0.

**Notes moved into the README; build cache out of the repo** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-12-04&until=2019-12-04) · merged 19.1204.0938 · v0.1.28
- **[Notes into the README](https://github.com/travis-horton/battleship/commit/b1b7cc1)** · merged 19.1204.0845
  Behind the scenes: the separate notes file was folded into the README. The note about cancelling the game ID prompt was dropped, since that was fixed on 19.1130.
- **[Build cache removed](https://github.com/travis-horton/battleship/commit/bb95288)** · merged 19.1204.0849
  Behind the scenes: 138 files that the build tool creates as a cache were deleted from the repo and won't be saved again. Some of them held copies of the game's Firebase web configuration (the connection settings for its online database).
- **[Next step noted](https://github.com/travis-horton/battleship/commit/dc389f0)** · merged 19.1204.0938
  Behind the scenes: the README now names the next thing to do: write automatic tests, and reorganise any code that gets in the way of them.

## November 2019

**Code split into sections, and a new online database** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-11-30&until=2019-11-30) · merged 19.1130.1800 · v0.1.27
- **[Split into sections; new online database](https://github.com/travis-horton/battleship/commit/2631f78)** · merged 19.1130.1227
  Behind the scenes: the game's helper code was split into separate files for setup, ships and shooting. The game now connects to a different Firebase project, so games saved in the old one can't be reached; this changed the Firebase web configuration (the online-database connection settings) in the public page. It also switched to a newer version of Firebase's web library and turned on Firebase's visitor statistics.
- **[Joining and setup moved out of the main code](https://github.com/travis-horton/battleship/commit/88f4941)** · merged 19.1130.1700
  Fixed: cancelling the "Enter game id" prompt, or leaving it blank, now just backs out instead of asking again and again. This version slipped in a new problem: if you chose a game ID that was already taken, you saw the warning but your new game replaced the old one anyway.
- **[Taken game IDs stop the setup](https://github.com/travis-horton/battleship/commit/3ca44f6)** · merged 19.1130.1717
  Fixed: choosing a game ID that's already in use now stops after the warning, instead of replacing the existing game. The problem had lasted 17 minutes.
- **[Ship placement moved out](https://github.com/travis-horton/battleship/commit/adbceb7)** · merged 19.1130.1732
  Behind the scenes: the rules that check where you place each ship letter moved into the ships file. Placement works the same way.
- **[Shooting moved out](https://github.com/travis-horton/battleship/commit/0ab3036)** · merged 19.1130.1800
  Behind the scenes: aiming and firing moved into the shooting file, and aimed shots now update the screen through the online game data. This move accidentally hid the "has this square been shot?" check from the board squares. (Later corrected on 19.1215.)

**Shooting waits for everyone, for real** · [commit](https://github.com/travis-horton/battleship/commit/43184ff) · merged 19.1129.1712 · v0.1.26
- Fixed: the check added the day before always decided that someone hadn't placed their ships yet, so Fire kept saying "Waiting on other players". It now looks at each player correctly.

**Game files moved into one folder** · [commit](https://github.com/travis-horton/battleship/commit/74a5f94) · merged 19.1129.1513 · v0.1.25
- Behind the scenes: all of the game's own files moved into a single folder, and the start command now looks there.

**Shooting waits for every player; README gives run steps** · [commit](https://github.com/travis-horton/battleship/commit/44d5c95) · merged 19.1128.1855 · v0.1.24
- New: Fire now refuses with "Waiting on other players to join/add ships." until every player has joined and placed their ships. As written, the check never let anyone through. (Later corrected on 19.1129.)
  Behind the scenes: this joined your local work with that day's README edits on GitHub. The README's old plan to rebuild the game without Firebase was replaced by the two commands that install and run it, and the notes file was renamed.

**A front page for the project** · [commit](https://github.com/travis-horton/battleship/commit/62b6c3c) · merged 19.1114.0810 · v0.1.23
- New: the project's GitHub page now opens with a short description: "My sweet battleship game." It also says you had decided to rebuild the game from scratch, with as few add-on libraries as possible, and with a database on your own server instead of Google's Firebase.

## August 2019

**Notes and a library refresh** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-08-02&until=2019-08-02) · merged 19.0802.0949 · v0.1.22
- **[To-do notes](https://github.com/travis-horton/battleship/commit/5f2bfed)** · merged 19.0802.0946
  Behind the scenes: a page of working notes was added to the project. It lists things to look into (giving each screen of the game its own web address, a ready-made add-on for that, and a choice between two build tools), a warning the game was printing, and one known bug: pressing Cancel on the "Enter game id" box still goes ahead and asks again.
- **[Library refresh](https://github.com/travis-horton/battleship/commit/94b9d28)** · merged 19.0802.0949
  Behind the scenes: updated the saved list of exact versions of the add-on libraries the game is built with. Nothing changed for a player.

## July 2019

**Clean-up after the rebuild** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-07-08&until=2019-07-08) · merged 19.0708.1502 · v0.1.21
- **[Old version deleted](https://github.com/travis-horton/battleship/commit/6325ff6)** · merged 19.0708.1453
  Behind the scenes: deleted the old single-file version of the game that the merge earlier that day left behind. The game page had already stopped using it, so nothing changed for a player.
- **[Library versions](https://github.com/travis-horton/battleship/commit/8fd19c7)** · merged 19.0708.1502
  Behind the scenes: moved the game's add-on libraries (the page-drawing library and the build tool) up to their newer versions and dropped a duplicate copy of the build tool.

**The rebuilt version, split into pieces and given shooting** · [merge](https://github.com/travis-horton/battleship/commit/82f79c8) · merged 19.0708.1356 · v0.1.20
- **[Joining fixes](https://github.com/travis-horton/battleship/commit/3211825)** · merged 19.0708.1356
  Fixed: the "Game is full" check never fired before, so any number of people could join; it now counts the players already in. Typing the name of someone who is still connected now stops with "That player is already connected", and coming back to a game after a disconnect keeps your ships locked in instead of asking you to place them again.
- **[Board labels](https://github.com/travis-horton/battleship/commit/3211825)** · merged 19.0708.1356
  Fixed: each board has a caption again: "your shooting board" over the one you aim at, and "(name)'s board" over each player's. Your own board now sits last on the screen, after the opponents' boards.
- **[Picking your shots](https://github.com/travis-horton/battleship/commit/a671b2f)** · merged 19.0708.1356
  New: once your ships are locked in, clicking a square on your shooting board marks it orange as a planned shot, and clicking it again takes the mark off. There is meant to be a limit on how many shots you get per turn, but that count had a mistake in it, so in practice only one square could be marked; the "Fire ze missiles!" button checks your shots and your turn but firing itself was not built yet.
- **[Game ID check](https://github.com/travis-horton/battleship/commit/a170292)** · merged 19.0708.1356
  Fixed: starting a new game with a game ID someone already used would silently replace that game. Now you get "Game ID already taken, choose a new game ID."
- **[Split into pieces](https://github.com/travis-horton/battleship/commit/a170292)** · merged 19.0708.1356
  Behind the scenes: the game's one long file was split into a file per screen part (the setup form, the board, a row, a square, the instructions) plus one file of game rules. Later commits on the same branch ([fdf5998](https://github.com/travis-horton/battleship/commit/fdf5998), [8426066](https://github.com/travis-horton/battleship/commit/8426066), [3019740](https://github.com/travis-horton/battleship/commit/3019740), [03c6527](https://github.com/travis-horton/battleship/commit/03c6527)) moved the pieces to the top of the project and got them loading each other correctly.
- **[New build tool](https://github.com/travis-horton/battleship/commit/ffd86bc)** · merged 19.0708.1356
  Behind the scenes: from a contributor's branch, the game is now packaged by a build tool (Parcel) instead of being translated inside your browser each time the page opens. The small program that used to serve the game on your own computer was removed; `npm run serve` replaces it. The separate build command still points at the old page, which no longer exists, so it doesn't work.
- **[Page and settings files](https://github.com/travis-horton/battleship/commit/601fa11)** · merged 19.0708.1356
  Behind the scenes: the game's page moved to the top of the project, and the online database's connection settings, including its key, were written into that new page's public files (the old page had already carried the same settings). About 140 of the build tool's scratch files were also saved into the project.

**Cancel on "Join game"** · [commit](https://github.com/travis-horton/battleship/commit/8778750) · merged 19.0706.1458 · v0.1.19
- Fixed: pressing Cancel on the "Enter game id" box used to pop the box up again, forever. Now Cancel takes you back to the start. (Later lost on 19.0708: the rebuilt version merged that day still asks again after Cancel.)
  Behind the scenes: the game's code was re-indented to two spaces.

## February 2019

**One board for every purpose** · [commit](https://github.com/travis-horton/battleship/commit/8f8c99b) · merged 19.0227.2057 · v0.1.18
- Behind the scenes: the three kinds of board (the one you type ships into, the read-only ones, and the shooting board) are now drawn by one shared board, row and square instead of three separate copies, and the light stripe on every third row came back. Two things slipped in the move: the boards after placement lost their "your ships" and "shots at (name)" captions, and the shooting board turned into typing boxes. (Later corrected on 19.0708: the merged rebuild gives every board a caption and makes the shooting board clickable.)

**Readable code and new grid lines** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-02-26&until=2019-02-26) · merged 19.0226.1730 · v0.1.17
- **[Readable again](https://github.com/travis-horton/battleship/commit/65e7dfa)** · merged 19.0226.1704
  New: the game's lettering changed from Verdana to Georgia.
  Behind the scenes: undid the jumbled layout the automatic formatter had made of the code the day before, using four-space indents. The game itself didn't change.
- **[Grid lines](https://github.com/travis-horton/battleship/commit/5d83217)** · merged 19.0226.1730
  Fixed: the lines on the boards were uneven; now every square draws its own outline, and the top row gets a top edge, so the grid looks complete. The stripe across every third row was dropped for now (every third column keeps its stripe).

**Formatting and tidying** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-02-25&until=2019-02-25) · merged 19.0225.1453 · v0.1.16
- **[Square type](https://github.com/travis-horton/battleship/commit/629caaf)** · merged 19.0225.1033
  Behind the scenes: the squares on the read-only boards changed from paragraph blocks to plain boxes, a step toward lining them up properly.
- **[Automatic formatter](https://github.com/travis-horton/battleship/commit/b409654)** · merged 19.0225.1144
  Behind the scenes: ran an automatic formatter over all the game's files, with three-space indents. It left the game the same but jumbled the layout of the screen-drawing parts of the code. (Later undone on 19.0226.)
- **[Archive deleted](https://github.com/travis-horton/battleship/commit/db8308a)** · merged 19.0225.1453
  Behind the scenes: deleted the archived copy of the original version, since the rebuild had caught up to everything it did.

**Seeing every board** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-02-21&until=2019-02-21) · merged 19.0221.1532 · v0.1.15
- **[All the boards](https://github.com/travis-horton/battleship/commit/3e478e8)** · merged 19.0221.1052
  New: after you lock in your ships you see a "your shooting board", a "Fire ze missiles!" button, a "your ships" board, and a "shots at (name)" board for each other player. Neither the button nor the shooting board does anything yet.
  Fixed: leaving the "Enter game id" box empty no longer goes ahead with a blank ID; the box asks again. (Later changed on 19.0706 so that Cancel takes you back instead.)
- **[Grid and clearing](https://github.com/travis-horton/battleship/commit/b20f598)** · merged 19.0221.1532
  Fixed: erasing a letter from the board used to leave that ship counted as one square placed, which threw off the placement rules; it now clears properly. The boards got full grid lines around every square.
  Behind the scenes: groundwork so the shooting board can respond to clicks later.

**Joining games and saving ships** · [commit](https://github.com/travis-horton/battleship/commit/e4cdce7) · merged 19.0220.1816 · v0.1.14
- New: "Join game" works again: it asks for the game ID and a player name, says "No such game in database" for an unknown ID, and lets you log back in by typing the name you used before. Your ship placement is saved to the online game only when you press "Submit ship placement" and confirm "Are you happy with your ship placement?"; after that you see your board as a finished, read-only board.
  Fixed: pressing "Submit ship placement" before all ships are placed now says "You have more ships to place!" The "Game is full" check was added but never actually fired. (Later corrected on 19.0708.)

**Back on the online database** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-02-19&until=2019-02-19) · merged 19.0219.1159 · v0.1.13
- **[Placement finished](https://github.com/travis-horton/battleship/commit/0dbd029)** · merged 19.0219.0854
  New: once all your ships are placed, the instructions and the board are replaced by the message "you've placed enough ships". (Later replaced on 19.0220 by a read-only view of your board.)
  Behind the scenes: the small program that serves the game on your own computer now uses port 8080 instead of 80, which doesn't need administrator rights.
- **[Online database](https://github.com/travis-horton/battleship/commit/e9f0453)** · merged 19.0219.1159
  New: starting a new game saves it to the online database (Google's Firebase) under its game ID, and your ships are saved there once all of them are placed. This is the rebuild's first connection to it; the connection settings themselves were already in the page from before.

**Clearer names for the two halves of the screen** · [commit](https://github.com/travis-horton/battleship/commit/bb4e28d) · merged 19.0213.1847 · v0.1.12
- Behind the scenes: the left and right halves of the ship-placing screen were renamed after what they hold (the instructions and the board area). Nothing changed for a player.

**A proper setup form** · [commit](https://github.com/travis-horton/battleship/commit/51e2e7c) · merged 19.0207.0738 · v0.1.11
- Fixed: the new-game form used to stop at the first mistake; it now lists every problem at once, trims stray spaces, and rejects names or IDs longer than 20 characters (the page said so but never checked).
  Behind the scenes: the game now keeps all of its information in one place from the start, and the project was told to stop tracking the library folder and the archived old version.

**Almost caught up** · [commit](https://github.com/travis-horton/battleship/commit/4c4007b) · merged 19.0203.1315 · v0.1.10
- Behind the scenes: deleted leftover commented-out pieces of the old version's ship-placing code. Nothing changed for a player.

**Ship placement rules, rebuilt** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-02-02&until=2019-02-02) · merged 19.0202.2331 · v0.1.9
- **[Typing ships onto the board](https://github.com/travis-horton/battleship/commit/cfd95f5)** · merged 19.0202.0754
  New: you can type ship letters (a, b, c, s, d) into the board's squares again, and anything else gets "You didn't enter a ship letter". Instructions sit on the left and the board on the right, with column letters and row numbers. A half-written rule in this version kept the page from loading at all. (Later corrected on 19.0202.)
- **[Placement rules](https://github.com/travis-horton/battleship/commit/21e99ed)** · merged 19.0202.2331
  Fixed: the page loads again, and the placement rules work: each ship can have only its own number of squares, each new square must touch the ship's others, and the squares must run in one straight line (across, down or diagonal), with a message when one breaks. Capital letters count, and erasing a letter clears that whole ship so you can place it again.
  New: the board's light stripes turned slightly blue.

## January 2019

**Rebuilding the screens** · [commit](https://github.com/travis-horton/battleship/commit/81dde1e) · merged 19.0131.0007 · v0.1.8
- New: the rebuild's first working screens: "New game" and "Join game" buttons, a setup form (player name, game ID, board size 10–20, 2–4 players) that explains each mistake, and an empty board with ship-placing instructions. While the rebuild catches up, "Join game" only says it is still under construction, and typing into the board does nothing yet.

**Clean-up and starting over** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-01-30&until=2019-01-30) · merged 19.0130.1200 · v0.1.7
- **[Library folder removed](https://github.com/travis-horton/battleship/commit/0998e9a)** · merged 19.0130.0946
  Behind the scenes: removed the downloaded copies of the add-on libraries (over 300 files) from the project, since anyone can re-download them. A commit three minutes earlier with a similar name ([c212b19](https://github.com/travis-horton/battleship/commit/c212b19)) only tidied punctuation in the game's code.
- **[Project description](https://github.com/travis-horton/battleship/commit/4e15bb8)** · merged 19.0130.1002
  Behind the scenes: the project's settings file now describes it as "my battleship game" and links to its GitHub page.
- **[Starting over](https://github.com/travis-horton/battleship/commit/1e43100)** · merged 19.0130.1200
  Behind the scenes: copied the whole working game into an archive folder and emptied the game page down to a blank frame, to rebuild it from scratch. Until the rebuild caught up, the game page showed nothing. (Later the archive was deleted on 19.0225.)

**Clearer error messages on the new-game form** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-01-07&until=2019-01-07) · merged 19.0107.1532 · v0.1.6
- **[Error messages that say what's wrong](https://github.com/travis-horton/battleship/commit/76fd05e)** · merged 19.0107.1530
  Fixed: when something on the new-game form was wrong, the alert said only "fail" (or "fail -- userId"), so you had to guess which box to fix. Now each box gets its own message, checked top to bottom: the user name and game ID must be only letters or numbers, the board size must be between 10 and 20, and the number of players must be between 2 and 4.
  New: the form's labels now read "number of players" (it had said "number of users") and "letters and/or numbers only".
- **[Waiting-message wording](https://github.com/travis-horton/battleship/commit/451d315)** · merged 19.0107.1532
  Behind the scenes: reworded a spare "waiting on other players" message to "Waiting on other players: …". The game no longer shows that message anywhere (after you confirm your ships it shows its own "Waiting on:" list), so players see no change.

**Ship placement fully working again, then hardened after a playtest** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-01-02&until=2019-01-02) · merged 19.0102.1659 · v0.1.5
- **[Placement saved online, and who you're waiting on](https://github.com/travis-horton/battleship/commit/5ace8f2)** · merged 19.0102.1612
  Fixed: erasing a letter from your board now frees that square, every letter you place or erase is saved to the online game straight away, and Submit correctly tells whether all five ships are placed.
  New: the Submit button now sits right under your board, the other players' boards are shaded grey, and once you confirm your ships the side panel lists, by name, the players who haven't finished placing theirs, updating as they finish.
  New: the instructions now admit that, for now, ships can cross each other freely, even though the rules say only the submarine may.
- **[New-game form can't be broken](https://github.com/travis-horton/battleship/commit/bac21b0)** · merged 19.0102.1659
  Fixed: a playtest found ways to break the game from the new-game form, such as names with spaces or symbols, very long names, or fractional board sizes and player counts. Now the user name and game ID must be letters and numbers only, at most 20 characters, and the board size and number of players must be whole numbers; the form says so above the boxes.
  Behind the scenes: the browser no longer offers to autofill the form's boxes with things you typed before.

**Reorganising the online game (placement briefly broken)** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2019-01-01&until=2019-01-01) · merged 19.0101.2200 · v0.1.4
- **[Rejoining a game, and "no such game"](https://github.com/travis-horton/battleship/commit/912c7f3)** · merged 19.0101.1357
  New: if you lose your connection, you can join again with the same game ID and the same user name and get your saved board back.
  Fixed: typing a game ID that doesn't exist now says "no such game"; before, nothing happened at all. Your board also starts to fill in letters you placed earlier, though they didn't show up correctly yet.
  Behind the scenes: each saved board now keeps a placeholder so the online database doesn't throw away a ship that has no squares yet.
- **[Players list and live updates](https://github.com/travis-horton/battleship/commit/d83b079)** · merged 19.0101.1801
  New: the side panel gains a "Players:" line naming everyone who has joined, and it updates by itself when someone new joins. The other players' boards now carry their real names instead of "unknown", and trying to join under a name that is already connected says "that user is already connected".
  Behind the scenes: the online game was reorganised so the shared settings and player list are kept apart from each player's ships, and games saved before this can't be opened. Mid-rework, typing a ship letter on your board stopped working (fixed later the same evening).
- **[Placing ships works again, partly](https://github.com/travis-horton/battleship/commit/d86cc49)** · merged 19.0101.2200
  Fixed: typing ship letters on your board works again and is checked against the in-line rules. Still rough at this point: placements weren't saved online, erasing a letter popped up "must be a ship letter", and Submit always said you had more ships to place (all fixed on 19.0102).
  Behind the scenes: the game now works out which direction a ship runs from its first two squares instead of remembering it separately.

## December 2018

**Online play through a shared database** · [commit](https://github.com/travis-horton/battleship/commit/86abbbe) · merged 18.1229.1613 · v0.1.3
- New: games now live in an online database (Google's Firebase), so players on different computers can share one game. Starting a game saves it under the game ID you chose, and "join game" asks for that ID, loads its board size and player count, says "This game is full" when every seat is taken, then asks you to pick a user name (once more if yours is taken) and shows your board. Every letter you place is saved online, and the game notes when a player disconnects.
  New: the page's text is no longer forced into lowercase, and the instructions and "Waiting on other players..." message are now capitalised.
  Behind the scenes: the online database's connection settings, including its key, were written into the project's public files. Still some kinks: a game ID that doesn't exist did nothing at all (fixed on 19.0101), and Submit always said "you have more ships to place!", so nobody could confirm their ships (fixed on 19.0102).

**The other players' boards, and a placement bug fixed** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2018-12-24&until=2018-12-24) · merged 18.1224.1536 · v0.1.2
- **[Stricter placement rules](https://github.com/travis-horton/battleship/commit/5ecc411)** · merged 18.1224.0920
  New: the instructions now say ships may not cross one another (except the submarine, on a diagonal) and no two ships may share a square, though the game didn't enforce either rule yet.
  This change also brought a bug: the third and later letters of any ship were silently wiped from the board as soon as you typed them (fixed later the same day).
- **[Hidden extra boards and a tidier settings panel](https://github.com/travis-horton/battleship/commit/ab5c1ed)** · merged 18.1224.1450
  New: the settings panel now shows the game ID, your user name and the number of players as plain lines with the values highlighted in yellow.
  Behind the scenes: two more boards were added to the page for other players, kept hidden for now.
- **[Other players' boards appear when you're done](https://github.com/travis-horton/battleship/commit/669e3df)** · merged 18.1224.1536
  New: once you confirm your ship placement, a board appears for each other player in the game (one fewer than the number of players), labelled "unknown's board" for now.
  Fixed: you can place every letter of a long ship again; the third and later letters are no longer wiped.

**Placing your ships** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2018-12-23&until=2018-12-23) · merged 18.1223.2039 · v0.1.1
- **[Your board appears after the form](https://github.com/travis-horton/battleship/commit/8a40ca2)** · merged 18.1223.1512
  New: after you fill in the new-game form, your board appears, as many squares wide and tall as the board size you chose and titled with your name, with a Submit button under it. The instructions and your settings now sit in a column on the left.
  New: typing in a square accepts only the five ship letters (a, b, c, s, d); anything else pops up "must be a ship letter" and clears the square. The squares you typed weren't yet recorded by their real position (fixed the same evening).
- **[Square positions and a quieter join button](https://github.com/travis-horton/battleship/commit/f2814f7)** · merged 18.1223.1616
  Fixed: each letter you type is now recorded at the square you actually typed it in, and cancelling the "join game" box no longer nags you with "Invalid game ID, try again".
  New: the instructions now say only your submarine may cross other ships, instead of saying any ship may overlap.
- **[Placement rules and Submit](https://github.com/travis-horton/battleship/commit/2a7d7ca)** · merged 18.1223.2039
  New: you can place your ships. Each ship's letters must touch and run in one straight line (across, down or diagonal), with alerts for "ship is not adjacent", "ship is not in line" and "too many of this ship"; erasing a letter takes it back off the board.
  New: Submit says "you have more ships to place!" until all five ships are complete, then asks "are you happy with your ship placement?" and shows "waiting on other players". The new-game form gains a "game id" box, and the ID you pick replaces the old placeholder; joining a game still turns down every ID, because no games were saved anywhere yet.

**The first boards and the new-game form** · [commits](https://github.com/travis-horton/battleship/commits/master?since=2018-12-21&until=2018-12-21) · merged 18.1221.1959 · v0.1.0
- **[First page: three empty boards](https://github.com/travis-horton/battleship/commit/c3e4d26)** · merged 18.1221.1036
  New: the game's first page shows three 15-by-15 grids, "your board", "player 2's board" and "player 3's board", with letters along the top and bottom and numbers down the sides; every square is a box you can type in. Below them sits an empty "shots fired" list starting at round 1.
  Behind the scenes: added a small web server that serves the game's page, and copied all the code libraries it needs into the project itself.
- **[New game / join game](https://github.com/travis-horton/battleship/commit/ed7109b)** · merged 18.1221.1918
  New: the page now opens with "new game" and "join game" buttons, and the boards are switched off for now. "New game" shows a form for your user name, board size (10–20) and number of players (2–4); submitting it shows your settings with a placeholder game ID, plus instructions for placing your five ships (aircraft carrier 5 "a"s, battleship 4 "b"s, cruiser 3 "c"s, submarine 3 "s"s, destroyer 2 "d"s, each in a straight line).
  Behind the scenes: "join game" asks for a game ID but doesn't do anything with it yet, a mistake in the form just says "fail", and a leftover test message the server printed on startup was removed.
- **[Tidying the setup code](https://github.com/travis-horton/battleship/commit/fc984c1)** · merged 18.1221.1959
  Behind the scenes: the old board code that had been switched off was deleted, and the new-game steps were reorganised, ready for rebuilding the boards; nothing a player sees changed.
