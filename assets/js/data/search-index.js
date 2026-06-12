window.EA_SEARCH = {
  buildIndex(catalog) {
    const entities = catalog.indexes?.entities || [];
    return entities.map((item) => {
      const relations = item.relations || {};
      const researchFields = item.relatedResearchFields || item.relatedProjects || item.relatedArtefacts || [];
      const value = [
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
        ...(researchFields || []),
        ...(Object.values(relations).flat ? Object.values(relations).flat() : []),
      ]
        .flat()
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return {
        id: item.id,
        title: item.title,
        kind: item.kind,
        type: item.type,
        category: item.category,
        status: item.status,
        summary: item.summary || item.description || "",
        value,
      };
    });
  },
};
