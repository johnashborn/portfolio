---
# Drafted from the Kiligram README. Check every line, and rewrite "What I learned" in your own words.
title: Kiligram
summary: A private, login-protected photo gallery and letters page built as a gift, using plain JavaScript on GitHub Pages and Supabase for accounts and storage.
cover: ./images/kiligram-login.png
coverAlt: The Kiligram login screen. A sealed lavender envelope above a "A letter is waiting for you" sign-in card, over a soft wall of empty photo frames and floating hearts.
year: 2026
role: Solo
type: personal
stack: [JavaScript, HTML, CSS, Supabase, GitHub Actions]
liveUrl: https://johnashborn.github.io/Kiligram/
repoUrl: https://github.com/johnashborn/Kiligram
order: 6
---

## Overview

A private photo gallery I made as a monthsary gift. Only two accounts can open it. The live link shows the login screen.

## What I built

- **Gallery.** A coverflow carousel of polaroid-style photos with a month-by-month timeline and a full-screen photo viewer.
- **Admin page.** Add, edit and delete photos. Images are resized to 1600px JPEGs in the browser before upload.
- **Private letters.** A mailbox where the two of us can write to each other. Each person can delete only their own letters.
- **Saving photos.** Phones get the share sheet, which saves straight to Photos. Computers get a download, or a single `.zip` for several photos.

## How it works

Plain HTML, CSS and JavaScript with no build step. Supabase handles login, the database and file storage:

- **Locked-down access.** Database access rules only let accounts on a members list see or change photos and letters. Anyone else gets nothing, even with the public key.
- **Expiring links.** Photos load through signed links that expire after 12 hours.

A GitHub Actions workflow publishes the site to GitHub Pages on every push.

## What I'd improve

- Read iPhone HEIC photos directly. For now they have to be converted to JPG first.
- Let the site owner edit the page text from the admin page instead of a config file.

## What I learned

> Database access rules are what really keep data private. A login screen on the page doesn't, because the key it uses is public.
