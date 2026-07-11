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
    dragHint: "Drag a Vertex · tap to inspect",
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
    dragHint: "Glissez un Vertex · touchez pour l’inspecter",
    linkHint: "Sélectionnez deux Vertex pour créer une Tie",
  },
};

const sceneBlueprints = {
  runtime: {
    label: "RUNTIME / SYSTEM:EA",
    state: { en: "SYSTEM ACTIVE", fr: "SYSTÈME ACTIF" },
    nodes: [
      ["system:ea", "Electronic Artefacts", "system", 0.5, 0.5, 54, "Root partition and structural closure of this projection.", "Partition racine et clôture structurelle de cette projection."],
      ["actor:founder", "Founding Actor", "vertex", 0.2, 0.27, 30, "Situated identity whose authority is resolved from graph state.", "Identité située dont l’autorité est résolue depuis l’état du graphe."],
      ["action:publish", "Publish", "action", 0.78, 0.25, 27, "Declarative intent admitted through the runtime execution path.", "Intention déclarative admise par le chemin d’exécution du runtime."],
      ["surface:public", "Public Surface", "surface", 0.78, 0.72, 34, "Authorityless projection for observation and interaction.", "Projection sans autorité pour l’observation et l’interaction."],
      ["environment:local", "Local Environment", "environment", 0.22, 0.74, 31, "Ephemeral execution context: identity, location, policy and budgets.", "Contexte d’exécution éphémère : identité, position, policy et budgets."],
      ["vertex:record", "Knowledge Record", "vertex", 0.5, 0.18, 24, "Serializable graph state with stable identity and System membership.", "État de graphe sérialisable avec identité stable et appartenance au System."],
    ],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [2, 3]],
  },
  portable: {
    label: "PORTABILITY / VAST:1",
    state: { en: "PACKAGE SEALED", fr: "PACKAGE SCELLÉ" },
    nodes: [
      ["system:source", "Source System", "system", 0.2, 0.48, 44, "The original System-relative graph before export.", "Le graphe relatif au System avant export."],
      ["package:vast1", ".vast package", "action", 0.5, 0.48, 42, "Canonical structure, manifest, boundary references and package hash.", "Structure canonique, manifeste, références de frontière et hash du package."],
      ["system:target", "Rebound System", "system", 0.8, 0.48, 44, "Imported structure rebound to a different local System identity.", "Structure importée et rattachée à une nouvelle identité locale de System."],
      ["vertex:graph", "Portable graph", "vertex", 0.35, 0.23, 26, "Vertices and Ties preserved in a System-relative canonical form.", "Vertex et Ties conservés sous une forme canonique relative au System."],
      ["environment:authority", "Local authority", "environment", 0.66, 0.76, 29, "Credentials and effective authority are resolved again on arrival.", "Credentials et autorité effective sont résolus à nouveau à l’arrivée."],
      ["surface:inspection", "Inspection Surface", "surface", 0.5, 0.78, 27, "A projection for reviewing the package before local admission.", "Une projection pour inspecter le package avant admission locale."],
    ],
    links: [[0, 1], [1, 2], [0, 3], [3, 1], [1, 5], [5, 4], [4, 2]],
  },
  boot: {
    label: "ASSISTED BOOT / PLAN",
    state: { en: "ASSENT REQUIRED", fr: "ASSENTIMENT REQUIS" },
    nodes: [
      ["vertex:intent", "Initial intent", "vertex", 0.14, 0.5, 29, "The purpose and constraints expressed at the beginning of boot.", "Le but et les contraintes exprimés au début du boot."],
      ["surface:dialogue", "Boot dialogue", "surface", 0.34, 0.27, 30, "Conversation Surface used to clarify intent and expose decisions.", "Surface de conversation qui clarifie l’intention et expose les décisions."],
      ["vertex:plan", "Sealed plan", "vertex", 0.52, 0.5, 39, "Declarative composition plan sealed by a hash before materialization.", "Plan de composition déclaratif scellé par un hash avant matérialisation."],
      ["action:assent", "Explicit assent", "action", 0.7, 0.25, 29, "An admitted confirmation bound to the exact proposed plan.", "Confirmation admise, liée exactement au plan proposé."],
      ["actor:founding", "Founding Actor", "vertex", 0.68, 0.75, 30, "The initial situated Actor admitted into the born graph.", "L’Actor situé initial admis dans le graphe né."],
      ["system:born", "Born System", "system", 0.87, 0.5, 43, "The governed starting graph materialized through runtime-owned paths.", "Le graphe initial gouverné, matérialisé par les chemins du runtime."],
    ],
    links: [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]],
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
    linkButton: root.querySelector('[data-demo-action="link"]'),
    linksButton: root.querySelector('[data-demo-action="links"]'),
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
    copy: { en: raw[6], fr: raw[7] },
    vx: 0,
    vy: 0,
    phase: index * 1.37,
    custom: false,
  });

  const save = () => {
    try {
      const positions = Object.fromEntries(nodes.map((node) => [node.id, [node.nx, node.ny]]));
      localStorage.setItem(storageKey, JSON.stringify({ scene: activeScene, positions }));
    } catch { /* Local persistence is optional. */ }
  };

  const savedPositions = (scene) => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      return saved?.scene === scene ? saved.positions || {} : {};
    } catch { return {}; }
  };

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
  };

  const loadScene = (name, { reset = false } = {}) => {
    activeScene = name;
    const blueprint = sceneBlueprints[name];
    const saved = reset ? {} : savedPositions(name);
    nodes = blueprint.nodes.map((raw, index) => {
      const node = createNode(raw, index);
      if (saved[node.id]) [node.nx, node.ny] = saved[node.id];
      return node;
    });
    ties = blueprint.links.map(([a, b]) => ({ a: nodes[a], b: nodes[b] }));
    selected = nodes[0];
    dragged = null;
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
  const visualRadius = (node) => node.radius * Math.max(0.78, Math.min(1.12, width / 760));

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
    const pulse = reducedMotion ? 0 : Math.sin(time * 0.0014 + node.phase) * 1.5;

    context.save();
    context.shadowColor = `rgba(${r}, ${g}, ${b}, ${selectedNow ? 0.55 : 0.25})`;
    context.shadowBlur = selectedNow ? 26 : 14;
    context.fillStyle = `rgba(${r}, ${g}, ${b}, ${node.type === "system" ? 0.075 : 0.055})`;
    context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${selectedNow ? 0.88 : 0.38})`;
    context.lineWidth = selectedNow ? 1.6 : 1;
    context.beginPath(); context.arc(x, y, radius + pulse, 0, Math.PI * 2); context.fill(); context.stroke();

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
  };

  const render = (time = 0) => {
    if (running) {
      context.clearRect(0, 0, width, height);
      drawGrid();
      if (showLinks) ties.forEach((tie) => drawTie(tie, time));
      nodes.forEach((node) => drawNode(node, time));
      frame += 1;
      if (elements.frame && frame % 12 === 0) elements.frame.textContent = String(frame).padStart(4, "0").slice(-4);
    }
    requestAnimationFrame(render);
  };

  const nodeAt = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return [...nodes].reverse().find((node) => {
      const point = position(node);
      return Math.hypot(x - point.x, y - point.y) <= visualRadius(node) + 10;
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
  };

  canvas.addEventListener("pointerdown", (event) => {
    const node = nodeAt(event.clientX, event.clientY);
    if (!node) return;
    chooseNode(node);
    dragged = node;
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
    dragged.nx = Math.max(radius / width, Math.min(1 - radius / width, x / width));
    dragged.ny = Math.max(radius / height, Math.min(1 - radius / height, y / height));
  });

  const releaseDrag = () => {
    if (!dragged) return;
    dragged = null;
    canvas.classList.remove("is-dragging");
    save();
  };
  canvas.addEventListener("pointerup", releaseDrag);
  canvas.addEventListener("pointercancel", releaseDrag);

  root.querySelectorAll("[data-demo-scene]").forEach((button) => {
    button.addEventListener("click", () => loadScene(button.dataset.demoScene));
  });

  root.querySelector('[data-demo-action="add"]')?.addEventListener("click", () => {
    const number = nodes.filter((node) => node.custom).length + 1;
    const node = {
      id: `vertex:custom-${number}`,
      name: locale === "fr" ? `Nouveau Vertex ${number}` : `New Vertex ${number}`,
      type: "vertex",
      nx: 0.5 + (Math.random() - 0.5) * 0.18,
      ny: 0.48 + (Math.random() - 0.5) * 0.18,
      radius: 25,
      copy: {
        en: "A local Vertex added to this explanatory projection.",
        fr: "Un Vertex local ajouté à cette projection pédagogique.",
      },
      phase: Math.random() * 6,
      custom: true,
    };
    nodes.push(node);
    selected = node;
    updateInspector();
    announce(t.added);
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
