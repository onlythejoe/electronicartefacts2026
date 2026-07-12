---
id: ea:technology:webmcp-fr
type: technology
slug:
  canonical: webmcp
title: WebMCP
abstract: WebMCP est une proposition expérimentale pour exposer les capacités d’une page comme des outils structurés découvrables et invocables par des agents de navigateur.
description: Fiche de maturité sur WebMCP, les outils intégrés aux pages, la médiation du navigateur, les origines et la collaboration humain-agent.
locale: fr
visibility: public
publicationClass: canonical
status: experimental
maturity: research
confidence: observed
version:
  version: 1.0.0
  createdAt: "2026-07-12"
  publishedAt: "2026-07-12"
  modifiedAt: "2026-07-12"
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
category: approach
roleInEcosystem: WebMCP explore comment une page peut exposer des actions typées à un agent médié par le navigateur tout en conservant interface, session et origine actives.
officialUrl: https://github.com/webmachinelearning/webmcp
sources:
  - title: WebMCP Explainer and Draft
    publisher: W3C Web Machine Learning Community Group
    accessedAt: "2026-07-12"
    url: https://github.com/webmachinelearning/webmcp
tags: [WebMCP, web agentique, agents de navigateur, standards du Web]
disciplines: [architecture web, interaction humain-machine, intelligence artificielle]
translationOf: ea:technology:webmcp
---

## Rôle

WebMCP propose que les pages enregistrent des outils typés via des interfaces natives du navigateur. Un agent peut découvrir une action et fournir des arguments validés au lieu de reconstruire l’interaction depuis des pixels et des clics simulés.

## Périmètre

La proposition vise la collaboration locale dans le navigateur, avec un humain présent. Elle complète les serveurs MCP et ne cherche pas à remplacer les sites, la sémantique d’accessibilité ou l’automatisation généraliste.

## Maturité

WebMCP reste une proposition communautaire expérimentale. Permissions, iframes, confirmation utilisateur, validation des sorties et streaming sont encore discutés. Une architecture de production ne doit pas considérer l’API actuelle comme stable.

## Usage Electronic Artefacts

L’idée centrale correspond à la marque : conserver une interface visible tout en exposant une surface d’action plus étroite et typée. Le Knowledge Hub pourrait proposer une navigation de graphe en lecture seule ou la préparation de relations sans abandonner le contrôle du DOM à l’agent.
