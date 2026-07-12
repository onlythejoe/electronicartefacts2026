---
id: ea:publication:model-context-protocol-and-tool-using-ai-systems-fr
type: publication
slug:
  canonical: model-context-protocol-and-tool-using-ai-systems
title: Model Context Protocol et systèmes d'IA utilisant des outils
subtitle: Article technique
abstract: "Cette synthèse française présente Model Context Protocol et systèmes d'IA utilisant des outils : mécanismes, usages, limites et liens avec le graphe public d’Electronic Artefacts."
description: "Repères pour comprendre Model Context Protocol et systèmes d'IA utilisant des outils dans un contexte de conception : concepts clés, implications pratiques, limites et références reliées au graphe Electronic Artefacts."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.1.0
  createdAt: 2026-06-24
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-12
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:technology:model-context-protocol
  - id: ea:concept:ai-agent
  - id: ea:concept:contextual-execution
  - id: ea:concept:graph-runtime
  - id: ea:program:vaste
claims:
  - Model Context Protocol et systèmes d'IA utilisant des outils doit être lisible comme une
    synthèse française autonome, sans phrases hybrides héritées de l'anglais.
  - Les liens avec les notions, projets et technologies du graphe facilitent la recherche, la navigation et la citation.
evidence:
  - id: ea:technology:model-context-protocol
  - id: ea:concept:contextual-execution
sources:
  - title: Model Context Protocol Specification
    publisher: Model Context Protocol
    accessedAt: 2026-06-24
    url: https://modelcontextprotocol.io/specification/2025-06-18
  - title: JSON-RPC 2.0 Specification
    publisher: JSON-RPC Working Group
    accessedAt: 2026-06-24
    url: https://www.jsonrpc.org/specification
  - title: Language Server Protocol Specification
    publisher: Microsoft
    accessedAt: 2026-06-24
    url: https://microsoft.github.io/language-server-protocol/
citation:
  preferred: Electronic Artefacts. "Model Context Protocol et systèmes d'IA utilisant des outils".
    Article technique, version 1.1.0, 2026.
tags:
  - Model Context Protocol
  - agents d'IA
  - usage d'outils
  - Contextual Exécution
  - VASTE
disciplines:
  - intelligence artificielle
  - architecture logicielle
  - conception de systèmes
translationOf: ea:publication:model-context-protocol-and-tool-using-ai-systems
---

## Problème

Les applications de modèles linguistiques ont de plus en plus besoin d'accéder aux fichiers, aux bases de données, aux outils, aux appels et aux services externes. Sans protocole partagé, chaque intégration devient un pont personnalisé avec des permissions peu claires, une exposition de contexte incohérente et des hypothèses fragiles sur ce qu'un modèle est autorisé à faire.

## Présentation

Model Context Protocol, généralement raccourci au MCP, standardise la façon dont un hôte AI peut se connecter à des serveurs qui exposent le contexte et les capacités. Un hôte peut être un assistant de bureau, un environnement de codage, une interface de chat ou un moteur de workflow. Un serveur peut exposer des fichiers de projet, des trackers d'émission, des index de recherche, des métadonnées multimédias, des enregistrements graphiques ou des actions telles que le rendu d'un document.

Le changement important est architectural. MCP ne rend pas un modèle autonome par lui-même. Il donne à l'application environnante une façon structurée de découvrir et d'invoquer des ressources, des incitations et des outils. L'autonomie, l'examen, la permission et la mémoire appartiennent encore à la conception de l'hôte et de l'application.

Cette distinction compte pour Electronic Artefacts. VASTE est concerné par les graphes, les limites du contexte, l'identité, les relations et la propagation des événements. MCP peut devenir un moyen d'exposer les capacités graph-scoped aux interfaces de modèle, mais il ne devrait pas contourner le modèle d'autorité propre du graphique.

## Architecture

Une architecture MCP contient un hôte orienté utilisateur, un ou plusieurs clients, des serveurs externes, des ressources déclarées, des invites réutilisables, des outils exécutables, des contrôles d'approbation et des dossiers de vérification. Le protocole coordonne la découverte des capacités et l'invocation; l'hôte reste responsable du consentement, de la politique et du comportement visible de l'utilisateur.

## Hôtes, clients et serveurs

La spécification MCP décrit la communication entre les hôtes, les clients et les serveurs. L'hôte est l'application que l'utilisateur expérimente. Un client est le connecteur de l'hôte. Un serveur fournit des capacités et un contexte.

Cette séparation donne à chaque couche une responsabilité claire. Le serveur décrit ce qu'il peut fournir. Le client gère la connexion. L'hôte décide comment l'utilisateur accorde l'accès et comment les extrants du modèle sont interprétés.

Dans la pratique, l'hôte est la confiance que les utilisateurs de frontières comprennent. Si un serveur expose un système de fichiers ou une action de publication, l'utilisateur ne devrait pas avoir à raisonner au sujet des messages de protocole bruts. L'hôte devrait rendre l'accès aux données et l'invocation des outils suffisamment visibles pour approuver, refuser et vérifier.

## Ressources

Les ressources sont des données contextuelles exposées par un serveur. Ils peuvent représenter des fichiers, des documents, des lignes de base de données, des quartiers de graphiques, des archives, des résultats de recherche ou tout contenu structuré que le modèle peut utiliser.

Pour un système de connaissances, les ressources sont plus que des blobs textuels. Une ressource devrait préserver l'identité, le titre, la source, la visibilité, le temps de modification et les relations pertinentes. Un modèle qui lit un document d'archives doit savoir s'il est public, restreint, provisoire ou canonique.

C'est là que le MCP s'adapte mieux aux Electronic Artefacts que l'incitation générique à copier-coller. Un serveur MCP soutenu par VASTE ne pourrait exposer que les ressources autorisées par le rôle d'un utilisateur et la tâche actuelle. Le modèle reçoit le contexte pertinent sans recevoir tout le graphique privé.

## Demandes

Les prompts du MCP sont des modèles d'interaction réutilisables. Un serveur peut offrir un prompt structuré pour résumer un artefact, rédiger des métadonnées, examiner une relation ou comparer deux sources.

Traiter les invites comme des capacités fournies par le serveur aide une version d'équipe importants workflows. Au lieu que chaque utilisateur improvise une demande de métadonnées, le système peut exposer une demande nommée qui code les normes éditoriales et la structure de sortie attendue.

Les demandes ne sont pas neutres. Ils comportent des hypothèses sur le rôle, les preuves, le ton et les critères de réussite. Ils devraient être examinés comme le comportement du produit. Pour Electronic Artefacts, les prompts qui touchent la connaissance publique devraient rappeler les revendications, les sources et les identifiants d'entités plutôt que la prose flottante.

## Outils

Les outils sont des fonctions exécutables. Ils peuvent rechercher, transformer, créer, mettre à jour, rendre, envoyer, programmer ou publier. C'est là que la valeur et le risque augmentent.

Une description d'outil n'est pas une garantie de sécurité. Un hôte doit considérer les métadonnées d'outils comme non fiables à moins que le serveur et le déploiement ne soient fiables. Les utilisateurs devraient être en mesure d'examiner ce qu'un outil fait avant d'accorder l'accès. Les outils sensibles devraient exiger une confirmation explicite, surtout lorsqu'ils rédigent, publient ou appellent des systèmes externes.

La conception de l'outil devrait préférer les opérations étroites avec des entrées typées aux commandes larges. Un outil nommé `create_relation` avec un schéma fixe est plus facile à autoriser et à vérifier qu'un outil nommé `run_shell_command`.

## Consentement et contrôle

Les directives de sécurité de MCP mettent l'accent sur le consentement des utilisateurs, la confidentialité des données, la sécurité des outils et les contrôles entourant l'échantillonnage des modèles. Ce ne sont pas des détails d'interface optionnels. Ce sont des architectures fondamentales.

Le consentement devrait être suffisamment précis pour être important. « Autoriser l'accès à vos données » est plus faible que « permettre à ce serveur de lire les entités publiques de Knowledge Hub pour cette conversation ». Une action écrite devrait distinguer le projet de création, la mutation interne et la publication publique.

Le contrôle signifie aussi la révocation et l'inspection. Un utilisateur doit savoir quels serveurs sont connectés, quelles ressources ont été lues, quels outils ont été appelés et quel résultat chaque appel est retourné.

## Exécution contextuelle

L'exécution contextuelle signifie que l'action dépend de l'identité de l'entité, de l'acteur, de la relation, de la visibilité, de la politique et de la tâche actuelle. MCP peut porter le contexte, mais il ne définit pas la sémantique du domaine pour ce contexte.

Pour VASTE, un outil d'édition de relations ne doit pas seulement accepter le sujet, le prédicat et l'objet. Elle devrait savoir si l'acteur peut créer cette relation, si l'objet est public, si le prédicat est autorisé entre ces types d'entités et si la déclaration proposée a des preuves.

Le protocole est une couche de transport et de capacité. Le temps d'exécution du graphique reste la responsabilité de décider ce que signifie une action.

## Flux de travail des agents

Le MCP est souvent discuté dans le même souffle que les agents d'IA. Le cadre le plus précis est que MCP donne aux agents et aux workflows une façon standard de se connecter aux capacités.

Un agent pourrait utiliser MCP pour récupérer un mémoire de projet, appeler un outil de recherche, rédiger une mise à jour des métadonnées et demander l'approbation humaine. Un workflow peut utiliser les mêmes outils dans une séquence déterministe sans revendiquer l'autonomie. Le protocole soutient les deux.

Cette distinction protège la conception du système. Si la tâche doit être répétable, un workflow peut être plus sûr. Si la tâche doit être explorée par des voies incertaines, un agent peut être approprié. MCP ne devrait pas forcer un modèle d'exécution.

## Observabilité

Les systèmes d'utilisation d'outils ont besoin de télémétrie. Chaque requête doit indiquer quel serveur a été utilisé, quelle ressource a été lue, quel outil a été invoqué, combien de temps il a fallu, s'il a échoué et quel utilisateur l'a approuvé.

Les journaux devraient éviter de conserver par défaut un contenu rapide sensible. Ils devraient préserver suffisamment de métadonnées pour reconstruire le comportement opérationnel et enquêter sur les erreurs.

Dans le cas des systèmes graphiques, la télémétrie devrait comprendre des identifiants d'entité et des types de relations lorsque cela est sûr. Une trace qui dit "l'appel à l'outil a échoué" est moins utile que celle qui dit "la validation des relations a échoué pour la publication à la relation technologique sous visibilité publique."

## Sécurité

Le risque principal de MCP n'est pas la syntaxe du protocole. C'est la composition des capacités. Un modèle qui peut lire des données privées et appeler un outil d'envoi externe peut exfiltrer des informations si l'hôte n'applique pas les limites.

L'injection rapide augmente ce risque. Une ressource peut contenir du texte qui indique au modèle d'ignorer les instructions antérieures ou d'appeler un outil. L'hôte doit traiter le contenu des ressources comme des données, et non comme une autorité.

Les autorisations d'outils doivent être projetées par serveur, exploitation, utilisateur, conversation et classe de données. Un serveur de recherche en lecture seule ne devrait pas obtenir de permissions d'écriture car un autre serveur connecté fournit un outil de publication.

## MCP et VASTE

VASTE peut traiter MCP comme une interface à l'exécution, pas l'exécution elle-même. Un serveur MCP VASTE pourrait exposer la recherche d'entités publiques, la validation de la relation, la récupération de quartier graphique, la rédaction d'archives et les reconstructions de projection contrôlées.

Le graphique fournit l'identité et la politique. MCP fournit un modèle de connexion. OpenTelemetry peut fournir l'observabilité. L'examen humain assure la gouvernance des approvisionnements.

Cette combinaison est plus forte qu'un assistant générique parce que les actions restent fondées sur des entités typées et des marchés publics.

## Mise en œuvre

Commencez par un serveur MCP en lecture seule. Exposez un petit ensemble de ressources du centre de connaissances public, telles que la recherche d'entités et les voisinages du graphe. Ajouter un outil inoffensif, comme valider un projet de relation sans l'écrire. Exiger une approbation explicite avant d'introduire un outil d'écriture.

Définir la visibilité des ressources, les schémas d'outils, les événements d'audit et la télémétrie avant d'ajouter plus de serveurs. Traiter chaque réponse rapide, ressource et outil comme une entrée non fiable, à moins qu'elle ne vienne d'une source interne de confiance et ne passe toujours pas la validation.

## Éléments de preuve

La spécification MCP définit les hôtes, les clients, les serveurs, les ressources, les invites et les outils sur la communication de style JSON-RPC. Sa propre section de sécurité met en lumière le consentement des utilisateurs, la confidentialité, la sécurité des outils et les contrôles autour de l'échantillonnage lancé par le modèle.

## Incidences des Electronic Artefacts

MCP est intéressant pour Electronic Artefacts car il donne aux systèmes d'IA une frontière pratique entre le raisonnement du modèle et l'infrastructure de studio exécutable. Il pourrait connecter le Knowledge Hub, VASTE, les archives, les métadonnées de projet et les outils locaux sans s'effondrer en un seul assistant opaque.

Le principe de la conception durable est simple : le modèle peut proposer et invoquer des capacités, mais l'exécution du graphique doit déterminer l'identité, le contexte et la permission.

## Limites

MCP ne résout pas l'injection rapide, l'autorisation, l'observabilité, la conception de schéma ou le consentement d'interface utilisateur par lui-même. Il donne aux implémentateurs une surface de protocole où ces responsabilités peuvent être exprimées.

## Concepts connexes

Lire [Agent d'IA](/fr/knowledge/concepts/ai-agent/), [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/), [Runtime de graphe](/fr/knowledge/concepts/graph-runtime/) et [Architecture d'événements](/fr/knowledge/concepts/event-driven-architecture/).

## Technologies connexes

Voir [Modèle de protocole de contexte](/fr/knowledge/technologies/model-context-protocol/) et [OpenTelemétrie](/fr/knowledge/technologies/opentelemetry/).

## Glossaire

Hôte : l'application de modèle de langue orientée utilisateur.

Serveur : un service qui expose les ressources, les invites ou les outils.

Ressources : données contextuelles mises à la disposition du modèle.

Outil : une capacité exécutable qui peut effectuer des travaux en dehors du modèle.

Échantillonnage : une requête lancée par le serveur pour une génération de modèles contrôlée par l'hôte.

## Références

- Modèle de protocole contextuel. Spécification. 2025-06-18.
- Groupe de travail JSON-RPC. Spécifications JSON-RPC 2.0.
- Microsoft. Spécification du protocole de serveur de langue.
