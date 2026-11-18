# Build log · Day 2 validate

**Scenario:** B · ICA passport applications

All data in this file and in `prototype/` is synthetic (made up).

## Riskiest assumption

Fewer than 0.0001% of approved passport applications are approved wrongly, that is, approved when they should have been returned or escalated.

- **Risk type:** Feasibility. Can the rules and the officer check together be built to stay below this rate?
- **Kill switch:** if false positive of passport is > 0.0001%. In the prototype tests, that means any wrong approval at all, because the test sets are far too small to show a rate that low.
- **Success signal:** 0 wrong approvals in both tests below, with no good applications held back by mistake.

## Rules used

- The group's three rules, from `day1-discover-define/skill-file.md`.
- A made-up rulebook on top, in `rulebook.md`: who counts as a child, documents for adults and children, and more photo rules. **It is not ICA's real rules.**

## How the prototype tests it

A wrong approval needs two things to go wrong: the rules suggest "Approved" for a bad application, and the officer approves it anyway. Each part has its own test.

### Part 1: the rules (`prototype/test-false-approvals.js`)

- 119 made-up applications in `prototype/approval-test-cases.js`. 42 should be approved and 77 should not.
- The correct answer for each case is set by hand, not worked out by the rules.
- Includes edge cases: photos at 299, 300, 400 and 401 pixels, files just under, at and over 20 MB, photos exactly 4 months old, and holders aged 13 and 14.
- Includes 20 cases where what the applicant typed is not true, about the vaccination file, photo, identity card or birth record. The rules cannot see these, so they are counted separately.

### Part 2: the officer (`prototype/officer.html`, "Start the officer test")

- Adds 20 made-up applications to the queue. The rules suggest Approved for all 20.
- 10 are fine. 10 should not be approved: the attached documents do not match what the applicant typed. All four kinds of untrue answer are included.
- Each case shows a short, made-up description of its documents. The officer has to read it to spot the problem.
- The page counts how many bad cases the officer approved.

## Results

### Part 1, run on 2026-11-18, group rules only

- Wrong "Approved" suggestions the rules could have caught: **0 of 50**
- Good applications held back by mistake: **0 of 40**
- Untrue answers the rules cannot see: **10 of 10 suggested Approved**

### Part 1, rerun on 2026-11-18, with the made-up rulebook added

- Wrong "Approved" suggestions the rules could have caught: **0 of 57**
- Good applications held back by mistake: **0 of 42**
- Untrue answers the rules cannot see: **20 of 20 suggested Approved**

The rules pass on what they can see. But every untrue answer gets through them, so the officer is the only safety net for these cases. More rules did not close this gap.

### Part 2

_Not run yet. Needs people acting as officers._

## What these tests cannot show

- A rate as low as 0.0001% cannot be measured directly. It would take about 3 million error-free cases.
- The test cases are made up by the team, so they only cover problems the team thought of.
