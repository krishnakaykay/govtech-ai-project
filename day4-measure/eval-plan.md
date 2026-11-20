# Eval plan · Passport application checker agent

**Scenario:** B · ICA passport applications

**Status: draft. Everything in this file is Proposed** for the group to decide, except where it says **Decided**. All data is synthetic (made up).

This plan brings together what is measured, how often, by whom, and what each result means for the decision. The details stay in the files listed under each layer.

## The decision this plan serves

**Continue, pivot or stop**, after the officer test is run with people. This is the open decision in `day1-discover-define/one-pager.md` and `day3-build/ai-prd.md`.

**The question the numbers answer:** can the system help applicants get it right before they submit, without ever approving an application wrongly?

**Riskiest assumption** (`day2-validate/build-log.md`): fewer than 0.0001% of approved passport applications are approved wrongly, that is, approved when they should have been returned or escalated.

**Targets** (`day1-discover-define/opportunity.md`):

- return rate below 0.5%
- wrong approvals below 0.0001%

**Limit:** 0.0001% cannot be measured directly. At about 520,000 applications a year, that is about one wrong approval every two years. Showing a rate that low would take about 3 million error-free cases. So this plan shows it in parts: the rules, the agent, the officer, and live use.

## What is measured

Four layers. Each one catches what the layer before it cannot.

### Layer 1 · Automatic tests: does the rule check work?

| Test | What it checks | Pass when | Last result |
|---|---|---|---|
| `test-check.js` | 12 sample cases get the expected rule check result | All 12 match | 12 of 12 |
| `test-false-approvals.js` | 119 made-up cases, with the answers set by hand | 0 wrong Approved on cases the rules can see, and 0 good cases held back | 0 of 57, 0 of 42. Pass |
| `test-unhappy-path.js` | System down, duplicates, impossible inputs | 16 of 16 | 16 of 16 |

**What this layer cannot see:** untrue answers. The rules suggest Approved for **20 of 20** of them, because they only see what was typed.

All three tests are in `day2-validate/prototype/`.

### Layer 2 · Human eval: does the agent catch what the rules miss?

| What | Where | Pass when | Last result |
|---|---|---|---|
| Eight fixed cases, scored with the rubric | `eval-cases.md`, `human-rubric.md` | Yes on Q1 to Q3 (deal-breakers), and 4 or 5 on Q4 and Q5 *(Decided)* | 8 of 8, scored by Claude only, not calibrated |

**What this layer cannot see yet:**
- cases the agent has never met, because all eight were used to tune it
- an independent grader's view
- real document contents, because the descriptions are made up

Results go in `eval-results.md`.

### Layer 3 · Officer test: do officers catch what the agent and rules miss?

| What | Where | Pass when | Last result |
|---|---|---|---|
| 20 made-up cases, 10 of them untrue answers, decided by people acting as officers | "Start the officer test" on `officer.html` | Every bad case caught | **Not run yet** |

**Why it matters most:** the officer is the last safety net. In a scripted test, an officer who approves without reading let **10 of 10** bad cases through.

Also measure, once it is run:
- how long each case takes
- how often officers agree with the suggestion

### Layer 4 · Live use: does it work for real? *(Only after go-live)*

| Metric | How it is counted | Floor or line |
|---|---|---|
| Wrong approvals | Approvals later found wrong, out of all approvals | **Kill switch:** any one found. The duty officer switches the agent off (`operating-model.md`) |
| Return rate | Applications returned for missing or wrong details, out of all submitted | Below 0.5% |
| Officer agreement | Cases where the officer's decision matches the agent's suggestion | Not set (open decision 3) |
| Escalation rate | Cases the agent escalates, out of all cases | Not set (open decision 3) |
| "Submit anyway" rate | Applicants who override the check, and how many of them were right to | Not set (open decision 3) |
| Officer review time | Minutes per case, against today | Not set (open decision 3) |
| Privacy | Replies a stranger can read by guessing IDs | 0. **Fails today: 20 of 20** |

Counted from the agent log (`day3-build/CLAUDE.md`, Logs) and the officer queue.

## How often, and who

Roles come from `day3-build/operating-model.md`.

| What | How often | Who runs it | Who sees the result |
|---|---|---|---|
| Layer 1 automatic tests | On every change to the rules, the code or `CLAUDE.md`, and before every save | Engineering lead | Agent owner |
| Layer 2 human eval | Every week, and after any change to `CLAUDE.md` or the reply wording | Agent owner runs it. Two graders score it, neither of them the author (`human-rubric.md`) | Product owner |
| Layer 3 officer test | Before go-live. Then after any change that affects what officers see | Frontline operations director, with 3 to 5 officers or stand-ins | Product owner, chief executive sponsor |
| Layer 4 live metrics | Daily for wrong approvals. Weekly for the rest | Agent owner | Product owner. Wrong approvals go to the duty officer at once |
| Calibration | Monthly, and whenever the rubric, rules or `CLAUDE.md` change | Agent owner | Graders |

## Gates

### Before go-live

Every one must pass:

1. Layer 1: all three automatic tests pass.
2. Layer 2: no deal-breaker failed, scored by two calibrated graders, neither the author, and including cases the agent has not seen.
3. Layer 3: officers catch every bad case in the officer test.
4. Privacy: a stranger can read 0 of 20 replies.
5. The real rules replace the made-up rulebook, confirmed by the passport policy team.
6. Real document descriptions exist. Until then, the agent escalates every case.

**Today:** gate 1 passes. Gate 2 passes, but only with one uncalibrated grader. Gates 3 to 6 are not met.

### Continue, pivot or stop

For the group, after the officer test. These are suggestions only:

| If | Then |
|---|---|
| All gates pass | **Continue** to a limited pilot |
| Officers miss untrue answers, even with the document descriptions in front of them | **Pivot:** for example, a document checklist officers must tick before approving, or guidance before the form (step 1 in the work map) instead of an agent |
| The agent escalates almost everything, so officers save no time | **Pivot:** narrow what the agent does, for example to the rule check and drafting only |
| Any wrong approval in testing that a fix cannot prevent | **Stop** |

## Where the numbers come from

**All synthetic today.** Every case, document and photo is made up:
- 12 samples
- 119 test cases
- 8 eval cases
- 20 officer test cases

Live numbers only exist after go-live.

Under the course rules, real data stays out of this repo. Any real numbers belong in a secure system, not here.

## Open decisions

None is decided.

1. **What result means continue, pivot or stop.** The table above is a suggestion.
2. **How many new eval cases to add,** and who writes them, so the set includes cases the agent has not seen.
3. **Floors for the live metrics** with no number yet: officer agreement, escalation rate, "submit anyway" rate, review time.
4. **How many officers** take the officer test, and whether they are real officers or stand-ins.
5. **Who the graders are** (`human-rubric.md`, open decision 5).
6. **How wrong approvals are found after the fact** in live use (`ai-prd.md`, open decision 18). The kill switch depends on it.
7. **Who owns this plan,** and signs off changes to it.
