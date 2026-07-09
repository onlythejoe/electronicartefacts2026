---
id: ea:concept:browser-software
type: concept
slug:
  canonical: browser-software
title: Browser Software
definition: Browser software is application software delivered through web standards while relying on the browser runtime for interface, storage, permissions, media and distribution behavior.
abstract: Browser software treats the web browser as an application runtime, not only as a document viewer or marketing surface.
description: A canonical concept record for applications built directly on browser capabilities.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: validated
version:
  version: 1.0.0
  createdAt: "2026-07-09"
  publishedAt: "2026-07-09"
  modifiedAt: "2026-07-09"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Web applications
  - Progressive web apps
  - Browser permissions
  - Local storage
  - Static deployment
exclusions:
  - Static pages with no application behavior
  - Native desktop software with no browser runtime
claims:
  - Browser software can reduce installation friction while still requiring careful storage, permission and compatibility design.
  - Local-first browser tools need explicit export paths because browser storage is not a permanent archive by itself.
tags:
  - Browser Software
  - Web App
  - PWA
  - Local First
disciplines:
  - Web Development
  - Human Computer Interaction
  - Software Architecture
---

## Definition

Browser software is application software that runs inside browser runtimes and uses web platform capabilities for its interface and behavior.

## Scope

The concept includes routing, service workers, browser storage, microphone and file permissions, media APIs, static hosting and progressive enhancement.

## Applications

Electronic Artefacts uses browser software for public tools, research surfaces, local-first experiments and durable static applications.

## Limits

Browser delivery does not remove infrastructure responsibility. Storage, offline behavior, accessibility, device support and export paths still need design.
