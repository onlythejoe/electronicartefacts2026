(function () {
  performance.mark?.("ea:graph-runtime-start");
  const catalog = window.EA_GRAPH_CATALOG || { entities: [], relations: [] };
  const isFrench = document.documentElement.lang === "fr" || location.pathname.startsWith("/fr/");
  const locale = isFrench ? "fr" : "en";
  const translations = window.EA_EDITORIAL_TRANSLATIONS || {};
  const translate = (value) => isFrench ? translations[value] || value : value;
  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const typeName = (value) => String(value || "related")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .toLowerCase();
  const frenchTypeLabels = {
    artefact: "artefact", collection: "collection", concept: "concept", framework: "cadre",
    organization: "organisation", program: "programme", project: "projet", publication: "publication",
    researchField: "domaine de recherche", researchQuestion: "question de recherche", technology: "technologie",
  };
  const typeLabel = (value) => isFrench ? frenchTypeLabels[value] || translate(typeName(value)) : typeName(value);
  const colors = {
    project: "rgba(245, 158, 11, 0.94)",
    program: "rgba(96, 165, 250, 0.95)",
    framework: "rgba(228, 213, 196, 0.94)",
    tool: "rgba(52, 211, 153, 0.92)",
    concept: "rgba(167, 139, 250, 0.92)",
    technology: "rgba(45, 212, 191, 0.92)",
    publication: "rgba(247, 244, 239, 0.88)",
    collection: "rgba(148, 163, 184, 0.9)",
  };
  const fallbackColors = ["rgba(234, 220, 207, 0.9)", "rgba(125, 211, 252, 0.9)", "rgba(52, 211, 153, 0.88)"];
  const nodeColor = (type, index) => colors[type] || fallbackColors[index % fallbackColors.length];

  const records = (catalog.entities || []).filter((record) => record.locale === locale && record.visibility === "public");
  const visibleIds = new Set(records.map((record) => record.id));
  const localizedIds = new Map(records.filter((record) => record.translationOf).map((record) => [record.translationOf, record.id]));
  const localIdFor = (id) => visibleIds.has(id) ? id : localizedIds.get(id) || id;
  const relations = (catalog.relations || [])
    .map((relation) => ({ subject: localIdFor(relation.subject), object: localIdFor(relation.object) }))
    .filter((relation) => visibleIds.has(relation.subject) && visibleIds.has(relation.object));
  const types = [...new Set(records.map((record) => record.type))].sort();
  const typeIndex = new Map(types.map((type, index) => [type, index]));
  const recordsByType = new Map(types.map((type) => [type, records.filter((record) => record.type === type)]));
  const positions = new Map(records.map((record) => {
    const group = typeIndex.get(record.type) || 0;
    const siblings = recordsByType.get(record.type) || [];
    const positionInGroup = siblings.indexOf(record);
    const angle = (positionInGroup / Math.max(siblings.length, 1)) * Math.PI * 2 - Math.PI / 2 + group * 0.14;
    const radius = 17 + (group % 4) * 6.5 + Math.floor(group / 4) * 1.5;
    return [record.id, { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius }];
  }));

  const edgeMarkup = relations.map((relation) => {
    const from = positions.get(relation.subject);
    const to = positions.get(relation.object);
    if (!from || !to) return "";
    return `<line data-global-graph-edge data-global-graph-from="${esc(relation.subject)}" data-global-graph-to="${esc(relation.object)}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`;
  }).join("");
  const nodeMarkup = records.map((record) => {
    const position = positions.get(record.id);
    const label = `${record.title} — ${typeLabel(record.type)}`;
    return `<a class="global-graph__node" data-global-graph-node data-global-graph-id="${esc(record.id)}" data-global-graph-x="${position.x}" data-global-graph-y="${position.y}" data-global-graph-type="${esc(record.type)}" data-global-graph-title="${esc(record.title)}" data-global-graph-summary="${esc(record.summary || "")}" data-global-graph-route="${esc(record.route || "")}" href="${esc(record.route || "#")}" style="--node-color:${esc(nodeColor(record.type, typeIndex.get(record.type) || 0))}" aria-label="${esc(label)}"><title>${esc(label)}</title><circle cx="${position.x}" cy="${position.y}" r="1.22" /></a>`;
  }).join("");

  const graphTarget = document.querySelector('[data-render="global-graph"]');
  if (graphTarget) {
    graphTarget.innerHTML = `
      <section class="zone-card hero global-graph" data-global-graph>
        <div class="section-head global-graph__head">
          <p class="eyebrow">${esc(translate("KNOWLEDGE GRAPH"))}</p>
          <h2>${esc(translate("The public Electronic Artefacts graph."))}</h2>
          <p class="lede">${esc(translate("Browse the public records and the relations that connect research, systems, projects, publications and archive material. Select a family to focus the map; each point opens its canonical record."))}</p>
        </div>
        <div class="global-graph__summary" aria-label="${esc(translate("Graph summary"))}">
          <span><strong>${records.length}</strong> ${esc(translate("public records"))}</span>
          <span><strong>${relations.length}</strong> ${esc(translate("relations"))}</span>
          <span><strong>${types.length}</strong> ${esc(translate("record families"))}</span>
        </div>
        <div class="global-graph__filters" role="group" aria-label="${esc(translate("Filter graph"))}">
          <button type="button" class="tag is-active" data-global-graph-filter="all" aria-pressed="true">${esc(translate("All records"))}</button>
          ${types.map((type) => `<button type="button" class="tag" data-global-graph-filter="${esc(type)}" aria-pressed="false"><i style="--node-color:${esc(nodeColor(type, typeIndex.get(type) || 0))}"></i>${esc(typeLabel(type))}</button>`).join("")}
        </div>
        <div class="global-graph__workspace">
          <div class="global-graph__canvas-wrap" data-global-graph-stage tabindex="0">
            <div class="global-graph__controls" aria-label="${esc(translate("Graph controls"))}">
              <button type="button" class="tag" data-global-graph-zoom="in" aria-label="${esc(translate("Zoom in"))}">+</button>
              <button type="button" class="tag" data-global-graph-zoom="out" aria-label="${esc(translate("Zoom out"))}">−</button>
              <button type="button" class="tag" data-global-graph-zoom="reset">${esc(translate("Reset view"))}</button>
            </div>
            <svg class="global-graph__canvas" viewBox="0 0 100 100" role="img" aria-label="${esc(translate("Interactive global graph of public Electronic Artefacts records"))}">
              <g class="global-graph__viewport" data-global-graph-viewport><g class="global-graph__edges">${edgeMarkup}</g><g class="global-graph__nodes">${nodeMarkup}</g></g>
            </svg>
          </div>
          <aside class="global-graph__inspector" data-global-graph-inspector aria-live="polite">
            <p class="card__meta" data-global-graph-inspector-kind>${esc(translate("Graph inspector"))}</p>
            <h3 data-global-graph-inspector-title>${esc(translate("Choose a point"))}</h3>
            <p data-global-graph-inspector-copy>${esc(translate("Select a point to reveal its immediate relations and a short description."))}</p>
            <p class="global-graph__inspector-count" data-global-graph-inspector-count></p>
            <a class="tag" data-global-graph-inspector-link hidden>${esc(translate("Open record"))} <span aria-hidden="true">→</span></a>
            <button type="button" class="global-graph__clear" data-global-graph-clear hidden>${esc(translate("Clear selection"))}</button>
          </aside>
        </div>
        <p class="global-graph__hint">${esc(translate("Drag a point to reorganize the map, or select it to inspect its direct relations. Use the family filters to reduce the field, or zoom only when detail is useful."))}</p>
      </section>`;
  }

  const routeCard = ({ kicker, title, copy, reason, cta, href }) => `
    <article class="panel panel--soft card-link-surface" data-card-link="${esc(href)}">
      <p class="card__meta">${esc(translate(kicker))}</p><h3 class="card__title">${esc(translate(title))}</h3>
      <p class="card__copy">${esc(translate(copy))}</p><p class="card__copy">${esc(translate(reason))}</p>
      <div class="link-row"><a class="tag" href="${esc(href)}">${esc(translate(cta))}</a></div>
    </article>`;
  const crossTarget = document.querySelector('[data-render="cross-navigation"]');
  if (crossTarget) crossTarget.innerHTML = `
    <section class="zone-card hero"><div class="section-head"><p class="eyebrow">${esc(translate("CONTINUE EXPLORING"))}</p>
      <h2>${esc(translate("A site held together by clear paths."))}</h2>
      <p class="lede">${esc(translate("Pages stay linked through the same frame: work, research, archive, contact and the external systems around them."))}</p></div>
      <div class="card-grid card-grid--two">${(isFrench ? [
        ["Socle", "Expertise", "Projets, musique et technologie.", "La couche studio et ses réalisations.", "Retour à l’expertise", "/work.html"],
        ["Socle", "Projets", "Réalisations publiques et dossiers détaillés.", "La constellation publique des projets.", "Parcourir les projets", "/projects.html"],
        ["Socle", "Programmes", "Tous les programmes logiciels visibles.", "La couche des runtimes et des systèmes.", "Voir les programmes", "/programs.html"],
        ["Socle", "Recherche", "Programmes, domaines et notes.", "La couche conceptuelle et expérimentale.", "Explorer la recherche", "/research.html"],
      ] : [
        ["Core", "Work", "Projects, music and technology.", "The studio layer and applied outcomes.", "Return to Work", "/work.html"],
        ["Core", "Projects", "Public works and extended dossiers.", "The public project constellation.", "Browse Projects", "/projects.html"],
        ["Core", "Programs", "All visible software programs.", "The runtime and systems layer.", "View Programs", "/programs.html"],
        ["Core", "Research", "Program, fields and notes.", "The conceptual and experimental layer.", "Explore Research", "/research.html"],
      ]).map(([kicker, title, copy, reason, cta, href]) => routeCard({ kicker, title, copy, reason, cta, href })).join("")}</div>
    </section>`;

  const graph = document.querySelector("[data-global-graph]");
  if (!graph) return;
  const buttons = [...graph.querySelectorAll("[data-global-graph-filter]")];
  const nodes = [...graph.querySelectorAll("[data-global-graph-node]")];
  const edges = [...graph.querySelectorAll("[data-global-graph-edge]")];
  const edgesByNode = new Map();
  edges.forEach((edge) => [edge.dataset.globalGraphFrom, edge.dataset.globalGraphTo].forEach((id) => {
    if (!edgesByNode.has(id)) edgesByNode.set(id, []);
    edgesByNode.get(id).push(edge);
  }));
  const stage = graph.querySelector("[data-global-graph-stage]");
  const viewport = graph.querySelector("[data-global-graph-viewport]");
  const inspectorKind = graph.querySelector("[data-global-graph-inspector-kind]");
  const inspectorTitle = graph.querySelector("[data-global-graph-inspector-title]");
  const inspectorCopy = graph.querySelector("[data-global-graph-inspector-copy]");
  const inspectorCount = graph.querySelector("[data-global-graph-inspector-count]");
  const inspectorLink = graph.querySelector("[data-global-graph-inspector-link]");
  const clearButton = graph.querySelector("[data-global-graph-clear]");
  const compactQuery = matchMedia("(max-width: 48rem)");
  let activeType = "all";
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let stageDrag = null;
  let nodeDrag = null;
  let nodeFrame = 0;
  let viewportFrame = 0;
  const applyIdleEdgeDensity = () => edges.forEach((edge, index) => edge.classList.toggle(
    "is-idle-suppressed",
    compactQuery.matches && !edge.classList.contains("is-selected") && index % 3 !== 0,
  ));
  const resetInspector = () => {
    nodes.forEach((node) => node.classList.remove("is-selected", "is-neighbor"));
    edges.forEach((edge) => edge.classList.remove("is-selected", "is-neighbor"));
    applyIdleEdgeDensity();
    inspectorKind.textContent = translate("Graph inspector");
    inspectorTitle.textContent = translate("Choose a point");
    inspectorCopy.textContent = translate("Select a point to reveal its immediate relations and a short description.");
    inspectorCount.textContent = "";
    inspectorLink.hidden = true;
    clearButton.hidden = true;
  };
  const selectNode = (node) => {
    const id = node.dataset.globalGraphId;
    const relatedIds = new Set([id]);
    const directEdges = edgesByNode.get(id) || [];
    const directEdgeSet = new Set(directEdges);
    directEdges.forEach((edge) => {
      if (edge.dataset.globalGraphFrom === id) relatedIds.add(edge.dataset.globalGraphTo);
      if (edge.dataset.globalGraphTo === id) relatedIds.add(edge.dataset.globalGraphFrom);
    });
    nodes.forEach((item) => {
      item.classList.toggle("is-selected", item.dataset.globalGraphId === id);
      item.classList.toggle("is-neighbor", item.dataset.globalGraphId !== id && relatedIds.has(item.dataset.globalGraphId));
      item.classList.toggle("is-muted", !relatedIds.has(item.dataset.globalGraphId));
    });
    edges.forEach((edge) => {
      const direct = directEdgeSet.has(edge);
      edge.classList.toggle("is-selected", direct);
      edge.classList.toggle("is-muted", !direct);
    });
    applyIdleEdgeDensity();
    inspectorKind.textContent = typeLabel(node.dataset.globalGraphType);
    inspectorTitle.textContent = node.dataset.globalGraphTitle || "";
    inspectorCopy.textContent = node.dataset.globalGraphSummary || translate("No public summary is available for this record.");
    inspectorCount.textContent = `${Math.max(relatedIds.size - 1, 0)} ${translate("direct relations")}`;
    inspectorLink.href = node.dataset.globalGraphRoute || node.getAttribute("href") || "#";
    inspectorLink.hidden = false;
    clearButton.hidden = false;
  };
  const applyViewport = () => {
    viewport?.style.setProperty("--global-graph-scale", String(scale));
    viewport?.style.setProperty("--global-graph-pan-x", `${panX}px`);
    viewport?.style.setProperty("--global-graph-pan-y", `${panY}px`);
  };
  const scheduleViewport = () => {
    if (viewportFrame) return;
    viewportFrame = requestAnimationFrame(() => { viewportFrame = 0; applyViewport(); });
  };
  const clampPan = (rect = stage?.getBoundingClientRect()) => {
    const limitX = Math.max(0, (rect?.width || 0) * (scale - 1) * 0.48 + 42);
    const limitY = Math.max(0, (rect?.height || 0) * (scale - 1) * 0.48 + 42);
    panX = Math.max(-limitX, Math.min(limitX, panX));
    panY = Math.max(-limitY, Math.min(limitY, panY));
  };
  const stagePoint = (event, rect = stage?.getBoundingClientRect()) => rect ? {
    x: Math.max(2, Math.min(98, ((event.clientX - rect.left) / rect.width) * 100)),
    y: Math.max(2, Math.min(98, ((event.clientY - rect.top) / rect.height) * 100)),
  } : null;
  const renderNodePosition = (node) => {
    const x = Number(node.dataset.globalGraphX);
    const y = Number(node.dataset.globalGraphY);
    node.querySelector("circle")?.setAttribute("cx", String(x));
    node.querySelector("circle")?.setAttribute("cy", String(y));
    (edgesByNode.get(node.dataset.globalGraphId) || []).forEach((edge) => {
      if (edge.dataset.globalGraphFrom === node.dataset.globalGraphId) { edge.setAttribute("x1", String(x)); edge.setAttribute("y1", String(y)); }
      if (edge.dataset.globalGraphTo === node.dataset.globalGraphId) { edge.setAttribute("x2", String(x)); edge.setAttribute("y2", String(y)); }
    });
  };
  const selectType = (type) => {
    buttons.forEach((button) => {
      const active = button.dataset.globalGraphFilter === type;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    activeType = type;
    const visible = new Set(nodes.filter((node) => type === "all" || node.dataset.globalGraphType === type).map((node) => node.dataset.globalGraphId));
    nodes.forEach((node) => node.classList.toggle("is-muted", type !== "all" && node.dataset.globalGraphType !== type));
    edges.forEach((edge) => edge.classList.toggle("is-muted", type !== "all" && (!visible.has(edge.dataset.globalGraphFrom) || !visible.has(edge.dataset.globalGraphTo))));
    graph.dataset.activeGraphFilter = type;
    resetInspector();
  };
  buttons.forEach((button) => button.addEventListener("click", () => selectType(button.dataset.globalGraphFilter || "all")));
  nodes.forEach((node) => {
    node.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch" && !event.isPrimary) return;
      const point = stagePoint(event);
      if (!point) return;
      event.stopPropagation();
      nodeDrag = { node, pointerId: event.pointerId, rect: stage?.getBoundingClientRect(), startX: point.x, startY: point.y, moved: false };
      node.setPointerCapture?.(event.pointerId);
      node.classList.add("is-dragging");
    });
    node.addEventListener("pointermove", (event) => {
      if (!nodeDrag || nodeDrag.node !== node || event.pointerId !== nodeDrag.pointerId) return;
      const point = stagePoint(event, nodeDrag.rect);
      if (!point) return;
      nodeDrag.moved ||= Math.abs(point.x - nodeDrag.startX) > 0.35 || Math.abs(point.y - nodeDrag.startY) > 0.35;
      node.dataset.globalGraphX = String(point.x);
      node.dataset.globalGraphY = String(point.y);
      if (!nodeFrame) nodeFrame = requestAnimationFrame(() => { nodeFrame = 0; renderNodePosition(node); });
    });
    const stopNodeDrag = (event) => {
      if (!nodeDrag || nodeDrag.node !== node || event.pointerId !== nodeDrag.pointerId) return;
      node.releasePointerCapture?.(event.pointerId);
      node.classList.remove("is-dragging");
      if (nodeDrag.moved) node.dataset.suppressGraphClick = "true";
      nodeDrag = null;
    };
    node.addEventListener("pointerup", stopNodeDrag);
    node.addEventListener("pointercancel", stopNodeDrag);
    node.addEventListener("click", (event) => {
      if (node.dataset.suppressGraphClick === "true") { node.dataset.suppressGraphClick = "false"; event.preventDefault(); return; }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      selectNode(node);
    });
    node.addEventListener("focus", () => selectNode(node));
  });
  clearButton.addEventListener("click", () => selectType(activeType));
  graph.querySelectorAll("[data-global-graph-zoom]").forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.globalGraphZoom;
    scale = action === "in" ? Math.min(1.45, scale + 0.15) : action === "out" ? Math.max(0.78, scale - 0.15) : 1;
    if (action === "reset") { panX = 0; panY = 0; }
    clampPan(); applyViewport();
  }));
  stage?.addEventListener("keydown", (event) => {
    if (!['+', '-'].includes(event.key)) return;
    event.preventDefault();
    scale = event.key === "+" ? Math.min(1.45, scale + 0.15) : Math.max(0.78, scale - 0.15);
    clampPan(); applyViewport();
  });
  stage?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" && !event.isPrimary) return;
    if (event.target.closest?.("[data-global-graph-node], [data-global-graph-zoom]")) return;
    stageDrag = { pointerId: event.pointerId, rect: stage.getBoundingClientRect(), startX: event.clientX, startY: event.clientY, panX, panY };
    stage.setPointerCapture?.(event.pointerId);
    stage.classList.add("is-panning");
  });
  stage?.addEventListener("pointermove", (event) => {
    if (!stageDrag || event.pointerId !== stageDrag.pointerId) return;
    const deltaX = event.clientX - stageDrag.startX;
    const deltaY = event.clientY - stageDrag.startY;
    if (event.pointerType === "touch" && Math.abs(deltaY) > Math.abs(deltaX)) return;
    panX = stageDrag.panX + deltaX; panY = stageDrag.panY + deltaY;
    clampPan(stageDrag.rect); scheduleViewport();
  });
  const stopPanning = (event) => {
    if (!stageDrag || event.pointerId !== stageDrag.pointerId) return;
    stage?.releasePointerCapture?.(event.pointerId);
    stage?.classList.remove("is-panning");
    stageDrag = null;
  };
  stage?.addEventListener("pointerup", stopPanning);
  stage?.addEventListener("pointercancel", stopPanning);
  stage?.addEventListener("wheel", (event) => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) scale = Math.max(0.78, Math.min(1.45, scale - event.deltaY * 0.0015));
    else { panX -= event.deltaX || event.deltaY * 0.45; panY -= event.deltaY; }
    clampPan(); scheduleViewport();
  }, { passive: false });
  if (compactQuery.addEventListener) compactQuery.addEventListener("change", applyIdleEdgeDensity);
  else compactQuery.addListener(applyIdleEdgeDensity);
  resetInspector();
  performance.mark?.("ea:graph-interactive");
  try { performance.measure?.("ea:graph-start-to-interactive", "ea:graph-runtime-start", "ea:graph-interactive"); } catch {}
})();
