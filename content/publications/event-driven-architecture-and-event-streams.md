---
id: ea:publication:event-driven-architecture-and-event-streams
type: publication
slug:
  canonical: event-driven-architecture-and-event-streams
title: Event-Driven Architecture and Event Streams
subtitle: Technical Article
abstract: A practical explanation of events, commands, queues, logs, brokers, schemas, delivery semantics, idempotency, projections, replay and observability.
description: Learn event-driven architecture through event streams, delivery guarantees, schema evolution, idempotency, projections and runtime design.
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
  - id: ea:concept:event-driven-architecture
  - id: ea:technology:cloudevents
  - id: ea:concept:contextual-execution
  - id: ea:concept:graph-runtime
  - id: ea:program:vaste
claims:
  - Event-driven systems reduce temporal coupling by recording state changes for independent consumers.
  - Reliable event processing requires stable identity, schema governance, idempotency, replay policy and end-to-end observability.
evidence:
  - id: ea:concept:event-driven-architecture
  - id: ea:technology:cloudevents
sources:
  - title: CloudEvents
    publisher: Cloud Native Computing Foundation
    accessedAt: "2026-06-24"
    url: https://cloudevents.io/
  - title: Apache Kafka Documentation
    publisher: Apache Software Foundation
    accessedAt: "2026-06-24"
    url: https://kafka.apache.org/documentation/
  - title: Event Sourcing
    author: Martin Fowler
    publisher: MartinFowler.com
    publishedAt: "2005-12-12"
    accessedAt: "2026-06-24"
    url: https://martinfowler.com/eaaDev/EventSourcing.html
citation:
  preferred: "Electronic Artefacts. \"Event-Driven Architecture and Event Streams.\" Technical article, version 1.0.0, 2026."
tags:
  - Event-Driven Architecture
  - Event Streams
  - CloudEvents
  - Idempotency
  - Event Sourcing
disciplines:
  - Software Architecture
  - Systems Design
  - Distributed Systems
  - Programming
---

## Problem

Direct synchronous calls couple component availability and force producers to coordinate every consequence of a change. As systems grow, this reduces resilience and obscures historical state transitions.

## Introduction

Most software begins with direct calls. A user submits a form, an application validates it, writes a database record and returns a response. One component calls another and waits. This request-response model is understandable and often sufficient.

Event-driven architecture becomes useful when several parts of a system need to react to change independently, when work must continue asynchronously, or when the history of change matters. Instead of one component instructing every downstream component, it records that something happened: a publication was approved, an artefact was ingested, a relation was created, a payment was completed.

Consumers subscribe to relevant events and perform their own work. A search index updates. A public projection rebuilds. An audit record is written. A notification is sent. The producer does not need to know all of these consequences.

This decoupling creates flexibility and resilience, but it also creates new questions: what exactly is an event, how is it delivered, what happens when consumers fail, how are schemas changed, and can history be replayed safely?

## Events and commands

A command requests an action: `PublishArticle`, `CreateRelation`, `AnalyzeAudio`. It may be rejected because permissions, validation or state do not allow it. An event records something that has happened: `ArticlePublished`, `RelationCreated`, `AudioAnalysisCompleted`.

The distinction clarifies responsibility. A command has an intended handler. An event may have many unknown consumers. Commands are usually named in the imperative; events in the past tense.

Systems often blur the terms. A message named `SendEmailEvent` may actually be a command directed to one worker. The architecture becomes easier to reason about when names reflect semantics rather than transport.

Events should represent meaningful domain changes, not every internal function call. Excessively fine-grained events expose implementation detail and create noise.

## Event envelope

An event needs metadata as well as payload. Common fields include a unique identifier, type, source, time, subject, schema version and correlation identifier.

CloudEvents defines a portable event envelope with attributes such as `id`, `source`, `specversion` and `type`. The specification does not dictate the domain payload or broker. It provides a shared shape that improves interoperability across services and transports.

For VASTE, an event could identify the entity that changed, the actor context, relation scope, visibility and causation. This allows downstream consumers to apply contextual rules rather than receiving anonymous data.

An envelope should remain compact and stable. Sensitive details may belong in a protected payload or referenced record rather than headers copied across infrastructure.

## Architecture

An event-driven architecture contains producers, event contracts, transport, retention, consumer groups, idempotent handlers, projections, failure paths and observability. Domain state remains authoritative outside the broker unless event sourcing is chosen deliberately.

## Queues, topics and logs

A queue distributes work. A message is delivered to one worker or one member of a worker group, then acknowledged. Queues are appropriate for tasks such as rendering, email delivery or file processing.

A topic broadcasts events to multiple subscribers. Each subscriber can react independently. Topics fit integration and domain event distribution.

An append-only log retains ordered records for later reading. Consumers track their own position and can replay history. Apache Kafka and Redis Streams provide log-oriented primitives, although their operational models differ.

These patterns overlap in implementations. The important questions are retention, ordering, consumption state and whether multiple independent consumers need the same record.

## Temporal coupling

Direct synchronous calls create temporal coupling: both components must be available at the same time. If the search index is down, should article publication fail? An event stream lets publication commit its domain change while indexing catches up later.

This improves resilience but introduces eventual consistency. The public article may exist before every projection reflects it. Interfaces need to handle intermediate states.

Not every operation should be asynchronous. A user changing a password needs immediate validation. A financial transaction may require coordinated guarantees. Event-driven design should follow domain boundaries rather than a rule that all calls become messages.

## Delivery semantics

Messaging systems are often described as at-most-once, at-least-once or exactly-once.

At-most-once delivery may lose a message but avoids duplicate processing. At-least-once delivery retries until acknowledgement, so consumers must handle duplicates. Exactly-once usually refers to guarantees within a bounded system or transaction model; end-to-end external side effects remain difficult.

The practical default is to design consumers for at-least-once delivery. Every event has a stable ID. Consumers record processed IDs or make operations idempotent. Retrying `SetPublicationStatusToPublished` is safer than retrying `IncrementPublicationCount`.

Marketing claims about exactly-once should be translated into precise boundaries: exactly once where, under which failures, and for which side effects?

## Idempotency

An idempotent operation produces the same relevant result when repeated. It is central to reliable event handling because networks and processes can fail after work completes but before acknowledgement is recorded.

Consumers can use event IDs as deduplication keys. Database writes can use upserts or unique constraints. External calls can use provider-supported idempotency keys. State transitions can verify current version.

Idempotency is a domain property, not only a broker feature. Sending the same public announcement twice may remain harmful even if the internal database write is deduplicated.

Design review should identify every irreversible side effect and define duplicate behavior.

## Ordering

Global ordering is expensive and rarely necessary. Most systems need ordering within a meaningful key: events for one account, project or entity should be processed in sequence.

Partitioned logs preserve order within a partition. Choosing the partition key determines which events can be ordered together and how load is distributed.

Consumers should still handle late events. Network delays, retries and migrations can expose older records. Events need occurrence time and processing time where the difference matters.

For a graph runtime, ordering by entity may be insufficient when an operation spans several connected entities. The design must define transaction and consistency boundaries explicitly.

## Schema evolution

Events outlive the code that produced them. Consumers may deploy at different times. A schema change that removes or reinterprets a field can break replay and integration.

Prefer additive changes. New optional fields are easier to adopt than renamed fields. Include a schema version when semantics change. Maintain compatibility tests between producers and consumers.

An event should contain enough information to remain meaningful without copying the entire current entity. References to canonical IDs reduce duplication, while snapshots may be useful when historical interpretation requires the state at event time.

Schema registries and generated types can help, but governance remains editorial: what does the event mean?

## Event sourcing

Event sourcing stores state changes as the primary record and derives current state by replaying events. Instead of overwriting an article record, the system stores events such as `ArticleDrafted`, `ArticleReviewed` and `ArticlePublished`.

The pattern provides history, auditability and temporal reconstruction. It also adds complexity. Event schemas become permanent. Correcting mistakes requires compensating events or controlled migration. Replaying external side effects is dangerous.

Event sourcing should not be confused with publishing integration events. A system can use event-driven messaging while keeping a conventional database as the source of truth.

Use event sourcing when domain history is fundamental and the team can support its operational discipline.

## Projections

A projection transforms events or canonical state into a view optimized for reading. Search indexes, public pages, dashboards and graph neighborhoods are projections.

Projections can be rebuilt when logic changes, provided source events or canonical records remain available. This separation protects the core model from interface-specific fields.

Electronic Artefacts already generates several projections from content records: HTML pages, JSON-LD, search documents, route manifests and graph files. An event-driven runtime could update these surfaces incrementally as entities change.

Projection lag should be observable. A system needs to know which event a projection has processed.

## Failure handling

Consumers fail because of invalid data, unavailable dependencies, code defects or resource exhaustion. Retrying every failure indefinitely can block a partition or multiply costs.

Classify failures as transient or permanent. Transient failures can use bounded retries with backoff. Permanent failures should move to a dead-letter or quarantine process with enough context for investigation.

Dead-letter queues are not garbage bins. They need ownership, alerts and replay procedures. Sensitive payloads require the same protection as the primary stream.

Poison events should not prevent unrelated work. Partitioning and consumer design influence blast radius.

## Observability

Distributed event flows are invisible without tracing and metrics. Logs should include event ID, type, source, correlation ID, consumer and processing outcome. Metrics should track lag, throughput, retry rate, age and dead-letter volume.

Distributed tracing can connect the original command with emitted events and downstream work. This is especially useful when one user action affects several services.

Business observability matters too. A stream can be technically healthy while publications remain stuck before approval. Domain metrics should reflect meaningful progress.

For VASTE, graph context can enrich traces: which entity and relation caused an event, under whose authority, and which projections changed?

## Security

Events can carry sensitive data far beyond the original service. Minimize payloads, classify fields and apply access controls at the broker and consumer level.

Producers should be authenticated and authorized to emit event types. Consumers should validate schemas and treat payloads as untrusted input. Signing may be appropriate across organizational boundaries.

Retention policy matters. An append-only log can become a long-lived copy of personal or restricted information. References to controlled records may be safer than embedding full content.

Prompt injection also affects AI consumers. Text in an event payload should not become trusted model instruction.

## Event-driven AI

AI workflows often fit event architecture. A document-ingested event can trigger extraction. An analysis-completed event can trigger human review. A review-approved event can update the public graph.

Agents should not consume an unbounded global stream. They need scoped subscriptions, permissions and task context. Model outputs should become proposals or events with explicit confidence, not silent state mutation.

Events also support evaluation. The trajectory of tool calls, approvals and outcomes can be reconstructed without treating private chain-of-thought as an authoritative record.

Local models and hosted services can sit behind the same event contracts, improving replaceability.

## VASTE and contextual execution

VASTE is concerned with entities, identity, relations, context and event propagation. Event-driven architecture supplies transport and temporal decoupling, while the graph supplies meaning.

An event such as `RelationCreated` is insufficient without knowing the subject, predicate, object, actor and confidence. Contextual execution can determine whether the relation is allowed and which consumers may see it.

Graph neighborhoods can also bound propagation. A change may notify direct dependents without broadcasting across the entire system.

This combination distinguishes a graph runtime from a generic message bus. The runtime uses semantic structure to govern event behavior.

## When not to use events

Do not introduce a broker when a direct function call or database transaction is sufficient. Small systems can become harder to debug when every operation is asynchronous.

Avoid events as a way to hide unclear ownership. If no service is authoritative for a concept, more messages will not fix the domain model.

Do not publish unstable internal details as permanent integration contracts. Keep local implementation events inside the owning boundary.

The strongest event systems are selective. They record changes that other components genuinely need to observe.

## Implementation sequence

Start by naming domain events and their owners. Define identifiers, schema, source and retention. Choose one consumer and design idempotency before adding more.

Add correlation IDs, lag metrics and failure handling early. Test duplicates, reordering, unavailable consumers and schema changes. Document replay behavior.

Use CloudEvents or a similar envelope where interoperability is valuable. Choose a broker according to scale, retention and operations, not trend.

Only adopt event sourcing after the team has demonstrated reliable event handling and a domain need for event history as source of truth.

## Implementation

Implement one domain event end to end. Give it stable identity and schema, persist the originating state change, deliver it to one idempotent consumer, monitor lag and duplicates, then expand to additional projections.

## Evidence

CloudEvents specifies a portable event envelope. Kafka documents durable event streaming, while event-sourcing literature describes deriving application state from sequenced domain events.

## Limitations

Asynchronous systems increase operational and cognitive load. Eventual consistency, schema evolution and replay can be inappropriate where one local transaction or direct call already satisfies the requirement.

## Related concepts

Read [Event-Driven Architecture](/knowledge/concepts/event-driven-architecture/), [Contextual Execution](/knowledge/concepts/contextual-execution/) and [Graph Runtime](/knowledge/concepts/graph-runtime/).

## Related technology

See [CloudEvents](/knowledge/technologies/cloudevents/) and [Redis Streams](/knowledge/technologies/redis-streams/).

## Related program

See [VASTE](/programs/vaste/).

## Glossary

Event: a durable record that something happened.

Command: a request for an action.

Broker: infrastructure that transports messages.

Consumer: a component that reads and reacts to events.

Idempotency: safety under repeated execution.

Projection: a read model derived from canonical state or events.

## References

- Cloud Native Computing Foundation. CloudEvents.
- Apache Software Foundation. Apache Kafka Documentation.
- Fowler, Martin. Event Sourcing.
