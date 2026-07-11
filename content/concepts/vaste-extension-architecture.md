---
id: ea:concept:vaste-extension-architecture
type: concept
slug: { canonical: vaste-extension-architecture }
title: VASTE Extension Architecture
definition: A VASTE extension is an optional, System-scoped capability unit that declares domain actions, bindings and surfaces while runtime authority remains in the core execution path.
abstract: Extension manifests, lifecycle, measured families, zero-extension boot, Intelligence boundaries and the current in-process trust limit.
description: The implemented and specified extension system of VASTE, with a maturity-aware inventory.
locale: en
visibility: public
publicationClass: canonical
status: experimental
maturity: development
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [Extension manifests, Runtime lifecycle, Capability boundaries, Extension families]
exclusions: [Public marketplace, Safe untrusted execution, Uniform extension maturity]
claims:
  - Core runtime boots and executes without installed extensions.
  - Extension installation and visible exposure are separate lifecycle states.
tags: [VASTE, Extensions, Runtime, Intelligence]
disciplines: [Software Architecture, Runtime Systems]
---

## Boundary

Extensions add meaning and optional capability without changing the primitive vocabulary. They may own actions, manifests, bindings, domains and Surface specifications. The runtime still owns namespace registration, routing, scheduling, execution, typed effects, mutation and lifecycle state. A manifest requests capability; it does not grant itself permission.

## Lifecycle

The current runtime has install, enable, disable, upgrade and remove Actions. Artifacts and registrations are System-scoped. Installation does not imply that a Surface is exposed, and disabling an extension must not erase canonical graph truth. Tests cover packaging, identity, lifecycle tooling, coupling rules and boot with zero extensions.

## Measured families

The repository’s coupling census groups current extensions into five families:

- **Foundational** — Actor, Knowledge, Assets and graph-adjacent meaning.
- **Coordination** — Flow, Program and Simulation orchestration.
- **Knowledge and cognition** — World Model, Intelligence and Perception.
- **Experience** — Workspace, Studio, Expression and projection.
- **Tooling** — SDK and supporting authoring boundaries.

This is an architectural taxonomy, not a claim that every directory is equally complete. Some contain executable registration and Actions; others are partial or doctrine-led.

## Intelligence

Intelligence is an advisory extension with provider adapters and model configuration. It may propose structured output or stream language, but it does not bypass Actor admission, policy or Action execution. Provider, model and runtime capability remain distinct.

## Trust limit

Trusted first-party extensions currently execute in-process. Contracts describe package provenance, signatures, trust tiers, grants and future sandbox execution, but cryptographic verification and marketplace-grade isolation are incomplete. Therefore VASTE does not yet treat arbitrary third-party extensions as safe.
