---
id: ea:publication:runtime-engines-and-domain-operating-systems
type: publication
slug:
  canonical: runtime-engines-and-domain-operating-systems
title: Runtime Engines and Domain Operating Systems
subtitle: Technical Article
abstract: A systems-level guide to runtime engines, domain operating systems, identity, state, permissions, events, extensions and public projections.
description: Understand runtime engines and domain operating systems, and how shared entities, permissions and events can support many applications.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.1.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-07-18"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:domain-operating-system
  - id: ea:concept:graph-runtime
  - id: ea:concept:contextual-execution
  - id: ea:concept:event-driven-architecture
  - id: ea:program:vaste
  - id: ea:project:vestiges
  - id: ea:concept:microservice-architecture
  - id: ea:artefact:vab-interface-prototype
  - id: ea:concept:situated-actors-and-governance
  - id: ea:concept:vaste-extension-architecture
  - id: ea:concept:vaste-five-primitives
claims:
  - A domain operating system is credible when several applications reuse shared identity, entity, permission and event semantics.
  - Runtime engines should separate stable domain contracts from replaceable storage, transport and interface implementations.
evidence:
  - id: ea:concept:domain-operating-system
  - id: ea:concept:graph-runtime
  - id: ea:program:vaste
sources:
  - title: POSIX.1-2024
    publisher: The Open Group and IEEE
    publishedAt: "2024-06-14"
    accessedAt: "2026-06-24"
    url: https://pubs.opengroup.org/onlinepubs/9799919799/
  - title: Domain-Driven Design Reference
    author: Eric Evans
    publisher: Domain Language
    publishedAt: "2015-01-01"
    accessedAt: "2026-06-24"
    url: https://www.domainlanguage.com/ddd/reference/
  - title: CloudEvents
    publisher: Cloud Native Computing Foundation
    accessedAt: "2026-06-24"
    url: https://cloudevents.io/
citation:
  preferred: "Electronic Artefacts. \"Runtime Engines and Domain Operating Systems.\" Technical article, version 1.0.0, 2026."
tags:
  - Runtime Engine
  - Domain OS
  - Business OS
  - VASTE
  - Composable Systems
disciplines:
  - Systems Design
  - Software Architecture
  - Programming
  - Knowledge Systems
---

## Problem

Product ecosystems repeatedly rebuild identity, permissions, workflows and domain records in separate applications. Duplication fragments meaning and makes integrations, governance and long-term evolution expensive.

## Introduction

Software products repeatedly implement the same foundations: users, organizations, permissions, records, workflows, events, search and integrations. As an ecosystem grows, separate applications duplicate these structures and assign slightly different meanings to them. Identity fragments. Rules diverge. Data becomes difficult to move.

A runtime engine centralizes part of this execution model. It provides stable mechanisms through which domain objects are loaded, validated, changed and observed. A domain operating system goes further: it coordinates shared identities, entities, permissions, events and extension points across several applications in one field.

The phrase operating system is metaphorical here. A business or cultural OS does not replace a hardware kernel, process scheduler or device driver. It resembles an operating system because it provides common services and contracts that many applications can reuse.

The metaphor is useful only when the shared layer is real. A dashboard with several menu items is not an operating system. A credible domain OS has stable identity, governed capabilities, executable rules, observable state and composable interfaces.

## What a runtime does

A runtime is the environment in which a program's abstractions become active. Language runtimes manage memory, types, scheduling or garbage collection. Game engines execute scenes, physics, input and rendering. Workflow engines execute state transitions. Browser runtimes coordinate documents, scripts, networking and rendering.

A domain runtime executes domain semantics. It knows which entities exist, which operations are valid, which actor can perform them, how state changes are recorded and which projections or events follow.

The runtime should not contain every product feature. It provides the minimum shared mechanisms that applications need to behave coherently.

VASTE uses the idea of a graph runtime: addressable entities and typed relations participate in contextual computation.

## Operating system analogy

General-purpose operating systems expose abstractions such as processes, files, users, permissions and devices. Applications build on those abstractions without reimplementing hardware control.

A domain operating system exposes people, organizations, artefacts, workflows, rights, events or other domain primitives. Applications build specialized interfaces without inventing incompatible identity and permission systems.

The analogy has limits. Domain systems are often distributed, web-based and governed by organizations rather than one machine. Their resources may be cultural or legal rather than computational.

Use the analogy to ask useful questions: what are the shared primitives, what capabilities are granted, how is state isolated, and how do applications interact? Do not use it as branding for an oversized platform.

## Domain primitives

Primitives are the smallest stable concepts the runtime treats as fundamental. For VASTE, these include entities, typed relationships, identity, context, events and projections.

Primitives should be fewer and more durable than application features. A `Person` or `Artefact` can support many products. A `HomepageHeroCard` is an interface concern and should not enter the core domain.

The runtime needs stable identifiers and schemas. Applications may add local fields, but shared meaning should remain consistent.

Primitive design is ontology work. It requires explicit scope and exclusions. If everything becomes a primitive, the runtime becomes rigid and impossible to understand.

## Architecture

A domain OS contains canonical identity, entity and relation schemas, state transitions, capability evaluation, event contracts, projection builders and extension interfaces over replaceable storage and transport adapters.

## Identity

Identity answers whether two references point to the same thing. A domain OS needs identifiers that survive renaming, route changes and application boundaries.

User identity is only one layer. Organizations, projects, publications, tools and cultural artefacts also need canonical identity. External identifiers may map to internal records without becoming the sole authority.

Identity resolution should preserve uncertainty. Two similar names may not represent one person. Merging records is a consequential operation with provenance and rollback requirements.

Electronic Artefacts IDs create this foundation. VASTE can extend it to runtime behavior and external integration.

## State

State includes current values, lifecycle status and relevant history. A publication may be draft, reviewed, published, archived or superseded. A relation may be proposed, validated or rejected.

The runtime enforces valid transitions. An application should not bypass rules by directly changing a status field.

State can be stored as current records, event history or both. The choice depends on audit and reconstruction needs. Stable contracts should not expose storage implementation unnecessarily.

Versioning protects concurrent work. Operations can require an expected entity version and reject stale updates.

## Permissions and capabilities

A domain OS needs a capability model. Roles alone are often insufficient. An editor may publish one collection but only comment on another. A model may read private sources for one task but cannot expose them publicly.

Capabilities can be evaluated from actor identity, target entity, relation, state, organization and requested operation. This is contextual execution.

The runtime should return explainable decisions. "Denied" is less useful than "publication is speculative and requires canonical review." Decision logs support audit without exposing sensitive policy details.

Capabilities should be granted narrowly and revoked predictably. Extension modules should not inherit global authority by default.

## Events

Events make state changes observable. When an entity is published, consumers can update search, regenerate public pages and notify subscribers.

The runtime defines domain event semantics; transport technology carries them. A CloudEvents envelope or Redis Stream can standardize delivery, but the event type and entity meaning belong to the domain.

Events should include causation and correlation. Which command produced the change? Which actor or process initiated it? Which entity version resulted?

Replay and duplication policies must be explicit. Public side effects should not repeat blindly.

## Projections

Different applications need different views of shared state. A public website needs only published fields. An editor needs workflow state and sources. A search service needs normalized text. An archive export needs preservation metadata.

These are projections. The runtime supplies canonical records and events; projection builders create optimized read models.

Public and private projections also enforce disclosure boundaries. Restricted fields should not be filtered only in the browser. The projection should exclude them before publication.

Electronic Artefacts generates static HTML, JSON-LD, search indexes and graph neighborhoods from one content model. This is already a small domain-runtime pattern.

## Extension architecture

A domain OS becomes useful when extensions can add capabilities without modifying the core for every product. Extensions may define new entity types, processors, views, event consumers or integration adapters.

Extension contracts need versioning and permission boundaries. A plugin should declare which events it consumes and which operations it can perform. It should not reach arbitrary internal tables.

Composability is not unlimited customization. Stable extension points are chosen deliberately. Too many hooks freeze internal implementation and increase security risk.

The runtime should support graceful absence. Removing one extension should not corrupt unrelated entities.

## Application shells

Applications provide interfaces and workflows for specific audiences. A research library, creator dashboard and cultural marketplace can share one runtime while presenting different navigation and language.

The application shell should not duplicate domain rules. It asks the runtime whether an action is valid and renders the result. Local interface state remains local.

This separation allows a public website to remain static and fast while administrative surfaces are dynamic. It also supports multiple clients without inconsistent permissions.

The runtime is not the user experience. Good products still require domain-specific design.

## Orchestration

A domain OS often coordinates multi-step processes: review, publication, contribution, payment or analysis. Some flows are deterministic workflows; others include agentic or human decisions.

The runtime should represent state and boundaries, while specialized workflow engines may handle timers, retries and compensation. Avoid rebuilding a complete workflow platform unless domain requirements justify it.

Events connect stages. Commands request transitions. Human tasks remain visible entities with ownership and deadlines.

AI agents can participate as bounded actors. Their proposals, tools and permissions should be represented like other runtime operations.

## Knowledge graph integration

Knowledge graphs describe entities and relations. A graph runtime makes some of that structure executable. A relation can influence permission, routing, context assembly or event propagation.

For example, a contributor relation may permit editing a project. A publication's subject relations may determine which concept pages rebuild. A provenance path may determine whether an artefact can be released.

Execution should use explicit predicates and bounded traversal. Allowing arbitrary graph proximity to grant authority would be unsafe.

The graph also improves explainability. A decision can cite the relations that contributed to it.

## Simulation

Runtime engines can support simulations by representing agents, environments, state transitions and rules. A graph model is useful when simulated entities interact through changing relationships.

Simulation should remain separated from canonical real-world state. Experimental outcomes can be stored as derived artefacts with their model version and assumptions.

VASTE's interest in modular world construction connects to this capacity. A runtime can execute fictional, analytical or operational worlds using shared primitives.

The challenge is performance. General semantic models may need compiled or specialized representations for large simulations.

## Domain OS for culture

Vestiges illustrates a cultural domain OS. The shared primitives include people, organizations, techniques, materials, tools, places, documents and works. Relations describe teaching, making, using, preserving and participating.

Applications can include public knowledge pages, contribution workflows, institutional dashboards, learning paths and economic services. They share identity and provenance rather than operating as isolated databases.

The marketplace becomes one projection of cultural knowledge, not the central model. This preserves intellectual value even when commercial services change.

Cultural systems also need plural language and contested claims. The runtime must avoid turning one ontology into unquestionable authority.

## Domain OS for a creative studio

A studio runtime can connect projects, clients, artefacts, references, rights, tools, publications and archive records. It can track how research becomes production and how production returns knowledge.

Electronic Artefacts already has these entity classes. A future internal surface could coordinate editorial status, project provenance, media preservation and public publication.

ORETH could contribute audio-analysis capabilities. Palimpsests could use compound publication structures. The Knowledge Hub could receive validated concepts and methods.

The goal is not centralizing every creative decision. It is preventing structural knowledge from disappearing across folders and applications.

## Build versus buy

General platforms provide authentication, databases, queues and content management. A domain runtime should reuse commodity infrastructure where possible.

Build the layer that represents distinctive domain semantics or creates durable strategic value. Buy or adopt well-supported components for generic transport, storage and observability.

VASTE's proprietary value should reside in graph execution, context and domain architecture, not in reinventing cryptography or databases.

Open standards improve portability. JSON-LD, RDF mappings, CloudEvents and stable URLs can expose data without requiring external systems to adopt the internal runtime.

## Governance

A domain OS is institutional infrastructure. Changes to primitives and permissions affect every application. Governance needs proposal, review, migration and deprecation processes.

Schema ownership should be clear. Extension authors need compatibility policy. Security review should cover capabilities and data projections.

Public vocabulary changes require editorial care. An identifier should not be reused for a different meaning. Deprecated terms should retain mappings.

Governance can remain lightweight in a small organization, but decisions must be recorded.

## Failure modes

The first failure is platform maximalism. The runtime attempts to own every feature before shared needs are proven.

The second is metaphor without substance. A dashboard is called an OS despite having no stable runtime contracts.

The third is central bottleneck. Every team must wait for core changes.

The fourth is leaky abstraction. Applications bypass the runtime and modify storage directly.

The fifth is extension insecurity. Plugins receive broad access.

The sixth is ontology rigidity. Domain evolution becomes harder because primitives are treated as permanent.

The seventh is missing exit paths. Data cannot be exported without the platform.

## Implementation path

Start with stable entity identity and a small predicate vocabulary. Add validation and versioned operations. Separate canonical state from projections. Introduce events for meaningful changes. Model permissions through explicit capabilities.

Build one application that proves reuse, then a second application that consumes the same primitives. The second use is the real test of a platform.

Add extension contracts only where repeated integration needs exist. Measure operational cost. Preserve exports and static public surfaces.

For VASTE, Vestiges and the Knowledge Hub provide complementary proving grounds: runtime, applied product and public knowledge projection.

## Implementation

Start with stable IDs, validated operations and one canonical state store. Generate public and private projections, publish domain events, then prove reuse across a second application before adding broad plugin or workflow infrastructure.

## Evidence

General operating-system standards demonstrate the value of stable shared interfaces, domain-driven design provides bounded language and model concepts, and CloudEvents supplies an interoperable event envelope for distributed extensions.

## Limitations

The operating-system metaphor can encourage platform maximalism. A domain runtime should remain smaller than the applications it supports, offer export paths and avoid centralizing unrelated capabilities.

## Related concepts

[Microservice Architecture](/knowledge/concepts/microservice-architecture/) provides a useful contrast: a domain runtime may deploy modular services, but its defining value lies in shared identity, authority and event semantics rather than service count. See [Microservices, Modular Monoliths and System Boundaries](/publications/microservices-modular-monoliths-and-system-boundaries/) for the deployment trade-off.

Within VASTE, the [VAB interface prototype](/archive/artefacts/vab-interface-prototype/) is the visible boot surface, [situated actors and governance](/knowledge/concepts/situated-actors-and-governance/) define authority, the [five primitives](/knowledge/concepts/vaste-five-primitives/) provide the shared vocabulary and the [extension architecture](/knowledge/concepts/vaste-extension-architecture/) keeps capabilities replaceable. These are complementary layers of one runtime rather than isolated doctrine pages.

Read [Domain Operating System](/knowledge/concepts/domain-operating-system/), [Graph Runtime](/knowledge/concepts/graph-runtime/), [Contextual Execution](/knowledge/concepts/contextual-execution/) and [Event-Driven Architecture](/knowledge/concepts/event-driven-architecture/).

## Related programs and projects

See [VASTE](/programs/vaste/) and [Vestiges](/projects/v6/).

## Glossary

Runtime engine: an environment that executes a set of abstractions and rules.

Domain operating system: a shared runtime and information layer for one field.

Primitive: a foundational entity or operation exposed by the runtime.

Capability: a specific permission to perform an operation.

Projection: a view derived from canonical state.

Extension point: a governed interface through which modules add behavior.

## References

- The Open Group and IEEE. POSIX.1-2024.
- Evans, Eric. Domain-Driven Design Reference.
- Cloud Native Computing Foundation. CloudEvents.
