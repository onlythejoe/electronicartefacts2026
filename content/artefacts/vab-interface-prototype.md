---
id: ea:artefact:vab-interface-prototype
type: artefact
slug:
  canonical: vab-interface-prototype
title: VAB Interface Prototype
subtitle: Assisted Boot Interaction Study
abstract: A preserved browser prototype that explores VAB conversation, editable memory, ceremony transitions and graph-reveal behavior without standing in for the VASTE runtime implementation.
description: A factual archive record for the autonomous HTML, CSS and JavaScript VAB interaction prototype created in July 2026.
locale: en
visibility: public
publicationClass: published
status: archived
maturity: prototype
confidence: observed
version:
  version: 1.0.0
  createdAt: "2026-07-07"
  publishedAt: "2026-07-13"
  modifiedAt: "2026-07-13"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
artefactType: prototype
createdAt: "2026-07-07"
provenance: Preserved in the Electronic Artefacts VASTE design-research archive as an autonomous HTML, CSS and JavaScript prototype with integration notes and a documented browser runtime facade.
format: HTML, CSS and JavaScript archive
preservationStatus: stable
significance: The prototype makes the intended Assisted Boot interaction model inspectable while preserving a strict boundary between interface simulation and the separately implemented VASTE Boot Assist service.
sources:
  - title: VAST Assisted Boot integration notes
    publisher: Electronic Artefacts
    accessedAt: "2026-07-13"
    locator: VASTE design-research archive, vast-assisted-boot-prototype/INTEGRATION_NOTES.md
  - title: VAB browser prototype source
    publisher: Electronic Artefacts
    accessedAt: "2026-07-13"
    locator: VASTE design-research archive, vast-assisted-boot-prototype/index.html and script.js
tags: [VASTE, VAB, Assisted Boot, Interface Prototype, Human Computer Interaction]
disciplines: [Interaction Design, Runtime Systems, Human Computer Interaction]
---

## Description

The VAB Interface Prototype is an autonomous browser study for the interaction language of VASTE Assisted Boot. It explores a continuous conversation surface, an authenticated Actor supplied by the session, an editable memory projection, a transition into a visual ceremony and a final graph reveal.

Its JavaScript runtime exposes inspectable functions for draft preparation, cognitive previews, memory items, ceremony state and final graph data. These functions form a test facade for the prototype; they are not the canonical VASTE graph or authority layer.

## Provenance

The preserved archive contains HTML, CSS, JavaScript and integration notes. The notes define how a future or external orchestrator could provide structured lines, process state, voice timing and graph projections. They repeatedly distinguish local preview data from canonical runtime state.

The current VASTE repository separately contains Boot Assist contracts, a service implementation, runtime adapters, a web materializer and integration tests. This artefact documents the autonomous design prototype only and must not be used as the sole evidence for those runtime capabilities.

## Significance

The prototype tests a product question that static diagrams cannot answer: how can first intent, provisional understanding, user correction and governed system birth become legible as one interaction?

It also records useful interface invariants. Identity comes from an admitted session rather than conversational inference. Provisional beliefs are not facts. Editing the visible memory projection must not mutate the raw world model directly. Entering the ceremony in the prototype previews acceptance; it does not prove that a backend admitted the request.

## Rights

The archive is an Electronic Artefacts research artefact. This public record documents its role and limitations; it does not publish private runtime configuration, credentials or user conversation data.

## Limitations

The archive is not evidence of a production assistant or a completed Genesis handover. Its scripted conversation and local cognitive preview are interface simulations. Microphone capture and browser transcription may be exercised by the prototype, but no model understanding, canonical memory write, runtime provisioning or TTS pipeline should be inferred from that behavior.
