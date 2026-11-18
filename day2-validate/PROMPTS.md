# Prompt chain

**Scenario:** B · ICA passport applications
**Prototype today:** It's a passport application form that tells applicants what's missing or wrong as they fill it in, then sends every application to an officer, who makes the final decision. It uses plain rule checks, no AI, and all the data is made up.

All data is synthetic and labelled as made up.

## 1. Expand

**Prompt:** Document checks for the officer (recommended). The officer sees a description of each attached file, plus a short checklist with quick buttons: "Is this the child's vaccination record? Yes / No / Not sure". A case can only be approved once every item is ticked.

**Business rules:**
- 1. A passport holder under 14 is a child, and 14 or over is an adult.
- 2. An adult must attach their identity card.
- 3. A child must attach their birth record.
- 4. A child must attach the identity card of one consenting parent or guardian.
- 5. A child must attach vaccination details.
- 6. The photo must be 300 to 400 pixels wide and 300 to 400 pixels high.
- 7. The photo file must be under 20 MB.
- 8. The photo must be taken in the last 4 months.
- 9. The photo must have a plain light blue background.
- 10. The face must be fully visible in the photo.
- 11. Both ears must be visible in the photo.
- 12. Tinted glasses and sunglasses are not allowed. Clear glasses are fine.
- 13. Headgear is allowed only if worn every day, with the full face visible from chin to forehead.
- 14. A photo exactly on a limit passes: 300 or 400 pixels, or exactly 4 months old.
- 15. A photo file of exactly 20 MB fails.
- 16. A blank detail counts as not met.
- 17. If a rule can't be decided either way, the case is escalated to an officer and never approved.
- 18. If the application raises something the rules don't cover, it is escalated to an officer.
- 19. The system only suggests one of three outcomes: Approved, More info needed or Escalated to officer.
- 20. Every application goes to an officer, who makes the final decision.
- 21. Nothing is sent to an applicant until an officer acts.
- 22. An applicant can always "submit anyway", and the case is flagged for an officer to check by hand.
- 23. Replies to applicants use the application ID only, with no names or other personal details.
- 24. The public never sees the system's suggestion, only what to fix and the officer's reply.

**Edge cases:**
- On a limit
- 1. Age 13 is a child, so it needs child documents.
- 2. Age 14 is an adult, so it needs only an identity card.
- 3. Age 0 (a baby) is a child, so it needs all child documents.
- 4. A photo of 300 × 300 or 400 × 400 pixels passes.
- 5. A photo of 299 or 401 pixels on either side fails.
- 6. A photo of 300 × 400 or 400 × 300 pixels passes, because each side is checked separately.
- 7. A photo file of 19.9 or 19.99 MB passes.
- 8. A photo file of exactly 20 MB fails.
- 9. A photo taken exactly 4 months ago passes.
- 10. A photo taken 5 months ago fails.
- Unclear or missing
- 11. If you can't tell whether the face is visible, the case is escalated, never approved.
- 12. If you can't tell whether both ears are visible, the case is escalated.
- 13. If you can't tell what glasses are worn, the case is escalated.
- 14. If you can't tell whether headgear is allowed, the case is escalated.
- 15. A blank width, height, file size or photo date counts as not met, and the applicant is asked for it.
- 16. A blank age means the applicant is asked for it. Until then, the "adult or child" choice decides which documents apply.
- 17. Something to fix and something unclear in the same case means the case is escalated, because unclear always wins.
- Untrue answers (the rules can't see these, so an officer must catch them)
- 18. A dental letter is attached as the child's vaccination record.
- 19. A different child's vaccination record is attached.
- 20. A library card or expired card is attached as the identity card.
- 21. A hospital pass or blank page is attached as the birth record.
- 22. The applicant says the face is visible, but the photo shows sunglasses, a cap or a scarf.
- Applicant behaviour
- 23. The applicant changes the age from adult to child after attaching an identity card. The identity card is ignored, and child documents are asked for.
- 24. The applicant uses "submit anyway" with something missing. The case goes to an officer, flagged as overridden.
- 25. The applicant looks up an ID with no reply yet, and is told it's waiting for an officer.
- 26. The applicant looks up an unknown ID, and is told no application was found.
- Officer behaviour
- 27. The officer approves a case the system flagged. That's allowed, because the officer decides.
- 28. The officer asks for more info on a case the system suggested approving. They must type what's needed, without personal details.
- 29. The officer approves everything without reading the files. In testing, all 10 bad cases got through.
- Known gaps (not handled yet)
- 30. Anyone who types IDs in order can read other people's replies.
- 31. Nothing checks whether the vaccination record is valid, or which vaccines it covers.
- 32. Nothing checks the photo's shape or ratio beyond the pixel range.
- 33. A negative or impossible age, such as 150, isn't rejected.
- 34. The same application submitted twice creates two cases.

**Result:** _fill in after you run it: what worked, what broke._

## 2. Behavior

**Prompt:** When the system is down, the app should do these eight things. The first four it already does.

Already done

1. Say clearly that it didn't go through. Never show "Application submitted" unless the save actually worked.
2. Keep everything the applicant typed. They shouldn't have to fill in the form again.
3. Offer "Try again" that resends the same application.
4. Never create a second case. If the first attempt did get through, a retry must not make a duplicate. The duplicate check handles this.

Not done yet

5. Handle "we don't know" differently from "it failed". Sometimes the system can't tell whether the submit worked, for example when the connection drops halfway. Then the app should say "We're not sure your application went through. Check its status before submitting again", not "it failed". The prototype can't tell these two cases apart yet.
6. Keep a draft if they close the page. Right now the typed details survive a failed submit, but not closing the tab. This needs care: applications hold sensitive personal data, so a draft shouldn't stay on a shared computer.
7. Say when to try again, and what else they can do. For example: "Try again in 15 minutes. If it's urgent, you can apply at a service counter." Keep in mind that counters can handle only about 35% of today's online demand, so the message shouldn't push everyone there.
8. Tell the team, not just the applicant. Every failure should be recorded, so someone knows the system is down before complaints arrive.

Just as important, what it should never do:
- show a technical error message
- blame the applicant
- lose a case on the officer side
- send a reply the officer didn't approve

On the officer page, the case already stays in the queue and no reply is sent. But the warning is a plain pop-up box, and it could be shown on the page instead.

**Forced failure:** The "system is down" failure is the one you can force on purpose.

**Business rules:**
- NA

**Edge cases:**
- NA

**Result:** _fill in after you run it: what worked, what broke._

## 3. Refine

**Prompt:** Click through it once in a real browser and fix what looks wrong.
   - Why: I've tested all the code, but no one has seen the pages on screen yet. Layout problems are likely: cramped fields, labels wrapping badly, or the summary panel overlapping the form.
   - How: open public.html and officer.html side by side. Run two sample cases on each, then tell me what looks off and I'll fix it. About 10 minutes for you.
2. Make the messages sound like a person, and point to the field.
   - Why: today a message like "A photo between 300 and 400 pixels wide and high (yours is 250 × 250)" is correct but stiff. And in the summary, the applicant has to find the field themselves.
   - How: rewrite each message as a plain instruction, such as "Your photo is too small. Use one between 300 and 400 pixels on each side." Make each item in the summary a link that jumps to its field.
   - Result: it speaks to your Hypothesis (a), "members of public can understand", and to parents being the most confused group.
3. Update the README to match what the prototype does now.
   - Why: it still says "nine made-up applications" (there are 12) and calls public.html "for members of the public", not "Test interface". It also tells you to run commands yourself.
   - How: a short tidy-up, and I'd say "ask Claude to run the tests" instead of giving commands.
   - Result: a teammate or your instructor can pick it up without asking you anything.

**Business rules:**
- NA

**Edge cases:**
- NA

**Result:** _fill in after you run it: what worked, what broke._
