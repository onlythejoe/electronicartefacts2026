window.EA_COLLECTIONS = [
  {
    id: "palimpsests-collection",
    title: "Palimpsests Collection",
    kind: "collection",
    type: "Collection",
    status: "production",
    visibility: "public",
    summary: "Album, field notes and audio artefacts linked to the Palimpsests cycle.",
    rules: { entityIds: ["palimpsests", "oreth"], tags: ["Palimpsests"], relations: ["palimpsests"] },
  },
  {
    id: "entropy-studies-collection",
    title: "Entropy Studies Collection",
    kind: "collection",
    type: "Collection",
    status: "research",
    visibility: "public",
    summary: "Entropy field work, observations and related audio artefacts.",
    rules: { tags: ["Entropy"], researchFields: ["entropy"] },
  },
  {
    id: "vestiges-collection",
    title: "Vestiges Collection",
    kind: "collection",
    type: "Collection",
    status: "development",
    visibility: "internal",
    summary: "Narrative universe fragments and associated research.",
    rules: { entityIds: ["vestiges", "anthropic-studies"], tags: ["Vestiges"], researchFields: ["anthropic-studies"] },
  },
  {
    id: "visual-research-collection",
    title: "Visual Research Collection",
    kind: "collection",
    type: "Collection",
    status: "research",
    visibility: "public",
    summary: "Observatory outputs from CreativeStuff.jpg and related visual studies.",
    rules: { entityIds: ["creativestuff", "visual-reference-001"], tags: ["Visual"], kinds: ["channel", "researchLog"] },
  },
  {
    id: "vastelab-collection",
    title: "VASTE Lab Collection",
    kind: "collection",
    type: "Collection",
    status: "active",
    visibility: "public",
    summary: "Runtime, research and system studies linked to VASTE.",
    rules: { entityIds: ["vaste", "oraclehub", "runtime-theory", "systems-theory"], tags: ["VASTE"], kinds: ["program", "researchField", "researchLog"] },
  },
];

const resolvedCollectionCache = new Map();

window.EA_COLLECTIONS.resolve = function resolveCollectionMembers(collection, catalog) {
  const cacheKey = collection?.id;
  if (cacheKey && resolvedCollectionCache.has(cacheKey)) {
    return resolvedCollectionCache.get(cacheKey);
  }

  const flat = catalog.indexes?.entities || [];
  const allIds = new Set();
  const matches = [];
  const rules = collection.rules || {};
  const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
  const add = (item) => {
    if (!item || !item.id || allIds.has(item.id)) return;
    allIds.add(item.id);
    matches.push(item);
  };

  (rules.entityIds || []).forEach((id) => add(catalog.indexes?.byId?.[id]));
  flat.forEach((item) => {
    if (rules.kinds && !rules.kinds.includes(item.kind)) return;
    if (rules.tags && !(item.tags || []).some((tag) => rules.tags.includes(tag))) return;
    const researchFields = [...asArray(item.researchField), ...asArray(item.relatedResearchFields)];
    if (rules.researchFields && !researchFields.some((field) => rules.researchFields.includes(field))) return;
    if (rules.relations && !(item.relations?.relatedTo || []).some((id) => rules.relations.includes(id)) && !(item.relations?.partOf || []).some((id) => rules.relations.includes(id))) return;
    if (rules.entityIds && !rules.entityIds.includes(item.id)) {
      if (!rules.tags && !rules.kinds && !rules.researchFields && !rules.relations) return;
    }
    add(item);
  });

  if (cacheKey) {
    resolvedCollectionCache.set(cacheKey, matches);
  }

  return matches;
};
