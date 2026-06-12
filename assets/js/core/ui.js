(function () {
  const esc = window.EA_UTILS?.esc || ((value) => String(value ?? ""));
  const getCatalog = () => window.EA_CATALOG || {};

  const statusMeta = (key) => {
    const catalog = getCatalog();
    return catalog.statuses ? catalog.statuses[key] : null;
  };

  const statusBadge = (key, label) => {
    const meta = statusMeta(key) || {};
    const text = label || meta.label || key;
    return `<span class="status-badge ${esc(meta.className || "")}">${esc(meta.icon || "◌")} ${esc(text)}</span>`;
  };

  const entityBadge = (key) => {
    const catalog = getCatalog();
    return `<span class="entity-badge entity-badge--${esc(key)}">${esc(catalog.entityTypes?.[key] || key)}</span>`;
  };

  const taxonomyTone = (value) => {
    const text = String(value || "").toLowerCase();
    if (text.includes("music") || text.includes("audio") || text.includes("oreth") || text.includes("palimpsests")) return "sound";
    if (text.includes("technology") || text.includes("software") || text.includes("runtime") || text.includes("system") || text.includes("vaste")) return "system";
    if (text.includes("research") || text.includes("void") || text.includes("theory") || text.includes("entropy") || text.includes("emergence")) return "research";
    if (text.includes("visual") || text.includes("photography") || text.includes("image") || text.includes("creative")) return "visual";
    if (text.includes("archive") || text.includes("document") || text.includes("memory")) return "archive";
    if (text.includes("narrative") || text.includes("myth") || text.includes("vestiges")) return "narrative";
    if (text.includes("client") || text.includes("external") || text.includes("communication")) return "surface";
    if (text.includes("active") || text.includes("public") || text.includes("released")) return "live";
    if (text.includes("prototype") || text.includes("experimental") || text.includes("development")) return "process";
    return "neutral";
  };

  const chip = (text, extraClass = "") =>
    `<span class="chip taxonomy-pill taxonomy-pill--${esc(taxonomyTone(text))} ${esc(extraClass)}" data-taxonomy-tone="${esc(taxonomyTone(text))}" tabindex="0" role="button" aria-pressed="false">${esc(text)}</span>`;

  const tagRow = (items, options = {}) => {
    if (!items || !items.length) return "";
    const limit = Number.isFinite(options.limit) ? Math.max(0, options.limit) : items.length;
    const compact = options.compact !== false;
    const visible = items.slice(0, limit);
    const overflow = Math.max(0, items.length - visible.length);
    return `<div class="tag-cluster${compact ? " tag-cluster--compact" : ""}">${visible.map((item) => chip(item)).join("")}${overflow ? `<span class="chip chip--overflow" aria-hidden="true">+${overflow}</span>` : ""}</div>`;
  };

  const relationList = (relations) => {
    if (!relations || !relations.length) return "";
    return `
      <ul class="relation-list">
        ${relations
          .map(
            (relation) => `
              <li class="relation-item">
                <span class="relation-item__label">${esc(relation.tag || "Related To")}</span>
                <strong>${esc(relation.title)}</strong>
              </li>
            `,
          )
          .join("")}
      </ul>
    `;
  };

  const metadataList = (pairs) => {
    const validPairs = pairs.filter((pair) => pair && pair.value);
    if (!validPairs.length) return "";
    return `
      <dl class="metadata-panel">
        ${validPairs
          .map(
            (pair) => `
              <div class="metadata-row">
                <dt>${esc(pair.label)}</dt>
                <dd>${esc(pair.value)}</dd>
              </div>
            `,
          )
          .join("")}
      </dl>
    `;
  };

  const linkRow = (primary, related = []) => {
    const links = [];
    if (primary) {
      links.push(`<a class="tag" href="${esc(primary.href)}"${primary.target ? ` target="${esc(primary.target)}"` : ""}${primary.target ? ' rel="noreferrer"' : ""}>${esc(primary.label)}</a>`);
    }
    related.forEach((item) => {
      links.push(
        `<a class="tag" href="${esc(item.href)}"${item.target ? ` target="${esc(item.target)}"` : ""}${item.target ? ' rel="noreferrer"' : ""}>${esc(item.label)}</a>`,
      );
    });
    return `<div class="link-row">${links.join("")}</div>`;
  };

  const metricRail = (items, options = {}) => {
    if (!items || !items.length) return "";
    const limit = Number.isFinite(options.limit) ? Math.max(0, options.limit) : items.length;
    const compact = options.compact !== false;
    const visible = items.slice(0, limit);
    return `
      <div class="metric-rail${compact ? " metric-rail--compact" : ""}">
        ${visible
          .map((item, index) => {
            const fill = Number.isFinite(item.fill) ? Math.max(0.1, Math.min(1, item.fill)) : 0.62;
            return `
              <div class="metric-pill metric-pill--${esc(item.tone || "neutral")}" style="--metric-fill:${fill};--metric-index:${index};">
                <span>${esc(item.label || "")}</span>
                <strong>${esc(item.value || "")}</strong>
                ${item.note ? `<em>${esc(item.note)}</em>` : ""}
                <i aria-hidden="true"></i>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  };

  const cardLinkAttrs = (href, label) =>
    href
      ? `
      data-card-link="${esc(href)}"
      tabindex="0"
      role="link"
      aria-label="${esc(label || "Open card")}"
    `
      : "";

  const cardOverlayLink = (href, label) =>
    href ? `<a class="project-card__overlay-link" href="${esc(href)}" aria-label="${esc(label || "Open card")}"></a>` : "";

  window.EA_UI = {
    statusMeta,
    statusBadge,
    entityBadge,
    chip,
    tagRow,
    relationList,
    metadataList,
    linkRow,
    metricRail,
    cardLinkAttrs,
    cardOverlayLink,
    taxonomyTone,
  };
})();
