---
id: ea:collection:studio
type: collection
slug:
  canonical: studio
title: Studio
subtitle: Open-Source Software Series
abstract: "Studio is Electronic Artefacts’ open-source software series: local-first browser instruments that turn specialist creative workflows into inspectable, portable and freely usable tools."
description: An editorial collection for the open-source Studio line, beginning with Voice Capture Studio and prepared to receive Spatial Mapping Studio as its public record matures.
locale: en
visibility: public
publicationClass: published
status: active
maturity: development
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-08-17"
  publishedAt: "2026-08-17"
  modifiedAt: "2026-08-17"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
thesis: "Studio makes a family of specialist creative tools legible as public software: each application is useful on its own, local to the user where possible, published with inspectable source and designed to exchange durable artefacts rather than capture people inside a platform."
curator:
  - id: ea:organization:electronic-artefacts
explicitMembers:
  - id: ea:project:voice-capture-studio
  - id: ea:artefact:voice-capture-studio-repository
  - id: ea:concept:open-source
  - id: ea:concept:browser-software
  - id: ea:concept:provenance
selectionNote: This collection holds public, inspectable software records and the concepts needed to read their local-first boundaries, portable outputs and maintenance commitments. Spatial Mapping Studio will join when its public project and repository record are ready to be published.
tags:
  - Studio
  - Open Source
  - Local First
  - Browser Software
  - Creative Tools
disciplines:
  - Web Development
  - Human Computer Interaction
  - Open Source
  - Creative Technology
sources:
  - title: Voice Capture Studio repository
    publisher: GitHub
    accessedAt: "2026-08-17"
    url: https://github.com/electronicartefacts/voice-capture-studio
  - title: Spatial Mapping Studio repository
    publisher: GitHub
    accessedAt: "2026-08-17"
    url: https://github.com/electronicartefacts/spatial-mapping-studio
---

## Thesis

Studio is a software line, not a product suite with a shared account or a closed platform. Each tool starts from a concrete practice and remains independently usable: the source is public, the runtime is browser-native where it serves the work, and user material stays in the user’s hands.

## First instrument

[Voice Capture Studio](/projects/voice-capture-studio/) is the first published Studio application. It treats voice capture, review and segmentation as local workflows with open WAV and metadata exports, rather than as a service that absorbs recordings into a remote system.

## The next record

Spatial Mapping Studio is the next planned Studio record. Its current V0 repository defines a local authoring workflow for a final GLB and a portable semantic manifest: an author can select stable triangle regions, name and tag them, then export an `artifact.json` that a separate viewer can resolve.

This is deliberately a preparation note, not a release claim. Scene understanding, automated segmentation, Forge integration and broader downstream integrations remain future directions until they are documented and published in the Spatial Mapping Studio record.

## A shared grammar

The applications do not need the same interface to belong together. Their common grammar is more structural: free and inspectable code; no advertising; no account or cloud dependency as a precondition for the core workflow; explicit local storage and export boundaries; and portable outputs that can move into other tools without giving up their provenance.

Forge belongs near this line as a separate internal research system for reproducible artefact pipelines. The intended route is directional rather than a claimed integration: source material can be made into a final, stable 3D payload through Forge-shaped preparation, then Spatial Mapping Studio can attach semantic regions to that final payload. The V0 specification is explicit that topology or triangle order must not change after mapping.

## How the series grows

New Studio records should enter only with a public source, a stated license, an honest maturity label and a useful explanation of what remains local, what is exported and what is not yet implemented. The collection is designed to grow one precise tool at a time.
