---
id: ea:concept:microservice-architecture-fr
type: concept
slug:
  canonical: microservice-architecture
title: Architecture de microservices
definition: Microservice architecture structures a software système comme
  independently deployable services aligned avec bounded capabilities et
  communicating through explicit contracts.
abstract: Microservices can improve independent evolution et scaling but add
  network, données, deployment, observability et organizational complexity.
description: A canonical definition comparing microservices avec modular
  monoliths et service-oriented systèmes.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: production
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
  - Service boundaries
  - Independent deployment
  - API et event contracts
  - Données ownership
  - Observability
  - Team topology
exclusions:
  - Splitting an application into many processes without coherent domain
    boundaries
  - Treating microservices comme the default architecture pour small systèmes
claims:
  - Microservice value depends on organizational et domain boundaries, not
    service count.
  - A modular monolith is often the stronger starting architecture when
    independent deployment is not required.
sources:
  - title: Microservices
    author: James Lewis et Martin Fowler
    publisher: MartinFowler.com
    publishedAt: 2014-03-25
    accessedAt: 2026-06-24
    url: https://martinfowler.com/articles/microservices.html
tags:
  - Microservices
  - Modular Monolith
  - Service Boundaries
  - Distributed Systèmes
disciplines:
  - Software Architecture
  - Systèmes Design
  - Programming
translationOf: ea:concept:microservice-architecture
---

## Rôle

Architecture de microservices est documenté ici comme une entrée française du graphe public d’Electronic Artefacts. Microservices can improve independent evolution et scaling but add network, données, deployment, observability et organizational complexity.

## Usage

Cette notion sert à relier les projets, publications et technologies qui partagent un même vocabulaire de conception. Microservice architecture structures a software système comme independently deployable services aligned avec bounded capabilities et communicating through explicit contracts.

## Domaines

Cette entrée croise notamment les domaines suivants : Software Architecture, Systèmes Design, Programming.

## Références

Les références principales restent les sources indiquées dans la fiche canonique, notamment Microservices.
