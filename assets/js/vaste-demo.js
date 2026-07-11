const palettes = {
  vertex: "#7dd3fc",
  action: "#a78bfa",
  surface: "#2dd4bf",
  environment: "#f472b6",
  system: "#e2e8f0",
};

const copy = {
  en: {
    observable: "OBSERVABLE",
    selected: (name) => `${name} selected`,
    added: "Vertex added",
    linkStart: "Select a second Vertex",
    linked: "Tie created",
    duplicate: "These Vertices are already tied",
    linkCancelled: "Connect mode cancelled",
    linkPrompt: "Select two Vertices to connect",
    tiesVisible: "Ties visible",
    tiesHidden: "Ties hidden",
    reset: "Projection reset",
    nested: (child, parent) => `${child} nested inside ${parent}`,
    detached: (child) => `${child} detached`,
    alreadyRoot: "This Vertex is already at the root",
    root: "ROOT",
    dragHint: "Drag a nucleus into a membrane to nest it",
    linkHint: "Select two Vertices to create a Tie",
  },
  fr: {
    observable: "OBSERVABLE",
    selected: (name) => `${name} sélectionné`,
    added: "Vertex ajouté",
    linkStart: "Sélectionnez un second Vertex",
    linked: "Tie créée",
    duplicate: "Ces Vertex sont déjà reliés",
    linkCancelled: "Mode connexion annulé",
    linkPrompt: "Sélectionnez deux Vertex à relier",
    tiesVisible: "Liens visibles",
    tiesHidden: "Liens masqués",
    reset: "Projection réinitialisée",
    nested: (child, parent) => `${child} imbriqué dans ${parent}`,
    detached: (child) => `${child} détaché`,
    alreadyRoot: "Ce Vertex est déjà à la racine",
    root: "RACINE",
    dragHint: "Glissez un noyau dans une membrane pour l’imbriquer",
    linkHint: "Sélectionnez deux Vertex pour créer une Tie",
  },
};

const sceneBlueprints = {
  runtime: {
    label: "RUNTIME / SYSTEM:EA",
    state: { en: "SYSTEM ACTIVE", fr: "SYSTÈME ACTIF" },
    nodes: [
      ["system:ea", "Electronic Artefacts", "system", 0.5, 0.5, 54, "Root partition and structural closure of this projection.", "Partition racine et clôture structurelle de cette projection."],
      ["actor:founder", "Founding Actor", "vertex", 0.455, 0.46, 25, "Situated identity whose authority is resolved from graph state.", "Identité située dont l’autorité est résolue depuis l’état du graphe."],
      ["action:publish", "Publish", "action", 0.78, 0.25, 27, "Declarative intent admitted through the runtime execution path.", "Intention déclarative admise par le chemin d’exécution du runtime."],
      ["surface:public", "Public Surface", "surface", 0.78, 0.72, 34, "Authorityless projection for observation and interaction.", "Projection sans autorité pour l’observation et l’interaction."],
      ["environment:local", "Local Environment", "environment", 0.22, 0.74, 31, "Ephemeral execution context: identity, location, policy and budgets.", "Contexte d’exécution éphémère : identité, position, policy et budgets."],
      ["vertex:record", "Knowledge Record", "vertex", 0.55, 0.54, 24, "Serializable graph state with stable identity and System membership.", "État de graphe sérialisable avec identité stable et appartenance au System."],
      ["vertex:field", "Metadata field", "vertex", 0.558, 0.535, 12, "A nested Vertex demonstrating that containment can recurse.", "Un Vertex imbriqué montrant que la contenance peut être récursive."],
    ],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [2, 3], [5, 6]],
    parents: [[0, 1], [0, 5], [5, 6]],
  },
  portable: {
    label: "PORTABILITY / VAST:1",
    state: { en: "PACKAGE SEALED", fr: "PACKAGE SCELLÉ" },
    nodes: [
      ["system:source", "Source System", "system", 0.2, 0.48, 44, "The original System-relative graph before export.", "Le graphe relatif au System avant export."],
      ["package:vast1", ".vast package", "action", 0.5, 0.48, 42, "Canonical structure, manifest, boundary references and package hash.", "Structure canonique, manifeste, références de frontière et hash du package."],
      ["system:target", "Rebound System", "system", 0.8, 0.48, 44, "Imported structure rebound to a different local System identity.", "Structure importée et rattachée à une nouvelle identité locale de System."],
      ["vertex:graph", "Portable graph", "vertex", 0.21, 0.48, 23, "Vertices and Ties preserved in a System-relative canonical form.", "Vertex et Ties conservés sous une forme canonique relative au System."],
      ["environment:authority", "Local authority", "environment", 0.66, 0.76, 29, "Credentials and effective authority are resolved again on arrival.", "Credentials et autorité effective sont résolus à nouveau à l’arrivée."],
      ["surface:inspection", "Inspection Surface", "surface", 0.51, 0.5, 25, "A projection for reviewing the package before local admission.", "Une projection pour inspecter le package avant admission locale."],
    ],
    links: [[0, 1], [1, 2], [0, 3], [3, 1], [1, 5], [5, 4], [4, 2]],
    parents: [[0, 3], [1, 5]],
  },
  boot: {
    label: "ASSISTED BOOT / PLAN",
    state: { en: "ASSENT REQUIRED", fr: "ASSENTIMENT REQUIS" },
    nodes: [
      ["vertex:intent", "Initial intent", "vertex", 0.14, 0.5, 29, "The purpose and constraints expressed at the beginning of boot.", "Le but et les contraintes exprimés au début du boot."],
      ["surface:dialogue", "Boot dialogue", "surface", 0.34, 0.27, 30, "Conversation Surface used to clarify intent and expose decisions.", "Surface de conversation qui clarifie l’intention et expose les décisions."],
      ["vertex:plan", "Sealed plan", "vertex", 0.52, 0.5, 39, "Declarative composition plan sealed by a hash before materialization.", "Plan de composition déclaratif scellé par un hash avant matérialisation."],
      ["action:assent", "Explicit assent", "action", 0.7, 0.25, 29, "An admitted confirmation bound to the exact proposed plan.", "Confirmation admise, liée exactement au plan proposé."],
      ["actor:founding", "Founding Actor", "vertex", 0.86, 0.51, 25, "The initial situated Actor admitted into the born graph.", "L’Actor situé initial admis dans le graphe né."],
      ["system:born", "Born System", "system", 0.87, 0.5, 43, "The governed starting graph materialized through runtime-owned paths.", "Le graphe initial gouverné, matérialisé par les chemins du runtime."],
    ],
    links: [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]],
    parents: [[5, 4]],
  },
};

const hexToRgb = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const initDemo = (root) => {
  if (root.dataset.demoReady === "true") return;
  root.dataset.demoReady = "true";

  const locale = root.dataset.locale === "fr" ? "fr" : "en";
  const t = copy[locale];
  const canvas = root.querySelector("[data-demo-canvas]");
  const shell = root.querySelector("[data-demo-canvas-shell]");
  const context = canvas?.getContext("2d");
  if (!canvas || !shell || !context) return;

  const elements = {
    frame: root.querySelector("[data-demo-frame]"),
    sceneLabel: root.querySelector("[data-demo-scene-label]"),
    chromeState: root.querySelector("[data-demo-chrome-state]"),
    hint: root.querySelector("[data-demo-hint]"),
    live: root.querySelector("[data-demo-live]"),
    type: root.querySelector("[data-demo-selection-type]"),
    title: root.querySelector("[data-demo-selection-title]"),
    detail: root.querySelector("[data-demo-selection-copy]"),
    id: root.querySelector("[data-demo-selection-id]"),
    state: root.querySelector("[data-demo-selection-state]"),
    links: root.querySelector("[data-demo-selection-links]"),
    parent: root.querySelector("[data-demo-selection-parent]"),
    children: root.querySelector("[data-demo-selection-children]"),
    linkButton: root.querySelector('[data-demo-action="link"]'),
    linksButton: root.querySelector('[data-demo-action="links"]'),
    detachButton: root.querySelector('[data-demo-action="detach"]'),
    linksLabel: root.querySelector("[data-demo-links-label]"),
  };

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const storageKey = "ea:vaste-graph-demo:v1";
  let width = 1;
  let height = 1;
  let ratio = 1;
  let activeScene = "runtime";
  let nodes = [];
  let ties = [];
  let selected = null;
  let dragged = null;
  let dropTarget = null;
  let dragOriginParent = null;
  let dragParentRadius = 0;
  let dragOffset = { x: 0, y: 0 };
  let linkingFrom = null;
  let showLinks = true;
  let frame = 0;
  let running = true;

  const announce = (message) => {
    if (!elements.live) return;
    elements.live.textContent = message;
    window.clearTimeout(announce.timeout);
    announce.timeout = window.setTimeout(() => { elements.live.textContent = ""; }, 2400);
  };

  const createNode = (raw, index) => ({
    id: raw[0],
    name: raw[1],
    type: raw[2],
    nx: raw[3],
    ny: raw[4],
    radius: raw[5],
    currentRadius: raw[5],
    targetRadius: raw[5],
    copy: { en: raw[6], fr: raw[7] },
    vx: 0,
    vy: 0,
    phase: index * 1.37,
    custom: false,
    parent: null,
    children: [],
    depth: 0,
  });

  const isDescendant = (candidate, ancestor) => {
    let current = candidate;
    while (current) {
      if (current === ancestor) return true;
      current = current.parent;
    }
    return false;
  };

  const detachChild = (node) => {
    if (!node?.parent) return null;
    const parent = node.parent;
    parent.children = parent.children.filter((child) => child !== node);
    node.parent = null;
    return parent;
  };

  const attachChild = (parent, child) => {
    if (!parent || !child || parent === child || isDescendant(parent, child)) return false;
    detachChild(child);
    child.parent = parent;
    parent.children.push(child);
    return true;
  };

  const readStorage = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "null") || {}; }
    catch { return {}; }
  };

  const save = () => {
    try {
      const positions = Object.fromEntries(nodes.map((node) => [node.id, [node.nx, node.ny]]));
      const parents = Object.fromEntries(nodes.map((node) => [node.id, node.parent?.id || null]));
      const custom = nodes.filter((node) => node.custom).map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        nx: node.nx,
        ny: node.ny,
        radius: node.radius,
        copy: node.copy,
      }));
      const savedTies = ties.map((tie) => [tie.a.id, tie.b.id]);
      const saved = readStorage();
      saved.scenes = saved.scenes || {};
      saved.scenes[activeScene] = { positions, parents, custom, ties: savedTies };
      localStorage.setItem(storageKey, JSON.stringify(saved));
    } catch { /* Local persistence is optional. */ }
  };

  const savedScene = (scene) => readStorage()?.scenes?.[scene] || {};

  const updateInspector = () => {
    const node = selected || nodes[0];
    if (!node) return;
    const count = ties.filter((tie) => tie.a === node || tie.b === node).length;
    elements.type.textContent = node.type === "system" ? "System" : node.type[0].toUpperCase() + node.type.slice(1);
    elements.title.textContent = node.name;
    elements.detail.textContent = node.copy[locale];
    elements.id.textContent = node.id;
    elements.state.textContent = t.observable;
    elements.links.textContent = String(count);
    elements.parent.textContent = node.parent?.name || t.root;
    elements.children.textContent = String(node.children.length);
    elements.detachButton.disabled = !node.parent;
  };

  const loadScene = (name, { reset = false } = {}) => {
    activeScene = name;
    const blueprint = sceneBlueprints[name];
    const saved = reset ? {} : savedScene(name);
    nodes = blueprint.nodes.map((raw, index) => {
      const node = createNode(raw, index);
      if (saved.positions?.[node.id]) [node.nx, node.ny] = saved.positions[node.id];
      return node;
    });
    (saved.custom || []).forEach((stored, index) => {
      nodes.push({
        ...stored,
        currentRadius: stored.radius,
        targetRadius: stored.radius,
        phase: (nodes.length + index) * 1.37,
        custom: true,
        parent: null,
        children: [],
        depth: 0,
      });
    });
    const byId = new Map(nodes.map((node) => [node.id, node]));
    (blueprint.parents || []).forEach(([parentIndex, childIndex]) => attachChild(nodes[parentIndex], nodes[childIndex]));
    Object.entries(saved.parents || {}).forEach(([childId, parentId]) => {
      const child = byId.get(childId);
      if (!child) return;
      if (!parentId) detachChild(child);
      else attachChild(byId.get(parentId), child);
    });
    const initialTies = blueprint.links.map(([a, b]) => [nodes[a].id, nodes[b].id]);
    ties = (saved.ties || initialTies)
      .map(([a, b]) => ({ a: byId.get(a), b: byId.get(b) }))
      .filter((tie) => tie.a && tie.b);
    selected = nodes[0];
    dragged = null;
    dropTarget = null;
    dragOriginParent = null;
    dragParentRadius = 0;
    linkingFrom = null;
    canvas.classList.remove("is-linking", "is-dragging");
    elements.linkButton?.classList.remove("is-active");
    elements.linkButton?.setAttribute("aria-pressed", "false");
    elements.hint.textContent = t.dragHint;
    elements.sceneLabel.textContent = blueprint.label;
    elements.chromeState.textContent = blueprint.state[locale];
    root.querySelectorAll("[data-demo-scene]").forEach((button) => {
      const active = button.dataset.demoScene === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    updateInspector();
    save();
  };

  const resize = () => {
    const rect = shell.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const position = (node) => ({ x: node.nx * width, y: node.ny * height });
  const radiusScale = () => Math.max(0.78, Math.min(1.12, width / 760));
  const visualRadius = (node) => node.currentRadius * radiusScale();

  const updateContainment = () => {
    const setDepth = (node, depth = 0) => {
      node.depth = depth;
      node.children.forEach((child) => setDepth(child, depth + 1));
    };
    nodes.filter((node) => !node.parent).forEach((node) => setDepth(node));

    [...nodes].sort((a, b) => b.depth - a.depth).forEach((node) => {
      let target = node.radius;
      if (node.children.length) {
        const center = position(node);
        const extent = Math.max(...node.children.map((child) => {
          const point = position(child);
          return Math.hypot(point.x - center.x, point.y - center.y) + visualRadius(child) + 16;
        }));
        target = Math.max(node.radius, Math.min(142, extent / radiusScale()));
      }
      node.targetRadius = target;
      node.currentRadius += (node.targetRadius - node.currentRadius) * (reducedMotion ? 1 : 0.11);
    });
  };

  const moveHierarchy = (node, dx, dy) => {
    node.nx += dx;
    node.ny += dy;
    node.children.forEach((child) => moveHierarchy(child, dx, dy));
  };

  const clampHierarchyToCanvas = (node) => {
    const point = position(node);
    const radius = visualRadius(node);
    const nextX = Math.max(radius, Math.min(width - radius, point.x));
    const nextY = Math.max(radius, Math.min(height - radius, point.y));
    moveHierarchy(node, (nextX - point.x) / width, (nextY - point.y) / height);
  };

  const containmentTargetAt = (x, y, excluded) => [...nodes]
    .filter((node) => node !== excluded && node !== excluded.parent && !isDescendant(node, excluded))
    .filter((node) => {
      const point = position(node);
      return Math.hypot(x - point.x, y - point.y) <= Math.max(14, visualRadius(node) - 7);
    })
    .sort((a, b) => b.depth - a.depth || visualRadius(a) - visualRadius(b))[0] || null;

  const drawGrid = () => {
    context.strokeStyle = "rgba(148, 163, 184, 0.045)";
    context.lineWidth = 1;
    const size = width < 560 ? 28 : 36;
    for (let x = 0.5; x < width; x += size) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
    }
    for (let y = 0.5; y < height; y += size) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
    }
  };

  const drawTie = (tie, time) => {
    const a = position(tie.a);
    const b = position(tie.b);
    const gradient = context.createLinearGradient(a.x, a.y, b.x, b.y);
    gradient.addColorStop(0, `${palettes[tie.a.type]}88`);
    gradient.addColorStop(0.5, "rgba(148, 163, 184, 0.28)");
    gradient.addColorStop(1, `${palettes[tie.b.type]}88`);
    context.strokeStyle = gradient;
    context.lineWidth = selected === tie.a || selected === tie.b ? 1.6 : 1;
    context.setLineDash([3, 7]);
    context.lineDashOffset = reducedMotion ? 0 : -time * 0.012;
    context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
    context.setLineDash([]);

    if (!reducedMotion) {
      const phase = ((time * 0.00013 + tie.a.phase * 0.11) % 1);
      const px = a.x + (b.x - a.x) * phase;
      const py = a.y + (b.y - a.y) * phase;
      context.fillStyle = palettes[tie.b.type];
      context.beginPath(); context.arc(px, py, 1.8, 0, Math.PI * 2); context.fill();
    }
  };

  const drawNode = (node, time) => {
    const { x, y } = position(node);
    const radius = visualRadius(node);
    const color = palettes[node.type] || palettes.vertex;
    const [r, g, b] = hexToRgb(color);
    const selectedNow = selected === node || linkingFrom === node;
    const contains = node.children.length > 0;
    const pulse = reducedMotion ? 0 : Math.sin(time * 0.0014 + node.phase) * 1.5;

    context.save();
    if (contains) {
      const field = context.createRadialGradient(x, y, radius * 0.08, x, y, radius);
      field.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.025)`);
      field.addColorStop(0.72, "rgba(255,255,255,0.018)");
      field.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.07)`);
      context.fillStyle = field;
      context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
    }
    context.shadowColor = `rgba(${r}, ${g}, ${b}, ${selectedNow || dropTarget === node ? 0.58 : 0.25})`;
    context.shadowBlur = selectedNow || dropTarget === node ? 28 : 14;
    context.fillStyle = `rgba(${r}, ${g}, ${b}, ${contains ? 0.025 : node.type === "system" ? 0.075 : 0.055})`;
    context.strokeStyle = dropTarget === node ? `rgba(${r}, ${g}, ${b}, 1)` : contains ? "rgba(255,255,255,0.54)" : `rgba(${r}, ${g}, ${b}, ${selectedNow ? 0.88 : 0.38})`;
    context.lineWidth = dropTarget === node ? 2.2 : selectedNow ? 1.6 : contains ? 1.2 : 1;
    context.beginPath(); context.arc(x, y, radius + pulse, 0, Math.PI * 2); context.fill(); context.stroke();

    if (contains) {
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(255,255,255,0.09)";
      context.setLineDash([2, 6]);
      context.beginPath(); context.arc(x, y, Math.max(10, radius * 0.68), 0, Math.PI * 2); context.stroke();
      context.setLineDash([]);
    }

    context.shadowBlur = 10;
    context.fillStyle = color;
    context.beginPath(); context.arc(x, y, Math.max(4.5, radius * 0.14), 0, Math.PI * 2); context.fill();
    context.restore();

    context.fillStyle = selectedNow ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.67)";
    context.font = `${selectedNow ? 600 : 500} ${width < 520 ? 10 : 11}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    context.textAlign = "center";
    context.fillText(node.name, x, y + radius + 17);
    context.fillStyle = `rgba(${r}, ${g}, ${b}, 0.65)`;
    context.font = "600 8px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.fillText(node.type.toUpperCase(), x, y + radius + 30);

    if (contains) {
      context.fillStyle = "rgba(255,255,255,0.4)";
      context.font = "600 8px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textAlign = "right";
      context.fillText(`${node.children.length} IN`, x + radius - 8, y - radius + 14);
    }
  };

  const render = (time = 0) => {
    if (running) {
      context.clearRect(0, 0, width, height);
      drawGrid();
      updateContainment();
      if (showLinks) ties.forEach((tie) => drawTie(tie, time));
      [...nodes].sort((a, b) => a.depth - b.depth).forEach((node) => drawNode(node, time));
      frame += 1;
      if (elements.frame && frame % 12 === 0) elements.frame.textContent = String(frame).padStart(4, "0").slice(-4);
    }
    requestAnimationFrame(render);
  };

  const nodeAt = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return [...nodes].sort((a, b) => b.depth - a.depth || visualRadius(a) - visualRadius(b)).find((node) => {
      const point = position(node);
      const nucleusHitRadius = Math.max(12, Math.min(19, visualRadius(node) * 0.25));
      return Math.hypot(x - point.x, y - point.y) <= nucleusHitRadius;
    }) || null;
  };

  const chooseNode = (node) => {
    if (!node) return;
    selected = node;
    updateInspector();
    announce(t.selected(node.name));
    if (!linkingFrom) return;
    if (linkingFrom === node) return;
    const exists = ties.some((tie) => (tie.a === linkingFrom && tie.b === node) || (tie.b === linkingFrom && tie.a === node));
    if (!exists) {
      ties.push({ a: linkingFrom, b: node });
      announce(t.linked);
    } else {
      announce(t.duplicate);
    }
    linkingFrom = null;
    canvas.classList.remove("is-linking");
    elements.linkButton?.classList.remove("is-active");
    elements.linkButton?.setAttribute("aria-pressed", "false");
    elements.hint.textContent = t.dragHint;
    updateInspector();
    save();
  };

  canvas.addEventListener("pointerdown", (event) => {
    const node = nodeAt(event.clientX, event.clientY);
    if (!node) return;
    chooseNode(node);
    dragged = node;
    dragOriginParent = node.parent;
    dragParentRadius = node.parent ? visualRadius(node.parent) : 0;
    dropTarget = null;
    const rect = canvas.getBoundingClientRect();
    const point = position(node);
    dragOffset = { x: event.clientX - rect.left - point.x, y: event.clientY - rect.top - point.y };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragged) return;
    const rect = canvas.getBoundingClientRect();
    const radius = visualRadius(dragged);
    const x = event.clientX - rect.left - dragOffset.x;
    const y = event.clientY - rect.top - dragOffset.y;
    const nextX = Math.max(radius, Math.min(width - radius, x));
    const nextY = Math.max(radius, Math.min(height - radius, y));
    moveHierarchy(dragged, nextX / width - dragged.nx, nextY / height - dragged.ny);
    clampHierarchyToCanvas(dragged);

    if (dragged.parent) {
      const parentPoint = position(dragged.parent);
      const childPoint = position(dragged);
      const exitRadius = Math.max(18, dragParentRadius - Math.min(12, visualRadius(dragged) * 0.2));
      if (Math.hypot(childPoint.x - parentPoint.x, childPoint.y - parentPoint.y) > exitRadius) detachChild(dragged);
    }
    const point = position(dragged);
    dropTarget = containmentTargetAt(point.x, point.y, dragged);
  });

  const releaseDrag = () => {
    if (!dragged) return;
    const released = dragged;
    if (dropTarget && attachChild(dropTarget, released)) announce(t.nested(released.name, dropTarget.name));
    else if (dragOriginParent && !released.parent) announce(t.detached(released.name));
    dragged = null;
    dropTarget = null;
    dragOriginParent = null;
    dragParentRadius = 0;
    canvas.classList.remove("is-dragging");
    updateInspector();
    save();
  };
  canvas.addEventListener("pointerup", releaseDrag);
  canvas.addEventListener("pointercancel", releaseDrag);

  root.querySelectorAll("[data-demo-scene]").forEach((button) => {
    button.addEventListener("click", () => loadScene(button.dataset.demoScene));
  });

  root.querySelector('[data-demo-action="add"]')?.addEventListener("click", () => {
    const number = nodes.filter((node) => node.custom).length + 1;
    const container = selected;
    const node = {
      id: `vertex:custom-${number}`,
      name: locale === "fr" ? `Nouveau Vertex ${number}` : `New Vertex ${number}`,
      type: "vertex",
      nx: container ? container.nx + 0.025 : 0.62,
      ny: container ? container.ny + 0.02 : 0.62,
      radius: 25,
      currentRadius: 25,
      targetRadius: 25,
      copy: {
        en: "A local Vertex added to this explanatory projection.",
        fr: "Un Vertex local ajouté à cette projection pédagogique.",
      },
      phase: Math.random() * 6,
      custom: true,
      parent: null,
      children: [],
      depth: 0,
    };
    nodes.push(node);
    if (container) attachChild(container, node);
    selected = node;
    updateInspector();
    save();
    announce(container ? t.nested(node.name, container.name) : t.added);
  });

  elements.linkButton?.addEventListener("click", () => {
    if (linkingFrom) {
      linkingFrom = null;
      canvas.classList.remove("is-linking");
      elements.linkButton.classList.remove("is-active");
      elements.linkButton.setAttribute("aria-pressed", "false");
      elements.hint.textContent = t.dragHint;
      announce(t.linkCancelled);
      return;
    }
    linkingFrom = selected;
    canvas.classList.add("is-linking");
    elements.linkButton.classList.add("is-active");
    elements.linkButton.setAttribute("aria-pressed", "true");
    elements.hint.textContent = t.linkHint;
    announce(linkingFrom ? t.linkStart : t.linkPrompt);
  });

  elements.linksButton?.addEventListener("click", () => {
    showLinks = !showLinks;
    elements.linksButton.setAttribute("aria-pressed", String(showLinks));
    elements.linksLabel.textContent = showLinks ? t.tiesVisible : t.tiesHidden;
    announce(showLinks ? t.tiesVisible : t.tiesHidden);
  });

  elements.detachButton?.addEventListener("click", () => {
    if (!selected?.parent) {
      announce(t.alreadyRoot);
      return;
    }
    const parent = selected.parent;
    const parentPoint = position(parent);
    const childPoint = position(selected);
    let dx = childPoint.x - parentPoint.x;
    let dy = childPoint.y - parentPoint.y;
    const distance = Math.hypot(dx, dy) || 1;
    if (distance === 1) { dx = 1; dy = 0; }
    const targetDistance = visualRadius(parent) + visualRadius(selected) + 24;
    const targetX = parentPoint.x + (dx / distance) * targetDistance;
    const targetY = parentPoint.y + (dy / distance) * targetDistance;
    detachChild(selected);
    moveHierarchy(selected, targetX / width - selected.nx, targetY / height - selected.ny);
    clampHierarchyToCanvas(selected);
    updateInspector();
    save();
    announce(t.detached(selected.name));
  });

  root.querySelector('[data-demo-action="reset"]')?.addEventListener("click", () => {
    try { localStorage.removeItem(storageKey); } catch { /* Optional persistence. */ }
    loadScene(activeScene, { reset: true });
    announce(t.reset);
  });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(shell);
  const visibilityObserver = new IntersectionObserver((entries) => {
    running = entries.some((entry) => entry.isIntersecting);
  }, { rootMargin: "160px" });
  visibilityObserver.observe(root);

  loadScene("runtime");
  resize();
  requestAnimationFrame(render);
};

document.querySelectorAll("[data-vaste-demo]").forEach(initDemo);
