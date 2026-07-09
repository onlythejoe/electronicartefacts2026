import { escapeHtml } from "../html.js";
import type { Entity } from "../../schema/entities.js";

const typeLabel = (entity: Entity): string =>
  entity.type === "researchQuestion"
    ? "RESEARCH QUESTION"
    : entity.type.replace(/([A-Z])/g, " $1").toUpperCase();

export const renderEntityHeader = (entity: Entity): string => `
  <section class="zone-card hero entity-hero">
    <div class="section-head">
      <p class="eyebrow">${escapeHtml(typeLabel(entity))}</p>
      <h1 class="display-title">${escapeHtml(entity.title)}</h1>
      ${entity.subtitle ? `<p class="card__meta">${escapeHtml(entity.subtitle)}</p>` : ""}
      ${entity.definition ? `<p class="lede"><strong>${escapeHtml(entity.definition)}</strong></p>` : `<p class="lede">${escapeHtml(entity.abstract)}</p>`}
      ${entity.definition ? `<p class="card__copy">${escapeHtml(entity.abstract)}</p>` : ""}
    </div>
    <div class="pill-cloud">
      <span class="tag">${escapeHtml(entity.status)}</span>
      <span class="tag">${escapeHtml(entity.confidence)}</span>
      <span class="tag">v${escapeHtml(entity.version.version)}</span>
    </div>
  </section>`;
