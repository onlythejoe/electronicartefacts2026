(function () {
  const catalog = window.EA_CATALOG || {};
  const { esc } = window.EA_UTILS;
  const { routeCard } = window.EA_VIEW || {};
  const entityIndex = catalog.indexes?.byId || {};
  const page = document.body.dataset.page || "home";
  const pageLocale = document.documentElement.lang === "fr" || window.location.pathname.startsWith("/fr/")
    ? "fr"
    : "en";
  const translate = (value) => window.EA_I18N?.translateText?.(value) || value;

  const entityById = (id) => entityIndex[id] || null;
  const scaleLength = (value, factor = 0.22) => {
    const text = String(value || "0rem").trim();
    const match = text.match(/^(-?\d+(?:\.\d+)?)rem$/);
    if (!match) return text;
    const scaled = Number(match[1]) * factor;
    return `${Number(scaled.toFixed(3))}rem`;
  };

  const navigationSection = ({ eyebrow, title, copy, cards = [] }) => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h2>${esc(title)}</h2>
        <p class="lede">${esc(copy)}</p>
      </div>
      <div class="card-grid card-grid--two">
        ${cards.map((card) => (routeCard ? routeCard(card) : "")).join("")}
      </div>
    </section>
  `;

  const graphSurface = ({
    eyebrow,
    title,
    copy,
    coreLabel,
    coreCopy,
    nodes = [],
    actions = [],
    variant = "default",
    showCore = true,
  }) => `
    <section class="zone-card hero graph-surface graph-surface--${esc(variant)}" data-graph-surface>
      <div class="graph-surface__content">
        <div class="section-head">
          <p class="eyebrow">${esc(eyebrow)}</p>
          <h2>${esc(title)}</h2>
          <p class="lede">${esc(copy)}</p>
        </div>
        ${
          actions.length
            ? `
              <div class="button-row">
                ${actions
                  .map(
                    (action, index) =>
                      `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}" href="${esc(action.href)}"${action.target ? ` target="${esc(action.target)}" rel="noreferrer"` : ""}>${action.icon ? `<span class="graph-surface__action-icon" aria-hidden="true">${esc(action.icon)}</span>` : ""}<span class="graph-surface__action-label">${esc(action.label)}</span></a>`,
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
      <div class="graph-surface__stage">
        <canvas class="graph-surface__canvas" aria-hidden="true"></canvas>
        <div class="graph-surface__grid" aria-hidden="true"></div>
        <div class="graph-surface__halo" aria-hidden="true"></div>
        <div class="graph-surface__ring graph-surface__ring--outer" aria-hidden="true"></div>
        <div class="graph-surface__ring graph-surface__ring--inner" aria-hidden="true"></div>
        ${showCore ? `
          <div class="graph-surface__core" aria-hidden="true">
            <strong>${esc(coreLabel || title)}</strong>
            ${coreCopy ? `<small>${esc(coreCopy)}</small>` : ""}
          </div>
        ` : ""}
        ${nodes
          .map(
            (node, index) => {
              const tag = node.href ? "a" : "button";
              const label = node.label || `Node ${index + 1}`;
              const note = node.note || "";
              const tone = String(node.tone || "").replace(/[^a-z0-9-]/gi, "").toLowerCase();
              const x = node.x || "0rem";
              const y = node.y || "0rem";
              const z = node.z || "0rem";
              const classes = [
                "graph-surface__node",
                node.emphasis ? "is-emphasis" : "",
                tone ? `graph-surface__node--${tone}` : "",
              ]
                .filter(Boolean)
                .join(" ");
              const attrs = [
                !node.href ? 'type="button"' : "",
                node.href ? `href="${esc(node.href)}"` : "",
                node.target ? `target="${esc(node.target)}" rel="noreferrer"` : "",
                `aria-label="${esc(note ? `${label} - ${note}` : label)}"`,
              ]
                .filter(Boolean)
                .join(" ");
              return `
                <${tag}
                  class="${esc(classes)}"
                  data-graph-node
                  data-node-index="${index}"
                  data-node-label="${esc(label)}"
                  data-node-note="${esc(note)}"
                  ${attrs}
                  style="--x:${esc(x)};--y:${esc(y)};--z:${esc(z)};--mobile-x:${esc(scaleLength(x))};--mobile-y:${esc(scaleLength(y))};--mobile-z:${esc(scaleLength(z, 0.2))};--node-color:${esc(node.color || "rgba(234,220,207,0.9)")};"
                >
                  <span class="graph-surface__node-pin" aria-hidden="true"></span>
                  <span class="graph-surface__node-body">
                    <strong>${esc(label)}</strong>
                    ${note ? `<small>${esc(note)}</small>` : ""}
                  </span>
                </${tag}>
              `;
            },
          )
          .join("")}
      </div>
    </section>
  `;

  const crossNavigation = () =>
    (() => {
      const id = new URLSearchParams(window.location.search).get("id");
      const item = id ? entityById(id) : null;

      if (page === "home") {
        return navigationSection({
          eyebrow: "GO DEEPER",
          title: "Choose the next level of detail.",
          copy: "Move from visible outcomes to the systems, research or archive behind them.",
          cards: [
            { kicker: "Home", title: "Projects", copy: "Compare public works, client systems and collaborations.", reason: "Best if you want to see what the studio makes.", cta: "Browse Projects", href: "./projects.html" },
            { kicker: "Home", title: "Research", copy: "Explore the questions, methods and experiments behind the work.", reason: "Best if you want to understand the thinking behind the work.", cta: "Explore Research", href: "./research.html" },
            { kicker: "Home", title: "Programs", copy: "Understand the reusable software systems behind the work.", reason: "Best if you want the operational core.", cta: "View Programs", href: "./programs.html" },
            { kicker: "Home", title: "Archive", copy: "Browse traces, fragments and historical material with context.", reason: "Best if you want context and depth.", cta: "Open Archive", href: "./archive.html" },
          ],
        });
      }

      if (page === "work") {
        return navigationSection({
          eyebrow: "NEXT",
          title: "See how the work connects.",
          copy: "Compare outcomes, understand the studio model or bring a concrete need into focus.",
          cards: [
            { kicker: "Outcomes", title: "Projects", copy: "Compare client delivery with proprietary and cultural work.", cta: "View projects", href: "./projects.html" },
            { kicker: "Studio", title: "About", copy: "Understand the studio model and the role of each practice.", cta: "About the studio", href: "./about.html" },
            { kicker: "Brief", title: "Contact", copy: "Bring a product, system or partnership into focus.", cta: "Start a conversation", href: "./contact.html" },
            { kicker: "Precedent", title: "Archive", copy: "Review the traces behind current work.", cta: "Browse the archive", href: "./archive.html" },
          ],
        });
      }

      if (page === "projects") {
        return navigationSection({
          eyebrow: "NEXT",
          title: "Follow the project to its source or its application.",
          copy: "Move from individual outcomes to client work, research, precedent or a new brief.",
          cards: [
            { kicker: "Client work", title: "Work", copy: "See how the studio handles commissioned products and platforms.", cta: "View client work", href: "./work.html" },
            { kicker: "Source", title: "Research", copy: "Read the investigations that inform the projects.", cta: "Explore research", href: "./research.html" },
            { kicker: "Lineage", title: "Archive", copy: "Trace earlier versions, fragments and references.", cta: "Browse the archive", href: "./archive.html" },
            { kicker: "New project", title: "Contact", copy: "Turn an adjacent idea into a focused first conversation.", cta: "Start a conversation", href: "./contact.html" },
          ],
        });
      }

      if (page === "programs") {
        return navigationSection({
          eyebrow: "NEXT",
          title: "Evaluate the system in context.",
          copy: "Examine the core runtime, the research behind it, the studio model or a possible implementation.",
          cards: [
            { kicker: "Core runtime", title: "VASTE", copy: "Review the identity, context and permissions layer shared across systems.", cta: "Explore VASTE", href: "./vaste.html" },
            { kicker: "Foundations", title: "Research", copy: "See the theories and methods that inform the stack.", cta: "Explore research", href: "./research.html" },
            { kicker: "Studio", title: "About", copy: "Understand how proprietary systems support the wider practice.", cta: "About the studio", href: "./about.html" },
            { kicker: "Implementation", title: "Contact", copy: "Discuss a pilot, licence or technical partnership.", cta: "Discuss a program", href: "./contact.html" },
          ],
        });
      }

      if (page === "research") {
        return navigationSection({
          eyebrow: "NEXT",
          title: "See what the research becomes.",
          copy: "Follow an investigation into a working system, a public project or the archive that preserves its lineage.",
          cards: [
            { kicker: "Systems", title: "Programs", copy: "Review the software that turns recurring research into reusable infrastructure.", cta: "View programs", href: "./programs.html" },
            { kicker: "Outcomes", title: "Projects", copy: "See how research becomes products, platforms and cultural work.", cta: "View projects", href: "./projects.html" },
            { kicker: "Lineage", title: "Archive", copy: "Browse the traces and prior versions that keep the work accountable.", cta: "Browse the archive", href: "./archive.html" },
            { kicker: "Context", title: "About", copy: "Understand the role of research in the studio as a whole.", cta: "About the studio", href: "./about.html" },
          ],
        });
      }

      if (page === "archive") {
        return navigationSection({
          eyebrow: "NEXT",
          title: "Return each trace to living work.",
          copy: "The archive gains meaning when it reconnects with a current project, an active investigation or a new conversation.",
          cards: [
            { kicker: "Current work", title: "Projects", copy: "See the public outcomes connected to these traces.", cta: "View projects", href: "./projects.html" },
            { kicker: "Source", title: "Research", copy: "Return to the questions and methods still in progress.", cta: "Explore research", href: "./research.html" },
            { kicker: "Request", title: "Contact", copy: "Ask about a specific trace, collaboration or reuse context.", cta: "Contact the studio", href: "./contact.html" },
            { kicker: "Context", title: "About", copy: "Place the archive within the studio’s broader practice.", cta: "About the studio", href: "./about.html" },
          ],
        });
      }

      if (page === "about") {
        return navigationSection({
          eyebrow: "NEXT",
          title: "Choose the part of the practice you want to examine.",
          copy: "Move from the studio model to its research, systems, projects or a direct conversation.",
          cards: [
            { kicker: "Questions", title: "Research", copy: "See where new methods and systems begin.", cta: "Explore research", href: "./research.html" },
            { kicker: "Infrastructure", title: "Programs", copy: "Review the studio’s reusable software systems.", cta: "View programs", href: "./programs.html" },
            { kicker: "Proof", title: "Projects", copy: "See how the practice becomes public work.", cta: "View projects", href: "./projects.html" },
            { kicker: "Conversation", title: "Contact", copy: "Discuss a product, system, partnership or cultural project.", cta: "Contact the studio", href: "./contact.html" },
          ],
        });
      }

      if (page === "contact") {
        return navigationSection({
          eyebrow: "BEFORE YOU WRITE",
          title: "Need more context first?",
          copy: "Review relevant work, compare projects or understand the studio’s systems before starting the conversation.",
          cards: [
            { kicker: "Capabilities", title: "Work", copy: "See how the studio frames and delivers client work.", cta: "View client work", href: "./work.html" },
            { kicker: "Examples", title: "Projects", copy: "Compare proprietary, cultural and commissioned outcomes.", cta: "View projects", href: "./projects.html" },
            { kicker: "Systems", title: "VASTE", copy: "Review the runtime if your question concerns knowledge infrastructure.", cta: "Explore VASTE", href: "./vaste.html" },
            { kicker: "Studio", title: "About", copy: "Understand the practice, its structure and its standards.", cta: "About the studio", href: "./about.html" },
          ],
        });
      }

      if (page === "vaste") {
        return navigationSection({
          eyebrow: "CONTINUE EXPLORING",
          title: "VASTE sits at the center of the stack.",
          copy: "Use these paths to move from the runtime into its surrounding layers.",
          cards: [
            { kicker: "Next", title: "Programs", copy: "See the wider software system family.", reason: "Useful if you want the stack around the core.", cta: "View Programs", href: "./programs.html" },
            { kicker: "Next", title: "Research", copy: "See the investigations that feed the runtime.", reason: "Useful if you want the methods behind it.", cta: "Explore Research", href: "./research.html" },
            { kicker: "Next", title: "About", copy: "Rebuild the ecosystem model around the runtime.", reason: "Useful if you need the bigger picture.", cta: "Understand the Ecosystem", href: "./about.html" },
            { kicker: "Next", title: "Contact", copy: "Discuss the runtime or a related partnership.", reason: "Useful if VASTE is the reason you are here.", cta: "Start a Collaboration", href: "./contact.html" },
          ],
        });
      }

      if (page === "palimpsests") {
        return navigationSection({
          eyebrow: "CONTINUE EXPLORING",
          title: "Palimpsests connects artistic work to archive and research.",
          copy: "Use these paths to move between the album, its memory layer and the broader studio system.",
          cards: [
            { kicker: "Next", title: "Archive", copy: "See the traces, fragments and related material.", reason: "Useful if you want the work's historical context.", cta: "Open Archive", href: "./archive.html" },
            { kicker: "Next", title: "Research", copy: "Revisit the conceptual branches behind the work.", reason: "Useful if you want the source ideas.", cta: "Explore Research", href: "./research.html" },
            { kicker: "Next", title: "Work", copy: "Move back into the studio and wider project field.", reason: "Useful if you want the wider practice.", cta: "See Client Work", href: "./work.html" },
            { kicker: "Next", title: "Contact", copy: "Discuss collaboration, publication or release.", reason: "Useful if the work suggests a new one.", cta: "Start a Collaboration", href: "./contact.html" },
          ],
        });
      }

      if (item && item.kind === "project") {
        const projectCards = {
          "oeil-de-meg": [
            { kicker: "Next", title: "Work", copy: "Return to the client-facing work.", reason: "Useful if you want the broader service layer.", cta: "See Client Work", href: "./work.html" },
            { kicker: "Next", title: "Projects", copy: "Compare with other public projects.", reason: "Useful if you want adjacent examples.", cta: "Browse Projects", href: "./projects.html" },
            { kicker: "Next", title: "Archive", copy: "See traces, drafts and related material.", reason: "Useful for precedent and context.", cta: "Open Archive", href: "./archive.html" },
            { kicker: "Next", title: "Contact", copy: "Start a similar commission or collaboration.", reason: "Useful when the project becomes a brief.", cta: "Start a Collaboration", href: "./contact.html" },
          ],
          vestiges: [
            { kicker: "Runtime", title: "VASTE", copy: "Open the runtime that powers Vestiges.", reason: "Useful if you want the technical foundation.", cta: "Explore VASTE", href: "https://www.vaste.space/" },
            { kicker: "Next", title: "Programs", copy: "See the software and infrastructure layer around the product.", reason: "Useful if you want the wider system family.", cta: "View Programs", href: "./programs.html" },
            { kicker: "Next", title: "Research", copy: "Explore the research, taxonomy and systems thinking that inform the platform.", reason: "Useful if you want the conceptual and technical sources.", cta: "Explore Research", href: "./research.html" },
            { kicker: "Next", title: "Contact", copy: "Discuss a platform, cultural institution or knowledge infrastructure collaboration.", reason: "Useful if Vestiges connects to your organisation.", cta: "Start a Collaboration", href: "./contact.html" },
          ],
          atypikhouse: [
            { kicker: "Next", title: "Work", copy: "See the studio layer that houses applied work.", reason: "Useful if you want service context.", cta: "See Client Work", href: "./work.html" },
            { kicker: "Next", title: "Programs", copy: "Understand the software systems behind the surface.", reason: "Useful if you want the technical layer.", cta: "View Programs", href: "./programs.html" },
            { kicker: "Next", title: "Projects", copy: "Compare with related projects.", reason: "Useful if you want adjacent case studies.", cta: "Browse Projects", href: "./projects.html" },
            { kicker: "Next", title: "Contact", copy: "Start a similar product or system brief.", reason: "Useful if this is the model you need.", cta: "Start a Collaboration", href: "./contact.html" },
          ],
          unionmob: [
            { kicker: "Technical asset", title: "Programs", copy: "See the Electronic Artefacts-owned systems behind the CTO contribution.", reason: "Useful for understanding the software layer without confusing it with UnionMob ownership.", cta: "View Programs", href: "./programs.html" },
            { kicker: "Next", title: "Research", copy: "Explore the investigations that inform it.", reason: "Useful if you want the conceptual layer.", cta: "Explore Research", href: "./research.html" },
            { kicker: "Partnership", title: "Work", copy: "Review how Electronic Artefacts presents external technical collaborations.", reason: "Useful for comparing the CTO role with commissioned delivery.", cta: "See Work", href: "./work.html" },
            { kicker: "Next", title: "Contact", copy: "Discuss an external CTO, platform or coordination-system collaboration.", reason: "Useful when a project needs technical leadership with clear ownership boundaries.", cta: "Start a Collaboration", href: "./contact.html" },
          ],
        };
        const cards = projectCards[item.id] || [
          { kicker: "Next", title: "Work", copy: "Move back to the studio layer.", reason: "Useful if you want the wider project field.", cta: "See Client Work", href: "./work.html" },
          { kicker: "Next", title: "Projects", copy: "Browse the broader project map.", reason: "Useful if you want adjacent examples.", cta: "Browse Projects", href: "./projects.html" },
          { kicker: "Next", title: "Archive", copy: "Open traces and related material.", reason: "Useful for historical context.", cta: "Open Archive", href: "./archive.html" },
          { kicker: "Next", title: "Contact", copy: "Start a similar collaboration.", reason: "Useful if this project should lead to another.", cta: "Start a Collaboration", href: "./contact.html" },
        ];
        return navigationSection({
          eyebrow: "CONTINUE EXPLORING",
          title: `${item.title} sits inside a larger ecosystem.`,
          copy: "Use these paths to move to the layers that sit around this project.",
          cards,
        });
      }

      return navigationSection({
        eyebrow: "CONTINUE EXPLORING",
        title: "A site held together by clear paths.",
        copy: "Pages stay linked through the same frame: work, research, archive, contact and the external systems around them.",
        cards: [
          { kicker: "Core", title: "Work", copy: "Projects, music and technology.", reason: "The studio layer and applied outcomes.", cta: "Return to Work", href: "./work.html" },
          { kicker: "Core", title: "Projects", copy: "Public works and extended dossiers.", reason: "The public project constellation.", cta: "Browse Projects", href: "./projects.html" },
          { kicker: "Core", title: "Programs", copy: "All visible software programs.", reason: "The runtime and systems layer.", cta: "View Programs", href: "./programs.html" },
          { kicker: "Core", title: "Research", copy: "Program, fields and notes.", reason: "The conceptual and experimental layer.", cta: "Explore Research", href: "./research.html" },
        ],
      });
    })();

  const uxSurface = (eyebrow, title, copy, metrics = [], links = []) =>
    graphSurface({
      eyebrow,
      title,
      copy,
      coreLabel: title,
      coreCopy: "Signal map",
      nodes: metrics.slice(0, 5).map((item, index) => {
        const positions = [
          { x: "-11rem", y: "-6rem", z: "-14rem", angle: "32deg" },
          { x: "10rem", y: "-7rem", z: "15rem", angle: "-30deg" },
          { x: "-13rem", y: "2rem", z: "10rem", angle: "8deg" },
          { x: "12rem", y: "3rem", z: "-10rem", angle: "-10deg" },
          { x: "0rem", y: "13rem", z: "4rem", angle: "-90deg" },
        ][index] || { x: "0rem", y: "0rem", z: "0rem", angle: "0deg" };
        return {
          label: item.value,
          note: item.label,
          x: positions.x,
          y: positions.y,
          z: positions.z,
          angle: positions.angle,
          length: index === 4 ? "13rem" : "12rem",
        };
      }),
      actions: links,
    });

  const nodesFromItems = (items = [], options = {}) =>
    items.slice(0, options.limit || 7).map((item, index) => ({
      label: options.labelFor ? options.labelFor(item, index) : item.title || item.name || `Node ${index + 1}`,
      note: options.noteFor ? options.noteFor(item, index) : item.type || item.statusLabel || item.category || "",
      href: options.hrefFor ? options.hrefFor(item, index) : item.route || item.href || "",
      target: options.targetFor ? options.targetFor(item, index) : "",
      x: options.positions?.[index]?.x || `${(index % 2 === 0 ? -1 : 1) * (10 + index * 2)}rem`,
      y: options.positions?.[index]?.y || `${(index - 2) * 3}rem`,
      z: options.positions?.[index]?.z || `${(index % 3 - 1) * 8}rem`,
      angle: options.positions?.[index]?.angle || `${(index % 2 === 0 ? 24 : -24)}deg`,
      length: options.positions?.[index]?.length || "14rem",
      emphasis: index === 0,
    }));

  const publicRecords = () => Array.isArray(catalog.publicCatalog?.entities) ? catalog.publicCatalog.entities : [];
  const publicRelations = () => Array.isArray(catalog.publicCatalog?.relations) ? catalog.publicCatalog.relations : [];
  const recordIndexes = () => {
    const records = publicRecords();
    return {
      byId: Object.fromEntries(records.map((item) => [item.id, item])),
      byLegacyId: Object.fromEntries(records.filter((item) => item.legacyId).map((item) => [item.legacyId, item])),
    };
  };
  const recordForRef = (ref, indexes = recordIndexes()) => {
    const id = typeof ref === "string" ? ref : ref?.id;
    return indexes.byId[id] || indexes.byLegacyId[id] || null;
  };
  const routeForRecord = (record) => record?.route || catalog.routeFor?.(record?.id) || "";
  const researchQuestions = () => {
    const records = publicRecords().filter((item) => item.type === "researchQuestion" && item.visibility === "public");
    const localized = records.filter((item) => item.locale === pageLocale);
    const source = localized.length ? localized : records.filter((item) => item.locale === "en" && !item.translationOf);
    return source
      .filter((item) => item.homepage !== false)
      .sort((left, right) => (left.priority || 999) - (right.priority || 999) || String(left.started || "").localeCompare(String(right.started || "")));
  };
  const dateLabel = (value) => {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(pageLocale, { day: "2-digit", month: "short", year: "numeric" }).format(date).toUpperCase();
  };
  const statusLabel = (value) =>
    String(value || "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  const researchNumber = (question, index) => `${translate("Research")} #${String(question.priority || index + 1).padStart(3, "0")}`;
  const researchCoreNumber = (question, index) => `#${String(question.priority || index + 1).padStart(3, "0")}`;
  const graphRouteForQuestion = (question) => {
    const localeSegment = question.locale === "fr" ? "/fr" : "";
    return `/graph/neighborhoods${localeSegment}/research-question/${question.legacyId || String(question.id || "").split(":").pop()}.json`;
  };
  const compactRefs = (refs, limit, indexes) => (refs || [])
    .map((ref) => recordForRef(ref, indexes) || ref)
    .filter(Boolean)
    .slice(0, limit);
  const nodeColorFor = (type, index) => {
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
    const fallback = ["rgba(234, 220, 207, 0.9)", "rgba(125, 211, 252, 0.9)", "rgba(52, 211, 153, 0.88)"];
    return colors[type] || fallback[index % fallback.length];
  };
  const nodeKindLabel = (record) =>
    translate(String(record?.type || record?.kind || "related").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase());
  const atlasNodes = (question) => {
    const indexes = recordIndexes();
    const buckets = [
      ...(question.relatedProjects || []).map((ref) => ({ ref, group: "project" })),
      ...(question.relatedSoftware || []).map((ref) => ({ ref, group: "software" })),
      ...(question.relatedConcepts || []).slice(0, 4).map((ref) => ({ ref, group: "concept" })),
      ...(question.relatedTechnologies || []).slice(0, 3).map((ref) => ({ ref, group: "technology" })),
      ...(question.relatedArticles || []).slice(0, 2).map((ref) => ({ ref, group: "article" })),
    ];
    const seen = new Set();
    return buckets
      .map(({ ref, group }) => {
        const record = recordForRef(ref, indexes) || ref;
        const id = record.id || ref.id || record.title;
        if (!id || seen.has(id)) return null;
        seen.add(id);
        return { ...record, group };
      })
      .filter(Boolean)
      .slice(0, 10);
  };
  const researchGraphNodeLimit = 7;
  const researchGraphPositions = [
    { x: "-12rem", y: "-7rem", z: "-13rem" },
    { x: "11rem", y: "-7.5rem", z: "12rem" },
    { x: "-14rem", y: "-0.5rem", z: "7rem" },
    { x: "14rem", y: "0.75rem", z: "-8rem" },
    { x: "-9rem", y: "8.75rem", z: "11rem" },
    { x: "9rem", y: "9.25rem", z: "-11rem" },
    { x: "0rem", y: "-13rem", z: "6rem" },
    { x: "0rem", y: "13rem", z: "-5rem" },
    { x: "-17rem", y: "5.5rem", z: "-2rem" },
    { x: "17rem", y: "5.25rem", z: "2rem" },
  ];
  const researchNodeData = (question) => atlasNodes(question).slice(0, researchGraphNodeLimit);
  const researchGraphStyle = (node, index) => {
    const position = researchGraphPositions[index % researchGraphPositions.length];
    const color = node ? nodeColorFor(node.type || node.kind || node.group, index) : "rgba(234, 220, 207, 0.9)";
    return `--x:${position.x};--y:${position.y};--z:${position.z};--mobile-x:${scaleLength(position.x, 0.34)};--mobile-y:${scaleLength(position.y, 0.3)};--mobile-z:${scaleLength(position.z, 0.16)};--node-color:${color};--node-delay:${index * 42}ms;`;
  };
  const researchNodeMarkup = (question) => {
    const nodes = researchNodeData(question);
    return Array.from({ length: researchGraphNodeLimit }, (_, index) => {
      const node = nodes[index];
      const label = node?.title || node?.label || "Related";
      const note = node ? nodeKindLabel(node) : "";
      const group = String(node?.type || node?.group || "related").replace(/[^a-z0-9-]/gi, "").toLowerCase();
      const route = node ? routeForRecord(node) || routeForRecord(question) || "./research.html" : "#";
      const hidden = !node;
      return `
        <a
          class="graph-surface__node research-atlas__node research-atlas__node--${esc(group)}${index < 2 ? " is-emphasis" : ""}"
          href="${esc(route)}"
          data-graph-node
          data-research-atlas-node
          data-node-index="${index}"
          data-node-label="${esc(label)}"
          data-node-note="${esc(note)}"
          data-node-group="${esc(group)}"
          data-node-hidden="${hidden ? "true" : "false"}"
          aria-label="${esc(note ? `${label} - ${note}` : label)}"
          ${hidden ? 'hidden aria-hidden="true" tabindex="-1"' : ""}
          style="${esc(researchGraphStyle(node, index))}"
        >
          <span class="graph-surface__node-pin research-atlas__node-pin" aria-hidden="true"></span>
          <span class="graph-surface__node-body research-atlas__node-label">
            <strong>${esc(label)}</strong>
            ${note ? `<small>${esc(note)}</small>` : "<small></small>"}
          </span>
        </a>`;
    }).join("");
  };
  const syncResearchGraphNodes = (atlas, question) => {
    const nodes = researchNodeData(question);
    const elements = [...atlas.querySelectorAll("[data-research-atlas-node]")];
    elements.forEach((element, index) => {
      const node = nodes[index];
      const label = node?.title || node?.label || "Related";
      const note = node ? nodeKindLabel(node) : "";
      const group = String(node?.type || node?.group || "related").replace(/[^a-z0-9-]/gi, "").toLowerCase();
      const route = node ? routeForRecord(node) || routeForRecord(question) || "./research.html" : "#";
      const hidden = !node;

      element.hidden = hidden;
      element.toggleAttribute("aria-hidden", hidden);
      element.setAttribute("tabindex", hidden ? "-1" : "0");
      element.setAttribute("href", route);
      element.setAttribute("data-node-label", label);
      element.setAttribute("data-node-note", note);
      element.setAttribute("data-node-group", group);
      element.setAttribute("data-node-hidden", hidden ? "true" : "false");
      element.setAttribute("data-node-reset", "true");
      element.setAttribute("aria-label", note ? `${label} - ${note}` : label);
      element.className = `graph-surface__node research-atlas__node research-atlas__node--${group}${index < 2 ? " is-emphasis" : ""}`;
      element.setAttribute("style", researchGraphStyle(node, index));

      const title = element.querySelector("strong");
      const small = element.querySelector("small");
      if (title) title.textContent = label;
      if (small) small.textContent = note;
    });
  };
  const researchDots = (questions, activeIndex) => questions
    .map((question, index) => `<button type="button" data-research-atlas-dot="${index}" aria-current="${index === activeIndex ? "true" : "false"}" aria-label="${esc(translate("Open research question"))} ${index + 1}" class="${index === activeIndex ? "is-active" : ""}"><span>${esc(researchNumber(question, index))}</span></button>`)
    .join("");
  const researchArtefacts = (question) => {
    const indexes = recordIndexes();
    const records = [
      ...compactRefs(question.relatedSoftware, 3, indexes),
      ...compactRefs(question.relatedProjects, 3, indexes),
    ];
    const seen = new Set();
    return records
      .filter((item) => {
        const id = item.id || item.title;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 4);
  };
  const researchActionLinks = (question) => {
    const indexes = recordIndexes();
    const relatedSoftware = compactRefs([...(question.relatedSoftware || []), ...(question.relatedProjects || [])], 1, indexes)[0];
    const repository = question.relatedRepositories?.[0];
    const article = compactRefs(question.relatedArticles, 1, indexes)[0];
    return [
      { label: translate("Explore research"), href: routeForRecord(question) },
      { label: translate("Open graph"), href: graphRouteForQuestion(question), target: "_blank" },
      relatedSoftware ? { label: translate("Related software"), href: routeForRecord(relatedSoftware) } : null,
      repository ? { label: translate("Repository"), href: repository.url, target: "_blank" } : null,
      article ? { label: translate("Documentation"), href: routeForRecord(article) } : null,
    ].filter((item) => item?.href);
  };
  const researchQuestionBody = (question, index, questions) => {
    const artefacts = researchArtefacts(question);
    const actions = researchActionLinks(question);
    const understanding = question.currentUnderstanding || question.hypothesis || question.observation || "";
    const tags = (question.tags || []).slice(0, 5);
    return `
      <div class="research-atlas__meta-row">
        <span class="status-badge status-badge--research">${esc(statusLabel(question.status))}</span>
        <span>${esc(researchNumber(question, index))}</span>
        <span>${esc(translate("Started"))} ${esc(dateLabel(question.started))}</span>
        <span>${esc(translate("Updated"))} ${esc(dateLabel(question.updated || question.temporality?.lastUpdated))}</span>
      </div>
      <div class="research-atlas__question-copy">
        <p class="eyebrow">${esc(translate("RESEARCH ATLAS"))}</p>
        <h2 id="research-atlas-title" class="display-title">${esc(question.title)}</h2>
        <p class="lede">${esc(question.summary || question.description || question.abstract || "")}</p>
        <div class="tag-cluster tag-cluster--compact">
          ${tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join("")}
        </div>
      </div>
      <div class="research-atlas__lower">
        <article class="research-atlas__field">
          <p class="card__meta">${esc(question.currentUnderstanding ? translate("Current understanding") : translate("Current hypothesis"))}</p>
          <h3>${esc(understanding)}</h3>
          ${question.observation ? `<p>${esc(question.observation)}</p>` : ""}
        </article>
        <article class="research-atlas__artefacts">
          <p class="card__meta">${esc(translate("Related artefacts"))}</p>
          <div class="research-atlas__artefact-list">
            ${artefacts.map((item, itemIndex) => `
              <a href="${esc(routeForRecord(item))}">
                <span style="--node-color:${esc(nodeColorFor(item.type || item.kind, itemIndex))};">${esc((item.title || "?").slice(0, 2).toUpperCase())}</span>
                <strong>${esc(item.title)}</strong>
                <small>${esc(nodeKindLabel(item))}</small>
              </a>`).join("")}
          </div>
        </article>
        <nav class="research-atlas__actions" aria-label="${esc(translate("Related actions"))}">
          <p class="card__meta">${esc(translate("Related actions"))}</p>
          ${actions.map((action) => `<a href="${esc(action.href)}" data-research-atlas-action${action.target ? ` target="${esc(action.target)}" rel="noreferrer"` : ""}>${esc(action.label)} <span aria-hidden="true">→</span></a>`).join("")}
        </nav>
      </div>
      <div class="research-atlas__timeline" aria-label="${esc(translate("Research timeline"))}">
        ${(question.timeline || []).slice(0, 3).map((event) => `
          <span><strong>${esc(dateLabel(event.date))}</strong>${esc(event.title)}</span>
        `).join("")}
      </div>`;
  };
  const researchAtlas = () => {
    const questions = researchQuestions();
    if (!questions.length) return "";
    const active = questions[0];
    return `
      <section class="zone-card hero research-atlas intent-hero intent-hero--research" id="research-atlas" data-research-atlas tabindex="0" aria-labelledby="research-atlas-title">
        <div class="research-atlas__layout">
          <aside class="research-atlas__projection graph-surface graph-surface--research-atlas is-visible" data-graph-surface aria-label="${esc(translate("Animated research graph"))}">
            <div class="graph-surface__stage research-atlas__graph" data-research-atlas-graph>
              <canvas class="graph-surface__canvas research-atlas__canvas" aria-hidden="true"></canvas>
              <div class="graph-surface__grid" aria-hidden="true"></div>
              <div class="graph-surface__halo" aria-hidden="true"></div>
              <div class="graph-surface__ring graph-surface__ring--outer" aria-hidden="true"></div>
              <div class="graph-surface__ring graph-surface__ring--inner" aria-hidden="true"></div>
              <div class="graph-surface__core research-atlas__core" aria-hidden="true">
                <span>${esc(translate("Question"))}</span>
                <strong data-research-atlas-core>${esc(researchCoreNumber(active, 0))}</strong>
              </div>
              <div class="graph-surface__nodes research-atlas__nodes" data-research-atlas-nodes>
                ${researchNodeMarkup(active)}
              </div>
            </div>
            <a class="tag research-atlas__graph-link" href="${esc(graphRouteForQuestion(active))}" target="_blank" rel="noreferrer" data-research-atlas-graph-link aria-label="${esc(translate("View full graph"))}">
              <span class="research-atlas__graph-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="6" cy="7" r="2.2"></circle><circle cx="18" cy="6" r="2.2"></circle><circle cx="12" cy="18" r="2.2"></circle><path d="m7.9 8.1 3 7.8M16.1 7.3l-3 8.6M8.2 6.8l7.6-.6"></path></svg></span>
              <span class="research-atlas__graph-link-label">${esc(translate("View full graph"))}</span>
            </a>
          </aside>
          <article class="research-atlas__panel" data-research-atlas-panel aria-live="polite">
            ${researchQuestionBody(active, 0, questions)}
          </article>
        </div>
        <div class="research-atlas__nav">
          <button type="button" class="button button--secondary" data-research-atlas-prev aria-label="${esc(translate("Previous Question"))}"><span class="research-atlas__button-icon" aria-hidden="true">←</span> <span class="research-atlas__button-label">${esc(translate("Previous"))}</span></button>
          <button type="button" class="button button--secondary research-atlas__title-button" data-research-atlas-title aria-label="${esc(translate("Back to research title"))}" title="${esc(translate("Back to research title"))}"><span class="research-atlas__button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="10.8" cy="10.8" r="6.2"></circle><path d="m15.5 15.5 5 5"></path></svg></span> <span class="research-atlas__button-label">${esc(translate("Back to title"))}</span></button>
          <button type="button" class="button button--secondary" data-research-atlas-next aria-label="${esc(translate("Next Question"))}"><span class="research-atlas__button-label">${esc(translate("Next"))}</span> <span class="research-atlas__button-icon" aria-hidden="true">→</span></button>
        </div>
      </section>
    `;
  };

  const ecosystemExplorer = () => {
    const projects = catalog.projects?.length || 0;
    const programs = catalog.programs?.length || 0;
    const research = catalog.researchFields?.length || 0;
    const routeFor = (id, fallback = "") => catalog.routeFor?.(id) || entityById(id)?.route || fallback;
    return graphSurface({
      eyebrow: "LAYER",
      title: "The studio’s work, online.",
      copy: "Discover the projects, programs and knowledge paths published by Electronic Artefacts.",
      coreLabel: "Electronic Artefacts",
      coreCopy: `${projects} projects / ${programs} programs / ${research} fields`,
      variant: "home",
      showCore: false,
      nodes: [
        {
          label: "VASTE",
          note: "Runtime / active",
          href: "https://www.vaste.space/",
          target: "_blank",
          color: "rgba(125, 211, 252, 0.95)",
          tone: "system",
          emphasis: true,
        },
        {
          label: "Vestiges",
          note: "Flagship platform",
          href: routeFor("vestiges", "./projects/vestiges/"),
          color: "rgba(247, 244, 239, 0.94)",
          tone: "platform",
          emphasis: true,
        },
        {
          label: "L’Œil de Meg",
          note: "Client work / live",
          href: routeFor("oeil-de-meg", "./project.html?id=oeil-de-meg"),
          color: "rgba(245, 158, 11, 0.92)",
          tone: "delivery",
        },
        {
          label: "Palimpsests",
          note: "Album / culture",
          href: routeFor("palimpsests", "./palimpsests.html"),
          color: "rgba(234, 220, 207, 0.92)",
          tone: "culture",
        },
        {
          label: "Runtime Theory",
          note: "Research field",
          href: routeFor("runtime-theory", "./research/fields/runtime-theory/"),
          color: "rgba(167, 139, 250, 0.92)",
          tone: "research",
        },
        {
          label: "Knowledge",
          note: "Concept pages",
          href: "./knowledge/",
          color: "rgba(52, 211, 153, 0.9)",
          tone: "knowledge",
        },
        {
          label: "Archive",
          note: "Memory layer",
          href: "./archive.html",
          color: "rgba(228, 213, 196, 0.86)",
          tone: "archive",
        },
      ],
      actions: [
        { label: "Search", icon: "⌕", href: "./search.html" },
        { label: "Projects", icon: "◈", href: "./projects.html" },
        { label: "Knowledge", icon: "✦", href: "./knowledge/" },
      ],
    });
  };

  const startGraphSurfaceAnimation = () => {
    if (window.__graphSurfaceAnimationStarted) return;
    window.__graphSurfaceAnimationStarted = true;

    const surfaces = [...document.querySelectorAll("[data-graph-surface]")];
    if (!surfaces.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const contexts = surfaces
      .map((surface) => {
        const stage = surface.querySelector(".graph-surface__stage");
        const canvas = surface.querySelector(".graph-surface__canvas");
        const ctx = canvas?.getContext("2d");
        const nodes = [...surface.querySelectorAll("[data-graph-node]")].map((el) => ({
          el,
          label: el.dataset.nodeLabel || el.textContent.trim(),
          color: el.style.getPropertyValue("--node-color") || "rgba(234,220,207,0.9)",
          dragX: 0,
          dragY: 0,
          currentX: 0,
          currentY: 0,
          pointerX: 0,
          pointerY: 0,
          isDragging: false,
        }));

        if (!stage || !canvas || !ctx || !nodes.length) return null;
        return {
          surface,
          stage,
          canvas,
          ctx,
          nodes,
          phase: Math.random() * Math.PI * 2,
          activePointerId: null,
          visible: false,
          rafId: 0,
        };
      })
      .filter(Boolean);

    if (!contexts.length) return;

    const resize = (context) => {
      const rect = context.stage.getBoundingClientRect();
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      context.canvas.width = Math.max(1, Math.round(rect.width * dpr));
      context.canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.canvas.style.width = `${rect.width}px`;
      context.canvas.style.height = `${rect.height}px`;
      context.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.width = rect.width;
      context.height = rect.height;
      context.centerX = rect.width / 2;
      context.centerY = rect.height / 2;
      context.minDim = Math.min(rect.width, rect.height);
    };

    contexts.forEach(resize);

    const setNodeDragging = (context, nodeIndex, dragging) => {
      const node = context.nodes[nodeIndex];
      if (!node) return;
      node.el.classList.toggle("is-dragging", dragging);
      node.isDragging = dragging;
    };

    const drawNode = (ctx, node, cx, cy, radius, pulse, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(255,255,255,0.18)";
      ctx.shadowBlur = 14 * pulse;
      ctx.lineWidth = 1.1 + pulse * 0.65;
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3.2, radius * 0.28), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const renderContext = (context) => {
      if (!document.body.contains(context.surface)) return;

      const rect = context.stage.getBoundingClientRect();
      if (rect.width !== context.width || rect.height !== context.height) {
        resize(context);
      }

      const { ctx, width, height, centerX, centerY, minDim } = context;
      const isResearchAtlasGraph = context.surface.classList.contains("graph-surface--research-atlas");
      const compactGraph = isResearchAtlasGraph && minDim < 380;
      const t = compactGraph ? 0 : performance.now() * 0.001;

      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(centerX, centerY, minDim * 0.02, centerX, centerY, minDim * 0.72);
      bg.addColorStop(0, "rgba(234,220,207,0.08)");
      bg.addColorStop(0.45, "rgba(255,255,255,0.02)");
      bg.addColorStop(1, "rgba(0,0,0,0.04)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += Math.max(52, width / 10)) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += Math.max(44, height / 8)) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const orbit1 = minDim * (compactGraph ? 0.43 : 0.38);
      const orbit2 = minDim * (compactGraph ? 0.3 : 0.22);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbit1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbit2, 0, Math.PI * 2);
      ctx.stroke();

      if (!isResearchAtlasGraph) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(22, minDim * 0.08), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(234,220,207,0.12)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.88)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      const activeNodes = context.nodes.filter((node) =>
        !node.el.hidden &&
        node.el.dataset.nodeHidden !== "true" &&
        window.getComputedStyle(node.el).display !== "none"
      );
      if (!activeNodes.length) return;

      const positions = activeNodes.map((node, index) => {
        if (node.el.dataset.nodeReset === "true") {
          node.dragX = 0;
          node.dragY = 0;
          node.el.dataset.nodeReset = "false";
        }
        node.color = node.el.style.getPropertyValue("--node-color") || node.color || "rgba(234,220,207,0.9)";
        const angle = t * 0.25 + index * (Math.PI * 2 / activeNodes.length);
        const nodeWidth = node.el.offsetWidth || 104;
        const nodeHeight = node.el.offsetHeight || 68;
        const edgePadding = compactGraph ? 8 : isResearchAtlasGraph ? 34 : 16;
        const maxRadiusX = Math.max(minDim * 0.18, width / 2 - nodeWidth / 2 - edgePadding);
        const maxRadiusY = Math.max(minDim * 0.14, height / 2 - nodeHeight / 2 - edgePadding);
        const radiusBase = Math.max(
          minDim * 0.16,
          Math.min(orbit1 - (compactGraph ? 14 : 26) - index * (compactGraph ? 2 : 5), maxRadiusX),
        );
        const yOrbit = Math.max(minDim * 0.12, Math.min(orbit2, maxRadiusY));
        const wobble = Math.sin(t * 1.2 + index) * 12;
        const depth = Math.sin(t * 0.9 + index * 1.3);
        const baseX = centerX + Math.cos(angle) * (radiusBase + wobble * 0.25);
        const baseY = centerY + Math.sin(angle * 0.95) * (yOrbit + wobble * 0.15);
        const x = node.isDragging ? node.pointerX : baseX + node.dragX;
        const y = node.isDragging ? node.pointerY : baseY + node.dragY;
        const radius = 14 + (depth + 1) * 4;
        const pulse = 0.7 + (Math.sin(t * 2 + index) + 1) * 0.2;
        node.currentX = x;
        node.currentY = y;
        node.baseX = baseX;
        node.baseY = baseY;
        return { node, x, y, radius, pulse, depth };
      });

      positions.forEach((item) => {
        ctx.strokeStyle = "rgba(255,255,255,0.26)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(item.x, item.y);
        ctx.stroke();
      });

      positions.forEach((item, index) => {
        const next = positions[(index + 1) % positions.length];
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(item.x, item.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      });

      positions.forEach((item) => {
        const z = Math.round(item.depth * 28);
        item.node.el.style.transform = `translate3d(calc(-50% + ${item.x - centerX}px), calc(-50% + ${item.y - centerY}px), ${z}px)`;
        drawNode(ctx, item.node, item.x, item.y, item.radius, item.pulse, 0.68 + item.depth * 0.12);
      });
    };

    const stopContext = (context) => {
      if (!context.rafId) return;
      cancelAnimationFrame(context.rafId);
      context.rafId = 0;
    };

    const startContext = (context) => {
      if (context.rafId || !context.visible || document.hidden) return;
      const tick = () => {
        if (!context.visible || document.hidden || !document.body.contains(context.surface)) {
          stopContext(context);
          return;
        }
        renderContext(context);
        context.rafId = requestAnimationFrame(tick);
      };
      context.rafId = requestAnimationFrame(tick);
    };

    const setContextVisible = (context, visible) => {
      context.visible = visible;
      if (visible) {
        startContext(context);
        return;
      }
      stopContext(context);
    };

    const syncVisibility = () => {
      contexts.forEach((context) => {
        if (document.hidden) {
          stopContext(context);
          return;
        }
        if (context.visible) startContext(context);
      });
    };

    window.addEventListener("resize", () => contexts.forEach(resize), { passive: true });
    document.addEventListener("visibilitychange", syncVisibility);

    const onPointerMove = (event) => {
      if (!window.__graphSurfaceDrag) return;
      const drag = window.__graphSurfaceDrag;
      const context = drag.context;
      const node = context?.nodes?.[drag.nodeIndex];
      if (!context || !node) return;

      const rect = context.stage.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;

      if (Math.abs(px - drag.pointerStartX) > 2 || Math.abs(py - drag.pointerStartY) > 2) {
        context.dragMoved = true;
      }

      node.pointerX = px;
      node.pointerY = py;
    };

    const onPointerUp = () => {
      if (!window.__graphSurfaceDrag) return;
      const { context, nodeIndex } = window.__graphSurfaceDrag;
      const node = context.nodes[nodeIndex];
      if (node) {
        const baseX = Number.isFinite(node.baseX) ? node.baseX : node.currentX;
        const baseY = Number.isFinite(node.baseY) ? node.baseY : node.currentY;
        node.dragX = node.pointerX - baseX;
        node.dragY = node.pointerY - baseY;
      }
      setNodeDragging(context, nodeIndex, false);
      context.activePointerId = null;
      window.__graphSurfaceDrag = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const context = contexts.find((item) => item.surface === entry.target);
              if (!context) return;
              setContextVisible(context, entry.isIntersecting || entry.intersectionRatio > 0);
            });
          },
          { rootMargin: "20% 0px 20% 0px", threshold: 0.05 },
        )
      : null;

    contexts.forEach((context) => {
      context.nodes.forEach((node, nodeIndex) => {
        node.el.addEventListener("pointerdown", (event) => {
          if (node.el.hidden || node.el.dataset.nodeHidden === "true") return;
          event.preventDefault();
          const rect = context.stage.getBoundingClientRect();
          const pointerX = event.clientX - rect.left;
          const pointerY = event.clientY - rect.top;

          window.__graphSurfaceDrag = {
            context,
            nodeIndex,
            pointerStartX: pointerX,
            pointerStartY: pointerY,
          };
          context.dragMoved = false;
          context.activePointerId = event.pointerId;
          node.pointerX = pointerX;
          node.pointerY = pointerY;
          setNodeDragging(context, nodeIndex, true);
          node.el.setPointerCapture?.(event.pointerId);
          window.addEventListener("pointermove", onPointerMove);
          window.addEventListener("pointerup", onPointerUp);
          window.addEventListener("pointercancel", onPointerUp);
        });

        node.el.addEventListener("click", (event) => {
          if (context.dragMoved) {
            event.preventDefault();
            event.stopPropagation();
          }
          context.dragMoved = false;
        });
      });

      if (observer) {
        observer.observe(context.surface);
      } else {
        setContextVisible(context, true);
      }
    });

    syncVisibility();
    return () => {
      contexts.forEach(stopContext);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  };

  const startResearchAtlas = () => {
    const atlases = [...document.querySelectorAll("[data-research-atlas]")].filter((atlas) => atlas.dataset.boundResearchAtlas !== "true");
    if (!atlases.length) return;
    const questions = researchQuestions();
    if (!questions.length) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    atlases.forEach((atlas) => {
      atlas.dataset.boundResearchAtlas = "true";
      const panel = atlas.querySelector("[data-research-atlas-panel]");
      const dots = atlas.querySelector("[data-research-atlas-dots]");
      const core = atlas.querySelector("[data-research-atlas-core]");
      const graphLink = atlas.querySelector("[data-research-atlas-graph-link]");
      let activeIndex = 0;
      let lastNavigation = 0;
      let touchStartX = 0;
      let touchStartY = 0;

      const setActive = (nextIndex, direction = 1, options = {}) => {
        const normalized = (nextIndex + questions.length) % questions.length;
        if (normalized === activeIndex && panel?.dataset.ready === "true") return;
        activeIndex = normalized;
        const question = questions[activeIndex];
        atlas.dataset.activeIndex = String(activeIndex);
        atlas.dataset.direction = direction > 0 ? "next" : "previous";
        const update = () => {
          if (panel) panel.innerHTML = researchQuestionBody(question, activeIndex, questions);
          syncResearchGraphNodes(atlas, question);
          if (dots) dots.innerHTML = researchDots(questions, activeIndex);
          if (core) core.textContent = researchCoreNumber(question, activeIndex);
          if (graphLink) graphLink.setAttribute("href", graphRouteForQuestion(question));
          panel && (panel.dataset.ready = "true");
          atlas.classList.remove("is-switching");
          atlas.classList.add("is-settled");
          window.setTimeout(() => atlas.classList.remove("is-settled"), 260);
        };

        if (reduceMotion || options.immediate) {
          update();
          return;
        }

        atlas.classList.add("is-switching");
        window.setTimeout(update, 140);
      };

      const navigate = (direction) => {
        const now = performance.now();
        if (now - lastNavigation < 420) return;
        lastNavigation = now;
        setActive(activeIndex + direction, direction);
      };

      atlas.querySelector("[data-research-atlas-prev]")?.addEventListener("click", () => navigate(-1));
      atlas.querySelector("[data-research-atlas-next]")?.addEventListener("click", () => navigate(1));
      atlas.querySelector("[data-research-atlas-title]")?.addEventListener("click", () => {
        atlas.querySelector("#research-atlas-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      dots?.addEventListener("click", (event) => {
        const target = event.target instanceof Element ? event.target.closest("[data-research-atlas-dot]") : null;
        if (!target) return;
        const next = Number(target.getAttribute("data-research-atlas-dot"));
        if (Number.isFinite(next)) setActive(next, next > activeIndex ? 1 : -1);
      });

      atlas.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaX) < 32 || Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
        event.preventDefault();
        navigate(event.deltaX > 0 ? 1 : -1);
      }, { passive: false });

      atlas.addEventListener("touchstart", (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }, { passive: true });

      atlas.addEventListener("touchend", (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
        navigate(dx < 0 ? 1 : -1);
      }, { passive: true });

      atlas.addEventListener("keydown", (event) => {
        const keys = ["ArrowRight", "ArrowDown", "PageDown", "ArrowLeft", "ArrowUp", "PageUp", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Home") setActive(0, -1);
        else if (event.key === "End") setActive(questions.length - 1, 1);
        else navigate(["ArrowRight", "ArrowDown", "PageDown"].includes(event.key) ? 1 : -1);
      });

      setActive(0, 1, { immediate: true });
    });
  };

  const pageLens = (type) => {
    const configs = {
      work: {
        eyebrow: "WORK LENS",
        title: "Work, roles and proof in one view.",
        copy: "Compare projects, roles and current evidence without leaving the page.",
        nodes: nodesFromItems((catalog.projects || []).filter((item) => item.visibility !== "internal"), {
          limit: 6,
          labelFor: (item) => item.title,
          noteFor: (item) => item.category || item.statusLabel || "Project",
          hrefFor: (item) => `./project.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-15rem", y: "-8rem", z: "-15rem", angle: "20deg" },
            { x: "14rem", y: "-8rem", z: "15rem", angle: "-18deg" },
            { x: "-17rem", y: "0rem", z: "7rem", angle: "4deg" },
            { x: "17rem", y: "1rem", z: "-8rem", angle: "-6deg" },
            { x: "-10rem", y: "13rem", z: "11rem", angle: "-42deg" },
            { x: "10rem", y: "13rem", z: "-13rem", angle: "-48deg" },
          ],
        }),
        links: [
          { label: "Projects", href: "./projects.html" },
          { label: "Search", href: "./search.html" },
        ],
      },
      projects: {
        eyebrow: "PROJECT MAP",
        title: "Projects grouped by role and evidence.",
        copy: "Each project keeps its purpose, status and connected context visible.",
        nodes: nodesFromItems(catalog.projects || [], {
          limit: 7,
          labelFor: (item) => item.title,
          noteFor: (item) => item.program || item.category || item.statusLabel || "Project",
          hrefFor: (item) => `./project.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-16rem", y: "-9rem", z: "-16rem" },
            { x: "15rem", y: "-8rem", z: "15rem" },
            { x: "-18rem", y: "0rem", z: "10rem" },
            { x: "18rem", y: "1rem", z: "-10rem" },
            { x: "-10rem", y: "15rem", z: "11rem" },
            { x: "10rem", y: "15rem", z: "-11rem" },
            { x: "0rem", y: "-18rem", z: "6rem" },
          ],
        }),
        links: [
          { label: "Work", href: "./work.html" },
          { label: "Research", href: "./research.html" },
        ],
      },
      research: {
        eyebrow: "RESEARCH FIELD",
        title: "Research questions and working branches.",
        copy: "Research fields, notes and programs stay connected to the systems they inform.",
        nodes: nodesFromItems(catalog.researchFields || [], {
          limit: 6,
          labelFor: (item) => item.title,
          noteFor: (item) => item.parent || item.type || "Field",
          hrefFor: (item) => `./entity.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-15rem", y: "-8rem", z: "-15rem" },
            { x: "15rem", y: "-7rem", z: "16rem" },
            { x: "-17rem", y: "1rem", z: "8rem" },
            { x: "17rem", y: "2rem", z: "-8rem" },
            { x: "-9rem", y: "14rem", z: "12rem" },
            { x: "9rem", y: "14rem", z: "-12rem" },
          ],
        }),
        links: [
          { label: "Programs", href: "./programs.html" },
          { label: "Archive", href: "./archive.html" },
        ],
      },
      programs: {
        eyebrow: "SYSTEM REGISTRY",
        title: "Programs by responsibility and status.",
        copy: "Lineage, ownership and current state stay visible.",
        nodes: nodesFromItems(catalog.programs || [], {
          limit: 7,
          labelFor: (item) => item.title,
          noteFor: (item) => item.systemGroup || item.statusLabel || item.type,
          hrefFor: (item) => `./entity.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-16rem", y: "-9rem", z: "-16rem" },
            { x: "16rem", y: "-8rem", z: "16rem" },
            { x: "-18rem", y: "0rem", z: "10rem" },
            { x: "18rem", y: "1rem", z: "-10rem" },
            { x: "-10rem", y: "15rem", z: "12rem" },
            { x: "10rem", y: "15rem", z: "-12rem" },
            { x: "0rem", y: "-18rem", z: "6rem" },
          ],
        }),
        links: [
          { label: "VASTE", href: "https://www.vaste.space/", target: "_blank" },
          { label: "Research", href: "./research.html" },
        ],
      },
      archive: {
        eyebrow: "ARCHIVE CONSOLE",
        title: "Archive traces with context.",
        copy: "Fragments, filters and links stay connected to their projects and research lines.",
        nodes: nodesFromItems(catalog.artefacts || [], {
          limit: 7,
          labelFor: (item) => item.title,
          noteFor: (item) => item.category || item.type || item.statusLabel || "Artefact",
          hrefFor: (item) => `./artefact.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-16rem", y: "-8rem", z: "-14rem" },
            { x: "16rem", y: "-8rem", z: "14rem" },
            { x: "-18rem", y: "0rem", z: "8rem" },
            { x: "18rem", y: "1rem", z: "-8rem" },
            { x: "-10rem", y: "14rem", z: "12rem" },
            { x: "10rem", y: "14rem", z: "-12rem" },
            { x: "0rem", y: "-17rem", z: "6rem" },
          ],
        }),
        links: [
          { label: "Search", href: "./search.html" },
          { label: "Work", href: "./work.html" },
        ],
      },
      contact: {
        eyebrow: "CONTACT",
        title: "Choose the right contact path.",
        copy: "Email, public channels and external links grouped by intent.",
        nodes: [
          { label: "Email", note: "Direct", href: "mailto:electronic.artefacts@gmail.com", x: "-15rem", y: "-8rem", z: "-14rem" },
          { label: "Instagram", note: "Social", href: "https://www.instagram.com/", target: "_blank", x: "15rem", y: "-8rem", z: "14rem" },
          { label: "VASTE", note: "External", href: "https://www.vaste.space/", target: "_blank", x: "-17rem", y: "1rem", z: "8rem" },
          { label: "Archive", note: "Browse", href: "./archive.html", x: "17rem", y: "1rem", z: "-8rem" },
        ],
        links: [
          { label: "Email", href: "mailto:electronic.artefacts@gmail.com" },
          { label: "Archive", href: "./archive.html" },
        ],
      },
    };
    const config = configs[type];
    if (!config) return "";
    return graphSurface({
      eyebrow: config.eyebrow,
      title: config.title,
      copy: config.copy,
      coreLabel: config.title,
      coreCopy: "Page graph",
      nodes: config.nodes || [],
      actions: config.links || [],
      variant: type,
    });
  };


  window.EA_SURFACE = {
    graphSurface,
    crossNavigation,
    uxSurface,
    nodesFromItems,
    ecosystemExplorer,
    researchAtlas,
    startGraphSurfaceAnimation,
    startResearchAtlas,
    pageLens,
  };
})();
