---
id: ea:publication:microservices-modular-monoliths-and-system-boundaries-fr
type: publication
slug:
  canonical: microservices-modular-monoliths-and-system-boundaries
title: Microservices, monolithes modulaires et frontières de système
subtitle: Article technique
abstract: "Comparaison pragmatique des microservices et des monolithes modulaires à travers les limites du domaine, la propriété des données, le déploiement, les événements, l'observation et la structure de l'équipe."
description: "Apprenez quand les microservices ont un sens, pourquoi les monolithes modulaires sont souvent le meilleur point de départ, et comment définir les frontières durables du système."
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
  - id: ea:concept:microservice-architecture
  - id: ea:concept:event-driven-architecture
  - id: ea:concept:systems-thinking
  - id: ea:concept:contextual-execution
  - id: ea:program:vaste
claims:
  - "Les frontières des services devraient suivre la propriété du domaine, l'évolution indépendante et les exigences opérationnelles plutôt que la mode technique."
  - "Un monolithe modulaire préserve les transactions et les opérations plus simples tout en établissant des limites qui peuvent devenir des services plus tard."
evidence:
  - id: ea:concept:microservice-architecture
  - id: ea:concept:systems-thinking
sources:
  - title: Microservices
    author: James Lewis and Martin Fowler
    publisher: MartinFowler.com
    publishedAt: 2014-03-25
    accessedAt: 2026-06-24
    url: https://martinfowler.com/articles/microservices.html
  - title: MonolithFirst
    author: Martin Fowler
    publisher: MartinFowler.com
    publishedAt: 2015-06-03
    accessedAt: 2026-06-24
    url: https://martinfowler.com/bliki/MonolithFirst.html
  - title: Domain-Driven Design Reference
    author: Eric Evans
    publisher: Domain Language
    publishedAt: 2015-01-01
    accessedAt: 2026-06-24
    url: https://www.domainlanguage.com/ddd/reference/
citation:
  preferred: Electronic Artefacts. "Microservices, monolithes modulaires et frontières de système".
    Article technique, version 1.1.1, 2026.
tags:
  - Microservices
  - Modular Monolith
  - System Boundaries
  - Domain-Driven Design
  - Distributed Systems
disciplines:
  - architecture logicielle
  - conception de systèmes
  - programmation
  - Distributed Systems
translationOf: ea:publication:microservices-modular-monoliths-and-system-boundaries
---

## Problème

Les équipes distribuent souvent des applications avant que les limites du domaine, la propriété et les besoins opérationnels ne soient compris. Le résultat est un système en réseau qui préserve le couplage monolithique tout en ajoutant des modes de latence et de défaillance.

## Présentation

Les microservices sont souvent présentés comme l'extrémité moderne de l'architecture logicielle. Une grande application est divisée en petits services, chacun déployable de façon indépendante et aligné sur une capacité opérationnelle. Les équipes acquièrent l'autonomie, les composants s'échellent séparément et les échecs restent isolés.

Ces avantages sont réels dans les bonnes conditions. Les coûts sont également réels. Les appels réseau remplacent les appels de fonction. Une défaillance partielle devient normale. La propriété des données devient distribuée. Le déploiement, l'authentification, l'observation et l'intervention en cas d'incident nécessitent une infrastructure mature. Un système avec dix services peut être plus difficile à changer qu'un monolithe lorsque les frontières sont erronées.

Un monolithe modulaire offre un autre chemin. L'application se déploie en tant qu'unité mais applique les limites internes du module. Les modules possèdent des capacités et exposent des interfaces explicites. Les transactions et le développement local restent plus simples, tandis que l'architecture conserve l'option d'extraire les services plus tard.

La question utile n'est pas "monolithe ou microservices?" dans l'abstrait. C'est là que se trouvent les limites du domaine, quelles parties doivent être déployées de façon indépendante, et si l'organisation peut supporter la complexité opérationnelle de la distribution.

## Qu'est-ce qu'un microservice

Un microservice est un service déployable indépendamment organisé autour d'une capacité limitée. Elle possède sa mise en œuvre et habituellement ses données. D'autres services interagissent au moyen de contrats de réseau tels que des API ou des événements.

La taille n'est pas la caractéristique déterminante. Un service avec peu de code peut avoir une responsabilité complexe, tandis qu'un service plus grand peut encore représenter un domaine cohérent. Le comptage des lignes ou des paramètres favorise une fragmentation arbitraire.

Le déploiement indépendant est central. Si cinq services doivent toujours être libérés ensemble, ils peuvent être un monolithe distribué : physiquement séparés mais étroitement couplés.

L'autonomie a également besoin d'une appropriation organisationnelle. Un service sans équipe responsable de la fiabilité et de l'évolution n'est pas véritablement indépendant.

## Quel monolithe

Un monolithe est une application déployée comme une unité. Le terme dit peu sur la qualité interne. Un monolithe peut être bien modulaire, testable et entretenu. Il peut également être une base de code étroitement couplée où chaque fonction atteint chaque table.

L'unité de déploiement offre des avantages. Le développement local peut lancer un processus. Les appels sont rapides et débogables. Les transactions dans les bases de données peuvent préserver l'uniformité. La refacturation entre modules peut se produire atomiquement.

Le risque est l'érosion. Sans frontières imposées, les modèles partagés et les paquets utilitaires deviennent des canaux de couplage. Les équipes évitent les changements parce que l'impact n'est pas clair.

Le remède est l'architecture modulaire, pas la distribution immédiate.

## Le monolithe modulaire

Un monolithe modulaire définit les composants internes autour des capacités du domaine. Chaque module possède son accès aux données et expose une interface publique. D'autres modules ne peuvent pas atteindre directement des tables internes ou des classes d'implémentation.

Les modules peuvent communiquer par des appels de fonction, des commandes internes ou des événements de domaine. Les contrats peuvent être testés. La direction de dépendance peut être appliquée par l'outillage.

Cette architecture offre un avantage d'apprentissage. Les limites des domaines sont difficiles à découvrir tôt. Garder les modules en un seul déployable permet de refactoriser pendant que la compréhension des produits se développe. Une fois qu'une frontière s'avère stable et qu'elle nécessite une échelle ou une propriété indépendante, elle peut être extraite.

La première approche monolithe n'est pas un refus des microservices. Il retarde la distribution irréversible jusqu'à ce qu'il y ait des preuves.

## Architecture

L'architecture commence par des capacités limitées, des données détenues et des contrats explicites. Ces limites peuvent fonctionner comme des modules dans un service déployable ou comme des services déployés indépendamment connectés par des API et des événements.

## Limites des domaines

Les limites devraient suivre les changements de langue, de règles, de propriété et de cycle de vie. La conception axée sur le domaine appelle ces contextes délimités. Le même mot peut signifier différentes choses dans différents contextes : une "publication" dans le flux de travail éditorial diffère d'une page HTML statique dans le système de livraison.

Une bonne frontière a une grande cohésion interne et un faible couplage externe. Les changements à l'intérieur ne nécessitent pas de changements à plusieurs reprises ailleurs. Elle peut expliquer sa responsabilité dans le domaine.

Les seules couches techniques sont de faibles limites de service. Le fractionnement des contrôleurs, la logique d'entreprise et la persistance dans des services séparés créent un couplage réseau sans autonomie de domaine.

Electronic Artefacts peuvent distinguer l'autorité de contenu, l'exécution des graphiques, la projection de recherche, le traitement des médias et la diffusion publique. Si ces processus deviennent des processus dépend des besoins opérationnels.

## Propriété des données

Les services indépendants devraient posséder leurs données. Partager un schéma de base de données permet aux services de contourner les contrats et crée un couplage caché. Un changement de schéma pour une capacité peut en briser une autre.

La propriété séparée n'exige pas un serveur de base de données différent pour chaque petit service. Elle nécessite des limites d'accès contrôlées. Un service ne devrait pas interroger directement les tables d'un autre service.

Les données nécessaires ailleurs peuvent être exposées au moyen d'API, d'événements ou de projections répétées. Cela introduit une cohérence et des doubles emplois éventuels, qui sont des coûts délibérés de l'autonomie.

Le système doit identifier les sources faisant autorité. Un index de recherche est une projection, et non une publication canonique. Un quartier graphique est dérivé d'entités et de relations.

## Opérations et cohérence

Les monolithes peuvent utiliser les transactions de base de données locales entre les modules. Les microservices ne peuvent pas compter sur une seule transaction atomique dans les magasins indépendants sans réintroduire le couplage.

Les flux de travail distribués utilisent des modèles tels que les sagas, les boîtes de réception et les actions compensatoires. Un service engage son état local et enregistre un événement. Les services en aval réagissent. Si un travail ultérieur échoue, la compensation peut annuler ou modifier des effets antérieurs.

Ce n'est pas équivalent au renversement atomique. Les utilisateurs peuvent observer des états intermédiaires. Le dessin ou modèle de domaine doit déterminer les invariants qui nécessitent une cohérence immédiate et qui peuvent converger.

Ne distribuez pas de workflow avant de comprendre sa sémantique d'échec.

## Communication

Les API synchrones sont appropriées lorsqu'un appelant a besoin d'un résultat immédiat. Ils créent des dépendances de disponibilité : si l'appelant n'est pas disponible, l'appelant doit échouer, réessayer ou se dégrader.

Les événements réduisent le couplage temporel et soutiennent plusieurs consommateurs. Ils introduisent la cohérence retardée, l'évolution du schéma et le traitement en double.

La plupart des architectures utilisent les deux. Le choix doit refléter le sens. Interroger l'autorisation actuelle de façon synchrone si une décision ne peut être prise sans elle. Publier un événement après un enregistrement canonique pour que les projections puissent être mises à jour.

Évitez les longues chaînes d'appels de service synchronisés. Latence et probabilité d'échec se multiplient. Si une demande d'utilisateur croise de nombreux services, la conception des limites peut être trop fragmentée.

## Déploiement

Le déploiement indépendant n'est un avantage du microservice que lorsque le pipeline, les tests et les pratiques de compatibilité le soutiennent. Chaque service doit être construit, libéré, configuré, secret, suivi et retour.

Les contrats de version permettent un déploiement progressif. Les consommateurs et les producteurs peuvent exécuter des versions différentes simultanément. Les changements vers l'arrière réduisent la coordination.

Un monolithe modulaire a un pipeline de libération, ce qui rend le changement de module croisé plus simple. Le déploiement peut encore utiliser des stratégies bleu-vert ou canari.

La capacité opérationnelle devrait être traitée comme un stock fini. Chaque service en consomme une partie.

## Observabilité

Un monolithe peut souvent tracer une demande à travers un seul processus. Les microservices nécessitent des identifiants de corrélation, un traçage distribué, des registres centralisés et des mesures de niveau de service.

Les mesures de l'infrastructure ne suffisent pas. Le système devrait observer les flux de domaines : temps de publication, mises à jour de graphiques défaillantes, projections inexistantes et examens en attente.

La propriété est importante. Les alertes doivent se diriger vers une équipe capable d'agir. Un tableau de bord sans procédure de réponse ne crée pas de fiabilité.

Les tests devraient comprendre des délais de dépendance, des pannes partielles et des relevés. La défaillance répartie ne peut être évaluée que par des essais unitaires.

## Sécurité

Les microservices augmentent les surfaces de réseau et d'identité. L'authentification du service au service, l'autorisation, le certificat ou la rotation symbolique et la gestion secrète deviennent fondamentaux.

L'emplacement du réseau à lui seul ne devrait pas accorder de confiance. Chaque service valide l'identité de l'appelant et la capacité demandée. Les événements et les journaux sensibles nécessitent une minimisation des données.

Un monolithe a moins de limites de réseau, mais il a encore besoin d'une autorisation au niveau du module. Le code interne ne devrait pas supposer que chaque opération est permise simplement parce qu'elle fonctionne en un seul processus.

L'exécution contextuelle de VASTE est pertinente dans les deux architectures. La permission est une préoccupation de domaine avant son déploiement.

## Structure des équipes

L'architecture et l'organisation s'influencent mutuellement. Les équipes alignées sur les capacités peuvent posséder des services de bout en bout. Les équipes divisées par couche technique créent souvent des retraits et des processus de libération couplés.

Les microservices peuvent soutenir l'autonomie lorsque les équipes sont assez grandes et que les capacités sont stables. Dans un petit studio, ils peuvent distribuer l'attention à travers l'infrastructure au lieu de travailler sur les produits.

Un monolithe modulaire peut encore prendre en charge la propriété par l'intermédiaire de gestionnaires de modules et de contrats d'interface. L'unité de déploiement ne nécessite pas le chaos organisationnel.

Le nombre de services ne doit pas dépasser la capacité de l'organisation de les comprendre et de les exploiter.

## Élargissement

Les microservices permettent une capacité d'échelle indépendante. Le traitement des médias peut ajouter des travailleurs sans étendre l'API éditoriale. Un service public de lecture peut se reproduire sans faire double emploi avec l'administration privée.

De nombreux systèmes n'ont pas besoin de cette granularité. Un monolithe peut s'étendre horizontalement derrière un balanceur de charge. Les tâches d'arrière-plan peuvent fonctionner comme des processus séparés tout en partageant le code et les contrats de données.

Mesurer le goulot d'étranglement avant le fractionnement. La conception de bases de données, la mise en cache ou le travail asynchrone peuvent résoudre le problème réel.

La distribution prématurée transforme l'échelle hypothétique en complexité permanente.

## Fiabilité

L'isolement du service peut limiter les défaillances. Un service de recommandation rompu n'a pas besoin d'arrêter la publication. L'analyse audio en vrac peut être séparée des requêtes interactives.

L'isolement ne fonctionne que lorsque les dépendances se dégradent avec grâce. Si l'application principale attend synchrone pour chaque service, une défaillance se propage.

Les disjoncteurs, les timeouts, les cloisons et les files d'attente aident, mais chacun ajoute du comportement pour tester. Le système devrait définir une dégradation acceptable. Une page peut-elle être rendue sans recommandations connexes? Un article peut-il être publié alors que l'indexation de la recherche est retardée?

La fiabilité provient de limites conçues, pas du nombre de conteneurs.

## Essais

Un monolithe modulaire prend en charge des tests d'unité et d'intégration rapides dans un dépôt. Les tests de contrat de module peuvent imposer des limites. Les tests de bout en bout restent gérables.

Les microservices nécessitent des essais contractuels entre des composants déployés de façon indépendante, des environnements d'intégration et l'observabilité de la production. Les essais de bout en bout peuvent devenir lents et fragiles s'ils tentent de couvrir chaque combinaison.

Les contrats axés sur les consommateurs aident à vérifier que les fournisseurs demeurent compatibles. Les schémas d'événements nécessitent des tests de version. L'injection d'échec révèle des hypothèses.

Le coût des essais devrait être inclus dans les décisions architecturales.

## Migrations

La migration la plus sûre extrait une frontière prouvée. Identifier une capacité ayant des besoins distincts en matière de propriété, d'échelle ou de libération. Définir son contrat tout en restant dans le monolithe. Supprimer les dépendances internes directes. Établir la propriété des données. Puis déplacer l'exécution sur un réseau.

Cette séquence sépare le travail de domaine du travail d'infrastructure. Si la limite reste douloureuse avant l'extraction, le réseau ne l'améliorera pas.

Utilisez un modèle d'étrangleur pour acheminer progressivement la fonctionnalité sélectionnée vers le nouveau service. Surveillez le comportement et maintenez le recul.

Ne commencez pas par diviser la base de données en tables arbitraires ou créer des services pour chaque nom.

## Architecture VASTE

VASTE est un programme d'exécution, pas un argument pour la distribution maximale. Sa valeur fondamentale réside dans les entités graphiques, les relations typées, l'identité, le contexte et les événements.

Un temps d'exécution modulaire peut garder ces sémantiques cohérentes tout en exposant les adaptateurs pour la recherche, le traitement des médias et les projections publiques. Les services devraient être extraits lorsque l'exploitation indépendante crée de la valeur.

Par exemple, une simulation ou une analyse audio lourde par calcul peut être effectuée indépendamment. La livraison publique de graphiques peut nécessiter un profil de sécurité et de mise en cache différent de l'édition privée. Ce sont des limites fondées sur des preuves.

Le graphique canonique et le modèle d'autorisation ne devraient pas être reproduits dans tous les services sans une stratégie d'autorité claire.

## Architecture du centre de connaissances

Le centre de connaissances actuel est bien desservi par une construction statique. Les fichiers sources de contenu, la validation des relations, la génération de recherche et les pages publiques fonctionnent par un seul pipeline de dépôt. L'introduction de microservices n'apporterait guère de valeur ajoutée.

L'édition collaborative future ou la récupération à grande échelle peut justifier des services. Les contrats d'entité existants et les projections générées créent une solide base modulaire.

Ceci démontre un principe important: l'architecture doit s'adapter au stade du produit. Un graphe de connaissances sophistiqué ne nécessite pas de déploiement réparti.

## Cadre de décision

Choisissez un monolithe modulaire lorsque le produit et le domaine sont toujours en évolution, une équipe possède la plupart des capacités, les transactions traversent fréquemment les frontières et la simplicité opérationnelle est importante.

Choisissez les microservices lorsque les capacités sont stables, les équipes ont besoin d'un déploiement indépendant, les charges de travail varient, les questions d'isolement réglementaire ou le confinement des défaillances justifient la distribution.

Avant l'extraction, répondez: qui possède le service, quelles données possède-t-il, quel contrat expose-t-il, comment échoue-t-il, comment est-il observé et comment peut-il être repoussé?

Si ces réponses ne sont pas claires, la distribution est prématurée.

## Mise en œuvre

Appliquer les limites des modules à l'intérieur de la base de codes actuelle, supprimer l'accès à la table multimodule et définir les contrats. N'extraire qu'une capacité dont les besoins de mise à l'échelle, de sécurité ou de libération ont été prouvés, puis ajouter le déploiement et l'observabilité.

## Éléments de preuve

Lewis et Fowler décrivent les microservices grâce aux capacités d'affaires, au déploiement indépendant et à la gestion décentralisée. L'argument du premier monolithe de Fowler souligne que les limites de service sont plus faciles à découvrir à l'intérieur d'un système initialement unifié.

## Erreurs courantes

La première erreur est de diviser par couche technique.

Le deuxième est de partager une base de données tout en revendiquant l'indépendance du service.

Le troisième est une chaîne d'appels synchrone sur de nombreux services.

Le quatrième est d'adopter une infrastructure d'orchestration sans propriété opérationnelle.

Le cinquième est la confusion des conteneurs avec les microservices.

La sixième est d'ignorer la cohérence éventuelle de l'expérience utilisateur.

Le septième extrait les limites avant que le domaine ne soit compris.

## Limites

L'échelle organisationnelle, les contraintes réglementaires et les profils de charge de travail peuvent justifier une distribution précoce. Cet article offre un défaut conservateur, pas une interdiction universelle contre les microservices.

## Concepts connexes

Lire [Architecture des microservices](/fr/knowledge/concepts/microservice-architecture/), [Architecture d'événements](/fr/knowledge/concepts/event-driven-architecture/), [Systèmes de réflexion](/fr/knowledge/concepts/systems-thinking/) et [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/).

## Programme connexe

Voir [VASTE](/fr/programs/vaste/).

## Glossaire

Microservice : un service déployable de façon indépendante, aligné sur une capacité limitée.

Monolithe modulaire : une application déployable avec des limites internes de module.

Contexte bouché : une limite de domaine à l'intérieur de laquelle un modèle et un langage sont cohérents.

Monolithe distribué : composants déployés séparément qui restent étroitement couplés.

Saga : un processus distribué coordonné par les transactions locales et la compensation.

Boîte d'envoi : un modèle de publication fiable des événements après un changement de base de données.

## Références

- Lewis, James et Martin Fowler. Microservices. 2014.
- Fowler, Martin. MonolithFirst. 2015.
- Evans, Eric, référence de conception de domaine.
