import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { parse, stringify } from "yaml";

const rootDir = path.resolve(".");
const today = "2026-06-25";

const protectedKeys = new Set([
  "id",
  "translationOf",
  "type",
  "status",
  "maturity",
  "confidence",
  "visibility",
  "publicationClass",
  "category",
  "format",
  "organizationType",
  "eventType",
  "domain",
  "publicationClass",
  "publisher",
  "officialUrl",
  "url",
  "src",
  "href",
  "doi",
  "locator",
  "version",
  "createdAt",
  "publishedAt",
  "modifiedAt",
  "reviewedAt",
  "supersedes",
]);

const titleMap = new Map(Object.entries({
  "AI Agent": "Agent d’IA",
  "AI Agents vs AI Workflows": "Agents d’IA et workflows d’IA",
  "AI Search, Structured Content and Knowledge Graph SEO": "Recherche IA, contenu structuré et SEO par graphe de connaissances",
  "Algorithmic Composition": "Composition algorithmique",
  "Algorithmic Composition and Rule-Based Music": "Composition algorithmique et musique fondée sur des règles",
  "Augmented Intelligence": "Intelligence augmentée",
  "Autonomous System": "Système autonome",
  "C2PA Content Credentials and Generative Media Provenance": "C2PA, Content Credentials et provenance des médias génératifs",
  "Contextual Execution": "Exécution contextuelle",
  "Contextual Execution and Graph Runtimes": "Exécution contextuelle et runtimes de graphe",
  "Creative Coding": "Programmation créative",
  "Creative Coding Pedagogy from Logo to p5.js": "Pédagogie du creative coding, de Logo à p5.js",
  "Cybernetic Feedback": "Rétroaction cybernétique",
  "Digital Preservation": "Préservation numérique",
  "Digital Preservation and Living Archives": "Préservation numérique et archives vivantes",
  "Domain Operating System": "Système d’exploitation de domaine",
  "Entity Identity": "Identité d’entité",
  "Event-Driven Architecture": "Architecture événementielle",
  "Event-Driven Architecture and Event Streams": "Architecture événementielle et flux d’événements",
  "Foundational Lineage 001": "Lignée fondatrice 001",
  "Generative AI": "IA générative",
  "Generative AI, Latent Space and Creative Workflows": "IA générative, espace latent et workflows créatifs",
  "Generative System": "Système génératif",
  "Generative Systems, Cybernetics and Creative Coding": "Systèmes génératifs, cybernétique et programmation créative",
  "Graph Modeling": "Modélisation de graphe",
  "Graph Runtime": "Runtime de graphe",
  "How Large Language Models Actually Work": "Comment fonctionnent vraiment les grands modèles de langage",
  "Human-Computer Interaction": "Interaction humain-machine",
  "Human-Computer Interaction for Creative Tools": "Interaction humain-machine pour les outils créatifs",
  "Hypertext": "Hypertexte",
  "Hypertext and Augmented Knowledge Systems": "Hypertexte et systèmes de connaissance augmentée",
  "IIIF and Compound Cultural Objects": "IIIF et objets culturels composés",
  "Internet Culture": "Culture Internet",
  "Knowledge Graph": "Graphe de connaissances",
  "Knowledge Graphs for Cultural Infrastructure": "Graphes de connaissances pour les infrastructures culturelles",
  "Knowledge Hub Foundations": "Fondations du hub de connaissance",
  "Knowledge Hub Fourth Wave": "Hub de connaissance, quatrième vague",
  "Knowledge Hub Second Wave": "Hub de connaissance, deuxième vague",
  "Knowledge Hub Third Wave": "Hub de connaissance, troisième vague",
  "Large Language Model": "Grand modèle de langage",
  "Linked Data": "Données liées",
  "Linked Data and Public Knowledge Pages": "Données liées et pages publiques de connaissance",
  "Local and Open Source AI Systems": "Systèmes d’IA locaux et open source",
  "Metadata": "Métadonnées",
  "Metadata, Cataloguing and Cultural Memory": "Métadonnées, catalogage et mémoire culturelle",
  "Microservice Architecture": "Architecture de microservices",
  "Microservices, Modular Monoliths and System Boundaries": "Microservices, monolithes modulaires et frontières de système",
  "Model Context Protocol and Tool-Using AI Systems": "Model Context Protocol et systèmes d’IA utilisant des outils",
  "Motion Design": "Motion design",
  "Motion Design, Time and Interface Semantics": "Motion design, temps et sémantique d’interface",
  "Multimodal AI": "IA multimodale",
  "Multimodal AI Across Text, Image, Audio and Video": "IA multimodale pour le texte, l’image, l’audio et la vidéo",
  "Observability for AI Agents and Tool-Calling Systems": "Observabilité des agents d’IA et des systèmes d’appel d’outils",
  "Ontologies, Taxonomies and Knowledge Modeling": "Ontologies, taxonomies et modélisation des connaissances",
  "Ontology": "Ontologie",
  "Open Source": "Open source",
  "Open Source as Cultural Infrastructure": "L’open source comme infrastructure culturelle",
  "Open Weight Model": "Modèle à poids ouverts",
  "Personal Knowledge System": "Système personnel de connaissance",
  "Personal Knowledge Systems and Digital Gardens": "Systèmes personnels de connaissance et jardins numériques",
  "Procedural Graphics": "Graphisme procédural",
  "Procedural Graphics, Shaders and Visual Systems": "Graphisme procédural, shaders et systèmes visuels",
  "Prompt Injection and Trust Boundaries in AI Knowledge Systems": "Injection de prompt et frontières de confiance dans les systèmes de connaissance IA",
  "Provenance": "Provenance",
  "Redis Streams for Orchestration": "Redis Streams pour l’orchestration",
  "Responsible AI Governance for Creative and Cultural Systems": "Gouvernance responsable de l’IA pour les systèmes créatifs et culturels",
  "Retrieval-Augmented Generation": "Génération augmentée par récupération",
  "Retrieval-Augmented Generation and Knowledge Systems": "Génération augmentée par récupération et systèmes de connaissance",
  "Runtime Engines and Domain Operating Systems": "Moteurs runtime et systèmes d’exploitation de domaine",
  "Runtime Theory": "Théorie du runtime",
  "Signal Archaeology": "Archéologie du signal",
  "Signal Archaeology, Audio Memory and Machine Listening": "Archéologie du signal, mémoire audio et écoute machine",
  "Systems Thinking": "Pensée systémique",
  "Systems Thinking for Creative Practice": "Pensée systémique pour la pratique créative",
  "Typography": "Typographie",
  "Typography, Reading Systems and Digital Interfaces": "Typographie, systèmes de lecture et interfaces numériques",
  "Verifiable Credentials for Cultural Archives and Creator Identity": "Identifiants vérifiables pour les archives culturelles et l’identité des créateurs",
  "Web Audio": "Audio web",
  "Web Audio and Browser-Based Sound Systems": "Web Audio et systèmes sonores dans le navigateur",
  "Web Audio API": "Web Audio API",
  "WebNN and Local AI in the Browser": "WebNN et IA locale dans le navigateur",
  "Why Graphs Are More Powerful Than Folders": "Pourquoi les graphes sont plus puissants que les dossiers",
}));

const phrasePairs = [
  ["artificial intelligence", "intelligence artificielle"],
  ["Artificial Intelligence", "Intelligence artificielle"],
  ["knowledge graph", "graphe de connaissances"],
  ["Knowledge Graph", "Graphe de connaissances"],
  ["knowledge graphs", "graphes de connaissances"],
  ["Knowledge graphs", "Graphes de connaissances"],
  ["knowledge systems", "systèmes de connaissance"],
  ["Knowledge Systems", "Systèmes de connaissance"],
  ["creative coding", "programmation créative"],
  ["Creative Coding", "Programmation créative"],
  ["digital preservation", "préservation numérique"],
  ["Digital Preservation", "Préservation numérique"],
  ["open source", "open source"],
  ["Open Source", "Open source"],
  ["linked data", "données liées"],
  ["Linked Data", "Données liées"],
  ["metadata", "métadonnées"],
  ["Metadata", "Métadonnées"],
  ["provenance", "provenance"],
  ["Provenance", "Provenance"],
  ["workflow", "workflow"],
  ["workflows", "workflows"],
  ["runtime", "runtime"],
  ["runtimes", "runtimes"],
  ["interface", "interface"],
  ["interfaces", "interfaces"],
  ["archive", "archive"],
  ["archives", "archives"],
  ["cultural", "culturel"],
  ["Cultural", "Culturel"],
  ["public", "public"],
  ["Public", "Public"],
  ["systems", "systèmes"],
  ["Systems", "Systèmes"],
  ["system", "système"],
  ["System", "Système"],
  ["model", "modèle"],
  ["Model", "Modèle"],
  ["models", "modèles"],
  ["Models", "Modèles"],
  ["data", "données"],
  ["Data", "Données"],
  ["media", "médias"],
  ["Media", "Médias"],
  ["identity", "identité"],
  ["Identity", "Identité"],
  ["semantic", "sémantique"],
  ["Semantic", "Sémantique"],
  ["browser", "navigateur"],
  ["Browser", "Navigateur"],
  ["tools", "outils"],
  ["Tools", "Outils"],
  ["tool", "outil"],
  ["Tool", "Outil"],
  ["architecture", "architecture"],
  ["Architecture", "Architecture"],
  ["governance", "gouvernance"],
  ["Governance", "Gouvernance"],
  ["federated", "fédéré"],
  ["Federated", "Fédéré"],
  ["protocol", "protocole"],
  ["Protocol", "Protocole"],
  ["platform", "plateforme"],
  ["Platform", "Plateforme"],
  ["infrastructure", "infrastructure"],
  ["Infrastructure", "Infrastructure"],
  ["research", "recherche"],
  ["Research", "Recherche"],
  ["memory", "mémoire"],
  ["Memory", "Mémoire"],
  ["cataloguing", "catalogage"],
  ["Cataloguing", "Catalogage"],
  ["signal", "signal"],
  ["Signal", "Signal"],
  ["audio", "audio"],
  ["Audio", "Audio"],
  ["visual", "visuel"],
  ["Visual", "Visuel"],
  ["graph", "graphe"],
  ["Graph", "Graphe"],
  ["entity", "entité"],
  ["Entity", "Entité"],
  ["entities", "entités"],
  ["Entities", "Entités"],
  ["publication", "publication"],
  ["Publication", "Publication"],
  ["method", "méthode"],
  ["Method", "Méthode"],
  ["concept", "concept"],
  ["Concept", "Concept"],
];

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const splitMarkdown = (source, file) => {
  const match = frontmatterPattern.exec(source);
  if (!match) throw new Error(`Missing frontmatter in ${file}`);
  return {
    data: parse(match[1] || "") || {},
    body: source.slice(match[0].length).trim(),
  };
};

const fallbackTitle = (value) => titleMap.get(value) || value;

const translateString = (value) => {
  if (!value) return value;
  if (titleMap.has(value)) return titleMap.get(value);
  let output = value;
  for (const [from, to] of phrasePairs) {
    output = output.replaceAll(from, to);
  }
  output = output
    .replace(/\bis a\b/g, "est un")
    .replace(/\bis an\b/g, "est un")
    .replace(/\bis the\b/g, "est le")
    .replace(/\bare\b/g, "sont")
    .replace(/\bprovides\b/g, "fournit")
    .replace(/\bconnects\b/g, "relie")
    .replace(/\bdescribes\b/g, "décrit")
    .replace(/\bfor\b/g, "pour")
    .replace(/\bwith\b/g, "avec")
    .replace(/\band\b/g, "et")
    .replace(/\bor\b/g, "ou")
    .replace(/\bof\b/g, "de")
    .replace(/\bto\b/g, "à")
    .replace(/\bin\b/g, "dans")
    .replace(/\bas\b/g, "comme");
  return output;
};

const translateValue = (value, key = "") => {
  if (typeof value === "string") {
    return protectedKeys.has(key) ? value : translateString(value);
  }
  if (Array.isArray(value)) return value.map((item) => translateValue(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [childKey, translateValue(childValue, childKey)]),
    );
  }
  return value;
};

const translatedId = (entity) => `${entity.id}-fr`;

const outputPathFor = (entity, sourceFile) => {
  const relative = path.relative(path.join(rootDir, "content"), sourceFile);
  return path.join(rootDir, "content", "fr", relative);
};

const topicSentence = (entity) => {
  const title = fallbackTitle(entity.title);
  const description = translateString(entity.abstract || entity.description || "");
  return `${title} est documenté ici comme une entrée française du graphe public d’Electronic Artefacts. ${description}`;
};

const typeUse = {
  concept: "Cette notion sert à relier les projets, publications et technologies qui partagent un même vocabulaire de conception.",
  technology: "Cette technologie sert de repère pour évaluer les choix d’architecture, les dépendances et les possibilités d’implémentation.",
  publication: "Cette publication rend le sujet lisible pour la recherche, le développement et la documentation publique du studio.",
  collection: "Cette collection organise un ensemble de fiches autour d’une progression éditoriale commune.",
  researchField: "Ce champ de recherche cadre les questions, méthodes et prototypes suivis dans le temps.",
  project: "Ce projet documente un contexte de production, ses contraintes, ses preuves et ses prolongements possibles.",
  program: "Ce programme décrit un système maintenu, ses capacités et son rôle dans l’écosystème du studio.",
  organization: "Cette organisation sert de point d’ancrage éditorial, juridique et opérationnel pour le graphe public.",
};

const bodyFor = (entity) => {
  const title = fallbackTitle(entity.title);
  const abstract = translateString(entity.abstract || entity.description || "");
  const role = translateString(entity.roleInEcosystem || entity.definition || entity.thesis || entity.brief || entity.mandate || abstract);
  const disciplines = (entity.disciplines || entity.tags || []).slice(0, 5).map(translateString);
  const tags = disciplines.length ? disciplines.join(", ") : "recherche, conception, systèmes numériques";
  const sourceLine = entity.sources?.length
    ? `Les références principales restent les sources indiquées dans la fiche canonique, notamment ${entity.sources.slice(0, 2).map((source) => source.title).join(" et ")}.`
    : "Les références principales sont conservées dans la fiche canonique et dans le graphe de connaissance public.";

  if (entity.type === "publication") {
    const claimList = (entity.claims || [])
      .slice(0, 4)
      .map((claim) => `- ${translateString(claim)}`)
      .join("\n");
    return `## Synthèse\n\n${topicSentence(entity)}\n\n## Argument\n\n${abstract} Le texte situe ${title} dans les enjeux de production, d’architecture, de culture numérique et de transmission des connaissances.\n\n${claimList ? `## Points clés\n\n${claimList}\n\n` : ""}## Usage\n\nPour Electronic Artefacts, cette page sert de repère français pour cadrer le sujet, orienter les liens du graphe et préparer des contenus plus détaillés.\n\n## Références\n\n${sourceLine}\n`;
  }

  if (entity.type === "collection") {
    return `## Intention\n\n${topicSentence(entity)}\n\n## Sélection\n\n${translateString(entity.selectionNote || entity.thesis || abstract)}\n\n## Usage\n\nCette collection facilite la navigation entre des objets liés et donne une entrée française cohérente aux archives de connaissance.\n\n## Références\n\n${sourceLine}\n`;
  }

  if (entity.type === "researchField") {
    const questions = (entity.questions || [])
      .map((item) => `- ${translateString(item.question)}`)
      .join("\n");
    return `## Champ\n\n${topicSentence(entity)}\n\n## Questions\n\n${questions}\n\n## Usage\n\n${typeUse.researchField}\n\n## Références\n\n${sourceLine}\n`;
  }

  return `## Rôle\n\n${topicSentence(entity)}\n\n## Usage\n\n${typeUse[entity.type] || "Cette fiche donne une entrée française stable pour le graphe de connaissance public."} ${role}\n\n## Domaines\n\nCette entrée croise notamment les domaines suivants : ${tags}.\n\n## Références\n\n${sourceLine}\n`;
};

const englishFiles = await fg("content/**/*.md", {
  cwd: rootDir,
  absolute: true,
  ignore: ["content/fr/**", "content/relations/**"],
});
const frenchFiles = await fg("content/fr/**/*.md", { cwd: rootDir, absolute: true });
const translated = new Set();
for (const file of frenchFiles) {
  const { data } = splitMarkdown(await readFile(file, "utf8"), file);
  if (data.translationOf) translated.add(data.translationOf);
}

let created = 0;
for (const file of englishFiles.sort()) {
  const { data } = splitMarkdown(await readFile(file, "utf8"), file);
  if (translated.has(data.id)) continue;

  const fr = translateValue(data);
  fr.id = translatedId(data);
  fr.translationOf = data.id;
  fr.slug = { canonical: data.slug?.canonical || path.basename(file, ".md") };
  fr.title = fallbackTitle(data.title);
  fr.abstract = translateString(data.abstract);
  if (data.description) fr.description = translateString(data.description);
  fr.locale = "fr";
  fr.version = {
    ...(data.version || {}),
    publishedAt: today,
    modifiedAt: today,
  };

  const output = outputPathFor(data, file);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `---\n${stringify(fr).trim()}\n---\n\n${bodyFor(data)}`);
  created += 1;
}

process.stdout.write(`Created ${created} missing French content records.\n`);
