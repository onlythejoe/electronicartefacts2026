---
id: ea:artefact:vaste-validation-record
type: artefact
slug: { canonical: vaste-validation-record }
title: VASTE Validation Record
subtitle: Repository evidence reviewed 11 July 2026
abstract: A public, limitation-aware registry of VASTE claims backed by internal contracts, implementation and automated tests at repository commit a51c9897.
description: Evidence for VASTE primitives, governed execution, extensions, Assisted Boot and .vast portability, with explicit limits.
locale: en
visibility: public
publicationClass: published
status: active
maturity: development
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
artefactType: document
createdAt: "2026-07-11"
provenance: Internal VASTE repository review at commit a51c9897 on branch codex/vaiste-audit-simulation-isolation; uncommitted mount work excluded from published claims.
format: Public evidence register
preservationStatus: active
significance: It separates implemented and tested runtime properties from specifications, observations and operational aspirations.
tags: [VASTE, Evidence, Validation, Runtime]
disciplines: [Software Verification, Runtime Systems]
---

## Reading status

“Validated” means an automated internal repository scenario exists and its code was inspected during this review. It does not mean independent certification, production operation or security assurance. Repository access is available during a bounded technical review.

## Evidence register

| ID | Claim | Repository evidence | Status | Limit |
| --- | --- | --- | --- | --- |
| VST-PRIM-01 | The primitive roster is Vertex, Tie, Action, Surface, Environment. | `packages/contracts/src/primitives.ts`; `src/primitives/*`; kernel-purity tests | Validated | Ontology can still evolve through explicit doctrine revision. |
| VST-EXEC-01 | Actions contain admitted intent; runtime applies typed effects. | action validators; execution and effects paths; transaction tests | Validated | External side effects are not universally reversible. |
| VST-GOV-01 | Human access fails closed and graph governance participates in authorization. | Actor admission, HTTP transport and graph-governance gate tests | Validated | Not a complete decentralized trust system. |
| VST-EXT-01 | Core runtime boots with zero extensions; lifecycle is System-scoped. | zero-kernel-diff, extension lifecycle and packaging tests | Validated | Untrusted code still lacks production isolation. |
| VST-VAST-01 | `vast/1` round-trips a System through disk under a different System ID with stable sealed identity. | `vast-package-roundtrip.test.ts`; commits b3ca7d1d and 13b16c6e | Validated | Experimental format; no public compatibility commitment. |
| VST-VAST-02 | Subtree export declares or refuses boundary references. | `vast-package-vab-e2e.test.ts` | Validated | General multi-package mount is not published as complete. |
| VST-VAB-01 | A boot plan is bound to explicit assent by content hash. | `boot-plan-assent-seal.test.ts`; commit cb2d567c | Validated | Human-understanding quality remains an active research area. |
| VST-VAB-02 | A VAB-born System can become a `.vast` file and re-enter a fresh runtime. | `vast-package-vab-e2e.test.ts`; commit 13b16c6e | Validated | Not the complete EA Genesis handover. |
| VST-REPLAY-01 | Runtime snapshots and event records support deterministic reconstruction scenarios. | snapshot, replay and proof-chain integration tests | Validated | Durable backend guarantees depend on deployment. |
| VST-PERF-01 | Dedicated scaling, soak and containment benchmarks exist. | benchmark scripts and benchmark tests | Observed | No general performance number published without reproducible machine metadata. |

## Excluded from claims

The working tree contained uncommitted `.vast` mount changes during review. They were inspected only as emerging work and are excluded from validated public claims. Likewise, contracts for sandboxing, signatures, trust tiers and federation are not described as operational enforcement unless a runtime path and test prove them.

## Reproduction frame

Repository: `onlythejoe/VASTE` (private). Reviewed commit: `a51c9897`. Declared engine: Node.js 22.12+. Primary gates: typecheck, test shards, runtime scaling smoke and module-vocabulary check. Exact results from this publication branch are recorded in the accompanying site audit, not inferred from old benchmark copy.
