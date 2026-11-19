# Operating model · Passport application checker agent

**Scenario:** B · ICA passport applications

Who decides what about the agent in `day3-build/ai-prd.md`. Roles only, no names. All examples are made up.

**Status: draft.** Every row is **Proposed** for the group to confirm.

## Decision rights

| Decision | Harness part | Who decides | Who is consulted | Who is told |
|---|---|---|---|---|
| **Scope:** what the agent does and does not do | Goal and Instructions in `CLAUDE.md`. Business rules | Product owner | Passport policy team, frontline operations director, engineering lead, data protection officer | Officers, service desk |
| **Permissions:** each action's tier and setting (auto, confirm, block) | Permissions table in `ai-prd.md`. Human checkpoints. Stop conditions | Product owner, with sign-off from the data protection officer for anything that reads personal data | Engineering lead, security lead, frontline operations director | Officers, agent owner |
| **Vendor and model:** which AI model or document service is used, and from whom | Tools. Context and memory | Chief executive sponsor, on the engineering lead's recommendation | Security lead, data protection officer, procurement, product owner | Agent owner, officers |
| **Go-live:** when the agent starts working on real applications | All of it, including Logs and the acceptance tests in `ai-prd.md` | Chief executive sponsor | Product owner, frontline operations director, engineering lead, security lead, data protection officer | Officers, service desk, public communications |
| **Incident:** what happens when it goes wrong, including the kill switch | Stop conditions. Logs | Duty officer switches it off at once (see Incident runbook). Frontline operations director decides when it comes back | Engineering lead, product owner, data protection officer if personal data is involved, security lead | Chief executive sponsor, officers, service desk |
| **Retire:** when the agent is switched off for good or replaced | All of it | Chief executive sponsor | Product owner, frontline operations director, engineering lead, passport policy team | Officers, service desk, public communications |

**Rules for the table** (Proposed):

- **The kill switch never waits for a meeting.** If a wrong approval is found, or the log shows the agent broke a stop condition, the agent owner turns it off first and tells people after.
- **A rule change is not a scope change.** Changing a rule number, such as the child age, is decided by the passport policy team, as `CLAUDE.md` already says. A change to what the agent is allowed to do is a scope or permissions decision.
- **Nobody can approve their own change.** Whoever proposes a permission or scope change cannot be the only one to sign it off.

## Roles

| Role | What they do |
|---|---|
| **Chief executive sponsor** | Owns the outcome and the risk. Makes the final call on vendor, go-live and retire. |
| **Product owner** | Owns what the agent does and how it behaves: scope, permissions, the PRD and the open decisions. |
| **Frontline operations director** | Runs the officers who rely on the agent. Speaks for their workload and decides when the agent comes back after an incident. |
| **ICA officer** | Reviews every application and makes every final decision. The agent's main user. Never decides anything about the agent itself. |
| **Passport policy team** | Owns the passport rules, the rulebook and `rules.js`. Signs off every rule change. |
| **Engineering lead** | Builds and runs the agent. Recommends the vendor and model. Decides the technical choices listed in `ai-prd.md`. |
| **Agent owner** | Watches the agent day to day: reads the log, and tracks how often officers agree with it. Works with the engineering lead to find the cause of an incident. |
| **Duty officer** | On call whenever the agent is running, including before and after office hours. Takes charge of an incident, switches the agent off, and tells the business owner. |
| **Business owner** | The chief executive sponsor. Named here so the incident runbook has one clear person to tell. |
| **Data protection officer** | Checks how personal data is read, kept and logged. Signs off any permission that reads personal data. |
| **Security lead** | Checks access, logins and how the system could be misused. |
| **Procurement** | Runs buying from an outside vendor. |
| **Service desk** | Answers applicants' questions, and needs to know when the agent is changed, down or retired. |
| **Public communications** | Tells the public about go-live and retirement. |

## Incident runbook

**Status: Proposed.** Added after a made-up incident drill, below.

**Who does what, in order**

| Step | Who | What | By when |
|---|---|---|---|
| 1. Notice | Anyone: officer, service desk, agent owner | Tell the duty officer straight away | At once |
| 2. Act first | **Duty officer** | Take charge. Switch the agent off | Within 15 minutes |
| 3. Contain | Duty officer | Hold every reply not yet sent. Find any other reply the agent sent and stop it if possible | Within 30 minutes |
| 4. Tell the business owner | Duty officer | Tell the chief executive sponsor and the agent owner. Use one short message: what happened, that the agent is off, what is held | Within 30 minutes |
| 5. Personal data check | Data protection officer | Decide whether personal data reached the wrong person, and whether it must be reported | Same day |
| 6. Fix for the applicant | ICA officer | Send a correct reply, written by an officer, using the application ID only | Same day |
| 7. Find the cause | Engineering lead, with the agent owner | Use the log to find what went wrong, and how many applicants were affected | Before the agent comes back |
| 8. Bring it back | Frontline operations director | Decide when the agent comes back, after the cause is fixed and the tests pass | After step 7 |

**Ground rules**

- **The duty officer may switch the agent off without asking anyone.** Being wrong costs a short delay. Waiting costs more wrong answers.
- **While the agent is off, officers work as they did before it existed.** Every application still goes to an officer, so nothing is lost.
- **Keep the log untouched.** It is the evidence for step 7.
- **Never reply to the applicant with the agent's text.** The correction comes from an officer.

## Incident drill · made up

**What happened:** at 08:00 on Monday, the agent sent a wrong answer to an applicant.

**Read as the person on duty, before this runbook was added:**

| Question | What the file said | Gap |
|---|---|---|
| Who acts first? | Nothing | No step 1. No one was named to take charge |
| Who switches the agent off? | "Agent owner turns it off at once" | No one named as agent owner. No cover at 08:00, before office hours. No time limit |
| Who tells the business owner? | Nothing | "Business owner" was not defined. Nobody was told to tell them |
| What about the applicant? | Nothing | No one owned sending a correct answer |
| Were others affected? | Nothing | No step to check other replies |
| Personal data? | The data protection officer is only consulted | No one decided whether to report it |

**The biggest finding:** the agent is blocked from sending anything (`ai-prd.md`, Permissions row 14). So if it sent a reply, a control has already failed. Either someone changed its permissions, the officer checkpoint was skipped, or an officer sent the agent's draft without reading it. Step 7 must find which one. Until it does, the agent stays off.

**Read again, with the runbook:**

- **Acts first:** the duty officer.
- **Switches it off:** the duty officer, within 15 minutes.
- **Tells the business owner:** the duty officer tells the chief executive sponsor, within 30 minutes.

## Open decisions

For the group. None is decided.

1. **Whether one person can hold two roles,** for example product owner and agent owner. In a small team this is likely, but it weakens "nobody approves their own change".
2. **Who the agent owner is.** `ai-prd.md` Open decision 15 asks the same question.
3. **Who signs off a permission change from block to auto,** such as letting the agent send replies. This may need the chief executive sponsor, not just the product owner.
4. **How fast the kill switch must work,** and who is on call outside office hours.
5. **Whether officers have a say in go-live,** beyond being told. They are the people who rely on the agent.
6. **Whether the duty officer is a separate role,** or a rota of senior ICA officers. It must be covered whenever the agent runs.
7. **The time limits in the runbook:** 15 minutes to switch off and 30 minutes to tell the business owner are proposals.
8. **When an incident must be reported outside ICA,** for example under data protection rules.
9. **Whether the agent should run at all outside office hours,** if nobody can be on duty then.
