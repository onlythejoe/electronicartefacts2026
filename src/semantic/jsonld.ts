import { site } from "../config/site.js";
import { routeForEntity } from "../config/routes.js";
import { identifierUrl } from "./identifiers.js";
import type { Entity, PublicationEntity } from "../schema/entities.js";

const identifierForRef = (id: string): string => {
  const [, rawType, slug] = id.split(":");
  const type = rawType === "researchField" ? "research-field" : rawType;
  return `${site.origin}/id/${type}/${slug}/`;
};

const schemaType = (entity: Entity): string => {
  if (entity.type === "concept" || entity.type === "researchField") return "DefinedTerm";
  if (entity.type === "program") return "SoftwareApplication";
  if (entity.type === "organization") return "Organization";
  if (entity.type === "publication") {
    const format = (entity as PublicationEntity).format;
    if (format === "technicalArticle") return "TechArticle";
    if (format === "researchNote") return "ScholarlyArticle";
    return "Article";
  }
  return "CreativeWork";
};

export const jsonLdFor = (entity: Entity) => {
  const url = `${site.origin}${routeForEntity(entity)}`;
  const primary: Record<string, unknown> = {
    "@type": schemaType(entity),
    "@id": identifierUrl(entity),
    name: entity.title,
    description: entity.abstract,
    url,
    dateCreated: entity.version.createdAt,
    datePublished: entity.version.publishedAt,
    dateModified: entity.version.modifiedAt,
    publisher: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
  };
  if (entity.definition) primary.description = entity.definition;
  if (entity.type === "publication") {
    primary.citation = entity.citation.preferred;
    primary.about = entity.subjects.map((subject) => ({ "@id": identifierForRef(subject.id) }));
  }
  if (entity.type === "project" && entity.socialLinks?.length) {
    primary.sameAs = entity.socialLinks.map((link) => link.href);
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: entity.title,
        mainEntity: { "@id": identifierUrl(entity) },
        isPartOf: { "@id": `${site.origin}/#website` },
      },
      primary,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Electronic Artefacts", item: `${site.origin}/` },
          { "@type": "ListItem", position: 2, name: entity.title, item: url },
        ],
      },
    ],
  };
};
