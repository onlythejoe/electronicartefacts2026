---
id: ea:concept:vaste-five-primitives
type: concept
slug:
  canonical: vaste-five-primitives
title: The Five VASTE Primitives
definition: VASTE has a closed primitive roster—Vertex, Tie, Action, Surface and Environment—from which graph identity, topology, admitted change, observation and execution-local context are composed.
abstract: A contract-grounded guide to the five irreducible VASTE primitives, their invariants and the concepts that must not be mistaken for primitives.
description: Vertex, Tie, Action, Surface and Environment explained from VASTE contracts, validators and integration tests.
locale: en
visibility: public
publicationClass: canonical
status: experimental
maturity: development
confidence: validated
version:
  version: 1.0.0
  createdAt: "2026-07-11"
  publishedAt: "2026-07-11"
  modifiedAt: "2026-07-11"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Primitive contracts and runtime invariants
  - System roots and graph addressing
  - Canonical truth versus projection and local context
exclusions:
  - Product-level extension semantics
  - Treating System, Actor or Workspace as additional primitives
claims:
  - The primitive roster is closed at five.
  - Primitive data is explicit, serializable and separated from runtime authority.
tags: [VASTE, Runtime, Primitives, Graph]
disciplines: [Software Architecture, Runtime Systems]
---

## Closed vocabulary

VASTE permits no sixth primitive. Operationally important concepts such as System, Actor, Workspace, Program, projection, host and extension are composed above the primitive layer. This keeps the kernel independent from product meaning.

## Vertex

A Vertex is behaviorless data with `id`, `systemId`, a namespaced `type`, serializable `data` and optional metadata. The validator rejects functions, circular structures, non-finite numbers and invalid metadata versions. Every Vertex belongs to exactly one System partition. A freshly bootstrapped System is represented by a `system:root` Vertex; shared `systemId` establishes membership, while explicit Ties refine nested topology.

## Tie

A Tie is a directed relation with its own ID, System, endpoints, namespaced type, domain reference and metadata. The runtime validates endpoint and System boundaries. Cross-System relations require both an explicit allowance and target System ID. A Tie is topology, not a hidden mutation channel.

## Action

An Action describes admitted intent. The primitive contract requires it to be declarative, serializable, replayable and deterministic, with namespace, authority, access level, input/output contracts, preconditions, postconditions, failure modes and state transitions. Primitive validation rejects embedded handlers and direct mutation fields. Routing and effects belong to the runtime.

## Surface

Surface is the authorityless membrane through which a Vertex-System may be observed or interacted with. Its invariant scanner rejects runtime, store, dispatch and mutation-like fields. `SurfaceSpec` enriches the membrane; lifecycle and projection state are runtime-owned. A Surface can be materialized as web, shell, API, stream or another support, but the support is not its identity.

This membrane belongs to the selected Vertex; it is not an additional node in a graph view. Such a view draws Vertices and Ties only, then exposes Surface, Environment, attached Extensions and available Actions through the selected Vertex.

## Environment

Environment is immutable and recreated for an execution. It carries the resolved System, identity and authority claims, permissions, invocation scope, trace, execution tick, resource budgets and optional graph location. It explicitly carries no persistence, state storage, computation results or cross-execution accumulation.

Operationally, this is also where the runtime resolves the Action set available at a Vertex and the local containment context for nested Vertices. That context is inspected through the Vertex; Environment and Action are not rendered as graph nodes.

## Boundaries that matter

- **System**: isolation partition plus root closure; compatibility/runtime boundary, not primitive.
- **Actor**: identity and admission extension; typically represented by specialized Vertices.
- **Partition**: all graph records scoped by one `systemId`.
- **Closure**: selected portable structural content, either an entire partition or a contained subtree.
- **Projection**: derived observation; never canonical state by itself.
- **Environment**: local execution context, excluded from portable graph packages.

## Evidence and limit

Contracts live in `packages/contracts/src/primitives.ts`; runtime validators live in `src/primitives`; integration tests cover namespace, boundaries, execution and kernel purity. These internal validations support the primitive claims. They do not establish that every extension or future platform layer is complete.
