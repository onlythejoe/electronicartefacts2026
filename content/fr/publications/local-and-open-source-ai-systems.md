---
id: ea:publication:local-and-open-source-ai-systems-fr
type: publication
slug:
  canonical: local-and-open-source-ai-systems
title: Systèmes d’IA locaux et open source
subtitle: Article technique
abstract: "Un guide pratique sur l'inférence locale, les modèles à poids ouvert, l'IA à source ouverte, la quantification, le matériel, la confidentialité, la licence et l'indépendance opérationnelle."
description: "Comprendre les systèmes locaux d'IA et d'IA open-source, y compris les poids des modèles, la quantification, llama.cpp, la vie privée, le matériel et les licences."
locale: fr
visibility: public
publicationClass: published
status: active
maturity: research
confidence: published
version:
  version: 1.2.0
  createdAt: 2026-06-24
  publishedAt: 2026-06-25
  modifiedAt: 2026-07-18
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
format: technicalArticle
subjects:
  - id: ea:concept:open-weight-model
  - id: ea:concept:open-source
  - id: ea:concept:large-language-model
  - id: ea:technology:llama-cpp
  - id: ea:concept:provenance
  - id: ea:project:voice-capture-studio
claims:
  - "L'inférence locale peut améliorer le contrôle, la confidentialité et la disponibilité hors ligne, mais elle transfère les responsabilités en matière de matériel, de sécurité et de maintenance à l'opérateur."
  - "Les poids téléchargeables ne devraient pas être décrites comme de l'IA open-source sans examiner le code, les informations sur les données de formation et les libertés de licence."
evidence:
  - id: ea:concept:open-weight-model
  - id: ea:technology:llama-cpp
sources:
  - title: The Open Source AI Definition 1.0
    publisher: Open Source Initiative
    accessedAt: 2026-06-24
    url: https://opensource.org/ai/open-source-ai-definition
  - title: llama.cpp
    publisher: ggml-org
    accessedAt: 2026-06-24
    url: https://github.com/ggml-org/llama.cpp
  - title: QLoRA Efficient Finetuning of Quantized LLMs
    author: Tim Dettmers et al.
    publisher: arXiv
    publishedAt: 2023-05-23
    accessedAt: 2026-06-24
    url: https://arxiv.org/abs/2305.14314
citation:
  preferred: Electronic Artefacts. "Systèmes d’IA locaux et open source". Article technique, version
    1.0.0, 2026.
tags:
  - IA locale
  - IA open source
  - poids ouverts
  - quantification
  - llama.cpp
disciplines:
  - intelligence artificielle
  - open source
  - programmation
  - conception de systèmes
translationOf: ea:publication:local-and-open-source-ai-systems
---

## Problème

Les services d'IA hébergés peuvent exposer des matériaux sensibles, créer une dépendance récurrente et cacher des détails d'implémentation. Le déploiement local offre un contrôle, mais il est souvent décrit sans distinguer l'emplacement, l'ouverture du modèle, les licences et la responsabilité opérationnelle.

## Présentation

L'IA locale signifie exécuter un modèle sur du matériel contrôlé par l'opérateur plutôt que d'envoyer chaque demande à un service d'inférence tiers. Le matériel peut être un ordinateur portable, un poste de travail, un serveur studio, un périphérique périphérique ou un cloud privé. Le modèle peut être entièrement open source, open-weight sous licence restrictive ou privé. Ces catégories se chevauchent mais ne sont pas interchangeables.

L'appel est clair. Les documents privés peuvent rester sur les infrastructures locales. Un outil créatif peut fonctionner hors ligne. Les coûts peuvent devenir prévisibles après investissement matériel. Les modèles peuvent être mis en version, adaptés et intégrés sans dépendre d'une interface de produit hébergée. Pour les studios d'archives et de recherche, l'exécution locale peut protéger le matériel non libéré et préserver un flux de travail reproductible.

L'IA locale n'est pas automatiquement privée, durable, sécurisée ou peu coûteuse. Les applications peuvent encore envoyer de la télémétrie. Les modèles téléchargés peuvent avoir une provenance peu claire. Un service local peut exposer un paramètre réseau non authentifié. Les coûts du matériel et de l'énergie passent du fournisseur à l'opérateur. La décision devrait être fondée sur des exigences et non sur l'indépendance en tant qu'esthétique.

## Local, ouvert et open source

Local décrit où l'inférence se produit. Open-weight décrit l'accès aux paramètres appris. Open source décrit les libertés et l'accès à travers le système.

La définition de l'IA Open Source de l'initiative Open Source indique qu'un système d'IA open source devrait accorder des libertés d'utilisation, d'étude, de modification et de partage. Elle nécessite également l'accès à un formulaire de modification privilégié, comprenant suffisamment d'informations, de codes et de paramètres. Ceci est plus strict que de rendre un fichier modèle téléchargeable.

De nombreux modèles largement distribués sont de poids libre. Les utilisateurs peuvent exécuter et parfois les adapter, mais les ensembles de données de formation peuvent ne pas être reproductibles, le code de formation peut être incomplet, ou la licence peut restreindre les utilisations. Les versions à poids ouvert créent encore une valeur publique importante, mais des questions linguistiques précises. Un studio d'évaluation de la dépendance à long terme devrait savoir quels sont les droits et le matériel disponibles.

## La pile d'inférence

Une pile de modèle de langue locale comprend l'architecture du modèle, les poids, le tokenizer, l'exécution de l'inférence, le format du modèle, le moteur matériel et l'interface d'application. Chaque couche affecte la compatibilité.

L'architecture du modèle définit le calcul. Les poids contiennent des paramètres appris. Le tokenizer cartographie le texte pour modéliser le vocabulaire. L'exécution exécute les opérations du modèle. Un format de fichier regroupe les paramètres et métadonnées. Les moteurs de matériel accélèrent le calcul sur les processeurs CPU, GPU ou spécialisés. Une application ajoute l'incitation, la récupération, les outils, la mémoire et l'interface utilisateur.

llama.cpp est un temps d'exécution en open-source important pour l'inférence C et C++. Il prend en charge l'exécution portable et les formats de modèles quantifiés sur une large gamme de matériel. Son importance n'est pas que chaque système local doit l'utiliser, mais qu'il démontre comment l'inférence peut être séparée d'un fournisseur hébergé et intégrée dans d'autres outils.

## Architecture

Une pile locale contient des poids de modèle, tokenizer, inférence d'exécution, backend matériel, stockage, interface d'application, index de récupération optionnel et limite de sécurité. Chaque couche peut être remplacée ou régie indépendamment lorsque les contrats sont explicites.

## Quantification

Les poids du modèle sont généralement représentés par des nombres flottants. La quantification réduit la précision utilisée pour stocker et calculer ces valeurs. Un modèle à moindre précision nécessite moins de mémoire et peut fonctionner plus rapidement, rendant les modèles plus grands pratiques sur le matériel de consommation.

La quantification est un compromis. Une compression plus agressive peut réduire la qualité, en particulier sur les tâches sensibles. L'effet dépend de l'architecture, de la méthode de quantification, de la taille du modèle et de la charge de travail. Les étiquettes de taille de fichier à elles seules ne prédisent pas les performances.

L'exploitant devrait évaluer un modèle quantifié pour les tâches représentatives. Une configuration adéquate pour résumer les notes studio peut échouer sur la génération de code ou l'extraction multilingue. La longueur du contexte et l'utilisation de la mémoire doivent être mesurées ensemble.

QLoRA a montré que la quantisation peut également soutenir l'adaptation efficace du modèle en combinant un modèle de base quantifié gelé avec des adaptateurs à bas rang pouvant être entraînés. La leçon la plus large est que l'expérimentation locale n'exige pas toujours le recyclage de chaque paramètre.

## Matériel

L'inférence du modèle est limitée principalement par la capacité de mémoire, la bande passante de la mémoire et le calcul. Un modèle doit s'intégrer dans la mémoire disponible avec les frais généraux d'exécution et le cache à valeur clé utilisé pour le contexte. Les contextes plus longs consomment une mémoire supplémentaire. La taille des lots et les utilisateurs concomitants augmentent les besoins.

Les ordinateurs portables de consommation avec une mémoire unifiée peuvent exécuter des modèles petits et moyens utiles. Les GPU dédiés peuvent fournir un débit supérieur, mais introduire la puissance, le refroidissement et les préoccupations du conducteur. L'inférence CPU est portable et peut être suffisante pour les tâches de fond, bien que la latence soit plus élevée.

Le choix du matériel devrait suivre la charge de travail. Un assistant de connaissance individuel a des besoins différents d'un service de transcription partagé ou d'une installation en temps réel. Un modèle qui produit une ébauche de recherche par minute peut être acceptable; un outil audio interactif peut nécessiter une latence beaucoup plus serrée.

## Confidentialité et sécurité

Garder des invites locaux réduit une classe d'exposition aux données, mais la confidentialité dépend du système complet. Les applications peuvent écrire des journaux de conversation, des caches et des intégrations sur le disque. Les fichiers modèles peuvent être remplacés par des paquets malveillants. Les plugins peuvent accéder au réseau. Une interface de navigateur peut exposer le service à d'autres appareils.

Un déploiement local devrait définir la liaison réseau, l'authentification, le chiffrement, la conservation des journaux et la procédure de mise à jour. Les projets sensibles devraient utiliser des environnements isolés et des répertoires de données explicites. Dans la mesure du possible, les modèles et les binaires d'exécution devraient provenir de sources vérifiées.

L'injection de prompt reste pertinente. Un système local RAG peut récupérer un document contenant des instructions pour manipuler l'utilisation des outils. L'exécution locale modifie la propriété de l'infrastructure; elle ne supprime pas le contenu contradictoire.

## Sélection du modèle

Le meilleur modèle local n'est pas nécessairement le plus grand modèle qui convient. La sélection doit tenir compte de la qualité des tâches, de la licence, de la couverture linguistique, du comportement contextuel, du support des outils, de la sortie structurée, de l'efficacité matérielle et de la stabilité des mises à jour.

Les classements de repères fournissent une orientation, mais correspondent rarement à une archive particulière ou à une pratique créative. Construisez un ensemble d'évaluation locale à partir de tâches réelles : extraire des métadonnées des notes de projet, résumer les sources techniques, générer du code en fonction du style du dépôt, classifier les annotations audio ou répondre aux questions du centre de connaissances. Inclure des exemples difficiles et négatifs.

Les modèles plus petits spécialisés peuvent surpasser les modèles généraux plus grands sur les tâches limitées lorsqu'ils sont associés à la récupération et à la validation. Ils réduisent également les latences et les coûts opérationnels.

## Adaptation et réglage fin

La mise à l'essai et la récupération doivent être testées avant le réglage fin. De nombreuses défaillances attribuées aux connaissances du modèle sont en fait des défaillances de contexte ou d'interface. Un schéma clair, des exemples pertinents et une recherche faisant autorité peuvent suffire.

Le réglage fin est approprié lorsqu'un comportement stable, un vocabulaire ou un formulaire de sortie doivent être appris dans de nombreuses demandes. L'adaptation de bas grades peut réduire les coûts de formation. L'ensemble de formation exige toujours la provenance, les droits, le contrôle de la qualité et la séparation entre l’entraînement et l'évaluation.

Un modèle formé sur le matériel privé devient un autre artefact sensible. Les points de contrôle, les adaptateurs et les journaux ont besoin d'une politique de conservation. Le réglage fin peut également dégrader les capacités générales ou rendre les patrons indésirables plus persistants.

## RAG local

La génération de récupération-augmentée est l'un des cas d'utilisation locale les plus forts. Les documents restent sur le stockage contrôlé, un index d'intégration ou lexical sélectionne les passages pertinents, et un modèle local synthétise une réponse. Cela peut soutenir les archives de recherche, la documentation privée et la mémoire de projet.

L'implémentation la plus faible divise simplement les fichiers en morceaux arbitraires et envoie les correspondances les plus proches au modèle. Un système plus fort préserve les titres, les auteurs, les dates, les ID des entités, les niveaux d'accès et les limites des sections. Il combine extraction lexicale et sémantique et renvoie des citations.

Electronic Artefacts ont déjà une structure de corpus appropriée : entités canoniques, sources, façade, relations de graphe et pages générées. Un assistant local pourrait récupérer les projections publiques et privées selon l'identité. VASTE pourrait imposer des limites de contexte, tandis que le Knowledge Hub fournit des documents riches en sources.

## Applications créatives

Les modèles locaux peuvent supporter l'idée privée, la transformation provisoire, l'extraction de métadonnées, l'assistance en code, le marquage visuel et le contrôle d'installation. Pour ORETH, l'inférence locale pourrait protéger les annotations audio non publiées ou prendre en charge les interfaces d'écoute automatique hors ligne. Pour Palimpsests, il pourrait aider à connecter des fragments textuels et sonores sans télécharger l'archive.

L'utilisation créative bénéficie de la possibilité de remplacer les modèles. Un flux de travail devrait préserver les invites, l'identificateur de modèle, la quantification, les adaptateurs et le matériel source afin que les sorties puissent être comprises plus tard. L'artefact généré n'est qu'une partie de l'enregistrement.

Les modèles devraient augmenter la sélection et l'expérimentation plutôt que de remplacer silencieusement la paternité. L'artiste ou l'éditeur a besoin de contrôles pour la variation, le rejet et la révision.

## Opérations

L'auto-hébergement crée des travaux de maintenance. Les temps d'exécution changent, les formats de modèles évoluent, les problèmes de sécurité apparaissent et le matériel échoue. Un opérateur a besoin d'épinglage de version, de contrôles de santé, de sauvegardes pour la configuration, d'inventaires de modèles et de procédures de renversement.

L'observabilité devrait saisir la durée de la demande, les nombres de tokens, les erreurs et l'utilisation des ressources sans conserver le contenu sensible par défaut. Les limites de devises protègent les performances interactives. Une file d'attente peut être meilleure que de permettre à chaque processus de charger sa propre copie modèle.

Les mises à jour du modèle doivent être traitées comme des versions logicielles. Évaluer la nouvelle version avant de la remplacer. Préserver suffisamment de métadonnées pour reproduire des extrants importants. Un système local devient durable grâce aux opérations, pas seulement grâce aux fichiers téléchargeables.

## Économie et durabilité

L'inférence hébergée convertit l'infrastructure en frais d'utilisation. L'inférence locale le convertit en matériel, énergie et maintenance. L'option moins coûteuse dépend du volume, de la latence, de la taille du modèle et de la dotation en personnel. L'utilisation sporadique peut favoriser les services hébergés. Des charges de travail prévisibles et continues peuvent favoriser l'exécution locale.

Les comparaisons énergétiques nécessitent une mesure de la charge de travail. Un petit modèle local peut éviter les frais généraux du réseau et du centre de données, mais un poste de travail haut de gamme sous-utilisé n'est pas automatiquement efficace. Des questions de taille juste.

L'indépendance a une valeur au-delà du coût direct. Les systèmes locaux peuvent continuer lorsqu'une API change, qu'un service n'est pas disponible ou qu'un fournisseur retire un modèle. Cette résilience peut justifier un effort opérationnel supplémentaire pour les archives et les outils de longue durée.

## Gouvernance et octroi de licences

Avant le déploiement, enregistrez la source du modèle, la version, la licence, les utilisations autorisées, les divulgations de données de formation, la licence d'exécution et les dépendances de tiers. Une licence modèle peut restreindre l'utilisation commerciale ou des domaines particuliers. Le code d'exécution et les poids du modèle peuvent utiliser différentes licences.

Le système devrait également consigner quelles données il traite et si les résultats peuvent être publiés. L'exécution locale n'accorde pas de droits sur le matériel source ou le contenu généré.

Pour Electronic Artefacts, la distinction entre l'exécution exclusive et la recherche ouverte est importante. VASTE peut rester propriétaire tout en intégrant l'infrastructure open-source et les modèles open-weight dans des termes compatibles. La transparence devrait indiquer quelle couche est ouverte et qui est contrôlée.

## Quand l'IA locale est le bon choix

Choisissez l'inférence locale lorsque la confidentialité, l'opération hors ligne, la latence, la personnalisation ou l'indépendance l'emportent sur les coûts opérationnels. Elle est particulièrement forte pour des charges de travail et des installations internes stables qui ne peuvent dépendre de la connectivité externe.

Choisissez l'inférence hébergée lorsque l'accès aux capacités frontalières, à l'échelle élastique ou aux opérations gérées est plus important que la localisation des données. Les systèmes hybrides peuvent orienter des tâches sensibles ou routinières localement et des tâches exceptionnelles vers un modèle hébergé dans le cadre d'une politique explicite.

L'architecture devrait rendre ce routage visible. Les utilisateurs doivent savoir où leur matériel est traité.

## Mise en œuvre

Commencez par un ensemble de tâches et un budget matériel représentatifs. Pin modèle, version d'exécution et de quantification, lier les services aux interfaces protégées, mesurer la latence et la mémoire, puis ajouter récupération ou réglage fin seulement lorsque l'évaluation montre un besoin.

## Éléments de preuve

La définition de l'OSI établit des critères pour l'IA open-source au-delà des poids téléchargeables. llama.cpp montre une inférence locale portable, tandis que QLoRA documente l'adaptation efficace des modèles quantifiés.

## Implications pour Electronic Artefacts

L'IA locale s'adapte aux Electronic Artefacts lorsqu'elle renforce le contrôle du savoir et du matériel culturel. Il peut soutenir un assistant de recherche privé sur les enregistrements du graphe, un service d'analyse ORETH, un outil de codage en studio ou une interface d'archive multimodale.

Le principe durable est la compasabilité. Les modèles devraient être des éléments remplaçables derrière des contrats clairs. Les sources, l'identité de l'entité et les autorisations devraient demeurer indépendantes d'un seul fournisseur modèle. La provenance devrait saisir comment l'IA a contribué à un artefact.

Voice Capture Studio démontre un contrat d’IA locale plus étroit qu’un assistant général. Transcription quantifiée, activité vocale et hypothèses de signal dérivé s’exécutent près du média privé, tandis que runtime, confiance et provenance restent visibles. L’audio original demeure la preuve et les estimations navigateur restent remplaçables. Lire [Découper localement la parole et le chant, mot par mot](/fr/publications/local-lexical-segmentation-for-speech-and-song/) pour le pipeline adaptatif et [Recherche déterministe](/fr/publications/deterministic-research-and-evidence-fusion/) pour sa frontière de décision.

## Limites

Les performances locales dépendent fortement du matériel actuel, des pilotes, des formats de modèles et du support d'exécution. Les comparaisons au niveau des produits peuvent devenir obsolètes rapidement, de sorte que cet article se concentre sur les principes architecturaux plutôt que les classements de référence.

## Concepts connexes

Lire [Modèle ouvert](/fr/knowledge/concepts/open-weight-model/), [Source ouverte](/fr/knowledge/concepts/open-source/), [Grand modèle de langage](/fr/knowledge/concepts/large-language-model/), [Provenance](/fr/knowledge/concepts/provenance/) et [Génération augmentée par récupération](/fr/knowledge/concepts/retrieval-augmented-generation/).

## Technologies connexes

Voir [Lama.cpp](/fr/knowledge/technologies/llama-cpp/) pour une inférence locale.

## Glossaire

Open-weight: distribution des paramètres appris selon les termes indiqués.

Quantification : réduction de la précision numérique pour réduire les besoins en mémoire et en calcul.

Inférence runtime: logiciel qui exécute un modèle formé.

Adaptateur: un ensemble plus petit de paramètres d'entraînement ajouté à un modèle de base.

Mémoire unifiée : mémoire partagée par le CPU et l'accélérateur dans certaines architectures matérielles.

## Références

- Initiative sur les sources ouvertes. Définition de l'IA source ouverte 1.0.
- ggml-org. llama.cpp.
- Dettmers et al. QLoRA. 2023.
