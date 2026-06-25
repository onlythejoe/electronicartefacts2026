import { site } from "../config/site.js";
import { identifierPath, routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import { organizationNode, websiteNode } from "../semantic/jsonld.js";
import { isIndexableEntity } from "../semantic/visibility.js";

const maxModifiedAt = (records: Entity[]): string =>
  records.reduce<string>((latest, entity) => entity.version.modifiedAt > latest ? entity.version.modifiedAt : latest, site.updatedAt);

export const buildKnowledgeGraphCatalogJsonLd = (entities: Entity[], relations: RelationStatement[]) => {
  const records = entities
    .filter(isIndexableEntity)
    .sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title));
  const lastModified = maxModifiedAt(records);
  const catalogUrl = `${site.origin}/graph/catalog.jsonld`;
  const catalogId = `${catalogUrl}#catalog`;
  const datasetId = `${catalogUrl}#dataset`;
  const itemListId = `${catalogUrl}#records`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DataCatalog",
        "@id": catalogId,
        name: `${site.name} Public Knowledge Graph Catalog`,
        description: "Machine-readable catalog of public Electronic Artefacts entities, routes, identifiers and relation exports.",
        url: catalogUrl,
        inLanguage: site.language,
        publisher: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
        dateModified: lastModified,
        dataset: { "@id": datasetId },
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        name: `${site.name} Public Knowledge Graph`,
        description: site.description,
        url: `${site.origin}/generated/public/catalog.json`,
        sameAs: [
          `${site.origin}/graph/entities.json`,
          `${site.origin}/graph/relations.json`,
        ],
        encodingFormat: "application/json",
        inLanguage: site.language,
        keywords: [...site.keywords],
        creator: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
        publisher: { "@id": `${site.origin}/id/organization/electronic-artefacts/` },
        isAccessibleForFree: true,
        dateModified: lastModified,
        measurementTechnique: "Typed static entity records, JSON-LD identifiers, validated public relation statements and generated search documents.",
        variableMeasured: [
          { "@type": "PropertyValue", name: "publicRecords", value: records.length },
          { "@type": "PropertyValue", name: "publicRelations", value: relations.filter((relation) => relation.visibility === "public").length },
        ],
        includedInDataCatalog: { "@id": catalogId },
        mainEntity: { "@id": itemListId },
      },
      {
        "@type": "ItemList",
        "@id": itemListId,
        name: `${site.name} public records`,
        numberOfItems: records.length,
        itemListElement: records.map((entity, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entity.title,
          url: `${site.origin}${routeForEntity(entity)}`,
          item: { "@id": `${site.origin}${identifierPath(entity)}` },
        })),
      },
      organizationNode,
      websiteNode,
    ],
  };
};
