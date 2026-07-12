---
id: ea:publication:why-graphs-are-more-powerful-than-folders-fr
type: publication
slug:
  canonical: why-graphs-are-more-powerful-than-folders
title: Pourquoi les graphes sont plus puissants que les dossiers
subtitle: Article technique
abstract: "Une comparaison pratique des dossiers hiérarchiques et des modèles graphiques pour les connaissances, les projets, les archives, l'identité, la provenance et les interfaces générées."
description: "Apprenez quand les modèles graphiques surpassent les hiérarchies de dossiers, pourquoi les relations comptent, et comment garder les dossiers comme projections utiles sur les données connectées."
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
  - id: ea:concept:graph-modeling
  - id: ea:concept:knowledge-graph
  - id: ea:concept:entity-identity
  - id: ea:concept:provenance
  - id: ea:program:vaste
  - id: ea:project:vestiges
claims:
  - "Les dossiers fournissent un seul chemin de confinement primaire, tandis que les graphes conservent de nombreuses relations simultanées entre les entités."
  - "Les graphes ne devraient pas éliminer les vues hiérarchiques; ils devraient générer plusieurs projections utiles à partir d'un modèle connecté."
evidence:
  - id: ea:concept:graph-modeling
  - id: ea:concept:knowledge-graph
sources:
  - title: RDF 1.1 Concepts and Abstract Syntax
    author: Richard Cyganiak, David Wood and Markus Lanthaler
    publisher: W3C
    publishedAt: 2014-02-25
    accessedAt: 2026-06-24
    url: https://www.w3.org/TR/rdf11-concepts/
  - title: The CIDOC Conceptual Reference Model
    publisher: CIDOC CRM Special Interest Group
    accessedAt: 2026-06-24
    url: https://www.cidoc-crm.org/
citation:
  preferred: Electronic Artefacts. "Pourquoi les graphes sont plus puissants que les dossiers".
    Article technique, version 1.1.1, 2026.
tags:
  - Graph Modeling
  - Folders
  - graphe de connaissances
  - architecture de l’information
  - VASTE
disciplines:
  - systèmes de connaissance
  - conception de systèmes
  - architecture de l’information
  - architecture logicielle
translationOf: ea:publication:why-graphs-are-more-powerful-than-folders
---

## Problème

Les hiérarchies de dossiers forcent les objets connectés à un seul emplacement primaire. À mesure que les projets grandissent, l'identité, la provenance, les relations interdisciplinaires et les multiples voies de découverte se cachent dans les noms de fichiers, les copies et la mémoire institutionnelle.

## Présentation

Les dossiers sont l'une des interfaces les plus réussies en informatique. Ils offrent un moyen familier de regrouper les documents, de naviguer dans le stockage et d'attribuer des noms. Leur limitation n'est pas que la hiérarchie soit obsolète. C'est qu'un dossier demande à chaque élément d'occuper une place principale.

La plupart des connaissances réelles ne sont pas façonnées comme un arbre. Un enregistrement appartient à un album, a été produit au cours d'un projet, utilise une technique, contient une performance par une personne, dérive de fichiers sources, et peut être discuté par plusieurs publications. Un dossier peut stocker le fichier sous un seul chemin. Les autres relations doivent être dupliquées, écrites dans des noms de fichiers, cachées dans des métadonnées ou mémorisées par des personnes.

Un graphique fait des relations de première classe. Les entités conservent des identités stables, et les bords tapés les relient à travers de nombreux contextes. Le même enregistrement peut rester un objet tout en apparaissant dans des vues projet, artiste, technique, archives et publication. C'est pourquoi les graphiques sont plus puissants pour les systèmes de connaissances, l'infrastructure culturelle et les produits complexes.

La puissance ne signifie pas le remplacement. Les interfaces des dossiers et des arbres restent d'excellentes projections. Une architecture graphique devrait laisser les utilisateurs parcourir hiérarchiquement quand cela est utile, sans faire de la hiérarchie la seule vérité.

## Comment les dossiers modèle l'information

Un chemin du système de fichiers exprime le confinement. `/projects/palimpsests/audio/final/master.wav` nous dit qu'un fichier se trouve dans une séquence de répertoires. Le chemin peut communiquer projet, moyen, statut et rôle en nommant des conventions.

Ce modèle fonctionne lorsque la propriété est claire et que les relations sont pour la plupart uniques à nombreuses. Un projet contient des produits livrables. Un an contient des factures. Un dépôt logiciel contient des modules. Les chemins sont faciles à synchroniser, à archiver et à comprendre avec les outils de base.

Les problèmes apparaissent quand un objet appartient à plusieurs endroits. Les équipes copient le fichier, créent des raccourcis ou choisissent un emplacement canonique et comptent sur la mémoire pour le reste. Des copies divergent. Les raccourcis se brisent. Les conventions nominatives deviennent des bases de données codées : `2026_Palimpsests_Master_v12_FINAL-2.wav`.

La hiérarchie porte l'identité, la version, le statut et le contexte à la fois. Un changement de chemin peut ressembler à un changement d'identité même lorsque l'objet reste le même.

## Graphiques primitifs

Un graphique commence par des nœuds et des bords. Les nœuds représentent des entités telles que des projets, des personnes, des dossiers, des concepts ou des institutions. Les bords représentent des relations telles que `createdBy`, `partOf`, `documents`, `usesTechnology` ou `derivedFrom`.

Propriétés joignent des valeurs supplémentaires : dates, titres, état et descriptions. Les identifiants stables permettent à une entité de rester la même même même si son titre ou son URL publique change.

Les relations typées sont essentielles. Une visualisation en réseau où chaque ligne signifie « liée » n'est pas un graphe de connaissances utile. Le type indique au logiciel et aux lecteurs comment interpréter la connexion.

RDF formalise les énoncés graphiques comme sujet, prédicat et objet. Un système n'a pas besoin de stocker RDF en interne pour bénéficier de la discipline. Electronic Artefacts utilise des ID typés et des prédicats qui peuvent être publiés par JSON-LD et des sorties graphiques générées.

## Architecture

L'architecture sépare les nœuds canoniques et les relations typées du stockage et de la présentation. Les fichiers restent dans les dépôts ou les magasins d'objets, tandis que les ID stables les connectent aux enregistrements du graphe et aux vues générées.

## Nombreux chemins valides

Dans un arbre de dossiers, chaque élément a un chemin parent. Dans un graphique, un nœud peut être atteint par de nombreux chemins significatifs.

Un lecteur peut passer de Palimpsests à ORETH par `poweredBy`, puis à Signal Archéologie par `appliesConcept`, puis à une publication par `documentedBy`. Un autre lecteur peut commencer par la préservation numérique et arriver au même projet par des relations d'archives.

Ces chemins reflètent différentes questions. « Quel programme est le moteur de ce projet? » diffère de « Quels travaux démontrent ce concept? » Un graphique peut répondre à la fois sans dupliquer les enregistrements sous-jacents.

Ceci est particulièrement précieux pour la découverte. Les utilisateurs connaissent rarement le dossier exact choisi par un éditeur. Ils abordent les gens, les thèmes, les outils, les lieux ou les problèmes.

## Identité stable

Les systèmes de dossiers assimilent souvent l'emplacement à l'identité. Déplacement d'un fichier change son chemin et peut casser des liens. Un graphique attribue un identifiant indépendant du placement actuel.

Les ID d'Electronic Artefacts tels que `ea:program:vaste` ou `ea:concept:knowledge-graph` restent stables pendant que les pages publiques, les étiquettes et les métadonnées évoluent. Les relations se rapportent à l'identificateur, et non à un titre copié.

L'identité stable supporte également la fusion. Si deux importations décrivent la même institution, elles peuvent être rapprochées d'un seul noeud. Si elles décrivent différentes institutions dont les noms sont similaires, des ID distincts conservent la distinction.

L'identité canonique est fondamentale pour le référencement. Plusieurs articles peuvent être liés à une page de concept plutôt qu'à des définitions concurrentes. Les redirections et les alias peuvent préserver les anciennes URL.

## Provenance

Les dossiers montrent où un fichier est stocké, pas nécessairement d'où il vient. La provenance a besoin de relations : dérivées, créées par, numérisées, examinées par, remplaces ou générées.

Un graphique peut relier un artefact au matériel source, aux événements de transformation, aux versions logicielles et aux décisions de publication. Cela rend le lignage interrogeable.

Pour Palimpsests, un fichier audio final peut être relié à des tiges, des sessions, des enregistrements de référence, des analyses ORETH et des enregistrements de sortie. Publier chaque source privée est inutile; le graphique peut maintenir une provenance restreinte et exposer une projection publique.

La provenance aide également les systèmes d'IA. Une réponse générée peut citer des nœuds sources canoniques plutôt que de s'appuyer sur des fragments de texte anonymes.

## Heure

Les hiérarchies sont faibles pour représenter le changement. Un fichier peut passer de `draft` à `final`, mais l'état antérieur peut disparaître à moins que le contrôle de version ou les sauvegardes le préservent.

Les graphiques peuvent modéliser le temps à travers les entités de version, les enregistrements d'événements et la validité de la relation. Une personne a occupé un rôle pendant une période. Un projet utilisait une technologie avant de migrer. Une revendication a été remplacée par une publication ultérieure.

La modélisation temporelle empêche l'état actuel d'effacer l'histoire. Les connaissances culturelles dépendent souvent de la séquence : qui a appris de qui, comment une technique a bougé, quand une institution a changé de nom.

V6 a besoin de cette capacité parce que l'artisanat et la transmission culturelle sont des processus et non des profils statiques.

## Autorisations et contexte

Les permissions de dossier s'appliquent aux chemins et aux sous-arbres hérités. Ceci est efficace pour de nombreuses tâches de stockage. Les systèmes graphiques peuvent avoir besoin d'autorisations en fonction du type d'entité, de la relation, de l'adhésion au projet ou du but.

Un éditeur peut lire un enregistrement source restreint mais ne publier qu'une citation dérivée. Un contributeur pourrait proposer une relation avec une institution mais ne pas changer son identité canonique. Un modèle pourrait analyser des documents privés tout en récupérant seulement les enregistrements autorisés pour l'utilisateur actuel.

C'est une exécution contextuelle : le comportement dépend de l'acteur, de l'entité, de la relation et de l'état. VASTE traite ces conditions comme des problèmes d'exécution.

Les permissions graphiques sont plus expressives mais plus difficiles à raisonner. Les systèmes ont besoin de règles et d'essais explicites pour éviter toute traversée accidentelle vers des nœuds restreints.

## Demande de renseignements

Les requêtes de dossiers sont généralement des chemins de recherche, des noms ou des contenus de fichiers. Des questions graphiques peuvent être posées sur les modèles : quelles publications documentent les concepts appliqués par VASTE ? Quelles techniques sont reliées à un matériau par une personne? Quels artefacts proviennent d'une source et manquent de métadonnées de conservation?

Les requêtes de chemin exposent les relations indirectes. Ils peuvent appuyer les recommandations, l'analyse d'impact et la détection des anomalies.

La recherche et la traversée du graphique se complètent. La recherche en texte intégral trouve des passages. Les requêtes graphiques trouvent des modèles structurels. Une interface de connaissance peut résoudre une entité par la recherche puis explorer son voisinage.

La valeur de la requête dépend de la qualité de modélisation. Les relations et les doubles identités donnent des réponses vagues.

## Vues générées

Un graphique ne devrait pas forcer chaque utilisateur à une visualisation par nœuds. Il peut générer des vues conventionnelles : pages de projet, calendriers chronologiques, index de catégories, dossiers, tableaux et cartes.

La même entité peut apparaître dans plusieurs vues sans duplication. Un index de publication trie par date. Une page discipline groupes par thème. Une page de projet affiche des programmes et des articles connexes. Une chronologie montre les événements.

Cette séparation entre le modèle et la projection est l'un des plus grands avantages architecturaux. Les éditeurs conservent un enregistrement canonique; les systèmes de construction produisent des surfaces spécifiques au public.

Electronic Artefacts suivent déjà ce modèle. Markdown front matter alimente les pages de l'entité, les routes d’identification, les documents de recherche, JSON-LD, les entrées du plan du site et les voisinages du graphe.

## Graphiques et systèmes de fichiers

Les graphes ne suppriment pas le besoin de fichiers. Les documents sources, les médias et le code doivent encore être stockés. Le graphique doit les mentionner et les décrire.

Une architecture pratique conserve des actifs binaires dans un système de fichiers ou un magasin d'objets, des enregistrements sources dans le contrôle de version ou une base de données, et des relations de graphe dans des données structurées. Les cartes d'identité stables font le pont entre ces couches.

Les conventions de dossiers lisibles par l'homme restent utiles pour la maintenance. L'erreur est de traiter ces conventions comme le seul modèle de domaine.

Le contrôle des versions complète également les graphiques. Git enregistre l'historique du changement textuel, tandis que les entités graphiques décrivent les relations sémantiques. L'un ne peut pas remplacer l'autre.

## Modéliser le monde

L'expression « modéliser le monde avec des graphiques » peut inciter à une trop grande ouverture. Aucun graphique ne capture complètement la réalité. Un modèle sélectionne les entités et les relations selon leur but.

La première étape est la question des compétences. Que doit répondre le système? Pour V6 : qui pratique une technique, quels matériaux elle utilise, où elle est enseignée, quels documents appuient la revendication et comment elle a changé au fil du temps. Ces questions déterminent le graphique.

La deuxième étape est la preuve. Une relation doit avoir une source lorsqu'elle fait une revendication culturelle substantielle.

Le troisième est la gouvernance. Les nouveaux prédicats et types d'entités doivent être examinés. Sinon, le graphique devient une collection incontrôlée d'interprétations personnelles.

Le quatrième est l'humilité. D'autres modèles peuvent être valides. Les catégories culturelles devraient soutenir les termes locaux et les interprétations contestées.

## Quand un dossier suffit

Utilisez des dossiers lorsque le domaine a une structure de confinement stable, le nombre d'objets est limité et les relations croisées ne sont pas importantes. Les documents fiscaux personnels, les artefacts de construction et l'exportation d'un petit projet peuvent n'avoir besoin de rien de plus.

Un graphique introduit la gestion de l'identité, la gouvernance des relations, l'outillage de requête et la complexité de l'interface. Il devrait résoudre de vrais problèmes.

Un chemin de migration commun commence avec les fichiers et la matière première. Des ID et des références stables sont ajoutés. Une étape de construction génère des indices et des sorties de relation. Une base de données ne devient nécessaire que lorsque les requêtes de contribution, d'échelle ou d'exécution dépassent les flux statiques.

Electronic Artefacts utilise cette approche progressive. Le système public gagne des propriétés graphiques sans rejeter Markdown et publication statique.

## Erreurs de graphique communes

La première défaillance est le théâtre graphique : un réseau visuel de nœuds sans sémantique tapée ni questions utiles.

Le second est l'explosion de l'entité. Chaque phrase devient un nœud, produisant des milliers de pages vides.

La troisième est la relation universelle. Tous les bords deviennent `relatedTo`, donc la traversée n'a aucune signification.

Le quatrième manque de provenance. Les allégations apparaissent comme des faits sans source ni confiance.

Le cinquième ignore les projections. Les utilisateurs sont obligés de naviguer directement dans le modèle de données.

La sixième centralise tout. Un graphique devient une plateforme obligatoire même pour les composants indépendants qui n'ont besoin que d'un fichier simple.

## VASTE

VASTE étend la modélisation graphique en exécution. Les entités et les relations ne décrivent pas seulement un domaine; elles participent aux permissions, au contexte, aux événements et aux projections.

Cela fait du graphique un substrat d'exécution. Une relation peut influencer quelle opération est autorisée ou quel événement se propage. Les applications publiques peuvent partager identité et sémantique tout en exposant différentes interfaces.

Cette approche est utile pour les systèmes où les connaissances et les flux de travail sont indissociables : archives, plateformes culturelles, systèmes de droits et mémoire institutionnelle.

Il faut également renforcer les contrôles. L'exécution devrait utiliser des quartiers délimités et des prédicats validés plutôt que des traversées arbitraires.

## V6

V6 démontre pourquoi les dossiers sont insuffisants pour les connaissances culturelles. Une technique artisanale appartient aux personnes, aux lieux, aux matériaux, aux outils, aux institutions et aux œuvres. Aucune hiérarchie ne peut représenter tous ces chemins.

Un graphique permet à la plateforme de préserver la transmission : une personne apprise d'une autre personne, enseignée dans un établissement, a utilisé un matériel et contribué à un travail. Les pages publiques peuvent ensuite raconter des histoires cohérentes à partir des mêmes documents structurés.

Les services économiques peuvent émerger du graphique. Une liste de marché est liée aux compétences, au matériel et à la provenance vérifiés plutôt qu'à une carte de produit isolée.

## Centre de connaissances

Le Knowledge Hub utilise l'architecture graphique pour empêcher les articles de devenir des articles de blog isolés. Chaque publication documente les concepts, technologies, projets et programmes. Les collections créent des chemins de lecture curés. Les pages conceptuelles accumulent l'autorité.

Les dossiers organisent toujours le dépôt. Le graphique fournit la structure intellectuelle publique. Cette coexistence est la réponse pratique au titre : les graphiques sont plus puissants parce qu'ils peuvent préserver de nombreuses relations, tandis que les dossiers restent utiles comme une seule vue.

## Mise en œuvre

Commencez par ajouter des identifiants stables et des références typées aux enregistrements existants. Préserver le stockage des dossiers, générer des index de relations et des vues publiques, puis introduire une base de données graphique uniquement lorsque les requêtes d'exécution ou les mises à jour collaboratives l'exigent.

## Éléments de preuve

RDF fournit un modèle standard de graphique objet-prédicat, tandis que CRM CIDOC montre comment les entités culturelles et les événements peuvent être intégrés dans des collections hétérogènes.

## Limites

Les graphiques ajoutent la gouvernance et la complexité des requêtes. Des prédicats médiocres, des identités dupliquées et une traversée sans restriction peuvent rendre un graphique moins utilisable qu'une hiérarchie disciplinée. Chaque collection de fichiers ne nécessite pas un graphique.

## Concepts connexes

Lire [Modélisation des graphiques](/fr/knowledge/concepts/graph-modeling/), [Graphe de connaissances](/fr/knowledge/concepts/knowledge-graph/), [Identité de l'entité](/fr/knowledge/concepts/entity-identity/) et [Provenance](/fr/knowledge/concepts/provenance/).

## Programmes et projets connexes

Voir [VASTE](/fr/programs/vaste/) et [V6](/fr/projects/v6/).

## Glossaire

Hiérarchie : structure où les objets sont organisés par le confinement parent-enfant.

Noeud : une entité adressable dans un graphique.

Edge : une relation entre les nœuds.

Prédice : le type ou la signification d'une relation graphique.

Projection : une vue générée par un modèle sous-jacent.

Requête de chemin : une requête qui suit une séquence de relations.

## Références

- W3C. RDF 1.1 Concepts et syntaxe abstraite.
- CRM CIDOC Groupe d'intérêt spécial. Modèle conceptuel de référence du CIDOC.
