---
id: ea:publication:ontologies-taxonomies-and-knowledge-modeling
type: publication
slug:
  canonical: ontologies-taxonomies-and-knowledge-modeling
title: Ontologies, Taxonomies and Knowledge Modeling
subtitle: Technical Article
abstract: A practical guide to taxonomies, thesauri, folksonomies, ontologies, controlled vocabularies, OWL, SKOS and sustainable semantic modeling.
description: Understand the differences between taxonomies and ontologies and learn how to design a durable knowledge model without overengineering.
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
  - id: ea:concept:ontology
  - id: ea:concept:knowledge-graph
  - id: ea:concept:metadata
  - id: ea:technology:owl
  - id: ea:technology:skos
  - id: ea:project:vestiges
claims:
  - Taxonomies classify concepts, while ontologies specify richer domain entities, properties, relations and constraints.
  - Durable knowledge models should begin with real questions and interoperability needs rather than maximal formal expressivity.
evidence:
  - id: ea:concept:ontology
  - id: ea:concept:knowledge-graph
sources:
  - title: OWL 2 Web Ontology Language Document Overview
    publisher: W3C
    publishedAt: "2012-12-11"
    accessedAt: "2026-06-24"
    url: https://www.w3.org/TR/owl2-overview/
  - title: SKOS Simple Knowledge Organization System Reference
    publisher: W3C
    publishedAt: "2009-08-18"
    accessedAt: "2026-06-24"
    url: https://www.w3.org/TR/skos-reference/
  - title: The CIDOC Conceptual Reference Model
    publisher: CIDOC CRM Special Interest Group
    accessedAt: "2026-06-24"
    url: https://www.cidoc-crm.org/
citation:
  preferred: "Electronic Artefacts. \"Ontologies, Taxonomies and Knowledge Modeling.\" Technical article, version 1.0.0, 2026."
tags:
  - Ontology
  - Taxonomy
  - SKOS
  - OWL
  - Knowledge Modeling
disciplines:
  - Knowledge Systems
  - Information Architecture
  - Semantic Web
  - Philosophy
---

## Problem

Growing knowledge systems often mix categories, tags, entity types and relations without defining their roles. The result is duplicate terms, ambiguous navigation and graph edges that machines and editors cannot interpret consistently.

## Introduction

Taxonomy and ontology are often used as interchangeable words for organized information. They are related, but they solve different problems. A taxonomy primarily arranges concepts into categories, often through broader and narrower relationships. An ontology specifies the kinds of entities that exist in a domain, the properties they can have, the relationships they can enter and sometimes the constraints or inference rules that follow.

The difference matters when a site grows from dozens to thousands of records. Categories can help readers browse, but they cannot by themselves express that a person taught a technique, a technique uses a material, a project documents a place, or a publication supersedes an earlier claim. Those statements require entities and typed relations.

Knowledge modeling is the practice of choosing these structures deliberately. It combines editorial judgment, domain research and technical architecture. The goal is not to formalize reality completely. It is to represent enough meaning to support discovery, validation, reuse and change.

## Controlled vocabularies

A controlled vocabulary is an approved set of terms used consistently. It may define preferred labels, synonyms, notes and scope. Controlled vocabularies reduce variation: "AI," "Artificial Intelligence" and "machine intelligence" can be mapped rather than treated as unrelated tags.

Control does not mean immobility. Terms need governance, versioning and review. New fields appear, language changes and earlier categories reveal bias. A vocabulary should record why a term exists, what it includes and what it excludes.

For Electronic Artefacts, `disciplines` function as broad controlled categories, while `tags` support more specific retrieval vocabulary. Canonical concept entities provide definitions. This layered model prevents one overloaded tag field from carrying every semantic responsibility.

## Taxonomies

A taxonomy organizes concepts through classification. The simplest form is a hierarchy: Electronic Music belongs under Music; Machine Learning belongs under Artificial Intelligence. Taxonomies support navigation, faceting and editorial coverage analysis.

Hierarchy is attractive because it is easy to display as a tree. It becomes restrictive when a concept belongs in several contexts. Creative coding connects programming, digital art, design and education. Forcing it into one parent hides important paths.

Polyhierarchy allows multiple broader concepts. SKOS supports broader and narrower relations without requiring a single tree. Even then, hierarchy should be used when one concept genuinely has a broader conceptual relationship, not merely because two pages are related.

A taxonomy should remain shallow enough to understand. Deep category trees often encode organizational history rather than user needs.

## Thesauri

A thesaurus extends a taxonomy with lexical and associative structure. It can distinguish preferred and alternative labels, record broader and narrower concepts, and link related concepts that are not hierarchical.

This is valuable for search. A reader searching "LLM" should find Large Language Model. A search for "MAO" in French may need to map to computer music production terminology. Historical terms can remain discoverable without becoming the preferred current label.

SKOS was designed for publishing this kind of knowledge organization system on the Web. Its concepts, labels, notes and mappings provide a pragmatic bridge between editorial vocabularies and Linked Data.

## Folksonomies

A folksonomy emerges from tags created by users rather than a centrally governed vocabulary. It can reflect living language and unexpected associations. Social bookmarking, media platforms and note systems often use folksonomic structures.

The benefit is responsiveness. The cost is ambiguity, synonym duplication and inconsistent granularity. One user tags a record "AI"; another uses "generative-ai"; another uses a product name.

A hybrid system can preserve user tags as observations while mapping selected terms to canonical concepts. Folksonomy becomes input to vocabulary governance rather than an uncontrolled replacement for it.

Vestiges may eventually need this balance. Contributors should be able to describe practices in their own language, while public knowledge pages maintain stable identities and mappings.

## Ontologies

An ontology makes a domain model explicit. It may define classes such as Person, Technique, Material and Institution; properties such as usesMaterial or taughtBy; and constraints on where those properties apply.

Formal ontologies can support reasoning. If every Conservator is a Person and a record is a Conservator, a reasoner can infer that the record is a Person. If a property is transitive or inverse, additional statements may follow.

Not every knowledge platform needs this level of inference. A lightweight ontology may simply be a documented entity schema and predicate registry with validation. Electronic Artefacts currently follows this pragmatic path: entity types are explicit, references are typed and predicates define allowed subjects and objects.

The important property is shared meaning. Developers, editors and machines should interpret `poweredBy` or `documents` consistently.

## Architecture

A sustainable semantic architecture separates controlled labels, concept schemes, entity schemas, predicates, constraints and provenance. SKOS can publish vocabulary structure, while OWL can express stronger formal semantics where needed.

## OWL

OWL, the Web Ontology Language, provides formally defined semantics for classes, properties, individuals and constraints. It builds on RDF and supports different profiles for varying computational needs.

OWL can express equivalence, disjointness, cardinality and property characteristics. These capabilities are useful when interoperability and automated reasoning justify the complexity.

The risk is adopting formalism without operational use. If no application consumes an axiom and no editor can maintain it, the model creates cost without value. An ontology should earn its complexity through validation, inference, integration or research benefit.

Electronic Artefacts can treat OWL as a future export or alignment layer rather than forcing every internal record into full formal semantics now.

## SKOS

SKOS is designed for concept schemes such as taxonomies and thesauri. It provides preferred, alternative and hidden labels; broader, narrower and related links; notes; and mappings between schemes.

SKOS is often the better choice for editorial categories because it does not claim that every concept is a formal class of real-world things. A "Sound Design" concept can organize documents and mappings without requiring complex logical axioms.

The Knowledge Hub could publish its disciplines and core vocabulary as a SKOS concept scheme. English and French labels could share identity. Broader and related paths could support navigation and external reuse.

SKOS and OWL can coexist. One models knowledge organization; the other can model domain semantics.

## Entities versus concepts

An ontology distinguishes types of things from conceptual labels. A person is an entity. "Creative Technologist" may be a role or concept. A software program is an entity. "Graph Runtime" is a concept that a program can implement.

Collapsing all of these into tags loses identity. It becomes difficult to attach dates, sources, versions or relations. Conversely, turning every noun into an entity creates unnecessary overhead.

Create a canonical entity when the object needs its own history, relationships, metadata or public page. Use a vocabulary term when it primarily supports classification. Promote a term to an entity when evidence and reuse justify it.

This rule helps the Knowledge Hub grow without generating thousands of thin pages.

## Relations and predicates

Relations are the verbs of a knowledge model. They carry more meaning than a generic "related" link. A publication documents a concept. A project applies a method. A program uses a technology. An artefact derives from a source.

A predicate needs a definition, allowed domain and range, inverse label where useful, and source requirements when the claim is consequential. Predicates should be reusable across many records.

Avoid synonyms that fragment the graph. `uses`, `employs`, `builtWith` and `leverages` may all mean the same thing. Choose one canonical predicate and reserve new terms for meaningful distinctions.

Also avoid pretending certainty. A relation can carry confidence, dates and provenance. Knowledge modeling should represent disagreement and evolution rather than forcing every statement into timeless fact.

## Modeling events

Cultural and technical domains are often event-centered. A person did not simply "belong to" an institution; they joined at a time and in a role. An artwork was created, exhibited, restored and acquired through events.

Direct relations are convenient but can hide time and participants. Reifying an event as its own entity allows date, place, evidence and result to be attached.

CIDOC CRM demonstrates the value of event-centered modeling for cultural heritage. It provides a shared conceptual structure for integrating museum, archive and library information without reducing it to one database schema.

Electronic Artefacts already supports event entities. Future Vestiges records can use them for teaching, transmission, exhibitions and institutional histories.

## Modeling uncertainty

Knowledge systems contain observations, interpretations and claims of different confidence. An ontology defines possible statements; editorial metadata describes how strongly a particular statement is supported.

Confidence should not be encoded only through prose. Records can distinguish speculative, observed, validated, published and canonical states. Sources and review dates provide additional context.

Two contradictory claims may coexist when each has provenance. The system should not infer a single truth merely because one record was added later.

This is especially important for AI retrieval. A model should see which source is canonical, which is historical and which is uncertain.

## Ontology design process

Begin with competency questions: what should the system be able to answer? "Which techniques use this material?" "Who documented this project?" "Which publications support this claim?" Questions reveal required entities and predicates.

Collect real examples before defining a universal schema. Identify repeated nouns, verbs, dates and identifiers. Test whether different editors classify the same records consistently.

Define a small core, then add modules. Electronic Artefacts can maintain shared entities and relations while specialized audio, archive or cultural modules introduce domain terms.

Document exclusions and non-goals. A model becomes clearer when it states what it does not represent.

Version the vocabulary. Changes to identifiers and predicate meanings can break URLs, relations and external integrations.

## Implementation

Begin with competency questions and real records. Define a small entity and predicate core, map synonyms, validate allowed relation domains, publish scope notes and add formal axioms only when they produce measurable interoperability or inference value.

## Evidence

W3C SKOS defines a model for concept schemes and vocabulary mappings. W3C OWL provides formal ontology semantics. CIDOC CRM demonstrates event-centered modeling for cultural heritage integration.

## Common modeling mistakes

The first mistake is category proliferation. Editors create near-synonymous categories for every article and navigation becomes noisy.

The second is premature abstraction. A generic `Resource` or `Thing` class provides little editorial guidance.

The third is overloading hierarchy. Related concepts are forced into parent-child relations even when the relationship is contextual.

The fourth is universal `relatedTo`. It creates edges without meaning and weakens graph traversal.

The fifth is modeling only current software needs. A durable knowledge model considers citation, archive and future reuse.

The sixth is ignoring language and culture. Preferred labels and classifications reflect institutional choices. Alternative names and scope notes are essential.

## Search and SEO

Taxonomy influences discoverability. Canonical concept pages can answer definition searches, while category pages organize thematic authority. Internal links should follow meaningful relations rather than repeat keyword anchors mechanically.

Structured data helps machines distinguish a concept, article, project and organization. Stable entity identifiers prevent several pages from competing as the canonical definition.

Thin ontology pages are counterproductive. A public concept page should include definition, scope, applications, limitations, sources and related entities. The internal model can contain terms that are not yet public.

For AI retrieval, explicit relation types and source metadata make context assembly more reliable.

## Electronic Artefacts model

Electronic Artefacts uses four complementary layers. Entity types identify what a record is. Disciplines provide broad cross-cutting categories. Tags provide specific retrieval terms. Typed relations express semantic connections.

This architecture can scale because each layer has one responsibility. A publication can belong to several disciplines, carry focused tags, document multiple concepts and connect to projects without being placed in one folder.

VASTE can make the same semantics executable. Vestiges can extend them into cultural knowledge. The public Knowledge Hub provides readable definitions and source trails.

## Governance

A vocabulary needs ownership. Proposed terms should be checked for duplicates, scope and expected use. Predicate changes require stronger review because they affect graph semantics.

Usage reports can reveal orphaned categories, overloaded terms and inconsistent labels. Editors should merge duplicates and deprecate terms without deleting historical mappings.

Governance should remain proportionate. A small studio does not need a committee for every tag, but it does need canonical decisions recorded somewhere.

## Limitations

No ontology is a neutral or complete representation of a domain. Formal models can encode institutional bias and become expensive to change. Alternative labels, provenance and revision processes remain necessary.

## Related concepts

Read [Ontology](/knowledge/concepts/ontology/), [Knowledge Graph](/knowledge/concepts/knowledge-graph/), [Metadata](/knowledge/concepts/metadata/), [Linked Data](/knowledge/concepts/linked-data/) and [Graph Modeling](/knowledge/concepts/graph-modeling/).

## Related technologies

See [OWL](/knowledge/technologies/owl/), [SKOS](/knowledge/technologies/skos/) and [RDF](/knowledge/technologies/rdf/).

## Related project

See [Vestiges](/projects/v6/) for cultural knowledge modeling.

## Glossary

Controlled vocabulary: a governed set of terms.

Taxonomy: a classification structure, often hierarchical.

Thesaurus: a vocabulary with labels, hierarchy and associative links.

Folksonomy: a vocabulary emerging from user tags.

Ontology: an explicit domain model of entities, properties and relations.

Competency question: a question used to test whether a model represents required knowledge.

## References

- W3C. OWL 2 Web Ontology Language Document Overview.
- W3C. SKOS Simple Knowledge Organization System Reference.
- CIDOC CRM Special Interest Group. The CIDOC Conceptual Reference Model.
