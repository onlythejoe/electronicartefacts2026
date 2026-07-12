---
id: ea:publication:runtime-engines-and-domain-operating-systems-fr
type: publication
slug:
  canonical: runtime-engines-and-domain-operating-systems
title: Moteurs d'exécution et systèmes d'exploitation de domaine
subtitle: Article technique
abstract: "Un guide au niveau des systèmes pour les moteurs d'exécution, les systèmes d'exploitation de domaine, l'identité, l'état, les autorisations, les événements, les extensions et les projections publiques."
description: "Comprendre les moteurs d'exécution et les systèmes d'exploitation de domaine, et comment les entités, les permissions et les événements partagés peuvent supporter de nombreuses applications."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.1.1
  createdAt: 2026-06-24
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:domain-operating-system
  - id: ea:concept:graph-runtime
  - id: ea:concept:contextual-execution
  - id: ea:concept:event-driven-architecture
  - id: ea:program:vaste
  - id: ea:project:vestiges
claims:
  - "Un système d'exploitation de domaine est crédible lorsque plusieurs applications réutilisent l'identité partagée, l'entité, la permission et la sémantique d'événement."
  - "Les moteurs d'exécution devraient séparer les contrats de domaine stables des implémentations de stockage, de transport et d'interface remplaçables."
evidence:
  - id: ea:concept:domain-operating-system
  - id: ea:concept:graph-runtime
  - id: ea:program:vaste
sources:
  - title: POSIX.1-2024
    publisher: The Open Group and IEEE
    publishedAt: 2024-06-14
    accessedAt: 2026-06-24
    url: https://pubs.opengroup.org/onlinepubs/9799919799/
  - title: Domain-Driven Design Reference
    author: Eric Evans
    publisher: Domain Language
    publishedAt: 2015-01-01
    accessedAt: 2026-06-24
    url: https://www.domainlanguage.com/ddd/reference/
  - title: CloudEvents
    publisher: Cloud Native Computing Foundation
    accessedAt: 2026-06-24
    url: https://cloudevents.io/
citation:
  preferred: Electronic Artefacts. "Moteurs d'exécution et systèmes d'exploitation de domaine".
    Article technique, version 1.1.1, 2026.
tags:
  - moteur d'exécution
  - système d'exploitation de domaine
  - système d'exploitation métier
  - VASTE
  - systèmes composables
disciplines:
  - conception de systèmes
  - architecture logicielle
  - programmation
  - systèmes de connaissance
translationOf: ea:publication:runtime-engines-and-domain-operating-systems
---

## Problème

Les écosystèmes de produits reconstruisent à plusieurs reprises l'identité, les permissions, les workflows et les enregistrements de domaines dans des applications distinctes. La duplication fragmente le sens et rend coûteuses les intégrations, la gouvernance et l'évolution à long terme.

## Présentation

Les produits logiciels implémentent à plusieurs reprises les mêmes fondations : utilisateurs, organisations, permissions, enregistrements, workflows, événements, recherche et intégrations. À mesure qu'un écosystème grandit, des applications distinctes dupliquent ces structures et leur attribuent des significations légèrement différentes. Des fragments d'identité. Les règles divergent. Les données deviennent difficiles à déplacer.

Un moteur d'exécution centralise une partie du modèle d'exécution. Il fournit des mécanismes stables grâce auxquels les objets de domaine sont chargés, validés, modifiés et observés. Un système d'exploitation de domaine va plus loin : il coordonne les identités partagées, les entités, les permissions, les événements et les points d'extension sur plusieurs applications dans un seul champ.

L'expression système d'exploitation est métaphorique ici. Un OS commercial ou culturel ne remplace pas un noyau matériel, un programmeur de processus ou un pilote de périphérique. Il ressemble à un système d'exploitation parce qu'il fournit des services communs et des contrats que de nombreuses applications peuvent réutiliser.

La métaphore n'est utile que lorsque la couche partagée est réelle. Un tableau de bord avec plusieurs éléments de menu n'est pas un système d'exploitation. Un OS de domaine crédible a une identité stable, des capacités régies, des règles exécutables, un état observable et des interfaces composables.

## Ce que fait un runtime

Un temps d'exécution est l'environnement dans lequel les abstractions d'un programme deviennent actives. Les runtimes linguistiques gèrent la mémoire, les types, l'horaire ou la collecte des ordures. Les moteurs de jeu exécutent des scènes, physique, entrée et rendu. Les moteurs de flux de travail exécutent des transitions d'état. Les runtimes du navigateur coordonnent les documents, les scripts, le réseautage et le rendu.

Un domaine runtime exécute la sémantique du domaine. Il sait quelles entités existent, quelles opérations sont valides, quel acteur peut les exécuter, comment les changements d'état sont enregistrés et quelles projections ou événements suivent.

L'exécution ne doit pas contenir toutes les fonctionnalités du produit. Il fournit le minimum de mécanismes partagés dont les applications doivent se comporter de manière cohérente.

VASTE utilise l'idée d'un runtime graphique : les entités adressables et les relations typées participent au calcul contextuel.

## Système d'exploitation

Les systèmes d'exploitation à usage général exposent les abstractions telles que les processus, les fichiers, les utilisateurs, les permissions et les appareils. Les applications s'appuient sur ces abstractions sans réimplanter le contrôle matériel.

Un système d'exploitation de domaine expose des personnes, des organisations, des artefacts, des workflows, des droits, des événements ou d'autres primitifs de domaine. Les applications construisent des interfaces spécialisées sans inventer des systèmes d'identité et de permission incompatibles.

L'analogie a des limites. Les systèmes de domaine sont souvent distribués, basés sur le Web et régis par des organisations plutôt qu'une seule machine. Leurs ressources peuvent être culturelles ou juridiques plutôt que computationnelles.

Utilisez l'analogie pour poser des questions utiles: quels sont les primitifs partagés, quelles capacités sont accordées, comment l'état est isolé, et comment les applications interagissent? Ne l'utilisez pas comme marque pour une plateforme surdimensionnée.

## Domaine primitifs

Les primitifs sont les plus petits concepts stables que l'on considère comme fondamentaux. Pour VASTE, il s'agit d'entités, de relations typées, d'identité, de contexte, d'événements et de projections.

Les Primitives devraient être moins nombreuses et plus durables que les fonctionnalités d'application. Un `Person` ou `Artefact` peut prendre en charge de nombreux produits. Un `HomepageHeroCard` est une préoccupation d'interface et ne devrait pas entrer dans le domaine central.

L'exécution nécessite des identifiants et des schémas stables. Les applications peuvent ajouter des champs locaux, mais le sens partagé doit rester cohérent.

Le design primitif est un travail d'ontologie. Elle exige une portée et des exclusions explicites. Si tout devient primitif, l'exécution devient rigide et impossible à comprendre.

## Architecture

Un domaine OS contient l'identité canonique, les schémas d'entité et de relation, les transitions d'état, l'évaluation des capacités, les contrats d'événements, les constructeurs de projection et les interfaces d'extension sur les adaptateurs de stockage et de transport remplaçables.

## Identité

L'identité répond que deux références indiquent la même chose. Un domaine OS a besoin d'identificateurs qui survivent au renommage, aux changements de route et aux limites d'application.

L'identité de l'utilisateur n'est qu'une couche. Les organisations, les projets, les publications, les outils et les objets culturels ont également besoin d'une identité canonique. Les identificateurs externes peuvent s'inscrire dans les dossiers internes sans devenir la seule autorité.

La résolution de l'identité devrait préserver l'incertitude. Deux noms semblables peuvent ne pas représenter une seule personne. Les dossiers de fusion sont une opération corrélative avec des exigences de provenance et de renversement.

Les ID électroniques Artefacts créent cette fondation. VASTE peut l'étendre au comportement d'exécution et à l'intégration externe.

## État

L'état comprend les valeurs actuelles, l'état du cycle de vie et l'historique pertinent. Une publication peut être rédigée, révisée, publiée, archivée ou remplacée. Une relation peut être proposée, validée ou rejetée.

L'exécution fait appliquer des transitions valides. Une application ne doit pas contourner les règles en modifiant directement un champ de statut.

L'état peut être stocké sous forme d'enregistrements courants, d'historique des événements ou des deux. Le choix dépend des besoins d'audit et de reconstruction. Les contrats stables ne devraient pas exposer inutilement la mise en oeuvre du stockage.

La version protège le travail simultané. Les opérations peuvent nécessiter une version d'entité attendue et rejeter les mises à jour statiques.

## Autorisations et capacités

Un OS de domaine a besoin d'un modèle de capacité. Les rôles seuls sont souvent insuffisants. Un éditeur peut publier une collection mais seulement commenter une autre. Un modèle peut lire des sources privées pour une tâche mais ne peut pas les exposer publiquement.

Les capacités peuvent être évaluées à partir de l'identité de l'acteur, de l'entité cible, de la relation, de l'état, de l'organisation et de l'opération demandée. C'est une exécution contextuelle.

L'exécution doit renvoyer les décisions explicables. "Dénié" est moins utile que "la publication est spéculative et nécessite un examen canonique." Les registres des décisions appuient la vérification sans exposer de détails stratégiques sensibles.

Les capacités devraient être accordées de façon étroite et révoquées de façon prévisible. Les modules d'extension ne devraient pas hériter de l'autorité mondiale par défaut.

## Événements

Les événements rendent les changements d'état observables. Lorsqu'une entité est publiée, les consommateurs peuvent mettre à jour la recherche, régénérer les pages publiques et aviser les abonnés.

L'exécution définit la sémantique des événements de domaine; la technologie du transport les porte. Une enveloppe CloudEvents ou Redis Stream peut normaliser la livraison, mais le type d'événement et la signification de l'entité appartiennent au domaine.

Les événements devraient inclure la causalité et la corrélation. Quelle commande a produit le changement ? Quel acteur ou processus l'a initié? Quelle est la version de l'entité?

Les politiques de rejouage et de double emploi doivent être explicites. Les effets indésirables publics ne doivent pas se répéter aveuglément.

## Projections

Différentes applications nécessitent des vues différentes de l'état partagé. Un site Web public n'a besoin que de champs publiés. Un éditeur a besoin d'un état de flux de travail et de sources. Un service de recherche nécessite un texte normalisé. Une exportation d'archives nécessite des métadonnées de préservation.

Ce sont des projections. L'exécution fournit des enregistrements canoniques et des événements; les constructeurs de projection créent des modèles de lecture optimisés.

Les projections publiques et privées imposent également des limites de divulgation. Les champs restreints ne doivent pas être filtrés uniquement dans le navigateur. La projection devrait les exclure avant publication.

Electronic Artefacts génère des HTML statiques, JSON-LD, des index de recherche et des quartiers de graphiques à partir d'un modèle de contenu. Il s'agit déjà d'un petit modèle de gestion de domaine.

## Architecture d'extension

Un domaine OS devient utile lorsque des extensions peuvent ajouter des capacités sans modifier le noyau pour chaque produit. Les extensions peuvent définir de nouveaux types d'entités, processeurs, vues, consommateurs d'événements ou adaptateurs d'intégration.

Les contrats d'extension nécessitent des limites de version et de permission. Un plugin doit déclarer quels événements il consomme et quelles opérations il peut effectuer. Elle ne devrait pas atteindre des tables internes arbitraires.

La compatibilité n'est pas une personnalisation illimitée. Des points d'extension stables sont choisis délibérément. Trop d'hameçons gèlent la mise en œuvre interne et augmentent le risque pour la sécurité.

L'exécution devrait soutenir l'absence gracieuse. La suppression d'une seule extension ne devrait pas corrompre des entités non liées.

## Coques d'application

Les applications fournissent des interfaces et des flux de travail pour des publics spécifiques. Une bibliothèque de recherche, un tableau de bord créateur et un marché culturel peuvent partager un runtime tout en présentant une navigation et une langue différentes.

Le shell d'application ne devrait pas dupliquer les règles de domaine. Il demande à l'exécution si une action est valide et rend le résultat. L'état d'interface locale reste local.

Cette séparation permet à un site public de rester statique et rapide alors que les surfaces administratives sont dynamiques. Il prend également en charge plusieurs clients sans permissions incompatibles.

L'exécution n'est pas l'expérience utilisateur. Les bons produits nécessitent toujours une conception spécifique au domaine.

## Orchestration

Un domaine OS coordonne souvent des processus en plusieurs étapes : examen, publication, contribution, paiement ou analyse. Certains flux sont des flux déterministes; d'autres comprennent des décisions d'ordre agentique ou humain.

Le temps d'exécution doit représenter l'état et les limites, tandis que les moteurs de workflow spécialisés peuvent gérer les minuteurs, les relevés et la compensation. Évitez de reconstruire une plate-forme de workflow complète à moins que les exigences du domaine ne le justifient.

Les événements relient les étapes. Les commandes demandent des transitions. Les tâches humaines restent des entités visibles avec la propriété et les délais.

Les agents de l'IA peuvent participer en tant qu'acteurs délimités. Leurs propositions, outils et autorisations devraient être représentés comme d'autres opérations d'exécution.

## Intégration des graphes de connaissances

Les graphes de connaissances décrivent les entités et les relations. Un graphe runtime rend une partie de cette structure exécutable. Une relation peut influencer la permission, le routage, l'assemblage contextuel ou la propagation d'événements.

Par exemple, une relation contributeur peut permettre d'éditer un projet. Les relations de sujet d'une publication peuvent déterminer quelles pages concept reconstruire. Un chemin de provenance peut déterminer si un artefact peut être libéré.

L'exécution doit utiliser des prédicats explicites et une traversée limitée. Il serait dangereux d'autoriser la proximité arbitraire du graphique avec l'autorité d'octroi.

Le graphique améliore également l'explication. Une décision peut citer les relations qui y ont contribué.

## Simulation

Les moteurs d'exécution peuvent supporter des simulations en représentant des agents, des environnements, des transitions d'état et des règles. Un modèle graphique est utile lorsque des entités simulées interagissent par des relations changeantes.

La simulation devrait rester séparée de l'état canonique réel. Les résultats expérimentaux peuvent être stockés comme artefacts dérivés avec leur version de modèle et leurs hypothèses.

L'intérêt de VASTE pour la construction modulaire mondiale est lié à cette capacité. Un runtime peut exécuter des mondes fictifs, analytiques ou opérationnels en utilisant des primitifs partagés.

Le défi est la performance. Les modèles sémantiques généraux peuvent avoir besoin de représentations compilées ou spécialisées pour des simulations de grande envergure.

## Domaine OS pour la culture

V6 illustre un domaine culturel OS. Les primitifs communs comprennent des personnes, des organisations, des techniques, des matériaux, des outils, des lieux, des documents et des œuvres. Les relations décrivent l'enseignement, la fabrication, l'utilisation, la préservation et la participation.

Les applications peuvent comprendre des pages de connaissances publiques, des flux de travail de contribution, des tableaux de bord institutionnels, des voies d'apprentissage et des services économiques. Ils partagent l'identité et la provenance plutôt que de fonctionner comme bases de données isolées.

Le marché devient une projection des connaissances culturelles, et non le modèle central. Cela préserve la valeur intellectuelle même lorsque les services commerciaux changent.

Les systèmes culturels ont également besoin d'un langage pluriel et de revendications contestées. L'exécution doit éviter de transformer une ontologie en autorité incontestable.

## Domain OS pour un studio créatif

Un studio peut connecter projets, clients, artefacts, références, droits, outils, publications et archives. Il peut suivre comment la recherche devient la production et comment la production rend les connaissances.

Electronic Artefacts ont déjà ces classes d'entités. Une future surface interne pourrait coordonner le statut éditorial, la provenance du projet, la préservation des médias et la publication publique.

ORETH pourrait apporter des capacités d'analyse audio. Les palimpsestes pourraient utiliser des structures de publication composées. Le centre de connaissances pourrait recevoir des concepts et des méthodes validés.

L'objectif n'est pas de centraliser chaque décision créative. Il empêche les connaissances structurelles de disparaître entre les dossiers et les applications.

## Construction contre achat

Les plateformes générales fournissent l'authentification, les bases de données, les files d'attente et la gestion du contenu. Un domaine devrait réutiliser l'infrastructure des produits de base dans la mesure du possible.

Construire la couche qui représente une sémantique de domaine distinctive ou crée une valeur stratégique durable. Acheter ou adopter des composants bien pris en charge pour le transport, le stockage et l'observabilité génériques.

La valeur exclusive de VASTE devrait résider dans l'exécution graphique, le contexte et l'architecture de domaine, et non dans la réinventation de la cryptographie ou des bases de données.

Les normes ouvertes améliorent la portabilité. JSON-LD, RDF mappages, CloudEvents et URLs stables peuvent exposer les données sans exiger des systèmes externes d'adopter le temps d'exécution interne.

## Gouvernance

Un domaine OS est une infrastructure institutionnelle. Les changements aux primitifs et les permissions affectent chaque application. La gouvernance nécessite des processus de proposition, d'examen, de migration et de déprécation.

La propriété du schéma devrait être claire. Les auteurs d'extension ont besoin d'une politique de compatibilité. L'examen de la sécurité devrait porter sur les capacités et les projections de données.

Les changements de vocabulaire public nécessitent une attention éditoriale. Un identifiant ne doit pas être réutilisé pour une signification différente. Les termes obsolètes devraient conserver des cartes.

La gouvernance peut rester légère dans une petite organisation, mais les décisions doivent être consignées.

## Modes de défaillance

Le premier échec est le maximisme de la plate-forme. L'exécution tente de posséder toutes les fonctionnalités avant que les besoins partagés ne soient prouvés.

La seconde est la métaphore sans substance. Un tableau de bord est appelé un OS malgré l'absence de contrats d'exécution stables.

Le troisième est le goulot d'étranglement central. Chaque équipe doit attendre les changements fondamentaux.

Le quatrième est l'abstraction. Les applications contournent l'exécution et modifient le stockage directement.

Le cinquième est l'insécurité de prolongation. Les greffons sont largement accessibles.

La sixième est la rigidité de l'ontologie. L'évolution du domaine devient plus difficile parce que les primitifs sont traités comme permanents.

Le septième manque de voies de sortie. Les données ne peuvent pas être exportées sans la plateforme.

## Voie de mise en œuvre

Commencez par une identité d'entité stable et un petit vocabulaire prédicat. Ajouter la validation et les opérations en version. État canonique séparé des projections. Introduire des événements pour des changements significatifs. Autorisations de modèle par des capacités explicites.

Construisez une application qui prouve la réutilisation, puis une deuxième application qui consomme les mêmes primitifs. La deuxième utilisation est le vrai test d'une plateforme.

Ajouter les contrats d'extension uniquement lorsque des besoins d'intégration répétés existent. Mesurer les coûts opérationnels. Préserver les exportations et les surfaces publiques statiques.

Pour VASTE, V6 et le Knowledge Hub fournissent des éléments de preuve complémentaires : durée d'exécution, produit appliqué et projection des connaissances publiques.

## Mise en œuvre

Commencez par des ID stables, des opérations validées et un magasin d'état canonique. Générer des projections publiques et privées, publier des événements de domaine, puis prouver la réutilisation sur une deuxième application avant d'ajouter un large plugin ou une infrastructure de workflow.

## Éléments de preuve

Les normes générales du système d'exploitation démontrent la valeur des interfaces partagées stables, la conception axée sur le domaine fournit un langage limité et des concepts de modèles, et CloudEvents fournit une enveloppe d'événement interopérable pour les extensions distribuées.

## Limites

La métaphore du système d'exploitation peut encourager le maximisme de la plateforme. Un domaine devrait rester plus petit que les applications qu'il supporte, offrir des chemins d'exportation et éviter de centraliser des capacités non liées.

## Concepts connexes

Lire [Système d'exploitation du domaine](/fr/knowledge/concepts/domain-operating-system/), [Runtime de graphe](/fr/knowledge/concepts/graph-runtime/), [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/) et [Architecture d'événements](/fr/knowledge/concepts/event-driven-architecture/).

## Programmes et projets connexes

Voir [VASTE](/fr/programs/vaste/) et [V6](/fr/projects/v6/).

## Glossaire

Moteur d'exécution : un environnement qui exécute un ensemble d'abstractions et de règles.

Système d'exploitation de domaine: une couche d'information et d'exécution partagée pour un champ.

Primitif : entité ou opération fondamentale exposée par l'exécution.

Capacité : une autorisation spécifique pour effectuer une opération.

Projection : une vue dérivée de l'état canonique.

Point d'extension : une interface gouvernée par laquelle les modules ajoutent un comportement.

## Références

- Le Groupe ouvert et l'IEEE. POSIX.1-2024.
- Evans, Eric, référence de conception de domaine.
- Nuage Native Computing Foundation. Les événements nuageux.
