---
id: ea:publication:contextual-execution-and-graph-runtimes-fr
type: publication
slug:
  canonical: contextual-execution-and-graph-runtimes
title: Exécution contextuelle et runtimes de graphe
subtitle: Article technique
abstract: "Cet article explique l'exécution contextuelle comme principe d'exécution pour les systèmes où l'identité, les relations, les permissions et l'état influencent les opérations qui peuvent se produire."
description: "Un article technique reliant l'exécution contextuelle, l'exécution graphique, la théorie d'exécution et VASTE."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.2.0
  createdAt: 2026-06-23
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-18
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:contextual-execution
  - id: ea:concept:graph-runtime
  - id: ea:researchField:runtime-theory
  - id: ea:program:vaste
  - id: ea:concept:entity-identity
  - id: ea:concept:situated-actors-and-governance
  - id: ea:concept:vaste-extension-architecture
  - id: ea:concept:vaste-five-primitives
  - id: ea:concept:vast-portable-graph-format
  - id: ea:concept:autonomous-system
claims:
  - "L'exécution d'un graphique devient opérationnellement significative lorsque les relations et l'identité affectent l'exécution plutôt que seulement la description."
  - "Le contexte devrait être explicite lorsqu'il détermine les permissions, la visibilité, la propagation ou l'interprétation."
evidence:
  - id: ea:program:vaste
  - id: ea:researchField:runtime-theory
citation:
  preferred: Electronic Artefacts. "Exécution contextuelle et runtimes de graphe". Article technique,
    version 1.1.1, 2026.
tags:
  - Contextual Exécution
  - Graph Runtime
  - Runtime Theory
  - VASTE
  - conception de systèmes
disciplines:
  - conception de systèmes
  - programmation
  - systèmes de connaissance
  - architecture logicielle
translationOf: ea:publication:contextual-execution-and-graph-runtimes
---

## Problème

Les logiciels traitent souvent le contexte comme une préoccupation secondaire. Une fonction reçoit des entrées, exécute la logique et retourne la sortie. Les autorisations, l'identité, l'état de la relation, le statut de publication, la provenance et la visibilité peuvent être vérifiés ailleurs. Cela peut fonctionner pour les petits systèmes, mais il devient fragile lorsque la signification d'une opération dépend de l'endroit où elle se produit dans un graphique.

Considérez une plateforme de connaissances culturelles. Un utilisateur peut éditer un enregistrement, publier une note, créer une relation, citer une source ou exposer un élément d'archive. Chaque action dépend du contexte. Qui est l'acteur ? Quelle organisation possède le dossier? Le dossier est-il public, interne ou archivé? La relation est-elle permise ? La publication de ce document expose-t-elle une entité restreinte? L'article est-il canonique ou spéculatif ? Est-ce que la recherche de mise à jour de changement, JSON-LD et les vues graphiques locales?

Lorsque ces questions sont cachées dans le code d'application dispersé, le système devient difficile à raisonner. L'exécution contextuelle rend le contexte explicite.

## Présentation

L'exécution contextuelle est la pratique consistant à imposer des contraintes actives à l'identité, à l'état, aux autorisations, aux relations et au contexte opérationnel sur ce qu'un système peut faire. C'est un principe d'exécution plutôt qu'une étiquette de métadonnées.

Un graphe runtime prolonge cette idée. Il traite les entités adressables et les relations typées comme faisant partie de l'exécution. Une relation n'est pas seulement un lien à rendre. Elle peut limiter la propagation, valider les opérations autorisées, exposer des preuves ou déterminer la visibilité.

Au sein de Electronic Artefacts, ce concept relie la théorie Runtime et VASTE. Runtime Theory demande ce qui est le moins nécessaire pour qu'un univers d'entités exécute les événements de manière cohérente. VASTE explore comment l'identité graphique, les relations typées et l'exécution contextuelle peuvent devenir l'architecture du système.

## Contexte

De nombreux systèmes contiennent déjà un contexte implicite. Un CMS a des auteurs, des ébauches, des rôles et des statuts. Une base de données a des clés étrangères. Un système d'exploitation a des utilisateurs et des permissions. Un moteur de workflow a des états et des transitions.

La différence dans le temps d'exécution d'un graphique est que le contexte peut être modélisé autour des entités et des relations plutôt que seulement des tableaux ou des pages. Un projet peut appliquer un concept. Une publication peut documenter un champ. Un programme peut alimenter une plateforme. Ces relations peuvent affecter ce qui est rendu, indexé, cité ou exposé.

## Historique

L'exécution contextuelle appartient à une longue famille d'idées : systèmes d'exploitation avec permissions, systèmes d'objets avec transmission de messages, moteurs de workflow, moteurs de règles, modèles d'acteurs, machines d'état, graphes de connaissances et systèmes web sémantiques. Il a également des liens conceptuels avec la cybernétique, parce que la rétroaction dépend de l'information de l'État qui rentre dans le comportement du système.

Electronic Artefacts cadre le sujet à travers l'exécution du graphique parce que le site et ses programmes doivent combiner la représentation des connaissances avec l'exécution publique: pages, recherche, plan de site, métadonnées, exportations de graphiques et quartiers locaux sont générés à partir de la même source.

## Concepts fondamentaux

Le premier concept est l'identité des acteurs. Une opération signifie différentes choses selon qui l'exécute.

Le deuxième concept est l'identité de l'entité. Une opération cible un enregistrement spécifique, pas une carte d'affichage vague.

Le troisième concept est le contexte relationnel. Les voisins de la cible peuvent changer de sens. La publication d'un rapport avec un dossier interne peut divulguer des renseignements.

Le quatrième concept est l'état. Un concept peut être spéculatif, observé, validé, publié ou canonique. Ces états de confiance devraient influer sur la façon dont les revendications sont présentées.

Le cinquième concept est la propagation. Un changement à une entité peut mettre à jour les documents de recherche, les voisinages du graphe, les plans de site et JSON-LD.

## Architecture

Une architecture d'exécution contextuelle nécessite :

- les enregistrements d'entités avec des identifiants stables;
- les déclarations de relations avec les prédicats et la confiance;
- les règles de validation pour les types d'objet et d'objet;
- les règles de visibilité;
- construire ou exécuter des processus qui savent quelles projections mettre à jour;
- les pistes de vérification ou la provenance des changements importants;
- une frontière claire entre le statut éditorial et l'autorité d'exécution.

La construction d'Electronic Artefacts implémente actuellement cela sous une forme statique. La compilation valide les enregistrements et les relations, filtre les entités publiques, génère des pages canoniques et écrit des sorties graphiques. Ce n'est pas un temps d'exécution dynamique complet, mais il démontre le même principe : le contexte détermine la sortie.

## Mise en œuvre

La mise en œuvre devrait commencer petit. Un système peut d'abord définir les types d'entités et les prédicats de relation. Ensuite, il peut rejeter les ID cassés et dupliquer les triples. Ensuite, il peut filtrer la sortie graphique publique en fonction de la visibilité de l'entité. Plus tard, il peut ajouter des workflows, des permissions et la propagation d'événements.

L'erreur est de commencer par un grand moteur abstrait. L'exécution contextuelle devrait se développer à partir d'opérations concrètes qui nécessitent un contexte : publier un enregistrement, exposer une relation, générer des données structurées, citer une source, mettre à jour une collection, créer un artefact dérivé.

## Applications pratiques

Pour VASTE, l'exécution contextuelle est un principe de conception d'exécution.

Pour le Vestiges, il peut régir la contribution, la validation et la visibilité publique à travers les nœuds du savoir culturel.

Pour le centre de connaissances, il détermine quelles entités peuvent être indexées, quelles relations peuvent apparaître publiquement et comment l'état de publication affecte les métadonnées.

Pour les futurs agents d'IA, l'exécution contextuelle peut limiter les actions par rôle, état d'enregistrement, type de relation et niveau de preuve.

## Outils

Les outils utiles comprennent les schémas typés, les registres de prédicats de relation, les sélecteurs de graphiques, les modèles d'autorisation, les pipelines de validation, les journaux d'événements, les projections de recherche et la génération JSON-LD.

## Éléments de preuve

La construction actuelle rejette les relations dont les types de sujets ou d'objets ne sont pas autorisés par la définition du prédicat. Elle empêche également les relations publiques de fuiter des entités non publiques. C'est une exécution contextuelle sous forme de construction statique.

## Questions de conception

Un système qui revendique l'exécution contextuelle devrait répondre à plusieurs questions de conception.

Quel est le plus petit contexte nécessaire à l'opération? La publication d'une page peut nécessiter l'identité de l'entité, la classe de publication, la visibilité, la date modifiée et les relations publiques. Il ne nécessite probablement pas toute l'histoire de chaque entité apparentée.

Quel contexte fait autorité? Si un enregistrement Markdown dit une chose et un manifeste généré en dit une autre, la construction doit définir quelle source gagne. Dans ce dépôt, les énoncés de contenu et de relation sont la source de la vérité; les extrants générés sont des projections.

Quel contexte peut se propager? Une relation d'un article public à une entité interne ne devrait pas devenir visible simplement parce que l'article est public. Une étiquette de confiance devrait affecter la façon dont les revendications sont affichées, mais elle ne devrait pas décider automatiquement si une page est indexée.

Quel contexte est temporel? Une relation peut être valide pour une version d'un système et erronée plus tard. Les graphes à long terme nécessitent éventuellement des relations datées, des sursessions et des résumés des changements.

## Erreurs courantes

La première erreur est d'utiliser le contexte comme un ensemble global de variables. Si chaque partie du système peut lire et muter un objet contextuel partagé, l'architecture devient imprévisible. L'exécution contextuelle doit utiliser des limites explicites.

La deuxième erreur est de traiter les permissions comme le seul contexte. Les permissions comptent, mais l'état éditorial, la provenance, la confiance, le cycle de vie et le type de relation peuvent être tout aussi importants.

La troisième erreur est de rendre le graphique purement descriptif. Si les relations n'influent jamais sur la validation, la projection ou la recherche, le système a un graphe de connaissances, mais pas un graphique d'exécution.

## Implications pour Electronic Artefacts

Le Knowledge Hub montre déjà pourquoi l'exécution contextuelle compte. Une relation publique n'est autorisée que lorsque les deux entités connectées sont publiques. Une publication ne peut être indexée que lorsqu'elle a la bonne classe de publication et une date de publication. Une page concept utilise sa définition différemment d'une page projet. Ce sont de petits exemples, mais ils créent un chemin vers un comportement d'exécution plus fort.

Les futurs travaux VASTE peuvent étendre ce principe aux systèmes de contribution dynamiques, aux autorisations d'archivage, aux limites d'action de l'agent d'IA et aux projections axées sur les événements.

## Concepts connexes

Le voisinage runtime explicite désormais son pont interne : les [acteurs situés et leur gouvernance](/fr/knowledge/concepts/situated-actors-and-governance/) contraignent l’action, les [cinq primitives VASTE](/fr/knowledge/concepts/vaste-five-primitives/) décrivent le modèle partagé, l’[architecture d’extensions VASTE](/fr/knowledge/concepts/vaste-extension-architecture/) borne les capacités remplaçables et le [format graphe portable VAST](/fr/knowledge/concepts/vast-portable-graph-format/) transporte l’état entre runtimes. Les [systèmes autonomes](/fr/knowledge/concepts/autonomous-system/) restent en aval de ces contraintes.

Lire [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/), [Runtime de graphe](/fr/knowledge/concepts/graph-runtime/), [Théorie des temps d'exécution](/fr/research/fields/runtime-theory/), [Identité de l'entité](/fr/knowledge/concepts/entity-identity/) et [Rétroaction cybernétique](/fr/knowledge/concepts/cybernetic-feedback/).

## Lecture suggérée

Inspectez l'enregistrement du programme VASTE et le champ Runtime Theory. Ensuite, examinez comment les prédicats de relation sont définis et validés dans le dépôt Electronic Artefacts.

## Articles connexes

Continuer avec [Graphes de connaissances pour l'infrastructure culturelle](/fr/publications/knowledge-graphs-for-cultural-infrastructure/) et [Pages liées aux données et aux connaissances publiques](/fr/publications/linked-data-and-public-knowledge-pages/).

## Glossaire

Contexte : information qui modifie le sens ou la permission d'une opération.

Durée d'exécution: l'environnement dans lequel les opérations s'exécutent.

Propagation : propagation d'un changement d'état en sorties dépendantes.

Prédice : le type nommé d'une relation.

## Limites

L'exécution contextuelle peut devenir trop compliquée. Si chaque opération dépend de l'ensemble du graphique, la performance et le raisonnement en souffrent. Le système devrait définir le contexte délimité : le plus petit ensemble d'identités, d'états et de relations nécessaires pour rendre l'opération correcte.

Le concept exige également de l'humilité. Certains contextes sont sociaux et ne peuvent pas être entièrement codés. L'objectif n'est pas de mécaniser tout le jugement, mais de rendre d'importantes contraintes visibles et testables.

## Références

- Electronic Artefacts. Runtime de graphe.
- Electronic Artefacts. Théorie des temps de course.
- Electronic Artefacts. Vaisseau.
- W3C. RDF 1.1 Concepts et syntaxe abstraite.
