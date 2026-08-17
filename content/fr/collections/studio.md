---
id: ea:collection:studio-fr
type: collection
translationOf: ea:collection:studio
slug:
  canonical: studio
title: Studio
subtitle: Série de logiciels open source
abstract: "Studio est la série de logiciels open source d’Electronic Artefacts : des instruments de navigateur local-first qui transforment des pratiques créatives spécialisées en outils inspectables, portables et librement utilisables."
description: Collection éditoriale de la gamme Studio open source, ouverte avec Voice Capture Studio et préparée pour accueillir Spatial Mapping Studio lorsque sa fiche publique aura la maturité nécessaire.
locale: fr
visibility: public
publicationClass: published
status: active
maturity: development
confidence: published
version:
  version: 1.0.0
  createdAt: "2026-08-17"
  publishedAt: "2026-08-17"
  modifiedAt: "2026-08-17"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
thesis: "Studio rend lisible une famille d’outils créatifs spécialisés comme logiciels publics : chaque application est utile seule, reste locale quand c’est possible, paraît avec son code inspectable et échange des artefacts durables plutôt que de retenir les personnes dans une plateforme."
curator:
  - id: ea:organization:electronic-artefacts
explicitMembers:
  - id: ea:project:voice-capture-studio
  - id: ea:artefact:voice-capture-studio-repository
  - id: ea:concept:open-source
  - id: ea:concept:browser-software
  - id: ea:concept:provenance
selectionNote: Cette collection réunit des logiciels publics et inspectables, ainsi que les notions nécessaires pour lire leurs frontières local-first, leurs sorties portables et leurs engagements de maintenance. Spatial Mapping Studio la rejoindra lorsque sa fiche projet et son dépôt public seront prêts à être publiés.
tags:
  - Studio
  - open source
  - local-first
  - logiciel de navigateur
  - outils créatifs
disciplines:
  - développement web
  - interaction humain-machine
  - open source
  - technologie créative
sources:
  - title: Dépôt Voice Capture Studio
    publisher: GitHub
    accessedAt: "2026-08-17"
    url: https://github.com/electronicartefacts/voice-capture-studio
  - title: Dépôt Spatial Mapping Studio
    publisher: GitHub
    accessedAt: "2026-08-17"
    url: https://github.com/electronicartefacts/spatial-mapping-studio
---

## Thèse

Studio est une gamme logicielle, non une suite de produits avec compte partagé ni une plateforme fermée. Chaque outil part d’une pratique concrète et reste utilisable de façon autonome : le code est public, le runtime est browser-native quand il sert le travail, et les matériaux des personnes restent entre leurs mains.

## Premier instrument

[Voice Capture Studio](/fr/projects/voice-capture-studio/) est la première application Studio publiée. Il traite capture, révision et segmentation de la voix comme des workflows locaux avec exports WAV et métadonnées ouverts, plutôt que comme un service qui absorbe les enregistrements dans une infrastructure distante.

## Prochaine fiche

Spatial Mapping Studio est la prochaine fiche prévue de Studio. Son dépôt V0 définit aujourd’hui un workflow d’auteur local autour d’un GLB final et d’un manifeste sémantique portable : on peut sélectionner des régions triangulaires stables, les nommer et les étiqueter, puis exporter un `artifact.json` qu’un viewer séparé sait résoudre.

Cette mention prépare le terrain ; elle ne constitue pas une promesse de release. Compréhension de scènes, segmentation automatisée, intégration Forge et intégrations aval plus larges restent des directions futures tant qu’elles ne sont pas documentées et publiées dans la fiche Spatial Mapping Studio.

## Grammaire commune

Les applications n’ont pas besoin de partager la même interface pour appartenir à la même gamme. Leur grammaire est plus structurelle : code libre et inspectable ; absence de publicité ; aucun compte ni dépendance cloud comme condition du workflow central ; frontières explicites entre stockage local et export ; sorties portables qui circulent vers d’autres outils sans perdre leur provenance.

Forge se situe près de cette gamme comme système de recherche interne pour des pipelines d’artefacts reproductibles. Le trajet envisagé est directionnel, et non une intégration déjà affirmée : un matériau source peut devenir un payload 3D final et stable via une préparation inspirée de Forge ; Spatial Mapping Studio peut ensuite y attacher des régions sémantiques. La spécification V0 précise que topologie et ordre des triangles ne doivent plus changer après le mapping.

## Évolution de la gamme

Une nouvelle fiche Studio ne doit entrer qu’avec une source publique, une licence déclarée, un niveau de maturité honnête et une explication utile de ce qui reste local, de ce qui est exporté et de ce qui n’est pas encore implémenté. La collection est faite pour grandir outil précis après outil précis.
