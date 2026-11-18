# Prototype v1: passport pre-submit check

**Scenario:** B · ICA passport applications

All data in this folder is synthetic (made up).

## What it is for

It tests whether an incomplete passport application can be caught before it is submitted, and explained clearly to the applicant. It also shows that the system only suggests. An ICA officer makes every final decision.

This version uses plain rule checks. There is no AI yet.

## How to open it

Double-click `index.html`. It opens in your web browser. Nothing needs installing, and nothing is saved or sent anywhere.

## The three screens

1. **Applicant form.** Fill in an application, or pick a sample case. Press Submit. If something is missing, the page lists what to fix, using the application ID only. The applicant can fix it, or press "submit anyway" to send it to an officer.
2. **Officer queue.** Each case shows what the system suggests (Approved, Escalated to officer or More info needed) and why. The officer decides.
3. **Messages sent to applicants.** A message appears here only after an officer decides.

## The rules

From `day1-discover-define/skill-file.md`:

1. A child's application or renewal needs vaccination details.
2. The photo is 300 to 400 pixels wide and high, and the file is under 20 MB.
3. The face in the photo is visible.

If the rules cannot decide, for example when it is hard to tell if the face is visible, the case is escalated to an officer.

## Files

- `index.html`: the three screens
- `rules.js`: the rule numbers, in one place, so they are easy to change when ICA rules change
- `check.js`: the rule checks and the message to the applicant
- `sample-applications.js`: nine made-up applications, each with the suggestion it should get
- `test-check.js`: checks every sample case gets the expected suggestion

## What it leaves out

- An AI model. Planned for v2.
- Real photo checks. You type the photo size and say whether the face is visible.
- Logins, a database and a live address.
