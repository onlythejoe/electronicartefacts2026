---
id: ea:concept:vab-and-genesis-fr
type: concept
translationOf: ea:concept:vab-and-genesis
slug: { canonical: vab-and-genesis }
title: VAB et Genesis
definition: "VAB est le chemin d’orchestration Assisted Boot de VASTE : comprendre l’intention initiale, composer un plan scellé, admettre un Founding Actor et matérialiser un graphe initial gouverné."
abstract: Ce que VAB implémente, comment l’assentiment scelle un plan de boot et ce qui manque avant un handover Electronic Artefacts Genesis complet.
description: Guide de VASTE Assisted Boot, du Founding Actor, de la composition et de Genesis selon leur maturité réelle.
locale: fr
visibility: public
publicationClass: canonical
status: experimental
maturity: prototype
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
scope: [Conversation Assisted Boot, Cognition et plan, Founding Actor, Assent seal, Trajectoire Genesis]
exclusions: [Assistant permanent, Déploiement autonome complet, Handover de production démontré]
claims:
  - La composition exige l’assentiment explicite au hash exact du plan.
  - Un System né via VAB a suivi un export/import .vast dans un test E2E interne.
tags: [VASTE, VAB, Assisted Boot, Genesis]
disciplines: [Runtime Systems, Interaction humain machine]
---

## Rôle

VAB est un orchestrateur de boot et une Surface conversationnelle, pas un autre runtime ni nécessairement l’assistant permanent. Il transforme une intention initiale en proposition inspectable, obtient l’assentiment au plan déclaratif exact et invoque les chemins de création possédés par le runtime.

## Chemin actuel

Le dépôt implémente sessions de conversation, composition d’état cognitif, fallback heuristique et invocation de modèle configuré, streaming, parole, sélection d’extensions, admission du Founding Actor, réconciliation après redémarrage et Surface web. Le plan porte un `assentedPlanHash` ; toute modification après assentiment invalide le scellement.

```text
conversation → besoins interprétés → proposition graphe/extensions
→ scellement d’assentiment → création gouvernée → Surface du System vivant
```

Le test E2E interne poursuit ce chemin jusqu’à l’export `.vast`, l’import neuf et l’identité stable du package.

## Founding Actor

Le Founding Actor est la première identité humaine admise dans le System né. Il ne devient pas un administrateur universel. Credentials, session, capabilities et gouvernance du graphe restent des contrôles distincts.

## Genesis et implémentation

Genesis désigne la naissance gouvernée d’un System utile. Electronic Artefacts Genesis exige en plus racine organisationnelle, gouvernance, registries, Surfaces opérationnelles, récupération durable et handover approuvé vers un Environment candidat. Le dépôt fournit des pièces importantes sans démontrer encore cette boucle opérationnelle complète.

## Seuils restants

- provisioning durable et révisable après défaillance ;
- rollback et recovery explicites ;
- rebinding local des credentials et autorités après import ;
- audit sécurité des frontières modèles, extensions et packages ;
- premier graphe EA réellement opéré, exporté, revalidé et transmis sans bypass d’autorité.
