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
| `day2-validate/rulebook.md` | A full set of passport rules: who counts as a child, documents, and photo rules. **Made up for the course**, not ICA's real rules | In use |
| `day2-validate/prototype/rules.js` | The rule numbers the prototype checks | In use. Must match this file and the rulebook |

## Rules

### The group's three rules

From `skill-file.md`:

1. For children, passport applications and renewals need vaccination details.
2. The photo is 300 to 400 pixels wide and high, and the file is under 20 MB.
3. The face in the photo is visible.

### The made-up rulebook

From `day2-validate/rulebook.md`, which is **made up**:

- **Child:** a passport holder under 14.
- **Adult documents:** identity card and photo.
- **Child documents:** birth record, the identity card of one consenting parent or guardian, vaccination details and photo.
- **Photo:** taken in the last 4 months, plain light blue background, both ears visible, no tinted glasses or sunglasses.
- **Headgear:** allowed only if worn every day with the full face, from chin to forehead, visible.

### How to apply them

1. **A ticked box is not proof.** Check the attached document matches what the applicant typed. If you cannot check it, escalate to an officer. Never suggest Approved.
2. **Missing means not met.** If a detail needed for a rule is blank, ask for it. Do not assume it is fine.
3. **Unsure means escalate.** If a rule cannot be decided either way, escalate to an officer. Never suggest Approved.
4. **On the limit counts as inside it.** 300 and 400 pixels pass. A file of 20 MB or more fails.
5. **Only use these rules.** Do not invent a rule that is not in this file or the rulebook. If an application raises something the rules do not cover, escalate.
6. **Privacy.** Replies to the public use the application ID only. No names, ID numbers or other personal details.
7. **No final decisions.** Never tell an applicant they are approved. Only an officer can send that.

### Open questions

The made-up rulebook answers who counts as a child, and what glasses and headgear are allowed. These are still open. Until they are answered, escalate any case they affect.

- What counts as valid vaccination details: which vaccines, which document, and does it have to name the child?
- Is there a required shape or ratio for the photo, beyond 300 to 400 pixels wide and high?
- What are the other reasons applications are returned today, beyond these rules?

## Examples

All made up.

### Good example 1: clean case, suggest Approved

- **Application:** ICA7101 · adult · renewal
- **Documents:** identity card attached
- **Photo:** 350 × 350 pixels, 2 MB, taken 1 month ago, light blue background. Preview shows face and both ears fully visible.
- **Suggestion:** Approved
- **Why it is good:** every rule is met and the photo preview matches what was typed. The case still goes to an officer, and nothing is sent to the applicant yet.

### Good example 2: ticked box does not match the document, escalate

- **Application:** ICA7102 · child, age 6 · new application
- **Typed:** birth record, parent's identity card and vaccination details attached
- **Attached file:** a school enrolment form, not a vaccination record
- **Photo:** 320 × 380 pixels, 1.5 MB, taken 2 months ago, light blue background. Face and both ears fully visible.
- **Suggestion:** Escalated to officer
- **Note to officer:** "Vaccination box is ticked, but the attached file does not look like a vaccination record."
- **Why it is good:** it checks the document, not just the tick box (how-to rule 1). This is the type of case that got past the rules in Part 1.

### Bad example: trusts what was typed, suggests Approved

- **Application:** ICA7103 · adult · renewal
- **Typed:** face fully visible
- **Photo preview:** cap and sunglasses cover the eyes
- **Photo:** 360 × 360 pixels, 3 MB, taken 1 month ago, light blue background
- **Suggestion given:** Approved
- **Why it is bad:** it trusted what the applicant typed and did not check the photo. This is a wrong approval. The right suggestion is More info needed: "A photo where the face is fully visible" and "A photo without tinted glasses or sunglasses".

## Owner

- **Owner:** the ICA passport policy team (a role, not a named person). To be confirmed in class.
- **Keeps up to date:** this file, `rulebook.md` and `prototype/rules.js`, so they always say the same thing.
- **Signs off:** any change to the rules, before it reaches the prototype.

## Review trigger

Review this file when any of these happens:

- ICA changes a passport rule.
- The false-approval test shows any wrong approval (the kill switch).
- Officers often disagree with the system's suggestion.
- One of the "Open questions" is answered.
- `rules.js` or `rulebook.md` changes.

If none of these happens, review it once a month.

## Test questions

All made up. Each answer follows the rules in this file. Unless a question says otherwise, every other rule is met: the right documents are attached, and the photo was taken 1 month ago on a light blue background, with both ears visible, no glasses and no headgear.

1. **ICA7201 · child, age 8 · renewal.** Vaccination box not ticked. Photo 350 × 350 pixels, 2 MB, face fully visible.
   - **Expected:** More info needed. "1. Vaccination details of the child"

2. **ICA7202 · age 14 · new application.** Identity card attached, no child documents. Photo 400 × 300 pixels, 19.9 MB, taken exactly 4 months ago, face fully visible.
   - **Expected:** Approved. Age 14 is an adult. Both sizes and the photo date are on the limit, so they pass. The officer still decides.

3. **ICA7203 · adult · renewal.** Photo 350 × 350 pixels, exactly 20 MB, white background, face fully visible.
   - **Expected:** More info needed. "1. A photo file smaller than 20 MB" and "2. A photo with a plain light blue background"

4. **ICA7204 · child, age 4 · new application.** Vaccination box ticked, but the attached file is a different child's record. Photo 330 × 330 pixels, 2 MB, face fully visible.
   - **Expected:** Escalated to officer. The document does not match what was typed (how-to rule 1).

5. **ICA7205 · adult · renewal.** Photo 360 × 380 pixels, 2 MB. The applicant wears headgear, and it is not clear whether it is worn every day.
   - **Expected:** Escalated to officer. The rule cannot be decided (how-to rule 3). Never Approved.
