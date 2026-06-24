---
id: ea:technology:redis-streams
type: technology
slug:
  canonical: redis-streams
title: Redis Streams
abstract: Redis Streams is an append-only log data type with ordered entries, range reads, trimming and consumer-group processing.
description: A technology record for event streams, orchestration and real-time processing.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: production
confidence: canonical
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
category: database
roleInEcosystem: Redis Streams provides a compact event-log and consumer-group primitive for bounded orchestration, projections and real-time services.
officialUrl: https://redis.io/docs/latest/develop/data-types/streams/
sources:
  - title: Redis Streams
    publisher: Redis
    accessedAt: "2026-06-24"
    url: https://redis.io/docs/latest/develop/data-types/streams/
tags:
  - Redis Streams
  - Event Log
  - Consumer Groups
  - Orchestration
disciplines:
  - Software Architecture
  - Programming
  - Distributed Systems
---

## Role

Redis Streams stores ordered entries in an append-only structure and supports multiple consumption patterns, including consumer groups and pending-entry tracking.

## Use

It can support task distribution, event projections, integration streams and real-time processing when Redis fits the operational scale and durability requirements.

## References

See the official Redis Streams documentation and Event-Driven Architecture.
