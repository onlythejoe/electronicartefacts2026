---
id: ea:concept:contextual-execution
type: concept
slug:
  canonical: contextual-execution
title: Contextual Execution
definition: Contextual execution is the practice of making identity, state, permissions, relationships and operating context active constraints on what a system can do.
abstract: Contextual execution describes runtime behavior where an operation is evaluated through entity identity, graph relations, permissions, temporal state and intended scope.
description: A canonical Electronic Artefacts concept connecting graph runtime, Runtime Theory, VASTE and identity-aware systems.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: canonical
version:
  version: 1.0.0
  createdAt: "2026-06-23"
  publishedAt: "2026-06-23"
  modifiedAt: "2026-06-23"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Runtime context
  - Identity
  - Permissions
  - Graph relations
  - Event propagation
exclusions:
  - A global function call with no relation to user, state or entity context
  - A static label that is never used by execution logic
claims:
  - Context becomes a runtime concern when it changes whether an operation is allowed or meaningful.
  - Graph runtimes need explicit context boundaries to remain governable.
tags:
  - Context
  - Execution
  - Runtime
  - Identity
  - Permissions
disciplines:
  - Systems Design
  - Programming
  - Knowledge Systems
  - Software Architecture
---

## Definition

Contextual execution is the practice of making operating context part of execution. A system does not only ask what operation was requested. It asks who requested it, which entity is affected, which relations are active, what state the system is in, what permissions apply, and what consequences should propagate.

In Electronic Artefacts, contextual execution is a core bridge between Runtime Theory and VASTE. A graph runtime becomes meaningful when identity and relation structure can influence behavior.

## Scope

The concept includes user identity, organization identity, entity state, visibility, confidence, lifecycle, permissions, relations, event scope and temporal validity. It also includes boundaries: where context starts, where it stops, and which parts can be inherited.

## Difference from configuration

Configuration is usually a set of values that changes how software behaves. Contextual execution is more dynamic. It can depend on the current actor, the current entity, current graph neighbors, the operation being attempted and the event history that led to the moment.

## Electronic Artefacts position

The Electronic Artefacts position is that context should not be hidden inside incidental application code when it determines authority or meaning. It should be modeled explicitly enough to be inspected, tested and explained.

This is important for knowledge systems. A publication, archive record or project page may be public, internal, canonical, speculative, archived or superseded. Those states should not only change styling. They should influence indexing, graph visibility, citation and relation publication.

## Applications

Contextual execution is useful for editorial workflows, archive permissions, AI agent actions, cultural contribution systems, project governance, knowledge graph publishing and product runtimes with multiple actors.

## Limitations

Context can become expensive. If every operation depends on too much graph state, the system becomes hard to reason about. The practical challenge is to define the smallest context needed for correct execution.

## References

See Graph Runtime, Runtime Theory and VASTE.
