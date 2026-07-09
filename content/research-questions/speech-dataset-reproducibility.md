---
id: ea:researchQuestion:speech-dataset-reproducibility
type: researchQuestion
translationKey: research-question:speech-dataset-reproducibility
slug:
  canonical: speech-dataset-reproducibility
title: How can speech datasets become reproducible, structured and privacy-first?
subtitle: Research Question 002
abstract: This research question studies how browser-based speech recording can standardize acquisition, metadata and review while keeping private voice material under local control.
description: A public Electronic Artefacts research question about reproducible speech datasets, local-first recording and metadata-rich voice workflows.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-07-09"
  publishedAt: "2026-07-09"
  modifiedAt: "2026-07-09"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
started: "2026-02-01"
updated: "2026-07-09"
priority: 2
featured: true
homepage: true
observation: Voice datasets are often assembled through inconsistent tools, loose folders and missing metadata, which makes later review, consent checking and reproduction difficult.
problem: Dataset quality is frequently discussed after recording, when many important conditions have already been lost. Privacy also becomes harder to reason about when capture tools hide where audio is stored.
hypothesis: A browser-based recording workflow can standardize acquisition, review states, metadata and export structure without requiring proprietary desktop software or remote upload.
currentUnderstanding: Capturing data is as important as training models. A useful speech workflow should preserve prompt, speaker, timing, quality, review and export context before any downstream model work begins.
experiments:
  - id: local-browser-workspace
    title: Local browser workspace
    status: active
    summary: Voice Capture Studio keeps recordings in browser-local storage or explicit user-selected folders, then exports structured session material.
    relatedEntities:
      - id: ea:project:voice-capture-studio
      - id: ea:concept:browser-software
  - id: wav-metadata-export
    title: WAV and metadata export
    status: observed
    summary: The project tests whether audio, transcript, timing, quality and manifest files can be treated as one reproducible capture-session output.
    relatedEntities:
      - id: ea:concept:speech-datasets
      - id: ea:concept:metadata
result: "The immediate software answer is Voice Capture Studio: a local-first browser recorder with structured export boundaries and explicit separation between recording and model training."
nextSteps:
  - Expand corpus definitions while keeping source, version and language context explicit.
  - Test export packages against downstream review and alignment workflows.
  - Define consent and deletion notes that remain attached to dataset manifests.
relatedProjects:
  - id: ea:project:voice-capture-studio
relatedSoftware:
  - id: ea:program:oreth
  - id: ea:framework:electronic-artefacts-lightweight-template
relatedArticles:
  - id: ea:publication:web-audio-and-browser-based-sound-systems
  - id: ea:publication:local-and-open-source-ai-systems
  - id: ea:publication:open-source-as-cultural-infrastructure
  - id: ea:publication:webnn-and-local-ai-in-the-browser
relatedCollections:
  - id: ea:collection:voice-capture-studio
relatedConcepts:
  - id: ea:concept:speech-datasets
  - id: ea:concept:speech-recording
  - id: ea:concept:voice-technology
  - id: ea:concept:metadata
  - id: ea:concept:provenance
  - id: ea:concept:machine-learning-workflows
  - id: ea:concept:browser-software
  - id: ea:concept:open-source
relatedTechnologies:
  - id: ea:technology:web-audio-api
  - id: ea:technology:webnn
relatedRepositories:
  - title: Voice Capture Studio repository
    publisher: GitHub
    accessedAt: "2026-07-09"
    url: https://github.com/electronicartefacts/voice-capture-studio
  - title: Voice Capture Studio documentation
    publisher: GitHub
    accessedAt: "2026-07-09"
    url: https://github.com/electronicartefacts/voice-capture-studio/tree/main/docs
timeline:
  - date: "2026-02-01"
    title: Dataset workflow split
    summary: The research separated speech capture from downstream model training so the capture boundary could be designed directly.
  - date: "2026-07-09"
    title: Open-source project publication
    summary: Voice Capture Studio became the public software answer and evidence source for the question.
tags:
  - Speech Datasets
  - Privacy
  - Web Audio
  - Local First
  - Open Source
disciplines:
  - Audio Engineering
  - Machine Learning
  - Web Development
  - Data Engineering
---

## Observation

Speech material is often recorded before the dataset has a structure. A team may have usable audio, but not the speaker profile, prompt version, room condition, review state or export manifest needed to reproduce the work.

## Problem

The cost appears later. Without structure, a dataset becomes difficult to audit. Without explicit local storage and export boundaries, privacy claims are hard to inspect.

## Hypothesis

A browser recorder can behave like a small research instrument. It can make microphone state, storage, corpus version, review status and export structure visible at capture time.

## Current Understanding

The recording tool is part of the dataset methodology. It should not be treated as a replaceable utility if its choices determine what can be reviewed, reused or deleted.

## Unknowns

The next questions concern scale and governance. The studio still needs to test how multilingual corpora, consent notes, quality reports and downstream evaluation records should travel together without making the capture workflow heavy.
