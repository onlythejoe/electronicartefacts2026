---
id: ea:publication:redis-streams-for-orchestration-fr
type: publication
slug:
  canonical: redis-streams-for-orchestration
title: Redis Streams pour l’orchestration
subtitle: Article technique
abstract: "Un guide axé sur la mise en œuvre de Redis Streams, les groupes de consommateurs, les acquittements, les entrées en attente, les récupérations, l'idempotence, le trimming et l'orchestration."
description: "Découvrez comment Redis Streams fonctionne et comment utiliser les groupes de consommateurs, les entrées en attente et les travailleurs idempotents pour une orchestration fiable."
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
  - id: ea:technology:redis-streams
  - id: ea:concept:event-driven-architecture
  - id: ea:concept:contextual-execution
  - id: ea:program:vaste
claims:
  - "Redis Streams fournit un journal ordonné et un groupe de consommateurs primitifs utiles pour l'orchestration limitée."
  - "Les travailleurs de Redis Streams ont besoin d'un acquittement explicite, d'une récupération, d’une compensation, d'une rétention et d'une surveillance."
evidence:
  - id: ea:technology:redis-streams
  - id: ea:concept:event-driven-architecture
sources:
  - title: Redis Streams
    publisher: Redis
    accessedAt: 2026-06-24
    url: https://redis.io/docs/latest/develop/data-types/streams/
  - title: XREADGROUP
    publisher: Redis
    accessedAt: 2026-06-24
    url: https://redis.io/docs/latest/commands/xreadgroup/
  - title: XAUTOCLAIM
    publisher: Redis
    accessedAt: 2026-06-24
    url: https://redis.io/docs/latest/commands/xautoclaim/
citation:
  preferred: Electronic Artefacts. "Redis Streams pour l’orchestration". Article technique, version
    1.0.0, 2026.
tags:
  - Redis Streams
  - orchestration
  - Consumer Groups
  - Event Processing
  - Idempotence
disciplines:
  - architecture logicielle
  - Distributed Systems
  - programmation
  - conception de systèmes
translationOf: ea:publication:redis-streams-for-orchestration
---

## Problème

Les équipes ont besoin de traitement de fond durable et de distribution d'événements sans toujours utiliser une grande plateforme de streaming. Les files d'attente simples peuvent perdre de l'histoire, tandis que Redis Streams est souvent adopté sans un modèle clair de reconnaissance, de récupération ou de rétention.

## Présentation

Redis Streams est un type de données Redis pour les séquences d'entrées en appendice seulement. Chaque entrée reçoit un identifiant commandé et stocke des données de valeur de champ. Les clients peuvent lire les gammes, bloquer les nouvelles entrées, conserver l'historique et coordonner les travailleurs par l'intermédiaire de groupes de consommateurs.

Cela rend Streams utiles pour le traitement des événements, la distribution des tâches, les projections et l'orchestration légère. Il occupe un espace entre les simples listes de Redis ou Pub/Sub et les plates-formes plus grandes. Les équipes qui exploitent déjà Redis peuvent ajouter un état de consommation durable sans introduire immédiatement un courtier séparé.

Le mot orchestration a besoin de qualification. Redis Streams peut transporter le travail et suivre la livraison, mais il ne modélise pas en soi les workflows à long terme, la compensation, les horaires ou les autorisations de domaine. L'orchestration fiable émerge de la conception du flux, du comportement des travailleurs, de l'idempotence, de la persistance et de l'observabilité autour du primitif.

## Modèle de flux

Un flux est identifié par une clé Redis. `XADD` ajoute une entrée avec un ID et des champs. Redis peut générer un ID basé sur des millisecondes et une séquence, produisant des valeurs telles que `1719230000000-0`. Les ID fournissent la commande dans le flux.

`XRANGE` et `XREVRANGE` lisent des plages historiques. `XREAD` lit depuis un ou plusieurs flux et peut bloquer jusqu'à ce que de nouvelles entrées arrivent. Cela soutient les lecteurs indépendants qui maintiennent leurs propres offset.

Les entrées sont immuables après l'ajout dans le modèle d'utilisation normal. Le système peut supprimer ou réduire les entrées, mais modifier un événement en place mine la sémantique du log. Les corrections doivent généralement être représentées par des entrées ultérieures.

La charge utile est une structure à valeur de champ plate. Les données de domaine complexes peuvent être sérialisées, mais les champs nécessaires au routage ou à l'inspection doivent rester explicites.

## Architecture

La conception de la production comprend les clés de flux, les enveloppes d'événements, les producteurs, les groupes de consommateurs, la récupération en attente d'entrée, les gestionnaires idéoptents, la politique de réessayer et de lettres mortes, la persistance, le triage et la surveillance.

## Pub/Sub versus Streams

Redis Pub/Sub transmet des messages aux clients actuellement abonnés. Il ne conserve pas de messages pour les consommateurs déconnectés. Il est utile pour les notifications éphémères lorsque la perte est acceptable.

Les flux conservent les entrées et laissent les consommateurs reprendre à partir d'un ID. Les groupes de consommateurs suivent la livraison et les travaux en cours. C'est le meilleur primitif quand le traitement doit survivre travailleurs redémarrer ou quand l'histoire est utile.

Ni la garantie qu'un effet secondaire externe se produise exactement une fois. Les flux améliorent le suivi de la livraison, tandis que la conception de l'application gère les effets dupliqués.

Utilisez Pub/Sub pour les ventilateurs transitoires comme les conseils d'interface utilisateur en direct. Utilisez Streams pour des tâches durables, des intégrations et des projections reconstructibles.

## Groupes de consommateurs

Un groupe de consommateurs permet à plusieurs travailleurs de diviser les entrées d'un seul flux. `XGROUP CREATE` établit le groupe et sa position de départ. `XREADGROUP` livre de nouvelles entrées aux consommateurs du groupe.

Chaque entrée est attribuée à un seul consommateur et ajoutée à la liste des entrées en attente du groupe jusqu'à ce qu'elle soit reconnue. `XACK` le supprime de l'état en attente après un traitement réussi.

Ce modèle soutient l'échelle horizontale des travailleurs. Un groupe peut mettre à jour la recherche alors qu'un autre groupe indépendant génère des notifications. Chaque groupe reçoit le flux sous son propre état de progrès.

Les noms de consommateurs devraient représenter des identités de travailleurs stables au cours de la durée du processus. L'outillage opérationnel doit permettre d'inspecter les consommateurs actifs, en attendant le comptage et le temps de repos.

## Remerciements

La reconnaissance doit avoir lieu après les travaux pertinents. Un travailleur qui reconnaît avant d'écrire à la base de données peut perdre du travail s'il s'écrase. Un travailleur qui écrit avec succès et s'écrase avant la reconnaissance recevra ou récupérera l'entrée à nouveau.

C'est pourquoi le gestionnaire doit être idémpotent. Le flux peut fournir au moins un comportement de traitement, mais l'état de l'application doit tolérer la répétition.

Les transactions ou les scripts atomiques peuvent coordonner l'état côté Redis, mais ils ne peuvent pas inclure atomiquement des services externes arbitraires. Les modèles de boîte de réception et les clés d'idempotence aident à combler ces limites.

La politique de reconnaissance devrait être explicite dans l'examen des codes. La reconnaissance automatique cachée peut produire une perte silencieuse.

## Entrées en attente

La Liste des entrées en attente enregistre les messages livrés mais non reconnus. `XPENDING` déclare compte, consommateurs et informations inactives. C'est la surface de récupération du noyau.

Un système sain surveille l'âge, pas seulement le nombre. Un petit nombre d'anciennes entrées peuvent indiquer une tâche empoisonnée. Un nombre élevé peut refléter l'insuffisance des travailleurs ou une dépendance défaillante.

Lorsqu'un travailleur disparaît, ses entrées restent en attente. Un autre consommateur peut les réclamer après une période de repos appropriée. `XAUTOCLAIM` prend en charge la numérisation et le transfert des entrées en attente.

Le seuil de ralenti doit dépasser le temps normal de traitement. Le fait de réclamer trop tôt peut amener deux travailleurs à exécuter simultanément la même tâche de longue durée.

## Politique de réédition

Redis Streams n'impose pas une stratégie de réessayer complète. Les demandes décident quand réessayer, à quelle fréquence et où les entrées ont échoué.

Les défaillances transitoires peuvent laisser l'entrée en attente et réessayer avec le recul. Les défaillances permanentes doivent être enregistrées dans un flux de défaillance ou une base de données avec ID original, classe d'erreur et contexte. Un flux de lettres mortes a besoin d'opérateurs et de rejouer des outils.

Le dénombrement des tentatives peut être stocké séparément ou dérivé de l'information sur la livraison. Le gestionnaire devrait classer les défaillances au lieu de réessayer les charges utiles invalides pour toujours.

Les retards de réessayer ne sont pas des messages natifs programmés dans le même sens qu'un moteur de workflow. Les systèmes combinent souvent des Streams avec des ensembles triés, des files d'attente différées ou des planificateurs externes.

## Travailleurs isolés

Un travailleur idémpotent associe une opération stable à l'entrée du flux ou à la commande de domaine. Avant d'effectuer un effet secondaire, il vérifie si cette opération est déjà terminée.

Les contraintes liées à l'unicité des bases de données sont de puissants outils. Une projection peut augmenter par ID d'entité et version. Un travailleur du courrier électronique peut stocker une clé de livraison. Un processeur de fichier peut enregistrer la version de checksum source et de transformation.

Ne vous fiez pas seulement à la déduplication en mémoire. Le travailleur redémarre l'effacer. Les touches Redis avec expiration peuvent aider pour les fenêtres délimitées, mais les effets de domaine permanents peuvent nécessiter des enregistrements durables.

Idempotence protège également le replay manuel. Les opérateurs devraient être en mesure de retraiter une entrée sans se demander s'il fera double emploi avec un travail irréversible.

## Conception du flux

Un flux mondial simplifie le transport mais peut créer des charges utiles mixtes, des consommateurs bruyants et de larges autorisations. Un flux par entité crée une explosion opérationnelle. Un terrain intermédiaire utile groupes événements par domaine ou limite de traitement.

Les exemples comprennent `knowledge-events`, `audio-analysis-jobs` et `public-projection-events`. Le type d'événement et l'identifiant d'entité restent des champs dans le flux.

Les exigences de commande influencent le cloisonnement. Un seul Redis Stream a un seul ordre, mais plusieurs flux peuvent être traités indépendamment. Si tous les événements d'une entité doivent rester ordonnés, dirigez-les de façon cohérente.

Les noms doivent refléter la propriété et la conservation. Évitez d'utiliser les détails d'environnement ou de version de manière à rendre la migration difficile.

## Charge utile et schéma

Inclure l'ID de l'événement, le type, l'heure, l'ID du sujet, la version du schéma et l'ID de corrélation. Entreposez la charge utile minimale nécessaire au traitement ou à la référence d'un enregistrement canonique.

Les grands documents et l'audio ne devraient pas être intégrés dans les entrées de flux. Conservez-les dans un stockage d'objets approprié et envoyez une référence stable avec un bilan et un contexte d'accès.

La validation du schéma appartient à la fois au producteur et au consommateur. Les producteurs ne devraient pas ajouter d'événements mal formés. Les consommateurs devraient rejeter les versions incompatibles inconnues dans une voie de défaillance visible.

CloudEvents peut fournir une enveloppe commune même lorsque Redis Streams est le transport.

## Conservation et parage

Les flux croissent jusqu'à ce que les entrées soient supprimées ou parés. `MAXLEN` sur `XADD` ou `XTRIM` peut capter la longueur approximative ou exacte. La rétention dans le temps peut nécessiter une correction périodique par ID.

Le maintien en poste doit respecter les exigences de récupération. Si une projection de recherche peut nécessiter un replay de sept jours, ne retenir qu'une heure est insuffisant. Si la base de données canonique peut tout reconstruire, une conservation plus courte peut être acceptable.

Le tri des entrées qui restent en attente peut compliquer la récupération. La politique opérationnelle devrait tenir compte du retard des consommateurs avant la suppression.

La configuration de la persistance de Redis est également importante. Les fichiers, les snapshots et la réplication n'apparaissent que dans la durée. Un flux conservé en mémoire, mais non durable, n'est pas une archive.

## Durabilité du redis

Redis peut persister les données à travers des instantanés RDB, des fichiers append only ou les deux. Chaque configuration crée une fenêtre de perte et un profil de récupération différents. La réplication améliore la disponibilité, mais ne remplace pas la sauvegarde ou empêche la suppression logique.

Pour les événements critiques, comprendre ce que signifie la reconnaissance par rapport à la persistance et à la réplication. Le succès d'un producteur n'implique pas toujours que l'événement a atteint un niveau de stockage durable en cas d'échecs.

Redis Streams peut être approprié pour l'orchestration alors qu'un historique d'événement faisant autorité reste dans une base de données. L'architecture devrait indiquer quel système est la source de la vérité.

Ne pas présenter un flux pratique comme une conservation permanente à moins que la durabilité n'ait été conçue et testée.

## Contrepression

Lorsque les producteurs surpassent les consommateurs, la longueur des cours d'eau et l'attente augmentent. La contrepression est la réponse du système à ce déséquilibre.

Surveillez le taux d'entrée, le taux de reconnaissance, l'âge et la mémoire en attente. Les travailleurs d'échelle où les tâches sont parallélisées. Limiter les travaux des producteurs ou des lots à faible priorité. Protéger les services en aval avec des plafonds de concordance.

Les groupes de consommateurs distribuent le travail, mais plus de travailleurs n'aident pas quand une base de données ou un serveur de modèles est le goulot d'étranglement. La réflexion des systèmes est nécessaire pour localiser la contrainte.

Pour les charges de travail liées à l'IA, l'inférence du modèle peut être coûteuse. Un flux peut tamponner les tâches, tandis que les limites de concordance par modèle maintiennent la latence et la mémoire stables.

## Schéma d'orchestration

Une orchestration limitée peut représenter chaque changement d'état comme un événement. Un workflow de publication peut ajouter `ArticleValidationRequested`. Un travailleur valide le contenu et ajoute `ArticleValidated` ou `ArticleValidationFailed`. Une projection met à jour l'état.

L'ID de corrélation relie les événements en un seul processus. Un record d'état détient le statut de workflow faisant autorité. Le flux transporte des faits et des tâches; il ne devrait pas exiger la reconstruction de tous les états d'affaires à partir des messages en attente.

Les délais et les approbations humaines nécessitent des services explicites ou des vérifications prévues. Redis Streams n'est pas un langage complet et durable.

Cette séparation maintient le design honnête. Les flux font ce qu'ils font bien : annexe ordonnée, lecture de blocage et coordination des consommateurs.

## Demande VASTE

VASTE pourrait utiliser Redis Streams comme un transport événementiel pour les changements de graphiques et les travaux de projection. Un événement de relation validé pourrait déclencher la régénération du voisinage, l'indexation de la recherche et l'invalidation du cache.

L'événement devrait inclure les ID d'entité canonique et le contexte. Les consommateurs peuvent récupérer des enregistrements complets selon les permissions. Les travailleurs de la projection publique ne doivent jamais recevoir de charges utiles limitées inutilement.

La sémantique graphique reste dans VASTE; la mécanique de livraison reste dans Redis. Cela empêche les technologies de transport de définir le modèle de domaine.

Si les exigences d'échelle ou de conservation dépassent Redis Streams, les contrats d'événements stables facilitent la migration vers un autre journal.

## Charges de travail de l'IA et de l'ORETH

L'analyse ORETH peut impliquer un traitement audio à long terme. Un flux peut distribuer des références de fichiers et des paramètres d'analyse aux travailleurs. Les résultats deviennent de nouveaux enregistrements liés aux artefacts sources.

Les travailleurs devraient enregistrer la version du modèle ou de l'algorithme, la liste des sources et l'emplacement de sortie. Idempotence peut utiliser la combinaison de source, de type d'analyse et de version.

Pour les tâches locales de LLM, un groupe de consommateurs peut nourrir un ou plusieurs travailleurs d'inférence. La priorité peut nécessiter des volets distincts. Les appels sensibles doivent être référencés à partir d'un stockage contrôlé plutôt que copiés dans des journaux conservés.

Les examens humains peuvent séparer l'observation automatique de l'interprétation publiée.

## Surveillance

Au minimum, surveiller la longueur du cours d'eau, le décalage entre les groupes, le dénombrement en attente, l'âge le plus avancé, le temps d'inactivité des consommateurs, la durée du traitement, le taux de réessayer et le dénombrement par lettre morte.

Les tableaux de bord devraient relier les paramètres de l'infrastructure aux résultats du domaine. Combien d'articles attendent la validation ? Combien d'analyses audio ont échoué par version modèle ? Quelle est la projection statique?

Les alertes nécessitent des seuils réalisables. Un retard transitoire au cours d'une importation par lot peut être normal. Une ancienne entrée en attente dans un pipeline de publication peut nécessiter un examen immédiat.

Les exercices de récupération périodiques devraient arrêter un travailleur en milieu de tâche, le redémarrer et vérifier la sécurité en double.

## Quand Redis Streams est un bon ajustement

Redis Streams est un bon ajustement quand une équipe opère déjà Redis, le débit est modéré, la latence est faible et le modèle de flux répond aux besoins de rétention et de replay. Il fonctionne bien pour les emplois de base, les projections en temps réel et l'intégration des services dans un seul environnement opérationnel.

Une plate-forme de log plus grande peut être préférable pour un débit très élevé, une rétention longue, de nombreuses partitions, des produits de données inter-équipes ou des écosystèmes matures de traitement des flux. Un moteur de workflow dédié peut être préférable pour les processus à long terme avec minuteurs, compensation et état complexe.

Une boîte de sortie de base de données plus un simple travailleur peut suffire pour les petits systèmes. L'architecture devrait respecter les exigences.

## Erreurs courantes

La première erreur est de traiter la livraison `XREADGROUP` comme une exécution exactement une fois.

La seconde est de reconnaître avant que les effets secondaires s'engagent.

Le troisième est d'ignorer les entrées en attente jusqu'à ce que la mémoire grandisse.

Le quatrième est en train de couper sans envisager le lag et replay.

Le cinquième est l'intégration de charges utiles grandes ou sensibles.

Le sixième est d'utiliser Streams comme seul état de flux de travail.

Le septième est d'ajouter des consommateurs sans observabilité ni propriété.

## Liste de contrôle pour la mise en œuvre

Définir les noms de flux et de groupe, l'enveloppe de l'événement et la version du schéma. Établir la validation du producteur. Mettre en place des gestionnaires idempotents. Reconnaissez après le commit. Surveillez l'âge. Ajouter des relevés limités et un flux d'échec. Configurer la persistance, la sauvegarde et la rétention. Tester les accidents de travail et la livraison en double.

Documenter la source de la vérité et rejouer la procédure. Notez quels événements sont sûrs de rejouer et quels effets secondaires nécessitent une suppression.

Commencez par un flux de travail limité. Élargir seulement après que les opérations sont fiables.

## Mise en œuvre

Créer un groupe de flux et de consommateurs, ajouter des événements en version, traiter avec `XREADGROUP`, commettre des effets secondaires idempotently et reconnaître ensuite. Ajouter la surveillance `XPENDING` et la récupération `XAUTOCLAIM` avant d'augmenter le nombre de travailleurs.

## Éléments de preuve

Redis documents Streams comme un journal en appendice avec lectures de blocage, requêtes de gamme et groupes de consommateurs. Les commandes `XREADGROUP` et `XAUTOCLAIM` exposent directement le comportement de livraison et de récupération.

## Limites

Redis Streams n'est pas un moteur de flux de travail complet ou une archive permanente par défaut. La durabilité dépend de la persistance, de la rétention et du déploiement de Redis. Les chronomètres à long terme, la compensation complexe ou la rétention à grande échelle peuvent nécessiter d'autres systèmes.

## Concepts connexes

Lire [Architecture d'événements](/fr/knowledge/concepts/event-driven-architecture/), [Exécution contextuelle](/fr/knowledge/concepts/contextual-execution/) et [Runtime de graphe](/fr/knowledge/concepts/graph-runtime/).

## Technologies connexes

Voir [Redis Streams](/fr/knowledge/technologies/redis-streams/) et [Événements nuageux](/fr/knowledge/technologies/cloudevents/).

## Programme connexe

Voir [VASTE](/fr/programs/vaste/).

## Glossaire

Stream : une séquence ordonnée d'entrées en appendice.

Groupe de consommateurs : un groupe qui divise les entrées parmi les consommateurs nommés.

Liste d'inscriptions en attente : les inscriptions livrées ne sont pas encore reconnues.

Remerciements : confirmation qu'un consommateur a terminé le traitement.

Allégation : transfert de travaux en suspens à un autre consommateur.

Trimming: suppression des anciennes entrées de flux selon la politique de rétention.

## Références

- Redis. Redis Streams documentation.
- Redis. Commande XREADGROUP.
- Redis. Commande XAUTOCLAIM.
