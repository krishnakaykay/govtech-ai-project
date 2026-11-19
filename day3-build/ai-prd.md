# AI PRD · Passport application checker agent

**Scenario:** B · ICA passport applications

**Status: draft.** Everything marked **Proposed** is a suggestion for the group to decide. Nothing in this file is decided yet unless it says so.

**Reviewed by the engineering lead (role-play), 2026-11-19.** Their review added "Data the agent works with", "Acceptance tests", more points in "What engineering decides", and Open decisions 11 to 18.

All data and examples are synthetic (made up).

**Sources:** `day2-validate/living-prd.md`, `day3-build/CLAUDE.md` and `day3-build/agent-run-log.md`. Three named sources were not found: `SCENARIO-PICK.md`, `day2-validate/handoff-note.md` and `day3-build/agent-control-panel.md`. The closest are blank templates in `10-production-spec/` and `04-agent/`. Where those files would have said something, this draft marks it as an open decision.

## Problem and user

- **Problem:** officers return 17% of passport submissions for errors or missing documents. Each return adds about six days. Most returns could have been avoided before submission.
- **Who it hurts most:** parents renewing for a child were the most confused group. Only 38% of applicants read the guidance before they apply.
- **Deadline:** the vendor running today's online channel leaves in 10 weeks.
- **Users of the agent:**
  - **ICA officers,** who get the agent's suggestion and draft reply, and make every final decision.
  - **Applicants,** who never see the agent's suggestion, only what to fix and the officer's reply.
- **Riskiest assumption:** fewer than 0.0001% of approved passport applications are approved wrongly.
- **Kill switch:** wrong approvals above 0.0001%. In tests, any wrong approval at all.

## Instructions

The agent's full instructions are in `day3-build/CLAUDE.md`. In short:

1. Check each application against the written rules.
2. Read what is known about each attached document, and compare it with what was typed.
3. Suggest one outcome: Approved, More info needed, or Escalated to officer.
4. Draft the reply, using the application ID only.
5. Put the case, the suggestion, the reasons and the draft in the officer queue.
6. Log what was done.

**How-to rules** (from `CLAUDE.md`):

- A ticked box or a file name is not proof.
- Missing means not met.
- Unsure means escalate.
- On the limit counts as inside it.
- Only use the written rules.
- Replies use the application ID only.
- Never tell an applicant they are approved.

## Tools

| Tool | What it does | Built today? |
|---|---|---|
| Read rules | Loads the rule numbers from `rules.js` and the rulebook | Yes |
| Check application | Runs the rules on one application (`checkApplication` in `check.js`) | Yes |
| Read documents | Reads a description of each attached file | **No.** Only file names exist today |
| Draft reply | Writes the reply in the agreed format (`applicantMessage` in `check.js`) | Yes |
| Add to officer queue | Puts the case and the agent's work in front of an officer | Prototype only, one browser |
| Write log | Records what was done | **No.** Written by hand in the run log |
| Flag to a person | Tells a named role when a run stops | **No** |

## Data the agent works with

Filled in from the real prototype code (`day2-validate/prototype/`). All examples are made up.

**Input: one application**

| Field | Type | Example | Notes |
|---|---|---|---|
| `id` | text | ICA8001 | Given out in order today. Must become unguessable (see What engineering decides) |
| `type` | `new` or `renewal` | renewal | |
| `age` | whole number, 0 to 120 | 36 | Under 14 is a child |
| `applicant` | `adult` or `child` | adult | Worked out from `age`. Only used if `age` is blank |
| `name` | text | Alex Example | Collected but never used. See Open decisions |
| `files` | one entry per document: `idCard`, `birthRecord`, `guardianId`, `vaccination` | `idCard`: `identity_card.pdf`, 0.8 MB | Each has a file name and size. No contents today |
| `photo.width`, `photo.height` | pixels | 350, 360 | |
| `photo.sizeMB` | number | 2.4 | |
| `photo.takenMonthsAgo` | whole number | 2 | |
| `photo.background` | `light blue`, `white`, `grey`, `patterned` | light blue | |
| `photo.face` | `visible`, `covered`, `unclear` | visible | Typed by the applicant today |
| `photo.ears` | `yes`, `no`, `unclear` | yes | Typed by the applicant today |
| `photo.glasses` | `none`, `clear`, `tinted`, `unclear` | clear | Typed by the applicant today |
| `photo.headgear` | `none`, `daily-face-visible`, `covers-face`, `not-daily`, `unclear` | none | Typed by the applicant today |
| `overridden` | yes or no | no | Applicant pressed "submit anyway" |
| Document description | text | "a dental check-up letter" | **Does not exist yet.** Made up in test cases only. See Open decisions |

**Output: what the agent puts in the officer queue**

| Field | Example |
|---|---|
| Application ID | ICA8002 |
| Rule check result | Approved |
| Agent's suggestion | Escalated to officer |
| Reasons, each linked to a field | `vaccination`: "File does not match what was typed" |
| Note to the officer | "Vaccination box ticked, but the attached file looks like a dental check-up letter." |
| Draft reply, or none | "Decision: More info needed. For your application id ICA8002…" |
| Flags | submit anyway: no · escalated: yes |
| Rule file version | 2026-11-18 |

**The agent's suggestion can differ from the rule check.** The rule check can say Approved while the agent escalates, as in Runs 1 (rerun) and 2. Both are stored, so officers and the log can see when the agent overruled the rules.

**Order the agent decides in:**

1. Run the rule check.
2. If the result is Escalated, keep it.
3. If the result is More info needed, keep it.
4. If the result is Approved, check every document against the how-to rules. If any document is a mismatch, file name only, or unclear, change the suggestion to Escalated. Otherwise keep Approved.

The agent can only make a suggestion stricter, never looser. It never turns More info needed or Escalated into Approved.

## Acceptance tests

Engineering can treat these as done when all pass. All cases are made up.

| Test | Source | Pass when |
|---|---|---|
| 12 sample cases | `test-check.js` | Every case gets its expected rule check result |
| False approvals, rules | `test-false-approvals.js` | 0 wrong Approved on cases the rules can see, 0 good cases held back |
| Unhappy path | `test-unhappy-path.js` | 16 of 16 checks pass |
| Agent runs | `agent-run-log.md` | ICA8001 escalated (file name only), ICA8002 escalated (mismatch), ICA8003 refused |
| Untrue answers | the 20 "Wrong self-report" cases in `approval-test-cases.js` | The agent suggests Approved for 0 of 20. **Not run yet**, because the agent is not built |
| Privacy | ID-guessing test | A stranger can read 0 of 20 replies. **Fails today** (20 of 20) |
| Never logged | Log review | No name, age, ID number, file contents or reply text in any log line |

## Context and memory

**Read on every run:**

- `day2-validate/rulebook.md`, which is **made up**, not ICA's real rules
- `day2-validate/context-skill.md`
- `day1-discover-define/skill-file.md`

**Memory rules** (from `CLAUDE.md`):

- Carry nothing between applications.
- Keep no personal details after a run, except what the log allows.
- Re-read the rules at the start of every run. Never rely on remembered numbers.

## Permissions

Every action the agent takes, with its tier and a **Proposed** setting. The group decides each one.

**Tiers:**
- **read:** looks, changes nothing
- **draft:** prepares something a person will see first
- **write:** changes stored data
- **send:** reaches someone outside, such as an applicant

**Settings:**
- **auto:** the agent does it
- **confirm:** a person approves first
- **block:** the agent never does it

| # | Action | Tier | Setting | Why this is proposed |
|---|---|---|---|---|
| 1 | Read the rule files and rulebook | read | auto · **Proposed** | Changes nothing. Needed for every run |
| 2 | Read the context skill and skill file | read | auto · **Proposed** | Changes nothing |
| 3 | Read the application in front of it | read | auto · **Proposed** | Needed to do the job. Holds personal data, so see Logs |
| 4 | Read descriptions of attached documents | read | auto · **Proposed** | Needed to catch untrue answers. Holds sensitive data |
| 5 | Run the rule check | read | auto · **Proposed** | Same result every time. Tested |
| 6 | Decide its suggestion (Approved, More info needed, Escalated) | draft | auto · **Proposed** | Only a suggestion. An officer sees it first |
| 7 | Write a note to the officer explaining the suggestion | draft | auto · **Proposed** | The officer sees it first |
| 8 | Draft the reply to the applicant | draft | auto · **Proposed** | Not sent. The officer sees it first |
| 9 | Add the case to the officer queue | write | auto · **Proposed** | Every case must reach an officer anyway |
| 10 | Mark a case as "submit anyway" or escalated | write | auto · **Proposed** | Adds a flag. Does not decide anything |
| 11 | Write a line to the agent log | write | auto · **Proposed** | Needed for the kill switch and audit |
| 12 | Stop a run and flag it to a person | write | auto · **Proposed** | Stopping is the safe direction |
| 13 | Retry a failed save to the queue, once | write | auto · **Proposed** | `CLAUDE.md` allows one retry, then stop |
| 14 | Send the reply to the applicant | send | block · **Proposed** | Only an officer may send |
| 15 | Approve an application | write | block · **Proposed** | Final decisions stay with ICA officers |
| 16 | Reject or close an application | write | block · **Proposed** | Final decisions stay with ICA officers |
| 17 | Change a rule, the rulebook or `rules.js` | write | block · **Proposed** | Needs policy team sign-off |
| 18 | Contact anyone else, such as another agency or the applicant's school | send | block · **Proposed** | Not part of the job |

**Points the group may want to look at first:**

- **Row 8, draft reply:** proposed as auto, because it is never sent without an officer. The group could instead choose "no draft when the suggestion is Approved". In Run 3, a draft "approved" reply could be mistaken for a confirmation.
- **Row 9, add to officer queue:** proposed as auto. But in Run 3, `CLAUDE.md` kept a refused request out of the queue. The two need to agree. See Open decisions.
- **Rows 3 and 4:** reading personal data is auto in this proposal. The group may want limits on what is read, or for how long.

## Human checkpoints

From `CLAUDE.md`. An officer must act at each point before anything moves on:

1. **Every application,** with no exceptions.
2. **Before any reply is sent.**
3. **When the agent suggests Approved.** The document descriptions go in front of the officer.
4. **When the applicant pressed "submit anyway".**
5. **When the agent escalates.** It says exactly what it could not decide.
6. **Any rule change,** signed off by the ICA passport policy team (a role).

## Stop conditions

**Escalate the one application when:**

- a rule cannot be decided either way
- a document does not match what was typed, or cannot be told
- only a file name is available for a document, with no description of what is inside it
- the application raises something the rules do not cover
- a detail is impossible, such as age below 0 or above 120

**Stop the whole run and tell a person when:**

- the rule files are missing, unreadable, or disagree with each other
- saving to the queue fails after one retry
- the agent is asked to approve, send or change a rule
- anything looks like real data
- a test shows a wrong approval (the kill switch)

## Logs

**One line per application:**

- time
- application ID
- rule file version
- suggestion
- reasons
- stop condition hit
- queued yes or no
- officer decision, filled in later

**Never logged:** names, ages, ID numbers, file contents or reply text.

**Run-level stops are logged** with what happened and who was told.

**The log is used to measure:**

- how often officers agree with the agent
- how often it escalates
- every wrong approval found later

**Example (made up):**

| Time | Application ID | Suggestion | Reasons | Stop condition | Queued |
|---|---|---|---|---|---|
| 2026-11-19 11:05 | ICA8001 | Escalated to officer | Document not checked: only the file name is available | File name only | Yes |

## Business rules

From the made-up rulebook (`day2-validate/rulebook.md`) and the group's three rules. **Not ICA's real rules.**

1. Under 14 is a child. 14 or over is an adult.
2. An adult attaches an identity card.
3. A child attaches a birth record, the identity card of a consenting parent or guardian, and vaccination details *(group rule 1)*.
4. The photo is 300 to 400 pixels wide and high, and under 20 MB *(group rule 2)*.
5. The photo was taken in the last 4 months, on a plain light blue background.
6. The face is fully visible *(group rule 3)*, and both ears are visible.
7. No tinted glasses or sunglasses. Headgear only if worn every day, with the full face visible.
8. A photo exactly on a limit passes. A file of 20 MB or more fails.
9. A blank detail counts as not met. Anything unclear or not covered is escalated.
10. The system only suggests. Every application goes to an officer, and nothing is sent until an officer acts.
11. Replies use the application ID only. The public never sees the system's suggestion.

## What engineering decides

These are technical choices for the engineering team, within the limits above:

- **Hosting.** Where the agent runs. The rules check must also run on a server, not only in the browser.
- **Documents.** How files are uploaded, and how a description of their contents is produced for the agent to read.
- **The model.** Which AI model, if any, reads the documents. How it is limited to the written rules.
- **The officer queue.** How it is built, so a decision is tied to the application ID, not its position in a list.
- **Officer access.** How officers log in, and how each decision is recorded against the officer who made it.
- **Application IDs.** How they are given out, so they cannot be guessed.
- **The log.** Where it is stored, for how long, and who can read it.
- **Rules in one place.** How the help text, the rules check and the agent all read the same rules.
- **Failure handling.** Retries, alerts and monitoring when a save fails or the system is down.
- **Trigger.** When the agent runs: on every submit is the starting point, since every case must reach an officer. Engineering decides how it is queued and how many run at once.
- **Speed and volume.** Plan for about 520,000 applications a year, roughly 10,000 a week. Engineering sets the response-time and capacity targets, unless the group sets one (see Open decisions).
- **Versioning.** How each rule file version is labelled, so every log line can say which rules were used.

## Open decisions

For the group. None of these is decided.

1. **Every permission setting in the table above.** All are Proposed.
2. **What happens to a refused request** like ICA8003. Should it stop the run and wait for a person, as `CLAUDE.md` says today? Or should it go to the officer queue with a flag, so the applicant is not delayed?
3. **Whether the agent drafts a reply when it suggests Approved,** or leaves that reply entirely to the officer.
4. **What counts as a description of a document** that the applicant did not write. Until this is decided, the agent escalates every case.
5. **Whether officers get Escalate and Reject actions.** Today they can only Approve or Ask for more info.
6. **Which real rules replace the made-up rulebook,** and who confirms them.
7. **Who is told when a run stops.** `CLAUDE.md` names the officer on duty as a role. Is that right?
8. **Whether to collect the applicant's name at all,** given it is stored but never used (the [surprise] note in `living-prd.md`).
9. **Continue, pivot or stop,** after the officer test is run with people.
10. **Course fit.** The closest course case, "Application helper", does not allow submitting or approving. Check with the instructor.

**Added after the engineering lead's review.** These block building and are not decided:

11. **Where document descriptions come from.** The agent must not trust a file name, but nothing yet produces a description of what is inside a file. Options:
    - an officer writes one
    - an AI model reads the file
    - a document service checks it

    Each changes what gets built.
12. **Is an AI model in scope for v1?** The Tools table assumes the agent reads documents. Without a model, or an officer writing descriptions, every case is escalated.
13. **What the agent does when the rule check and the documents disagree,** beyond escalating. For example, should the note to the officer always name the field?
14. **How long logs and applications are kept, and who can read them.** The PRD says what is never logged, but not how long the rest is kept.
15. **Who owns the agent once it is live.** Who watches the log, who is told when the kill switch fires, and who can turn the agent off.
16. **How fast a suggestion must be ready.** For example, before an officer opens the case, or within a set time of submitting.
17. **Whether "confirm" is used for any action.** No action is proposed as confirm today. The group may want some, such as reading sensitive documents.
18. **What counts as a wrong approval in live use,** and who records it. The kill switch needs a way to find wrong approvals after the fact.
