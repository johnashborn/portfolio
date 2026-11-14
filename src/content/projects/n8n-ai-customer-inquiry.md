---
title: AI Customer Inquiry Classifier
summary: Two n8n workflows that sort customer messages with an LLM, by category and urgency, and reply to real customers by email while ignoring spam.
cover: ./images/n8n-classifier-api.png
coverAlt: The n8n Inquiry Classifier workflow. A webhook feeds input validation, an AI classification step and a parse-and-validate step, which end in 200, 400 or 502 responses.
year: 2026
role: Solo
type: personal
stack: [n8n, JavaScript, OpenRouter, Docker, Gmail API]
repoUrl: https://github.com/johnashborn/n8n-ai-customer-inquiry
order: 3
---

## Overview

Small businesses get the same kinds of messages every day: order questions, complaints, support requests and spam. Someone has to read each one, decide how urgent it is and write a reply. These workflows automate the sorting and draft the first reply.

## What I built

- **Inquiry Classifier API.** A webhook takes a customer message as JSON and returns its category (Inquiry, Complaint, Support or Spam), its urgency, a one-sentence summary and a suggested reply.
- **Email Auto-Responder.** Reads new emails over IMAP, classifies them and replies to real customers through Gmail. Spam gets no reply, since replying confirms the address is active.
- **Clear errors.** Empty or oversized messages get a `400` before they reach the AI. If the AI fails or returns something unusable, the API answers `502` instead of failing silently.

## How it works

n8n runs self-hosted in Docker. The classifier calls a free model through the OpenRouter API, and a JavaScript Code node checks the answer before anything is sent back:

- It strips code fences and pulls the JSON out, even when the model adds extra text.
- It checks every field against an allowed list.
- It builds the request body with `JSON.stringify`, so quotes and line breaks in a customer's message can't break the API call.

```json
{
  "category": "Complaint",
  "urgency": "Medium",
  "summary": "Customer received an incorrect product and requests assistance.",
  "suggested_response": "Hello Maria! We're sorry you received the wrong item. Could you please provide your order number so we can help?"
}
```

Rate limits are handled with 3 retries, 5 seconds apart. No-reply addresses, mailer daemons and the workflow's own emails are filtered out before classification, which saves requests and prevents reply loops.

## What I'd improve

- Replies go out without review. For real use, the Gmail step should create drafts so a person approves each reply.
- The free model tier allows 50 requests a day, so it suits demos and low volume.
- Log every decision so misclassified messages can be reviewed.

## What I learned

> The model's answer can't be trusted as-is. Validating its output mattered as much as writing the prompt.
