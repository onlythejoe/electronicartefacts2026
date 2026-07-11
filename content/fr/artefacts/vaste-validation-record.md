---
id: ea:artefact:vaste-validation-record-fr
type: artefact
translationOf: ea:artefact:vaste-validation-record
slug: { canonical: vaste-validation-record }
title: Registre des validations VASTE
subtitle: Preuves du dépôt revues le 11 juillet 2026
abstract: Registre public et limité des claims VASTE soutenus par contrats, implémentation et tests internes au commit a51c9897.
description: Preuves concernant primitives, exécution gouvernée, extensions, Assisted Boot et portabilité .vast, avec limites explicites.
locale: fr
visibility: public
publicationClass: published
status: active
maturity: development
confidence: validated
version: { version: 1.0.0, createdAt: "2026-07-11", publishedAt: "2026-07-11", modifiedAt: "2026-07-11" }
authors: [{ id: ea:organization:electronic-artefacts }]
publisher: ea:organization:electronic-artefacts
artefactType: document
createdAt: "2026-07-11"
provenance: Revue interne du dépôt VASTE au commit a51c9897 ; le travail local non commité sur le montage est exclu des claims.
format: Registre public de preuves
preservationStatus: active
significance: Le registre sépare propriétés implémentées et testées, spécifications, observations et objectifs opérationnels.
tags: [VASTE, Preuves, Validation, Runtime]
disciplines: [Vérification logicielle, Runtime Systems]
---

## Lecture du statut

« Validé » signifie qu’un scénario automatisé interne existe et que son code a été inspecté. Ce n’est ni une certification indépendante, ni une preuve de production, ni une assurance de sécurité. Le dépôt est accessible lors d’une revue technique bornée.

## Registre

| ID | Claim | Preuve interne | Statut | Limite |
| --- | --- | --- | --- | --- |
| VST-PRIM-01 | Cinq primitives fermées. | Contrats, validateurs et tests de pureté kernel | Validé | Ontologie révisable explicitement. |
| VST-EXEC-01 | Action décrit l’intention ; le runtime applique les effets. | Execution, effects et tests transactionnels | Validé | Effets externes pas tous réversibles. |
| VST-GOV-01 | Accès humain fail-closed et gouvernance issue du graphe. | Tests Actor, HTTP et graph governance | Validé | Confiance distribuée incomplète. |
| VST-EXT-01 | Boot sans extension et lifecycle par System. | Tests lifecycle, packaging, Zero Kernel Diff | Validé | Isolation du code non fiable incomplète. |
| VST-VAST-01 | Round-trip `vast/1` par fichier sous un autre System ID. | Test round-trip ; commits b3ca7d1d et 13b16c6e | Validé | Format expérimental. |
| VST-VAST-02 | Les frontières d’un sous-arbre sont refusées ou déclarées. | Test E2E VAB/package | Validé | Montage multiple non déclaré complet. |
| VST-VAB-01 | Assentiment lié au hash exact du plan. | Test assent seal ; commit cb2d567c | Validé | Qualité de compréhension encore étudiée. |
| VST-VAB-02 | Un System né via VAB peut devenir `.vast` puis être réimporté. | Test E2E ; commit 13b16c6e | Validé | Pas le handover EA complet. |
| VST-REPLAY-01 | Snapshots et événements reconstruisent des scénarios déterministes. | Tests snapshot, replay, proof chain | Validé | Durabilité selon backend. |
| VST-PERF-01 | Des benchmarks scaling et soak existent. | Scripts et tests benchmark | Observé | Aucun chiffre général sans machine reproductible. |

## Claims exclus

Le working tree contenait des changements `.vast` non commités. Ils sont traités comme travail émergent et exclus. Sandboxing, signatures, trust tiers et fédération ne sont pas décrits comme enforcement opérationnel sans chemin runtime et test.

## Cadre

Dépôt privé `onlythejoe/VASTE`, commit revu `a51c9897`, Node.js 22.12+ déclaré. Les gates principaux sont typecheck, tests shardés, smoke benchmark runtime et contrôle du vocabulaire kernel.
