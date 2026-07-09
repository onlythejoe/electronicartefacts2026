---
id: ea:project:voice-capture-studio
type: project
slug:
  canonical: voice-capture-studio
title: Voice Capture Studio
subtitle: Local-First Voice Recording Studio
abstract: Voice Capture Studio is an open-source browser application for directed speech recording, local review and dataset-ready voice exports.
description: A local-first recording studio for speech datasets, voice-over and dubbing workflows, built as an open-source browser application with structured WAV and metadata exports.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: development
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-07-09"
  publishedAt: "2026-07-09"
  modifiedAt: "2026-07-09"
  changeSummary: Initial public integration of the live open-source Voice Capture Studio project.
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
category: internal
brief: Standardize professional speech recording in the browser so clean, reviewable voice material can be exported with the metadata downstream workflows need.
context: Voice data is often captured through improvised tools, loose folders and missing context. That weakens review, consent, quality control, dubbing reuse and dataset preparation before any model or archive workflow begins.
stakeholders:
  - id: ea:organization:electronic-artefacts
constraints:
  - Keep recordings and workspaces local to the user’s browser and chosen folders.
  - Make microphone permissions, storage durability and export paths visible before recording.
  - Preserve the boundary between dataset preparation and model training.
  - Use open formats and documentation so recorded material remains inspectable outside the app.
  - Keep the app deployable as a static GitHub Pages surface.
approach:
  - Build a browser-first recording interface around guided prompt sessions, language selection, speaker profiles and take review.
  - Capture local audio through Web Audio, then export WAV and JSON metadata for structured review.
  - Treat keeper, review and reject states as part of corpus coverage rather than counting every attempt.
  - Separate React orchestration from domain modules for corpus, sessions, workspace, recording, export and settings.
  - Publish the code, documentation, issue templates and GitHub Pages workflow as an open-source foundation.
outputs:
  - id: ea:project:voice-capture-studio
  - id: ea:artefact:voice-capture-studio-repository
outcomes:
  - A live GitHub Pages application for local speech capture in a secure browser context.
  - A documented open-source repository with architecture, corpus, workspace and export notes.
  - A structured export model for WAV audio, transcripts, timing, intent, quality reports and manifests.
  - A privacy-first workflow where user recordings are not uploaded to a remote service by the website.
evidence:
  - id: ea:artefact:voice-capture-studio-repository
credits:
  - id: ea:organization:electronic-artefacts
media:
  - id: voice-capture-studio-capture-screen
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-capture.png
    alt: Voice Capture Studio live capture screen showing dataset, dubbing and master audio modes.
    caption: Live GitHub Pages capture screen with local browser storage, recording modes and calibration status.
  - id: voice-capture-studio-quality-screen
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-live.png
    alt: Voice Capture Studio quality and export screen.
    caption: Live quality and export screen showing local progress, corpus version and dataset readiness checks.
visualLanguage:
  - Black
  - Ivory
  - Graphite
  - Signal green
  - Warm red
textures:
  - Local console
  - Audio waveform
  - Studio calibration
  - Structured export
symbols:
  - Microphone
  - Corpus
  - Take
  - Local folder
developmentFocus:
  - React 19
  - Vite 6
  - TypeScript
  - Web Audio API
  - WAV PCM export
  - Browser-private workspace
  - File System Access API
  - GitHub Pages
marketingFocus:
  - Local-first recording
  - Speech dataset preparation
  - Open-source browser tool
  - Voice-over workflow
  - Dubbing workflow
  - Privacy-first capture
socialLinks:
  - label: Live demo
    href: https://electronicartefacts.github.io/voice-capture-studio/
  - label: GitHub repository
    href: https://github.com/electronicartefacts/voice-capture-studio
  - label: Documentation
    href: https://github.com/electronicartefacts/voice-capture-studio/tree/main/docs
sources:
  - title: Voice Capture Studio live demo
    publisher: GitHub Pages
    accessedAt: "2026-07-09"
    url: https://electronicartefacts.github.io/voice-capture-studio/
  - title: Voice Capture Studio repository
    publisher: GitHub
    accessedAt: "2026-07-09"
    url: https://github.com/electronicartefacts/voice-capture-studio
  - title: Voice Capture Studio architecture doctrine
    publisher: GitHub
    accessedAt: "2026-07-09"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/architecture-doctrine.md
rights: Copyright 2026 Electronic Artefacts.
license: MIT
tags:
  - Voice Capture Studio
  - Speech Recording
  - Voice Dataset
  - Browser Software
  - Web Audio
  - Open Source
  - Local First
  - Privacy
disciplines:
  - Audio Engineering
  - Web Development
  - Human Computer Interaction
  - Machine Learning
  - Open Source
featured: true
---

## Overview

Voice Capture Studio is a local-first browser application for directed voice capture. It helps a speaker move from an empty session to clean, reviewable takes with transcripts, timing, quality metadata and export structure attached.

The application is live at [electronicartefacts.github.io/voice-capture-studio](https://electronicartefacts.github.io/voice-capture-studio/) and the source code is public at [github.com/electronicartefacts/voice-capture-studio](https://github.com/electronicartefacts/voice-capture-studio).

## Purpose

The project exists because professional voice material is often captured before the workflow is ready for it. A recording may sound usable, but the prompt, language, speaker, room, microphone, review state, timing and export manifest can disappear into loose folders.

Voice Capture Studio treats those details as part of the recording. It prepares structured voice material for downstream archives, speech datasets, voice-over review, dubbing and machine-learning workflows.

## What It Does Not Do

Voice Capture Studio does not train AI models. It records speech, reviews takes and exports structured material. Any later training, alignment, normalization, archive processing or model evaluation belongs to a separate workflow with its own governance and consent requirements.

That boundary is important: the application prepares source material; it does not claim the authority of a model pipeline.

## Recording Modes

The live application exposes three capture modes:

- Dataset ML: prompted recording for calibrated phrases, phonetic progress and training-ready exports.
- Dubbing: pasted text or segmented files transformed into recordable lines.
- Master audio: local text, reference audio and a separate voice capture lane.

The project page uses “dataset” in the preparation sense: accepted recordings and metadata can become useful inputs, but model training remains downstream.

## Key Features

- Guided prompt sessions for French and English starter corpora.
- Local microphone capture through the browser.
- WAV PCM mono export at 48 kHz / 24-bit where browser support allows it.
- Room-tone calibration and first-pass technical quality checks.
- Transcript, timing, intent, prosody and quality metadata for each accepted take.
- Keeper, review and reject states so coverage advances only on accepted material.
- Browser-private workspace storage with downloads and folder export where supported.
- PWA manifest and service-worker support for static GitHub Pages distribution.

## Architecture Overview

The repository separates the React application shell from domain modules. The app shell coordinates browser capture, storage adapters and export orchestration. The domains own corpus, sessions, workspace, coverage, recording, speakers, settings and export contracts.

The important architectural decision is dependency direction: domain modules do not import React, browser UI, routes or CSS. That keeps recording behavior, corpus planning and export contracts testable without tying them to one interface.

## Technology Stack

Voice Capture Studio is built with React, Vite and TypeScript. It uses Web Audio for local capture, browser storage for local workspace state, the File System Access API where available, explicit downloads as a fallback, a PWA manifest and a GitHub Pages deployment workflow.

The validation gate in the repository runs formatting, linting, TypeScript project references, unit tests and the production build.

## Design Philosophy

The interface is not a generic recorder. It behaves like a small studio surface: choose a mode, check the environment, confirm the speaker and language, capture calibration material, record takes, then export the session with enough metadata to be reviewed later.

The design keeps technical state visible because local-first software needs trust cues. Storage mode, microphone readiness, WAV support, folder access, corpus version and calibration status are part of the user experience.

## Open Source Philosophy

The project is released under the MIT License. Open source matters here because voice workflows should be inspectable. A team preparing voice material needs to know what is stored, what is exported, what is never uploaded and where data boundaries sit.

The repository includes contribution guidelines, security reporting, issue templates, a pull-request template and documentation for architecture, corpus structure, workspace structure, export structure and GitHub Pages.

## Privacy

Voice recordings and generated workspaces are user data. The application is designed so recordings remain local to the browser or the folder selected by the user. The public repository should contain code and corpus definitions, not private voice recordings.

Browser storage is useful, but it is not a permanent archive. The app therefore treats explicit export and folder workflows as first-class parts of the product.

## Export Model

The primary export target is a structured capture-session folder. The current repository documents session, speaker, corpus and manifest JSON files, take-level WAV and transcript files, timing and intent metadata, quality reports and dataset-readiness reports.

Every accepted take is more than audio. It carries enough structure to support later alignment, review, coverage analysis or archive processing.

## Documentation

Useful entry points:

- [Architecture doctrine](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/architecture-doctrine.md)
- [System model](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/system-model.md)
- [Corpus structure](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/corpus-structure.md)
- [Workspace structure](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/workspace-structure.md)
- [Export structure](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/export-structure.md)

## Roadmap

The public roadmap includes workspace restore/import for downloaded backups, explicit workspace schema migrations, corpus tombstones for long-lived compatibility, a stronger first-run folder flow, additional export targets and screenshot/release automation.

Those items are product infrastructure, not decoration. They make the difference between a promising local app and a voice archive workflow that can survive real use.

## Related Electronic Artefacts Work

Voice Capture Studio sits near [ORETH](/programs/oreth/) because both treat audio as structured material. It sits near [Web Audio](/knowledge/concepts/web-audio/) and the [Web Audio API](/knowledge/technologies/web-audio-api/) because the browser is the runtime. It sits near [Open Source](/knowledge/concepts/open-source/) because the code and documentation are inspectable.

It also expands the Electronic Artefacts ecosystem into a practical voice-technology artefact: a tool that does one thing clearly before any archive, model, dubbing or production workflow receives the data.
