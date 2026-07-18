---
id: ea:publication:local-lexical-segmentation-for-speech-and-song
type: publication
slug: { canonical: local-lexical-segmentation-for-speech-and-song }
title: Segmenting Speech and Song Locally, Word by Word
subtitle: Adaptive Analysis Without Remote Upload
abstract: Local lexical segmentation combines bounded media decoding, vocal activity, adaptive transcription hypotheses and temporal consensus while preserving original audio as evidence.
description: Inside the Voice Capture Studio lexical pipeline for spoken voice, singing and mixed media.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version: { version: 1.0.0, createdAt: "2026-07-18", publishedAt: "2026-07-18", modifiedAt: "2026-07-18" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:project:voice-capture-studio
  - id: ea:concept:voice-technology
  - id: ea:concept:web-audio
  - id: ea:concept:multimodal-ai
  - id: ea:concept:signal-archaeology
  - id: ea:program:oreth
  - id: ea:technology:web-audio-api
claims:
  - Lexical clips should be exported from the untouched decoded source even when derived signals assist transcription.
  - Runtime-adaptive analysis should retain independent verification rather than equating a smaller budget with blind trust.
evidence: [{ id: ea:project:voice-capture-studio }, { id: ea:artefact:voice-capture-studio-repository }]
sources:
  - { title: Voice Capture Studio Capture Technology Audit, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md" }
  - { title: ONNX Runtime Web Execution Providers, publisher: Microsoft, accessedAt: "2026-07-18", url: "https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html" }
citation: { preferred: 'Electronic Artefacts. "Segmenting Speech and Song Locally, Word by Word." Technical article, 2026.' }
tags: [Lexical Segmentation, Local AI, Singing Voice, Whisper, Audio Evidence]
disciplines: [Audio Engineering, Machine Learning, Web Development]
---

## Problem

Lexical segmentation turns a local audio or video file into word-level audio clips with timecodes and supporting evidence. The simple version—run speech recognition and cut on returned timestamps—fails quickly on singing, music, reverberation, uncertain silence and constrained devices.

The [Voice Capture Studio](/projects/voice-capture-studio/) mode treats segmentation as an evidence pipeline. Video pixels are ignored; only the decoded audio enters analysis. Imports are bounded before full decoding so a mobile tab is not asked to absorb an unlimited source.

## Architecture

A first local transcription hypothesis and independent voice-activity evidence classify the scene. Clean speech may need only one pass. Difficult speech, music or sustained singing can justify stronger verification and derived vocal-focus signals. The budget follows observed runtime performance and source complexity rather than browser-brand assumptions.

This is a practical local-AI pattern: measure the device on the actual task, then choose the smallest evidence set that preserves an independent check.

## Implementation

Mid/side residuals, vocal-band emphasis or room-informed separation can make a voice easier for a model to hear. They can also introduce artifacts. Voice Capture Studio therefore uses derived signals to propose or verify boundaries while exporting clips from the untouched decoded source.

That distinction links [voice technology](/knowledge/concepts/voice-technology/) to [signal archaeology](/knowledge/concepts/signal-archaeology/). Processing can reveal a trace, but the processed result should not silently replace the material from which the trace was inferred.

## Speech and song need different evidence

Speech VAD often treats sustained vowels, instrumental gaps or melodic phrasing poorly. A song-aware path combines speech activity with sustained-vocal evidence and scene classification. It does not claim that singing is speech; it builds a mask that keeps likely instrumental-only intervals from dominating transcription while preserving duration and timestamps.

This is also a boundary in [multimodal AI](/knowledge/concepts/multimodal-ai/): a video container may hold image and sound, but the lexical mode explicitly narrows the modality under study to audio.

## Temporal consensus

Multiple hypotheses are useful only if their disagreement remains visible. A fuzzy temporal consensus can reconcile nearby lexical variants, recover omissions supported by independent passes and reject isolated proposals when stronger agreement exists. Every accepted word retains start, end, source hypotheses, confidence and review status.

Consensus is not a vote that manufactures certainty. It is a decision policy over traceable hypotheses.

## Open export

The result is a ZIP of mono word clips plus JSON and CSV timelines. A strong manifest records source identity, detected scene, planned and actual analysis depth, models and execution providers, selected signals, activity-mask coverage, consensus recoveries, rejections and observed performance. Cancellation must stop analysis and packaging cleanly rather than produce a partial success that looks complete.

## Browser-native implications

[Web Audio](/knowledge/concepts/web-audio/) and the [Web Audio API](/knowledge/technologies/web-audio-api/) provide decoding and signal access, while Workers and local inference keep heavy analysis away from the interface. The browser is capable, but capability is conditional: memory, model cache, execution provider and source duration all matter.

[ORETH](/programs/oreth/) provides the wider research context. The goal is not merely to automate cuts. It is to create inspectable relations between media, vocal activity, lexical hypotheses, source time and exported evidence.

## Evidence

The capture technology audit records the scene classifier, adaptive hypothesis budget, consensus rules and manifest fields used by the current implementation.

## Limitations

Local transcription remains device-dependent, singing remains harder than clean speech and exported word boundaries still require review when independent hypotheses disagree.

## References

- Voice Capture Studio. Capture Technology Audit.
- ONNX Runtime. Web execution-provider guidance.
