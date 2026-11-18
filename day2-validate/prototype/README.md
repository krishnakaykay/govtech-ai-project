# Prototype v1: passport pre-submit check

**Scenario:** B · ICA passport applications

All data in this folder is synthetic (made up).

## What it is for

It tests whether an incomplete passport application can be caught before it is submitted, and explained clearly to the applicant. It also shows that the system only suggests. An ICA officer makes every final decision.

This version uses plain rule checks. There is no AI yet.

## Look

A formal government style in navy and blue, based on the general look of ICA's website. It does not use ICA's logo or crest. Every page has a yellow bar saying it is a prototype, not an official ICA website.

## How to open it

There are two pages, one for each kind of user. Open both in the same browser, side by side.

- `public.html`: for members of the public
- `officer.html`: for ICA officers

Nothing needs installing. Data stays in your browser only and is not sent anywhere. To start again, press "Clear all demo data" on the officer page.

## Test interface (`public.html`)

A step-by-step application page, like a real online form:

1. **About the passport holder.** Name and age. Under 14 counts as a child, and the page shows which documents are needed.
2. **Supporting documents.** Adults attach an identity card. Children attach a birth record, a parent or guardian's identity card and vaccination details. Type a made-up file name in place of a real file.
3. **Photo.** Describe the photo: size, file size, when it was taken, background, face, ears, glasses and headgear.
4. **Review and submit.**

As you type, each field shows a red, amber or green message. Each step shows its status, and a summary on the right lists everything still to fix.

- Pick a sample case (demo only) to fill every field with different made-up details. Some cases attach the wrong document, such as a dental letter in the vaccination slot, to show what the rules cannot catch.
- If you submit with something missing, the page lists what to fix. You can fix it, or "submit anyway" to send it to an officer.
- Under "Check my application", enter the application ID to see the reply.

The public never sees the system's suggestion. They only see what to fix, and replies an officer has sent.

## Officer page

- The queue shows each application, the names of the attached files, what the system suggests (Approved, Escalated to officer or More info needed) and why.
- It flags when an applicant overrode the check.
- The officer approves or asks for more info. Only then is a reply sent to the applicant.
- "Replies sent" shows what the system suggested next to what the officer decided.

## The rules

The group's rules, from `day1-discover-define/skill-file.md`:

1. A child's application or renewal needs vaccination details.
2. The photo is 300 to 400 pixels wide and high, and the file is under 20 MB.
3. The face in the photo is visible.

On top of these, `../rulebook.md` adds a **made-up** rulebook. It is not ICA's real rules.

- **Child:** a passport holder under 14.
- **Documents:** identity card for adults. Birth record, parent or guardian identity card and vaccination details for children.
- **Photo:** taken in the last 4 months, light blue background, both ears visible, no tinted glasses.
- **Headgear:** allowed only if worn every day with the full face visible.

If the rules cannot decide, for example when it is hard to tell if the face is visible, the case is escalated to an officer.

## Files

- `public.html`: the page for members of the public
- `officer.html`: the page for ICA officers
- `store.js`: shares applications and replies between the two pages, inside your browser
- `style.css`: the look of both pages
- `rules.js`: the rule numbers, in one place, so they are easy to change when ICA rules change
- `check.js`: the rule checks and the message to the applicant
- `sample-applications.js`: nine made-up applications, each with the suggestion it should get
- `test-check.js`: checks every sample case gets the expected suggestion
- `approval-test-cases.js`: 119 made-up applications for the false-approval test, each with the correct answer set by hand
- `test-false-approvals.js`: counts how often the rules suggest Approved for an application that should not pass

## False-approval test

This tests the riskiest assumption in `../build-log.md`.

- **Part 1, the rules.** Run `node test-false-approvals.js`. Kill switch: any wrong Approved suggestion.
- **Part 2, the officer.** On `officer.html`, press "Start the officer test". Decide all 20 cases, then read the score.

## What it leaves out

- An AI model. Planned for v2.
- Real photo checks. You type the photo size and say whether the face is visible.
- Logins, a database and a live address.
