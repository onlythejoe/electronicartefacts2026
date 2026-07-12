import { site } from "../config/site.js";
import type { PageMetadata } from "../seo/metadata.js";
import type { Entity } from "../schema/entities.js";
import { escapeHtml } from "./html.js";

interface IdentifierPageInput {
  entity: Entity;
  metadata: PageMetadata;
  route: string;
}

const isFrench = (language?: string): boolean => (language || site.language).startsWith("fr");

const identifierDescription = (entity: Entity, language?: string): string =>
  isFrench(language)
    ? `Route d'identifiant persistante pour ${entity.title}, pointant vers la fiche canonique Electronic Artefacts.`
    : `Persistent identifier route for ${entity.title}, linking to the canonical Electronic Artefacts record.`;

export const renderIdentifierPage = ({ entity, metadata, route }: IdentifierPageInput): string => `<!doctype html>
<html lang="${metadata.language || site.language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="description" content="${escapeHtml(identifierDescription(entity, metadata.language))}" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />
    <link rel="alternate" type="application/ld+json" href="./index.jsonld" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(route)}" />
    <title>${escapeHtml(entity.title)}${isFrench(metadata.language) ? " identifiant" : " identifier"} | ${site.name}</title>
    <script>window.location.replace(${JSON.stringify(route)})</script>
  </head>
  <body>
    <main>
      <p>
        <a href="${escapeHtml(route)}">${isFrench(metadata.language) ? "Ouvrir la fiche canonique" : "Open the canonical"} ${escapeHtml(entity.title)}${isFrench(metadata.language) ? "" : " record"}</a>
        ${isFrench(metadata.language) ? "ou" : "or"}
        <a href="./index.jsonld">${isFrench(metadata.language) ? "télécharger les données JSON-LD de l'identifiant" : "download its JSON-LD identifier data"}</a>.
      </p>
    </main>
  </body>
</html>`;
