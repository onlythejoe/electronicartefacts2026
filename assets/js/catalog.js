(function () {
  const taxonomies = window.EA_TAXONOMIES || {};
  const entities = window.EA_ENTITIES || {};
  const relations = window.EA_RELATIONS || {};
  const timelines = window.EA_TIMELINES || [];
  const activity = window.EA_ACTIVITY || [];
  const collections = window.EA_COLLECTIONS || [];

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
    ].map((item) => ({
      ...item,
      searchText: [
        item.title,
        item.subtitle,
        item.description,
        item.summary,
        item.status,
        item.kind,
        item.category,
        item.type,
        ...(item.tags || []),
        ...(item.medium || []),
        ...(item.discipline || []),
        ...(item.relatedProjects || []),
        ...(item.relatedArtefacts || []),
        ...(item.relatedPrograms || []),
        ...(item.relatedResearchFields || []),
        ...(item.links || []).map((link) => link.label),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    }));

  const allEntities = flattenEntities();
  const byId = Object.fromEntries(allEntities.map((item) => [item.id, item]));
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

  const indexes = {
    entities: allEntities,
    byId,
    byKind,
    byStatus,
    search: window.EA_SEARCH ? window.EA_SEARCH.buildIndex({ indexes: { entities: allEntities } }) : [],
  };

  const catalog = {
    taxonomies,
    entities,
    relations,
    timelines,
    activity,
    collections,
    indexes,
    programs: entities.programs || [],
    artists: entities.artists || [],
    projects: entities.projects || [],
    artefacts: entities.artefacts || [],
    channels: entities.channels || [],
    researchFields: entities.researchFields || [],
    researchLogs: entities.researchLogs || [],
    worldbuilding: entities.worldbuilding || [],
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
