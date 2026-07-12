---
id: ea:publication:knowledge-graphs-for-cultural-infrastructure-fr
type: publication
slug:
  canonical: knowledge-graphs-for-cultural-infrastructure
title: Graphes de connaissances pour les infrastructures culturelles
subtitle: Article technique
abstract: "Cet article explique comment les graphes de connaissances soutiennent l'infrastructure culturelle en donnant aux personnes, aux œuvres, aux sources, aux concepts, aux projets et aux archives des identités stables et des relations explicites."
description: "Un article technique sur les graphes de connaissances, le patrimoine culturel, la provenance et les pages du savoir public, relié au Vestiges et au graphique d’Electronic Artefacts."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.1.1
  createdAt: 2026-06-23
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:knowledge-graph
  - id: ea:concept:entity-identity
  - id: ea:concept:provenance
  - id: ea:technology:rdf
  - id: ea:project:vestiges
claims:
  - "Les graphes de connaissances culturelles sont utiles lorsqu'ils préservent la provenance, l'incertitude et la sémantique des relations plutôt que seulement la connectivité."
  - "Un graphe public peut être construit à partir de pages statiques si des enregistrements, des routes, des données structurées et des relations sont générés à partir de sources typées."
evidence:
  - id: ea:project:vestiges
  - id: ea:program:vaste
sources:
  - title: RDF 1.1 Concepts and Abstract Syntax
    publisher: W3C
    publishedAt: 2014-02-25
    accessedAt: 2026-06-23
    url: https://www.w3.org/TR/rdf11-concepts/
  - title: The CIDOC Conceptual Reference Model
    publisher: CIDOC CRM Special Interest Group
    accessedAt: 2026-06-23
    url: https://www.cidoc-crm.org/
  - title: PROV-Overview
    publisher: W3C
    publishedAt: 2013-04-30
    accessedAt: 2026-06-23
    url: https://www.w3.org/TR/prov-overview/
citation:
  preferred: Electronic Artefacts. "Graphes de connaissances pour les infrastructures culturelles".
    Article technique, version 1.1.1, 2026.
tags:
  - graphe de connaissances
  - infrastructure culturelle
  - Linked Data
  - Provenance
  - Vestiges
disciplines:
  - systèmes de connaissance
  - archives
  - architecture de l’information
  - méthodes de recherche
translationOf: ea:publication:knowledge-graphs-for-cultural-infrastructure
---

## Problème

Les connaissances culturelles sont rarement simples. Une technique artisanale peut appartenir à une personne, un lieu, une école, une tradition matérielle, un ensemble d'outils, une période historique et une pratique vivante. Une œuvre musicale peut être une sortie, une performance, un fichier, un objet mémoire, un ensemble de décisions de production et la preuve d'une question de recherche plus large. Une archive de conception peut contenir des images finales, des croquis rejetés, des informations sur les droits, des versions logicielles, des références et un contexte oral.

Les sites traditionnels aplatissent cette complexité. Ils publient des pages, des catégories et des tags, mais les relations entre les choses restent vagues. Une étiquette peut dire que deux enregistrements concernent à la fois "audio" ou "archives", mais elle ne peut expliquer qu'un document en cite un autre, qu'un projet applique un concept, qu'un programme alimente une plateforme, ou qu'un objet est une preuve d'une revendication.

Le résultat est familier: les plateformes culturelles deviennent des catalogues attrayants mais peu profonds. Les moteurs de recherche peuvent trouver des pages individuelles, mais ils ne peuvent pas comprendre le système. Les lecteurs humains peuvent naviguer, mais ils ne peuvent pas facilement suivre la lignée, la provenance, la méthode ou l'influence. Les systèmes de récupération de l'intelligence artificielle peuvent extraire des paragraphes isolés sans savoir d'où vient une revendication ou d'où les enregistrements internes doivent être lus ensuite.

Un graphe de connaissances aborde ce problème en faisant des entités et des relations des objets de première classe.

## Présentation

Un graphe de connaissances est un réseau structuré d'entités et de relations typées. Dans la pratique, cela signifie qu'une personne, un projet, une publication, un concept, un outil, une oeuvre d'art, un dossier d'archives ou une organisation reçoit une identité stable, puis que le site enregistre des relations significatives entre ces identités.

Le mot important est "signifiant". Un graphe de connaissances n'est pas utile parce qu'il dessine de nombreuses lignes. Il est utile lorsque ces lignes ont des prédicats qui peuvent être interprétés : `documents`, `appliesConcept`, `usesTechnology`, `poweredBy`, `derivedFrom`, `publishedBy`, `evidencedBy`. Ces prédicats permettent aux lecteurs et aux machines de distinguer une citation d'une dépendance, une étude de cas d'une influence et un composant d'une source.

Pour Electronic Artefacts, cela importe parce que le site n'est pas seulement un portfolio. Il contient des logiciels, des projets artistiques, des domaines de recherche, des publications, des concepts, des archives et des travaux commerciaux. Un blog linéaire séparerait ces objets en messages. Un graphe de connaissances permet à chaque nouvelle publication de renforcer les entités existantes.

## Contexte

Le Web a toujours été un système de liaison, mais chaque lien n'est pas une relation sémantique. Un lien à l'intérieur d'un essai peut être navigation, rhétorique, évident ou décoratif. Une relation typée est différente : elle indique ce qui relie deux enregistrements.

RDF formalise les énoncés graphiques en triples sujet-objet-prédicat. Ce modèle est utile parce qu'il sépare la chose décrite, la relation et la cible. Le CRM CIDOC est utile pour le patrimoine culturel car il montre comment les données culturelles ont besoin d'une structure conceptuelle partagée entre les personnes, les événements, les objets, les lieux et les documents. W3C PROV est utile car il traite la provenance comme une information sur les entités, les activités et les personnes impliquées dans la production d'une chose.

Electronic Artefacts n'a pas besoin de reproduire chaque musée ou standard sémantique-web en interne. La leçon stratégique est plus simple : l'infrastructure culturelle a besoin d'une identité stable, typée, de provenance et d'examen.

## Historique

L'idée de savoir connecté a une longue histoire pré-web. Bibliothèques, catalogues, index des citations, musées et archives ont toujours essayé de relier les œuvres aux auteurs, sujets, dates, lieux et sources. Le Web a rendu le lien public et bon marché, mais les premières pages Web ont généralement lié des documents plutôt que de modeler les choses à l'intérieur.

La recherche sur le Web sémantique a fait une revendication plus forte : le Web pourrait décrire les ressources de manière lisible par machine. Les pratiques liées aux données se sont ensuite concentrées sur les identifiants stables et les connexions entre les ensembles de données. Les communautés du patrimoine culturel ont mis au point des modèles comme le CRM du CIDOC parce que les documents des musées et des archives ne pouvaient être intégrés de façon fiable au moyen de métadonnées peu profondes.

Les graphes de connaissances ont entré le vocabulaire produit et de recherche plus tard, mais le problème sous-jacent est plus ancien : comment un système peut-il préserver le sens de l'évolution des documents, des institutions, des technologies et des lecteurs?

## Concepts fondamentaux

Le premier concept est l'identité de l'entité. Un document doit savoir s'il décrit un concept, un projet, une personne, une publication ou un artefact. Il faut aussi un identifiant stable qui ne devrait pas changer lorsque le titre, la conception de la page ou le résumé changent.

Le deuxième concept est la sémantique des relations. "Relié" suffit rarement. Si une publication explique un concept, la relation doit être `defines` ou `documents`. Si un projet utilise un runtime, il devrait dire `poweredBy`. Si un concept a influencé un cadre, il devrait dire `influencedBy`.

Le troisième concept est la provenance. Les connaissances culturelles dépendent du contexte. Un graphique devrait consigner les sources, les auteurs, les éditeurs, les dates, la confiance et les preuves, car ces éléments aident les lecteurs à évaluer la confiance.

Le quatrième concept est la projection publique. Une base de données privée ne devient pas un graphe de connaissances publique avant de produire des pages lisibles, des documents de recherche, JSON-LD, des plans de site, des URL canoniques et des exportations que d'autres systèmes peuvent consommer.

## Architecture

Un graphe de connaissances culturelles pratiques a besoin de quelques couches.

La couche source stocke les enregistrements canoniques. Dans ce dépôt, ces enregistrements vivent dans le contenu avant et corps de Markdown sous `content/`. La couche relation stocke les relations typées dans YAML. La couche de validation vérifie les ID, autorise les prédicats, la visibilité publique et les champs requis. La couche de rendu génère du HTML public, des routes d’identification, JSON-LD, des voisinages du graphe et des documents de recherche.

Cette architecture est délibérément statique. Il ne nécessite pas de base de données côté serveur pour publier des connaissances graphiques utiles. L'étape de construction devient l'autorité : elle valide le corpus, rend des pages complètes et écrit des sorties lisibles par machine.

Ce choix est important pour l'édition culturelle car la production statique est durable. Un futur lecteur, rampeur ou archive peut inspecter la page générée sans avoir besoin d'un serveur d'application en cours d'exécution.

## Mise en œuvre

Le schéma de mise en œuvre est simple :

1. Définir les types d'entités. 2. Donnez à chaque enregistrement une identification canonique et un itinéraire. 3. Exiger des métadonnées de publication. 4. Gardez le contenu du corps suffisamment substantiel pour rester seul. 5. Entreposez les relations comme relations typées. 6. Générer des pages et JSON-LD de la même source. 7. Construire des documents de recherche à partir de titres, résumés, corps, balises et relations. 8. Rejeter les références interrompues pendant la validation.

Le graphique d'Electronic Artefacts applique déjà ce modèle à VASTE, Runtime Theory, Graph Runtime et Vestiges. Cet article étend le même modèle à un centre de connaissances plus large.

## Applications pratiques

Pour Vestiges, un graphe de connaissances peut relier les personnes, les techniques, les matériaux, les oeuvres, les documents et les institutions. Un lecteur pourrait partir d'un matériel d'artisanat, le suivre à une technique, puis à un praticien, puis à une publication, puis à un enregistrement de provenance.

Pour les Palimpsestes, un graphique peut connecter des pistes, des références visuelles, des analyses audio, des concepts de mémoire, l'archéologie des signaux et le contexte de publication.

Pour VASTE, un graphique peut documenter les concepts d'exécution et montrer où ils sont appliqués dans les projets.

Pour le site public, un graphique améliore le référencement parce que chaque article devient un itinéraire vers les enregistrements canoniques connexes. Il améliore la découverte de l'IA parce que les sources, les identifiants et les relations sont explicites.

## Outils

Parmi les outils et normes utiles, mentionnons RDF pour la réflexion des graphiques, JSON-LD pour les données structurées, Schema.org pour les métadonnées web, PROV pour la provenance, CRM CIDOC pour la modélisation du patrimoine culturel, la génération statique de sites pour la production durable et les index de recherche construits à partir d'enregistrements structurés.

## Éléments de preuve

La construction actuelle d'Electronic Artefacts génère déjà des pages d'entités canoniques, des routes d’identification, des fichiers JSON-LD, des documents de recherche, un plan du site et des quartiers de graphes locaux. Cela signifie que le graphe de connaissances n'est pas théorique. C'est le support de publication du site.

Vestiges est un cas d'application prévu car il cartographiera les pratiques artistiques et artisanales sans aplatir les gens, les matériaux et les techniques en cartes isolées.

## Concepts connexes

Lisez les enregistrements pour [Graphe de connaissances](/fr/knowledge/concepts/knowledge-graph/), [Identité de l'entité](/fr/knowledge/concepts/entity-identity/), [Provenance](/fr/knowledge/concepts/provenance/), [Données liées](/fr/knowledge/concepts/linked-data/) et [Runtime de graphe](/fr/knowledge/concepts/graph-runtime/).

## Lecture suggérée

Commencez par W3C RDF 1.1 Concepts, l'aperçu CRM CIDOC et W3C PROV. Ensuite, comparez ces modèles avec les enregistrements Electronic Artefacts pour VASTE, Runtime Theory et Vestiges.

## Articles connexes

Continuer avec [Pages liées aux données et aux connaissances publiques](/fr/publications/linked-data-and-public-knowledge-pages/) et [Exécution contextuelle et exécution graphique](/fr/publications/contextual-execution-and-graph-runtimes/).

## Glossaire

Entité: une chose avec l'identité dans le graphique.

Prédice : la relation nommée entre deux entités.

Provenance : information sur l'origine, la paternité, l'activité et la transformation.

URL canonique : l'URL publique préférée pour un enregistrement.

Itinéraire d'identification : un itinéraire stable orienté vers la machine pour une entité.

## Limites

Les graphes de connaissances peuvent devenir sur-modèles. Chaque nom ne mérite pas une entité. Toutes les associations ne méritent pas une relation. La discipline éditoriale est nécessaire pour éviter les doubles emplois, les prédicats faibles et le bruit.

Le graphique devrait également éviter une fausse certitude. Les connaissances culturelles contiennent souvent de l'incertitude, une interprétation contestée et une provenance incomplète. Un bon graphique enregistre la confiance plutôt que de la cacher.

## Références

- W3C. RDF 1.1 Concepts et syntaxe abstraite. 2014.
- CRM CIDOC Groupe d'intérêt spécial. Modèle conceptuel de référence du CIDOC.
- W3C. Aperçu de PROV. 2013.
- Electronic Artefacts. VASTE, Runtime Theory, Graph Runtime et Vestiges records.
