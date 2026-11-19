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
| **Incident:** what happens when it goes wrong, including the kill switch | Stop conditions. Logs | Agent owner turns it off at once. Frontline operations director decides when it comes back | Engineering lead, product owner, data protection officer if personal data is involved, security lead | Chief executive sponsor, officers, service desk |
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
| **Agent owner** | Watches the agent day to day: reads the log, tracks how often officers agree with it, and turns it off when the kill switch fires. |
| **Data protection officer** | Checks how personal data is read, kept and logged. Signs off any permission that reads personal data. |
| **Security lead** | Checks access, logins and how the system could be misused. |
| **Procurement** | Runs buying from an outside vendor. |
| **Service desk** | Answers applicants' questions, and needs to know when the agent is changed, down or retired. |
| **Public communications** | Tells the public about go-live and retirement. |

## Open decisions

For the group. None is decided.

1. **Whether one person can hold two roles,** for example product owner and agent owner. In a small team this is likely, but it weakens "nobody approves their own change".
2. **Who the agent owner is.** `ai-prd.md` Open decision 15 asks the same question.
3. **Who signs off a permission change from block to auto,** such as letting the agent send replies. This may need the chief executive sponsor, not just the product owner.
4. **How fast the kill switch must work,** and who is on call outside office hours.
5. **Whether officers have a say in go-live,** beyond being told. They are the people who rely on the agent.
