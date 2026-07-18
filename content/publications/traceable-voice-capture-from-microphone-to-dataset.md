---
id: ea:publication:traceable-voice-capture-from-microphone-to-dataset
type: publication
slug: { canonical: traceable-voice-capture-from-microphone-to-dataset }
title: "From Microphone to Dataset: Anatomy of a Traceable Voice Take"
subtitle: Capture, Provenance and Open Packages
abstract: A voice take becomes reusable data only when raw audio, prompt, room context, observations, review decisions, persistence and export manifests remain connected.
description: A step-by-step account of the Voice Capture Studio pipeline from PCM capture to a verifiable local dataset package.
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
  - id: ea:concept:speech-recording
  - id: ea:concept:speech-datasets
  - id: ea:concept:metadata
  - id: ea:concept:provenance
  - id: ea:concept:machine-learning-workflows
  - id: ea:concept:digital-preservation
claims:
  - A voice dataset begins at capture time, not when model training starts.
  - Immutable raw audio and explicitly derived artifacts should coexist in one provenance-aware package.
evidence: [{ id: ea:project:voice-capture-studio }, { id: ea:artefact:voice-capture-studio-repository }]
sources:
  - { title: Voice Capture Studio Capture Technology Audit, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md" }
  - { title: Voice Capture Studio Export Structure, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/export-structure.md" }
citation: { preferred: 'Electronic Artefacts. "From Microphone to Dataset: Anatomy of a Traceable Voice Take." Technical article, 2026.' }
tags: [Voice Dataset, Provenance, PCM, Metadata, Local First]
disciplines: [Audio Engineering, Data Engineering, Machine Learning]
---

## Problem

A WAV can preserve sound and still lose the conditions that make the recording useful. Which prompt was spoken? Which corpus version supplied it? Who reviewed the take? Was the room calibrated? Did a transcript come from declared text, browser recognition or acoustic alignment? Where was the file stored, and did the export preserve its checksum?

[Voice Capture Studio](/projects/voice-capture-studio/) treats the recording tool as part of the dataset methodology. The pipeline begins before the red button and ends only when audio, context, observations and decisions can travel together.

## Architecture

The browser first establishes available microphone, storage, worker and file capabilities. A missing optional feature should degrade only the workflow that needs it. The instrument then measures room tone separately from the voice-optimized capture stream. That separation avoids pretending that browser processing and raw ambient measurement are the same source.

## Implementation

The canonical recording is mono PCM WAV. Actual track settings, timing and capture context belong in provenance. Post-processing may derive a voice-first signal for inspection or downstream ASR, but it must not overwrite the immutable take. Raw and derived hashes make that boundary checkable.

This is a practical application of [speech recording](/knowledge/concepts/speech-recording/) and [digital preservation](/knowledge/concepts/digital-preservation/): preserve the source, name every transformation and retain enough context to repeat or contest a decision.

## 3. Separate observations

The system keeps different evidence channels independent:

- corpus observations contain declared text, language, intention and prompt structure;
- signal observations contain measured acoustic and prosodic features, silence and voice activity;
- browser ASR remains an optional hypothesis;
- word and phoneme alignment remains estimated until stronger acoustic evidence replaces it;
- fused decisions cite the observations and reasons that produced them.

That separation prevents a plausible transcript from becoming an authority over a physically valid recording. It also makes later correction possible without rewriting history.

## 4. Review and persistence

A dataset does not progress because a file exists. It progresses when a take is accepted and stored durably. Voice Capture Studio can persist in IndexedDB, a user-selected folder or an explicit download path. The interface exposes the boundary because browser storage is not automatically permanent.

Review state is therefore part of [metadata](/knowledge/concepts/metadata/), not a transient UI flag. A keeper decision, rejection reason, quality report and storage outcome should remain attached to the same take identity.

## 5. Open package

A useful export connects session, speaker and corpus records to WAV files, transcript, timing, phonemes, intention, observations, quality reports, checksums and a JSONL training manifest. Open formats matter because the package must remain inspectable outside the application.

This is where [provenance](/knowledge/concepts/provenance/) becomes operational. A downstream tool can choose raw or derived audio, see whether alignment is estimated, verify hashes and identify what still requires review.

## Preparation is not training

Voice Capture Studio supports [machine-learning workflows](/knowledge/concepts/machine-learning-workflows/) by preparing structured material. It does not train a model, certify a dataset or silently promote browser estimates into research-grade ground truth. That boundary prevents the capture product from making claims that belong to later evaluation.

The corresponding research question—[How can speech datasets become reproducible, structured and privacy-first?](/research/questions/speech-dataset-reproducibility/)—uses the project as its current software experiment. The result is a compact principle: capture once, preserve context immediately, and defer stronger claims until stronger evidence exists.

## Evidence

The project repository exposes the capture technology audit, export contracts and tests that keep raw and derived artifacts separate.

## Limitations

Browser storage is not automatically permanent, local alignment remains preparatory and a structured package still requires downstream consent, review and model-specific evaluation.

## References

- Voice Capture Studio. Capture Technology Audit.
- Voice Capture Studio. Export Structure.
