import type { Entity } from "../../schema/entities.js";

export const renderRecordDetails = (entity: Entity, body: string): string => {
  const french = entity.locale === "fr";
  return `
    <details class="zone-card record-details">
      <summary>
        <span>${french ? "Détails de la fiche" : "Record details"}</span>
        <small>${french ? "Métadonnées, partage et citation" : "Metadata, sharing and citation"}</small>
      </summary>
      <div class="record-details__body">${body}</div>
    </details>`;
};
