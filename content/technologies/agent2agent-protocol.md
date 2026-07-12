---
id: ea:technology:agent2agent-protocol
type: technology
slug:
  canonical: agent2agent-protocol
  aliases: [a2a-protocol]
title: Agent2Agent Protocol
alternateNames: [A2A]
abstract: Agent2Agent is an open protocol for capability discovery, task coordination and exchange between independent AI agent systems.
description: A canonical guide to A2A agent cards, messages, tasks, artifacts, protocol bindings, security boundaries and its relationship with MCP.
locale: en
visibility: public
publicationClass: canonical
status: experimental
maturity: development
confidence: canonical
version:
  version: 1.0.0
  createdAt: "2026-07-12"
  publishedAt: "2026-07-12"
  modifiedAt: "2026-07-12"
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
category: protocol
roleInEcosystem: A2A provides a reference model for discovering remote agents and coordinating bounded tasks without exposing their internal memory or tools.
officialUrl: https://a2a-protocol.org/latest/specification/
versions: ["0.3.0"]
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
tags: [A2A, AI Agents, Interoperability, Agent Protocols]
disciplines: [Artificial Intelligence, Software Architecture, Distributed Systems]
---

## Role

A2A defines a shared language for independent agent applications. An agent can publish an Agent Card describing capabilities and interaction requirements, receive messages, manage long-running tasks and return artifacts without revealing its private prompt, memory or implementation.

## Boundary

A2A and MCP solve adjacent problems. MCP connects an AI application to context and tools; A2A coordinates work between agent applications. Neither protocol supplies authorization, trustworthy identity or safe autonomy by itself.

## Maturity

The protocol is open and governed through the Linux Foundation, but its interfaces are still evolving. Version 0.3.0 is a development milestone, not a guarantee of universal interoperability.

## Electronic Artefacts use

A2A is relevant to VASTE as a possible edge protocol for exchanging governed tasks between runtimes. VASTE would still own entity identity, permissions, provenance and state transitions.
