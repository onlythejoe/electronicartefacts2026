---
id: ea:concept:domain-operating-system
type: concept
slug:
  canonical: domain-operating-system
title: Domain Operating System
definition: A domain operating system is a shared runtime and information layer that coordinates identities, entities, permissions, workflows, events and interfaces for a specific field of activity.
abstract: A domain operating system turns repeated domain rules into reusable infrastructure without claiming to replace a general-purpose computer operating system.
description: An Electronic Artefacts concept for business operating systems, runtime engines and shared domain platforms.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: observed
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Domain entities
  - Identity and permissions
  - Workflows
  - Event execution
  - Shared services
  - Public and private projections
exclusions:
  - Marketing language for a conventional dashboard with no shared runtime semantics
  - A replacement for the kernel, hardware abstraction or process model of a general-purpose OS
claims:
  - A domain operating system becomes credible when multiple applications reuse the same identities, rules and event semantics.
  - Domain infrastructure should expose extension points without centralizing every concern.
tags:
  - Domain OS
  - Business OS
  - Runtime Engine
  - Platform Architecture
  - Composability
disciplines:
  - Systems Design
  - Software Architecture
  - Programming
  - Knowledge Systems
---

## Definition

A domain operating system coordinates the recurring entities and rules of a field. It provides shared identity, permissions, events, workflows, data contracts and extension surfaces so that multiple applications do not reimplement the same foundations.

## Difference from an application

An application delivers a bounded user experience. A domain operating system supports several experiences and integrations while maintaining common semantics underneath them.

## Electronic Artefacts position

VASTE is relevant as a domain-runtime foundation for graph-shaped products. Vestiges can become a cultural knowledge operating layer when public pages, contributions, validation and economic services share the same entity model.

## Limitations

The metaphor can encourage overreach. A domain operating system should start from proven shared needs, maintain replaceable modules and avoid becoming a mandatory dependency for unrelated functions.

## References

See Graph Runtime, Contextual Execution, VASTE, Vestiges and Event-Driven Architecture.
