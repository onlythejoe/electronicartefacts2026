import { escapeHtml } from "../html.js";
import type { Entity } from "../../schema/entities.js";

export const renderEntityMetadata = (entity: Entity): string => `
  <section class="panel knowledge-panel">
    <div class="section-head">
      <p class="card__meta">Identity and publication</p>
      <h2 class="card__title">Record metadata</h2>
    </div>
    <dl class="metadata-list">
      <div><dt>Entity ID</dt><dd>${escapeHtml(entity.id)}</dd></div>
      <div><dt>Publication class</dt><dd>${escapeHtml(entity.publicationClass)}</dd></div>
      <div><dt>Status</dt><dd>${escapeHtml(entity.status)}</dd></div>
      <div><dt>Maturity</dt><dd>${escapeHtml(entity.maturity)}</dd></div>
      <div><dt>Confidence</dt><dd>${escapeHtml(entity.confidence)}</dd></div>
      <div><dt>Published</dt><dd>${escapeHtml(entity.version.publishedAt || "Not published")}</dd></div>
      <div><dt>Modified</dt><dd>${escapeHtml(entity.version.modifiedAt)}</dd></div>
      <div><dt>Version</dt><dd>${escapeHtml(entity.version.version)}</dd></div>
    </dl>
  </section>`;
