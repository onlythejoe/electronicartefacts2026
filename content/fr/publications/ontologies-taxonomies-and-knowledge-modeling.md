---
id: ea:publication:ontologies-taxonomies-and-knowledge-modeling-fr
type: publication
slug:
  canonical: ontologies-taxonomies-and-knowledge-modeling
title: Ontologies, taxonomies et modélisation des connaissances
subtitle: Article technique
abstract: "Guide pratique des taxonomies, des thésaurus, des thésaurus, des ontologies, des vocabulaires contrôlés, des OWL, des SKOS et de la modélisation sémantique durable."
description: "Comprendre les différences entre taxonomies et ontologies et apprendre à concevoir un modèle de connaissance durable sans sur-ingénierie."
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
  - id: ea:concept:ontology
  - id: ea:concept:knowledge-graph
  - id: ea:concept:metadata
  - id: ea:technology:owl
  - id: ea:technology:skos
  - id: ea:project:vestiges
claims:
  - "Les taxonomies classent les concepts, tandis que les ontologies précisent des entités de domaine plus riches, des propriétés, des relations et des contraintes."
  - "Les modèles durables de connaissances devraient commencer par des questions réelles et des besoins d'interopérabilité plutôt que par une expressivité formelle maximale."
evidence:
  - id: ea:concept:ontology
  - id: ea:concept:knowledge-graph
sources:
  - title: OWL 2 Web Ontology Language Document Overview
    publisher: W3C
    publishedAt: 2012-12-11
    accessedAt: 2026-06-24
    url: https://www.w3.org/TR/owl2-overview/
  - title: SKOS Simple Knowledge Organization System Reference
    publisher: W3C
    publishedAt: 2009-08-18
    accessedAt: 2026-06-24
    url: https://www.w3.org/TR/skos-reference/
  - title: The CIDOC Conceptual Reference Model
    publisher: CIDOC CRM Special Interest Group
    accessedAt: 2026-06-24
    url: https://www.cidoc-crm.org/
citation:
  preferred: Electronic Artefacts. "Ontologies, taxonomies et modélisation des connaissances". Article
    technique, version 1.1.1, 2026.
tags:
  - Ontology
  - Taxonomy
  - SKOS
  - OWL
  - Knowledge Modeling
disciplines:
  - systèmes de connaissance
  - architecture de l’information
  - Semantic Web
  - Philosophy
translationOf: ea:publication:ontologies-taxonomies-and-knowledge-modeling
---

## Problème

Les systèmes de connaissances croissants mélangent souvent des catégories, des étiquettes, des types d'entités et des relations sans définir leur rôle. Le résultat est la duplication des termes, la navigation ambiguë et les bords des graphiques que les machines et les éditeurs ne peuvent pas interpréter uniformément.

## Présentation

La taxonomie et l'ontologie sont souvent utilisées comme mots interchangeables pour l'information organisée. Ils sont liés, mais ils résolvent différents problèmes. Une taxonomie arrange principalement les concepts en catégories, souvent par des relations plus larges et plus étroites. Une ontologie spécifie les types d'entités qui existent dans un domaine, les propriétés qu'elles peuvent avoir, les relations qu'elles peuvent entrer et parfois les contraintes ou règles d'inférence qui suivent.

La différence est importante lorsqu'un site passe de dizaines à des milliers de documents. Les catégories peuvent aider les lecteurs à naviguer, mais ils ne peuvent pas exprimer par eux-mêmes qu'une personne a enseigné une technique, une technique utilise un matériel, un projet documente un lieu, ou une publication remplace une revendication antérieure. Ces déclarations exigent des entités et des relations typées.

La modélisation du savoir est la pratique de choisir délibérément ces structures. Elle combine jugement éditorial, recherche de domaine et architecture technique. L'objectif n'est pas de formaliser complètement la réalité. Il doit représenter suffisamment de sens pour soutenir la découverte, la validation, la réutilisation et le changement.

## Vocabulaires contrôlés

Un vocabulaire contrôlé est un ensemble approuvé de termes utilisés de façon uniforme. Elle peut définir les étiquettes préférées, les synonymes, les notes et la portée. Les vocabulaires contrôlés réduisent la variation : « AI », « Intelligence artificielle » et « Intelligence mécanique » peuvent être cartographiés plutôt que traités comme des étiquettes non reliées.

Le contrôle ne signifie pas l'immobilité. Les termes ont besoin de gouvernance, de version et d'examen. De nouveaux champs apparaissent, des changements de langage et des catégories antérieures révèlent des biais. Un vocabulaire devrait indiquer pourquoi un terme existe, ce qu'il inclut et ce qu'il exclut.

Pour Electronic Artefacts, `disciplines` fonctionne en tant que grandes catégories contrôlées, tandis que `tags` prend en charge un vocabulaire de récupération plus spécifique. Les entités-concept canoniques fournissent des définitions. Ce modèle stratifié empêche un champ d'étiquettes surchargé de porter toutes les responsabilités sémantiques.

## Fiscalité

Une taxonomie organise des concepts par classification. La forme la plus simple est une hiérarchie: la musique électronique appartient à la musique; l'apprentissage automatique appartient à l'intelligence artificielle. Les taxonomies soutiennent la navigation, la présentation et l'analyse de couverture éditoriale.

La hiérarchie est attrayante parce qu'elle est facile à afficher comme un arbre. Il devient restrictif lorsqu'un concept appartient à plusieurs contextes. Le codage créatif relie programmation, art numérique, design et éducation. La forcer en un seul parent cache des chemins importants.

La polyhiérarchie permet plusieurs concepts plus larges. SKOS soutient des relations plus larges et plus étroites sans exiger un seul arbre. Même alors, la hiérarchie devrait être utilisée quand un concept a véritablement une relation conceptuelle plus large, pas seulement parce que deux pages sont liées.

Une taxonomie doit rester assez superficielle pour comprendre. Les arbres de catégorie profonde encodent souvent l'historique organisationnel plutôt que les besoins des utilisateurs.

## Thésaurus

Un thésaurus étend une taxonomie avec une structure lexicale et associative. Elle permet de distinguer les étiquettes préférées et les étiquettes alternatives, d'enregistrer des concepts plus larges et plus étroits et de relier des concepts connexes qui ne sont pas hiérarchiques.

Ceci est précieux pour la recherche. Un lecteur qui recherche "LLM" doit trouver un modèle de langue grande. Une recherche de "MAO" en français peut avoir besoin de cartographier la terminologie de production de musique informatique. Les termes historiques peuvent rester découvrables sans devenir l'étiquette courante préférée.

SKOS a été conçu pour publier ce type de système d'organisation du savoir sur le Web. Ses concepts, étiquettes, notes et cartographies constituent un pont pragmatique entre les vocabulaires rédactionnels et les données liées.

## Pays

Une poolonomie émerge des tags créés par les utilisateurs plutôt qu'un vocabulaire centralisé. Il peut refléter un langage vivant et des associations inattendues. Le bookmarking social, les plateformes médiatiques et les systèmes de notes utilisent souvent des structures folkloriques.

L'avantage est la réactivité. Le coût est l'ambiguïté, la duplication des synonymes et une granularité incohérente. Un utilisateur marque un enregistrement «AI»; un autre utilise «generative-ai»; un autre utilise un nom de produit.

Un système hybride peut préserver les balises utilisateur en tant qu'observations tout en mappant les termes sélectionnés aux concepts canoniques. La folksonomie devient un apport à la gouvernance du vocabulaire plutôt qu'un remplacement incontrôlé.

V6 pourrait éventuellement avoir besoin de cet équilibre. Les intervenants devraient être en mesure de décrire les pratiques dans leur propre langue, tandis que les pages de connaissances publiques conservent des identités et des cartes stables.

## Ontologies

Une ontologie rend un modèle de domaine explicite. Il peut définir des classes telles que Personne, Technique, Matériel et Institution; des propriétés telles que les utilisationsMatériel ou enseignéPar; et des contraintes sur le lieu où ces propriétés s'appliquent.

Les ontologies formelles peuvent appuyer le raisonnement. Si chaque Conservateur est une Personne et qu'un document est un Conservateur, un raisonneur peut déduire que le document est une Personne. Si un bien est transitif ou inverse, des déclarations supplémentaires peuvent suivre.

Toutes les plateformes de connaissances n'ont pas besoin de ce niveau d'inférence. Une ontologie légère peut simplement être un schéma d'entité documenté et un registre de prédicats avec validation. Electronic Artefacts suivent actuellement cette voie pragmatique : les types d'entités sont explicites, les références sont typées et les prédicats définissent les sujets et objets autorisés.

L'importante propriété est une signification partagée. Les développeurs, éditeurs et machines doivent interpréter `poweredBy` ou `documents` de manière cohérente.

## Architecture

Une architecture sémantique durable sépare les étiquettes contrôlées, les schémas conceptuels, les schémas d'entités, les prédicats, les contraintes et la provenance. SKOS peut publier la structure du vocabulaire, tandis que OWL peut exprimer une sémantique formelle plus forte au besoin.

## OWL

OWL, le Web Ontology Language, fournit une sémantique définie officiellement pour les classes, les propriétés, les individus et les contraintes. Il s'appuie sur RDF et prend en charge différents profils pour différents besoins de calcul.

OWL peut exprimer l'équivalence, la disjointité, la cardinalité et les caractéristiques de propriété. Ces capacités sont utiles lorsque l'interopérabilité et le raisonnement automatisé justifient la complexité.

Le risque est d'adopter le formalisme sans utilisation opérationnelle. Si aucune application ne consomme un axiome et qu'aucun éditeur ne peut le maintenir, le modèle crée un coût sans valeur. L'ontologie devrait gagner sa complexité par la validation, l'inférence, l'intégration ou l'avantage de la recherche.

Electronic Artefacts peuvent traiter OWL comme une future couche d'exportation ou d'alignement plutôt que de forcer chaque enregistrement interne en pleine sémantique formelle maintenant.

## POUVOIRS

SKOS est conçu pour les concepts tels que les taxonomies et les thésaurus. Il fournit des étiquettes privilégiées, alternatives et cachées, des liens plus larges, plus étroits et apparentés, des notes et des cartes entre les schémas.

SKOS est souvent le meilleur choix pour les catégories éditoriales car il ne prétend pas que chaque concept est une classe formelle de choses du monde réel. Un concept de "Sound Design" peut organiser des documents et des cartes sans nécessiter des axiomes logiques complexes.

Le Knowledge Hub pourrait publier ses disciplines et son vocabulaire de base en tant que concept de SKOS. Les étiquettes anglaise et française pourraient partager leur identité. Des chemins plus larges et connexes pourraient soutenir la navigation et la réutilisation externe.

SKOS et OWL peuvent coexister. Un modèle d'organisation du savoir; l'autre peut modéliser la sémantique du domaine.

## Entités par rapport aux concepts

Une ontologie distingue les types de choses des étiquettes conceptuelles. Une personne est une entité. « Technologue créatif » peut être un rôle ou un concept. Un logiciel est une entité. "Graph Runtime" est un concept qu'un programme peut mettre en œuvre.

Coller tout ça en tags perd son identité. Il devient difficile de joindre des dates, des sources, des versions ou des relations. Inversement, transformer chaque nom en entité crée des frais généraux inutiles.

Créer une entité canonique lorsque l'objet a besoin de sa propre histoire, relations, métadonnées ou page publique. Utilisez un terme de vocabulaire lorsqu'il supporte principalement la classification. Promouvoir un terme à une entité lorsque la preuve et la réutilisation le justifient.

Cette règle aide le Knowledge Hub à grandir sans générer des milliers de pages minces.

## Relations et prédicats

Les relations sont les verbes d'un modèle de connaissance. Ils ont plus de signification qu'un lien générique « lié ». Une publication documente un concept. Un projet applique une méthode. Un programme utilise une technologie. Un artefact provient d'une source.

Un prédicat a besoin d'une définition, d'un domaine et d'une plage autorisés, d'une étiquette inverse lorsque cela est utile et d'exigences de source lorsque la revendication est en conséquence. Les prédicats devraient être réutilisables dans de nombreux dossiers.

Évitez les synonymes qui fragmentent le graphique. `uses`, `employs`, `builtWith` et `leverages` peuvent tous signifier la même chose. Choisissez un prédicat canonique et réservez de nouveaux termes pour des distinctions significatives.

Evitez aussi de faire semblant de certitude. Une relation peut porter confiance, dates et provenance. La modélisation des connaissances devrait représenter un désaccord et une évolution plutôt que de forcer chaque affirmation à des faits intemporels.

## Manifestations de modélisation

Les domaines culturels et techniques sont souvent centrés sur les événements. Une personne n'appartenait pas simplement à une institution; elle s'est jointe à elle à un moment et dans un rôle. Une œuvre d'art a été créée, exposée, restaurée et acquise par des événements.

Les relations directes sont pratiques mais peuvent cacher le temps et les participants. La confirmation d'un événement en tant qu'entité permet de joindre la date, le lieu, la preuve et le résultat.

Le CRM du CIDOC démontre la valeur de la modélisation axée sur les événements pour le patrimoine culturel. Il fournit une structure conceptuelle commune pour intégrer l'information sur les musées, les archives et les bibliothèques sans la réduire à un seul schéma de base de données.

Electronic Artefacts prend déjà en charge les entités événementielles. Les futurs dossiers V6 peuvent les utiliser pour l'enseignement, la transmission, les expositions et l'histoire des institutions.

## Modélisation de l'incertitude

Les systèmes de connaissances contiennent des observations, des interprétations et des allégations de confiance différente. Une ontologie définit les énoncés possibles; les métadonnées éditoriales décrivent la façon dont une déclaration particulière est supportée.

La confiance ne doit pas être codée uniquement par la prose. Les dossiers peuvent distinguer les états spéculatifs, observés, validés, publiés et canoniques. Les sources et les dates d'examen fournissent un contexte supplémentaire.

Deux revendications contradictoires peuvent coexister lorsque chacune a sa provenance. Le système ne devrait pas déduire une seule vérité simplement parce qu'un seul document a été ajouté plus tard.

Ceci est particulièrement important pour la récupération de l'IA. Un modèle devrait voir quelle source est canonique, qui est historique et qui est incertaine.

## Processus de conception de l'ontologie

Commencez par les questions de compétence : à quoi le système devrait-il répondre? "Quelles techniques utilisent ce matériau ?" « Qui a documenté ce projet? » « Quelles publications appuient cette affirmation? » Les questions révèlent les entités et les prédicats requis.

Recueillir des exemples réels avant de définir un schéma universel. Identifier les noms, verbes, dates et identifiants répétés. Vérifier si différents éditeurs classent les mêmes enregistrements de façon uniforme.

Définir un petit noyau, puis ajouter des modules. Electronic Artefacts peut maintenir des entités et des relations partagées tandis que des modules audio, archives ou culturels spécialisés introduisent des termes de domaine.

Exemptions de documents et non-objectifs. Un modèle devient plus clair lorsqu'il indique ce qu'il ne représente pas.

Version du vocabulaire. Les modifications apportées aux identifiants et aux significations prédictives peuvent briser les URL, les relations et les intégrations externes.

## Mise en œuvre

Commencez par des questions de compétence et des dossiers réels. Définir une petite entité et prédiquer le noyau, cartographier les synonymes, valider les domaines de relation autorisés, publier des notes de portée et ajouter des axiomes formels seulement lorsqu'ils produisent une valeur mesurable d'interopérabilité ou d'inférence.

## Éléments de preuve

W3C SKOS définit un modèle pour les schémas conceptuels et les cartes de vocabulaire. W3C OWL fournit une sémantique d'ontologie formelle. Le CRM du CIDOC démontre la modélisation axée sur les événements pour l'intégration du patrimoine culturel.

## Erreurs communes de modélisation

La première erreur est la prolifération des catégories. Les éditeurs créent des catégories quasi-synonymes pour chaque article et la navigation devient bruyante.

La seconde est l'abstraction prématurée. Une classe générique `Resource` ou `Thing` fournit peu de conseils rédactionnels.

Le troisième est la hiérarchie en surcharge. Les concepts connexes sont forcés d'établir des relations parents-enfants, même lorsque la relation est contextuelle.

La quatrième est universelle `relatedTo`. Il crée des bords sans signification et affaiblit la traversée du graphique.

Le cinquième est de modéliser seulement les besoins actuels du logiciel. Un modèle de connaissance durable tient compte des citations, des archives et de la réutilisation future.

Le sixième est d'ignorer la langue et la culture. Les étiquettes et classifications préférées reflètent les choix institutionnels. D'autres noms et notes de portée sont essentiels.

## Recherche et référencement

La taxonomie influence la découverte. Les pages de concept canonique peuvent répondre aux recherches de définition, tandis que les pages de catégorie organisent l'autorité thématique. Les liens internes devraient suivre des relations significatives plutôt que de répéter mécaniquement les ancres de mots clés.

Les données structurées aident les machines à distinguer un concept, un article, un projet et une organisation. Les identifiants d'entité stables empêchent plusieurs pages de rivaliser comme définition canonique.

Les pages en ontologie sont contre-productives. Une page de concept public devrait comprendre la définition, la portée, les applications, les limites, les sources et les entités connexes. Le modèle interne peut contenir des termes qui ne sont pas encore publics.

Pour la récupération d'IA, les types de relation explicite et les métadonnées sources rendent l'assemblage contextuel plus fiable.

## Modèle électronique Artefacts

Electronic Artefacts utilisent quatre couches complémentaires. Les types d'entités identifient ce qu'est un document. Les disciplines offrent de larges catégories transversales. Les étiquettes fournissent des termes de récupération spécifiques. Les relations typées expriment les connexions sémantiques.

Cette architecture peut s'étendre parce que chaque couche a une responsabilité. Une publication peut appartenir à plusieurs disciplines, porter des étiquettes ciblées, documenter plusieurs concepts et se connecter à des projets sans être placé dans un seul dossier.

VASTE peut rendre la même sémantique exécutable. V6 peut les étendre aux connaissances culturelles. Le centre de connaissances du public fournit des définitions lisibles et des pistes sources.

## Gouvernance

Un vocabulaire a besoin de propriété. Les termes proposés devraient être vérifiés pour les doubles, la portée et l'utilisation prévue. Les changements prédicaux nécessitent un examen plus poussé parce qu'ils affectent la sémantique des graphiques.

Les rapports d'utilisation peuvent révéler des catégories d'orphelins, des termes surchargés et des étiquettes incohérentes. Les éditeurs devraient fusionner les duplicates et déprécier les termes sans supprimer les mappages historiques.

La gouvernance devrait rester proportionnée. Un petit studio n'a pas besoin d'un comité pour chaque tag, mais il a besoin de décisions canoniques enregistrées quelque part.

## Limites

Aucune ontologie n'est une représentation neutre ou complète d'un domaine. Les modèles officiels peuvent encoder les biais institutionnels et devenir coûteux à changer. D'autres étiquettes, processus de provenance et de révision demeurent nécessaires.

## Concepts connexes

Lire [Ontologie](/fr/knowledge/concepts/ontology/), [Graphe de connaissances](/fr/knowledge/concepts/knowledge-graph/), [Métadonnées](/fr/knowledge/concepts/metadata/), [Données liées](/fr/knowledge/concepts/linked-data/) et [Modélisation des graphiques](/fr/knowledge/concepts/graph-modeling/).

## Technologies connexes

Voir [OWL](/fr/knowledge/technologies/owl/), [POUVOIRS](/fr/knowledge/technologies/skos/) et [RDF](/fr/knowledge/technologies/rdf/).

## Projet connexe

Voir [V6](/fr/projects/v6/) pour la modélisation des connaissances culturelles.

## Glossaire

Vocabulaire contrôlé : ensemble de termes gouvernés.

Taxonomie : structure de classification, souvent hiérarchique.

Thésaurus: vocabulaire avec étiquettes, hiérarchie et liens associatifs.

Folksonomy: un vocabulaire émergeant des étiquettes utilisateur.

Ontologie : un modèle de domaine explicite d'entités, de propriétés et de relations.

Question de compétence : une question utilisée pour vérifier si un modèle représente les connaissances requises.

## Références

- W3C. OWL 2 Web Ontology Language Document Overview.
- W3C. SKOS Simple Knowledge Organization System Référence.
- CRM CIDOC Groupe d'intérêt spécial. Modèle conceptuel de référence du CIDOC.
