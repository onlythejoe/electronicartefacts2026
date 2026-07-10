import { escapeHtml } from "../html.js";
import type { Entity } from "../../schema/entities.js";

const displayValue = (value: string): string =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");

export const renderEntityMetadata = (entity: Entity): string => `
  <section class="panel knowledge-panel engagement-panel" data-engagement-panel data-like-key="${escapeHtml(entity.id)}">
    <div class="engagement-panel__header">
      <div>
        <p class="card__meta">${entity.locale === "fr" ? "Actions de la page" : "Page actions"}</p>
        <h2 class="card__title">${escapeHtml(entity.title)}</h2>
      </div>
      <span class="engagement-panel__status">${escapeHtml(displayValue(entity.status))}</span>
    </div>
    <div class="engagement-panel__actions" aria-label="${entity.locale === "fr" ? "Actions de la page" : "Page actions"}">
      <button class="engagement-action" type="button" data-share-button>
        <span aria-hidden="true">↗</span>
        <strong>${entity.locale === "fr" ? "Partager" : "Share"}</strong>
      </button>
    </div>
    <dl class="engagement-meta" aria-label="${entity.locale === "fr" ? "Métadonnées de la page" : "Compact page metadata"}">
      <div><dt>Type</dt><dd>${escapeHtml(displayValue(entity.type))}</dd></div>
      <div><dt>${entity.locale === "fr" ? "Maturité" : "Maturity"}</dt><dd>${escapeHtml(displayValue(entity.maturity))}</dd></div>
      <div><dt>${entity.locale === "fr" ? "Mis à jour" : "Updated"}</dt><dd>${escapeHtml(entity.version.modifiedAt)}</dd></div>
      <div><dt>Version</dt><dd>${escapeHtml(entity.version.version)}</dd></div>
    </dl>
    <p class="engagement-panel__feedback" data-engagement-feedback aria-live="polite"></p>
  </section>`;
