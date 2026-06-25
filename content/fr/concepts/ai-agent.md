---
id: ea:concept:ai-agent-fr
type: concept
slug:
  canonical: ai-agent
title: Agent d’IA
definition: An AI agent est un software système dans which a modèle can select
  actions, use outils, observe results et adapt its next steps toward an
  objective within defined boundaries.
abstract: AI agents combine modèles, outils, mémoire, environmental feedback,
  stopping conditions, permissions et evaluation dans an iterative action loop.
description: A canonical definition distinguishing AI agents from fixed AI
  workflows et conventional automation.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: validated
version:
  version: 1.0.0
  createdAt: 2026-06-24
  publishedAt: 2026-06-25
  modifiedAt: 2026-06-25
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Outil use
  - Planning
  - Environmental feedback
  - Mémoire et state
  - Permissions
  - Stopping conditions
exclusions:
  - A fixed sequence de modèle calls avec no modèle-directed action selection
  - Unbounded autonomy avec no observable state ou control surface
claims:
  - Agency est un architectural property de the whole système, not a property de
    the modèle output alone.
  - Agents require stronger permissions, observability et evaluation than
    deterministic workflows.
sources:
  - title: Building Effective Agents
    author: Erik Schluntz et Barry Zhang
    publisher: Anthropic
    publishedAt: 2024-12-19
    accessedAt: 2026-06-24
    url: https://www.anthropic.com/engineering/building-effective-agents
tags:
  - AI Agents
  - Outil Use
  - Automation
  - Orchestration
  - Human Oversight
disciplines:
  - Intelligence artificielle
  - Systèmes Design
  - Human Computer Interaction
  - Software Architecture
translationOf: ea:concept:ai-agent
---

## Rôle

Agent d’IA est documenté ici comme une entrée française du graphe public d’Electronic Artefacts. AI agents combine modèles, outils, mémoire, environmental feedback, stopping conditions, permissions et evaluation dans an iterative action loop.

## Usage

Cette notion sert à relier les projets, publications et technologies qui partagent un même vocabulaire de conception. An AI agent est un software système dans which a modèle can select actions, use outils, observe results et adapt its next steps toward an objective within defined boundaries.

## Domaines

Cette entrée croise notamment les domaines suivants : Intelligence artificielle, Systèmes Design, Human Computer Interaction, Software Architecture.

## Références

Les références principales restent les sources indiquées dans la fiche canonique, notamment Building Effective Agents.
