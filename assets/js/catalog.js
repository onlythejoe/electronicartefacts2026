(function () {
  const taxonomies = window.EA_TAXONOMIES || {};
  const entities = window.EA_ENTITIES || {};
  const relations = window.EA_RELATIONS || {};
  const timelines = window.EA_TIMELINES || [];
  const activity = window.EA_ACTIVITY || [];
  const collections = window.EA_COLLECTIONS || [];
  const publicCatalog = window.EA_PUBLIC_CATALOG || {};
  const pageLocale = document.documentElement.lang === "fr" || window.location.pathname.startsWith("/fr/")
    ? "fr"
    : "en";
  const normalizeTitle = (value) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const isPublic = (item) => !["internal", "restricted"].includes(item?.visibility);

  const catalogEntities = Array.isArray(publicCatalog.entities) ? publicCatalog.entities : [];
  const catalogById = Object.fromEntries(catalogEntities.map((item) => [item.id, item]));
  const catalogByLegacyId = Object.fromEntries(catalogEntities.filter((item) => item.legacyId).map((item) => [item.legacyId, item]));
  const catalogByLegacyIdentity = Object.fromEntries(
    catalogEntities
      .filter((item) => item.legacyId && item.type)
      .map((item) => [`${item.legacyId}|${item.type}`, item]),
  );
  const translatedBySourceId = catalogEntities.reduce((acc, item) => {
    if (item.locale === pageLocale && item.translationOf) acc[item.translationOf] = item;
    return acc;
  }, {});

  const canonicalCatalogRecordFor = (item) => {
    if (!item?.id) return null;
    const source = (item.canonicalId && catalogById[item.canonicalId])
      || catalogById[item.id]
      || catalogByLegacyIdentity[`${item.id}|${item.kind || item.type}`]
      || null;
    if (!source) return null;
    return pageLocale === "en" ? source : translatedBySourceId[source.id] || source;
  };

  const localizeEntity = (item) => {
    const canonical = canonicalCatalogRecordFor(item);
    if (!canonical) return item;
    return {
      ...item,
      canonicalId: canonical.translationOf || canonical.id,
      semanticId: canonical.id,
      localizedId: canonical.locale === pageLocale ? canonical.id : undefined,
      title: canonical.title,
      subtitle: canonical.subtitle || "",
      summary: canonical.summary || "",
      description: canonical.description || canonical.summary || "",
      kind: canonical.kind || canonical.type,
      type: canonical.type,
      status: canonical.status,
      statusLabel: canonical.status,
      maturity: canonical.maturity,
      confidence: canonical.confidence,
      visibility: canonical.visibility,
      publicationClass: canonical.publicationClass,
      tags: canonical.tags || [],
      discipline: canonical.discipline || [],
      route: canonical.route || item.route,
      identifier: canonical.identifier,
      temporality: canonical.temporality || item.temporality,
      locale: canonical.locale,
    };
  };

  const runtimeRecordFromCatalog = (item) => ({
    ...item,
    id: item.legacyId || item.id,
    canonicalId: item.translationOf || item.id,
    localizedId: item.locale === pageLocale ? item.id : undefined,
    title: item.title,
    subtitle: item.subtitle,
    kind: item.type,
    type: item.type,
    status: item.status,
    statusLabel: item.status,
    maturity: item.maturity,
    confidence: item.confidence,
    visibility: item.visibility,
    summary: item.summary,
    description: item.description,
    tags: item.tags || [],
    discipline: item.discipline || [],
    route: item.route,
    temporality: item.temporality,
  });

  const flattenEntities = () =>
    (() => {
      const sourceEntities = [
      ...(entities.programs || []),
      ...(entities.artists || []),
      ...(entities.projects || []),
      ...(entities.artefacts || []),
      ...(entities.channels || []),
      ...(entities.researchFields || []),
      ...(entities.researchLogs || []),
      ...(entities.worldbuilding || []),
      ...(collections || []).map((item) => ({
        ...item,
        kind: "collection",
        type: item.type || "Collection",
        summary: item.summary || "",
        visibility: item.visibility || "public",
      })),
      ];
      const claimedCanonicalIds = new Set(sourceEntities.map((item) => item.canonicalId).filter(Boolean));
      const legacyIdentities = new Set(
        sourceEntities.map((item) => `${item.id}|${item.kind || item.type}`).filter(Boolean),
      );
      const catalogOnly = catalogEntities
        .filter((item) => item.locale === pageLocale)
        .filter((item) => !claimedCanonicalIds.has(item.id))
        .filter((item) => !legacyIdentities.has(`${item.legacyId}|${item.type}`))
        .map(runtimeRecordFromCatalog);
      return [...sourceEntities, ...catalogOnly];
    })()
      .filter(isPublic)
      .map(localizeEntity)
      .map((item) => ({
      ...item,
      titleSlug: normalizeTitle(item.title),
      }));

  const allEntities = flattenEntities();
  const entitiesByKind = (kind) => allEntities.filter((item) => item.kind === kind || item.type === kind);
  const byId = Object.fromEntries(allEntities.map((item) => [item.id, item]));
  const byTitleSlug = allEntities.reduce((acc, item) => {
    if (!item.titleSlug || acc[item.titleSlug]) return acc;
    acc[item.titleSlug] = item;
    return acc;
  }, {});
  const byKind = allEntities.reduce((acc, item) => {
    const bucket = acc[item.kind] || (acc[item.kind] = []);
    bucket.push(item);
    return acc;
  }, {});
  const byStatus = allEntities.reduce((acc, item) => {
    const bucket = acc[item.status] || (acc[item.status] = []);
    bucket.push(item);
    return acc;
  }, {});
  const timelinesByEntityId = Object.fromEntries((timelines || []).map((item) => [item.entityId, item]));
  const activityByEntityId = (activity || []).reduce((acc, item) => {
    const bucket = acc[item.entityId] || (acc[item.entityId] = []);
    bucket.push(item);
    return acc;
  }, {});
  let searchIndexCache = null;
  const getSearchIndex = () => {
    if (searchIndexCache) return searchIndexCache;
    searchIndexCache = window.EA_SEARCH ? window.EA_SEARCH.buildIndex({ indexes: { entities: allEntities } }) : [];
    return searchIndexCache;
  };

  const indexes = {
    entities: allEntities,
    byId,
    byTitleSlug,
    byKind,
    byStatus,
    timelinesByEntityId,
    activityByEntityId,
    getSearchIndex,
  };
  const routeById = { ...(publicCatalog.routes || {}) };
  catalogEntities.forEach((item) => {
    if (item.legacyId && item.route) routeById[item.legacyId] = item.route;
  });
  if (pageLocale !== "en") {
    catalogEntities
      .filter((item) => item.locale === pageLocale && item.route)
      .forEach((item) => {
        routeById[item.id] = item.route;
        if (item.legacyId) routeById[item.legacyId] = item.route;
        const source = item.translationOf ? catalogById[item.translationOf] : null;
        if (source) {
          routeById[source.id] = item.route;
          if (source.legacyId) routeById[source.legacyId] = item.route;
        }
      });
  }
  const routeFor = (itemOrId) => {
    const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
    if (!id) return "";
    return routeById[id] || (typeof itemOrId === "object" ? itemOrId.route || "" : "");
  };

  const catalog = {
    authority: "generated-public-catalog",
    taxonomies,
    entities: {
      programs: entitiesByKind("program"),
      artists: entitiesByKind("artist"),
      projects: entitiesByKind("project"),
      artefacts: entitiesByKind("artefact"),
      channels: entitiesByKind("channel"),
      researchFields: entitiesByKind("researchField"),
      researchLogs: entitiesByKind("researchLog"),
      worldbuilding: entitiesByKind("worldbuilding"),
      collections: entitiesByKind("collection"),
    },
    relations: publicCatalog.relations || relations,
    legacy: { entities, relations, timelines, activity, collections },
    timelines,
    activity,
    collections,
    indexes,
    routeById,
    routeFor,
    publicCatalog,
    programs: entitiesByKind("program"),
    artists: entitiesByKind("artist"),
    projects: entitiesByKind("project"),
    artefacts: entitiesByKind("artefact"),
    channels: entitiesByKind("channel"),
    researchFields: entitiesByKind("researchField"),
    researchQuestions: catalogEntities
      .filter((item) => item.type === "researchQuestion" && item.locale === pageLocale)
      .filter(isPublic)
      .map(runtimeRecordFromCatalog),
    researchLogs: entitiesByKind("researchLog"),
    worldbuilding: entitiesByKind("worldbuilding"),
    schema: {
      status: Object.keys(taxonomies.statuses || {}),
      entityTypes: Object.keys(taxonomies.entityTypes || {}),
      mediums: taxonomies.mediums || [],
      disciplines: taxonomies.disciplines || [],
      projectCategories: taxonomies.projectCategories || [],
      relationshipTags: taxonomies.relationshipTags || [],
    },
  };

  window.EA_CATALOG = catalog;
})();
