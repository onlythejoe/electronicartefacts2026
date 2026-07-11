---
id: ea:publication:prompt-injection-and-trust-boundaries-in-ai-knowledge-systems
type: publication
slug:
  canonical: prompt-injection-and-trust-boundaries-in-ai-knowledge-systems
title: Prompt Injection and Trust Boundaries in AI Knowledge Systems
subtitle: Technical Article
abstract: A security-focused article on prompt injection, retrieved content, tool use, MCP servers, trust boundaries, permissions and graph-aware AI workflows.
description: Understand prompt injection in AI knowledge systems through retrieval, agents, MCP tools, permissions, untrusted content and contextual execution.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-06-25"
  publishedAt: "2026-06-25"
  modifiedAt: "2026-06-25"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:ai-agent
  - id: ea:concept:contextual-execution
  - id: ea:concept:retrieval-augmented-generation
  - id: ea:concept:graph-runtime
  - id: ea:technology:model-context-protocol
claims:
  - Prompt injection is a trust-boundary failure where untrusted content can influence model behavior beyond its authority.
  - AI knowledge systems should treat retrieved pages, archive records and tool responses as data, while policy, permissions and tool authority remain outside the model transcript.
evidence:
  - id: ea:concept:ai-agent
  - id: ea:technology:model-context-protocol
sources:
  - title: OWASP Top 10 for Large Language Model Applications
    publisher: OWASP Foundation
    accessedAt: "2026-06-25"
    url: https://owasp.org/www-project-top-10-for-large-language-model-applications/
  - title: Model Context Protocol Specification
    publisher: Model Context Protocol
    accessedAt: "2026-06-25"
    url: https://modelcontextprotocol.io/specification/2025-06-18
  - title: AI Risk Management Framework
    publisher: National Institute of Standards and Technology
    accessedAt: "2026-06-25"
    url: https://www.nist.gov/itl/ai-risk-management-framework
citation:
  preferred: "Electronic Artefacts. \"Prompt Injection and Trust Boundaries in AI Knowledge Systems.\" Technical article, version 1.0.0, 2026."
tags:
  - Prompt Injection
  - AI Security
  - AI Agents
  - MCP
  - Trust Boundaries
disciplines:
  - Artificial Intelligence
  - Security
  - Knowledge Systems
  - Software Architecture
---

## Problem

AI knowledge systems read documents, retrieve web pages, inspect archives, call tools and sometimes write data. Prompt injection occurs when untrusted content manipulates the model into ignoring boundaries, revealing data, invoking tools or producing misleading output.

The issue is not only malicious prompts from users. Indirect prompt injection can arrive through retrieved pages, comments, PDFs, emails, metadata fields, issue descriptions, transcript text or tool responses. If the system treats all text as instruction, every source becomes a potential command channel.

## Introduction

Prompt injection is one of the defining security problems of language-model applications. OWASP lists prompt injection as a major LLM application risk, alongside insecure output handling, sensitive information disclosure, insecure plugin design and excessive agency.

Knowledge systems are especially exposed because their value comes from reading external or semi-trusted material. A research assistant may retrieve public web pages. An archive assistant may parse contributor notes. A coding agent may inspect repository files. An MCP host may connect to multiple servers that expose resources and tools.

The central design rule is simple: retrieved content is data, not authority. It can inform an answer, but it should not decide permissions, tool access, system instructions or publication policy.

## Architecture

A prompt-injection-resistant architecture separates user intent, system policy, trusted instructions, retrieved evidence, tool authority, permission checks, output validation and audit records. The model may reason over data, but external controls decide what it can access and what actions it can take.

## Trust boundaries

A trust boundary separates content with different authority. System instructions have one authority level. User requests have another. Retrieved documents, public web pages and archive records have lower authority because they may be wrong, malicious, outdated or outside the current task.

A model does not naturally enforce these layers. It receives tokens. The application must structure context and controls so that lower-trust content cannot become higher-trust instruction.

For Electronic Artefacts, a public Knowledge Hub article can explain a concept, but it should not be able to tell an agent to publish a page, read restricted files or ignore validation.

## Direct and indirect injection

Direct injection happens when a user explicitly tells the model to bypass rules. Indirect injection happens when a model reads content that contains adversarial instructions. Indirect injection is more dangerous in retrieval and agent systems because the attacker may control a source that the user never sees.

Examples include a web page that tells an assistant to reveal private context, a PDF that instructs a summarizer to ignore earlier instructions, or a project note that tries to trigger an external send tool.

The mitigation is not to hope that the model can distinguish all attacks. The mitigation is to prevent untrusted content from gaining action authority.

## Retrieval risks

RAG systems place retrieved text into the model context. That text may contain instructions, markup, hidden content, conflicting claims or malicious strings. A naive prompt such as "follow the provided document" creates a vulnerability because the document can redefine the task.

Context assembly should label retrieved content as evidence. It should quote or delimit sources, preserve source identity and state that sources must not be followed as instructions. More importantly, tool access and permissions should be enforced outside the model.

Retrieval filters also matter. If private material is retrieved into a conversation where it is not allowed, prompt-injection defenses after retrieval cannot undo the exposure.

## Tool use

Tool use raises the stakes. A model that can only draft text may be manipulated into a bad answer. A model that can call tools may be manipulated into sending data, modifying records, opening URLs, deleting files or publishing content.

Tool permissions should be narrow, typed and context-aware. A tool should not expose broad shell access when the system only needs relation validation. A read tool should not gain write authority because the model decides it is convenient.

For write actions, require explicit approval and validation. The model can propose an edit. The runtime should check entity IDs, predicates, visibility, actor rights and source requirements before any mutation.

## MCP surfaces

MCP separates hosts, clients, servers, resources, prompts and tools. That separation is useful, but it does not remove injection risk. A resource exposed by an MCP server can contain hostile instructions. A tool exposed by another server can have side effects. A host that composes them carelessly can create a data-to-action bridge.

The host must remain the user's trust surface. It should show which servers are connected, which resources were read and which tools are being requested. It should also enforce permissions even when a model output appears confident.

MCP servers should expose precise capabilities. A graph server can provide `validate_relation` before it provides `write_relation`. A media server can expose read-only metadata before it exposes publishing tools.

## Output handling

Model output is untrusted until validated. If output becomes HTML, SQL, shell commands, JSON patches, graph relations or API input, it needs schema checks and escaping. Insecure output handling turns a text-generation problem into a software exploit.

For knowledge systems, validate citations, IDs, relation predicates, visibility and content policy. A model should not invent a concept ID and have the system accept it because the string looks plausible.

Typed schemas are a security control. They reduce the amount of freeform text that can cross into executable action.

## Excessive agency

Excessive agency appears when a system grants a model more autonomy than the task requires. An assistant that can browse, retrieve private files, edit records and publish pages has a large attack surface. If the task is only to summarize a public article, those powers are unnecessary.

Least privilege applies to agents. Give the model the minimum context and tools needed for the current step. Add review gates before irreversible or external side effects.

Autonomy should be earned by evaluation. A workflow that passes controlled tests can gain limited automation. It should not start with broad authority because the demo is impressive.

## Observability

Prompt injection attempts should be observable. The system should record resource reads, suspicious tool requests, denied actions, policy decisions and validation failures. This helps teams find unsafe sources and improve boundaries.

The transcript is not enough. A model may not report why it requested a tool. The runtime should independently log the resource, tool, actor, approval state and outcome.

Observability also supports accountability. If a public page changes, the team should know whether the change came from a human edit, an AI proposal, a scheduled build or a tool call.

## Graph-aware controls

A knowledge graph can enforce semantic boundaries. It can know that a publication may document a concept, that a project may use a technology, that a restricted entity cannot be linked from a public relation, and that some predicates require evidence.

This gives AI systems less room to improvise structure. A model may propose a relation, but the graph runtime decides whether the relation is valid. A model may request a source, but contextual execution decides whether the actor can read it.

Graph-aware controls turn prompt-injection mitigation into domain architecture, not only prompt wording.

## Electronic Artefacts applications

VASTE should treat prompt injection as a core runtime concern. Any future assistant that reads the Knowledge Hub, edits relations, drafts archive metadata or calls MCP tools should assume that retrieved content is untrusted.

The public site can also model good practice. Articles can cite sources, expose provenance and link entities without turning visible content into executable instructions. The graph remains the authority layer.

For Palimpsests, ORETH and V6, this matters because archives contain heterogeneous material: notes, filenames, captions, transcripts, comments and embedded metadata. All of it can inform interpretation. None of it should silently control tools.

## Implementation

Start by classifying context into authority levels: system policy, developer workflow, user request, trusted internal record, retrieved public source, untrusted external source and model output. Keep those levels visible in prompts and code.

Enforce permissions outside the model. Use allowlisted tools, typed schemas, relation validation, approval gates and output sanitization. For retrieval, apply access control before context assembly and label sources as evidence.

Add telemetry for denied tool calls, validation failures and suspicious source patterns. Review those events regularly and convert recurring failures into tests.

## Evidence

OWASP identifies prompt injection, insecure output handling, sensitive information disclosure, insecure plugin design and excessive agency as major LLM application risks. MCP defines a capability model around resources, prompts and tools, which makes host-side consent and authorization central. NIST AI RMF provides a broader risk-management frame for mapping and managing AI risks.

These sources converge on a practical lesson: language-model behavior must be surrounded by explicit controls.

## Limitations

No prompt can fully solve prompt injection. Model-level defenses, delimiters and refusal instructions help, but the robust controls live in architecture: permissions, validation, tool design, retrieval filtering and human approval.

There is also a usability tradeoff. Too many approval prompts can train users to accept everything. Security controls should be precise enough to matter.

## Related concepts

Read [AI Agent](/knowledge/concepts/ai-agent/), [Contextual Execution](/knowledge/concepts/contextual-execution/), [Retrieval-Augmented Generation](/knowledge/concepts/retrieval-augmented-generation/) and [Graph Runtime](/knowledge/concepts/graph-runtime/).

## Related technology

See [Model Context Protocol](/knowledge/technologies/model-context-protocol/) and [OpenTelemetry](/knowledge/technologies/opentelemetry/).

## Glossary

Prompt injection: an attempt to manipulate a language model through instructions that conflict with system intent.

Indirect prompt injection: prompt injection delivered through retrieved or external content.

Trust boundary: a separation between inputs or components with different authority.

Tool authority: the permission to perform actions outside text generation.

Excessive agency: granting a model more autonomy or tool access than a task requires.

## References

- OWASP Foundation. OWASP Top 10 for Large Language Model Applications.
- Model Context Protocol. Specification. 2025-06-18.
- National Institute of Standards and Technology. AI Risk Management Framework.
