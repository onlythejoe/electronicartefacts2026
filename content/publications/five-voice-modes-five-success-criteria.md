---
id: ea:publication:five-voice-modes-five-success-criteria
type: publication
slug: { canonical: five-voice-modes-five-success-criteria }
title: Why Five Voice Modes Need Five Success Criteria
subtitle: Product Modes as Distinct Work Contracts
abstract: Free capture, dataset recording, dubbing, performance and lexical segmentation deserve separate modes only because they change inputs, operator gestures, acceptance rules and useful outputs.
description: A product-design framework for deciding when a voice workflow is a mode rather than a preset.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version: { version: 1.0.0, createdAt: "2026-07-18", publishedAt: "2026-07-18", modifiedAt: "2026-07-18" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
format: caseStudy
subjects:
  - id: ea:project:voice-capture-studio
  - id: ea:concept:human-computer-interaction
  - id: ea:concept:voice-technology
  - id: ea:concept:systems-thinking
  - id: ea:concept:speech-recording
  - id: ea:concept:speech-datasets
claims:
  - A product mode is justified only when it changes the workflow, success condition and useful output together.
  - Reusing one visual metric across incompatible voice workflows can create false meaning.
evidence: [{ id: ea:project:voice-capture-studio }]
sources:
  - { title: Voice Capture Studio Mode Experience Grid, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/mode-experience-grid.md" }
citation: { preferred: 'Electronic Artefacts. "Why Five Voice Modes Need Five Success Criteria." Case study, 2026.' }
tags: [Product Modes, Voice UX, Dataset, Dubbing, Interaction Design]
disciplines: [Product Design, Human Computer Interaction, Audio Engineering]
---

## Context

Product teams often create modes by renaming the same screen. That adds navigation without adding capability. [Voice Capture Studio](/projects/voice-capture-studio/) uses a stricter test: a new mode is justified only when it changes the capture journey, the success condition and the useful export.

This produces five work contracts rather than five cosmetic presets.

## Constraints

Each workflow must preserve capture integrity while exposing only the progress measures and controls that have meaning for its operator.

## Approach

### Free capture

Free capture begins without a corpus. A journalist, musician or sound designer needs immediate recording, a clear timer, manual stop and a recoverable local WAV. Success means the complete take can be replayed and exported with provenance. Dataset coverage has no meaning here and should not appear as an empty gauge.

### ML dataset

Dataset mode begins with a corpus, speaker profile and room calibration. It chooses prompts according to coverage gaps and evaluates whether accepted material can advance the dataset. Success is not “a file was recorded”; it is “an accepted, durably stored take improved a declared coverage target.” This mode connects [speech recording](/knowledge/concepts/speech-recording/) to [speech datasets](/knowledge/concepts/speech-datasets/).

### Dubbing

Dubbing binds a line to picture and scene time. Script, SRT or VTT cues and local video change the operator’s task: see, cue, perform, compare and retry without leaving the studio. Success means an isolated voice take retains its scene reference and timing. The image soundtrack may guide through headphones, but it must not contaminate the captured WAV.

### Performance

Performance supports song, narration or acted text with an optional guide track. It may be continuous or segmented, but the useful result is still an isolated voice plus a performance manifest. The support track guides interpretation and remains outside the voice evidence.

### Lexical segmentation

Lexical segmentation does not use the microphone. It receives existing local media, analyzes its audio and produces verifiable word clips. Success means every exported word can be traced to source time, evidence and context. This is a transformation workflow, not a recording preset.

## Implementation

The modes can share permissions, local storage, audio review, export vocabulary and visual language. They diverge where the work diverges: inputs, ordering, acceptance, progress and output.

This distinction is a [systems-thinking](/knowledge/concepts/systems-thinking/) tool. Shared infrastructure reduces duplication, while explicit domain contracts prevent one workflow’s assumptions from leaking into another.

## Outcome

Uniform UI is not always coherent UI. A phonetic coverage ring belongs in dataset mode because it measures progress against a corpus. Showing the same ring at zero in free capture or dubbing would imply failure where no coverage goal exists. Likewise, scene time matters in dubbing but not in an immediate field recording.

Good [human-computer interaction](/knowledge/concepts/human-computer-interaction/) preserves the meaning of a control, not merely its visual consistency.

## Evidence

Podcasting can remain a free-capture scenario until multiple speakers, markers and long-form editing require a new engine. Audiobooks can remain segmented performance until chapter continuity, characters and editorial review become first-class. Foley becomes distinct when nonverbal event timelines and metadata replace transcript-led work.

The test is concrete: does the proposed mode require a new input model, a different operator gesture, a different definition of success and a different useful package? If not, it is a scenario, template or preset—not a mode.

The five contracts and rejected mode hypotheses are maintained in the Voice Capture Studio mode-experience grid cited above and implemented in the [public project](/projects/voice-capture-studio/).
