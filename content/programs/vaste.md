---
id: ea:program:vaste
type: program
slug:
  canonical: vaste
title: VASTE
subtitle: Graph-native runtime research and implementation
abstract: "VASTE is an experimental graph-native runtime for building portable, contextual and governed systems from five primitives: Vertex, Tie, Action, Surface and Environment."
description: "The canonical public record of VASTE: its runtime architecture, primitives, governed execution, extension system, Assisted Boot, experimental .vast format, validation record and current limits."
locale: en
visibility: public
publicationClass: canonical
status: development
maturity: experimental
confidence: validated
version:
  version: 2.0.0
  createdAt: "2024-01-01"
  publishedAt: "2026-01-01"
  modifiedAt: "2026-07-12"
  reviewedAt: "2026-07-12"
  changeSummary: Added a responsive interactive Surface with recursive Vertex containment, runtime, portability and Assisted Boot projections.
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
mandate: Develop and validate a graph-native runtime in which system identity, topology, execution, observation and local context remain explicit, governable and portable.
domain: Runtime Systems
capabilities:
  - Five closed core primitives
  - System-scoped graph state and deterministic action execution
  - Capability and graph-derived governance checks
  - Replayable snapshots and event-log contracts
  - Runtime-registered extension lifecycle
  - Assisted Boot cognition and composition planning
  - Experimental .vast whole-system and subtree export
architecture:
  - Kernel and five core primitives
  - Runtime engine and System layer
  - Domain and extension layers
  - Capability, pattern, platform and operational layers
  - Replaceable hosts and materialized surfaces
lifecycle:
  - VOID and ARCA research lineage
  - Graph-runtime consolidation
  - Kernel and runtime enforcement
  - Extension and VAB integration
  - .vast v1 round-trip validation
  - Electronic Artefacts Genesis remains a future operational threshold
maintainers:
  - id: ea:organization:electronic-artefacts
officialUrl: https://www.vaste.space/
tags:
  - TypeScript
  - Graph Runtime
  - Governed Execution
  - Portability
  - Extensions
  - Assisted Boot
disciplines:
  - Software Architecture
  - Runtime Systems
  - Knowledge Systems
---

## Definition

VASTE is an experimental graph-native runtime for modeling, executing and exposing systems across software, organizations and research domains. Its core vocabulary is deliberately closed: **Vertex, Tie, Action, Surface and Environment**. A System is not a sixth primitive; it is an isolation partition and the structural closure of a root Vertex.

The implementation is active and test-backed, but it is not a stable public distribution or a production security boundary. Electronic Artefacts publishes this record to distinguish what runs today from what is specified, observed or still being researched.

## Why it exists

Conventional applications often split identity, data, permissions, automation and interface state across unrelated stores. Moving the application rarely moves its meaning or governance. VASTE investigates a different foundation: graph structure participates in execution; observers act from a declared location; mutation passes through admitted Actions; and portable structure can be separated from Environment-local authority.

This is not a graph database with an interface added on top, and it is not an operating system for a machine. It is a runtime grammar for systems whose entities, relationships, execution and observation must remain explicit.

## Runtime model

The current architecture orders eleven layers: Kernel; Core Primitives; Runtime Engine; System; Domain; Extensions; Capability; System Patterns; Platform; Operational; Apps. The lower layers know mechanics, not product meaning. Products are assemblies of primitives, extensions, policies and projections. Tests enforce a “Zero Kernel Diff” rule: different assembly families must be possible without changing the kernel.

```text
Apps and replaceable hosts
          ↓
Platform · Operations · System patterns
          ↓
Extensions · capabilities · domain meaning
          ↓
System layer · governed runtime execution
          ↓
Vertex · Tie · Action · Surface · Environment
          ↓
Deterministic kernel mechanics
```

## The five primitives

- **Vertex** is a behaviorless, serializable graph atom with a stable ID, namespaced type, data and System membership.
- **Tie** is an explicit, typed and directed relation. Cross-System ties fail closed unless explicitly declared.
- **Action** is admitted intent: declarative, serializable, replayable and deterministic. It contains no executable code.
- **Surface** is an authorityless membrane for observation and interaction. A projection is one Surface behavior, not canonical truth.
- **Environment** is immutable, ephemeral execution-local context: System, actor claims, scope, location, authority, timing and budgets. It stores no domain state and is rebuilt per execution.

These roles and their tested invariants are expanded in [The Five VASTE Primitives](/knowledge/concepts/vaste-five-primitives/).

In a graph projection, only Vertices and the Ties between them are drawn as graph objects. Extensions are attached to Vertices rather than represented as nodes. Every Vertex is exposed through its own Surface membrane and resolved in a local Environment; selecting that Vertex reveals the Extensions it carries, the Actions that Environment admits and any Vertices contained there. A kernel may be present, but it is optional and is not required at the center of a root Vertex.

## Governed execution

An Action is routed through a registered namespace, resolved against a System and Environment, checked for access and authority, interpreted by the execution engine, then expressed as typed effects. Only the runtime effect layer may mutate canonical state. Execution receipts, event records and replay surfaces make the path inspectable; this does not mean every backend is durable or every external effect is reversible.

Actor identity is extension-owned. A host may transport credentials, but it cannot fabricate a human Actor or default to administrator. Governance can be read from graph state through the Actor registration seam. The current implementation proves important gates; a complete portable trust infrastructure is not yet operational.

## Situated actors

An Actor is a specialized Vertex provided by the Actor extension, not a primitive and not an omniscient account outside the graph. An admitted execution stands in an Environment and may carry a `locationVertexId`. What can be observed or changed depends on System membership, topology, bindings, capabilities and runtime policy.

Identity, declared capability and effective authority are separate. A portable graph may carry identity and governance declarations; a receiving Environment must still resolve local credentials and revalidate authority. See [Situated Actors and Topological Governance](/knowledge/concepts/situated-actors-and-governance/).

## `.vast` portability

The current code defines `vast/1`, an experimental JSON package for a whole System or a contained subtree. Export produces a System-relative canonical form, manifest counts, compatibility metadata, boundary references and a SHA-256 package hash. Import verifies the format and seal before rebinding the structure to a target System ID.

Internal integration tests demonstrate export to disk, import into a fresh runtime under a new System ID, continued canonical Actions, and re-export with the same package hash when no post-import writes occur. A VAB-born System has also been exported and re-imported in an end-to-end test.

A `.vast` package does **not** contain an active Environment, live credentials, local secrets, host processes or automatically valid authority. Signature metadata and extension trust contracts exist, but marketplace-grade verification, isolation, revocation and dependency resolution are not complete security guarantees. Details: [`.vast` Portable Graph Format](/knowledge/concepts/vast-portable-graph-format/).

## VAB — Assisted Boot

VAB is the Assisted Boot orchestration path, not the permanent intelligence of every VASTE System. Its current implementation maintains a boot conversation session, composes cognition from heuristic or configured model-backed input, builds a declarative plan, records explicit assent through a plan hash, resolves extensions and creates a born graph through runtime-owned paths.

The repository contains a web conversation surface, streaming and speech affordances, restart reconciliation, Founding Actor admission and tests linking a born System to `.vast` export. This is substantial implementation, but not yet the full autonomous Genesis and handover protocol. [VAB and Genesis](/knowledge/concepts/vab-and-genesis/) separates the working path from the operational horizon.

## Extension architecture

Extensions own domain actions, bindings, manifests and optional surfaces while the runtime owns routing, execution, effects and lifecycle. The measured repository taxonomy groups extensions into five families: foundational, coordination, knowledge, experience and tooling. Actor, Assets, Knowledge, Workspace, Flow, Intelligence, Perception, Program, Simulation, Studio, Expression and World Model are present at different maturity levels.

The runtime can boot with zero extensions. Install, enable, disable, upgrade and remove actions exist, and installation does not imply exposure. Today, trusted extensions execute in-process. Untrusted third-party code is not a safe boundary until sandboxing and cryptographic verification are enforced. See [VASTE Extension Architecture](/knowledge/concepts/vaste-extension-architecture/).

## Intelligence is optional

Intelligence is an advisory extension and provider boundary, not VASTE itself. The repository includes provider adapters, local and OpenAI-compatible configuration paths, streaming surfaces and readiness checks. Actor, model, provider, policy and Action remain distinct. A model gains no implicit graph authority merely by producing a response.

## Current implementation

The TypeScript workspace contains public contracts, primitive validators, runtime services, in-memory and filesystem stores, system bootstrap and replay, extension packages, web and shell hosts, VAB surfaces, integration tests and dedicated runtime benchmarks. Node.js 22.12 or later is the declared engine. Browser surfaces exist through a Node-hosted web path; this is not evidence that the runtime core is a standalone browser runtime.

## Validation record

The public [VASTE Validation Record](/archive/artefacts/vaste-validation-record/) lists claims with commit, scenario, status and limitations. At the 11 July 2026 review point, the strongest evidence includes:

- primitive invariant and namespace tests;
- graph-derived governance gates;
- atomic runtime mutation and replay checks;
- zero-extension boot and Zero Kernel Diff assembly tests;
- `.vast` whole-System round-trip and VAB-to-package E2E tests;
- boot plan assent sealing and Actor admission checks.

These are internal repository validations available during technical review. They are not independent certification, production uptime evidence or a completed security audit.

## Limits

- The repository is private and VASTE is not a public download or stable SDK.
- `vast/1` is experimental; compatibility and migration policy may still change.
- Untrusted extensions are not safely isolated; signing metadata is not the same as verified trust.
- Durable event-log, distributed execution and multi-Environment operations are incomplete or backend-dependent.
- Benchmarks exist, but this record publishes no general performance number without a reproducible hardware and commit context.
- VAB is implemented as a boot path, but complete autonomous provisioning, rollback and production handover remain incomplete.
- Electronic Artefacts does not yet operate itself as a VASTE System.

## Electronic Artefacts Genesis

The operational goal is to represent Electronic Artefacts through a root System, Founding Actor, governance, registries and operational Surfaces; then use VAB and `.vast` to prepare, inspect and approve a candidate Environment. That would close a deliberate meta-loop:

```text
VASTE boots Electronic Artefacts
→ Electronic Artefacts governs its operations
→ Electronic Artefacts governs VASTE development
→ a candidate System is built and exported
→ structure and authority are revalidated
→ the Founding Actor approves handover
```

This loop is a trajectory, not a demonstrated production capability. The next meaningful threshold is one governed EA Genesis graph completing a documented export, fresh import, local rebinding and human-approved handover without bypassing runtime authority.

## Access

The public [interactive briefing](https://www.vaste.space/) illustrates the strategic direction but currently contains claims that are broader or older than the repository evidence. The canonical factual record is this page and its linked dossiers. Repository walkthroughs and bounded technical reviews are available through [Electronic Artefacts](/contact.html).
