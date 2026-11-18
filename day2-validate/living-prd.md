# Living PRD · Passport pre-submit check

**Scenario:** B · ICA passport applications

All data is synthetic (made up). This PRD describes what the code in `prototype/` actually does today, not what is planned. Where the plan and the code differ, the code wins and the gap is noted.

## Notes from the prototype review

- **[solid]** The rule checks never mark their own work. `prototype/check.js` is kept separate from the screens, and all 119 test cases have their correct answer written by hand, not worked out by the code being tested. So "0 of 57 wrong approvals" means something. The same tests also prove the weak spot honestly: all 20 untrue answers still get through.
- **[fragile]** The rules are written in two places. `prototype/rules.js` holds the numbers the check uses, but `prototype/public.html` repeats them as typed-in help text ("under 14", "300 to 400 pixels", "last 4 months", "light blue"). Change a rule in `rules.js` and the page still tells applicants the old one, and no test would notice. This breaks the constraint that the system "must stay accurate as rules change".
- **[surprise]** The applicant's full name is stored with every case. The test interface asks for it and promises it is never shown in replies, which is true. But the whole application, name included, is saved in the browser's storage, where nobody uses it. It stays there until the demo data is cleared. That is personal data collected and kept for no reason, against the constraint "do not use any PII".

## 1. Product overview

A passport application form that tells applicants what is missing or wrong as they fill it in, then sends every application to an officer, who makes the final decision.

- **For:** members of the public applying for or renewing a passport, and the ICA officers who review them.
- **How it works:** plain rule checks, no AI. The system suggests one of three outcomes: Approved, More info needed or Escalated to officer. Only an officer can decide.
- **State:** a clickable prototype. It runs in one browser, with no server, and all data is made up.

## 2. Problem and riskiest assumption

**Problem**

- Officers return 17% of submissions for errors or missing documents, and each return adds about six days.
- Most returns could have been avoided before submission. Applicants did not know what a complete application looked like for their situation.
- Parents renewing for a child were the most confused group. Only 38% of applicants read the guidance before they apply.
- The vendor running today's online channel leaves in 10 weeks. Walk-in counters cover about 35% of today's online demand.

**Riskiest assumption**

Fewer than 0.0001% of approved passport applications are approved wrongly, that is, approved when they should have been returned or escalated.

- **Kill switch:** wrong approvals above 0.0001%. In the prototype tests, any wrong approval at all.
- **Success signal:** 0 wrong approvals in both parts of the false-approval test, with no good applications held back.

## 3. User flow and screen map

**Test interface (`public.html`)**, for applicants. It never shows the system's suggestion.

1. **About the passport holder.** Application ID (given out automatically), type (new or renewal), full name, age. Age decides adult or child: under 14 is a child.
2. **Supporting documents.** Adults see one slot: identity card. Children see three: birth record, parent or guardian identity card, vaccination details. Each slot takes a typed file name and size in place of a real upload.
3. **Photo.** File name, width and height in pixels, file size, months since taken, background, face, ears, glasses, headgear.
4. **Review and submit.** Button: "Submit application".

As the applicant types:
- each field shows a red (fix), amber (an officer will check) or green message
- each step shows "Not started", "N to fix", "Needs an officer to check" or "Complete"
- the side panel "Your application so far" lists everything still needed

On submit:
- **Something to fix:** a box lists it, using the application ID only. Buttons: "Go back and fix" and "I think this is wrong: submit anyway for an officer to check".
- **Nothing to fix, or only things an officer must check:** the application goes straight to the officer queue, and the page says "Application submitted".
- **Submitted before:** "This application has already been submitted", with the button "Start a new application".
- **Save failed:** "We could not submit your application". The form is kept, with a "Try again" button.

**"Check my application"**: enter an application ID to see the officer's reply, or "waiting for an ICA officer", or "No application found".

**Officer page (`officer.html`)**

- **Waiting for a decision:** a table showing:
  - the application
  - the names of the attached files
  - what the system suggests, and why
  - a flag when the applicant overrode the check
  - two buttons: "Approve application" and "Ask for more info"
- **Replies sent:** what the system suggested, next to what the officer decided, and the reply text.
- **If a save fails:** the officer is warned, the case stays in the queue, and no reply is sent.

**Demo-only controls** (in dashed "DEMO ONLY" boxes)

- **Test interface:**
  - fill the form from 12 sample cases
  - "Make the next submit fail"
- **Officer page:**
  - "Add all sample cases to the queue"
  - "Clear all demo data"
  - "Start the officer test", which adds 20 cases and scores how many bad ones the officer approves

## 4. Success metrics

| Metric | Target | Today |
|---|---|---|
| Wrong approvals | below 0.0001% | Rules: **0 of 57** visible bad cases. Officer: not measured |
| Untrue answers caught by the rules | see note | **0 of 20.** The rules cannot see them, so the officer must catch them |
| Good applications held back by mistake | 0 | **0 of 42** |
| Officer catch rate on untrue answers | every one caught | Not measured. Officer test built, not run with people |
| Return rate | below 0.5% | Not measured |
| Replies readable by a stranger guessing IDs | 0 | **20 of 20.** Fail |
| Behaviour when the system is down | nothing lost, no duplicate | **16 of 16** unhappy-path checks pass |
| Officer review time, "submit anyway" use | not set | Not measured |

**Limit:** a rate as low as 0.0001% cannot be measured directly. It would take about 3 million error-free cases, so it is shown in parts instead.

## 5. Technical reality

**What the code is**

- **Size:** 12 files, about 1,800 lines, plain HTML, CSS and JavaScript. No build step, nothing to install, no outside libraries or services.
- **Rules:**
  - `rules.js` holds the numbers
  - `check.js` checks one application and returns the suggestion, the reasons and the field each problem belongs to. It also writes the reply, using the ID only
- **Suggestion order (`check.js`):** anything unclear means Escalated. Otherwise, anything missing or wrong means More info needed. Otherwise, Approved.
- **Storage:** `store.js` saves everything in the browser's own storage, under one key. The two pages share data only when opened in the same browser, on the same computer.
- **Application IDs:** given out in order, starting at ICA2001.
- **Forced failure:** a switch in `store.js` makes saving fail on purpose. Both pages handle it.
- **Tests:**
  - `test-check.js`: the 12 samples
  - `test-false-approvals.js`: 119 cases
  - `test-unhappy-path.js`: 16 checks
  - all pass, and all run outside the browser

**What the code does not do**

- **No server, database or login.** Anyone who opens `officer.html` can approve applications.
- **No real files.** Documents are typed file names, and the photo is described rather than uploaded.
- **The check only runs in the browser,** so it could be skipped.
- **No record of who decided what, or when.**
- **Only two officer actions:** Approve or Ask for more info. There is no Escalate or Reject, even though the system can suggest "Escalated to officer".
- **No friction on approving a flagged case.** An officer can approve a case the system flagged with one click, without opening its files.
- **Decisions are tied to the case's position in the list, not its ID.** Two open officer tabs could act on the wrong case.
- **The officer's "more info" request is a free-text pop-up.** Nothing stops personal details being typed into it.
- **"Not sure" answers come from the applicant,** not from a check of the photo.
- **The pages have never been checked in a real browser.** All testing used a stand-in page.

## 6. Assumptions and risks

**Assumptions the product rests on**

- The rules cover the main reasons applications are returned. Untested.
- Officers will read the files, not just click Approve. Untested. In a scripted test, an officer who approves everything let 10 of 10 bad cases through.
- Applicants will read and act on the feedback. Untested.
- The rules used are right. They are not: `rulebook.md` is made up, with the group's three rules on top.

**Risks**

- **Untrue answers:** the rules only see what is typed. A dental letter in the vaccination slot gets an Approved suggestion.
- **Privacy:**
  - replies can be read by anyone guessing IDs
  - the applicant's name is stored for no reason (see [surprise])
- **Rules drift:** help text and rules are written separately (see [fragile]).
- **Workload:**
  - every application goes to an officer, about 10,000 a week
  - "submit anyway" could fill the queue
- **Timing:** 10 weeks until the vendor leaves.
- **Course fit:** the closest course case, "Application helper", does not allow a submit button or approvals. The prototype has both. Check with the instructor.

## 7. In and out of scope

**In scope (built)**

- Four-step application form with live feedback on every field.
- Adult and child document rules, photo rules, and escalation when a rule cannot decide.
- "Submit anyway", flagged for the officer.
- Officer queue with the suggestion, reasons and file names. Approve or ask for more info.
- Replies by application ID only.
- Officer false-approval test.
- Unhappy path: system down, submitted twice, impossible age, empty photo file.

**Out of scope (not built)**

- AI of any kind.
- Real uploads, photo checks or document checks.
- Server, database, officer logins, audit trail, live address.
- Officer Escalate and Reject actions.
- Payment, collection appointments, change of particulars, lost passports.
- Saving a draft, telling "we don't know" apart from "it failed", and alerting the team when the system is down.

## 8. Engineering recommendation

**Keep:** `rules.js`, `check.js` and the three test files. The rule engine does not depend on the screens and could move to a server almost as is. Treat `public.html` and `officer.html` as a clickable spec of how it should feel, not as code to build on.

**Fix in the prototype first.** All are small:

1. Build the help text from `rules.js`, so the rules live in one place.
2. Stop storing the applicant's name.
3. Tie officer decisions to the application ID, not the list position.
4. Run the officer test with classmates, and record the catch rate.

**Then, before any real data:**

1. Move the rules check to a server, and run it again on every submit.
2. Officer logins, and a record of every decision.
3. Random application IDs, and a second detail before showing a reply.
4. Real document and photo uploads, with a document checklist for the officer. This is the next capability in `PROMPTS.md`.
5. Add Escalate and Reject for officers. Ask the officer to confirm before approving a flagged case.

**Decision: continue, pivot or stop.** _Not decided yet. To be decided by the group after the officer test._
