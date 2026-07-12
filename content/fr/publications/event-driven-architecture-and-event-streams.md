---
id: ea:publication:event-driven-architecture-and-event-streams-fr
type: publication
slug:
  canonical: event-driven-architecture-and-event-streams
title: Architecture événementielle et flux d'événements
subtitle: Article technique
abstract: "Cette synthèse française présente Architecture événementielle et flux d'événements : mécanismes, usages, limites et liens avec le graphe public d’Electronic Artefacts."
description: "Repères pour comprendre Architecture événementielle et flux d'événements dans un contexte de conception : concepts clés, implications pratiques, limites et références reliées au graphe Electronic Artefacts."
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
  - id: ea:concept:event-driven-architecture
  - id: ea:technology:cloudevents
  - id: ea:concept:contextual-execution
  - id: ea:concept:graph-runtime
  - id: ea:program:vaste
claims:
  - Architecture événementielle et flux d'événements doit être lisible comme une synthèse française
    autonome, sans phrases hybrides héritées de l'anglais.
  - Les liens avec les notions, projets et technologies du graphe facilitent la recherche, la navigation et la citation.
evidence:
  - id: ea:concept:event-driven-architecture
  - id: ea:technology:cloudevents
sources:
  - title: CloudEvents
    publisher: Cloud Native Computing Foundation
    accessedAt: 2026-06-24
    url: https://cloudevents.io/
  - title: Apache Kafka Documentation
    publisher: Apache Software Foundation
    accessedAt: 2026-06-24
    url: https://kafka.apache.org/documentation/
  - title: Event Sourcing
    author: Martin Fowler
    publisher: MartinFowler.com
    publishedAt: 2005-12-12
    accessedAt: 2026-06-24
    url: https://martinfowler.com/eaaDev/EventSourcing.html
citation:
  preferred: Electronic Artefacts. "Architecture événementielle et flux d'événements". Article
    technique, version 1.1.0, 2026.
tags:
  - Event-Driven Architecture
  - Event Streams
  - CloudEvents
  - Idempotency
  - Event Sourcing
disciplines:
  - architecture logicielle
  - conception de systèmes
  - Distributed Systems
  - programmation
translationOf: ea:publication:event-driven-architecture-and-event-streams
---

## Problème

Des appels synchrones directs permettent aux producteurs de coordonner toutes les conséquences d'un changement. À mesure que les systèmes grandissent, cela réduit la résilience et occulte les transitions d'état historiques.

## Présentation

La plupart des logiciels commencent par des appels directs. Un utilisateur soumet un formulaire, une demande le valide, écrit un enregistrement de base de données et retourne une réponse. Un composant appelle un autre et attend. Ce modèle de demande-réponse est compréhensible et souvent suffisant.

L'architecture axée sur l'événement devient utile lorsque plusieurs parties d'un système doivent réagir au changement indépendamment, lorsque le travail doit continuer asynchronement, ou lorsque l'histoire du changement compte. Au lieu d'un élément instructeur de chaque élément en aval, il enregistre que quelque chose s'est passé : une publication a été approuvée, un artefact a été ingéré, une relation a été créée, un paiement a été effectué.

Les consommateurs s'abonnent aux événements pertinents et effectuent leur propre travail. Un index de recherche mis à jour. Une projection publique se reconstruit. Un dossier de vérification est rédigé. Une notification est envoyée. Le producteur n'a pas besoin de connaître toutes ces conséquences.

Ce découplage crée flexibilité et résilience, mais il crée aussi de nouvelles questions : qu'est-ce qu'un événement, comment est-il livré, ce qui se passe lorsque les consommateurs échouent, comment les schémas changent-ils, et peut-on rejouer l'histoire en toute sécurité ?

## Événements et commandes

Une commande demande une action : `PublishArticle`, `CreateRelation`, `AnalyzeAudio`. Il peut être rejeté parce que les permissions, la validation ou l'état ne le permettent pas. Un événement enregistre quelque chose qui s'est passé : `ArticlePublished`, `RelationCreated`, `AudioAnalysisCompleted`.

Cette distinction clarifie la responsabilité. Une commande a un gestionnaire prévu. Un événement peut avoir de nombreux consommateurs inconnus. Les commandements sont généralement nommés dans l'impératif; les événements dans le passé tendu.

Les systèmes brouillent souvent les termes. Un message nommé `SendEmailEvent` peut en fait être une commande dirigée vers un travailleur. L'architecture devient plus facile à raisonner quand les noms reflètent la sémantique plutôt que le transport.

Les événements doivent représenter des changements de domaine significatifs, pas tous les appels internes de fonction. Des événements à grains trop fins exposent les détails de mise en œuvre et créent du bruit.

## Enveloppe événement

Un événement a besoin de métadonnées ainsi que de charge utile. Les champs communs comprennent un identifiant unique, type, source, temps, sujet, version de schéma et identifiant de corrélation.

CloudEvents définit une enveloppe d'événement portable avec des attributs tels que `id`, `source`, `specversion` et `type`. La spécification ne dicte pas la charge utile ou le courtier du domaine. Il fournit une forme commune qui améliore l'interopérabilité entre les services et les transports.

Pour VASTE, un événement pourrait identifier l'entité qui a changé, le contexte de l'acteur, la portée de la relation, la visibilité et le lien de causalité. Cela permet aux consommateurs en aval d'appliquer des règles contextuelles plutôt que de recevoir des données anonymes.

Une enveloppe doit rester compacte et stable. Les détails sensibles peuvent appartenir à une charge utile protégée ou à un enregistrement référencé plutôt qu'à des en-têtes copiés dans toute l'infrastructure.

## Architecture

Une architecture axée sur l'événement comprend les producteurs, les contrats d'événement, le transport, la rétention, les groupes de consommateurs, les gestionnaires d'idéopontes, les projections, les chemins de défaillance et l'observation. L'État du domaine continue de faire autorité en dehors du courtier à moins que l'approvisionnement en événements ne soit choisi délibérément.

## Questions, sujets et journaux

Une file d'attente distribue le travail. Un message est transmis à un travailleur ou à un membre d'un groupe de travailleurs, puis il est reconnu. Les files d'attente sont appropriées pour des tâches telles que le rendu, la livraison de courriels ou le traitement de fichiers.

Un sujet diffuse des événements à plusieurs abonnés. Chaque abonné peut réagir indépendamment. Les sujets correspondent à l'intégration et à la distribution d'événements de domaine.

Un journal en annexe seulement conserve les enregistrements commandés pour une lecture ultérieure. Les consommateurs suivent leur propre position et peuvent rejouer l'histoire. Apache Kafka et Redis Streams fournissent des primitives orientés log, bien que leurs modèles opérationnels diffèrent.

Ces schémas se chevauchent dans les mises en œuvre. Les questions importantes sont la conservation, la commande, l'état de consommation et la question de savoir si plusieurs consommateurs indépendants ont besoin du même dossier.

## Raccordement temporel

Des appels synchrones directs créent un couplage temporel : les deux composants doivent être disponibles en même temps. Si l'index de recherche est en baisse, la publication de l'article devrait-elle échouer? Un flux d'événements permet à la publication de s'engager dans le changement de domaine tout en indexant le rattrapage plus tard.

Cela améliore la résilience mais introduit une cohérence éventuelle. L'article public peut exister avant que chaque projection ne le reflète. Les interfaces doivent gérer les états intermédiaires.

Toutes les opérations ne doivent pas être asynchrones. Un utilisateur qui change de mot de passe doit être validé immédiatement. Une transaction financière peut nécessiter des garanties coordonnées. La conception axée sur l'événement devrait suivre les limites du domaine plutôt qu'une règle selon laquelle tous les appels deviennent des messages.

## Sémantique de livraison

Les systèmes de messagerie sont souvent décrits comme étant au plus tôt, au moins une fois ou exactement une fois.

La livraison au plus tôt peut perdre un message, mais évite le traitement en double. Au moins une fois la livraison effectuée, les consommateurs doivent donc traiter les duplicatas. Une fois exactement, il s'agit généralement de garanties au sein d'un système limité ou d'un modèle de transaction; les effets secondaires externes de bout en bout demeurent difficiles.

Le défaut pratique est de concevoir les consommateurs pour la livraison au moins une fois. Chaque événement a une identification stable. Les consommateurs enregistrent les ID traités ou font des opérations idémpotent. Réessayer `SetPublicationStatusToPublished` est plus sûr que réessayer `IncrementPublicationCount`.

Les allégations de marketing concernant exactement une fois devraient être traduites en limites précises: exactement une fois où, sous quels échecs, et pour quels effets secondaires?

## Idempotence

Une opération idémpotente produit le même résultat pertinent lorsqu'elle est répétée. Il est central pour une gestion fiable des événements parce que les réseaux et les processus peuvent échouer après la fin du travail, mais avant que la reconnaissance soit enregistrée.

Les consommateurs peuvent utiliser des identifiants d'événement comme clés de duplication. Base de données écrit peut utiliser des upserts ou des contraintes uniques. Les appels externes peuvent utiliser des clés idempotency supportées par le fournisseur. Les transitions d'état peuvent vérifier la version actuelle.

Idempotency est une propriété de domaine, pas seulement une fonctionnalité de courtier. L'envoi de la même annonce publique à deux reprises peut rester nuisible même si l'écriture interne de la base de données est dupliquer.

L'examen de la conception devrait identifier chaque effet secondaire irréversible et définir le comportement en double.

## Commande

La commande mondiale est coûteuse et rarement nécessaire. La plupart des systèmes ont besoin d'une clé significative : les événements pour un compte, un projet ou une entité doivent être traités en séquence.

Les journaux partitionnés préservent l'ordre dans une partition. Le choix de la clé de partition détermine quels événements peuvent être commandés ensemble et comment la charge est distribuée.

Les consommateurs devraient toujours gérer les événements tardifs. Les retards dans le réseau, les relevés et les migrations peuvent révéler des données plus anciennes. Les événements ont besoin de temps d'occurrence et de temps de traitement lorsque la différence compte.

Pour un graphe, la commande par entité peut être insuffisante lorsqu'une opération s'étend sur plusieurs entités connectées. La conception doit définir explicitement les limites de transaction et d'uniformité.

## Évolution du schéma

Les événements survivent au code qui les a produits. Les consommateurs peuvent se déployer à différents moments. Un changement de schéma qui supprime ou réinterprète un champ peut briser le replay et l'intégration.

Préférez les modifications additives. Les nouveaux champs optionnels sont plus faciles à adopter que les champs renommés. Inclure une version de schéma lorsque la sémantique change. Maintenir les tests de compatibilité entre producteurs et consommateurs.

Un événement devrait contenir suffisamment d'informations pour rester significatif sans copier l'ensemble de l'entité actuelle. Les références aux ID canoniques réduisent la duplication, tandis que les instantanés peuvent être utiles lorsque l'interprétation historique nécessite l'état au moment de l'événement.

Les registres du schéma et les types générés peuvent aider, mais la gouvernance reste éditoriale : que signifie l'événement ?

## Sourcing d'événements

Les magasins de sourcing d'événements changent comme l'enregistrement primaire et dérivent l'état courant en rejouant les événements. Au lieu d'écraser un enregistrement d'article, le système stocke des événements tels que `ArticleDrafted`, `ArticleReviewed` et `ArticlePublished`.

Le modèle fournit l'historique, l'auditabilité et la reconstruction temporelle. Cela ajoute aussi de la complexité. Les schémas d'événements deviennent permanents. Pour corriger les erreurs, il faut compenser les événements ou contrôler la migration. Rejouer les effets secondaires externes est dangereux.

Le sourcing d'événements ne doit pas être confondu avec les événements d'intégration de la publication. Un système peut utiliser la messagerie par événement tout en conservant une base de données conventionnelle comme source de vérité.

Utilisez l'approvisionnement en événements lorsque l'histoire du domaine est fondamentale et que l'équipe peut soutenir sa discipline opérationnelle.

## Projections

Une projection transforme les événements ou l'état canonique en une vue optimisée pour la lecture. Les index de recherche, les pages publiques, les tableaux de bord et les voisinages du graphe sont des projections.

Les projections peuvent être reconstruites lorsque des changements logiques, des événements sources ou des enregistrements canoniques restent disponibles. Cette séparation protège le modèle central des champs spécifiques à l'interface.

Electronic Artefacts génère déjà plusieurs projections à partir d'enregistrements de contenu : pages HTML, JSON-LD, documents de recherche, manifestes de route et fichiers graphiques. Un temps d'exécution dirigé par un événement pourrait mettre ces surfaces à jour de façon progressive lorsque les entités changent.

Le décalage de projection devrait être observable. Un système doit savoir quel événement une projection a traité.

## Manipulation des défaillances

Les consommateurs échouent en raison de données non valides, de dépendances non disponibles, de défauts de code ou d'épuisement des ressources. Réessayer chaque échec indéfiniment peut bloquer une partition ou multiplier les coûts.

Classer les défaillances comme transitoires ou permanentes. Les défaillances transitoires peuvent utiliser des rétries délimitées avec le recul. Les échecs permanents devraient passer à une lettre morte ou à un processus de quarantaine dans un contexte suffisamment propice à l'enquête.

Les files d'attente ne sont pas des poubelles. Ils ont besoin de la propriété, des alertes et des procédures de replay. Les charges utiles sensibles nécessitent la même protection que le courant primaire.

Les événements de poison ne doivent pas empêcher le travail non lié. Le cloisonnement et la conception du consommateur influencent le rayon de souffle.

## Observabilité

Les flux d'événements distribués sont invisibles sans trace et métriques. Les journaux doivent comprendre l'identifiant de l'événement, le type, la source, l'identifiant de corrélation, le consommateur et le résultat du traitement. Les mesures devraient suivre le décalage, le débit, le taux de réessayer, l'âge et le volume de lettres mortes.

Le traçage distribué peut connecter la commande originale aux événements émis et au travail en aval. Ceci est particulièrement utile lorsqu'une action utilisateur affecte plusieurs services.

L'observation des affaires aussi. Un flux peut être techniquement sain tandis que les publications restent bloquées avant l'approbation. Les paramètres de domaine devraient refléter des progrès significatifs.

Pour VASTE, le contexte graphique peut enrichir les traces : quelle entité et quelle relation a causé un événement, sous l'autorité de qui, et quelles projections ont changé ?

## Sécurité

Les événements peuvent transporter des données sensibles bien au-delà du service original. Minimiser les charges utiles, classer les champs et appliquer des contrôles d'accès au niveau des courtiers et des consommateurs.

Les producteurs devraient être authentifiés et autorisés à émettre des types d'événements. Les consommateurs devraient valider les schémas et traiter les charges utiles comme des données non fiables. La signature peut être appropriée au-delà des limites de l'organisation.

La politique de maintien en poste est importante. Un journal en annexe seulement peut devenir une copie de longue date de renseignements personnels ou restreints. Les références à des documents contrôlés peuvent être plus sûres que l'intégration du contenu complet.

L'injection rapide affecte également les consommateurs d'IA. Le texte dans un cas où la charge utile ne devrait pas devenir une instruction de modèle fiable.

## AI axé sur l'événement

Les workflows d'IA correspondent souvent à l'architecture des événements. Un événement lié à un document peut déclencher l'extraction. Un événement terminé par analyse peut déclencher une révision humaine. Un événement approuvé par l'examen peut mettre à jour le graphique public.

Les agents ne devraient pas consommer un flux mondial non consolidé. Ils ont besoin d'abonnements, de permissions et de contexte de tâches. Les sorties du modèle devraient devenir des propositions ou des événements avec une confiance explicite, et non une mutation d'état silencieuse.

Les événements appuient également l'évaluation. La trajectoire des appels d'outils, des approbations et des résultats peut être reconstruite sans traiter la chaîne de pensée privée comme un document faisant autorité.

Les modèles locaux et les services hébergés peuvent se trouver derrière les mêmes contrats d'événement, améliorant ainsi la possibilité de remplacement.

## VASTE et exécution contextuelle

VASTE s'occupe des entités, de l'identité, des relations, du contexte et de la propagation des événements. L'architecture axée sur l'événement fournit le transport et le découplage temporel, tandis que le graphique fournit le sens.

Un événement comme `RelationCreated` est insuffisant sans connaître le sujet, le prédicat, l'objet, l'acteur et la confiance. L'exécution contextuelle peut déterminer si la relation est permise et quels consommateurs peuvent la voir.

Les voisinages du graphe peuvent aussi relier la propagation. Un changement peut aviser les personnes directement dépendantes sans radiodiffusion dans l'ensemble du système.

Cette combinaison distingue un graphe d'un bus de message générique. L'exécution utilise la structure sémantique pour régir le comportement des événements.

## Quand ne pas utiliser les événements

N'introduisez pas de courtier lorsqu'une opération directe d'appel ou de base de données est suffisante. Les petits systèmes peuvent devenir plus difficiles à déboguer lorsque chaque opération est asynchrone.

Éviter les événements comme moyen de cacher la propriété incertaine. Si aucun service ne fait autorité pour un concept, d'autres messages ne répareront pas le modèle de domaine.

Ne publiez pas de détails internes instables en tant que contrats d'intégration permanente. Gardez les événements de mise en œuvre locale à l'intérieur de la frontière propriétaire.

Les systèmes d'événements les plus puissants sont sélectifs. Ils enregistrent les changements que les autres composantes doivent vraiment observer.

## Séquence de mise en œuvre

Commencez par nommer les événements de domaine et leurs propriétaires. Définir les identifiants, le schéma, la source et la conservation. Choisissez un consommateur et design idempotency avant d'ajouter plus.

Ajouter les ID de corrélation, les mesures de décalage et la gestion des défaillances tôt. Tester les duplicata, la réorganisation, les consommateurs non disponibles et les changements de schéma. Rejouer le comportement.

Utilisez CloudEvents ou une enveloppe similaire où l'interopérabilité est précieuse. Choisir un courtier selon l'échelle, la rétention et les opérations, et non la tendance.

N'adoptez l'approvisionnement en événements qu'après que l'équipe ait démontré la fiabilité de la gestion des événements et le besoin d'un domaine pour l'historique des événements comme source de vérité.

## Mise en œuvre

Mettre en œuvre un événement de domaine fin à fin. Donnez-lui une identité et un schéma stables, persistez le changement d'état d'origine, livrez-le à un consommateur idémpotent, surveillez le décalage et les duplicatas, puis élargissez-vous à des projections supplémentaires.

## Éléments de preuve

CloudEvents spécifie une enveloppe d'événement portable. Kafka documente la diffusion d'événements durables, tandis que la littérature d'événements-sourcing décrit l'état d'application dérivé d'événements de domaine séquencés.

## Limites

Les systèmes asynchrones augmentent la charge opérationnelle et cognitive. La cohérence occasionnelle, l'évolution du schéma et le replay peuvent être inappropriés lorsqu'une transaction locale ou un appel direct satisfait déjà à l'exigence.

## Concepts connexes

Lire [Architecture d'événements](/fr/knowledge/concepts/event-driven-architecture/), [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/) et [Runtime de graphe](/fr/knowledge/concepts/graph-runtime/).

## Technologies connexes

Voir [Événements nuageux](/fr/knowledge/technologies/cloudevents/) et [Redis Streams](/fr/knowledge/technologies/redis-streams/).

## Programme connexe

Voir [VASTE](/fr/programs/vaste/).

## Glossaire

Événement : un record durable que quelque chose s'est passé.

Commande : une demande d'action.

Courtier : infrastructure qui transporte les messages.

Consommateur : une composante qui lit et réagit aux événements.

Idempotency: sécurité sous exécution répétée.

Projection : un modèle de lecture dérivé de l'état canonique ou des événements.

## Références

- Nuage Native Computing Foundation. Les événements nuageux.
- Fondation Apache Software. Documentation Apache Kafka.
- Fowler, Martin. Événement Sourant.
