---
id: ea:concept:situated-actors-and-governance-fr
type: concept
translationOf: ea:concept:situated-actors-and-governance
slug: { canonical: situated-actors-and-governance }
title: Actors situés et gouvernance topologique
definition: Dans VASTE, un Actor est une identité de graphe possédée par une extension ; observation et action effectives sont résolues dans un System, un Environment, une topologie et une policy précis.
abstract: Comment VASTE sépare identité, credentials, capabilities, policy et autorité effective en plaçant l’observateur dans le graphe.
description: Dossier public sur l’identité Actor, la gouvernance dérivée du graphe, l’autorité locale et les déclarations portables.
locale: fr
visibility: public
publicationClass: canonical
status: experimental
maturity: development
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [Identité Actor, Position dans le graphe, Capabilities et policy, Autorité locale]
exclusions: [Administrateur universel, Credentials vivants portables, Identité décentralisée achevée]
claims:
  - Les hosts ne peuvent ni fabriquer un Actor humain ni attribuer silencieusement un rôle administrateur.
  - L’autorité effective est résolue à l’exécution et ne découle pas de l’identité seule.
tags: [VASTE, Actor, Gouvernance, Identité, Capabilities]
disciplines: [Runtime Systems, Architecture de sécurité]
---

## L’observateur est à l’intérieur

VASTE ne suppose pas un utilisateur omniscient extérieur au graphe. Actor est une spécialisation possédée par une extension, représentée par état de graphe, credentials et sessions admises. Une exécution se produit dans un Environment immuable, au sein d’un System, éventuellement depuis un `locationVertexId`. Surfaces et Actions accessibles dépendent de ce contexte situé.

## Six questions distinctes

1. **Identité** : quel Actor Vertex est résolu ?
2. **Credential** : quelle preuve locale relie la requête à cette identité ?
3. **Capability déclarée** : quelle opération peut être demandée ?
4. **Policy** : quelles règles gouvernent ce System et cette position ?
5. **Autorité** : quelle frontière peut interpréter l’Action ?
6. **Autorisation effective** : la requête passe-t-elle tous les gates maintenant ?

## Gouvernance dérivée du graphe

Le runtime possède une seam d’autorité enregistrée par Actor. Les enregistrements de gouvernance peuvent être lus depuis le graphe plutôt que depuis une table globale parallèle. Frontières System, containment et Ties participent à la résolution, mais la topologie ne confère pas seule une autorité. Capabilities et policies restent explicites ; invoquer un binding et appliquer un effet sont deux contrôles séparés.

## Gouvernance portable, autorité locale

Une clôture `.vast` peut conserver Actors, rôles, grants, délégations et déclarations de gouvernance. Elle ne transporte ni session admise ni confiance forcée dans un credential. L’import doit relier les preuves locales et revalider l’autorité. L’intégrité du package n’est pas une autorisation d’exécution.

## Preuves et limites

Les tests internes couvrent Founding Actor, transport de credentials, accès HTTP fail-closed, Actions de grant/revoke et gates de gouvernance. Révocation complète, attestations externes et confiance distribuée ne sont pas déclarées opérationnelles.
