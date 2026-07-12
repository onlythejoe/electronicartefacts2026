---
id: ea:concept:graph-runtime-fr
type: concept
slug:
  canonical: graph-runtime
title: Runtime de graphe
definition: Runtime de graphe désigne les environnements d'exécution où les entités, relations,
  permissions et événements du graphe participent directement au calcul.
abstract: Electronic Artefacts emploie « runtime de graphe » pour désigner les systèmes où entités, relations, identité, contexte et événements forment une structure exécutable plutôt qu’un modèle de données passif.
description: Une définition canonique du runtime de graphe, de son périmètre et de ses liens avec VASTE, Théorie du runtime et Vestiges.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: canonical
version:
  version: 1.1.0
  createdAt: 2024-01-01
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - entités adressables
  - relations typées
  - exécution contextuelle
  - identité
  - événements et propagation
exclusions:
  - une visualisation statique sans sémantique d’exécution
  - un graphe de connaissances générique utilisé uniquement pour la recherche
claims:
  - La structure du graphe peut participer à l’exécution au lieu de rester une simple représentation des données.
  - Le contexte et l’identité doivent être explicites pour que l’exécution fondée sur le graphe reste gouvernable.
tags:
  - Graphe
  - Runtime
  - contexte
  - Identité
  - Exécution
disciplines:
  - architecture logicielle
  - systèmes de connaissance
translationOf: ea:concept:graph-runtime
---

## Définition

Un runtime de graphe est un environnement d’exécution dans lequel des entités adressables et des relations typées participent directement au calcul contextuel. Les nœuds ne sont pas de simples fiches à récupérer : ils peuvent porter une identité, un état et des capacités. Les relations peuvent contraindre ou autoriser la propagation des événements.

## Périmètre

Le concept couvre les structures minimales nécessaires à l’exécution d’opérations cohérentes : identité stable, relations typées, contexte, événements, permissions et transitions d’état observables.

Electronic Artefacts distingue le runtime de graphe du graphe de connaissances statique. Un graphe de connaissances décrit des faits et des connexions ; un runtime utilise cette structure pour décider ce qui peut s’exécuter, dans quel contexte et avec quelles conséquences.

## Position d’Electronic Artefacts

L’exécution sur graphe n’est utile que si elle demeure lisible et gouvernable. Un contexte qui détermine l’autorité, la visibilité ou le comportement ne doit pas rester dissimulé dans le code applicatif. L’identité et le type des relations appartiennent donc au modèle du runtime, et non à une couche décorative de métadonnées.

## Applications

VASTE est le programme principal à travers lequel Electronic Artefacts développe ce modèle. Vestiges applique cette thèse aux savoirs culturels et artisanaux, où personnes, techniques, matériaux, institutions, lieux et documents exigent des identités stables et des relations historiques explicites.

La Théorie du runtime porte la question de recherche sous-jacente : quel est le minimum nécessaire pour qu’un univers d’entités exécute des événements de manière cohérente ?

## Limites

Un runtime de graphe introduit des coûts de modélisation et de gouvernance. Des relations mal définies créent de l’ambiguïté, les graphes très connectés deviennent difficiles à raisonner et une propagation contextuelle sans limites peut provoquer des problèmes de sécurité ou de performance. Tous les workflows n’ont pas besoin d’un runtime de graphe.

## Références

Cette définition s’appuie sur le programme VASTE, le champ Théorie du runtime, l’architecture du projet Vestiges et la lignée fondatrice conservée par Electronic Artefacts.
