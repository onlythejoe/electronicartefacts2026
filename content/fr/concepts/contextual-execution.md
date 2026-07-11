---
id: ea:concept:contextual-execution-fr
type: concept
slug:
  canonical: contextual-execution
title: Exécution contextuelle
definition: L’exécution contextuelle consiste à faire de l’identité, de l’état, des permissions, des relations et du contexte opérationnel des contraintes actives sur ce qu’un système peut accomplir.
abstract: L’exécution contextuelle évalue une opération à partir de l’identité des entités, des relations du graphe, des permissions, de l’état temporel et du périmètre visé.
description: Un concept canonique reliant runtime de graphe, Théorie du runtime, VASTE et systèmes sensibles à l’identité.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: canonical
version:
  version: 1.1.0
  createdAt: 2026-06-23
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - contexte d’exécution
  - identité
  - permissions
  - relations du graphe
  - propagation des événements
exclusions:
  - un appel de fonction global sans relation avec l’utilisateur, l’état ou l’entité concernée
  - un libellé statique qui n’intervient jamais dans la logique d’exécution
claims:
  - Le contexte devient une question de runtime lorsqu’il modifie l’autorisation ou la pertinence d’une opération.
  - Un runtime de graphe doit définir ses frontières de contexte pour rester gouvernable.
tags:
  - contexte
  - Exécution
  - Runtime
  - Identité
  - permissions
disciplines:
  - conception de systèmes
  - programmation
  - systèmes de connaissance
  - architecture logicielle
translationOf: ea:concept:contextual-execution
---

## Définition

L’exécution contextuelle consiste à intégrer le contexte opérationnel à l’exécution. Le système ne demande pas seulement quelle opération a été sollicitée. Il examine qui la demande, quelle entité est concernée, quelles relations sont actives, dans quel état se trouve le système, quelles permissions s’appliquent et quelles conséquences doivent se propager.

Dans Electronic Artefacts, cette notion relie la Théorie du runtime à VASTE. Un runtime de graphe prend sa pleine signification lorsque l’identité et la structure relationnelle peuvent influer sur son comportement.

## Périmètre

Le concept englobe l’identité des personnes et des organisations, l’état des entités, leur visibilité, leur niveau de confiance, leur cycle de vie, les permissions, les relations, la portée des événements et leur validité temporelle. Il inclut également les frontières : où commence le contexte, où il s’arrête et quelles informations peuvent être héritées.

## Différence avec la configuration

Une configuration rassemble généralement des valeurs qui modifient le comportement d’un logiciel. L’exécution contextuelle est plus dynamique : elle peut dépendre de l’acteur courant, de l’entité ciblée, des voisins du graphe, de l’opération tentée et de l’historique des événements.

## Position d’Electronic Artefacts

Lorsqu’un contexte détermine l’autorité ou le sens d’une opération, il ne devrait pas rester enfoui dans du code applicatif incident. Il doit être modélisé de façon assez explicite pour être inspecté, testé et expliqué.

Dans un système de connaissances, une publication ou une archive peut être publique, interne, canonique, spéculative, archivée ou remplacée. Ces états ne doivent pas seulement changer son apparence : ils doivent aussi agir sur l’indexation, la visibilité dans le graphe, la citation et la publication des relations.

## Applications

L’exécution contextuelle s’applique aux flux éditoriaux, aux permissions d’archives, aux actions d’agents d’IA, aux systèmes de contribution culturelle, à la gouvernance de projets et aux runtimes comportant plusieurs acteurs.

## Limites

Le contexte peut devenir coûteux. Si chaque opération dépend d’une portion trop large du graphe, le système devient difficile à comprendre et à tester. L’enjeu pratique est d’identifier le contexte minimal nécessaire à une exécution correcte.

## Références

Voir Runtime de graphe, Théorie du runtime et VASTE.
