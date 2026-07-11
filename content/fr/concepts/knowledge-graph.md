---
id: ea:concept:knowledge-graph-fr
type: concept
slug:
  canonical: knowledge-graph
title: Graphe de connaissances
definition: Un graphe de connaissances est un réseau structuré d’entités, d’identifiants et de relations typées qui rend les connaissances navigables, interrogeables et réutilisables.
abstract: Electronic Artefacts emploie le graphe de connaissances comme modèle de publication reliant concepts, projets, programmes, sources et artefacts par des identités stables et des relations explicites.
description: Une définition canonique du graphe de connaissances appliquée à la publication culturelle, technique et scientifique.
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
  - identité des entités
  - relations typées
  - publication sémantique
  - recherche de connaissances
  - infrastructure culturelle
exclusions:
  - une visualisation décorative dépourvue d’identifiants stables
  - un nuage de tags sans sémantique relationnelle explicite
  - un schéma de base de données jamais exposé comme connaissance publique
claims:
  - Un graphe de connaissances devient durable lorsque les entités, relations, sources et versions sont explicites.
  - Les graphes culturels exigent provenance et contexte interprétatif, pas seulement une connectivité technique.
sources:
  - title: RDF 1.1 Concepts and Abstract Syntax
    author: Richard Cyganiak, David Wood and Markus Lanthaler
    publisher: W3C
    publishedAt: 2014-02-25
    accessedAt: 2026-06-23
    url: https://www.w3.org/TR/rdf11-concepts/
  - title: The CIDOC Conceptual Reference Model
    publisher: CIDOC CRM Special Interest Group
    accessedAt: 2026-06-23
    url: https://www.cidoc-crm.org/
tags:
  - graphe de connaissances
  - Web sémantique
  - entités
  - Relations
  - Recherche
disciplines:
  - systèmes de connaissance
  - architecture de l’information
  - développement web
  - Recherche
translationOf: ea:concept:knowledge-graph
---

## Définition

Un graphe de connaissances est un réseau structuré d’entités, d’identifiants et de relations typées. Il ne se réduit pas à une visualisation d’éléments associés. Un graphe durable attribue une identité stable à chaque objet important, précise la nature de ses liens et permet aux personnes, aux logiciels et aux moteurs de recherche de les interpréter.

Dans Electronic Artefacts, le graphe relie concepts, projets, programmes, publications, champs de recherche, organisations et artefacts. Un projet peut appliquer un concept, une publication documenter un champ et un programme mettre en œuvre un cadre. Une œuvre culturelle peut ainsi être reliée au signal, à la mémoire, à la conservation et aux méthodes de production sans être réduite à une simple fiche promotionnelle.

## Périmètre

Le concept comporte trois couches. La première est l’identité : chaque objet significatif possède une fiche adressable. La deuxième est la relation : chaque lien indique le type de connexion qu’il représente. La troisième est la publication : le graphe produit des pages, des métadonnées, des documents de recherche et des représentations lisibles par machine qui subsistent hors d’une session de navigation.

RDF décrit les déclarations sous forme de triplets sujet-prédicat-objet et emploie des IRI pour identifier les ressources. Electronic Artefacts ne reproduit pas nécessairement toute architecture RDF en interne, mais en retient la discipline : une identité stable et des prédicats explicites résistent mieux que des associations libres.

## Usage culturel

Une infrastructure culturelle doit pouvoir représenter l’ambiguïté. Une œuvre sonore peut être simultanément un artefact, une publication, une trace de processus et une preuve liée à une question de recherche. Une personne peut intervenir comme artiste, contributrice, responsable de maintenance ou sujet. Un concept peut passer d’un état spéculatif à un statut canonique.

Le CIDOC CRM constitue ici une référence importante : conçu pour l’intégration du patrimoine culturel, il montre pourquoi musées, archives et bibliothèques ont besoin de structures conceptuelles partagées plutôt que de champs isolés.

## Position d’Electronic Artefacts

Electronic Artefacts considère le graphe comme un modèle de publication, pas comme une infrastructure invisible. Il oriente l’écriture des pages, l’association des preuves, la création d’URL canoniques et la découverte des travaux connexes.

La différence avec un blog est structurelle. Un billet est principalement chronologique ; une fiche de graphe est principalement relationnelle. Les publications conservent dates, auteurs et arguments, mais enrichissent des entités durables au lieu de disparaître dans un flux.

## Applications

Les graphes de connaissances servent les bibliothèques de recherche, archives culturelles, documentations logicielles, mémoires institutionnelles, catalogues musicaux, systèmes de design et dispositifs de recherche augmentée. Ils permettent de passer d’un terme à ses exemples, puis des exemples à leurs sources et aux questions associées.

## Limites

Un graphe devient bruyant lorsque les relations restent vagues ou que chaque association faible est publiée. Il devient fragile lorsque ses identifiants changent. Sa qualité dépend donc d’une discipline éditoriale : vocabulaires contrôlés, validation des relations, revue des sources et élagage périodique.

## Références

Voir RDF 1.1 Concepts, le CIDOC CRM, le champ Théorie du runtime et le programme VASTE.
