---
id: ea:concept:open-weight-model
type: concept
slug:
  canonical: open-weight-model
title: Open-Weight Model
definition: An open-weight model is a machine-learning model whose learned parameters are distributed for reuse under stated terms, without necessarily providing the training data, training code or freedoms required by open-source definitions.
abstract: Open-weight models enable local inference and adaptation but must be distinguished from fully open-source AI systems.
description: A canonical definition for local AI, model licensing and digital independence.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: validated
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Model weights
  - Local inference
  - Licensing
  - Quantization
  - Adaptation
exclusions:
  - A claim that downloadable weights automatically make an AI system open source
  - A hosted API with no distributable model parameters
claims:
  - Open weights can improve autonomy and inspectability without providing full training reproducibility.
  - Model licenses, data information, code availability and use restrictions must be evaluated separately.
sources:
  - title: The Open Source AI Definition 1.0
    publisher: Open Source Initiative
    accessedAt: "2026-06-24"
    url: https://opensource.org/ai/open-source-ai-definition
tags:
  - Open Weights
  - Local AI
  - Model Licensing
  - Quantization
disciplines:
  - Artificial Intelligence
  - Open Source
  - Programming
  - Digital Independence
---

## Definition

An open-weight model makes learned parameters available for download and inference. Availability may permit local deployment, evaluation, quantization or fine-tuning, but the exact freedoms depend on the license and supplied components.

## Open source distinction

The Open Source AI Definition requires freedoms to use, study, modify and share, together with the preferred form for modification. A weight release may omit training data information or training code and therefore remain open-weight rather than fully open source.

## Applications

Open-weight models support private local assistants, offline tools, edge deployments, reproducible experiments and specialized creative systems.

## Electronic Artefacts position

Local and open-weight models are relevant where archives, unreleased audio, project documents or private graphs should remain under operator control. Deployment choices must still account for provenance, security, performance and licensing.

## Limitations

Running weights locally does not remove model bias, hallucination, data rights concerns or maintenance cost. Hardware requirements, context limits and update procedures remain operational constraints.

## References

See the OSI Open Source AI Definition, llama.cpp, Open Source and Provenance.
