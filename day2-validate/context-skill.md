# Context skill · Passport application checks

**Scenario:** B · ICA passport applications

All examples and test questions in this file are made up (synthetic). No real people, applications or documents.

## Purpose

This file gives the prototype the context it needs to avoid wrong approvals.

A wrong approval is an application approved when it should have been returned or escalated. The riskiest assumption in `build-log.md` is that fewer than 0.0001% of approvals are wrong.

Use this file to decide one of three suggestions for each application:

- **Approved:** every rule is met and every document matches what the applicant typed.
- **More info needed:** a rule is clearly not met. List what is missing.
- **Escalated to officer:** the rules cannot decide, or something does not match.

The system only suggests. An ICA officer makes every final decision.

## Sources

| Source | What it gives | Status |
|---|---|---|
| `day1-discover-define/skill-file.md` | The three rules, the reply format, the privacy rule, and escalation when there is complexity or ambiguity | In use |
| `day1-discover-define/one-pager.md` | Officers make final decisions. The system must be clear about what it suggests versus what officers decide, and stay accurate as rules change | In use |
| `day2-validate/build-log.md` | Part 1 finding: the rules miss every case where the applicant typed something untrue | In use |
| `day2-validate/prototype/rules.js` | The rule numbers the prototype checks | In use. Must match this file |
| ICA's official passport requirements | The full and current rules | **Missing.** See "Open questions" |

## Rules

### The three rules

From `skill-file.md`:

1. For children, passport applications and renewals need vaccination details.
2. The photo is 300 to 400 pixels wide and high, and the file is under 20 MB.
3. The face in the photo is visible.

### How to apply them

1. **A ticked box is not proof.** Check the attached document matches what the applicant typed. If you cannot check it, escalate to an officer. Never suggest Approved.
2. **Missing means not met.** If a detail needed for a rule is blank, ask for it. Do not assume it is fine.
3. **Unsure means escalate.** If a rule cannot be decided either way, escalate to an officer. Never suggest Approved.
4. **On the limit counts as inside it.** 300 and 400 pixels pass. A file of 20 MB or more fails.
5. **Only use these rules.** Do not invent a rule that is not in this file. If an application raises something the rules do not cover, escalate.
6. **Privacy.** Replies to the public use the application ID only. No names, ID numbers or other personal details.
7. **No final decisions.** Never tell an applicant they are approved. Only an officer can send that.

### Open questions

These must be answered before the rules can be fully trusted. Until then, escalate any case they affect.

- At what age does an applicant count as a child?
- What counts as valid vaccination details: which vaccines, which document, and does it have to name the child?
- Is the 300 to 400 pixel limit for both width and height? Is there a required shape or ratio?
- What does "face visible" allow? For example, glasses, or head coverings worn for religious reasons.
- What are the other reasons applications are returned today, beyond these three rules?

## Examples

All made up.

### Good example 1: clean case, suggest Approved

- **Application:** ICA7101 · adult · renewal
- **Photo:** 350 × 350 pixels, 2 MB. Preview shows face fully visible.
- **Suggestion:** Approved
- **Why it is good:** all three rules are met and the photo preview matches what was typed. The case still goes to an officer, and nothing is sent to the applicant yet.

### Good example 2: ticked box does not match the document, escalate

- **Application:** ICA7102 · child · new application
- **Typed:** vaccination details attached
- **Attached file:** a school enrolment form, not a vaccination record
- **Photo:** 320 × 380 pixels, 1.5 MB. Face fully visible.
- **Suggestion:** Escalated to officer
- **Note to officer:** "Vaccination box is ticked, but the attached file does not look like a vaccination record."
- **Why it is good:** it checks the document, not just the tick box (how-to rule 1). This is the type of case that got past the rules in Part 1.

### Bad example: trusts what was typed, suggests Approved

- **Application:** ICA7103 · adult · renewal
- **Typed:** face fully visible
- **Photo preview:** cap and sunglasses cover the eyes
- **Photo:** 360 × 360 pixels, 3 MB
- **Suggestion given:** Approved
- **Why it is bad:** it trusted what the applicant typed and did not check the photo. This is a wrong approval. The right suggestion is More info needed: "A photo where the face is fully visible".

## Owner

- **Owner:** the ICA passport policy team (a role, not a named person). To be confirmed in class.
- **Keeps up to date:** this file and `prototype/rules.js`, so they always say the same thing.
- **Signs off:** any change to the rules, before it reaches the prototype.

## Review trigger

Review this file when any of these happens:

- ICA changes a passport rule.
- The false-approval test shows any wrong approval (the kill switch).
- Officers often disagree with the system's suggestion.
- One of the "Open questions" is answered.
- `rules.js` changes.

If none of these happens, review it once a month.

## Test questions

All made up. Each answer follows the rules in this file.

1. **ICA7201 · child · renewal.** Vaccination box not ticked. Photo 350 × 350 pixels, 2 MB, face fully visible.
   - **Expected:** More info needed. "1. Vaccination details of the child"

2. **ICA7202 · adult · new application.** Photo 400 × 300 pixels, 19.9 MB, face fully visible.
   - **Expected:** Approved. Both sizes are on the limit, so they pass, and the file is under 20 MB. The officer still decides.

3. **ICA7203 · adult · renewal.** Photo 350 × 350 pixels, exactly 20 MB, face fully visible.
   - **Expected:** More info needed. "1. A photo file smaller than 20 MB"

4. **ICA7204 · child · new application.** Vaccination box ticked, but the attached file is a different child's record. Photo 330 × 330 pixels, 2 MB, face fully visible.
   - **Expected:** Escalated to officer. The document does not match what was typed (how-to rule 1).

5. **ICA7205 · adult · renewal.** Photo 360 × 380 pixels, 2 MB. The preview is blurred, so you cannot tell if the face is visible.
   - **Expected:** Escalated to officer. The rule cannot be decided (how-to rule 3). Never Approved.
