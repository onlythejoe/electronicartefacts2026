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
    title: "V6 Collection",
    kind: "collection",
    type: "Collection",
    status: "development",
    visibility: "public",
    summary: "Research on art, craft, mapping and CRM connected to the future V6 platform.",
    rules: { entityIds: ["vestiges", "vaste", "graph-runtime-studies", "taxonomy-schema"], tags: ["V6", "Knowledge Graph"], kinds: ["project", "program", "researchField", "researchLog", "artefact"] },
  },
  {
    id: "voice-capture-studio-collection",
    canonicalId: "ea:collection:voice-capture-studio",
    title: "Voice Capture Studio Collection",
    kind: "collection",
    type: "Collection",
    status: "active",
    visibility: "public",
    summary: "Speech recording, local-first browser software and structured voice export context around Voice Capture Studio.",
    rules: { entityIds: ["voice-capture-studio", "oreth-program", "ea-lightweight-template"], tags: ["Voice Capture Studio", "Speech Recording", "Voice Dataset", "Web Audio"], kinds: ["project", "program", "artefact"] },
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
  {
    id: "unionmob-collection",
    title: "UnionMob Collection",
    kind: "collection",
    type: "Collection",
    status: "research",
    visibility: "public",
    summary: "External UnionMob collaboration, CTO work, UMOS licensing model and governance research.",
    rules: { entityIds: ["unionmob", "unionmob-os1", "governance-studies"], tags: ["UnionMob"], kinds: ["project", "program", "researchField", "researchLog"] },
  },
  {
    id: "runtime-collection",
    title: "Runtime Collection",
    kind: "collection",
    type: "Collection",
    status: "research",
    visibility: "public",
    summary: "Runtime systems, graph execution studies and related archival material.",
    rules: { entityIds: ["vaste", "arca", "oraclehub", "runtime-theory", "graph-runtime-studies"], tags: ["Runtime"], kinds: ["program", "researchField", "researchLog", "artefact"] },
  },
  {
    id: "lore-collection",
    title: "Lore Collection",
    kind: "collection",
    type: "Collection",
    status: "development",
    visibility: "internal",
    summary: "Narrative universes, symbolic structures and lore-linked research.",
    rules: { entityIds: ["palimpsests-universe", "null-universe", "anthropic-studies"], tags: ["Universe", "Lore"], kinds: ["universe", "researchField", "researchLog"] },
  },
  {
    id: "client-work-collection",
    title: "Client Work Collection",
    kind: "collection",
    type: "Collection",
    status: "production",
    visibility: "public",
    summary: "Client-facing projects, collaborators and delivery systems.",
    rules: { entityIds: ["oeil-de-meg", "seven-temps-seulement", "marjolaine-muller", "oeil-de-meg-crm", "oeil-de-meg-plugin", "oeil-de-meg-theme", "oeil-de-meg-pinterest-sync", "oeil-de-meg-gallery-system", "oeil-de-meg-calendar"], tags: ["Client Work", "Photography"], kinds: ["project", "program", "artist"] },
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
