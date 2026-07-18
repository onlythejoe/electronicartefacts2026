---
id: ea:publication:deterministic-research-and-evidence-fusion
type: publication
slug: { canonical: deterministic-research-and-evidence-fusion }
title: "Deterministic Research: Deciding Without Turning Estimates into Truth"
subtitle: Evidence Fusion and Explicit Uncertainty
abstract: Deterministic research separates declared inputs, measured signal, model hypotheses, alignment estimates and policy decisions so every conclusion can be reproduced and challenged.
description: A method for evidence-linked decisions in Voice Capture Studio, VASTE and graph-based research systems.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version: { version: 1.0.0, createdAt: "2026-07-18", publishedAt: "2026-07-18", modifiedAt: "2026-07-18" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
format: researchNote
subjects:
  - id: ea:project:voice-capture-studio
  - id: ea:concept:provenance
  - id: ea:concept:graph-modeling
  - id: ea:concept:systems-thinking
  - id: ea:concept:contextual-execution
  - id: ea:program:vaste
  - id: ea:researchQuestion:speech-dataset-reproducibility
claims:
  - Determinism belongs to the decision policy and evidence graph, not to the claim that every observation is certain.
  - Stronger evidence should replace a bounded estimate without erasing the estimate or its provenance.
evidence: [{ id: ea:project:voice-capture-studio }, { id: ea:program:vaste }]
sources:
  - { title: Voice Capture Studio Capture Technology Audit, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/capture-technology-audit.md" }
  - { title: Voice Capture Studio Architecture Doctrine, publisher: Electronic Artefacts, accessedAt: "2026-07-18", url: "https://github.com/electronicartefacts/voice-capture-studio/blob/main/docs/architecture-doctrine.md" }
citation: { preferred: 'Electronic Artefacts. "Deterministic Research: Deciding Without Turning Estimates into Truth." Research note, 2026.' }
tags: [Deterministic Research, Evidence, Uncertainty, Provenance, Graph]
disciplines: [Research Design, Data Engineering, Software Architecture]
---

## Question

The phrase “deterministic research” can sound like a promise that a system always knows the truth. The useful meaning is narrower: given the same bounded observations and the same explicit policy, the system reaches the same decision and explains why.

In [Voice Capture Studio](/projects/voice-capture-studio/), this matters because audio evidence is heterogeneous. A corpus declares expected text. PCM supplies measured signal. Voice activity detection estimates speech-active intervals. Browser recognition may propose a transcript. A local model may provide acoustic word boundaries. An external aligner may later provide stronger phonetic evidence. None of these should silently absorb the others.

## Context

The first step is [graph modeling](/knowledge/concepts/graph-modeling/). Each observation keeps identity, method, timestamp, source and confidence. Decisions reference observations rather than copying their values into an opaque final record.

A minimal chain looks like this:

`source → observation → policy → decision → review`

The graph can branch. Multiple ASR hypotheses may refer to the same take. A consensus decision can cite them all. A later forced alignment can supersede an estimated timing map while leaving the earlier estimate available for audit.

## Observation

Three boundaries are essential.

**Declared is not measured.** Prompt text and intended language are corpus facts, not acoustic discoveries.

**Estimated is not validated.** Energy VAD, G2P timing and model confidence are useful intermediate results, not universal ground truth.

**Decided is not observed.** A keeper policy may accept a take because acoustic quality passes even when optional ASR disagrees. Acceptance is a policy result, not a property emitted by the microphone.

These boundaries are a form of [provenance](/knowledge/concepts/provenance/). They let a reviewer ask which evidence supported a claim and which method could replace it.

## Interpretation

Evidence fusion should be boring enough to reproduce. Inputs are normalized, weights are visible, thresholds are versioned and tie-breaking rules are stable. Confidence should describe support for a bounded decision, not provide a theatrical probability of truth.

Voice Capture Studio uses this pattern for prompt match, acoustic support, VAD, local transcription and alignment imports. The same pattern applies to [VASTE](/programs/vaste/), where contextual execution depends on explicit identity, authority, graph state and event history. In both systems, an engine acts on a structured context without erasing the context that constrained the action.

## Limitations

A research workflow improves when stronger evidence can arrive later. The right operation is replacement with lineage:

- preserve the raw observation;
- add the stronger observation;
- record which decision changed and why;
- keep the earlier policy version;
- expose disagreement that still requires review.

This avoids two failure modes: freezing weak estimates forever, or rewriting the record as if the system had always known the stronger result.

## Evaluation questions

Ask whether two independent runs with identical inputs produce identical decisions. Ask whether every decision cites its evidence. Ask whether uncertainty changes the available action. Ask whether an external validation can replace an estimate without destroying lineage. Ask whether a human can contest the policy rather than only the output.

The broader [systems-thinking](/knowledge/concepts/systems-thinking/) lesson is that trust lives in relationships and boundaries. Determinism is valuable not because it eliminates uncertainty, but because it stops uncertainty from being hidden inside an authoritative-looking result.

## References

- Voice Capture Studio. Capture Technology Audit and Architecture Doctrine.
- Electronic Artefacts. [Contextual Execution and Graph Runtimes](/publications/contextual-execution-and-graph-runtimes/).
