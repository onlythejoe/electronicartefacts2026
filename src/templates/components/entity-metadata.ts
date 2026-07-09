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
        <p class="card__meta">Save and share</p>
        <h2 class="card__title">${escapeHtml(entity.title)}</h2>
      </div>
      <span class="engagement-panel__status">${escapeHtml(displayValue(entity.status))}</span>
    </div>
    <div class="engagement-panel__actions" aria-label="Article actions">
      <button class="engagement-action engagement-action--like" type="button" data-like-button aria-label="Like this article">
        <span aria-hidden="true">♡</span>
        <strong data-like-count>0</strong>
      </button>
      <button class="engagement-action" type="button" data-share-button>
        <span aria-hidden="true">↗</span>
        <strong>Share</strong>
      </button>
    </div>
    <dl class="engagement-meta" aria-label="Compact article metadata">
      <div><dt>Type</dt><dd>${escapeHtml(displayValue(entity.type))}</dd></div>
      <div><dt>Maturity</dt><dd>${escapeHtml(displayValue(entity.maturity))}</dd></div>
      <div><dt>Updated</dt><dd>${escapeHtml(entity.version.modifiedAt)}</dd></div>
      <div><dt>Version</dt><dd>${escapeHtml(entity.version.version)}</dd></div>
    </dl>
    <p class="engagement-panel__feedback" data-engagement-feedback aria-live="polite"></p>
  </section>`;
