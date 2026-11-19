# One Pager

Use case: Scenario B · ICA passport applications. All data is synthetic (made up).

## Problem and user

- **Problem:** applicants did not know what a complete application looked like for their situation. Officers return 17% of submissions for errors or missing documents, and each return adds about six days.
- **Main user:** members of the public applying for or renewing a passport. Parents renewing for a child were the most confused group.
- **Second user:** ICA officers, who review every application and make the final decision.

## Opportunity and evidence

- **Opportunity:** most returns could have been avoided before submission. Catch missing or wrong details while the applicant fills in the form.
- **Goal:** returns below 0.5%, and fewer than 0.0001% of approvals made wrongly.
- **Evidence so far (all made up):** a two-part false-approval test on the prototype. Results are under "Evals and gates".
- **Not yet known:** whether the three group rules cover the main reasons applications are returned today.

## Experience and trust

- **Two separate interfaces.** The test interface is for the public. The officer page is for ICA officers. The public never sees the system's suggestion.
- **Feedback before submitting.** The application page checks each field as it is filled in, shows what to fix, and lists everything still needed in a summary.
- **Replies use the application ID only.** No names or other personal details.
- **Control.** If an applicant thinks the check is wrong, they can submit anyway, and an officer checks it by hand.
- **Trust gaps found:**
  - **Hallucination:** an AI could invent a rule. The fix is to check only against the written rules (RAG).
  - **Control:** an applicant could get stuck behind a wrong check. The fix is the "submit anyway" button.

## Risks (market, technical, team)

- **Riskiest assumption:** fewer than 0.0001% of approved passport applications are approved wrongly, that is, approved when they should have been returned or escalated.
- **Technical:**
  - the rules only see what the applicant types, so untrue answers get through them
  - checking real photos and documents automatically is untested
- **Privacy:** anyone who types application IDs in order can read other people's replies. In a test, a stranger read 20 of 20 replies.
- **Operations:**
  - every application goes to an officer, about 10,000 a week
  - officers under time pressure may approve whatever the system suggests
  - "submit anyway" could fill the queue
- **Timing:** the vendor leaves in 10 weeks.
- **Pushback from the frontline director (role-play):** the prototype adds work for officers instead of saving it. Evidence that would help:
  - timed officer reviews
  - how often officers agree with the suggestion
  - how often "submit anyway" is used
  - how many returns the check prevents

## Build plan and handoff

**Built so far,** in `day2-validate/prototype/`. Plain rule checks, no AI.

- **`public.html`:** the test interface. A four-step application page with feedback on every field.
- **`officer.html`:** the officer review queue. Shows the system's suggestion, the reasons and the attached files. Includes the officer test.
- **`rules.js` and `check.js`:** the rules in one place, so they are easy to change.
- **`rulebook.md`:** a made-up rulebook, not ICA's real rules, with the group's three rules added on top.
- **Tests:** 12 sample cases and 119 made-up false-approval test cases.

**Next:**

1. Run the officer test with classmates acting as officers.
2. Fix the privacy gap. Use random IDs, or ask for a second detail before showing a reply.
3. Check the pages in a real browser.
4. Add AI in v2, if it adds something plain rule checks cannot do.

## Agent role and guardrails

- **Role:** check each application against the written rules and suggest one of: Approved, More info needed, or Escalated to officer.
- **Guardrails:** from `day2-validate/context-skill.md`.
  - A ticked box is not proof. Check the document matches what was typed.
  - Missing means not met.
  - Unsure means escalate.
  - Only use the written rules. Never invent one.
  - Replies use the application ID only.
  - Never send a final decision. Only an officer can.

## Roles and operating model

From `day3-build/operating-model.md`. Roles only, no names. **All Proposed** for the group to confirm.

**Who decides**

| Decision | Who decides | Who is consulted | Who is told |
|---|---|---|---|
| Scope | Product owner | Passport policy team, frontline operations director, engineering lead, data protection officer | Officers, service desk |
| Permissions | Product owner, with data protection officer sign-off for anything that reads personal data | Engineering lead, security lead, frontline operations director | Officers, agent owner |
| Vendor and model | Chief executive sponsor, on the engineering lead's recommendation | Security lead, data protection officer, procurement, product owner | Agent owner, officers |
| Go-live | Chief executive sponsor | Product owner, frontline operations director, engineering lead, security lead, data protection officer | Officers, service desk, public communications |
| Incident | Duty officer switches the agent off at once. Frontline operations director decides when it comes back | Engineering lead, product owner, data protection officer, security lead | Chief executive sponsor, officers, service desk |
| Retire | Chief executive sponsor | Product owner, frontline operations director, engineering lead, passport policy team | Officers, service desk, public communications |

**Key roles**

- **ICA officers:** make every final decision. Nothing reaches the applicant until an officer acts.
- **System (the agent):** only suggests, and shows why.
- **Chief executive sponsor:** the business owner. Owns the outcome and the risk.
- **Product owner:** owns what the agent does, its permissions and the PRD.
- **Frontline operations director:** runs the officers, and decides when the agent comes back after an incident.
- **Passport policy team:** owns the rules, the rulebook and `rules.js`, and signs off every rule change.
- **Engineering lead:** builds and runs the agent, and recommends the vendor and model.
- **Agent owner:** watches the log day to day, and helps find the cause of an incident.
- **Duty officer:** on call whenever the agent runs, including before and after office hours. Takes charge of an incident.
- **Data protection officer and security lead:** check personal data, access and misuse.

**If something goes wrong**

1. The **duty officer** acts first and switches the agent off within 15 minutes, without needing permission.
2. The duty officer tells the **chief executive sponsor** within 30 minutes.
3. While the agent is off, officers work as they did before it existed. An officer sends the applicant a correct reply.
4. The **frontline operations director** decides when the agent comes back, once the cause is found and the tests pass.

**Ground rules**

- The kill switch never waits for a meeting.
- A rule change is not a scope change.
- Nobody approves their own change.

**Still open:**

- whether one person can hold two roles
- who the agent owner and duty officer are
- the 15- and 30-minute limits
- whether the agent runs outside office hours

See `day3-build/operating-model.md` for the full list.

## Strategy and roadmap

### Strategy kernel

**Diagnosis**

Status quo. ICA processes about 520,000 passport applications and renewals a year through an online channel run by a vendor. The vendor is withdrawing in 10 weeks, and that date will not move. Walk-in counters cover about 35% of today's online demand. Officers return 17% of submissions for errors or missing documents; each return adds about six days. Only 38% of applicants read the guidance before they apply.

What the team found. Most returns could have been avoided before submission. Applicants did not know what a complete application looked like for their situation. Parents renewing for a child were the most confused group.

Constraints. Applications contain identity documents and sensitive personal data. Final decisions stay with ICA officers. Whatever replaces the channel must be clear about what officers decide versus what the system only suggests, and must stay accurate as rules change.

**Guiding policy**

False positive in approvals <0.0001%

**Three coherent actions**

AI Help members of public clarify information. AI takes simpler decisions. Complex decisions are given to human officers. All decisions need approval from human officers before sending to members of public

## Metrics plan and stop line

- **Success:** return rate below 0.5%, and wrong approvals below 0.0001%.
- **Stop line (kill switch):** wrong approvals above 0.0001%. In the prototype tests, any wrong approval at all.
- **Measured so far:**
  - wrong approvals in the rules test
  - good applications held back by mistake
  - privacy (replies readable by a stranger)
- **Not measured yet:**
  - officer catch rate
  - how often "submit anyway" is used
  - officer review time
  - return rate
- **Limit:** a rate as low as 0.0001% cannot be measured directly. It would take about 3 million error-free cases, so it is shown in parts instead.

## Evals and gates

**Part 1: the rules** (`test-false-approvals.js`, 119 made-up cases)

- Wrong "Approved" suggestions on problems the rules can see: **0 of 57**. Pass.
- Good applications held back by mistake: **0 of 42**. Pass.
- Untrue answers, such as a wrong file attached: **20 of 20 suggested Approved.** The rules cannot see these.

**Part 2: the officer** (officer test on `officer.html`)

- Not run yet. Needs people acting as officers.
- **Gate:** every bad case caught.

**Privacy check**

- A stranger guessing IDs read **20 of 20** replies. Fail.

**Key learning:** more rules made the check stricter but did not close the main gap. The officer is the only safety net for untrue answers.

## Decision: continue, pivot or stop

_Not decided yet. To be decided by the group after the officer test._

## Open issues

- `GROUP.md` is still blank. The group's use case is not written down.
- `SCENARIO-PICK.md` is not in the repo.
- The closest course case, "Application helper", does not allow a submit button or approvals. The prototype has both. Check with the instructor.
- The rules used are made up. It is not known whether they match the real reasons applications are returned.
- What counts as valid vaccination details is not defined.
- The privacy gap is not fixed yet.
- The officer test has not been run.
