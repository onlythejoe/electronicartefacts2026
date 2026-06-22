import type { Entity, PublicationEntity } from "../../schema/entities.js";
import { escapeHtml } from "../html.js";

export const renderCitationPanel = (entity: Entity, canonicalUrl: string): string => {
  const preferred = entity.type === "publication"
    ? (entity as PublicationEntity).citation.preferred
    : `${entity.title}. ${entity.version.version}. Electronic Artefacts, ${entity.version.modifiedAt}. ${canonicalUrl}`;
  return `
    <section class="panel knowledge-panel">
      <div class="section-head">
        <p class="card__meta">Citation</p>
        <h2 class="card__title">How to cite this record</h2>
      </div>
      <p class="card__copy">${escapeHtml(preferred)}</p>
      <div class="link-row"><a class="tag" href="${escapeHtml(canonicalUrl)}">Canonical URL</a></div>
    </section>`;
};
