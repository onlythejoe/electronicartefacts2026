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
  const translatedBySourceId = catalogEntities.reduce((acc, item) => {
    if (item.locale === pageLocale && item.translationOf) acc[item.translationOf] = item;
    return acc;
  }, {});

  const localizedCatalogRecordFor = (item) => {
    if (pageLocale === "en" || !item?.id) return null;
    const source = catalogByLegacyId[item.id] || catalogById[item.id];
    return translatedBySourceId[source?.id] || null;
  };

  const localizeEntity = (item) => {
    const localized = localizedCatalogRecordFor(item);
    if (!localized) return item;
    return {
      ...item,
      title: localized.title || item.title,
      subtitle: localized.subtitle || item.subtitle,
      summary: localized.summary || item.summary,
      description: localized.description || item.description,
      tags: localized.tags?.length ? localized.tags : item.tags,
      discipline: localized.discipline?.length ? localized.discipline : item.discipline,
      route: localized.route || item.route,
      locale: localized.locale,
      canonicalId: localized.translationOf || item.canonicalId,
      localizedId: localized.id,
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
      const legacyIds = new Set(sourceEntities.map((item) => item.id).filter(Boolean));
      const catalogOnly = catalogEntities
        .filter((item) => item.locale === pageLocale)
        .filter((item) => !legacyIds.has(item.legacyId) && !legacyIds.has(item.id))
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
    taxonomies,
    entities,
    relations,
    timelines,
    activity,
    collections,
    indexes,
    routeById,
    routeFor,
    publicCatalog,
    programs: (entities.programs || []).filter(isPublic),
    artists: (entities.artists || []).filter(isPublic),
    projects: (entities.projects || []).filter(isPublic),
    artefacts: (entities.artefacts || []).filter(isPublic),
    channels: (entities.channels || []).filter(isPublic),
    researchFields: (entities.researchFields || []).filter(isPublic),
    researchQuestions: catalogEntities
      .filter((item) => item.type === "researchQuestion" && item.locale === pageLocale)
      .filter(isPublic)
      .map(runtimeRecordFromCatalog),
    researchLogs: (entities.researchLogs || []).filter(isPublic),
    worldbuilding: (entities.worldbuilding || []).filter(isPublic),
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
