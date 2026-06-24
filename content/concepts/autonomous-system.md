---
id: ea:concept:autonomous-system
type: concept
slug:
  canonical: autonomous-system
title: Autonomous System
definition: An autonomous system can perceive relevant state, select actions and adapt behavior toward objectives with limited direct human control during operation.
abstract: Autonomous systems combine sensing, models, planning, execution, feedback, constraints, governance and human intervention paths.
description: A canonical definition connecting AI agents, robotics, runtime systems and responsible control.
locale: en
visibility: public
publicationClass: canonical
status: active
maturity: research
confidence: validated
version:
  version: 1.0.0
  createdAt: "2026-06-24"
  publishedAt: "2026-06-24"
  modifiedAt: "2026-06-24"
authors:
  - id: ea:organization:electronic-artefacts
publisher: ea:organization:electronic-artefacts
scope:
  - Perception
  - Planning
  - Action
  - Feedback
  - Human oversight
  - Operational boundaries
exclusions:
  - A system described as autonomous solely because it runs unattended
  - Unlimited authority without goals, constraints or intervention mechanisms
claims:
  - Autonomy is always bounded by system design, available actions and operating environment.
  - Higher autonomy requires stronger observability, testing, fallback and governance.
sources:
  - title: AI Risk Management Framework
    publisher: NIST
    publishedAt: "2023-01-26"
    accessedAt: "2026-06-24"
    url: https://www.nist.gov/itl/ai-risk-management-framework
tags:
  - Autonomous Systems
  - AI Agents
  - Feedback
  - Governance
  - Human Oversight
disciplines:
  - Artificial Intelligence
  - Robotics
  - Systems Design
  - Cybernetics
---

## Definition

An autonomous system observes an environment, chooses actions and uses feedback to continue operation without a human specifying every step. Autonomy exists by degree and within a designed action space.

## Architecture

The system may include sensors, state estimation, models, planners, policies, tools, actuators, logs, safety constraints and human override. A language-model agent is one form; robots, adaptive control systems and simulation actors are others.

## Electronic Artefacts position

Autonomy should be connected to contextual execution. Identity, permissions, evidence, environment and reversible actions matter more than a broad claim that a system can "act alone."

## Limitations

Real environments change, sensors fail, objectives conflict and errors compound. Autonomous systems require bounded authority, monitoring, incident response and clear responsibility for outcomes.

## References

See NIST AI RMF, AI Agent, Cybernetic Feedback and Contextual Execution.
