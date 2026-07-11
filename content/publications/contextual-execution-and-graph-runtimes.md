---
id: ea:publication:contextual-execution-and-graph-runtimes
type: publication
slug:
  canonical: contextual-execution-and-graph-runtimes
title: Contextual Execution and Graph Runtimes
subtitle: Technical Article
abstract: This article explains contextual execution as a runtime principle for systems where identity, relations, permissions and state influence what operations can occur.
description: A technical article connecting contextual execution, graph runtime, Runtime Theory and VASTE.
locale: en
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-06-23"
  publishedAt: "2026-06-23"
  modifiedAt: "2026-06-23"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:contextual-execution
  - id: ea:concept:graph-runtime
  - id: ea:researchField:runtime-theory
  - id: ea:program:vaste
  - id: ea:concept:entity-identity
claims:
  - A graph runtime becomes operationally meaningful when relations and identity affect execution rather than only description.
  - Context should be explicit when it determines permissions, visibility, propagation or interpretation.
evidence:
  - id: ea:program:vaste
  - id: ea:researchField:runtime-theory
citation:
  preferred: "Electronic Artefacts. \"Contextual Execution and Graph Runtimes.\" Technical article, version 1.0.0, 2026."
tags:
  - Contextual Execution
  - Graph Runtime
  - Runtime Theory
  - VASTE
  - Systems Design
disciplines:
  - Systems Design
  - Programming
  - Knowledge Systems
  - Software Architecture
---

## Problem

Software often treats context as a secondary concern. A function receives inputs, performs logic and returns output. Permissions, identity, relation state, publication status, provenance and visibility may be checked somewhere else. This can work for small systems, but it becomes fragile when the meaning of an operation depends on where it happens in a graph.

Consider a cultural knowledge platform. A user may edit a record, publish a note, create a relation, cite a source or expose an archive item. Each action depends on context. Who is the actor? Which organization owns the record? Is the record public, internal or archived? Is the relation allowed? Does publishing this record expose a restricted entity? Is the article canonical or speculative? Should the change update search, JSON-LD and local graph views?

When those questions are hidden inside scattered application code, the system becomes difficult to reason about. Contextual execution makes the context explicit.

## Introduction

Contextual execution is the practice of making identity, state, permissions, relationships and operating context active constraints on what a system can do. It is a runtime principle rather than only a metadata label.

A graph runtime extends this idea. It treats addressable entities and typed relationships as part of execution. A relation is not just a link to render. It can constrain propagation, validate allowed operations, expose evidence or determine visibility.

Within Electronic Artefacts, this concept connects Runtime Theory and VASTE. Runtime Theory asks what is minimally necessary for a universe of entities to execute events coherently. VASTE explores how graph identity, typed relations and contextual execution can become system architecture.

## Context

Many systems already contain implicit context. A CMS has authors, drafts, roles and statuses. A database has foreign keys. An operating system has users and permissions. A workflow engine has states and transitions.

The difference in a graph runtime is that context can be modeled around entities and relations rather than only tables or pages. A project can apply a concept. A publication can document a field. A program can power a platform. Those relationships can affect what gets rendered, indexed, cited or exposed.

## History

Contextual execution belongs to a long family of ideas: operating systems with permissions, object systems with message passing, workflow engines, rule engines, actor models, state machines, knowledge graphs and semantic web systems. It also has conceptual links to cybernetics, because feedback depends on state information re-entering system behavior.

Electronic Artefacts frames the topic through graph runtime because the site and its programs need to combine knowledge representation with public execution: pages, search, sitemaps, metadata, graph exports and local neighborhoods are generated from the same source.

## Core concepts

The first concept is actor identity. An operation means different things depending on who performs it.

The second concept is entity identity. An operation targets a specific record, not a vague display card.

The third concept is relation context. The target's neighbors can change meaning. Publishing a relation to an internal record may leak information.

The fourth concept is state. A concept can be speculative, observed, validated, published or canonical. Those confidence states should affect how claims are presented.

The fifth concept is propagation. A change to one entity may update search documents, graph neighborhoods, sitemaps and JSON-LD.

## Architecture

A contextual execution architecture needs:

- entity records with stable IDs;
- relation statements with predicates and confidence;
- validation rules for subject and object types;
- visibility rules;
- build or runtime processes that know which projections to update;
- audit trails or provenance for important changes;
- a clear boundary between editorial status and execution authority.

The Electronic Artefacts build currently implements this in a static form. The build validates records and relations, filters public entities, generates canonical pages and writes graph outputs. That is not a full dynamic runtime, but it demonstrates the same principle: context determines output.

## Implementation

Implementation should start small. A system can first define entity types and relation predicates. Then it can reject broken IDs and duplicate triples. Next it can filter public graph output based on entity visibility. Later it can add workflows, permissions and event propagation.

The mistake is to begin with a large abstract engine. Contextual execution should grow from concrete operations that need context: publish a record, expose a relation, generate structured data, cite a source, update a collection, create a derived artefact.

## Practical applications

For VASTE, contextual execution is a runtime design principle.

For V6, it can govern contribution, validation and public visibility across cultural knowledge nodes.

For the Knowledge Hub, it determines which entities are indexable, which relations can appear publicly, and how publication status affects metadata.

For future AI agents, contextual execution can limit actions by role, record state, relation type and evidence level.

## Tools

Useful tools include typed schemas, relation predicate registries, graph selectors, permission models, validation pipelines, event logs, search projections and JSON-LD generation.

## Evidence

The current build rejects relations whose subject or object types are not allowed by the predicate definition. It also prevents public relations from leaking non-public entities. That is contextual execution in static build form.

## Design questions

A system that claims contextual execution should answer several design questions.

What is the smallest context needed for the operation? Publishing a page may require entity identity, publication class, visibility, modified date and public relations. It probably does not require the entire history of every related entity.

Which context is authoritative? If a Markdown record says one thing and a generated manifest says another, the build must define which source wins. In this repository, the authored content and relation statements are the source of truth; generated outputs are projections.

Which context can propagate? A relation from a public article to an internal entity should not become visible simply because the article is public. A confidence label should affect the way claims are displayed, but it should not automatically decide whether a page is indexable.

Which context is temporal? A relation may be valid for one version of a system and wrong later. Long-term graph runtimes eventually need dated relations, supersession and change summaries.

## Common mistakes

The first mistake is using context as a global bag of variables. If every part of the system can read and mutate a shared context object, the architecture becomes unpredictable. Contextual execution should use explicit boundaries.

The second mistake is treating permissions as the only context. Permissions matter, but editorial state, provenance, confidence, lifecycle and relation type can be equally important.

The third mistake is making the graph purely descriptive. If relations never influence validation, projection or search, the system has a knowledge graph but not a graph runtime.

## Electronic Artefacts implications

The Knowledge Hub already shows why contextual execution matters. A public relation is allowed only when both connected entities are public. A publication becomes indexable only when it has the right publication class and a publication date. A concept page uses its definition differently from a project page. These are small examples, but they create a path toward stronger runtime behavior.

Future VASTE work can extend this principle into dynamic contribution systems, archive permissions, AI-agent action limits and event-driven projections.

## Related concepts

Read [Contextual Execution](/knowledge/concepts/contextual-execution/), [Graph Runtime](/knowledge/concepts/graph-runtime/), [Runtime Theory](/research/fields/runtime-theory/), [Entity Identity](/knowledge/concepts/entity-identity/) and [Cybernetic Feedback](/knowledge/concepts/cybernetic-feedback/).

## Suggested reading

Inspect the VASTE program record and Runtime Theory field. Then review how relation predicates are defined and validated in the Electronic Artefacts repository.

## Related articles

Continue with [Knowledge Graphs for Cultural Infrastructure](/publications/knowledge-graphs-for-cultural-infrastructure/) and [Linked Data and Public Knowledge Pages](/publications/linked-data-and-public-knowledge-pages/).

## Glossary

Context: information that changes the meaning or permission of an operation.

Runtime: the environment in which operations execute.

Propagation: the spread of a state change into dependent outputs.

Predicate: the named type of a relation.

## Limitations

Contextual execution can become overcomplicated. If every operation depends on the entire graph, performance and reasoning suffer. The system should define bounded context: the smallest set of identities, states and relations needed to make the operation correct.

The concept also requires humility. Some context is social and cannot be fully encoded. The goal is not to mechanize all judgment, but to make important constraints visible and testable.

## References

- Electronic Artefacts. Graph Runtime.
- Electronic Artefacts. Runtime Theory.
- Electronic Artefacts. VASTE.
- W3C. RDF 1.1 Concepts and Abstract Syntax.
