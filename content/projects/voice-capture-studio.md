---
id: ea:project:voice-capture-studio
type: project
slug:
  canonical: voice-capture-studio
title: Voice Capture Studio
subtitle: Local-First Voice Instrument
abstract: Voice Capture Studio is an open-source, local-first browser instrument for capturing, performing, reviewing and segmenting voice across five purpose-built workflows.
description: A signal-grounded voice studio in the browser, combining five capture and segmentation modes, glass-like interaction design, deterministic evidence pipelines and open WAV/metadata exports.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: development
confidence: published
version:
  version: 2.1.0
  createdAt: "2026-07-09"
  publishedAt: "2026-07-09"
  modifiedAt: "2026-07-18"
  changeSummary: Published the six-part Knowledge layer and connected the dossier to its complete editorial neighborhood.
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
category: internal
brief: "Turn the browser into a trustworthy voice instrument: one calm surface for immediate capture, ML corpus work, dubbing, interpreted performance and local word-level segmentation."
context: Voice work usually fragments across recorders, subtitle tools, media players, folders and model-specific scripts. The sound may survive while the prompt, speaker, room, scene cue, review state, timing, provenance and decision trail disappear.
stakeholders:
  - id: ea:organization:electronic-artefacts
constraints:
  - Keep recordings and workspaces local to the user’s browser and chosen folders.
  - Make microphone permissions, storage durability and export paths visible before recording.
  - Preserve the boundary between dataset preparation and model training.
  - Use open formats and documentation so recorded material remains inspectable outside the app.
  - Keep the app deployable as a static GitHub Pages surface.
  - Never present an animation or browser estimate as a physical measurement.
  - Preserve capture priority and progressive capability handling on real mobile browsers.
approach:
  - Organize five visible modes by outcome, each with its own inputs, capture gesture, success criteria and useful export.
  - Make the live filament, acoustic halo and review waveform follow fresh measured audio rather than decorative time-based motion.
  - Preserve corpus, signal, VAD, optional ASR, alignment, evidence and confidence as separate observations before deterministic fusion.
  - Capture or decode locally, persist through browser storage or a chosen folder, and package open WAV plus inspectable metadata.
  - Keep React orchestration outside domain modules and publish the implementation, doctrine, audits and deployment workflow as open source.
outputs:
  - id: ea:project:voice-capture-studio
  - id: ea:artefact:voice-capture-studio-repository
outcomes:
  - A live GitHub Pages application for local speech capture in a secure browser context.
  - A documented open-source repository with architecture, corpus, workspace and export notes.
  - A structured export model for WAV audio, transcripts, timing, intent, quality reports and manifests.
  - A privacy-first workflow where user recordings are not uploaded to a remote service by the website.
  - "Five coherent product workflows: Free Capture, Lexical Segmentation, ML Dataset, Dubbing and Performance."
  - A deterministic observation graph that distinguishes physical measurements, linguistic estimates, browser hypotheses and fused decisions.
evidence:
  - id: ea:artefact:voice-capture-studio-repository
credits:
  - id: ea:organization:electronic-artefacts
media:
  - id: voice-capture-studio-lexical-screen-2026
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-lexical-2026.png
    alt: Current Voice Capture Studio interface showing the five modes and the local lexical segmentation console.
    caption: "Shipped July 2026 interface: warm-white glass panels, five mode capsules and local lexical segmentation."
  - id: voice-capture-studio-dataset-screen-2026
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-dataset-2026.png
    alt: Current Voice Capture Studio ML Dataset console with corpus coverage, calibration and capability checks.
    caption: Dataset mode keeps coverage, calibration and browser capability status visible before capture.
  - id: voice-capture-studio-original-signal-screen
    type: image
    src: /assets/media/projects/voice-capture-studio/voice-capture-studio-capture.png
    alt: Earlier dark Voice Capture Studio dataset surface documenting the evolution toward the current instrument.
    caption: Earlier shipped surface retained as design lineage; the current application now uses the warm-white instrument language.
visualLanguage:
  - Warm white
  - Carbon black
  - Ice blue
  - Dusty rose
  - Translucent glass
textures:
  - Frosted glass panels
  - Diffuse depth
  - Signal filament
  - Fine instrument grid
  - Rounded mode capsules
symbols:
  - Microphone
  - Live filament
  - Acoustic halo
  - Coverage ring
  - Local archive
developmentFocus:
  - React 19
  - Vite 6
  - TypeScript
  - Web Audio API
  - AudioWorklet
  - IndexedDB
  - File System Access API
  - Web Workers and WebAssembly
  - Local Whisper analysis
  - WAV PCM and JSONL export
  - GitHub Pages
marketingFocus:
  - Five-mode voice instrument
  - Signal-grounded experience design
  - Deterministic research pipeline
  - Local-first audio processing
  - Dataset provenance
  - Open-source browser engineering
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
    accessedAt: "2026-07-18"
    url: https://electronicartefacts.github.io/voice-capture-studio/
  - title: Voice Capture Studio repository
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio
  - title: Voice Capture Studio architecture doctrine
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/architecture-doctrine.md
  - title: Voice Capture Studio phenomenology
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/design/PHENOMENOLOGY.md
  - title: Voice Capture Studio mode experience grid
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/mode-experience-grid.md
  - title: Voice Capture Studio capture technology audit
    publisher: GitHub
    accessedAt: "2026-07-18"
    url: https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md
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
  - Deterministic Research
  - Human Computer Interaction
  - Audio Pipeline
disciplines:
  - Audio Engineering
  - Web Development
  - Human Computer Interaction
  - Machine Learning
  - Open Source
featured: true
---

## Overview

Voice Capture Studio is a local-first voice instrument that runs in the browser. It now joins five distinct workflows in one surface: immediate recording, ML corpus production, picture-led dubbing, interpreted performance with a separate guide track, and word-by-word segmentation of local audio or video.

The application is live at [electronicartefacts.github.io/voice-capture-studio](https://electronicartefacts.github.io/voice-capture-studio/) and the source code is public at [github.com/electronicartefacts/voice-capture-studio](https://github.com/electronicartefacts/voice-capture-studio).

## The experience is part of the instrument

The current interface is deliberately quiet: warm white rather than studio black, large carbon typography, rounded capsules, fine borders, ice-blue focus, dusty-rose warnings and translucent panels that keep the page light while preserving depth. Glassmorphism is used as an information layer, not an ornamental effect: the background stays perceptible while readiness, mode, calibration and export state remain legible.

The main curve — the filament — is the product’s perceptual spine. In the recording application it represents fresh audio, never an arbitrary loop. Its halo derives energy from measured amplitude. During replay, the same visual language follows the decoded take. If a live frame becomes stale, the surface returns to an honest idle carrier instead of presenting old data as current.

That rule extends to the entire motion system: nothing that looks like a reading may be simulated. Silence remains data. Capture receives the full rendering budget. Reduced motion removes choreography without removing meaning. The interface is therefore closer to a pane of glass over an acoustic instrument than to a conventional dashboard.

## Five modes, five outcomes

- **Free Capture** starts directly, without a corpus, and records up to ten minutes with manual stop, WAV and provenance.
- **Lexical Segmentation** takes local audio or video, discards the image, analyzes speech or song and exports a timestamped WAV for each supported word plus JSON and CSV evidence.
- **ML Dataset** plans phrases from corpus coverage, calibrates the room, records comparable takes and advances coverage only when accepted material is both valid and durably stored.
- **Dubbing** combines a local script or SRT/VTT cues with local video or an explicitly activated YouTube reference. The performer sees the scene, preserves cue timing and exports an isolated voice lane.
- **Performance** records continuous or segmented interpretation against an optional headphone guide. The guide supports the performer but is never mixed into the captured voice WAV.

These are product modes rather than file-format presets. Each changes the inputs, the capture gesture, the definition of success and the useful output. Podcasting remains a Free Capture scenario; voice-over remains a Dubbing scenario; audiobook work remains a Performance scenario until those uses require genuinely different engines.

## From signal to decision

The recording path begins with progressive capability inspection: microphone permission and inputs, Web Audio, storage durability, folder access, downloads, wake lock, optional speech APIs, Workers and accelerated rendering. A missing optional capability degrades only the workflow that depends on it.

Microphone capture uses `getUserMedia` and a PCM recorder. It prefers `AudioWorkletNode`, keeps a `ScriptProcessorNode` compatibility fallback, encodes mono RIFF-padded WAV at 48 kHz / 24-bit when the runtime permits, and derives first-pass technical metrics from the recorded signal. Imported media is decoded to 16 kHz analysis signals before local segmentation.

After capture, observations remain separate:

- the immutable corpus declares the expected text, language, intent and delivery;
- the PCM signal supplies physical and prosodic measurements, energy VAD, segments, silences and pauses;
- browser speech recognition, when available, remains an optional hypothesis;
- grapheme-to-phoneme and word timing remain preparatory estimates;
- fused decisions cite their evidence, reasons and confidence rather than erasing the observations that produced them.

This is the deterministic research layer: identical bounded observations feed explicit policies, and uncertainty stays visible. Browser ASR can request review but cannot reject or authorize a physical recording. A transcript mismatch does not erase a technically valid take. An acoustic forced-alignment import can replace an estimated timing map without rewriting the raw evidence.

## Lexical segmentation pipeline

Lexical Segmentation is the fifth mode and the clearest example of the local pipeline. It accepts up to 200 MB and ten minutes, decodes the media on the device, classifies the scene and chooses a fast, verified or deep analysis budget. A first Whisper pass scouts the source. Difficult speech, singing or music can trigger a base-model pass, a vocal-focus signal, spectral mid/side separation and temporal fuzzy-majority consensus.

Each exported word keeps its start, end, clip context, acoustic support, confidence, consensus votes and evidence class. The ZIP contains 16 kHz / 24-bit mono WAV clips, a versioned manifest and a timeline. Video pixels are not processed by this mode; only the audio track enters the pipeline.

## Local-first persistence and open exports

The workspace prefers IndexedDB, can use a user-selected File System Access folder, and always keeps explicit downloads as a fallback. A take cannot credit dataset coverage when its audio was not accepted by durable local storage. Workspace archives are verified before restoration and do not silently overwrite existing WAV files.

The main capture package contains session, speaker and corpus records; take-level WAV, transcript, timing, phoneme, intent, quality, observation and evidence files; dataset reports; a JSONL training manifest; and SHA-256 checksums. Browser estimates remain labeled `forcedAlignmentRequired` until acoustic validation replaces or confirms them.

Voice Capture Studio prepares material for archives, research, dubbing and machine-learning workflows. It does **not** train a model, promise research-grade acoustic alignment in every browser or upload private recordings to a remote service.

## Architecture and technology

The app is built with React 19, TypeScript and Vite. Web Audio, AudioWorklet, browser media decoding, IndexedDB, the File System Access API, Workers, WebAssembly/WebGPU-capable local analysis, PWA service-worker distribution and GitHub Pages form the browser chassis.

Domain modules own corpus, sessions, workspace, coverage, recording, observations, phonetics, speakers, settings and export contracts. They do not import React, CSS, DOM or browser APIs. The application shell owns orchestration and adapters. This dependency direction keeps planning, keeper rules, evidence fusion and package contracts testable outside a specific interface.

The repository release gate covers formatting, linting, TypeScript project references, unit coverage, bundle budgets and production build. End-to-end suites exercise capture, responsive layouts, Chromium, Firefox, WebKit, offline restart and automated accessibility checks.

## Open source, privacy and boundaries

The MIT-licensed repository makes the behavior inspectable. Voice recordings and generated workspaces remain user data; they belong in browser storage, a chosen local folder or an explicit download, never in the public source repository.

Local-first is not a claim that browser storage is permanent. The interface exposes storage durability, capability gaps and export paths because users need to know what will survive a reload, what requires a download and what a particular browser cannot provide.

## Documentation and evidence

Useful source entry points:

- [Phenomenology](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/design/PHENOMENOLOGY.md) — signal, movement and perceptual laws.
- [Mode experience grid](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/mode-experience-grid.md) — users, inputs, gestures, outputs and success criteria for the five modes.
- [System model](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/system-model.md) — observed runtime flow and current tensions.
- [Capture technology audit](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md) — observation pipeline, timing limits and validation boundary.
- [Export structure](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/export-structure.md) — package layout, quality records and Forge-shaped downstream stages.
- [Browser-native engineering manifesto](https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/browser-native-engineering-manifesto.md) — progressive capability and local-first principles.

## Knowledge relay

The six editorial briefs are now complete Knowledge articles rather than release notes: [trustworthy audio interfaces](/publications/trustworthy-audio-interfaces-and-measurement/), [traceable voice capture](/publications/traceable-voice-capture-from-microphone-to-dataset/), [deterministic evidence fusion](/publications/deterministic-research-and-evidence-fusion/), [local lexical segmentation](/publications/local-lexical-segmentation-for-speech-and-song/), [five mode contracts](/publications/five-voice-modes-five-success-criteria/) and [browser-native local-first architecture](/publications/browser-as-a-local-first-voice-studio/). Each remains useful after interface changes because it addresses a durable problem.

Voice Capture Studio sits near [ORETH](/programs/oreth/) because both treat audio as structured material. It connects to [Web Audio](/knowledge/concepts/web-audio/), the [Web Audio API](/knowledge/technologies/web-audio-api/), [Human–Computer Interaction](/knowledge/concepts/human-computer-interaction/), [Metadata](/knowledge/concepts/metadata/) and [Open Source](/knowledge/concepts/open-source/) as a practical test of those ideas.

The project’s role is precise: make the first voice artifact cleaner, more inspectable and more reusable before an archive, model, dubbing edit or production workflow receives it.
