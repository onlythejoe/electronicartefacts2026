---
id: ea:technology:webmcp
type: technology
slug:
  canonical: webmcp
title: WebMCP
abstract: WebMCP is an experimental web-platform proposal for exposing page capabilities as structured tools that browser agents can discover and invoke.
description: A maturity-aware record of WebMCP, in-page tools, browser mediation, origins, permissions and human-agent collaboration.
locale: en
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
roleInEcosystem: WebMCP explores how a page can expose typed actions to a browser-mediated agent while retaining the active interface, session and origin context.
officialUrl: https://github.com/webmachinelearning/webmcp
sources:
  - title: WebMCP Explainer and Draft
    publisher: W3C Web Machine Learning Community Group
    accessedAt: "2026-07-12"
    url: https://github.com/webmachinelearning/webmcp
tags: [WebMCP, Agentic Web, Browser Agents, Web Standards]
disciplines: [Web Architecture, Human Computer Interaction, Artificial Intelligence]
---

## Role

WebMCP proposes that web pages register typed tools through browser-native interfaces. An agent can discover an action and invoke validated arguments instead of reconstructing the interaction from pixels and simulated clicks.

## Scope

The proposal targets local browser collaboration with a human present. It complements backend MCP servers and does not aim to replace websites, accessibility semantics or general browser automation.

## Maturity

WebMCP remains an experimental community proposal with open questions around permissions, embedded frames, user confirmation, output validation and streaming. Production designs should not treat its current API shape as stable.

## Electronic Artefacts use

Its central idea fits Electronic Artefacts: preserve a visible interface while exposing a smaller, typed action surface. A future Knowledge Hub could offer read-only graph navigation or relation-draft tools without giving an agent unrestricted DOM control.
