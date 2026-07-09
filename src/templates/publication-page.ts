import { site } from "../config/site.js";
import { routeForEntity } from "../config/routes.js";
import type { Entity, PublicationEntity } from "../schema/entities.js";
import type { EntityRef, SourceRef } from "../schema/entity.js";
import type { RelationStatement } from "../schema/relation.js";
import { publicEntityIds, publicRelationsForEntity, publicRefs } from "../semantic/visibility.js";
import { renderBreadcrumbs } from "./components/breadcrumbs.js";
import { renderCitationPanel } from "./components/citation-panel.js";
import { renderEntityMetadata } from "./components/entity-metadata.js";
import { renderLocalGraph } from "./components/local-graph.js";
import { renderRelationshipGroups } from "./components/relationship-groups.js";
import { escapeHtml } from "./html.js";

const labelFrom = (value: string): string => {
  const label = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toLowerCase();

  return label.charAt(0).toUpperCase() + label.slice(1);
};

const textFromHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const readingMinutes = (entity: PublicationEntity): number => {
  const words = textFromHtml(entity.bodyHtml).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

const renderChipCloud = (items: string[], className = "pill-cloud"): string => {
  const unique = items.filter((item, index, values) => item && values.indexOf(item) === index);
  if (!unique.length) return "";
  return `
    <div class="${className}">
      ${unique.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
    </div>`;
};

const refTitle = (ref: EntityRef, byId: Map<string, Entity>, locale?: string): string =>
  locale === "fr"
    ? byId.get(ref.id)?.title || ref.label || ref.id
    : ref.label || byId.get(ref.id)?.title || ref.id;

const refRoute = (ref: EntityRef, routeById: Record<string, string>): string =>
  routeById[ref.id] || "#";

const renderLinkedRefs = (
  refs: EntityRef[] = [],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
  locale?: string,
): string => {
  const visibleRefs = publicRefs(refs, byId);
  if (!visibleRefs.length) return `<p class="card__copy">No explicit linked entities.</p>`;

  return `
    <div class="article-link-cloud">
      ${visibleRefs.map((ref) => `
        <a class="tag" href="${escapeHtml(refRoute(ref, routeById))}">${escapeHtml(refTitle(ref, byId, locale))}</a>
      `).join("")}
    </div>`;
};

const renderSourceList = (sources: SourceRef[] = []): string => {
  if (!sources.length) return `<p class="card__copy">No external sources declared for this article.</p>`;

  return `
    <ol class="article-mini-list">
      ${sources.slice(0, 5).map((source) => {
        const meta = [source.author, source.publisher, source.publishedAt].filter(Boolean).join(" / ");
        const title = escapeHtml(source.title);
        return `
          <li>
            ${source.url
              ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${title}</a>`
              : `<strong>${title}</strong>`}
            ${meta ? `<span>${escapeHtml(meta)}</span>` : ""}
          </li>`;
      }).join("")}
    </ol>`;
};

const renderClaimList = (claims: string[] = [], fallback: string): string => {
  const items = claims.length ? claims : [fallback];
  return `
    <ol class="article-mini-list article-mini-list--claims">
      ${items.slice(0, 4).map((claim) => `<li><strong>${escapeHtml(claim)}</strong></li>`).join("")}
    </ol>`;
};

const renderArticleToc = (entity: PublicationEntity): string => {
  if (!entity.headingItems.length) return "";

  return `
    <nav class="article-toc" aria-label="Article contents">
      ${entity.headingItems.map((heading, index) => `
        <a class="article-toc__item article-toc__item--level-${heading.level}" href="#${escapeHtml(heading.id)}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(heading.title)}</strong>
        </a>`).join("")}
    </nav>`;
};

const renderArticleHero = (
  entity: PublicationEntity,
  relationCount: number,
  minutes: number,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const published = entity.version.publishedAt || entity.version.createdAt;
  const heroTags = [
    labelFrom(entity.format),
    entity.status,
    entity.maturity,
    entity.confidence,
    ...(entity.tags || []),
  ].slice(0, 8);

  return `
    <section class="zone-card hero article-hero">
      <div class="article-hero__copy">
        <p class="eyebrow">${escapeHtml(labelFrom(entity.format))}</p>
        <h1 class="display-title">${escapeHtml(entity.title)}</h1>
        ${entity.subtitle ? `<p class="card__meta">${escapeHtml(entity.subtitle)}</p>` : ""}
        <p class="lede">${escapeHtml(entity.abstract)}</p>
        ${renderChipCloud(heroTags)}
      </div>
      <aside class="article-hero__dashboard" aria-label="Article summary">
        <div class="article-hero__dashboard-head">
          <p class="card__meta">Article</p>
          <strong>${escapeHtml(entity.version.version)}</strong>
        </div>
        <div class="article-stat-grid">
          <span>
            <strong>${escapeHtml(String(minutes))} min</strong>
            <em>Reading</em>
          </span>
          <span>
            <strong>${escapeHtml(String(entity.headingItems.length))}</strong>
            <em>Sections</em>
          </span>
          <span>
            <strong>${escapeHtml(String(relationCount))}</strong>
            <em>Related</em>
          </span>
          <span>
            <strong>${escapeHtml(published)}</strong>
            <em>Published</em>
          </span>
        </div>
        <div class="article-hero__subjects">
          <p class="card__meta">Primary subjects</p>
          ${renderLinkedRefs(entity.subjects.slice(0, 5), byId, routeById, entity.locale)}
        </div>
      </aside>
    </section>`;
};

const renderArticleRail = (
  entity: PublicationEntity,
  minutes: number,
): string => `
  <aside class="article-rail" aria-label="Article side rail">
    <section class="panel article-rail-card">
      <div class="section-head">
        <p class="card__meta">Contents</p>
        <h2 class="card__title">In this article</h2>
      </div>
      ${renderArticleToc(entity)}
    </section>
    <section class="panel article-rail-card article-rail-card--compact">
      <div class="article-rail-facts">
        <span><strong>${escapeHtml(labelFrom(entity.format))}</strong><em>Format</em></span>
        <span><strong>${escapeHtml(String(minutes))} min</strong><em>Reading</em></span>
        <span><strong>${escapeHtml(entity.version.modifiedAt)}</strong><em>Updated</em></span>
      </div>
    </section>
    ${entity.disciplines?.length ? `
      <section class="panel article-rail-card article-rail-card--compact">
        <p class="card__meta">Disciplines</p>
        ${renderChipCloud(entity.disciplines, "tag-cluster tag-cluster--compact")}
      </section>` : ""}
  </aside>`;

const renderArticleContext = (
  entity: PublicationEntity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => `
  <section class="article-context-grid" aria-label="Article context">
    <article class="panel article-context-card article-context-card--lead">
      <div class="section-head">
        <p class="card__meta">Argument</p>
        <h2 class="card__title">Main arguments</h2>
      </div>
      ${renderClaimList(entity.claims, entity.abstract)}
    </article>
    <article class="panel article-context-card">
      <div class="section-head">
        <p class="card__meta">Related context</p>
        <h2 class="card__title">Related evidence</h2>
      </div>
      ${renderLinkedRefs(entity.evidence || entity.subjects, byId, routeById, entity.locale)}
    </article>
    <article class="panel article-context-card">
      <div class="section-head">
        <p class="card__meta">Sources</p>
        <h2 class="card__title">References</h2>
      </div>
      ${renderSourceList(entity.sources)}
    </article>
  </section>`;

export const renderPublicationPage = (
  entity: PublicationEntity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const relationCount = publicRelationsForEntity(entity, relations, publicEntityIds(byId.values())).length;
  const minutes = readingMinutes(entity);

  return `
    <div class="article-page">
      <section class="zone-card entity-breadcrumb-card">${renderBreadcrumbs(entity)}</section>
      ${renderArticleHero(entity, relationCount, minutes, byId, routeById)}
      <section class="article-layout">
        ${renderArticleRail(entity, minutes)}
        <article class="zone-card hero publication-body article-body">
          <div class="article-body__frame">
            ${entity.bodyHtml}
          </div>
        </article>
      </section>
      ${renderArticleContext(entity, byId, routeById)}
      <section class="detail-grid article-detail-grid">
        ${renderEntityMetadata(entity)}
        ${renderCitationPanel(entity, `${site.origin}${routeForEntity(entity)}`)}
      </section>
      ${renderRelationshipGroups(entity, relations, byId, routeById)}
      <section class="zone-card hero article-local-graph">${renderLocalGraph(entity, relations, byId)}</section>
    </div>`;
};
