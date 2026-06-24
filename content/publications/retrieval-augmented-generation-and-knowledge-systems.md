---
id: ea:publication:retrieval-augmented-generation-and-knowledge-systems
type: publication
slug:
  canonical: retrieval-augmented-generation-and-knowledge-systems
title: Retrieval-Augmented Generation and Knowledge Systems
subtitle: Technical Article
abstract: An end-to-end explanation of RAG architecture, ingestion, chunking, embeddings, hybrid retrieval, graphs, citations, permissions and evaluation.
description: Learn how retrieval-augmented generation works and how to build source-grounded RAG systems with metadata, knowledge graphs and evaluation.
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
  - id: ea:concept:retrieval-augmented-generation
  - id: ea:concept:knowledge-graph
  - id: ea:concept:metadata
  - id: ea:concept:provenance
  - id: ea:concept:large-language-model
  - id: ea:program:vaste
claims:
  - RAG quality depends on corpus architecture, retrieval and attribution rather than on vector search alone.
  - Hybrid systems can combine embeddings with typed graph relations to preserve semantic identity and source paths.
evidence:
  - id: ea:concept:retrieval-augmented-generation
  - id: ea:concept:knowledge-graph
sources:
  - title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
    author: Patrick Lewis et al.
    publisher: arXiv
    publishedAt: "2020-05-22"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/2005.11401
  - title: Active Retrieval Augmented Generation
    author: Zhengbao Jiang et al.
    publisher: arXiv
    publishedAt: "2023-05-11"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/2305.06983
citation:
  preferred: "Electronic Artefacts. \"Retrieval-Augmented Generation and Knowledge Systems.\" Technical article, version 1.0.0, 2026."
tags:
  - RAG
  - Knowledge Graph
  - Vector Search
  - Embeddings
  - Citations
disciplines:
  - Artificial Intelligence
  - Knowledge Systems
  - Information Architecture
  - Machine Learning
---

## Problem

Language models can generate fluent answers without current or attributable evidence. Naive RAG implementations add vector search but leave corpus authority, permissions, source identity and citation correctness unresolved.

## Introduction

Retrieval-augmented generation, usually shortened to RAG, connects a generative model to an external body of information. Instead of asking the model to answer only from learned parameters and the user's prompt, the system retrieves relevant records and places them into the model's working context. The model then produces a response informed by those records.

The pattern addresses two limitations of parametric models. Knowledge stored in model weights is difficult to update precisely, and model outputs do not inherently expose provenance. External retrieval allows a corpus to change independently of the model and creates an opportunity to cite sources.

RAG is often reduced to three steps: split documents, embed chunks and search a vector database. That implementation can produce a demonstration, but it is not yet a trustworthy knowledge system. Durable RAG requires corpus governance, metadata, permissions, query design, ranking, context assembly, citation, evaluation and maintenance.

## The original architecture

The 2020 RAG paper by Lewis and colleagues combined a pretrained sequence-to-sequence model with a dense vector index used as non-parametric memory. A retriever selected passages relevant to an input, and the generator conditioned its output on retrieved material.

The important conceptual separation is between parametric memory and external memory. Model parameters encode patterns learned during training. The retrieval corpus contains addressable records that can be updated, inspected and attributed. A system can replace or correct a source without retraining the full language model.

Modern RAG systems extend this design with hybrid search, reranking, knowledge graphs, query decomposition, tool use, active retrieval and multi-stage evaluation. The underlying question remains stable: how should the system find and present the right evidence for a generative task?

## Architecture

The architecture includes source ingestion, canonical identity, segmentation, metadata, lexical or vector indexes, query transformation, candidate retrieval, reranking, context assembly, generation, citation and evaluation.

## Corpus architecture

RAG begins before embedding. The corpus needs a defined scope, authority model and update process. A folder of mixed PDFs, exports and notes may contain duplicates, superseded versions, private material and inconsistent titles. Indexing it without governance makes those problems harder to see.

Each source should have a stable identity and useful metadata: title, author, date, type, rights, language, version, visibility and canonical URL. Sections should retain their document and heading context. Derived text from OCR or transcription should be distinguishable from verified source text.

Electronic Artefacts already models many of these requirements. Publications, concepts, programs and projects have canonical IDs, versions, confidence levels and sources. Relations connect them. This structured corpus is better RAG material than anonymous chunks because retrieval can preserve meaning beyond textual similarity.

## Segmentation and chunking

Language models receive bounded context, so long documents are divided into retrieval units. Chunking determines what the retriever can return. Chunks that are too small may lose definitions and qualifications. Chunks that are too large may dilute relevance and consume context.

Fixed token windows are easy but ignore structure. Semantic chunking attempts to separate topic shifts but can be unstable. Document-aware chunking follows headings, paragraphs, lists, tables or code blocks. The best strategy depends on material and questions.

A chunk should retain a pointer to its parent source and location. It may include a title prefix or summary for retrieval, while the original text remains available for citation. Overlap can preserve continuity but increases duplication and may crowd results with near-identical passages.

For the Knowledge Hub, section headings offer natural units. A query about limitations should retrieve the limitation section with article identity and sources, not a context-free paragraph.

## Sparse, dense and hybrid retrieval

Sparse retrieval uses lexical evidence such as exact terms and term frequency. It is strong for names, identifiers, code symbols and distinctive phrases. Dense retrieval maps queries and passages into embedding vectors, then finds nearby representations. It can capture semantic similarity when wording differs.

Neither dominates every task. Dense search may confuse related concepts or miss exact rare identifiers. Lexical search may miss paraphrases. Hybrid retrieval combines scores or candidate sets. Rerankers can then evaluate the most promising results with a more expensive model.

The retrieval strategy should reflect the corpus. A technical archive with stable IDs benefits from exact matching. A cultural essay collection benefits from semantic retrieval. Multilingual content may require cross-lingual embeddings or language-aware indexing.

Evaluation should measure whether relevant evidence appears in the candidate set, not only whether the final answer sounds good.

## Embeddings and their limits

An embedding is a numerical representation designed so that related inputs occupy nearby regions under a chosen similarity measure. Embeddings make semantic search practical, but they do not express why two items are related.

Two passages may be close because they share a topic, style or vocabulary. A typed graph relation can say that a publication documents a concept, a project applies a method, or a program powers a product. Those meanings are different even when the text appears similar.

Embeddings also change with models and preprocessing. Re-indexing can alter neighborhoods. Vector similarity is therefore an index, not a canonical truth layer. Preserve source identity and relation structure outside the embedding store.

## Knowledge graphs and Graph RAG

A knowledge graph represents entities and typed relations explicitly. It can improve retrieval by expanding from a recognized entity, following relevant predicates, filtering by type or assembling a bounded neighborhood.

For example, a query about machine listening in Palimpsests could resolve the project entity, follow `poweredBy` to ORETH, follow applied concepts to Signal Archaeology, and retrieve supporting publications. Vector search alone might return similar audio articles without exposing that project-program-concept path.

Graph retrieval does not eliminate text search. The graph may identify which records matter, while lexical and semantic retrieval select the best passages within them. This hybrid architecture preserves explainable structure and expressive language.

VASTE is a natural research context for this design. Contextual execution can determine which graph neighborhood a user may retrieve and which relations should influence an answer.

## Query understanding

User questions are rarely perfect search queries. The system may normalize terminology, resolve entities, generate alternate phrasings or decompose a complex request into subquestions. Each transformation can improve recall or introduce drift.

Entity resolution is especially valuable. "VASTE runtime" should map to the canonical program rather than a generic meaning of vast. Dates, versions and locales may constrain retrieval. A question asking for comparison needs evidence for both sides, not only the most similar passage.

Active retrieval systems decide when additional evidence is needed during generation. This can help long-form answers but increases cost and makes the retrieval trajectory part of evaluation.

Query transformations should be logged. When a system answers poorly, engineers need to know whether the source was absent, the query was wrong, ranking failed or generation ignored the evidence.

## Context assembly

Retrieved passages must be arranged into a context the model can use. The assembler can group results by source, remove duplicates, allocate token budgets and include metadata. Ordering matters: models may prioritize early or late passages differently.

The context should distinguish instructions from evidence. Retrieved documents are untrusted data and may contain text that resembles commands. The application should state that sources are to be analyzed, not followed as system instructions.

Conflicting sources should not be silently merged. Dates, confidence and provenance help the model represent disagreement. When the corpus contains a canonical record and a superseded note, status metadata should affect selection.

The ideal context is not the largest possible context. It is the smallest evidence set sufficient to answer the question accurately.

## Generation and citation

The generator should be instructed to answer from supplied evidence, identify uncertainty and attach citations to claims. Citation format should use stable source IDs or URLs rather than model-generated bibliographic strings.

A citation is useful only if it supports the associated statement. Systems should test citation entailment: does the cited passage actually justify the claim? A model may cite a relevant source while adding unsupported details.

For complex answers, the system can produce a structured intermediate representation with claims and source references before rendering prose. Deterministic code can validate that every citation points to a retrieved record.

The final interface should let readers open the source and understand its authority. Hidden citations available only in logs do not create public trust.

## Permissions and privacy

RAG can leak information if retrieval ignores access control. Filtering after generation is too late because private content may already influence the answer. Permission constraints must apply during candidate selection and context assembly.

The retriever needs actor identity, purpose and resource visibility. A public visitor should receive only public records. A studio member may retrieve internal notes. A project-specific agent may access restricted materials for analysis but publish only approved derived claims.

Embeddings themselves can reveal sensitive structure. Separate indexes or robust metadata filters may be required. Deletion must remove source text, vectors, caches and generated summaries where policy requires it.

This is another reason to connect RAG with contextual execution rather than treating it as a standalone chatbot.

## Evaluation

RAG evaluation should separate stages. Corpus coverage asks whether the answer exists in indexed material. Retrieval recall asks whether relevant records appear. Ranking asks whether they are prioritized. Context quality asks whether evidence is sufficient and non-redundant. Generation faithfulness asks whether claims follow from sources. Answer quality asks whether the result is useful.

Build a question set from actual user needs. Include questions with no answer, ambiguous terms, conflicting sources, version-sensitive facts and permission boundaries. A system should know when to abstain or ask for clarification.

Automated metrics can compare retrieved passages with labeled evidence, while human reviewers assess nuance and usefulness. Model-based evaluators can assist but should not be the sole authority.

Track failures by cause. "The answer was wrong" is not actionable enough for a multi-stage system.

## Maintenance

A RAG index is a derived product. When a source changes, affected chunks and embeddings must be updated. Deletions and access changes must propagate. Model upgrades may require re-embedding the corpus. Duplicate or stale material should be pruned.

Index builds need manifests that record source version, chunking strategy, embedding model and date. This allows reproducibility and rollback. Search quality should be re-evaluated after changes.

The graph can help identify impact. If a concept changes, related publications and collections can be queued for review. Retrieval infrastructure then becomes part of editorial governance rather than a separate experiment.

## Implementation

Start with a small authoritative corpus and question set. Preserve parent documents and section paths, combine exact and semantic retrieval, return stable citations, and test permission filtering before adding agentic query expansion.

## Evidence

Lewis et al. formalized retrieval as non-parametric memory combined with a generator. Later active-retrieval research explores systems that retrieve additional evidence during generation rather than only once at the beginning.

## Electronic Artefacts applications

The Knowledge Hub can power a source-grounded research assistant, related-reading engine and semantic search interface. VASTE can provide identity-aware graph retrieval. Vestiges can answer questions about people, techniques, materials and institutions while exposing relation paths. ORETH can retrieve audio annotations, analyses and project context.

The public surface should remain useful without AI. Canonical pages, citations and navigation are primary. RAG is a way to query that structured library, not a replacement for it.

This order matters for long-term preservation. Models and indexes can be rebuilt; well-authored source records remain the durable asset.

## Limitations

RAG does not guarantee truth or completeness. Relevant sources may be absent, ranking may fail and models may ignore or distort retrieved evidence. Domain evaluation and editorial responsibility remain necessary.

## Related concepts

Read [Retrieval-Augmented Generation](/knowledge/concepts/retrieval-augmented-generation/), [Knowledge Graph](/knowledge/concepts/knowledge-graph/), [Metadata](/knowledge/concepts/metadata/), [Provenance](/knowledge/concepts/provenance/) and [Large Language Model](/knowledge/concepts/large-language-model/).

## Related programs

See [VASTE](/programs/vaste/) and [Vestiges](/projects/vestiges/).

## Glossary

Corpus: the collection of material available for retrieval.

Chunk: a bounded retrieval unit derived from a source.

Embedding: a vector representation used for similarity search.

Reranker: a model that reorders candidate results.

Faithfulness: the degree to which generated claims follow from supplied evidence.

Graph neighborhood: a bounded set of entities and relations around a node.

## References

- Lewis et al. Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. 2020.
- Jiang et al. Active Retrieval Augmented Generation. 2023.
