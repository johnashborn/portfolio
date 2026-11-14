---
title: Lost and Found
summary: A desktop system where BISU students and staff report lost items, log found ones and track each item until it's claimed.
cover: ./images/lost-and-found-dashboard.png
coverAlt: The Lost and Found dashboard, shown with demo data. Counts for all, found and claimed items, a weekly reports bar chart, a pie chart of lost, found and claimed items, and a Report Lost Item button.
year: 2026
role: Solo
type: school
stack: [Java, Swing, MySQL]
repoUrl: https://github.com/johnashborn/Lost-And-Found
order: 7
---

## Overview

Lost items on campus are usually tracked on paper or in group chats. This app gives students and staff one place to report a lost item, log a found one and see when it has been claimed.

## What I built

- **Accounts.** Sign up, log in and reset a password. Duplicate emails and contact numbers are rejected.
- **Reports.** Report a lost item with a category, the place it was last seen, a description and a photo. Found items are logged the same way.
- **Search and details.** Browse every item with its status, open its details, and delete it if you reported it.
- **Contact lookup.** Find a student's name and email from their contact number.
- **Statistics.** Totals for reported and claimed items, the average number of days until an item is claimed, and a breakdown by category.

## How it works

A Java Swing desktop app built in NetBeans, connected to MySQL through JDBC with prepared statements. An item history table records each event (reported, found, claimed), and the dashboard counts are built from those events.

## What I'd improve

- Hash passwords. They are currently stored as plain text.
- Look items up by their ID instead of matching on name, category and date.
- Move it to the web, so students can report from their phones.

## What I learned

> Recording every change as an event made the statistics easy to build, because the history was already there.
