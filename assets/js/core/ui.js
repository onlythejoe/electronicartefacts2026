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

  const chip = (text, extraClass = "") =>
    `<span class="chip ${esc(extraClass)}">${esc(text)}</span>`;

  const tagRow = (items) => {
    if (!items || !items.length) return "";
    return `<div class="tag-cluster">${items.map((item) => chip(item)).join("")}</div>`;
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
    cardLinkAttrs,
    cardOverlayLink,
  };
})();
