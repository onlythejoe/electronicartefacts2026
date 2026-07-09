import { escapeHtml } from "../html.js";
import type { Entity } from "../../schema/entities.js";

const sectionLabel = (entity: Entity): string => {
  if (["concept", "technology", "method", "framework"].includes(entity.type)) return "Knowledge";
  if (entity.type === "researchField" || entity.type === "researchQuestion") return "Research";
  if (entity.type === "publication") return "Publications";
  if (entity.type === "project") return "Projects";
  if (entity.type === "program") return "Programs";
  if (entity.type === "organization") return "Organizations";
  return "Archive";
};

export const renderBreadcrumbs = (entity: Entity): string => `
  <nav class="link-row entity-breadcrumbs" aria-label="Breadcrumb">
    <a class="tag" href="/">Home</a>
    <span aria-hidden="true">/</span>
    <span class="tag">${escapeHtml(sectionLabel(entity))}</span>
    <span aria-hidden="true">/</span>
    <span aria-current="page">${escapeHtml(entity.title)}</span>
  </nav>`;
