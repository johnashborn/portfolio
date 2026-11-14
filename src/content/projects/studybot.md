---
title: StudyBot
summary: An Android study assistant that runs a small language model entirely on the phone, so it works with no internet connection.
year: 2026
role: Solo
type: personal
stack: [Java, C++, Android, llama.cpp, JNI]
repoUrl: https://github.com/johnashborn/Studybot
order: 4
---

## Overview

Most AI assistants need an internet connection and send your questions to a server. StudyBot runs the TinyLlama model directly on an Android phone, so it works offline and nothing leaves the device.

## What I built

- An offline chat screen for asking study questions.
- Native inference with llama.cpp, called from the Android app.
- A downloadable APK on the GitHub Releases page.

## How it works

The Android app is written in Java. It calls C++ code through JNI, and that code runs llama.cpp with TinyLlama-1.1B, quantized to Q4_K_M (about 637 MB). The model uses a 1,024-token context and generates up to 150 tokens per answer, with temperature 0.7 and top-K 40.

On mid-range phones, simple questions take about 5–15 seconds to answer.

## What I'd improve

- Keep the conversation between questions. Right now memory is cleared after each one.
- Make model setup easier. The model file is currently copied to the phone with ADB.
- Use the GPU. Inference is CPU-only for now.

## What I learned

> Running AI on a phone is mostly about tight limits: model size, memory and how long people are willing to wait.
