(function () {
  const taxonomies = window.EA_TAXONOMIES || {};
  const entities = window.EA_ENTITIES || {};
  const relations = window.EA_RELATIONS || {};
  const timelines = window.EA_TIMELINES || [];
  const activity = window.EA_ACTIVITY || [];
  const collections = window.EA_COLLECTIONS || [];
  const normalizeTitle = (value) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const isPublic = (item) => !["internal", "restricted"].includes(item?.visibility);

  const flattenEntities = () =>
    [
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
    ]
      .filter(isPublic)
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

  const catalog = {
    taxonomies,
    entities,
    relations,
    timelines,
    activity,
    collections,
    indexes,
    programs: (entities.programs || []).filter(isPublic),
    artists: (entities.artists || []).filter(isPublic),
    projects: (entities.projects || []).filter(isPublic),
    artefacts: (entities.artefacts || []).filter(isPublic),
    channels: (entities.channels || []).filter(isPublic),
    researchFields: (entities.researchFields || []).filter(isPublic),
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
