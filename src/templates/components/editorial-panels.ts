import type {
  CollectionEntity,
  ConceptEntity,
  Entity,
  FrameworkEntity,
  MethodEntity,
  ProgramEntity,
  ResearchFieldEntity,
  ResearchQuestionEntity,
  TechnologyEntity,
} from "../../schema/entities.js";
import type { EntityRef, SourceRef } from "../../schema/entity.js";
import { escapeHtml } from "../html.js";

const labelFrom = (value: string): string => {
  const label = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toLowerCase();

  return label.charAt(0).toUpperCase() + label.slice(1);
};

const unique = (items: string[] = []): string[] =>
  items.filter((item, index, values) => item && values.indexOf(item) === index);

const renderTags = (items: string[] = []): string => {
  const values = unique(items);
  if (!values.length) return "";
  return `
    <div class="tag-cluster tag-cluster--compact">
      ${values.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}
    </div>`;
};

const renderList = (items?: string[]): string => {
  const values = items || [];
  if (!values.length) return "";
  return `
    <ol class="article-mini-list">
      ${values.map((item) => `<li><strong>${escapeHtml(item)}</strong></li>`).join("")}
    </ol>`;
};

const renderSourceList = (sources?: SourceRef[]): string => {
  const values = sources || [];
  if (!values.length) return "";
  return `
    <ol class="article-mini-list">
      ${values.map((source) => {
        const meta = [source.author, source.publisher, source.publishedAt].filter(Boolean).join(" / ");
        return `
          <li>
            ${source.url
              ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>`
              : `<strong>${escapeHtml(source.title)}</strong>`}
            ${meta ? `<span>${escapeHtml(meta)}</span>` : ""}
          </li>`;
      }).join("")}
    </ol>`;
};

const refTitle = (ref: EntityRef, byId: Map<string, Entity>, locale?: string): string =>
  locale === "fr"
    ? byId.get(ref.id)?.title || ref.label || ref.id
    : ref.label || byId.get(ref.id)?.title || ref.id;

const renderRefs = (
  refs: EntityRef[] = [],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
  locale?: string,
): string => {
  if (!refs.length) return "";
  return `
    <div class="article-link-cloud">
      ${refs.map((ref) => `
        <a class="tag" href="${escapeHtml(routeById[ref.id] || "#")}">${escapeHtml(refTitle(ref, byId, locale))}</a>
      `).join("")}
    </div>`;
};

const panel = (eyebrow: string, title: string, body: string): string =>
  body.trim()
    ? `
      <article class="panel">
        <div class="section-head">
          <p class="card__meta">${escapeHtml(eyebrow)}</p>
          <h2 class="card__title">${escapeHtml(title)}</h2>
        </div>
        ${body}
      </article>`
    : "";

const conceptPanels = (entity: ConceptEntity): string[] => [
  panel("Scope", "Defined scope", renderList(entity.scope)),
  panel("Position", "Editorial position", renderList(entity.claims)),
  panel("Limits", "Explicit limits", renderList(entity.exclusions)),
];

const technologyPanels = (entity: TechnologyEntity): string[] => [
  panel("Technology role", "Role in the system", `<p class="card__copy">${escapeHtml(entity.roleInEcosystem)}</p>`),
  panel("Reference", "Category, versions and official source", `
    <dl class="metadata-list">
      <div><dt>Category</dt><dd>${escapeHtml(labelFrom(entity.category))}</dd></div>
      ${entity.versions?.length ? `<div><dt>Versions</dt><dd>${escapeHtml(entity.versions.join(", "))}</dd></div>` : ""}
      ${entity.officialUrl ? `<div><dt>Official URL</dt><dd><a href="${escapeHtml(entity.officialUrl)}" target="_blank" rel="noreferrer">${escapeHtml(entity.officialUrl)}</a></dd></div>` : ""}
    </dl>`),
];

const programPanels = (entity: ProgramEntity): string[] => [
  panel("Purpose", "What this program is built to handle", `<p class="card__copy">${escapeHtml(entity.mandate)}</p>`),
  panel("Capabilities", "What it can support", renderList(entity.capabilities)),
  panel("Architecture", "How it is organized", renderList(entity.architecture)),
  panel("Lifecycle", "How the program evolves", renderList(entity.lifecycle)),
];

const researchFieldPanels = (entity: ResearchFieldEntity): string[] => [
  panel("Questions", "What this field is trying to clarify", renderList(entity.questions.map((item) => `${item.question} (${item.status})`))),
  panel("Scope", "What this field covers", renderList(entity.scope)),
  panel("Findings", "Current findings and open questions", renderList([...(entity.findings || []), ...(entity.openQuestions || [])])),
];

const renderExperiments = (entity: ResearchQuestionEntity): string =>
  entity.experiments?.length
    ? `
      <ol class="article-mini-list">
        ${entity.experiments.map((experiment) => `
          <li>
            <strong>${escapeHtml(experiment.title)} (${escapeHtml(experiment.status)})</strong>
            <span>${escapeHtml(experiment.summary)}</span>
            ${experiment.result ? `<span>${escapeHtml(experiment.result)}</span>` : ""}
          </li>`).join("")}
      </ol>`
    : "";

const renderTimeline = (entity: ResearchQuestionEntity): string =>
  entity.timeline?.length
    ? `
      <ol class="article-mini-list">
        ${entity.timeline.map((event) => `
          <li>
            <strong>${escapeHtml(event.date)} / ${escapeHtml(event.title)}</strong>
            <span>${escapeHtml(event.summary)}</span>
          </li>`).join("")}
      </ol>`
    : "";

const researchQuestionPanels = (
  entity: ResearchQuestionEntity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string[] => [
  panel("Observation", "What was observed", `<p class="card__copy">${escapeHtml(entity.observation)}</p>`),
  panel("Problem", "Why it matters", entity.problem ? `<p class="card__copy">${escapeHtml(entity.problem)}</p>` : ""),
  panel("Hypothesis", "What is being tested", `<p class="card__copy">${escapeHtml(entity.hypothesis)}</p>`),
  panel("Understanding", "Current understanding", entity.currentUnderstanding ? `<p class="card__copy">${escapeHtml(entity.currentUnderstanding)}</p>` : ""),
  panel("Experiments", "How the question is being tested", renderExperiments(entity)),
  panel("Result", "What has emerged so far", entity.result ? `<p class="card__copy">${escapeHtml(entity.result)}</p>` : ""),
  panel("Next steps", "What remains unknown", renderList(entity.nextSteps)),
  panel("Timeline", "Research timeline", renderTimeline(entity)),
  panel("Related artefacts", "Software, projects and evidence", renderRefs([
    ...(entity.relatedProjects || []),
    ...(entity.relatedSoftware || []),
    ...(entity.relatedArticles || []),
    ...(entity.relatedCollections || []),
  ], byId, routeById, entity.locale)),
  panel("Related concepts", "Conceptual and technical context", renderRefs([
    ...(entity.relatedConcepts || []),
    ...(entity.relatedTechnologies || []),
  ], byId, routeById, entity.locale)),
];

const collectionPanels = (
  entity: CollectionEntity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string[] => [
  panel("Collection thesis", "Editorial thesis", `<p class="card__copy">${escapeHtml(entity.thesis)}</p>`),
  panel("Selection note", "Selection principles", `<p class="card__copy">${escapeHtml(entity.selectionNote)}</p>`),
  panel("Included pages", "Articles and notions in this collection", renderRefs(entity.explicitMembers, byId, routeById, entity.locale)),
];

const methodPanels = (entity: MethodEntity): string[] => [
  panel("Method purpose", "When this method is useful", `<p class="card__copy">${escapeHtml(entity.purpose)}</p>${renderList(entity.useWhen)}`),
  panel("Inputs and outputs", "What the method needs and produces", `${renderTags([...entity.inputs, ...entity.outputs])}`),
  panel("Steps", "Repeatable procedure", renderList(entity.steps.map((step) => `${step.order}. ${step.title}: ${step.description}`))),
  panel("Limitations", "Where the method has limits", renderList(entity.limitations)),
];

const frameworkPanels = (
  entity: FrameworkEntity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string[] => [
  panel("Principles", "Framework commitments", renderList(entity.principles)),
  panel("Components", "Linked framework components", renderRefs(entity.components, byId, routeById, entity.locale)),
  panel("Limitations", "Known constraints", renderList(entity.limitations)),
];

const generalPanels = (entity: Entity): string[] => [
  panel("Topics", "Tags and disciplines", renderTags([...(entity.tags || []), ...(entity.disciplines || [])])),
  panel("Sources", "References behind this page", renderSourceList(entity.sources)),
];

export const renderEditorialPanels = (
  entity: Entity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const typedPanels = (() => {
    if (entity.type === "concept") return conceptPanels(entity);
    if (entity.type === "technology") return technologyPanels(entity);
    if (entity.type === "program") return programPanels(entity);
    if (entity.type === "researchField") return researchFieldPanels(entity);
    if (entity.type === "researchQuestion") return researchQuestionPanels(entity, byId, routeById);
    if (entity.type === "collection") return collectionPanels(entity, byId, routeById);
    if (entity.type === "method") return methodPanels(entity);
    if (entity.type === "framework") return frameworkPanels(entity, byId, routeById);
    return [];
  })();
  const panels = [...typedPanels, ...generalPanels(entity)].filter(Boolean);

  if (!panels.length) return "";
  return `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">EDITORIAL FRAME</p>
        <h2>What this entry establishes.</h2>
        <p class="lede">A concise view of its scope, position, limitations and supporting sources.</p>
      </div>
      <div class="card-grid card-grid--two">
        ${panels.join("")}
      </div>
    </section>`;
};
