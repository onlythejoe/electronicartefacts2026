---
id: ea:publication:a2a-agent-interoperability-and-governed-delegation
type: publication
slug:
  canonical: a2a-agent-interoperability-and-governed-delegation
title: A2A, Agent Interoperability and Governed Delegation
subtitle: Technical Article
abstract: A practical analysis of Agent2Agent protocol, agent discovery, task lifecycles, artifacts and the governance required before independent AI agents can safely delegate work.
description: Understand A2A agent cards, messages, tasks and artifacts, how A2A differs from MCP, and why agent interoperability still needs identity, policy and audit trails.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-07-12"
  publishedAt: "2026-07-12"
  modifiedAt: "2026-07-12"
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:technology:agent2agent-protocol
  - id: ea:technology:model-context-protocol
  - id: ea:concept:ai-agent
  - id: ea:concept:contextual-execution
  - id: ea:concept:provenance
  - id: ea:program:vaste
claims:
  - Agent interoperability is an exchange contract, not proof that delegated work is authorized or correct.
  - Durable delegation requires task identity, scoped authority, provenance and inspectable state transitions around the protocol.
evidence:
  - id: ea:technology:agent2agent-protocol
  - id: ea:concept:contextual-execution
sources:
  - title: Agent2Agent Protocol Specification
    publisher: A2A Protocol Project
    accessedAt: "2026-07-12"
    url: https://a2a-protocol.org/latest/specification/
  - title: Google Cloud donates A2A to Linux Foundation
    publisher: Google for Developers
    publishedAt: "2025-06-23"
    accessedAt: "2026-07-12"
    url: https://developers.googleblog.com/en/google-cloud-donates-a2a-to-linux-foundation/
citation:
  preferred: 'Electronic Artefacts. "A2A, Agent Interoperability and Governed Delegation." Technical article, version 1.0.0, 2026.'
tags: [A2A, AI Agents, Agent Interoperability, Delegation, VASTE]
disciplines: [Artificial Intelligence, Distributed Systems, Software Architecture]
---

## Problem

AI agents are moving from isolated assistants toward systems that assign work to one another. The difficult part is not making two services exchange JSON. It is preserving meaning while different vendors, models and runtimes negotiate capabilities, progress and results.

Agent2Agent, or A2A, addresses that exchange layer. The open protocol describes how an agent advertises capabilities, receives messages, manages a task and returns artifacts. It deliberately allows the remote agent to remain opaque: collaboration should not require access to its private memory, prompt or internal tools.

## Agent Cards and discovery

An Agent Card is the public description of an A2A endpoint. It can identify the agent, its skills, supported interaction modes, endpoint and authentication expectations. This makes discovery machine-readable, but a card is a claim, not an attestation. A client still needs to decide who published it, whether the endpoint is trusted and which declared skills may be used.

Discovery therefore has two layers. The protocol can answer “what does this agent say it can do?” Governance must answer “under which identity and authority may we rely on it?”

## Architecture

A2A distinguishes conversational messages from tasks whose state can evolve over time. That distinction matters for work that pauses, requests more input or produces several outputs. A task may move through states while messages carry instructions or clarification. Artifacts represent deliverables such as text, files or structured data.

The vocabulary is useful because it prevents every integration from inventing its own lifecycle. Yet shared states do not guarantee shared semantics. “Completed” can mean that a remote agent finished execution; it does not prove that the result is true, safe, licensed or fit to publish.

## A2A and MCP

MCP and A2A are complementary. MCP exposes context and tools to an AI application. A2A lets one agent application collaborate with another. An agent may use MCP internally and A2A externally, but the protocols should not be collapsed into one permission model.

The distinction clarifies blast radius. A remote A2A agent should not inherit access to every MCP tool available to the delegating agent. Delegation needs an explicit, narrower capability envelope.

## Implementation

Safe delegation begins with a task contract: objective, input provenance, allowed operations, expected artifact types, expiry, budget and review policy. The contract should bind the requesting actor, remote agent, task and resulting artifacts to stable identifiers.

Every transition should be observable. A durable audit record captures who delegated, which version of the Agent Card was used, what data crossed the boundary, which state changes occurred and which artifact was accepted. Sensitive payloads need minimization; useful auditability does not require retaining every private prompt.

## Implications for VASTE

For VASTE, A2A is best treated as an edge protocol. A VASTE runtime could project a governed capability through an Agent Card, translate an incoming task into typed entities and events, and return an artifact with provenance. The runtime—not the remote protocol—would validate actor rights, relation constraints and publication state.

This yields a practical design rule: interoperability may open a channel, but authority remains local. An agent can propose or perform bounded work; it cannot define the meaning of the graph it enters.

## Evidence

The A2A specification defines Agent Cards, messages, tasks, artifacts and protocol bindings. Its Linux Foundation governance establishes an open project home; it does not remove the need to verify individual implementations and trust policies.

## Limitations

A2A is evolving and adoption does not prove end-to-end compatibility. Authentication, service trust, prompt injection, data residency, cost control and result evaluation remain application responsibilities. Multi-agent architecture also adds failure modes: loops, duplicated work, contradictory outputs and cascading retries.

The protocol is most valuable when it replaces a real integration seam. Adding agent-to-agent delegation where a deterministic API or workflow is enough only increases uncertainty.

## Related reading

Continue with [Model Context Protocol and Tool-Using AI Systems](/publications/model-context-protocol-and-tool-using-ai-systems/), [AI Agents vs AI Workflows](/publications/ai-agents-vs-ai-workflows/) and [Contextual Execution and Graph Runtimes](/publications/contextual-execution-and-graph-runtimes/).

## References

- A2A Protocol Project. Agent2Agent Protocol Specification, latest version accessed 12 July 2026.
- Google for Developers. “Google Cloud donates A2A to Linux Foundation,” 23 June 2025.
