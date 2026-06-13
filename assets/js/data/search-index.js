window.EA_SEARCH = {
  buildIndex(catalog) {
    const entities = catalog.indexes?.entities || [];
    return entities.map((item) => {
      return {
        id: item.id,
        title: item.title,
        kind: item.kind,
        type: item.type,
        category: item.category,
        status: item.status,
        summary: item.summary || item.description || "",
        value: String(
          item.searchText ||
            [
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
              ...(item.relatedResearchFields || item.relatedProjects || item.relatedArtefacts || []),
              ...Object.values(item.relations || {}).flat(),
            ]
              .flat()
              .filter(Boolean)
              .join(" "),
        ).toLowerCase(),
      };
    });
  },
};
