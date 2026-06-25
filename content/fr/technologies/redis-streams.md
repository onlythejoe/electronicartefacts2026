---
id: ea:technology:redis-streams-fr
type: technology
translationOf: ea:technology:redis-streams
slug: { canonical: redis-streams }
title: Redis Streams
abstract: Redis Streams est un type de données de journal en ajout seul comprenant des entrées ordonnées, des lectures par plage, l’élagage et le traitement par groupes de consommateurs.
description: Fiche technologique consacrée aux flux d’événements, à l’orchestration et au traitement en temps réel.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: production
confidence: canonical
version: { version: 1.0.0, createdAt: "2026-06-24", publishedAt: "2026-06-25", modifiedAt: "2026-06-25" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
category: database
roleInEcosystem: Redis Streams fournit une primitive compacte de journal d’événements et de groupes de consommateurs pour l’orchestration, les projections et les services temps réel.
officialUrl: https://redis.io/docs/latest/develop/data-types/streams/
sources: [{ title: Redis Streams, publisher: Redis, accessedAt: "2026-06-24", url: https://redis.io/docs/latest/develop/data-types/streams/ }]
tags: [Redis Streams, Journal d’événements, Groupes de consommateurs, Orchestration]
disciplines: [Architecture logicielle, Programmation, Systèmes distribués]
---

## Rôle

Redis Streams stocke des entrées ordonnées dans une structure en ajout seul et prend en charge plusieurs modèles de consommation, dont les groupes de consommateurs et le suivi des entrées en attente.

## Usage

Il peut soutenir distribution de tâches, projections d’événements, flux d’intégration et traitements temps réel lorsque Redis correspond aux besoins d’échelle et de durabilité.

## Références

Consulter la documentation officielle Redis Streams.
