---
id: ea:artefact:vab-interface-prototype-fr
type: artefact
slug:
  canonical: vab-interface-prototype
title: Prototype d’interface VAB
subtitle: Étude d’interaction pour Assisted Boot
abstract: Prototype navigateur conservé qui explore conversation VAB, mémoire modifiable, transition cérémonielle et révélation du graphe sans se substituer à l’implémentation runtime de VASTE.
description: Fiche d’archive factuelle du prototype autonome HTML, CSS et JavaScript de l’interface VAB créé en juillet 2026.
locale: fr
visibility: public
publicationClass: published
status: archived
maturity: prototype
confidence: observed
version:
  version: 1.0.0
  createdAt: "2026-07-07"
  publishedAt: "2026-07-13"
  modifiedAt: "2026-07-13"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
artefactType: prototype
createdAt: "2026-07-07"
provenance: Prototype autonome HTML, CSS et JavaScript conservé dans les archives de design-recherche VASTE d’Electronic Artefacts avec ses notes d’intégration et une façade runtime documentée.
format: Archive HTML, CSS et JavaScript
preservationStatus: stable
significance: Le prototype rend inspectable le modèle d’interaction d’Assisted Boot tout en maintenant une frontière stricte entre simulation d’interface et service Boot Assist implémenté séparément dans VASTE.
sources:
  - title: Notes d’intégration VAST Assisted Boot
    publisher: Electronic Artefacts
    accessedAt: "2026-07-13"
    locator: Archive de design-recherche VASTE, vast-assisted-boot-prototype/INTEGRATION_NOTES.md
  - title: Sources du prototype navigateur VAB
    publisher: Electronic Artefacts
    accessedAt: "2026-07-13"
    locator: Archive de design-recherche VASTE, vast-assisted-boot-prototype/index.html et script.js
tags: [VASTE, VAB, Assisted Boot, prototype d’interface, interaction humain-machine]
disciplines: [design d’interaction, systèmes runtime, interaction humain-machine]
translationOf: ea:artefact:vab-interface-prototype
---

## Description

Le prototype d’interface VAB est une étude navigateur autonome du langage d’interaction de VASTE Assisted Boot. Il explore une surface de conversation continue, un Actor authentifié fourni par la session, une projection de mémoire modifiable, une transition vers une cérémonie visuelle et une révélation finale du graphe.

Son runtime JavaScript expose des fonctions inspectables pour le brouillon, l’aperçu cognitif, les éléments de mémoire, l’état de cérémonie et le graphe final. Elles constituent une façade de test du prototype ; elles ne sont ni le graphe canonique ni la couche d’autorité de VASTE.

## Provenance

L’archive conservée contient HTML, CSS, JavaScript et notes d’intégration. Ces notes décrivent comment un orchestrateur pourrait fournir lignes structurées, état de processus, timings vocaux et projections de graphe. Elles distinguent explicitement les aperçus locaux de l’état canonique du runtime.

Le dépôt VASTE actuel contient séparément contrats Boot Assist, service, adaptateurs runtime, matérialisation web et tests d’intégration. Cet artefact documente uniquement le prototype de design autonome et ne doit pas servir seul à prouver ces capacités runtime.

## Importance

Le prototype étudie une question produit difficile à résoudre par un schéma statique : comment rendre lisibles dans une seule interaction l’intention initiale, la compréhension provisoire, la correction humaine et la naissance gouvernée d’un système ?

Il fixe aussi plusieurs invariants. L’identité vient d’une session admise et non d’une inférence conversationnelle. Une croyance provisoire n’est pas un fait. Modifier la projection visible de la mémoire ne doit pas muter directement le world model brut. Dans ce prototype, entrer dans la cérémonie prévisualise une acceptation ; cela ne prouve pas qu’un backend a admis la requête.

## Droits

L’archive est un artefact de recherche Electronic Artefacts. Cette fiche publique documente son rôle et ses limites sans publier configuration runtime privée, credentials ou données conversationnelles.

## Limites

L’archive ne prouve ni un assistant de production ni un handover Genesis complet. Conversation scriptée et aperçu cognitif local sont des simulations d’interface. La capture micro et la transcription navigateur peuvent être exercées, mais elles ne prouvent pas compréhension par un modèle, écriture en mémoire canonique, provisioning runtime ou pipeline TTS.
