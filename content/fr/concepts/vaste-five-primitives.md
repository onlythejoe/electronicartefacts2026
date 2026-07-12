---
id: ea:concept:vaste-five-primitives-fr
type: concept
translationOf: ea:concept:vaste-five-primitives
slug:
  canonical: vaste-five-primitives
title: Les cinq primitives de VASTE
definition: VASTE possède un vocabulaire fermé de cinq primitives — Vertex, Tie, Action, Surface et Environment — qui composent identité de graphe, topologie, changement admis, observation et contexte local d’exécution.
abstract: Guide fondé sur les contrats des cinq primitives irréductibles de VASTE, de leurs invariants et des notions qui ne doivent pas être prises pour des primitives.
description: Vertex, Tie, Action, Surface et Environment expliqués depuis les contrats, validateurs et tests d’intégration VASTE.
locale: fr
visibility: public
publicationClass: canonical
status: experimental
maturity: development
confidence: validated
version:
  version: 1.0.0
  createdAt: "2026-07-11"
  publishedAt: "2026-07-11"
  modifiedAt: "2026-07-11"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Contrats des primitives et invariants runtime
  - Racines System et adressage du graphe
  - Vérité canonique, projection et contexte local
exclusions:
  - Sémantique produit des extensions
  - System, Actor ou Workspace comme primitives supplémentaires
claims:
  - Le vocabulaire fondamental est fermé à cinq primitives.
  - Les données des primitives restent explicites, sérialisables et séparées de l’autorité runtime.
tags: [VASTE, Runtime, Primitives, Graphe]
disciplines: [architecture logicielle, systèmes d’exécution]
---

## Vocabulaire fermé

VASTE n’autorise aucune sixième primitive. System, Actor, Workspace, Program, projection, host et extension sont composés au-dessus de cette couche. Le kernel reste ainsi indépendant du sens des produits.

## Vertex

Un Vertex est une donnée sans comportement avec `id`, `systemId`, type namespaced, `data` sérialisable et métadonnées optionnelles. Le validateur refuse fonctions, références circulaires, nombres non finis et versions invalides. Chaque Vertex appartient à une partition System. Un System neuf possède un Vertex `system:root` ; le `systemId` établit l’appartenance, les Ties précisent la topologie.

## Tie

Un Tie est une relation orientée possédant ID, System, extrémités, type namespaced, référence de domaine et métadonnées. Les frontières d’endpoints et de System sont validées. Toute relation inter-System doit déclarer explicitement permission et cible. Un Tie n’est pas un canal de mutation caché.

## Action

Une Action décrit une intention admise. Son contrat impose forme déclarative, sérialisable, rejouable et déterministe, namespace, autorité, niveau d’accès, entrées/sorties, préconditions, postconditions, erreurs et transitions. La validation refuse handlers et champs de mutation directe. Routage et effets appartiennent au runtime.

## Surface

Surface est la membrane sans autorité par laquelle un Vertex-System est observé ou sollicité. Son invariant refuse les champs de runtime, store, dispatch ou mutation. `SurfaceSpec` enrichit cette membrane ; lifecycle et projection restent au runtime. Web, shell, API ou stream sont des supports, pas l’identité de la Surface.

Cette membrane appartient au Vertex sélectionné ; elle n’est pas un nœud supplémentaire dans une vue du graphe. Cette vue dessine uniquement Vertex et Ties, puis expose Surface, Environment, extensions attachées et Actions disponibles depuis le Vertex sélectionné.

## Environment

Environment est immuable et recréé pour chaque exécution. Il transporte System résolu, identité, claims d’autorité, permissions, scope, trace, tick, budgets et éventuellement une position dans le graphe. Il ne conserve explicitement ni persistance, ni état métier, ni résultat entre deux exécutions.

Opérationnellement, c’est aussi là que le runtime résout le jeu d’Actions disponible au niveau d’un Vertex et le contexte local de contenance des Vertex imbriqués. Ce contexte s’inspecte depuis le Vertex ; Environment et Action ne sont pas dessinés comme nœuds du graphe.

## Frontières essentielles

- **System** : partition d’isolation et clôture racine, pas une primitive.
- **Actor** : extension d’identité et d’admission.
- **Partition** : enregistrements portant un même `systemId`.
- **Closure** : structure portable sélectionnée, System entier ou sous-arbre.
- **Projection** : observation dérivée, jamais vérité canonique par elle-même.
- **Environment** : contexte local exclu des packages portables.

## Preuve et limite

Les contrats sont dans `packages/contracts/src/primitives.ts`, les validateurs dans `src/primitives`, et les tests couvrent namespaces, frontières, exécution et pureté du kernel. Ces validations internes soutiennent les claims sur les primitives, pas l’achèvement de chaque extension ou couche future.
