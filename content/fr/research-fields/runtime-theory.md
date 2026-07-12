---
id: ea:researchField:runtime-theory-fr
type: researchField
slug:
  canonical: runtime-theory
title: Théorie du runtime
subtitle: Champ de recherche
abstract: Runtime Theory étudie les identités, relations, contextes et primitives d’événement nécessaires pour qu’un système exécutable reste cohérent.
description: Champ de recherche actif d’Electronic Artefacts reliant le code archivé de VOID, ARCA, VASTE et la définition d’un runtime de graphe.
locale: fr
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: validated
version:
  version: 1.0.0
  createdAt: 2024-01-01
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-04
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
questions:
  - id: minimum-runtime
    status: active
    question: Quel minimum est nécessaire pour qu’un univers d’entités exécute des événements de manière cohérente ?
  - id: contextual-execution
    status: active
    question: Comment l’identité et le contexte doivent-ils contraindre l’exécution et la propagation des événements ?
scope:
  - Primitives d’exécution
  - Événements
  - Identité
  - Contexte
  - Propagation dans le graphe
findings:
  - L’identité et le contexte doivent être explicites lorsqu’ils déterminent l’autorité d’exécution.
  - Les relations typées d’un graphe peuvent devenir des contraintes opérationnelles, pas seulement des liens descriptifs.
openQuestions:
  - Comment borner le contexte d’exécution entre services distribués ?
  - Quelles opérations de graphe restent lisibles à grande échelle ?
tags:
  - Runtime
  - Theory
  - Exécution
  - Events
  - Primitives
disciplines:
  - Technologie
  - Recherche
  - Systèmes
translationOf: ea:researchField:runtime-theory
---

## Question de recherche

Runtime Theory demande ce qui est minimalement nécessaire pour qu’un univers d’entités exécute des événements de manière cohérente. Le champ étudie les primitives d’exécution, l’identité, le contexte, les relations, la propagation des événements et les limites qui rendent un système compréhensible.

## Origine

Le champ prolonge VOID, une base de code archivée qui cherchait à modéliser la réalité elle-même dans un programme plutôt qu’à construire un logiciel métier conventionnel. Ses recherches sur les pensées fractales, les systèmes et leur unification ont posé une part importante des fondations théoriques actuelles. VOID a ensuite nourri ARCA et, plus directement, VASTE, son successeur dans cette lignée runtime.

## Position actuelle

VASTE constitue aujourd’hui le principal contexte d’implémentation de Runtime Theory. Le programme traite les entités de graphe, les relations typées, l’identité et l’exécution contextuelle comme les parties d’un même modèle de runtime.

## Méthode de recherche

Le champ avance par modèles d’architecture, prototypes, notes d’implémentation, observations de performance et projets appliqués. Les concepts sont conservés lorsqu’ils peuvent être formulés précisément et inspectés par des preuves.

## Applications

Vestiges applique Runtime Theory à une plateforme de connaissance culturelle. Sa thèse publique dépend d’entités adressables et de relations historisées, tandis que son modèle opérationnel exige permissions, contexte de contribution et propagation contrôlée.

## Questions ouvertes

Les travaux en cours portent sur le bornage du contexte entre services distribués, la lisibilité des grands systèmes de graphe et la relation entre modèles expressifs et exécution prévisible.
