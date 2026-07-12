---
id: ea:publication:digital-preservation-and-living-archives-fr
type: publication
slug:
  canonical: digital-preservation-and-living-archives
title: Préservation numérique et archives vivantes
subtitle: Article technique
abstract: "Cet article explique la préservation numérique comme une pratique culturelle active qui maintient les objets numériques, les métadonnées, la provenance et l'interprétation utilisables au fil du temps."
description: "Un article technique sur la préservation numérique, les archives vivantes, les formats de fichiers, la provenance et les documents culturels d'Electronic Artefacts."
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
  - id: ea:concept:digital-preservation
  - id: ea:concept:provenance
  - id: ea:project:palimpsests
  - id: ea:project:vestiges
  - id: ea:concept:knowledge-graph
claims:
  - "La préservation numérique n'est pas une sauvegarde; c'est un soin à long terme pour les objets, les métadonnées, les droits, les formats et le contexte."
  - "Les archives vivantes ont besoin de relations de graphe parce que l'interprétation change alors que la provenance doit rester inspectable."
evidence:
  - id: ea:project:palimpsests
  - id: ea:project:vestiges
sources:
  - title: Digital Preservation Handbook
    publisher: Digital Preservation Coalition
    publishedAt: 2015-01-01
    accessedAt: 2026-06-23
    url: https://www.dpconline.org/handbook
  - title: Sustainability of Digital Formats
    publisher: Library of Congress
    accessedAt: 2026-06-23
    locator: Last updated 2024-06-18
    url: https://www.loc.gov/preservation/digital/formats/
  - title: Levels of Digital Preservation
    publisher: National Digital Stewardship Alliance
    accessedAt: 2026-06-23
    url: https://www.ndsa.org/publications/levels-of-digital-preservation/
citation:
  preferred: Electronic Artefacts. "Préservation numérique et archives vivantes". Article technique,
    version 1.1.1, 2026.
tags:
  - Digital Préservation
  - Living Archive
  - Provenance
  - Palimpsests
  - V6
disciplines:
  - archives
  - art numérique
  - systèmes de connaissance
  - histoire des technologies
translationOf: ea:publication:digital-preservation-and-living-archives
---

## Problème

La culture numérique est facile à copier et difficile à préserver. Un fichier peut être dupliqué en quelques secondes, mais la signification à long terme dépend de beaucoup plus que les octets. Qui l'a fait ? Quelle version est-ce ? Quel logiciel l'a créé ? Quels droits s'appliquent? À quel projet appartient-il ? Est-ce un travail final, une trace de processus, une image de référence, une sortie générée, une exportation endommagée ou un artefact public ?

Sauvegarde ne répond qu'une partie du problème : le fichier peut-il être récupéré après un échec ? La préservation numérique pose une question plus large : l'objet peut-il rester compréhensible, authentique, utilisable et accessible lorsque les formats, les logiciels, le matériel, les liens et le contexte culturel changent ?

Cette distinction compte pour Electronic Artefacts parce que le site contient des œuvres numériques : images, audio, code, pages générées, JSON-LD, notes de recherche, supports de projet et publications expérimentales. Les archives ne sont pas un entrepôt à la fin de la production. Cela fait partie de la façon dont le travail reste intelligible.

## Présentation

La préservation numérique est une pratique de soins de longue durée pour les objets numériques et leur contexte. Il combine stockage, stratégie de format, métadonnées, provenance, droits, contrôles de fixité, migration, copies d'accès et interprétation.

Une archive vivante est une archive qui peut continuer à recevoir des interprétations, des relations et des enregistrements actualisés sans prétendre que le passé est instable. La provenance de l'objet doit rester stable, mais la compréhension publique de cet objet peut s'approfondir avec le temps.

## Contexte

La Coalition pour la préservation numérique décrit la préservation numérique comme un domaine pratique concernant la gestion des ressources numériques au fil du temps. La Bibliothèque du Congrès maintient des lignes directrices sur la durabilité des formats parce que les formats de fichiers diffèrent en matière de transparence, de divulgation, d'adoption, de dépendances et de risque de préservation. Les niveaux de préservation numérique de la NDSA permettent aux organisations d'évaluer et d'améliorer les pratiques de préservation.

Ces références partagent un principe : la préservation est organisationnelle et technique. Il ne suffit pas de stocker des fichiers. Un système de préservation doit savoir ce qu'il a, comment il peut le vérifier, comment il peut le migrer et comment un futur utilisateur peut le comprendre.

## Historique

Archives systèmes numériques de longue date. Les archives matérielles gèrent la garde, la description, la conservation et l'accès. La préservation numérique a hérité de ces préoccupations et en a ajouté de nouvelles : défaillance des médias, obsolescence du format, dépendance des logiciels, pourriture des liens, perte de métadonnées, compression, dérive des versions et disparition des plates-formes.

Le passage à la culture numérique a intensifié le problème. Une œuvre d'art numérique, un site Web, une session d'enregistrement ou un prototype de logiciel peut dépendre d'outils, de systèmes d'exploitation, de plugins, d'API et de modèles d'interaction qui disparaissent. Préserver seulement l'exportation finale peut effacer le processus qui a rendu le travail significatif.

## Concepts fondamentaux

La fixité signifie vérifier qu'un fichier n'a pas changé de façon inattendue, habituellement par des comptes de chèques.

La preuve signifie l'enregistrement de l'origine, de la garde, de la paternité, de la transformation et de la preuve.

L'information sur la représentation signifie l'information nécessaire pour interpréter l'objet.

Copie d'accès signifie une version préparée pour l'utilisation, séparée d'un maître de conservation.

Migration signifie déplacer un objet ou des métadonnées dans un format ou un environnement plus récent.

La sélection signifie décider ce qui mérite une attention de conservation.

## Architecture

Une archive vivante a besoin de plusieurs couches:

- conservation du stockage pour les fichiers sources importants;
- les dossiers de métadonnées avec identité, dates, droits et contexte;
- les déclarations de provenance;
- surveillance du format;
- les pages d'accès public;
- les relations de graphe avec les projets, les concepts et les publications;
- l'examen des états qui distinguent les enregistrements canoniques de l'interprétation spéculative.

Pour un site web statique, la préservation inclut également les sorties générées. Les pages HTML, JSON-LD, les plans du site et les exportations de graphiques font partie du dossier public. Ils devraient être reproductibles à partir des dossiers sources, mais la conservation des instantanés générés peut encore aider les vérifications futures.

## Mise en œuvre

La voie de mise en œuvre devrait commencer par l'inventaire. Qu'est-ce qui existe ? Quels sont les dossiers publics? Quels sont les fichiers sources ? Quels sont les dossiers ? Quels formats sont risqués? Quels documents n'ont pas de provenance ?

Ensuite vient l'identité. Les objets importants doivent recevoir des identifiants et des routes stables. Un enregistrement ne doit pas dépendre uniquement d'un nom de fichier image ou d'un nom de dossier.

Alors vient la relation. Un artefact devrait dire à quel projet il appartient, à quelle publication il documente, quel concept il démontre et de quelle source ou processus de production il dérive.

Enfin vient la revue. La préservation est en cours. Les dossiers nécessitent des dates de modification, des états de confiance et des vérifications périodiques.

## Applications pratiques

Pour Palimpsests, la préservation numérique signifie plus que stocker des œuvres d'album et des exportations audio. Cela signifie préserver suffisamment de contexte pour comprendre les décisions relatives à la mémoire, aux résidus, au signal et à la production.

Pour ORETH, cela signifie préserver les notes de recherche et le contexte de l'analyse audio sans surclaimer les résultats de l'écoute automatique.

Pour V6, la préservation est essentielle parce que la thèse de la plateforme dépend des connaissances culturelles vivantes, de la contribution, de la provenance et de l'interprétation publique.

Pour le site Electronic Artefacts, il faut traiter les pages de connaissances générées comme des objets publics durables.

## Outils

Les outils utiles comprennent les comptes de vérification, les inventaires de fichiers, les registres de formats, les vocabulaires contrôlés, les enregistrements de provenance, le contrôle des sources en version, les schémas de métadonnées, les exportations statiques, les archives Web et les index graphiques.

## Éléments de preuve

Le dépôt actuel distingue déjà le contenu source, les pages générées, les sorties graphiques, les documents de recherche et les routes d’identification. Cette séparation permet la conservation car la source et la projection peuvent être inspectées séparément.

## Liste de contrôle sur la préservation

Un petit studio ou un site de recherche peut commencer par une liste de vérification pratique.

Identifier l'objet. Donnez des ID stables aux ouvrages, publications, médias et ensembles de données importants. Ne pas dépendre uniquement des noms de fichiers.

Enregistrement de provenance. Créateur de documents, éditeur, date, projet source, droits, transformations et confiance. Si l'objet provient d'un système hérité, dites-le.

Séparer les copies de conservation des copies d'accès. Une image Web compressée est utile pour les visiteurs, mais elle peut ne pas être le meilleur objet de préservation.

Formats de piste et dépendances. Un fichier est plus facile à conserver lorsque son format est ouvert, documenté, largement adopté et non verrouillé à un outil abandonné.

Vérifiez la fixité. Les contrôles n'expliquent pas le sens, mais ils aident à détecter les changements inattendus.

Connectez l'objet. Un élément conservé doit être lié au projet, à la publication, au concept ou au programme qui le rend significatif.

Révision périodique. La préservation n'est pas une seule action. C'est une pratique de maintenance.

## Erreurs courantes

La première erreur est de traiter le stockage en nuage comme une conservation. Le stockage en nuage peut faire partie d'une infrastructure, mais sans métadonnées, droits, fixité, sensibilisation au format et pratique de récupération, il ne s'agit que du stockage à distance.

La deuxième erreur est de préserver les sorties finales tout en rejetant le contexte. Pour une oeuvre culturelle, les ébauches, les références, les notes de procédé et les décisions de production peuvent avoir une valeur interprétative. Tous ne devraient pas être publics, mais un contexte important devrait être décrit.

La troisième erreur est la sur-conservation sans sélection. Si tout est gardé avec la même priorité, l'archive devient difficile à maintenir et difficile à interpréter.

## Implications pour Electronic Artefacts

Electronic Artefacts devraient traiter chaque projet majeur comme un contexte de préservation. VASTE a besoin d'architecture en version et d'enregistrements de licences. Les palimpsestes ont besoin d'une provenance audio, visuelle et interprétative. V6 a besoin de contribution et d'historique de validation. Le site lui-même a besoin d'instantanés et d'enregistrements sources générés parce que le graphe public fait partie de la production intellectuelle de l'institution.

Cette approche donne la valeur d'archive au-delà de la nostalgie. Il fait du site un système de mémoire de travail.

## Concepts connexes

Lire [Préservation numérique](/fr/knowledge/concepts/digital-preservation/), [Provenance](/fr/knowledge/concepts/provenance/), [Graphe de connaissances](/fr/knowledge/concepts/knowledge-graph/), [Palimpsestes](/fr/projects/palimpsests/) et [V6](/fr/projects/v6/).

## Lecture suggérée

Commencer par le Digital Preservation Coalition Handbook, Bibliothèque du Congrès Durabilité des formats numériques et niveaux de préservation numérique de la NDSA.

## Articles connexes

Continuer avec [Graphes de connaissances pour l'infrastructure culturelle](/fr/publications/knowledge-graphs-for-cultural-infrastructure/) et [Archéologie des signaux, mémoire audio et écoute automatique](/fr/publications/signal-archaeology-audio-memory-and-machine-listening/).

## Glossaire

Fixité : preuve qu'un dossier n'a pas changé de façon inattendue.

Migration : déplacer le contenu ou les métadonnées vers un nouveau format ou environnement.

Archive vivante : une archive qui préserve la provenance stable tout en permettant à l'interprétation de croître.

Information sur la représentation : contexte nécessaire pour comprendre un objet conservé.

## Limites

La préservation peut devenir infinie si aucun critère de sélection n'existe. Une archive vivante ne devrait pas tout garder également. Elle devrait préserver les objets porteurs de preuves, de sens, de droits ou de valeur interprétative future.

La préservation a également un coût écologique et économique. Le stockage, la migration et la redondance devraient être proportionnels à la signification.

## Références

- Coalition pour la préservation numérique. Manuel de préservation numérique, 2e édition.
- Bibliothèque du Congrès. Durabilité des formats numériques.
- Alliance nationale de gérance numérique. Niveaux de préservation numérique.
- Electronic Artefacts. Palimpsestes et enregistrements V6.
