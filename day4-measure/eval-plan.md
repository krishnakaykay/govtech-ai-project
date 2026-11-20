# Eval plan · Passport application checker agent

**Scenario:** B · ICA passport applications

**Status: draft. Everything in this file is Proposed** for the group to decide. Job roles only, no names. All data is synthetic (made up).

**Built from:** `day3-build/operating-model.md` (roles and decision rights), `day4-measure/human-rubric.md` (how answers are scored), `day4-measure/eval-cases.md` (the cases) and `day4-measure/eval-results.md` (results so far). `SCENARIO-PICK.md` was not found.

## Who owns what

| Job | Who | Proposed | Why this role |
|---|---|---|---|
| **Signs the pass bar** | **Product owner**, with the **chief executive sponsor** signing any change that loosens it | Proposed | The product owner owns permissions and the PRD (`operating-model.md`). Loosening the bar raises the risk the business owner answers for. *The 4 out of 5 bar on rubric questions 4 and 5 is already set by the participant (Decided in `human-rubric.md`)* |
| **Writes and refreshes the test cases** | **Passport policy team** sets the expected answers. **ICA officers** suggest new made-up cases from what they see go wrong | Proposed | The policy team owns the rules, so it owns what "right" means. Neither may be the person who writes the agent's instructions, so the cases test the agent rather than repeat it |
| **Keeps `eval-cases.md` in order** | **Agent owner** | Proposed | Adds and retires cases, never edits one, and records the case set version |
| **Runs the eval** | **Agent owner** runs the human eval. **Engineering lead** runs the automatic tests | Proposed | The agent owner already watches the agent day to day. The engineering lead owns the code the automatic tests cover |
| **Reviews a weekly sample** | **Two ICA officers** on a rota, as the graders. Neither may have produced the answers or changed `CLAUDE.md` that week | Proposed | They are the people who rely on the agent. Two graders, as `human-rubric.md` requires |
| **Sees the weekly result** | **Frontline operations director** and **product owner** | Proposed | The director speaks for officer workload. The product owner acts on failures |

## When it runs

| When | What runs | Who | Must pass before going on | Proposed |
|---|---|---|---|---|
| **Before go-live** | Everything: the automatic tests, the human eval on every case, the officer test with people, and the privacy check | Engineering lead, agent owner, frontline operations director | All six go-live gates below | Proposed |
| **Before every change** to `CLAUDE.md`, `rules.js`, `check.js`, the reply wording or the model | The automatic tests, and the human eval on the eight fixed cases | Engineering lead, then agent owner | No deal-breaker failed, and no case got worse than last time | Proposed |
| **Every week** | The human eval on the fixed cases. After go-live, also a random sample of real answers, scored the same way | Agent owner runs it. Two officers grade it | No deal-breaker failed. Any failure goes to the product owner the same day | Proposed |
| **When policy changes** | The policy team updates `rules.js` and `rulebook.md` together. Cases affected by the change are retired and replaced. Then the full eval runs again, and graders recalibrate | Passport policy team, agent owner | The full eval passes on the new rules **before** the change reaches applicants | Proposed |

**Go-live gates** *(Proposed)*, all six must pass:

1. **Automatic tests:** all three pass. *Today:* pass.
2. **Human eval:** no deal-breaker failed, scored by two calibrated graders, neither the author, and including cases the agent has not seen. *Today:* 8 of 8, but one uncalibrated grader, and no unseen cases.
3. **Officer test:** officers catch every bad case. *Today:* not run.
4. **Privacy:** a stranger can read 0 of 20 replies. *Today:* fails, 20 of 20.
5. **Real rules:** the made-up rulebook is replaced by the real rules, confirmed by the passport policy team. *Today:* not done.
6. **Real document descriptions:** they exist, so the agent is not escalating every case. *Today:* not done.

## How I'll know it's working

| Measure | What it is | Proposed |
|---|---|---|
| **Goal** | Applicants get their application right before they submit, so fewer are returned. No application is ever approved wrongly | Proposed |
| **Baseline** | **17%** of submissions returned today, each adding about six days (one-pager). Only **38%** read the guidance first. **Wrong approvals today: not known.** No count exists for the current process. **In the prototype:** 20 of 20 untrue answers get past the rules, and the officer test has not been run | Proposed |
| **Target** | Return rate **below 0.5%**. Wrong approvals **below 0.0001%** (`opportunity.md`) | Proposed |
| **Review date** | **Day 30** of the first 30 days below. Results are compared against the gates, and the group decides continue, pivot or stop. *No interim return-rate target for day 30 is set. See open decisions* | Proposed |
| **Usage metric** | **Share of flagged applications fixed before submitting.** Count the applications where the check showed at least one thing to fix, then the share of those where the applicant fixed it rather than pressing "submit anyway". This shows applicants are acting on the feedback, which is Hypothesis (a) in `opportunity.md` | Proposed |
| **Pattern to watch first** | **Officers approving whatever the agent suggests.** Watch for officer agreement close to 100%, with review times falling week by week. In a scripted test, an officer who approved without reading let **10 of 10** bad cases through. High agreement can look like success while the safety net is gone. Check it with the officer test, and by planting made-up bad cases in the weekly sample | Proposed |
| **Stop line** | **Any wrong approval found.** The duty officer switches the agent off within 15 minutes, and the incident runbook in `operating-model.md` applies. **Also a stop:** any reply readable by someone who is not the applicant | Proposed |

**Why the target cannot be checked directly:** at about 520,000 applications a year, 0.0001% is about one wrong approval every two years. So it is shown in parts:

- the rules (automatic tests)
- the agent (human eval)
- the officer (officer test)
- live use (wrong approvals found after the fact)

## First 30 days

All with made-up data, before any real applications. *(All Proposed.)*

| Week | What happens | Who | Done when |
|---|---|---|---|
| **Week 1 · set up** | Name a person for each role above. The participant scores the eight cases in `eval-results.md`, and Claude lists where the two scores disagree. Two officers calibrate on the five calibration cases | Product owner, agent owner, two officers | Every role has a person. Graders agree on Q1 to Q3, and are within 1 point on Q4 and Q5 |
| **Week 2 · officer test and privacy** | Run the officer test with 3 to 5 officers or stand-ins, and record the catch rate and review time. Fix the privacy gap, and rerun the ID-guessing check | Frontline operations director, engineering lead | Officer test result recorded. Privacy check at 0 of 20 |
| **Week 3 · new cases** | The policy team and officers write at least 10 new made-up cases the agent has not seen. Run the full human eval with the two calibrated graders. This is the first real baseline for the eval | Passport policy team, ICA officers, agent owner | New cases in `eval-cases.md`. First two-grader results in `eval-results.md` |
| **Week 4 · review and decide** | Compare everything against the six go-live gates. Look for the pattern to watch first in the officer test. The group decides: continue to a limited pilot, pivot, or stop | Product owner, chief executive sponsor, frontline operations director | A recorded decision. If continue, a review date for the pilot is set |

**Not in the first 30 days:** real applications. Gates 5 and 6, the real rules and real document descriptions, need work outside this course.

## Open decisions

None is decided.

1. Who each role is (week 1).
2. An interim return-rate target for the review date, since 0.5% is the long-term goal.
3. How many real answers make the weekly sample after go-live, for example 20 or 50.
4. Floors for officer agreement and the usage metric: what share counts as working, and what counts as a warning.
5. How many made-up bad cases to plant in each weekly sample, so rubber-stamping shows up.
6. Who signs off a change to this plan.
