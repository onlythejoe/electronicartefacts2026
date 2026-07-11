---
id: ea:concept:vab-and-genesis
type: concept
slug: { canonical: vab-and-genesis }
title: VAB and Genesis
definition: VAB is VASTE’s Assisted Boot orchestration path for understanding an initial intent, composing a sealed plan, admitting a Founding Actor and materializing a governed starting graph.
abstract: What VAB currently implements, how explicit assent seals a boot plan, and what remains before a complete Electronic Artefacts Genesis handover.
description: A maturity-aware guide to VASTE Assisted Boot, Founding Actor admission, composition and Genesis.
locale: en
visibility: public
publicationClass: canonical
status: experimental
maturity: prototype
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [Assisted Boot conversation, Cognition and planning, Founding Actor, Assent seal, Genesis trajectory]
exclusions: [Permanent assistant, Fully autonomous deployment, Demonstrated production handover]
claims:
  - Boot composition requires explicit assent to the exact plan hash.
  - A VAB-born System has been exported and imported as a .vast package in an internal E2E test.
tags: [VASTE, VAB, Assisted Boot, Genesis]
disciplines: [Runtime Systems, Human Computer Interaction]
---

## Role

VAB is a boot orchestrator and conversational Surface, not another runtime and not necessarily the permanent assistant after boot. Its task is to turn first intent into an inspectable proposal, secure assent to the exact declarative plan, and invoke runtime-owned creation paths.

## Current path

The repository implements conversation sessions, cognitive state composition, heuristic fallback and configured model invocation, streaming output, speech affordances, extension selection, Founding Actor admission, restart reconciliation and a web boot Surface. A boot plan carries an `assentedPlanHash`; changing the plan after assent invalidates the seal.

The working sequence is:

```text
conversation → interpreted needs → graph and extension proposal
→ explicit assent seal → governed creation → living System Surface
```

Internal E2E validation continues from a born System to `.vast` export, fresh import and stable package identity.

## Founding Actor

The Founding Actor is the first admitted human identity for the born System. This does not make the Actor universally omnipotent. Credentials, session admission, capabilities and graph governance remain separate runtime checks.

## Genesis versus implementation

Genesis names the governed birth of a useful System. Electronic Artefacts Genesis would additionally require organizational root data, governance, registries, operational Surfaces, durable recovery and an approved handover into a candidate Environment. The repository provides important pieces but does not yet demonstrate that complete operational loop.

## Remaining thresholds

- durable and reviewable provisioning across failures;
- explicit rollback and recovery behavior;
- local credential and authority rebinding after import;
- security review of model, extension and package trust boundaries;
- one real EA graph operated, exported, revalidated and handed over without authority bypass.
