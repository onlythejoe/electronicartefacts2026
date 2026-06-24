---
id: ea:publication:microservices-modular-monoliths-and-system-boundaries
type: publication
slug:
  canonical: microservices-modular-monoliths-and-system-boundaries
title: Microservices, Modular Monoliths and System Boundaries
subtitle: Technical Article
abstract: A pragmatic comparison of microservices and modular monoliths through domain boundaries, data ownership, deployment, events, observability and team structure.
description: Learn when microservices make sense, why modular monoliths are often the better starting point, and how to define durable system boundaries.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:microservice-architecture
  - id: ea:concept:event-driven-architecture
  - id: ea:concept:systems-thinking
  - id: ea:concept:contextual-execution
  - id: ea:program:vaste
claims:
  - Service boundaries should follow domain ownership, independent evolution and operational requirements rather than technical fashion.
  - A modular monolith preserves simpler transactions and operations while establishing boundaries that can later become services.
evidence:
  - id: ea:concept:microservice-architecture
  - id: ea:concept:systems-thinking
sources:
  - title: Microservices
    author: James Lewis and Martin Fowler
    publisher: MartinFowler.com
    publishedAt: "2014-03-25"
    accessedAt: "2026-06-24"
    url: https://martinfowler.com/articles/microservices.html
  - title: MonolithFirst
    author: Martin Fowler
    publisher: MartinFowler.com
    publishedAt: "2015-06-03"
    accessedAt: "2026-06-24"
    url: https://martinfowler.com/bliki/MonolithFirst.html
  - title: Domain-Driven Design Reference
    author: Eric Evans
    publisher: Domain Language
    publishedAt: "2015-01-01"
    accessedAt: "2026-06-24"
    url: https://www.domainlanguage.com/ddd/reference/
citation:
  preferred: "Electronic Artefacts. \"Microservices, Modular Monoliths and System Boundaries.\" Technical article, version 1.0.0, 2026."
tags:
  - Microservices
  - Modular Monolith
  - System Boundaries
  - Domain-Driven Design
  - Distributed Systems
disciplines:
  - Software Architecture
  - Systems Design
  - Programming
  - Distributed Systems
---

## Problem

Teams often distribute applications before domain boundaries, ownership and operational needs are understood. The result is a networked system that preserves monolithic coupling while adding latency and failure modes.

## Introduction

Microservices are often presented as the modern endpoint of software architecture. A large application is split into small services, each independently deployable and aligned with a business capability. Teams gain autonomy, components scale separately and failures remain isolated.

Those benefits are real under the right conditions. The costs are equally real. Network calls replace function calls. Partial failure becomes normal. Data ownership becomes distributed. Deployment, authentication, observability and incident response require mature infrastructure. A system with ten services can be harder to change than a monolith when boundaries are wrong.

A modular monolith offers another path. The application deploys as one unit but enforces internal module boundaries. Modules own capabilities and expose explicit interfaces. Transactions and local development remain simpler, while the architecture preserves the option to extract services later.

The useful question is not "monolith or microservices?" in the abstract. It is where the domain boundaries are, which parts need independent deployment, and whether the organization can carry the operational complexity of distribution.

## What a microservice is

A microservice is an independently deployable service organized around a bounded capability. It owns its implementation and usually its data. Other services interact through network contracts such as APIs or events.

Size is not the defining feature. A service with little code can own a complex responsibility, while a larger service may still represent one coherent domain. Counting lines or endpoints encourages arbitrary fragmentation.

Independent deployment is central. If five services must always be released together, they may be a distributed monolith: physically separated but tightly coupled.

Autonomy also needs organizational ownership. A service with no team responsible for reliability and evolution is not meaningfully independent.

## What a monolith is

A monolith is an application deployed as one unit. The term says little about internal quality. A monolith can be well modularized, testable and maintainable. It can also be a tightly coupled codebase where every feature reaches every table.

Deployment unity provides advantages. Local development can start one process. Calls are fast and debuggable. Database transactions can preserve consistency. Refactoring across modules can happen atomically.

The risk is erosion. Without enforced boundaries, shared models and utility packages become coupling channels. Teams avoid change because impact is unclear.

The remedy is modular architecture, not immediate distribution.

## The modular monolith

A modular monolith defines internal components around domain capabilities. Each module owns its data access and exposes a public interface. Other modules cannot reach internal tables or implementation classes directly.

Modules may communicate through function calls, internal commands or domain events. Contracts can be tested. Dependency direction can be enforced by tooling.

This architecture offers a learning advantage. Domain boundaries are difficult to discover early. Keeping modules in one deployable allows refactoring while product understanding develops. Once a boundary proves stable and requires independent scaling or ownership, it can be extracted.

The monolith-first approach is not a refusal of microservices. It delays irreversible distribution until evidence exists.

## Architecture

The architecture begins with bounded capabilities, owned data and explicit contracts. These boundaries can run as modules in one deployable or as independently deployed services connected through APIs and events.

## Domain boundaries

Boundaries should follow changes in language, rules, ownership and lifecycle. Domain-driven design calls these bounded contexts. The same word may mean different things in different contexts: a "publication" in editorial workflow differs from a static HTML page in the delivery system.

A good boundary has high internal cohesion and low external coupling. Changes within it do not repeatedly require changes elsewhere. It can explain its responsibility in domain language.

Technical layers alone are weak service boundaries. Splitting controllers, business logic and persistence into separate services creates network coupling without domain autonomy.

Electronic Artefacts can distinguish content authority, graph runtime, search projection, media processing and public delivery. Whether these become processes depends on operational need.

## Data ownership

Independent services should own their data. Sharing one database schema lets services bypass contracts and creates hidden coupling. A schema change for one capability can break another.

Separate ownership does not require a different database server for every small service. It requires controlled access boundaries. One service should not query another service's tables directly.

Data needed elsewhere can be exposed through APIs, events or replicated projections. This introduces eventual consistency and duplication, which are deliberate costs of autonomy.

The system must identify authoritative sources. A search index is a projection, not the canonical publication record. A graph neighborhood is derived from entities and relations.

## Transactions and consistency

Monoliths can use local database transactions across modules. Microservices cannot rely on one atomic transaction across independently owned stores without reintroducing coupling.

Distributed workflows use patterns such as sagas, outboxes and compensating actions. A service commits its local state and records an event. Downstream services react. If later work fails, compensation may reverse or amend earlier effects.

This is not equivalent to atomic rollback. Users may observe intermediate states. Domain design must decide which invariants require immediate consistency and which can converge.

Do not distribute a workflow before understanding its failure semantics.

## Communication

Synchronous APIs are appropriate when a caller needs an immediate result. They create availability dependencies: if the callee is unavailable, the caller must fail, retry or degrade.

Events reduce temporal coupling and support multiple consumers. They introduce delayed consistency, schema evolution and duplicate processing.

Most architectures use both. The choice should reflect meaning. Query current authorization synchronously if a decision cannot proceed without it. Publish an event after a canonical record changes so projections can update.

Avoid long chains of synchronous service calls. Latency and failure probability multiply. If one user request crosses many services, the boundary design may be too fragmented.

## Deployment

Independent deployment is a microservice benefit only when the pipeline, tests and compatibility practices support it. Each service needs build, release, configuration, secrets, monitoring and rollback.

Version contracts to allow gradual rollout. Consumers and producers may run different versions simultaneously. Backward-compatible changes reduce coordination.

A modular monolith has one release pipeline, making cross-module change simpler. The deployment can still use blue-green or canary strategies.

Operational capacity should be treated as a finite stock. Every service consumes part of it.

## Observability

A monolith can often trace a request through one process. Microservices require correlation IDs, distributed tracing, centralized logs and service-level metrics.

Infrastructure metrics are not enough. The system should observe domain flows: publication time, failed graph updates, stale projections and pending reviews.

Ownership matters. Alerts must route to a team able to act. A dashboard with no response procedure does not create reliability.

Testing should include dependency timeouts, partial outages and retries. Distributed failure cannot be evaluated only through unit tests.

## Security

Microservices increase network and identity surfaces. Service-to-service authentication, authorization, certificate or token rotation and secret management become foundational.

Network location alone should not grant trust. Each service validates caller identity and requested capability. Sensitive events and logs require data minimization.

A monolith has fewer network boundaries but still needs module-level authorization. Internal code should not assume every operation is allowed merely because it runs in one process.

VASTE's contextual execution is relevant in both architectures. Permission is a domain concern before it is a deployment concern.

## Team structure

Architecture and organization influence one another. Teams aligned to capabilities can own services end to end. Teams divided by technical layer often create handoffs and coupled release processes.

Microservices can support autonomy when teams are large enough and capabilities are stable. In a small studio, they may distribute attention across infrastructure instead of product work.

A modular monolith can still support ownership through module maintainers and interface contracts. Deployment unity does not require organizational chaos.

The number of services should not exceed the organization's ability to understand and operate them.

## Scaling

Microservices allow one capability to scale independently. Media processing can add workers without scaling the editorial API. A public read service can replicate without duplicating private administration.

Many systems do not need this granularity. A monolith can scale horizontally behind a load balancer. Background jobs can run as separate processes while sharing code and data contracts.

Measure the bottleneck before splitting. Database design, caching or asynchronous work may solve the actual problem.

Premature distribution turns hypothetical scale into permanent complexity.

## Reliability

Service isolation can limit failures. A broken recommendation service need not stop publication. Bulk audio analysis can be separated from interactive requests.

Isolation only works when dependencies degrade gracefully. If the main application waits synchronously for every service, one failure propagates.

Circuit breakers, timeouts, bulkheads and queues help, but each adds behavior to test. The system should define acceptable degradation. Can a page render without related recommendations? Can an article publish while search indexing is delayed?

Reliability comes from designed boundaries, not container count.

## Testing

A modular monolith supports fast unit and integration tests inside one repository. Module contract tests can enforce boundaries. End-to-end tests remain manageable.

Microservices require contract tests between independently deployed components, integration environments and production observability. End-to-end tests can become slow and brittle if they attempt to cover every combination.

Consumer-driven contracts help verify that providers remain compatible. Event schemas need version tests. Failure injection reveals assumptions.

Testing cost should be included in architectural decisions.

## Migration

The safest migration extracts one proven boundary. Identify a capability with distinct ownership, scaling or release needs. Define its contract while still inside the monolith. Remove direct internal dependencies. Establish data ownership. Then move execution across a network.

This sequence separates domain work from infrastructure work. If the boundary remains painful before extraction, the network will not improve it.

Use a strangler pattern to route selected functionality to the new service gradually. Monitor behavior and maintain rollback.

Do not begin by splitting the database into arbitrary tables or creating services for every noun.

## VASTE architecture

VASTE is a runtime program, not an argument for maximal distribution. Its core value lies in graph entities, typed relationships, identity, context and events.

A modular runtime can keep these semantics coherent while exposing adapters for search, media processing and public projections. Services should be extracted where independent operation creates value.

For example, computationally heavy simulation or audio analysis may scale independently. Public graph delivery may need a different security and caching profile from private editing. These are evidence-based boundaries.

The canonical graph and permission model should not be duplicated across services without a clear authority strategy.

## Knowledge Hub architecture

The current Knowledge Hub is well served by a static build. Content source files, relation validation, search generation and public pages operate through one repository pipeline. Introducing microservices would add little value.

Future collaborative editing or large-scale retrieval may justify services. The existing entity contracts and generated projections create a strong modular foundation.

This demonstrates an important principle: architecture should fit the product stage. A sophisticated knowledge graph does not require a distributed deployment.

## Decision framework

Choose a modular monolith when the product and domain are still evolving, one team owns most capabilities, transactions cross boundaries frequently, and operational simplicity matters.

Choose microservices when capabilities are stable, teams need independent deployment, workloads scale differently, regulatory isolation matters, or failure containment justifies distribution.

Before extraction, answer: who owns the service, what data does it own, what contract does it expose, how does it fail, how is it observed, and how can it be rolled back?

If these answers are unclear, distribution is premature.

## Implementation

Enforce module boundaries inside the current codebase, remove cross-module table access and define contracts. Extract only a capability with proven independent scaling, security or release needs, then add deployment and observability around it.

## Evidence

Lewis and Fowler describe microservices through business capabilities, independent deployment and decentralized management. Fowler's monolith-first argument emphasizes that service boundaries are easier to discover inside an initially unified system.

## Common mistakes

The first mistake is splitting by technical layer.

The second is sharing a database while claiming service independence.

The third is synchronous call chains across many services.

The fourth is adopting orchestration infrastructure without operational ownership.

The fifth is confusing containers with microservices.

The sixth is ignoring eventual consistency in user experience.

The seventh is extracting boundaries before the domain is understood.

## Limitations

Organizational scale, regulatory constraints and workload profiles can justify early distribution. This article offers a conservative default, not a universal prohibition against microservices.

## Related concepts

Read [Microservice Architecture](/knowledge/concepts/microservice-architecture/), [Event-Driven Architecture](/knowledge/concepts/event-driven-architecture/), [Systems Thinking](/knowledge/concepts/systems-thinking/) and [Contextual Execution](/knowledge/concepts/contextual-execution/).

## Related program

See [VASTE](/programs/vaste/).

## Glossary

Microservice: an independently deployable service aligned with a bounded capability.

Modular monolith: one deployable application with enforced internal module boundaries.

Bounded context: a domain boundary within which a model and language are consistent.

Distributed monolith: separately deployed components that remain tightly coupled.

Saga: a distributed process coordinated through local transactions and compensation.

Outbox: a pattern for reliably publishing events after a database change.

## References

- Lewis, James, and Martin Fowler. Microservices. 2014.
- Fowler, Martin. MonolithFirst. 2015.
- Evans, Eric. Domain-Driven Design Reference.
