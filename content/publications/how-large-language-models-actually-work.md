---
id: ea:publication:how-large-language-models-actually-work
type: publication
slug:
  canonical: how-large-language-models-actually-work
title: How Large Language Models Actually Work
subtitle: Technical Article
abstract: A grounded explanation of how large language models turn tokens into predictions through embeddings, transformer layers, attention, training and probabilistic inference.
description: Learn how LLMs work, from tokenization and training to attention, context windows, decoding, hallucinations, tools and evaluation.
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
  - id: ea:concept:large-language-model
  - id: ea:technology:transformer-architecture
  - id: ea:concept:generative-ai
  - id: ea:concept:augmented-intelligence
  - id: ea:concept:provenance
claims:
  - A large language model predicts token sequences from learned parameters and supplied context rather than consulting a complete internal database of facts.
  - Reliable LLM systems depend on retrieval, tools, evaluation and human judgment in addition to model capability.
evidence:
  - id: ea:concept:large-language-model
  - id: ea:technology:transformer-architecture
sources:
  - title: Attention Is All You Need
    author: Ashish Vaswani et al.
    publisher: arXiv
    publishedAt: "2017-06-12"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/1706.03762
  - title: On the Opportunities and Risks of Foundation Models
    author: Rishi Bommasani et al.
    publisher: Stanford Center for Research on Foundation Models
    publishedAt: "2021-08-16"
    accessedAt: "2026-06-24"
    url: https://arxiv.org/abs/2108.07258
citation:
  preferred: "Electronic Artefacts. \"How Large Language Models Actually Work.\" Technical article, version 1.0.0, 2026."
tags:
  - LLM
  - Transformer
  - Attention
  - Tokenization
  - Inference
disciplines:
  - Artificial Intelligence
  - Machine Learning
  - Programming
  - Knowledge Systems
---

## Problem

LLMs are widely used but poorly explained. Product language often collapses model architecture, training, retrieval, tools and interface behavior into one idea of "AI," making capability and failure difficult to evaluate.

## Introduction

Large language models are often described through metaphors: autocomplete, synthetic memory, probabilistic parrot, reasoning engine, compressed internet or universal interface. Each metaphor illuminates one feature and hides several others. A more useful explanation begins with the actual operation. An LLM receives a sequence represented as tokens, transforms those tokens through many learned numerical layers, and estimates a probability distribution for what token should come next. It repeats that operation until it reaches a stopping condition.

That description sounds simple because the basic inference loop is simple. The power comes from scale, training, representation and architecture. Billions of learned parameters encode statistical regularities found across language, code and sometimes other media. Transformer layers let information from different positions influence one another. Instruction tuning and preference optimization shape how a pretrained model responds to requests. Tools, retrieval and application code extend what the model can observe and do.

Understanding these layers matters because an LLM is neither a database nor an independent source of truth. It can reproduce knowledge, combine patterns and perform useful transformations, but the same mechanism can generate fluent errors. The correct unit of analysis is therefore the whole system: model, context, tools, interface, sources, controls and evaluator.

## From text to tokens

Models do not receive words in the human sense. A tokenizer segments input into units drawn from a fixed vocabulary. A token may represent a complete common word, part of a longer word, punctuation, whitespace or a code fragment. Tokenization makes open-ended language computationally manageable: instead of predicting any possible character string directly, the model predicts from a finite vocabulary.

The segmentation has consequences. Rare names may require several tokens. Languages with less representation in a tokenizer can consume more context for the same amount of meaning. Character counting, spelling and exact string operations can be unexpectedly difficult because the model works from token units and learned patterns rather than a native symbolic view of every character.

Each token is mapped to an embedding, a vector of numerical values. Embeddings allow the network to represent patterns of similarity and difference in a high-dimensional space. The model also needs information about position because the same tokens in a different order mean something different. Positional information and token representations enter the transformer stack together.

## Transformer layers and attention

The 2017 paper "Attention Is All You Need" introduced the transformer architecture as an alternative to sequence models based primarily on recurrence or convolution. Its central mechanism, self-attention, lets each position compute how strongly it should use information from other positions in the available sequence.

In simplified terms, the model produces query, key and value representations. A query from one token is compared with keys from other tokens. Those comparisons produce weights, and the weighted values contribute to an updated representation. Multiple attention heads can learn different relationship patterns. Feed-forward layers then transform each position further. Residual connections and normalization help information and gradients move through deep networks.

Attention is not a human-readable proof of why the model answered. It is a computational mechanism for mixing contextual information. Across many layers, the model can build representations sensitive to syntax, reference, style, code structure and task instructions. The exact internal organization is distributed: a concept is rarely stored in one parameter or one location.

## Pretraining

During pretraining, the model processes enormous collections of examples and adjusts parameters to reduce prediction error. For an autoregressive language model, the basic objective is next-token prediction. Given previous tokens, the network assigns probabilities to possible continuations. The training system compares the prediction with the actual next token and propagates error backward to update weights.

Repeated across large datasets, this objective forces the model to learn many regularities useful for prediction. Grammar helps predict language. Facts and associations help predict statements. Code patterns help predict functions. Genre and rhetorical structure help predict documents. Some abilities appear only after sufficient scale or training diversity, although claims of sudden emergence require careful measurement because evaluation thresholds can make gradual improvement appear discontinuous.

Training data is not a neutral mirror of culture. Collection, filtering, duplication, language distribution, licensing, moderation and annotation all affect the resulting model. A model card or technical report can document part of that process, but many systems remain difficult to audit fully. Provenance therefore belongs to any serious explanation of model behavior.

## Instruction tuning and alignment

A raw pretrained model is optimized to continue sequences, not necessarily to follow a user’s intention. Instruction tuning uses examples of prompts and desired responses to shape more useful behavior. Preference optimization uses human or model-generated comparisons to favor outputs judged more helpful, safe or aligned with a policy.

These stages do not replace the underlying model. They alter response tendencies. System instructions, conversational roles, refusal policies and output formats are application and training layers placed around next-token prediction. A model can appear to have a stable personality because those layers consistently bias its responses.

The word alignment should be used carefully. It may refer to compliance with product rules, human preferences, constitutional principles, safety requirements or broader social values. These are not identical objectives, and no tuning process resolves every conflict between them.

## Inference and decoding

Inference is the process of running a trained model on new input. The application assembles a context that may include system instructions, user messages, retrieved passages, tool results and earlier conversation. The model computes probabilities for the next token. A decoding strategy then selects one.

Greedy decoding chooses the highest-probability token each time. Sampling introduces controlled variation. Temperature reshapes the probability distribution: lower values concentrate choices, while higher values increase diversity. Top-k or nucleus sampling restricts selection to a subset of likely tokens. These settings influence style and repeatability, but they do not create or remove knowledge.

After selecting a token, the system appends it to the sequence and repeats. The model does not normally draft a complete hidden paragraph and reveal it word by word. It continually predicts under the context produced so far, although modern systems may add planning, reasoning or verification stages around that loop.

## Context windows and memory

The context window is the amount of tokenized information a model can process in one inference operation. It is working context, not permanent memory. When a conversation exceeds the available window, applications may truncate, summarize or retrieve earlier material. Each strategy can lose information.

Longer context is useful but not equivalent to perfect recall. Relevant evidence can be buried among distractions. Position can affect attention. Conflicting instructions can reduce reliability. Good systems select and structure context instead of filling every available token.

Persistent memory is an application feature. It may store user preferences, summaries, documents, embeddings or graph records outside the model and retrieve them later. The memory system needs permissions, retention policy, provenance and deletion behavior. Calling all of this "the model remembers" hides important architecture.

## Why hallucinations happen

An LLM is trained to produce likely continuations, not to guarantee that every sentence is supported. When context is incomplete, the model can still generate a plausible pattern. A fabricated citation may resemble real bibliographic language because the system has learned the form of citations. A confident answer may continue the conversational expectation even when the underlying information is uncertain.

Hallucination is not one defect with one fix. Errors can arise from missing knowledge, ambiguous prompts, flawed retrieval, unsupported synthesis, decoding choices, conflicting context or evaluation gaps. Retrieval-augmented generation can supply evidence, but the model may misuse it. Tools can calculate or query authoritative data, but the model may call the wrong tool or misread the result.

Systems should expose uncertainty where possible and separate claims from sources. For factual publishing, generated prose must be checked against primary material. Fluency is a presentation property, not an evidence level.

## What models can and cannot do

LLMs can summarize, classify, translate, rewrite, extract structures, generate code, propose alternatives and operate tools. They are especially valuable where language is both interface and material. Their broad training allows one model to support many tasks without a separate program for each phrasing.

They remain sensitive to prompt formulation and distribution shift. They may fail on exact arithmetic, hidden state, unfamiliar domain constraints or tasks requiring current external facts. They can reproduce stereotypes or confidential data patterns. Capabilities measured on benchmarks may not transfer to a production environment with different inputs and consequences.

The question "does the model understand?" often becomes philosophical before it becomes operational. For system design, more precise questions are available: can it complete the task, under which conditions, with what error rate, using which evidence, and can failure be detected before harm occurs?

## Tools, retrieval and agents

A model becomes more useful when connected to external capabilities. Retrieval can provide current or private documents. A calculator can produce exact arithmetic. Code execution can test a hypothesis. A database can return authoritative state. An agent loop can let the model select actions and inspect results.

These augmentations also expand risk. Tool permissions determine what can be read or changed. Retrieved documents can contain malicious instructions. Long loops can compound small errors. The model should receive the minimum authority required, and consequential actions should use deterministic validation or human approval.

For Electronic Artefacts, VASTE offers a useful architectural question: can model actions be constrained by entity identity, relation type, record status and visibility? That is more robust than granting a generic assistant access to an undifferentiated workspace.

## Architecture

The complete architecture includes tokenizer, embeddings, transformer layers, learned parameters, context assembly, decoding, optional retrieval and tools, plus application-level permissions and evaluation.

## Implementation

Implementations should begin with a bounded task, representative evaluation set and explicit source policy. Model selection, context construction, decoding and tool access should be versioned so that behavior can be tested and reproduced.

## Evidence

The transformer architecture is documented by Vaswani et al. Foundation-model research describes how broad pretrained models can support many downstream tasks while concentrating technical and social risks.

## Evaluation

Evaluation should match the intended task. A summarizer can be tested for coverage, faithfulness and omission. A coding model can be tested with automated tests and review. A RAG system needs retrieval recall, citation correctness and answer faithfulness. A creative system may need diversity, controllability, editability and provenance rather than one correct output.

Single demonstrations are weak evidence. Production evaluation requires representative examples, failure categories, regression sets and monitoring. Human review is especially important where quality is contextual or cultural. Automated evaluators can scale measurement but may share biases with the system being evaluated.

## Electronic Artefacts implications

Electronic Artefacts should discuss LLMs as components of knowledge and creative infrastructures. The Knowledge Hub provides stable pages, sources and graph relations that can improve retrieval. ORETH provides a context for audio analysis and multimodal research. VASTE provides a context for permissions, tools and contextual execution.

The editorial position should remain durable: explain architectures and evaluation rather than chasing every model release. Product names change quickly. Tokenization, attention, external memory, provenance, tool authority and human judgment remain fundamental.

## Limitations

This article explains the dominant transformer-based model pattern rather than every language-model architecture. Specific models differ in training data, context design, multimodal components, tool interfaces and safety mechanisms.

## Related concepts

Read [Large Language Model](/knowledge/concepts/large-language-model/), [Generative AI](/knowledge/concepts/generative-ai/), [Augmented Intelligence](/knowledge/concepts/augmented-intelligence/), [Provenance](/knowledge/concepts/provenance/) and [Retrieval-Augmented Generation](/knowledge/concepts/retrieval-augmented-generation/).

## Related articles

Continue with [Generative AI, Latent Space and Creative Workflows](/publications/generative-ai-latent-space-and-creative-workflows/) and [Retrieval-Augmented Generation and Knowledge Systems](/publications/retrieval-augmented-generation-and-knowledge-systems/).

## Glossary

Token: a unit from the model vocabulary.

Embedding: a numerical representation of a token or other object.

Parameter: a learned numerical value in the model.

Attention: a mechanism that mixes information across positions.

Inference: running a trained model to produce an output.

Decoding: the strategy used to select output tokens.

## References

- Vaswani et al. Attention Is All You Need. 2017.
- Bommasani et al. On the Opportunities and Risks of Foundation Models. 2021.
