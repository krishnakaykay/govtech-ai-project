# AI user flow: When the user submits or attempts to submit a form for passport application or renewal

**Scenario:** B · ICA passport applications

All data in this file is synthetic.

## The moment

When the user submits or attempts to submit a form for passport application or renewal

## The iceberg

### Above the line: what the user sees

Feedback on what are the errors, what to change, so that you can the

### Below the line

- Data: user application and data with the rules as a document repo
- Model: A language model with a RAG data source with all the rules
- Rules: 1. vaccination certificate for all the kids 2. photo requirements
- Handoffs: if there is absolute no confidence on the case, hand off to the officer

## The flow

1. **Trigger:** when an update happens on a case - eg a submission, edit
   - Trust gap: none
2. **AI step:** give the feedback to the user
   - Trust gap: Hallucination. AI could hallucinate a rule
3. **Human check:** in case there is a submission that AI cannot decide on
   - Trust gap: none
4. **Outcome:** Resident gets the feedback, submits the right data and finally gets the passport renewed
   - Trust gap: none

## Fallback when the AI is unsure (Advanced)

_Not filled in yet._

## How we measure trust (Expert)

error rate in approvals
