---
id: ea:concept:situated-actors-and-governance
type: concept
slug: { canonical: situated-actors-and-governance }
title: Situated Actors and Topological Governance
definition: In VASTE, an Actor is an extension-owned graph identity whose effective observation and action are resolved inside a specific System, Environment, topology and policy context.
abstract: How VASTE separates identity, credentials, capabilities, policy and effective authority while placing the observer inside the graph.
description: A public account of Actor identity, graph-derived governance, local authority and portable declarations in VASTE.
locale: en
visibility: public
publicationClass: canonical
status: experimental
maturity: development
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [Actor identity, Graph position, Capabilities and policy, Local authority]
exclusions: [Universal administrator, Portable live credentials, Completed decentralized identity stack]
claims:
  - Hosts cannot fabricate a human Actor or silently default to administrator.
  - Effective authority is resolved at execution time rather than implied by identity alone.
tags: [VASTE, Actor, Governance, Identity, Capabilities]
disciplines: [Runtime Systems, Security Architecture]
---

## The observer is inside

VASTE does not assume an omniscient user outside the graph. Actor is an extension-owned specialization represented through graph state, credentials and admitted sessions. An execution occurs in an immutable Environment, inside one System, and may stand at a specific `locationVertexId`. Accessible Surfaces and Actions depend on that situated context.

## Six separate questions

1. **Identity** — which Actor Vertex is being resolved?
2. **Credential** — which local evidence binds the request to that identity?
3. **Capability declaration** — what operation shape may be requested?
4. **Policy** — which rules govern this System and location?
5. **Authority** — which execution boundary may interpret the Action?
6. **Effective authorization** — does this request pass every gate now?

Collapsing these questions into a role string would erase the runtime’s main trust boundaries.

## Graph-derived governance

The runtime contains a graph-authority seam registered by Actor. Governance records may therefore be read from the graph instead of a parallel global role table. System boundaries, containment and explicit Ties influence resolution, but topology does not grant authority by itself. Capabilities and policy checks remain explicit, and typed effect capabilities are enforced separately from permission to invoke a binding.

## Portable governance, local authority

A `.vast` closure may preserve Actor vertices, roles, grants, delegations and governance declarations as graph data. It cannot carry an already admitted session or force the receiving Environment to trust a credential. Import must rebind local identity evidence and revalidate authority. Integrity of a package is not authorization to execute it.

## Current evidence and limits

Internal tests cover Founding Actor admission, credential transport, fail-closed HTTP access, grant/revoke Actions and graph-governance gates. Complete revocation infrastructure, external attestation verification and distributed trust are not claimed as operational.
