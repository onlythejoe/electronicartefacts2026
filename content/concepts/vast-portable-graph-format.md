---
id: ea:concept:vast-portable-graph-format
type: concept
slug:
  canonical: vast-portable-graph-format
title: .vast Portable Graph Format
definition: A .vast file is an experimental `vast/1` sealed JSON package carrying a System-relative whole-System or subtree closure, its manifest and integrity hash—not a live Environment.
abstract: The implemented .vast export/import model, integrity guarantees, boundary references, tested round-trip and unresolved trust and migration limits.
description: A factual public guide to the experimental VASTE portable graph package format.
locale: en
visibility: public
publicationClass: canonical
status: experimental
maturity: prototype
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [vast/1 package, Canonicalization and integrity, Whole-System and subtree closure, Import rebinding]
exclusions: [Live Environment, Automatic local authority, Production trust certification]
claims:
  - The current implementation round-trips a whole System through a file under a new System ID.
  - The package seal detects content or manifest tampering before import.
tags: [VASTE, Portability, Graph Closure, Integrity]
disciplines: [Runtime Systems, Data Portability]
---

## Implemented meaning

`.vast` is a file convention backed by runtime code, not an acronym expanded by the contracts. The repository does not establish “Vertex Action Surface Tie” as the technical meaning of the name. Version `vast/1` serializes a portable closure in JSON.

The canonical body contains System-relative vertices and ties. The manifest records package ID and version, closure kind and root, vertex and tie counts, compatibility, boundary references and a SHA-256 `packageHash`. Stable canonicalization makes identity independent from the target System ID.

## Two closure forms

- **System closure** exports the complete structural partition, including its root Vertex.
- **Subtree closure** follows containment from an anchor. Ties crossing the selected boundary must be refused or externalized as declared references; they cannot be silently copied.

## Verified round-trip

The internal round-trip scenario is concrete:

```text
export System A → write .vast JSON → read and verify
→ import into a fresh runtime as System B
→ execute a canonical Action
→ re-export an untouched import
→ compare packageHash
```

Tests verify identical sealed identity before subsequent writes, continued runtime execution after import, rejection of unsupported format versions, tamper rejection and collision failure. Another E2E scenario exports a VAB-born production graph and a lived-in Workspace subtree.

## Portable versus local

Portable: graph identity relative to the package, Vertex/Tie data, structural closure, manifest, provenance declarations, compatibility and boundary references.

Local: active Environment, credentials, secrets, processes, filesystem placement, provider configuration, resource grants and effective authority. These must be resolved or revalidated on arrival.

## Limits

`vast/1` is experimental. A package hash provides integrity, not author trust. Signature and provenance structures are not yet a marketplace-grade verification chain. Multi-package mounting, atomic upgrade, migrations, resource limits and hostile-input hardening are not presented as released guarantees. Current tests are internal repository validation, not independent certification.
