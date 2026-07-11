# VASTE public surfaces alignment audit

Reviewed: 2026-07-11  
Repository baseline: `onlythejoe/VASTE` at `a51c9897`  
Site branch: `codex/vaste-complete-public-record`

## Method

This audit compared the VASTE runtime contracts, implementation, integration tests, current architecture documents, recent Git history, the existing Electronic Artefacts records and the public `vaste.space` briefing. Uncommitted VASTE mount work was inspected as emerging context but excluded from publishable validated claims.

The publication scale used was: Historical, Conceptual, Specified, Partially implemented, Implemented, Observed, Validated, Operational, Released, Deprecated.

## Reconciliation matrix

| Subject | Code | Tests | Docs | Previous public surface | Real status | Publishable treatment |
| --- | --- | --- | --- | --- | --- | --- |
| Five primitives | Contracts and validators | Extensive invariant tests | Canonical doctrine | Mentioned, with inconsistent `Actions` naming | Validated | Canonical roster and boundaries |
| System/root/partition | Root Vertex and System registry | Bootstrap, creation, containment | Recently clarified | Largely absent | Validated | System is not a sixth primitive |
| Governed Actions | Router, execution engine, effect layer | Authority, atomicity and replay tests | Strong | Simplified “events” language | Validated | Explain admitted intent → typed effects |
| Situated Actor | Actor extension, admission and credentials | HTTP fail-closed, founding and grants | Strong | Implied super-admin demo Actor | Validated core, partial wider trust | Separate identity, credential and authority |
| Graph governance | Runtime graph-authority seam | Gate tests | Recent | Broad “security” claims | Validated seam | No blanket security guarantee |
| Extensions | Manifests, registration and lifecycle | Packaging, identity, lifecycle, coupling | Measured five-family taxonomy | Native/premium commercial taxonomy | Mixed maturity | Architectural families, not pricing tiers |
| Intelligence | Provider and Surface paths | Adapter/readiness coverage | Active | Presented as graph-resident capability | Partially implemented | Optional advisory extension |
| VAB | Conversation, cognition, assent and web Surface | Boot, restart, Actor and plan-seal tests | Recent | Simplified four-step hosted path | Implemented/validated path | Not permanent assistant or full handover |
| `.vast` v1 | Writer, reader, canonicalization and import | Disk round-trip and VAB E2E | Current doctrine | Absent | Experimental, validated prototype | Publish exact guarantees and exclusions |
| Child-System mount | Local uncommitted implementation | Local uncommitted tests | Local audit | Absent | Emerging/uncommitted | Excluded from validated claims |
| Replay/event log | Snapshot and replay paths; backend contracts | Multiple proof/replay tests | Mixed backend qualifications | “deterministic events, state, replay” | Validated scenarios, not universal durability | Qualify by backend |
| Benchmarks | Dedicated harnesses | Benchmark suites | Commands documented | “full speed” | Observed tooling | Publish no general number |
| Raspberry Pi | No current CI/platform proof found in reviewed branch | No current public reproduction record found | Older/public claim only | “Validated Raspberry” | Unverified in this review | Remove from canonical record |
| 1,800+ tests | Test suite exists | Count not established as stable public metric | Public briefing only | “1,800+ tests green” | Snapshot claim, not reproduced here | Replace with named scenarios |
| Marketplace security | Contracts for provenance/signatures/sandbox | Partial structural tests | Explicitly future | Commercial extension language | Specified/partial | State in-process trust limit |
| Electronic Artefacts Genesis | Concepts and reusable runtime pieces | No complete operational handover test | Trajectory | Not explained | Conceptual/partial | Publish as threshold, not capability |

## Priority divergences on `vaste.space`

### P0 — factual alignment

- “Kernel stable, pure, and frozen” is stronger than a repository in active architectural change. Use “kernel purity is enforced by tests; public API stability is not released.”
- “Raspberry validated”, “benchmarks running at full speed” and “1,800+ tests green” lack a current, reproducible public record with machine, command and commit. Replace them with named validation scenarios.
- Workspace, Actor, Asset, Knowledge, Surface, Security, Realtime, Analytics and Collaboration are presented as uniformly native and validated. The repository instead distinguishes primitives, extensions, runtime machinery and mixed implementation maturity.
- Pricing, hosted cloud and premium capacities are directional product propositions, not released runtime capabilities.

### P1 — architecture update

- Add `.vast`, System-relative canonicalization, closure boundaries and local rebinding.
- Add VAB assent sealing and its current E2E relationship to `.vast`.
- Replace the substrate/runtime/orchestration diagram with the canonical eleven-layer order or a faithful simplification.
- Explain System as partition plus root closure and Actor as an extension-owned situated identity.
- Separate Surface membrane, SurfaceSpec, Workspace projection and host materialization.

### P2 — transparency

- Add explicit current limits: private repository, experimental format, in-process extension trust, incomplete distributed/multi-Environment operations, no complete EA Genesis handover.
- Link the Electronic Artefacts validation record as the factual source of evidence.
- Mark long-term infrastructure sectors as research horizon rather than implied deployment capability.

## Electronic Artefacts corrections

The former VASTE record reduced the runtime to addressable entities, typed relationships, contextual identity and event propagation, with a generic 2027 delivery target. It omitted the closed primitive roster, System boundary, effect-owned mutation, VAB, `.vast`, extension lifecycle, graph-derived governance and concrete validation scenarios. Version 2.0 replaces the calendar promise with operational thresholds and evidence.

Legacy browser data in `assets/js/app.js` still contains older “future platform / 2027” copy. It belongs to the legacy runtime dataset, not the canonical content pipeline. A later cleanup should migrate or remove those records without conflating generated source content and compatibility data.

## Single next operation

Build one minimal Electronic Artefacts Genesis System through VAB, export it as `.vast`, import it into a clean candidate runtime, rebind the Founding Actor locally, execute one governed operation, and record human-approved handover evidence. This single operation tests the entire public trajectory without claiming a production platform prematurely.
