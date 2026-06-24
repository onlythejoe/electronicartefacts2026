---
id: ea:publication:observability-for-ai-agents-and-tool-calling-systems
type: publication
slug:
  canonical: observability-for-ai-agents-and-tool-calling-systems
title: Observability for AI Agents and Tool-Calling Systems
subtitle: Technical Article
abstract: A practical explanation of telemetry for AI agents, tool calls, traces, events, approvals, failures, evaluations and graph-runtime accountability.
description: Understand observability for AI agents and tool-calling systems through traces, metrics, logs, audit events and OpenTelemetry.
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
  - id: ea:technology:opentelemetry
  - id: ea:technology:model-context-protocol
  - id: ea:concept:ai-agent
  - id: ea:concept:event-driven-architecture
  - id: ea:concept:contextual-execution
claims:
  - AI agents require observability across model calls, tool calls, approvals, retrieved context and external side effects.
  - Agent telemetry should record operational behavior and accountability metadata without storing sensitive prompts or private content by default.
evidence:
  - id: ea:technology:opentelemetry
  - id: ea:technology:model-context-protocol
sources:
  - title: OpenTelemetry Semantic Conventions 1.42.0
    publisher: OpenTelemetry
    accessedAt: "2026-06-24"
    url: https://opentelemetry.io/docs/specs/semconv/
  - title: Model Context Protocol Specification
    publisher: Model Context Protocol
    accessedAt: "2026-06-24"
    url: https://modelcontextprotocol.io/specification/2025-06-18
  - title: CloudEvents
    publisher: Cloud Native Computing Foundation
    accessedAt: "2026-06-24"
    url: https://cloudevents.io/
citation:
  preferred: "Electronic Artefacts. \"Observability for AI Agents and Tool-Calling Systems.\" Technical article, version 1.0.0, 2026."
tags:
  - Observability
  - AI Agents
  - Tool Calling
  - OpenTelemetry
  - Tracing
disciplines:
  - Artificial Intelligence
  - Software Architecture
  - Systems Design
  - Distributed Systems
---

## Problem

AI agents and tool-calling workflows can read context, call tools, write data and trigger external side effects. Without observability, teams cannot reconstruct what happened, explain failures, enforce consent or improve reliability.

## Introduction

Observability is the ability to understand a system's behavior from its emitted signals. In conventional distributed systems, those signals include traces, metrics, logs and events. In AI systems, the problem expands: model calls, retrieved context, tool calls, approvals, refusals, retries and generated outputs all affect behavior.

An AI agent is not just a model response. It is a runtime path through prompts, resources, tools and decisions. A failed publication draft may involve retrieval errors, schema mismatch, a tool timeout, missing authorization or a hallucinated identifier. A normal log line saying "request failed" is not enough.

OpenTelemetry provides a useful reference point because it standardizes telemetry concepts and semantic conventions. MCP provides a useful capability surface because tools and resources have names, servers and structured calls. Together, they point toward accountable AI infrastructure.

## Architecture

An observable AI-agent architecture contains a user request, retrieval layer, model calls, tool calls, validation, approval gates, side effects, traces, metrics, logs and durable audit events. The runtime should emit enough structured telemetry to reconstruct behavior without storing sensitive prompts or private documents by default.

## Traces

A trace records a flow of work across components. It is made of spans, where each span represents a timed operation. For AI systems, useful spans include user request, retrieval, model call, tool selection, tool call, validation, approval and write operation.

Tracing helps answer sequence questions. Did the model call the tool before or after retrieval? Which server handled the request? How long did the embedding search take? Which validation rule failed?

A trace should include stable identifiers without exposing sensitive content by default. Entity IDs, tool names, server names, model identifiers, status codes and durations are often enough for operations. Full prompts and outputs require stricter retention policy.

## Metrics

Metrics describe aggregated behavior. For tool-calling systems, track request count, error rate, latency, tool-call count, approval rate, rejection rate, retry count, token use, cost, queue depth and stale projection age.

Domain metrics are just as important as infrastructure metrics. If an archive-assistance agent creates many metadata drafts but none are approved, the system is not succeeding. If a graph assistant repeatedly proposes invalid predicates, the model or prompt needs adjustment.

Metrics should distinguish model failure, tool failure, validation failure and user rejection. These are different causes with different fixes.

## Logs

Logs provide discrete records. They are useful for human investigation, but dangerous when they capture too much. AI systems can leak private user text, source documents or credentials into logs if logging is careless.

Log structure matters. A log event should include request ID, user or actor reference, server, tool, entity ID, outcome and error class. Freeform logs make incidents harder to search and easier to over-collect.

Sensitive content should be redacted or omitted by default. If a debugging mode captures prompts, it should be explicit, temporary and protected.

## Events

Events record meaningful state changes. In an agentic system, useful audit events include `ToolCallRequested`, `ToolCallApproved`, `ToolCallDenied`, `ResourceRead`, `DraftCreated`, `ValidationFailed` and `PublicationQueued`.

Events differ from traces. A trace helps debug flow. An event can become part of durable accountability. A rejected write proposal may matter months later if a public page changes.

CloudEvents or a similar envelope can help standardize event identity, type, source and time. The domain payload should still be designed carefully.

## Tool-call telemetry

Every tool call should be observable as a first-class operation. Record tool name, server, input schema version, actor, approval status, start time, end time, result class and side-effect class.

Do not rely on the model transcript as the audit log. The transcript may be summarized, hidden, pruned or unavailable. The runtime should independently record the tool call.

For write tools, record the target entity and before-after references where appropriate. For external calls, record destination class and idempotency key if one exists.

## Retrieval telemetry

Retrieval affects model output. A bad answer may come from wrong sources rather than bad generation. Observability should capture which index was queried, which filters applied, which documents or entities were returned and whether access controls were enforced.

For a knowledge graph, retrieval telemetry should include entity IDs and relation scopes. It should not dump full private documents into traces.

When a user challenges an answer, the system should be able to reconstruct which sources were presented to the model.

## Approval and consent

User approvals are operational facts. If a tool sends an email, publishes a page, modifies a graph relation or shares data, the system should record who approved the action and what they approved.

Consent should be specific. Observability should distinguish automatic reads, user-approved reads, draft writes and public publishing. This is especially important for MCP-style systems where multiple servers may expose different capabilities.

Approval records should be readable by humans. A future reviewer should not have to decode raw JSON to understand the decision.

## Evaluation

Observability and evaluation reinforce each other. Traces reveal where a system fails. Evaluations test whether those failures are improving.

An agent should be evaluated on task outcomes, not only model responses. Did it use allowed tools? Did it cite correct sources? Did it avoid restricted data? Did it produce a valid draft? Did a human approve it?

Evaluation data should be versioned with model, prompt, retrieval index and tool definitions. Otherwise, improvements cannot be explained.

## Prompt injection

Prompt injection is an observability problem as well as a security problem. A malicious resource may cause a model to request an unsafe tool call. The system should record the resource read, the tool request and the policy decision.

Detection is not enough. The host should prevent unsafe composition, and telemetry should make attempts visible. If many retrieved pages trigger suspicious tool requests, the retrieval or prompt boundary needs work.

For Electronic Artefacts, public knowledge pages can be treated as sources, not instructions. Their content should not gain authority over tools.

## Privacy

AI telemetry can become a shadow archive of private work. Prompts may contain unreleased projects, personal notes, credentials or client material. Outputs may contain transformed sensitive data.

The default should be metadata-first observability. Capture structure, IDs, timings, outcomes and policy decisions. Capture full content only under explicit debugging controls and with retention limits.

Privacy also includes model-provider visibility. If a hosted model is used, observability should record that the request left local infrastructure.

## OpenTelemetry

OpenTelemetry provides common concepts for spans, metrics, logs and semantic attributes. Its value is not only library instrumentation. It gives teams shared vocabulary for what a system emits.

AI-specific semantic conventions are evolving, including work around generative AI and MCP. Even when a project does not adopt every convention, it can follow the same principle: consistent names, stable attributes and clear boundaries.

Using OpenTelemetry also allows AI systems to be observed alongside non-AI systems. A tool call that writes a database row should appear in the same operational universe as any other service call.

## VASTE and graph runtimes

VASTE can add graph semantics to observability. A trace can include entity IDs, predicates, projection names and policy contexts. An audit event can say which graph relation was proposed and which validation rule accepted or rejected it.

This is stronger than generic AI logging because it connects runtime behavior to semantic structure. The system can ask not only "which tool failed" but "which kind of knowledge operation failed."

Graph-aware observability also supports public trust. If a public page was generated from a graph projection, the system should know which records and build events contributed.

## Implementation

Start by instrumenting one tool-using workflow end to end. Create a trace for the user request, spans for retrieval, model call, validation and tool call, metrics for latency and error rate, and audit events for approval and mutation.

Define a redaction policy before collecting content. Store model identifier, prompt template version, tool schema version and target entity IDs. Review telemetry output with the same seriousness as user-facing data.

## Evidence

OpenTelemetry defines shared telemetry semantics for traces, metrics, logs and attributes. MCP defines a capability model around resources, prompts and tools. CloudEvents provides a useful event-envelope reference for durable audit events.

## Electronic Artefacts implications

Observability is essential if Electronic Artefacts connects AI systems to VASTE, archive records or publishing workflows. It protects reliability, editorial accountability and user consent.

The practical principle is to observe behavior without silently hoarding content. A system should know what happened, who authorized it and which entity changed, while keeping private material out of default telemetry.

## Limitations

Telemetry can create cost, noise and privacy risk. More logs do not automatically produce better understanding. Instrumentation should be designed around questions the team needs to answer.

## Related concepts

Read [AI Agent](/knowledge/concepts/ai-agent/), [Event-Driven Architecture](/knowledge/concepts/event-driven-architecture/), [Contextual Execution](/knowledge/concepts/contextual-execution/) and [Provenance](/knowledge/concepts/provenance/).

## Related technology

See [OpenTelemetry](/knowledge/technologies/opentelemetry/), [Model Context Protocol](/knowledge/technologies/model-context-protocol/) and [CloudEvents](/knowledge/technologies/cloudevents/).

## Glossary

Trace: a linked record of a request or workflow across components.

Span: a timed operation inside a trace.

Metric: an aggregated measurement such as latency, count or error rate.

Audit event: a durable record of a meaningful action or decision.

Redaction: removing sensitive content before storage or display.

## References

- OpenTelemetry. Semantic Conventions 1.42.0.
- Model Context Protocol. Specification. 2025-06-18.
- Cloud Native Computing Foundation. CloudEvents.
