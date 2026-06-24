---
id: ea:publication:model-context-protocol-and-tool-using-ai-systems
type: publication
slug:
  canonical: model-context-protocol-and-tool-using-ai-systems
title: Model Context Protocol and Tool-Using AI Systems
subtitle: Technical Article
abstract: A practical explanation of MCP as an integration protocol for resources, prompts, tools, consent, host boundaries and graph-scoped AI workflows.
description: Understand Model Context Protocol through hosts, clients, servers, resources, prompts, tools, security boundaries and contextual execution.
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
  - id: ea:technology:model-context-protocol
  - id: ea:concept:ai-agent
  - id: ea:concept:contextual-execution
  - id: ea:concept:graph-runtime
  - id: ea:program:vaste
claims:
  - MCP is best understood as a context and capability protocol, not as agent autonomy by itself.
  - Tool-using AI systems need explicit host boundaries, consent, authorization and context scoping before tools become useful infrastructure.
evidence:
  - id: ea:technology:model-context-protocol
  - id: ea:concept:contextual-execution
sources:
  - title: Model Context Protocol Specification
    publisher: Model Context Protocol
    accessedAt: "2026-06-24"
    url: https://modelcontextprotocol.io/specification/2025-06-18
  - title: JSON-RPC 2.0 Specification
    publisher: JSON-RPC Working Group
    accessedAt: "2026-06-24"
    url: https://www.jsonrpc.org/specification
  - title: Language Server Protocol Specification
    publisher: Microsoft
    accessedAt: "2026-06-24"
    url: https://microsoft.github.io/language-server-protocol/
citation:
  preferred: "Electronic Artefacts. \"Model Context Protocol and Tool-Using AI Systems.\" Technical article, version 1.0.0, 2026."
tags:
  - Model Context Protocol
  - AI Agents
  - Tool Use
  - Contextual Execution
  - VASTE
disciplines:
  - Artificial Intelligence
  - Software Architecture
  - Systems Design
---

## Problem

Language-model applications increasingly need access to files, databases, tools, prompts and external services. Without a shared protocol, each integration becomes a custom bridge with unclear permissions, inconsistent context exposure and brittle assumptions about what a model is allowed to do.

## Introduction

Model Context Protocol, usually shortened to MCP, standardizes how an AI host can connect to servers that expose context and capabilities. A host might be a desktop assistant, coding environment, chat interface or workflow engine. A server might expose project files, issue trackers, search indexes, media metadata, graph records or actions such as rendering a document.

The important shift is architectural. MCP does not make a model autonomous by itself. It gives the surrounding application a structured way to discover and invoke resources, prompts and tools. Autonomy, review, permission and memory still belong to the host and application design.

That distinction matters for Electronic Artefacts. VASTE is concerned with graph runtimes, context boundaries, identity, relations and event propagation. MCP can become one way to expose graph-scoped capabilities to model interfaces, but it should not bypass the graph's own authority model.

## Architecture

An MCP architecture contains a user-facing host, one or more clients, external servers, declared resources, reusable prompts, executable tools, approval controls and audit records. The protocol coordinates capability discovery and invocation; the host remains responsible for consent, policy and user-visible behavior.

## Hosts, clients and servers

The MCP specification describes communication between hosts, clients and servers. The host is the application that the user experiences. A client is the connector inside that host. A server provides capabilities and context.

This separation gives each layer a clear responsibility. The server describes what it can provide. The client manages the connection. The host decides how the user grants access and how model outputs are interpreted.

In practice, the host is the trust boundary users understand. If a server exposes a file system or publishing action, the user should not need to reason about raw protocol messages. The host should make data access and tool invocation visible enough to approve, deny and audit.

## Resources

Resources are contextual data exposed by a server. They can represent files, documents, database rows, graph neighborhoods, archive records, search results or any structured content that the model may use.

For a knowledge system, resources are more than text blobs. A resource should preserve identity, title, source, visibility, modification time and relevant relations. A model reading an archive record should know whether it is public, restricted, provisional or canonical.

This is where MCP fits Electronic Artefacts better than generic copy-paste prompting. A VASTE-backed MCP server could expose only the resources allowed by a user's role and the current task. The model receives relevant context without receiving the whole private graph.

## Prompts

Prompts in MCP are reusable interaction patterns. A server can offer a structured prompt for summarizing an artefact, drafting metadata, reviewing a relation or comparing two sources.

Treating prompts as server-provided capabilities helps a team version important workflows. Instead of every user improvising a metadata prompt, the system can expose a named prompt that encodes editorial standards and expected output structure.

Prompts are not neutral. They carry assumptions about role, evidence, tone and success criteria. They should be reviewed like product behavior. For Electronic Artefacts, prompts that touch public knowledge should point back to claims, sources and entity identifiers rather than free-floating prose.

## Tools

Tools are executable functions. They may search, transform, create, update, render, send, schedule or publish. This is where value and risk both increase.

A tool description is not a security guarantee. A host must treat tool metadata as untrusted unless the server and deployment are trusted. Users should be able to inspect what a tool does before granting access. Sensitive tools should require explicit confirmation, especially when they write, publish or call external systems.

Tool design should prefer narrow operations with typed inputs over broad commands. A tool named `create_relation` with a fixed schema is easier to authorize and audit than a tool named `run_shell_command`.

## Consent and control

MCP's security guidance emphasizes user consent, data privacy, tool safety and controls around model sampling. These are not optional interface details. They are core architecture.

Consent should be specific enough to matter. "Allow access to your data" is weaker than "allow this server to read public Knowledge Hub entities for this conversation." A write action should distinguish draft creation, internal mutation and public publication.

Control also means revocation and inspection. A user should know which servers are connected, which resources were read, which tools were called and what result each call returned.

## Contextual execution

Contextual execution means that action depends on entity identity, actor, relation, visibility, policy and current task. MCP can carry context, but it does not define the domain semantics for that context.

For VASTE, a relation-editing tool should not merely accept subject, predicate and object. It should know whether the actor can create that relation, whether the object is public, whether the predicate is allowed between those entity types and whether the proposed statement has evidence.

The protocol is a transport and capability layer. The graph runtime remains responsible for deciding what an action means.

## Agent workflows

MCP is often discussed in the same breath as AI agents. The more precise framing is that MCP gives agents and workflows a standard way to connect to capabilities.

An agent might use MCP to retrieve a project brief, call a search tool, draft a metadata update and ask for human approval. A workflow might use the same tools in a deterministic sequence without claiming autonomy. The protocol supports both.

This distinction protects system design. If the task needs repeatability, a workflow may be safer. If the task needs exploration across uncertain paths, an agent may be appropriate. MCP should not force one execution model.

## Observability

Tool-using systems need telemetry. Each request should record which server was used, which resource was read, which tool was invoked, how long it took, whether it failed and which user approved it.

The logs should avoid retaining sensitive prompt content by default. They should preserve enough metadata to reconstruct operational behavior and investigate errors.

For graph systems, telemetry should include entity IDs and relation types where safe. A trace that says "tool call failed" is less useful than one that says "relation validation failed for publication to technology relation under public visibility."

## Security

The main MCP risk is not the protocol syntax. It is capability composition. A model that can read private data and call an external sending tool may exfiltrate information if the host does not enforce boundaries.

Prompt injection increases that risk. A resource can contain text that tells the model to ignore prior instructions or call a tool. The host must treat resource content as data, not as authority.

Tool permissions should be scoped by server, operation, user, conversation and data class. A read-only research server should not gain write permissions because another connected server provides a publishing tool.

## MCP and VASTE

VASTE can treat MCP as one interface to the runtime, not the runtime itself. A VASTE MCP server might expose public entity lookup, relation validation, graph neighborhood retrieval, archive drafting and controlled projection rebuilds.

The graph supplies identity and policy. MCP supplies a connection model. OpenTelemetry can supply observability. Human review supplies governance.

This combination is stronger than a generic assistant because actions remain grounded in typed entities and public contracts.

## Implementation

Start with one read-only MCP server. Expose a small set of resources from the public Knowledge Hub, such as entity lookup and graph neighborhoods. Add one harmless tool, such as validating a draft relation without writing it. Require explicit approval before any write tool is introduced.

Define resource visibility, tool schemas, audit events and telemetry before adding more servers. Treat every prompt, resource and tool response as untrusted input unless it comes from a trusted internal source and still passes validation.

## Evidence

The MCP specification defines hosts, clients, servers, resources, prompts and tools over JSON-RPC style communication. Its own security section highlights user consent, privacy, tool safety and controls around model-initiated sampling.

## Electronic Artefacts implications

MCP is interesting for Electronic Artefacts because it gives AI systems a practical boundary between model reasoning and executable studio infrastructure. It could connect the Knowledge Hub, VASTE, archive records, project metadata and local tools without collapsing everything into one opaque assistant.

The durable design principle is simple: the model may propose and invoke capabilities, but the graph runtime should decide identity, context and permission.

## Limitations

MCP does not solve prompt injection, authorization, observability, schema design or user-interface consent by itself. It gives implementers a protocol surface where those responsibilities can be expressed.

## Related concepts

Read [AI Agent](/knowledge/concepts/ai-agent/), [Contextual Execution](/knowledge/concepts/contextual-execution/), [Graph Runtime](/knowledge/concepts/graph-runtime/) and [Event-Driven Architecture](/knowledge/concepts/event-driven-architecture/).

## Related technology

See [Model Context Protocol](/knowledge/technologies/model-context-protocol/) and [OpenTelemetry](/knowledge/technologies/opentelemetry/).

## Glossary

Host: the user-facing language-model application.

Server: a service that exposes resources, prompts or tools.

Resource: contextual data made available to the model.

Tool: an executable capability that may perform work outside the model.

Sampling: a server-initiated request for model generation controlled by the host.

## References

- Model Context Protocol. Specification. 2025-06-18.
- JSON-RPC Working Group. JSON-RPC 2.0 Specification.
- Microsoft. Language Server Protocol Specification.
