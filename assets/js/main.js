(function () {
  const catalog = window.EA_CATALOG || {};
  const page = document.body.dataset.page || "home";
  const filterState = new Map();
  const { esc, setYear, chunk } = window.EA_UTILS;
  const { loadIncludes } = window.EA_INCLUDES;
  const { statusBadge, entityBadge, chip, tagRow, relationList, metadataList, linkRow, metricRail, cardLinkAttrs, cardOverlayLink } =
    window.EA_UI;
  const { initFilters, initSearch, initCardLinks, initUXEnhancements, syncNavigationState, syncPageTitle } = window.EA_BEHAVIORS;

  const programmingLanguages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Rust",
    "Go",
    "C",
    "C++",
    "C#",
    "Java",
    "Kotlin",
    "Swift",
    "Objective-C",
    "Dart",
    "Ruby",
    "PHP",
    "Perl",
    "Lua",
    "Julia",
    "R",
    "MATLAB",
    "Scala",
    "Haskell",
    "OCaml",
    "F#",
    "Elixir",
    "Erlang",
    "Clojure",
    "Scheme",
    "Common Lisp",
    "Prolog",
    "Fortran",
    "COBOL",
    "Pascal",
    "Ada",
    "Assembly",
    "Bash",
    "PowerShell",
    "SQL",
    "PL/SQL",
    "T-SQL",
    "HTML",
    "CSS",
    "Sass",
    "Less",
    "XML",
    "JSON",
    "YAML",
    "Markdown",
    "TOML",
    "Nim",
    "Zig",
    "D",
    "Crystal",
    "V",
    "Haxe",
    "Nix",
    "Solidity",
    "VHDL",
    "Verilog",
    "Q#",
    "Smalltalk",
    "Groovy",
    "Forth",
    "ML",
    "ReasonML",
    "PureScript",
    "Elm",
    "ReScript",
    "CoffeeScript",
    "Hack",
    "Arduino",
    "Processing",
    "Max",
    "SuperCollider",
    "Ballerina",
    "Racket",
    "Lisp",
    "CLIPS",
    "Factor",
    "Fennel",
  ];

  const cardBaseAttrs = (item) => {
    const medium = (item.medium || []).join(" ");
    const discipline = (item.discipline || []).join(" ");
    const researchField = item.researchField || (item.relatedResearchFields || []).join(" ");
    const year = item.temporality?.creationYear || item.date || "";
    const image = cardImageFor(item);
    return `
      data-filter-card
      data-entry-id="${esc(item.id || "")}"
      ${image ? `data-card-media="true" style="--card-image:url('${esc(image.src)}');"` : ""}
      data-status="${esc(item.status || "")}"
      data-category="${esc(item.category || item.type || "")}"
      data-medium="${esc(medium)}"
      data-discipline="${esc(discipline)}"
      data-year="${esc(year)}"
      data-entity-type="${esc(item.kind || "")}"
      data-research-field="${esc(researchField)}"
      data-visibility="${esc(item.visibility || "")}"
      data-maturity="${esc(item.maturity || "")}"
      data-confidence="${esc(item.confidence || "")}"
      data-kind="${esc(item.kind || "")}"
    `;
  };

  const mediaFrom = (entry) => {
    const gallery = entry?.media?.gallery || [];
    if (!gallery.length) return null;
    return (
      gallery.find((image) => String(image.src || "").includes("palimpsests.jpg")) ||
      gallery.find((image) => String(image.src || "").match(/cover|logo/i)) ||
      gallery[0]
    );
  };

  const mediaKindFor = (media) => {
    const explicitKind = String(media?.mediaType || media?.type || "").toLowerCase();
    if (explicitKind === "image" || explicitKind === "video") return explicitKind;
    const src = String(media?.src || "").toLowerCase();
    if (/\.(mov|mp4|m4v|webm)(?:[?#]|$)/.test(src)) return "video";
    return "image";
  };

  const mediaFigureMarkup = (media, item, className = "project-gallery__media") => {
    const mediaKind = mediaKindFor(media);
    if (mediaKind === "video") {
      return `
        <video class="${className}" controls playsinline preload="metadata">
          <source src="${esc(media.src)}" />
          ${esc(media.alt || item.title || "Project video")}
        </video>
      `;
    }
    return `<img class="${className}" src="${esc(media.src)}" alt="${esc(media.alt || item.title)}" loading="lazy" />`;
  };

  const projectSignatureBubble = (item, variant = "card") => {
    if (item?.id !== "oeil-de-meg") return "";
    return `
      <span class="project-meg-badge project-meg-badge--${esc(variant)}" aria-hidden="true">
        <img class="project-meg-badge__picto" src="./assets/media/projects/oeil-de-meg/oeil-de-meg-picto.svg" alt="" loading="lazy" />
      </span>
    `;
  };

  const projectButterflyBubble = (item, variant = "card") => {
    if (item?.id !== "oeil-de-meg") return "";
    return `
      <span class="project-mark-bubble project-mark-bubble--${esc(variant)} project-mark-bubble--butterfly" aria-hidden="true">
        <span class="project-mark-bubble__coin">
          <img class="project-mark-bubble__picto project-mark-bubble__picto--butterfly" src="./assets/media/projects/oeil-de-meg/wing.png" alt="" loading="lazy" />
        </span>
      </span>
    `;
  };

  const vasteEngineMarkup = () => `
    <div class="vast-engine" data-vast-engine aria-hidden="true">
      <svg viewBox="0 0 500 400" role="presentation" focusable="false">
        <circle class="vast-engine__cutout" cx="110" cy="130" r="45" />
        <circle class="vast-engine__cutout" cx="240" cy="292" r="45" />
        <circle class="vast-engine__cutout" cx="390" cy="175" r="45" />

        <circle class="vast-engine__nucleus" cx="110" cy="130" r="10" fill="#7dd3fc" />
        <circle class="vast-engine__nucleus" cx="240" cy="292" r="10" fill="#38bdf8" />
        <circle class="vast-engine__nucleus" cx="390" cy="175" r="10" fill="#1d4ed8" />

        <path class="vast-engine__link" d="M 145 170 L 215 255" />
        <path class="vast-engine__link" d="M 355 205 L 275 255" />

        <circle class="vast-engine__node" cx="110" cy="130" r="45" />
        <circle class="vast-engine__node" cx="240" cy="292" r="45" />
        <circle class="vast-engine__node" cx="390" cy="175" r="45" />
      </svg>
    </div>
  `;

  const startVasteEngineAnimation = () => {
    const root = document.querySelector("[data-vast-engine]");
    if (!root || root.dataset.vastEngineAnimated === "true") return;
    root.dataset.vastEngineAnimated = "true";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const links = [...root.querySelectorAll(".vast-engine__link")];
    const nodes = [...root.querySelectorAll(".vast-engine__node")];
    const cutouts = [...root.querySelectorAll(".vast-engine__cutout")];
    const nuclei = [...root.querySelectorAll(".vast-engine__nucleus")];
    const baseRadii = [45, 45, 45];
    const basePositions = [
      { x: 110, y: 130 },
      { x: 240, y: 292 },
      { x: 390, y: 175 },
    ];

    let phase = 0;

    const animate = () => {
      if (!document.body.contains(root)) return;

      phase += 0.02;

      const energies = [
        (Math.sin(phase) + 1) * 0.5,
        (Math.sin(phase - 1.15) + 1) * 0.5,
        (Math.sin(phase - 2.3) + 1) * 0.5,
      ];

      links[0].style.strokeWidth = (1.5 + energies[0] * 9.5).toFixed(2);
      links[1].style.strokeWidth = (1.5 + energies[2] * 9.5).toFixed(2);
      links[0].style.opacity = (0.45 + energies[0] * 0.5).toFixed(2);
      links[1].style.opacity = (0.45 + energies[2] * 0.5).toFixed(2);

      nodes.forEach((node, index) => {
        const energy = energies[index];
        const floatX = Math.sin(phase * 0.8 + index * 1.7) * 4;
        const floatY = Math.cos(phase * 0.9 + index * 1.3) * 6;

        const x = basePositions[index].x + floatX;
        const y = basePositions[index].y + floatY;
        const radius = baseRadii[index] + energy * 16;
        const stroke = 10.5 - energy * 7.5;

        node.setAttribute("cx", x.toFixed(2));
        node.setAttribute("cy", y.toFixed(2));
        node.setAttribute("r", radius.toFixed(2));
        node.style.strokeWidth = stroke.toFixed(2);
        node.style.filter = `drop-shadow(0 0 ${8 + energy * 20}px rgba(255,255,255,${(0.08 + energy * 0.18).toFixed(2)}))`;

        cutouts[index].setAttribute("cx", x.toFixed(2));
        cutouts[index].setAttribute("cy", y.toFixed(2));
        cutouts[index].setAttribute("r", (radius + 0.5).toFixed(2));

        const nucleus = nuclei[index];
        const nucleusRadius = Math.min(8 + energy * 22, Math.max(4, radius - stroke - 2));
        const nucleusHue = [195, 202, 215][index] + energy * 24;
        const nucleusColor = `hsl(${nucleusHue}, ${85 + energy * 15}%, ${52 + energy * 18}%)`;

        nucleus.setAttribute("cx", x.toFixed(2));
        nucleus.setAttribute("cy", y.toFixed(2));
        nucleus.setAttribute("r", nucleusRadius.toFixed(2));
        nucleus.setAttribute("fill", nucleusColor);
        nucleus.style.opacity = (0.72 + energy * 0.28).toFixed(2);
        nucleus.style.filter = `drop-shadow(0 0 ${10 + energy * 24}px ${nucleusColor})`;
      });

      const leftNode = {
        x: parseFloat(nodes[0].getAttribute("cx")),
        y: parseFloat(nodes[0].getAttribute("cy")),
      };
      const centerNode = {
        x: parseFloat(nodes[1].getAttribute("cx")),
        y: parseFloat(nodes[1].getAttribute("cy")),
      };
      const rightNode = {
        x: parseFloat(nodes[2].getAttribute("cx")),
        y: parseFloat(nodes[2].getAttribute("cy")),
      };

      const leftRadius = parseFloat(nodes[0].getAttribute("r"));
      const centerRadius = parseFloat(nodes[1].getAttribute("r"));
      const rightRadius = parseFloat(nodes[2].getAttribute("r"));

      const leftDx = centerNode.x - leftNode.x;
      const leftDy = centerNode.y - leftNode.y;
      const leftDistance = Math.hypot(leftDx, leftDy) || 1;
      const leftUnitX = leftDx / leftDistance;
      const leftUnitY = leftDy / leftDistance;
      const leftStartX = leftNode.x + leftUnitX * leftRadius;
      const leftStartY = leftNode.y + leftUnitY * leftRadius;
      const leftEndX = centerNode.x - leftUnitX * centerRadius;
      const leftEndY = centerNode.y - leftUnitY * centerRadius;

      const rightDx = centerNode.x - rightNode.x;
      const rightDy = centerNode.y - rightNode.y;
      const rightDistance = Math.hypot(rightDx, rightDy) || 1;
      const rightUnitX = rightDx / rightDistance;
      const rightUnitY = rightDy / rightDistance;
      const rightStartX = rightNode.x + rightUnitX * rightRadius;
      const rightStartY = rightNode.y + rightUnitY * rightRadius;
      const rightEndX = centerNode.x - rightUnitX * centerRadius;
      const rightEndY = centerNode.y - rightUnitY * centerRadius;

      links[0].setAttribute("d", `M ${leftStartX} ${leftStartY} L ${leftEndX} ${leftEndY}`);
      links[1].setAttribute("d", `M ${rightStartX} ${rightStartY} L ${rightEndX} ${rightEndY}`);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const cardImageFor = (item) => {
    const direct = mediaFrom(item);
    if (direct) return direct;

    const relationIds = [
      item.project,
      ...(item.relatedProjects || []),
      ...(item.relations?.partOf || []),
      ...(item.relations?.parent || []),
      ...(item.relations?.relatedTo || []),
      ...(item.relations?.influences || []),
    ]
      .filter(Boolean)
      .map((value) => String(value));

    for (const id of relationIds) {
      const entry = catalog.indexes?.byId?.[id];
      const image = mediaFrom(entry);
      if (image) return image;
    }

    if (item.kind === "collection" && window.EA_COLLECTIONS?.resolve) {
      const member = window.EA_COLLECTIONS.resolve(item, catalog).find((entry) => mediaFrom(entry));
      const image = mediaFrom(member);
      if (image) return image;
    }

    return null;
  };

  const signalStrip = (item) => {
    const signals = [item.status, item.category, ...(item.medium || []), ...(item.discipline || [])].filter(Boolean).slice(0, 6);
    if (!signals.length) return "";
    return `
      <div class="card-signal" aria-hidden="true">
        ${signals.map((signal, index) => `<span style="--signal-index:${index};" title="${esc(signal)}"></span>`).join("")}
      </div>
    `;
  };

  const cardCopy = (text, lines = 2) => {
    if (!text) return "";
    return `<p class="card__copy card__copy--clamp-${Math.max(1, Math.min(4, lines))}">${esc(text)}</p>`;
  };

  const metricFill = (count, total) => (total > 0 ? Math.max(0.18, Math.min(1, count / total)) : 0.42);

  const summaryMetrics = (item, mode = "project") => {
    const mediumCount = (item.medium || []).length;
    const disciplineCount = (item.discipline || []).length;
    const galleryCount = (item.media?.gallery || []).length;
    const relatedCount = Object.values(item.relations || {}).flat().filter(Boolean).length;
    const layerCount = (item.architecture?.layers || []).length;
    const signalCount = [...(item.medium || []), ...(item.discipline || [])].filter(Boolean).length;
    const updatedYear = item.temporality?.lastUpdated ? String(item.temporality.lastUpdated).slice(0, 4) : item.temporality?.creationYear || item.date || "";
    const statusValue = item.statusLabel || item.status || "Active";

    const variants = {
      project: [
        { label: "STATUS", value: statusValue, note: updatedYear ? `Updated ${updatedYear}` : "", fill: 0.92, tone: "live" },
        { label: "SIGNALS", value: `${signalCount}`, note: countLabel(signalCount, "cue"), fill: metricFill(signalCount, 8), tone: "visual" },
        { label: "MEDIA", value: `${galleryCount}`, note: countLabel(galleryCount, "asset"), fill: metricFill(galleryCount, 12), tone: "archive" },
      ],
      archive: [
        { label: "FIELD", value: item.researchField || item.category || item.type || "Archive", note: item.project || "", fill: 0.82, tone: "archive" },
        { label: "RELATION", value: `${relatedCount}`, note: countLabel(relatedCount, "link"), fill: metricFill(relatedCount, 6), tone: "system" },
        { label: "DATE", value: item.date || updatedYear || "—", note: item.artist || item.type || "", fill: 0.58, tone: "live" },
      ],
      research: [
        { label: "FIELD", value: item.researchField || item.category || "Research", note: item.statusLabel || statusValue, fill: 0.82, tone: "research" },
        { label: "PROJECTS", value: `${(item.relatedProjects || []).length}`, note: countLabel((item.relatedProjects || []).length, "project"), fill: metricFill((item.relatedProjects || []).length, 8), tone: "system" },
        { label: "ARTIFACTS", value: `${(item.relatedArtefacts || []).length}`, note: countLabel((item.relatedArtefacts || []).length, "artefact"), fill: metricFill((item.relatedArtefacts || []).length, 8), tone: "archive" },
      ],
      person: [
        { label: "ROLE", value: item.role || item.type || "Person", note: item.statusLabel || statusValue, fill: 0.82, tone: "surface" },
        { label: "PROJECTS", value: `${(item.relatedProjects || []).length}`, note: countLabel((item.relatedProjects || []).length, "project"), fill: metricFill((item.relatedProjects || []).length, 8), tone: "system" },
        { label: "LAYER", value: `${mediumCount + disciplineCount}`, note: "signals", fill: metricFill(mediumCount + disciplineCount, 10), tone: "visual" },
      ],
      program: [
        { label: "STATUS", value: statusValue, note: updatedYear ? `Updated ${updatedYear}` : "", fill: 0.92, tone: "live" },
        { label: "DOMAIN", value: item.domain || item.systemGroup || item.type || "Program", note: item.category || "", fill: 0.78, tone: "system" },
        { label: "SIGNALS", value: `${signalCount}`, note: countLabel(signalCount, "cue"), fill: metricFill(signalCount, 8), tone: "research" },
      ],
    };

    return metricRail(variants[mode] || variants.project, { limit: 3, compact: true });
  };

  const countLabel = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`;

  const entityDateValue = (item) => {
    const value = item?.temporality?.lastUpdated || item?.temporality?.releaseDate || item?.temporality?.creationDate || item?.date || "";
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const homeProjects = (excludeIds = []) =>
    (catalog.projects || [])
      .filter((item) => item.visibility !== "internal" && !excludeIds.includes(item.id))
      .slice()
      .sort((a, b) => entityDateValue(b) - entityDateValue(a));

  const featuredProjectForHome = (excludeIds = []) => homeProjects(excludeIds).find((item) => cardImageFor(item)) || homeProjects(excludeIds)[0] || null;

  const projectHeroMedia = (item) => {
    const media = mediaFrom(item) || cardImageFor(item);
    if (!media) return "";
    return mediaFigureMarkup(media, item, "project-immersive__image");
  };

  const homeCardPills = (item) => {
    if (!item) return [];
    if (item.id === "oeil-de-meg") return ["Photography CRM", "Portfolio", "Live site", "WordPress"];
    if (item.id === "palimpsests") return ["Album cycle", "ORETH", "Five acts", "Archive"];

    const pills = [
      item.category || item.type || item.kind || "",
      item.statusLabel || item.status || "",
      item.temporality?.creationYear || "",
      item.links?.[0]?.label || item.program || "",
    ];

    return pills.filter(Boolean).slice(0, 4);
  };

  const projectCard = (item) => `
    <article class="project-card" ${cardBaseAttrs(item)}>
      ${item.kind === "project" ? `<a class="project-card__overlay-link" href="./project.html?id=${encodeURIComponent(item.id)}" aria-label="Open ${esc(item.title)} detail"></a>` : ""}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || catalog.entityTypes?.[item.kind] || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        <div class="project-card__top-meta">
          ${item.id === "oeil-de-meg" ? chip("PHP") : ""}
          ${statusBadge(item.status, item.statusLabel)}
          ${projectSignatureBubble(item, "card")}
        </div>
      </div>
      ${cardCopy(item.summary, 1)}
      ${signalStrip(item)}
      ${summaryMetrics(item, "project")}
      ${metadataList([
        { label: "Artist", value: item.artist },
        { label: "Program", value: item.program },
      ])}
    </article>
  `;

  const projectLandingCard = (item) => `
    <article class="project-card${item.id === "oeil-de-meg" ? " project-card--oeil-de-meg" : ""}" data-project-detail-link="${esc(item.route || `./project.html?id=${encodeURIComponent(item.id)}`)}" tabindex="0" role="link" aria-label="Open ${esc(item.title)} detail" ${cardBaseAttrs(item)}>
      <a class="project-card__overlay-link" href="${esc(item.route || `./project.html?id=${encodeURIComponent(item.id)}`)}" aria-label="Open ${esc(item.title)} detail"></a>
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.category || item.type || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        <div class="project-card__top-meta">
          ${item.id === "oeil-de-meg" ? chip("PHP") : ""}
          ${statusBadge(item.status, item.statusLabel)}
          ${projectSignatureBubble(item, "card")}
        </div>
      </div>
      ${cardCopy(item.summary, 1)}
      ${signalStrip(item)}
      ${tagRow(homeCardPills(item), { limit: 4, compact: true })}
    </article>
  `;

  const archiveCard = (item) => `
    <article class="archive-card" ${cardBaseAttrs(item)}>
      <div class="archive-card__header">
        <div class="archive-card__identity">
          <p class="card__meta">${esc(item.type || "ARCHIVE")}${item.category ? ` · ${esc(item.category)}` : ""}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
          ${cardCopy(item.summary, 1)}
          ${signalStrip(item)}
        </div>
        <div class="archive-card__status">
          ${statusBadge(item.status, item.statusLabel)}
          ${item.date ? chip(`Date: ${item.date}`) : ""}
        </div>
      </div>
      ${summaryMetrics(item, "archive")}
      ${linkRow(item.cta || item.links?.[0] || null)}
    </article>
  `;

  const researchCard = (item, options = {}) => `
    <article class="project-card research-dossier-card${options.featured ? " research-dossier-card--featured" : ""}" ${cardBaseAttrs(item)} ${cardLinkAttrs(options.href, options.label || `Open ${item.title}`)}>
      ${cardOverlayLink(options.href, options.label || `Open ${item.title}`)}
      <div class="research-dossier-card__top">
        <div class="research-dossier-card__identity">
          <p class="card__meta">${esc(item.type || "RESEARCH FIELD")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
          <p class="research-dossier-card__subtitle">${esc(item.subtitle || item.statusLabel || item.maturity || "")}</p>
        </div>
        <div class="research-dossier-card__top-meta">
          ${typeof options.index === "number" ? `<span class="research-dossier-card__index">0${options.index + 1}</span>` : ""}
          ${statusBadge(item.status, item.statusLabel)}
        </div>
      </div>
      ${cardCopy(item.summary, 1)}
      <div class="research-dossier-card__facts">
        <div class="research-dossier-card__fact">
          <span>Projects</span>
          <strong>${esc((item.relatedProjects || []).length)}</strong>
        </div>
        <div class="research-dossier-card__fact">
          <span>Programs</span>
          <strong>${esc((item.relatedPrograms || []).length)}</strong>
        </div>
        <div class="research-dossier-card__fact">
          <span>Artefacts</span>
          <strong>${esc((item.relatedArtefacts || []).length)}</strong>
        </div>
      </div>
      <div class="tag-cluster tag-cluster--compact research-dossier-card__signals">
        ${[
          item.maturity,
          item.confidence,
          item.visibility,
          item.relations?.partOf?.[0],
        ]
          .filter(Boolean)
          .map((value) => `<span class="chip">${esc(catalog.taxonomies?.maturity?.[value]?.label || catalog.taxonomies?.confidence?.[value]?.label || catalog.taxonomies?.visibility?.[value]?.label || value)}</span>`)
          .join("")}
      </div>
      ${signalStrip(item)}
      ${tagRow([...(item.tags || []), ...(item.medium || []), ...(item.discipline || [])], { limit: 4, compact: true })}
    </article>
  `;

  const personCard = (item, options = {}) => `
    <article class="project-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(options.href, options.label || `Open ${item.title}`)}>
      ${cardOverlayLink(options.href, options.label || `Open ${item.title}`)}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "ARTIST")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardCopy(item.summary, 1)}
      ${signalStrip(item)}
      ${summaryMetrics(item, "person")}
      ${metadataList([{ label: "Kind", value: item.kind }])}
    </article>
  `;

  const programCard = (item, options = {}) => `
    <article class="program-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(options.href, options.label || `Open ${item.title}`)}>
      ${cardOverlayLink(options.href, options.label || `Open ${item.title}`)}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "PROGRAM")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardCopy(item.summary, 1)}
      ${signalStrip(item)}
      ${summaryMetrics(item, "program")}
    </article>
  `;

  const channelCard = (item) => `
    <article class="program-card" ${cardBaseAttrs(item)}>
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "CHANNEL")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardCopy(item.summary, 1)}
      ${signalStrip(item)}
      ${summaryMetrics(item, "program")}
    </article>
  `;

  const taxonomyPanel = (scope, title, description, groups, extraClass = "") => `
    <section class="zone-card hero taxonomy-panel ${esc(extraClass)}" data-filter-scope="${esc(scope)}">
      <div class="section-head">
        <p class="eyebrow">${esc(title)}</p>
        <h2>${esc(description.heading)}</h2>
        <p class="lede">${esc(description.copy)}</p>
      </div>
      <div class="taxonomy-grid">
        ${groups
          .map(
            (group) => `
              <div class="taxonomy-column${group.options.length > 6 ? " taxonomy-column--scroll" : ""}">
                <p class="card__meta">${esc(group.label)}</p>
                <div
                  class="pill-cloud taxonomy-pill-row"
                  data-filter-group="${esc(group.key)}"
                  style="flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;-webkit-overflow-scrolling:touch;"
                >
                  ${group.options
                    .map(
                      (option) => `
                        <button
                          class="filter-chip${option.active ? " is-active" : ""}"
                          type="button"
                          aria-pressed="${option.active ? "true" : "false"}"
                          data-filter-toggle
                          data-filter-key="${esc(group.key)}"
                          data-filter-value="${esc(option.value)}"
                        >
                          ${esc(option.label)}
                        </button>
                      `,
                    )
                    .join("")}
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const manifestPanel = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">STUDIO MANIFEST</p>
        <h2>Three layers.</h2>
      </div>
      <div class="stat-grid">
        ${[
          {
            label: "Layer 01",
            title: "Studio & Label",
            copy: "Identity, releases and public signals.",
          },
          {
            label: "Layer 02",
            title: "Recording Artist",
            copy: "ORETH carries the cycle.",
          },
          {
            label: "Layer 03",
            title: "Research Program",
            copy: "VASTE stays external as the research spine.",
          },
        ]
          .map(
            (item) => `
              <article class="stat-card">
                <p class="card__meta">${esc(item.label)}</p>
                <strong>${esc(item.title)}</strong>
                <span>${esc(item.copy)}</span>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const featuredWork = () => {
    const palimpsests = catalog.projects?.find((item) => item.id === "palimpsests");
    if (!palimpsests) return "";
    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PALIMPSESTS</p>
          <h2>Palimpsests.</h2>
          <p class="lede">A single image, then the record.</p>
        </div>
        <a class="project-immersive__hero project-immersive__hero--home project-immersive__hero--palimpsests" href="./palimpsests.html" aria-label="Open Palimpsests project page">
          <div class="project-immersive__hero-backdrop" aria-hidden="true">
            <span class="project-immersive__hero-title">PALIMPSESTS</span>
          </div>
          <div class="project-immersive__hero-copy">
            <p class="card__meta">Featured project</p>
            <h3 class="display-title">Palimpsests</h3>
            <p class="lede">Open the cycle.</p>
            <div class="button-row button-row--compact">
              <span class="button button--primary">Open project</span>
              <span class="button button--secondary">View the record</span>
            </div>
          </div>
          <div class="project-immersive__hero-visual">
            <div class="project-immersive__hero-panel">
              <figure class="project-immersive__frame project-immersive__frame--lead project-immersive__frame--home project-immersive__frame--palimpsests">
                <img class="project-immersive__image project-immersive__image--palimpsests" src="./assets/media/projects/palimpsests/palimpsests-hero.png" alt="Palimpsests cover artwork" loading="lazy" />
              </figure>
            </div>
          </div>
        </a>
        <div class="link-row">
          <a class="tag" href="./palimpsests.html">Palimpsests</a>
          <a class="tag" href="./archive.html">Archive</a>
          <a class="tag" href="./contact.html">Contact</a>
        </div>
      </section>
    `;
  };

  const vasteBanner = () => `
    <section class="zone-card hero latests-panel" id="latests">
      <div class="section-head">
        <p class="eyebrow">LATESTS</p>
        <h2>Current project image.</h2>
        <p class="lede">The latest work, then the runtime line.</p>
      </div>
      <div class="latests-grid latests-grid--cinematic">
        ${(() => {
          const featured = featuredProjectForHome(["palimpsests"]);
          if (!featured) return "";
          return `
            <article class="project-card project-card--featured${featured.id === "oeil-de-meg" ? " project-card--oeil-de-meg" : ""}" ${cardBaseAttrs(featured)} ${cardLinkAttrs(featured.route || `./project.html?id=${encodeURIComponent(featured.id)}`, `Open ${featured.title}`)}>
              ${cardOverlayLink(featured.route || `./project.html?id=${encodeURIComponent(featured.id)}`, `Open ${featured.title}`)}
              ${projectButterflyBubble(featured, "hero")}
              <div class="project-card__top">
                <div>
                  <p class="card__meta">${esc(featured.category || featured.type || "PROJECT")}</p>
                  <h3 class="card__title">${esc(featured.title)}</h3>
                </div>
                ${statusBadge(featured.status, featured.statusLabel)}
              </div>
              ${cardCopy(featured.summary || featured.description, 2)}
              ${tagRow(featured.tags || [], { limit: 4, compact: true })}
              <div class="link-row">
                <a class="tag" href="${esc(featured.route || `./project.html?id=${encodeURIComponent(featured.id)}`)}">Open project</a>
                <a class="tag" href="./work.html">Work</a>
              </div>
            </article>
          `;
        })()}
        ${(() => {
          const vaste = catalog.programs?.find((item) => item.id === "vaste") || {};
          const vasteAttrs = `
            data-filter-card
            data-entry-id="${esc(vaste.id || "vaste")}"
            data-status="${esc(vaste.status || "")}"
            data-category="${esc(vaste.category || vaste.type || "")}"
            data-medium="${esc((vaste.medium || []).join(" "))}"
            data-discipline="${esc((vaste.discipline || []).join(" "))}"
            data-year="${esc(vaste.temporality?.creationYear || vaste.date || "")}"
            data-entity-type="${esc(vaste.kind || "")}"
            data-research-field="${esc(vaste.researchField || (vaste.relatedResearchFields || []).join(" "))}"
            data-visibility="${esc(vaste.visibility || "")}"
            data-maturity="${esc(vaste.maturity || "")}"
            data-confidence="${esc(vaste.confidence || "")}"
            data-kind="${esc(vaste.kind || "")}"
          `;
          return `
        <article class="program-card latests-panel__cta vast-banner vast-banner--cinematic" ${vasteAttrs}>
          <div class="vast-banner__shell">
            <div class="vast-banner__content">
              <p class="card__meta">CONCEPT CTA</p>
              <h3 class="vast-banner__title">VASTE</h3>
              <p class="vast-banner__copy">Open the runtime.</p>
              <div class="pill-cloud vast-banner__chips" aria-label="VASTE attributes">
                <span class="chip">Runtime</span>
                <span class="chip">Graph systems</span>
                <span class="chip">Research engine</span>
              </div>
            </div>
            ${vasteEngineMarkup()}
            <div class="button-row button-row--compact vast-banner__actions">
              <a class="button button--primary" href="https://www.vaste.space/" target="_blank" rel="noreferrer">Open VASTE</a>
              <a class="button button--secondary" href="./research.html">Research</a>
            </div>
          </div>
        </article>
          `;
        })()}
      </div>
    </section>
  `;

  const featuredResearch = () => {
    const projects = homeProjects(["palimpsests"]).filter((item) => item.route || item.kind === "project");
    if (!projects.length) return "";
    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">WORK</p>
          <h2>Selected works.</h2>
          <p class="lede">One route per project.</p>
        </div>
        <div class="work-carousel" role="list" aria-label="Dedicated projects carousel">
          <div class="work-carousel__track">
            ${projects
              .slice(0, 5)
              .map(
                (item) => `
                  <div class="work-carousel__item" role="listitem">
                    ${projectLandingCard(item)}
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="link-row">
          <a class="tag" href="./projects.html">Projects</a>
          <a class="tag" href="./work.html">Work archive</a>
        </div>
      </section>
    `;
  };

  const latestArtefacts = () => {
    const latest = (catalog.artefacts || []).slice(0, 3);
    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">LATEST ARTEFACTS</p>
          <h2>Current fragments</h2>
        </div>
        <div class="card-grid card-grid--three">
          ${latest
            .map(
              (item) => `
                <article class="panel panel--soft card-link-surface" ${cardBaseAttrs(item)} ${cardLinkAttrs(`./artefact.html?id=${encodeURIComponent(item.id)}`, `Open ${item.title}`)}>
                  ${cardOverlayLink(`./artefact.html?id=${encodeURIComponent(item.id)}`, `Open ${item.title}`)}
                  <p class="card__meta">${esc(item.type)}</p>
                  <h3 class="card__title">${esc(item.title)}</h3>
                  ${cardCopy(item.summary, 2)}
                  <div class="project-card__meta">
                    ${statusBadge(item.status, item.statusLabel)}
                    ${chip(item.project)}
                  </div>
                  <div class="link-row">
                    <a class="tag" href="./archive.html">Archive</a>
                    <a class="tag" href="./work.html">Work</a>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  };

  const graphSurface = ({
    eyebrow,
    title,
    copy,
    coreLabel,
    coreCopy,
    nodes = [],
    actions = [],
    variant = "default",
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
                      `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}" href="${esc(action.href)}"${action.target ? ` target="${esc(action.target)}" rel="noreferrer"` : ""}>${esc(action.label)}</a>`,
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
        <div class="graph-surface__core" aria-hidden="true">
          <strong>${esc(coreLabel || title)}</strong>
          ${coreCopy ? `<small>${esc(coreCopy)}</small>` : ""}
        </div>
        ${nodes
          .map(
            (node, index) => {
              const tag = node.href ? "a" : "button";
              const attrs = [
                node.href ? `href="${esc(node.href)}"` : "",
                node.target ? `target="${esc(node.target)}" rel="noreferrer"` : "",
                node.label ? `aria-label="${esc(node.label)}"` : "",
              ]
                .filter(Boolean)
                .join(" ");
              return `
                <${tag}
                  class="graph-surface__node"
                  data-graph-node
                  data-node-index="${index}"
                  data-node-label="${esc(node.label || "")}"
                  ${attrs}
                  style="--x:${esc(node.x || "0rem")};--y:${esc(node.y || "0rem")};--z:${esc(node.z || "0rem")};--node-color:${esc(node.color || "rgba(234,220,207,0.9)")};"
                ></${tag}>
              `;
            },
          )
          .join("")}
      </div>
    </section>
  `;

  const crossNavigation = () =>
    graphSurface({
      eyebrow: "ATLAS",
      title: "A site held together by orbiting routes.",
      copy: "Pages stay linked through the same frame: work, research, archive, contact and the external stack.",
      coreLabel: catalog.ecosystem?.root || "Electronic Artefacts",
      coreCopy: "Central node",
      nodes: [
        { label: "WORK", note: "Projects", href: "./work.html", x: "-12rem", y: "-7rem", z: "-18rem", angle: "28deg", length: "13rem" },
        { label: "PROJECTS", note: "Routes", href: "./projects.html", x: "11rem", y: "-6rem", z: "16rem", angle: "-26deg", length: "12rem" },
        { label: "PROGRAMS", note: "Stack", href: "./programs.html", x: "-15rem", y: "1rem", z: "8rem", angle: "6deg", length: "14rem" },
        { label: "RESEARCH", note: "Fields", href: "./research.html", x: "14rem", y: "2rem", z: "-8rem", angle: "-8deg", length: "15rem" },
        { label: "ARCHIVE", note: "Fragments", href: "./archive.html", x: "-9rem", y: "10rem", z: "12rem", angle: "-44deg", length: "11rem" },
        { label: "ABOUT", note: "Lineage", href: "./about.html", x: "9rem", y: "11rem", z: "-14rem", angle: "-54deg", length: "10rem" },
        { label: "CONTACT", note: "Links", href: "./contact.html", x: "0rem", y: "-14rem", z: "6rem", angle: "90deg", length: "14rem" },
        { label: "VASTE", note: "External", href: "https://www.vaste.space/", target: "_blank", x: "0rem", y: "14rem", z: "-4rem", angle: "-90deg", length: "13rem", emphasis: true },
      ],
    });

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

  const ecosystemExplorer = () => {
    const projects = catalog.projects?.length || 0;
    const programs = catalog.programs?.length || 0;
    const artefacts = catalog.artefacts?.length || 0;
    const research = catalog.researchFields?.length || 0;
    return uxSurface(
      "LAYER",
      "Signals in orbit.",
      "Quick routes, linked surfaces and current status, all held in one frame.",
      [
        { label: "Projects", value: String(projects), level: 76 },
        { label: "Programs", value: String(programs), level: 88 },
        { label: "Artefacts", value: String(artefacts), level: 64 },
        { label: "Research", value: String(research), level: 70 },
        { label: "Routes", value: "8", level: 92 },
      ],
      [
        { label: "Search", href: "./search.html" },
        { label: "Archive", href: "./archive.html" },
        { label: "VASTE", href: "https://www.vaste.space/", target: "_blank" },
      ],
    );
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
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "600 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.label, 0, radius + 8);
      ctx.restore();
    };

    let rafId = 0;
    const render = () => {
      contexts.forEach((context) => {
        if (!document.body.contains(context.surface)) return;

        const rect = context.stage.getBoundingClientRect();
        if (rect.width !== context.width || rect.height !== context.height) {
          resize(context);
        }

        const { ctx, width, height, centerX, centerY, minDim } = context;
        const t = performance.now() * 0.001;

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

        const orbit1 = minDim * 0.38;
        const orbit2 = minDim * 0.22;
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbit1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbit2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(22, minDim * 0.08), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(234,220,207,0.12)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.88)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const positions = context.nodes.map((node, index) => {
          const angle = t * 0.25 + index * (Math.PI * 2 / context.nodes.length);
          const radiusBase = orbit1 - 26 - index * 5;
          const wobble = Math.sin(t * 1.2 + index) * 12;
          const depth = Math.sin(t * 0.9 + index * 1.3);
          const baseX = centerX + Math.cos(angle) * (radiusBase + wobble * 0.25);
          const baseY = centerY + Math.sin(angle * 0.95) * (orbit2 + wobble * 0.15);
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
      });

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", () => contexts.forEach(resize), { passive: true });

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

    contexts.forEach((context) => {
      context.nodes.forEach((node, nodeIndex) => {
        node.el.addEventListener("pointerdown", (event) => {
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
    });

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  };

  const pageLens = (type) => {
    const configs = {
      work: {
        eyebrow: "WORK LENS",
        title: "Work in orbit.",
        copy: "Projects, roles and signals stay on the same plane.",
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
        title: "Project constellation.",
        copy: "Each route keeps its own orbit.",
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
        title: "Theory, branching.",
        copy: "VOID expands into fields, notes and translations.",
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
        title: "System lattice.",
        copy: "Lineage, grouping and status stay visible.",
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
        title: "Archive field.",
        copy: "Fragments, filters and links drift together.",
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
      about: {
        eyebrow: "ECOSYSTEM VIEW",
        title: "Lineage map.",
        copy: "Method, pillars and network.",
        nodes: [
          { label: "VOID", note: "Theory", href: "./research.html", x: "-15rem", y: "-8rem", z: "-15rem" },
          { label: "PALIMPSESTS", note: "Art", href: "./work.html", x: "15rem", y: "-8rem", z: "15rem" },
          { label: "VASTE", note: "Technology", href: "https://www.vaste.space/", target: "_blank", x: "-17rem", y: "1rem", z: "8rem", emphasis: true },
          { label: "AtypikHouse", note: "Surface", href: "./projects.html", x: "17rem", y: "1rem", z: "-8rem" },
          { label: "CreativeStuff.jpg", note: "Archive", href: "./archive.html", x: "-10rem", y: "14rem", z: "12rem" },
          { label: "L’Œil de Meg", note: "Surface", href: "./work.html", x: "10rem", y: "14rem", z: "-12rem" },
        ],
        links: [
          { label: "Work", href: "./work.html" },
          { label: "Contact", href: "./contact.html" },
        ],
      },
      contact: {
        eyebrow: "CONTACT ROUTER",
        title: "Contact routes.",
        copy: "Email, social and external links.",
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

  const workTaxonomy = () => {
    const groups = [
      {
        label: "Status",
        key: "status",
        options: ["all", ...Object.keys(catalog.statuses || {})].map((value) => ({
          value,
          label: value === "all" ? "All" : catalog.statuses[value].label,
          active: value === "all",
        })),
      },
      {
        label: "Category",
        key: "category",
        options: ["all", ...(catalog.projectCategories || [])].map((value) => ({
          value,
          label: value === "all" ? "All" : value,
          active: value === "all",
        })),
      },
      {
        label: "Discipline",
        key: "discipline",
        options: ["all", "Music", "Technology", "Research", "Narrative", "Photography"].map((value) => ({
          value,
          label: value === "all" ? "All" : value,
          active: value === "all",
        })),
      },
      {
        label: "Category",
        key: "category",
        options: ["all", ...(catalog.projectCategories || [])].map((value) => ({
          value,
          label: value === "all" ? "All" : value,
          active: value === "all",
        })),
      },
      {
        label: "Medium",
        key: "medium",
        options: ["all", ...(catalog.mediums || [])].map((value) => ({
          value,
          label: value === "all" ? "All" : value,
          active: value === "all",
        })),
      },
      {
        label: "Year",
        key: "year",
        options: ["all", "2024", "2025", "2026"].map((value) => ({
          value,
          label: value === "all" ? "All" : value,
          active: value === "all",
        })),
      },
      {
        label: "Entity Type",
        key: "entity-type",
        options: [
          "all",
          ...(Object.keys(catalog.taxonomies?.entityTypes || {})),
        ].map((value) => ({
          value,
          label: value === "all" ? "All" : catalog.taxonomies?.entityTypes?.[value] || value,
          active: value === "all",
        })),
      },
      {
        label: "Research Field",
        key: "research-field",
        options: ["all", "Entropy", "Emergence", "Signal Archaeology", "Digital Memory Systems", "Synthetic Mythologies"].map((value) => ({
          value,
          label: value === "all" ? "All" : value,
          active: value === "all",
        })),
      },
      {
        label: "Visibility",
        key: "visibility",
        options: ["all", "Public", "Internal", "Archive", "Restricted"].map((value) => ({
          value,
          label: value === "all" ? "All" : value,
          active: value === "all",
        })),
      },
    ];
    return taxonomyPanel(
      "work",
      "WORK TAXONOMY",
      {
        heading: "Projects grouped by role",
        copy: "Filter by status, category and discipline.",
      },
      groups,
    );
  };

  const researchFields = () => {
    const voidTheory = (catalog.researchFields || []).find((item) => item.id === "void");
    const theoryIds = ["entropy", "emergence", "runtime-theory", "systems-theory", "information-studies", "anthropic-studies"];
    const theoryFields = theoryIds
      .map((id) => (catalog.researchFields || []).find((item) => item.id === id))
      .filter(Boolean);

    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">RESEARCH DIVISION</p>
          <h2>VOID as the theoretical source</h2>
          <p class="lede">VOID is the core frame, with the other fields branching from it.</p>
        </div>
        ${
          voidTheory
            ? `
              <article class="panel">
                <p class="card__meta">${esc(voidTheory.type)}</p>
                <h3 class="card__title">${esc(voidTheory.title)}</h3>
                <p class="card__copy">${esc(voidTheory.description)}</p>
                ${tagRow([...(voidTheory.medium || []), ...(voidTheory.discipline || [])])}
                <div class="link-row">
                  <a class="tag" href="./entity.html?id=${encodeURIComponent(voidTheory.id)}">Open theory</a>
                  <a class="tag" href="./projects.html">See artistic translation</a>
                </div>
              </article>
            `
            : ""
        }
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">HIERARCHY</p>
          <h2>VOID research structure</h2>
          <p class="lede">Theory, bridges and translation.</p>
        </div>
        <div class="relationship-graph">
          <div class="graph-root">VOID</div>
          <div class="graph-columns">
            <div class="graph-column">
              <p class="card__meta">Core branches</p>
              <div class="graph-node">Entropy Studies</div>
              <div class="graph-node">Emergence Research</div>
              <div class="graph-node">Runtime Theory</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Systems branches</p>
              <div class="graph-node">Systems Theory</div>
              <div class="graph-node">Information Studies</div>
              <div class="graph-node">Anthropic Studies</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Bridge</p>
              <div class="graph-node">Anthropic Studies</div>
              <div class="graph-node">Memory</div>
              <div class="graph-node">Identity</div>
              <div class="graph-node">Observation</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Art translation</p>
              <div class="graph-node">PALIMPSESTS</div>
              <div class="graph-node">Fragments</div>
              <div class="graph-node">Music</div>
              <div class="graph-node">Narrative</div>
            </div>
          </div>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">RESEARCH FIELDS</p>
          <h2>Structured theory branches</h2>
          <p class="lede">Each field belongs to VOID.</p>
        </div>
        <div class="card-grid card-grid--three">
          ${theoryFields.map((item, index) => researchCard(item, { href: `./entity.html?id=${encodeURIComponent(item.id)}`, index, featured: item.id === "void" })).join("")}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PALIMPSESTS SANDBOX</p>
          <h2>Artistic translation of theory</h2>
          <p class="lede">VOID becomes songs, fragments, visuals and narrative residues.</p>
        </div>
        <div class="relationship-graph">
          <div class="graph-root">VOID → PALIMPSESTS</div>
          <div class="graph-columns">
            <div class="graph-column">
              <p class="card__meta">Inputs</p>
              <div class="graph-node">Entropy Studies</div>
              <div class="graph-node">Emergence Research</div>
              <div class="graph-node">Runtime Theory</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Bridge</p>
              <div class="graph-node">Anthropic Studies</div>
              <div class="graph-node">Perception</div>
              <div class="graph-node">Memory</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Outputs</p>
              <div class="graph-node">ENTROPY</div>
              <div class="graph-node">EMERGENCE</div>
              <div class="graph-node">PALIMPSEST</div>
              <div class="graph-node">INCANDESCENCE</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Cycle</p>
              <div class="graph-node">KERAUNOS</div>
              <div class="graph-node">CTRL</div>
              <div class="graph-node">Les etoiles meurent pour toi</div>
            </div>
          </div>
        </div>
      </section>
    `;
  };

  const researchPrograms = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">PROGRAMS</p>
        <h2>Programs</h2>
        <p class="lede">VASTE, Forge, VOID and OracleHub.</p>
      </div>
      <div class="card-grid card-grid--three">
        ${(catalog.programs || []).map(programCard).join("")}
      </div>
    </section>
  `;

  const researchNotes = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">RESEARCH NOTES</p>
        <h2>Notes, fragments, observations.</h2>
        <p class="lede">Short records.</p>
      </div>
      <div class="card-grid card-grid--three">
        ${[
          {
            title: "Fragments",
            copy: "Short observations and fragments.",
            label: "Field notes",
            facts: ["Brief", "Portable", "Working"],
          },
          {
            title: "Documents",
            copy: "Specs, references and structure notes.",
            label: "Reference set",
            facts: ["Specs", "Structure", "Context"],
          },
          {
            title: "Observations",
            copy: "Signals, tests and process notes.",
            label: "Test bench",
            facts: ["Signals", "Tests", "Process"],
          },
          {
            title: "Foundational Era",
            copy: "Architecture, communication and taxonomy still shape the line.",
            label: "Lineage",
            facts: ["Archive", "Systems", "Continuity"],
          },
        ]
          .map(
            (item, index) => `
              <article class="panel research-note-card${index === 0 ? " research-note-card--featured" : ""}">
                <div class="research-note-card__top">
                  <div class="research-note-card__identity">
                    <p class="card__meta">${esc(item.label)}</p>
                    <h3 class="card__title">${esc(item.title)}</h3>
                  </div>
                  <span class="research-note-card__index">0${index + 1}</span>
                </div>
                <p class="card__copy">${esc(item.copy)}</p>
                <div class="tag-cluster tag-cluster--compact research-note-card__chips">
                  ${item.facts.map((fact) => `<span class="chip">${esc(fact)}</span>`).join("")}
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const archiveTaxonomy = () =>
    taxonomyPanel(
      "archive",
      "ARCHIVE TAXONOMY",
      {
        heading: "Archive as a library",
        copy: "Filter by status, medium and discipline.",
      },
      [
        {
          label: "Status",
          key: "status",
          options: ["all", ...Object.keys(catalog.statuses || {})].map((value) => ({
            value,
            label: value === "all" ? "All" : catalog.statuses[value].label,
            active: value === "all",
          })),
        },
        {
          label: "Medium",
          key: "medium",
          options: ["all", ...(catalog.mediums || [])].map((value) => ({
            value,
            label: value === "all" ? "All" : value,
            active: value === "all",
          })),
        },
        {
          label: "Category",
          key: "category",
          options: [
            "all",
            "Audio",
            "Visual",
            "Documents",
            "Prototypes",
            "Corrupted Concepts",
            "Unreleased",
            "Research Log",
            "Collection",
          ].map((value) => ({
            value,
            label: value === "all" ? "All" : value,
            active: value === "all",
          })),
        },
        {
          label: "Discipline",
          key: "discipline",
          options: ["all", ...(catalog.disciplines || [])].map((value) => ({
            value,
            label: value === "all" ? "All" : value,
            active: value === "all",
          })),
        },
        {
          label: "Year",
          key: "year",
          options: ["all", "2024", "2025", "2026"].map((value) => ({
            value,
            label: value === "all" ? "All" : value,
            active: value === "all",
          })),
        },
        {
          label: "Entity Type",
          key: "entity-type",
          options: ["all", ...(Object.keys(catalog.taxonomies?.entityTypes || {}))].map((value) => ({
            value,
            label: value === "all" ? "All" : catalog.taxonomies?.entityTypes?.[value] || value,
            active: value === "all",
          })),
        },
        {
          label: "Research Field",
          key: "research-field",
          options: [
            "all",
            "Entropy",
            "Emergence",
            "Signal Archaeology",
            "Digital Memory Systems",
            "Synthetic Mythologies",
          ].map((value) => ({
            value,
            label: value === "all" ? "All" : value,
            active: value === "all",
          })),
        },
        {
          label: "Visibility",
          key: "visibility",
          options: ["all", "Public", "Internal", "Archive", "Restricted"].map((value) => ({
            value,
            label: value === "all" ? "All" : value,
            active: value === "all",
          })),
        },
      ],
      "taxonomy-panel--archive",
    );

  const archiveLibrary = () => {
    const grouped = (catalog.artefacts || []).reduce((acc, item) => {
      const key = item.category || item.type || "Archive";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">ARCHIVE LIBRARY</p>
          <h2>Library categories</h2>
          <p class="lede">A clear inventory of outputs, drafts and fragments, organized by type.</p>
        </div>
        <div class="stack">
          ${Object.entries(grouped)
            .map(
              ([category, items]) => `
                <section class="archive-section">
                  <div class="section-head">
                    <h3>${esc(category)}</h3>
                    <p class="lede">${esc(items.length)} entries</p>
                  </div>
                  <div class="archive-rail-shell">
                    <div class="archive-rail">
                      ${items.map(archiveCard).join("")}
                    </div>
                  </div>
                </section>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  };

  const aboutMap = () =>
    graphSurface({
      eyebrow: "METHOD",
      title: "A living atlas.",
      copy: "Theory, research, programs, artefacts and documentation remain visible as one connected field.",
      coreLabel: catalog.ecosystem?.root || "Electronic Artefacts",
      coreCopy: "Root system",
      nodes: [
        { label: "VOID", note: "Theory", x: "-13rem", y: "-7rem", z: "-12rem", angle: "30deg", length: "14rem" },
        { label: "PALIMPSESTS", note: "Art", x: "12rem", y: "-7rem", z: "14rem", angle: "-26deg", length: "13rem" },
        { label: "VASTE", note: "Technology", x: "-15rem", y: "3rem", z: "8rem", angle: "8deg", length: "15rem" },
        { label: "AtypikHouse", note: "Surface", x: "14rem", y: "4rem", z: "-8rem", angle: "-10deg", length: "14rem" },
        { label: "CreativeStuff.jpg", note: "Archive", x: "-8rem", y: "12rem", z: "12rem", angle: "-48deg", length: "10rem" },
        { label: "L’Œil de Meg", note: "Surface", x: "8rem", y: "12rem", z: "-12rem", angle: "-52deg", length: "11rem" },
      ],
      actions: [
        { label: "Work", href: "./work.html" },
        { label: "Archive", href: "./archive.html" },
      ],
    });

  const aboutNetwork = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">PILLARS</p>
        <h2>Three pillars in orbit.</h2>
      </div>
      <div class="network-grid">
        ${[
          {
            eyebrow: "Theory",
            title: "VOID",
            copy: "Entropy, emergence, memory and causality.",
            link: { label: "Research", href: "./research.html" },
          },
          {
            eyebrow: "Art",
            title: "PALIMPSESTS",
            copy: "Songs, fragments and narrative forms.",
            link: { label: "Work", href: "./work.html" },
          },
          {
            eyebrow: "Technology",
            title: "VASTE",
            copy: "The technical spine.",
            link: { label: "VASTE", href: "https://www.vaste.space/", target: "_blank" },
          },
        ]
          .map(
            (item) => `
              <article class="panel">
                <p class="card__meta">${esc(item.eyebrow)}</p>
                <h3 class="card__title">${esc(item.title)}</h3>
                <p class="card__copy">${esc(item.copy)}</p>
                ${linkRow(item.link)}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const contactLinks = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">CONTACT</p>
        <h2>Selected channels</h2>
        <p class="lede">Email, social and listening links.</p>
      </div>
      <div class="contact-grid">
        ${[
          {
            title: "electronic.artefacts@gmail.com",
            type: "Email",
            copy: "Studio contact.",
            link: { label: "Send email", href: "mailto:electronic.artefacts@gmail.com" },
          },
          {
            title: "@electronic.artefacts",
            type: "Instagram",
            copy: "Releases and studio notes.",
            link: {
              label: "Open Instagram",
              href: "https://www.instagram.com/electronic.artefacts/",
              target: "_blank",
            },
          },
          {
            title: "@creativestuff.jpg",
            type: "Instagram",
            copy: "Visual fragments and references.",
            link: {
              label: "Open Instagram",
              href: "https://www.instagram.com/creativestuff.jpg/",
              target: "_blank",
            },
          },
          {
            title: "GitHub, SoundCloud, VASTE",
            type: "External links",
            copy: "The rest of the trail.",
            link: null,
          },
        ]
          .map(
            (item, index) => `
              <article class="panel">
                <p class="card__meta">${esc(item.type)}</p>
                <h3 class="card__title">${esc(item.title)}</h3>
                <p class="card__copy">${esc(item.copy)}</p>
                ${index === 3
                  ? `<div class="link-row">
                      <a class="tag" href="https://github.com/onlythejoe" target="_blank" rel="noreferrer">GitHub</a>
                      <a class="tag" href="https://soundcloud.com/electronic-artefacts" target="_blank" rel="noreferrer">SoundCloud</a>
                      <a class="tag" href="https://www.vaste.space/" target="_blank" rel="noreferrer">VASTE</a>
                    </div>`
                  : linkRow(item.link)}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const entityById = (id) => catalog.indexes?.byId?.[id] || null;
  const collectionById = (id) => (catalog.collections || []).find((item) => item.id === id) || null;
  const timelineFor = (id) => (catalog.timelines || []).find((item) => item.entityId === id) || null;
  const activityFor = (id) => (catalog.activity || []).filter((item) => item.entityId === id);
  const slugify = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const resolveIds = (values) =>
    (values || [])
      .map((value) => {
        if (typeof value !== "string") return value;
        const exact = entityById(value) || collectionById(value);
        if (exact) return exact;
        const slug = slugify(value);
        const byTitle = (catalog.indexes?.entities || []).find((item) => slugify(item.title) === slug);
        return byTitle || { title: value, id: slug || value, kind: "reference" };
      })
      .filter(Boolean);

  const panelShell = (title, copy, body) => `
    <section class="panel knowledge-panel">
      <div class="section-head">
        <p class="card__meta">${esc(title)}</p>
        ${copy ? `<p class="lede">${esc(copy)}</p>` : ""}
      </div>
      ${body}
    </section>
  `;

  const metadataPanel = (item) =>
    panelShell(
      "Metadata",
      null,
      metadataList([
        { label: "Title", value: item.title },
        { label: "Subtype", value: item.subtitle || item.type },
        { label: "Status", value: item.statusLabel || catalog.taxonomies?.statuses?.[item.status]?.label || item.status },
        { label: "Maturity", value: catalog.taxonomies?.maturity?.[item.maturity]?.label || item.maturity },
        { label: "Confidence", value: catalog.taxonomies?.confidence?.[item.confidence]?.label || item.confidence },
        { label: "Visibility", value: catalog.taxonomies?.visibility?.[item.visibility]?.label || item.visibility },
        { label: "Domain", value: item.domain },
        { label: "System Group", value: item.systemGroup },
        { label: "Creation year", value: item.temporality?.creationYear },
        { label: "Release date", value: item.temporality?.releaseDate },
        { label: "Era", value: item.temporality?.era },
      ]),
    );

  const tagsPanel = (item) =>
    panelShell(
      "Tags",
      null,
      tagRow([...(item.tags || []), ...(item.medium || []), ...(item.discipline || []), item.category, item.type].filter(Boolean)),
    );

  const relationsPanel = (item) => {
    const relations = item.relations || {};
    const sections = [
      ["Origin", relations.origin],
      ["Parent", relations.parent],
      ["Children", relations.children],
      ["Dependencies", relations.dependencies],
      ["Influences", relations.influences],
      ["Derived From", relations.derivedFrom],
      ["Inspired By", relations.inspiredBy],
      ["Powered By", relations.poweredBy],
      ["Produced By", relations.producedBy],
      ["Published By", relations.publishedBy],
      ["Maintained By", relations.maintainedBy],
      ["Part Of", relations.partOf],
      ["Related To", relations.relatedTo],
    ];

    return panelShell(
      "Relations",
      null,
      `<div class="stack">
        ${sections
          .filter(([, values]) => values && values.length)
          .map(
            ([label, values]) => `
              <div class="panel panel--soft">
                <p class="card__meta">${esc(label)}</p>
                <div class="link-row">
                  ${resolveIds(values)
                    .map((entry) => `<a class="tag" href="./entity.html?id=${encodeURIComponent(entry.id)}">${esc(entry.title)}</a>`)
                    .join("")}
                </div>
              </div>
            `,
          )
          .join("")}
      </div>`,
    );
  };

  const dependenciesPanel = (item) => {
    const deps = (item.relations?.dependencies || []).map((id) => entityById(id)).filter(Boolean);
    if (!deps.length) return "";
    return panelShell(
      "Dependencies",
      null,
      `<div class="link-row">${deps
        .map((entry) => `<a class="tag" href="./entity.html?id=${encodeURIComponent(entry.id)}">${esc(entry.title)}</a>`)
        .join("")}</div>`,
    );
  };

  const timelinePanel = (item) => {
    const timeline = timelineFor(item.id);
    if (!timeline || !timeline.entries?.length) return "";
    return panelShell(
      "Timeline",
      null,
      `<div class="stack">
        ${timeline.entries
          .map(
            (entry) => `
              <article class="panel panel--soft">
                <p class="card__meta">${esc(entry.year)} · ${esc(entry.type)}</p>
                <h3 class="card__title">${esc(entry.title)}</h3>
                <p class="card__copy">${esc(entry.description)}</p>
              </article>
            `,
          )
          .join("")}
      </div>`,
    );
  };

  const activityPanel = (item) => {
    const rows = activityFor(item.id);
    if (!rows.length) return "";
    return panelShell(
      "Activity",
      null,
      `<div class="stack">
        ${rows
          .map(
            (entry) => `
              <article class="panel panel--soft">
                <p class="card__meta">${esc(entry.date)} · ${esc(entry.type)}</p>
                <h3 class="card__title">${esc(entry.title)}</h3>
                <p class="card__copy">${esc(entry.summary)}</p>
              </article>
            `,
          )
          .join("")}
      </div>`,
    );
  };

  const researchPanel = (item) => {
    const fields = [];
    if (item.researchField) fields.push(item.researchField);
    if (item.relatedResearchFields) fields.push(...item.relatedResearchFields);
    if (item.kind === "researchField") {
      fields.push(...(item.relatedProjects || []), ...(item.relatedArtefacts || []), ...(item.relatedPrograms || []));
    }
    if (!fields.length) return "";
    return panelShell(
      "Research",
      null,
      `<div class="link-row">${resolveIds(fields)
        .map((entry) => `<a class="tag" href="./entity.html?id=${encodeURIComponent(entry.id)}">${esc(entry.title)}</a>`)
        .join("")}</div>`,
    );
  };

  const relatedEntriesPanel = (item) => {
    const relatedIds = [
      ...(item.relations?.relatedTo || []),
      ...(item.relatedProjects || []),
      ...(item.relatedArtefacts || []),
      ...(item.relatedPrograms || []),
      ...(item.relatedResearchFields || []),
    ];
    const entries = resolveIds(relatedIds).filter((entry) => entry.id !== item.id);
    if (!entries.length) return "";
    return panelShell(
      "Related Entries",
      null,
      `<div class="card-grid card-grid--two">
        ${entries
          .map(
            (entry) => `
              <article class="panel panel--soft">
                <p class="card__meta">${esc(catalog.taxonomies?.entityTypes?.[entry.kind] || entry.kind)}</p>
                <h3 class="card__title">${esc(entry.title)}</h3>
                <p class="card__copy">${esc(entry.summary || entry.description || "")}</p>
                <div class="link-row">
                  <a class="tag" href="./entity.html?id=${encodeURIComponent(entry.id)}">Open</a>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>`,
    );
  };

  const projectMediaFolder = (item) => item.media?.folder || `./assets/media/projects/${item.id}`;

  const projectArchitecturePanel = (item) => {
    if (item.kind !== "project") return "";
    const architecture = item.architecture || {};
    const layers = architecture.layers || [];
    return panelShell(
      "Physical architecture",
      architecture.note || "Surface, routing and local asset storage.",
      `
        <div class="project-architecture">
          <div class="project-architecture__hero">
            <p class="card__meta">Route</p>
            <strong>./project.html?id=${esc(item.id)}</strong>
          </div>
          <div class="project-architecture__grid">
            <article class="panel panel--soft">
              <p class="card__meta">Surface</p>
              <h3 class="card__title">${esc(architecture.surface || item.type || "Project")}</h3>
              <p class="card__copy">${esc(architecture.surfaceCopy || item.description || item.summary || "")}</p>
            </article>
            <article class="panel panel--soft">
              <p class="card__meta">Storage</p>
              <h3 class="card__title">${esc(projectMediaFolder(item))}</h3>
              <p class="card__copy">Local dossier assets live inside the project folder only.</p>
            </article>
            <article class="panel panel--soft">
              <p class="card__meta">Stack</p>
              <h3 class="card__title">${esc(architecture.stack || item.program || "Electronic Artefacts")}</h3>
              <p class="card__copy">${esc(architecture.stackCopy || "General template with project-specific assets and narrative.")}</p>
            </article>
            <article class="panel panel--soft">
              <p class="card__meta">Layers</p>
              <h3 class="card__title">${esc((layers.length || 0).toString())}</h3>
              <p class="card__copy">${esc(architecture.layerCopy || "Layers, paths and assets.")}</p>
            </article>
          </div>
          ${layers.length ? `<div class="tag-cluster">${layers.map((layer) => chip(layer)).join("")}</div>` : ""}
        </div>
      `,
    );
  };

  const projectGalleryPanel = (item) => {
    if (item.kind !== "project") return "";
    const gallery = item.media?.gallery || [];
    const folder = projectMediaFolder(item);
    if (item.id === "palimpsests" && gallery.length) {
      const heroImage = gallery.find((image) => String(image.src || "").includes("palimpsests.jpg")) || gallery[0];
      const secondaryImages = gallery.filter((image) => image !== heroImage);
      const secondaryTop = secondaryImages[0] || heroImage;
      const secondaryBottom = secondaryImages[1] || secondaryTop;
      const railImages = secondaryImages.slice(2);
      return `
        <section class="project-immersive">
          <div class="project-immersive__hero">
            <div class="project-immersive__hero-copy">
              <p class="eyebrow">PALIMPSESTS</p>
              <h2 class="display-title">A five-act album held in images.</h2>
              <p class="lede">A sequence of visual plates, each one treated like an archive trace rather than a thumbnail.</p>
            </div>
          <div class="project-immersive__hero-visual project-immersive__collage">
              <figure class="project-immersive__frame project-immersive__frame--lead">
                ${mediaFigureMarkup(heroImage, item, "project-immersive__image")}
                ${heroImage.caption ? `<figcaption>${esc(heroImage.caption)}</figcaption>` : ""}
              </figure>
              <figure class="project-immersive__frame project-immersive__frame--split-a">
                ${mediaFigureMarkup(secondaryTop, item, "project-immersive__image")}
                ${secondaryTop.caption ? `<figcaption>${esc(secondaryTop.caption)}</figcaption>` : ""}
              </figure>
              <figure class="project-immersive__frame project-immersive__frame--split-b">
                ${mediaFigureMarkup(secondaryBottom, item, "project-immersive__image")}
                ${secondaryBottom.caption ? `<figcaption>${esc(secondaryBottom.caption)}</figcaption>` : ""}
              </figure>
            </div>
          </div>
          <div class="project-immersive__rail project-immersive__rail--wide">
            ${[heroImage, ...railImages]
              .map(
                (image, index) => `
                  <figure class="project-immersive__frame project-immersive__frame--rail project-immersive__rail-item--${index + 1}">
                    ${mediaFigureMarkup(image, item, "project-immersive__image")}
                    ${image.caption ? `<figcaption>${esc(image.caption)}</figcaption>` : ""}
                  </figure>
                `,
              )
              .join("")}
          </div>
        </section>
      `;
    }
    return panelShell(
      "Local dossier",
      "Project-specific image folder.",
      `
        <div class="project-gallery">
          ${
            gallery.length
              ? gallery
                  .map(
                    (media) => `
                      <figure class="project-gallery__item">
                        ${mediaFigureMarkup(media, item)}
                        ${media.caption ? `<figcaption>${esc(media.caption)}</figcaption>` : ""}
                      </figure>
                    `,
                  )
                  .join("")
              : `
                <div class="panel panel--soft">
                  <p class="card__meta">Assets</p>
                  <h3 class="card__title">Folder ready</h3>
                  <p class="card__copy">Add cover.svg and dossier images to <strong>${esc(folder)}</strong>. This block will render only inside the project detail page.</p>
                </div>
              `
          }
        </div>
      `,
    );
  };

  const palimpsestsDossierPanels = (item) => {
    if (item.id !== "palimpsests") return "";
    const structure = item.orethStructure || {};
    const acts = item.acts || [];
    const actCount = String(acts.length || 0).padStart(2, "0");
    const trackCount = String((structure.currentMaterial || []).length || 0).padStart(2, "0");
    const editorialMetrics = [
      { label: "ACTS", value: actCount, note: "five movements", fill: 0.96, tone: "research" },
      { label: "TRACKS", value: trackCount, note: "named passages", fill: 0.9, tone: "system" },
      { label: "FORM", value: item.type || "Album", note: item.statusLabel || "In production", fill: 0.82, tone: "visual" },
      { label: "ARTIST", value: "ORETH", note: item.label || "Electronic Artefacts", fill: 0.72, tone: "archive" },
    ];

    const actCard = (act) => `
      <article class="panel panel--soft">
        <div class="project-card__top">
          <div>
            <p class="card__meta">${esc(act.title || "Act")}</p>
            <h3 class="card__title">${esc(act.subtitle || "")}</h3>
          </div>
          ${act.mood ? chip(act.mood) : ""}
        </div>
        ${act.description ? `<p class="card__copy">${esc(act.description)}</p>` : ""}
        ${act.tracks?.length ? `<div class="tag-cluster tag-cluster--compact">${act.tracks.map((track) => chip(track)).join("")}</div>` : ""}
        ${act.keywords?.length ? tagRow(act.keywords, { limit: 4 }) : ""}
      </article>
    `;

    return [
      panelShell(
        "Presentation",
        "A conceptual album in five acts.",
        `
          <div class="stack">
            <article class="panel panel--soft">
              <p class="card__copy">${esc(item.description || item.summary || "")}</p>
              <p class="card__copy">${esc(item.coreIdea || "")}</p>
            </article>
            ${metricRail(editorialMetrics, { limit: 4, compact: true })}
          </div>
        `,
      ),
      panelShell(
        "Identification",
        null,
        metadataList([
          { label: "Title", value: item.title },
          { label: "Type", value: item.type },
          { label: "Medium", value: (item.medium || []).join(", ") },
          { label: "Artist", value: "ORETH" },
          { label: "Label", value: "Electronic Artefacts" },
          { label: "Status", value: catalog.taxonomies?.statuses?.[item.status]?.label || item.status },
          { label: "Classification", value: "Album, Concept Work, Narrative Album" },
        ]),
      ),
      panelShell(
        "Five Acts",
        null,
        `<div class="stack">
          ${acts.map(actCard).join("")}
        </div>`,
      ),
      panelShell(
        "Central Thesis",
        null,
        `<div class="stack">
          <article class="panel panel--soft">
            <p class="card__copy">Nothing truly disappears. Structures transform. Memories fade. Stories are rewritten. Civilizations vanish. Yet traces remain.</p>
            <p class="card__copy">${esc(item.originOfTitle || "")}</p>
          </article>
          ${item.subThemes?.length ? `<div class="tag-cluster">${item.subThemes.slice(0, 8).map((theme) => chip(theme)).join("")}</div>` : ""}
        </div>`,
      ),
    ].join("");
  };

  const collectionPanel = (item) => {
    const memberships = (catalog.collections || []).filter((collection) => {
      const members = (window.EA_COLLECTIONS.resolve ? window.EA_COLLECTIONS.resolve(collection, catalog) : []);
      return members.some((member) => member.id === item.id);
    });
    if (!memberships.length) return "";
    return panelShell(
      "Collections",
      null,
      `<div class="link-row">${memberships
        .map((collection) => `<a class="tag" href="./collection.html?id=${encodeURIComponent(collection.id)}">${esc(collection.title)}</a>`)
        .join("")}</div>`,
    );
  };

  const collectionMembersPanel = (item) => {
    if (item.kind !== "collection") return "";
    const members = window.EA_COLLECTIONS.resolve ? window.EA_COLLECTIONS.resolve(item, catalog) : [];
    if (!members.length) return "";
    return panelShell(
      "Members",
      null,
      `<div class="card-grid card-grid--two">
        ${members
          .map(
            (entry) => `
              <article class="panel panel--soft">
                <p class="card__meta">${esc(catalog.taxonomies?.entityTypes?.[entry.kind] || entry.kind)}</p>
                <h3 class="card__title">${esc(entry.title)}</h3>
                <p class="card__copy">${esc(entry.summary || entry.description || "")}</p>
                <div class="link-row">
                  <a class="tag" href="./entity.html?id=${encodeURIComponent(entry.id)}">Open</a>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>`,
    );
  };

  const knowledgePanels = (item) => [
    metadataPanel(item),
    relationsPanel(item),
    timelinePanel(item),
    activityPanel(item),
    researchPanel(item),
    dependenciesPanel(item),
    tagsPanel(item),
    relatedEntriesPanel(item),
    collectionPanel(item),
    collectionMembersPanel(item),
  ].filter(Boolean).join("");

  const projectPanels = (item) => {
    if (item.kind !== "project") return "";
    return [projectGalleryPanel(item)].filter(Boolean).join("");
  };

  const projectSpecificPanels = (item) => {
    if (item.kind !== "project") return "";
    return [palimpsestsDossierPanels(item)].filter(Boolean).join("");
  };

  const programSpecificPanels = (item) => {
    if (item.kind !== "program") return "";

    const relations = item.relations || {};
    const networkItems = [
      ...(relations.origin || []),
      ...(relations.parent || []),
      ...(relations.children || []),
      ...(relations.dependencies || []),
      ...(relations.influences || []),
      ...(relations.relatedTo || []),
    ];
    const primaryLink = item.links?.[0] || null;
    const signatureTags = [
      item.type,
      item.statusLabel || catalog.taxonomies?.statuses?.[item.status]?.label || item.status,
      item.domain,
      item.systemGroup,
    ].filter(Boolean);

    return `
      <section class="detail-grid program-detail-grid">
        <article class="panel program-detail-panel program-detail-panel--lead">
          <div class="section-head">
            <p class="card__meta">Program profile</p>
            <h2 class="card__title">${esc(item.title)}</h2>
            <p class="lede program-detail-summary">${esc(item.description || item.summary || "")}</p>
          </div>
          <div class="tag-cluster tag-cluster--compact program-detail-chips">
            ${signatureTags.map((value) => chip(value)).join("")}
          </div>
          ${metadataList([
            { label: "Subtype", value: item.subtitle || item.type },
            { label: "Status", value: item.statusLabel || catalog.taxonomies?.statuses?.[item.status]?.label || item.status },
            { label: "Maturity", value: catalog.taxonomies?.maturity?.[item.maturity]?.label || item.maturity },
            { label: "Confidence", value: catalog.taxonomies?.confidence?.[item.confidence]?.label || item.confidence },
            { label: "Visibility", value: catalog.taxonomies?.visibility?.[item.visibility]?.label || item.visibility },
          ])}
          <div class="link-row">
            ${primaryLink ? `<a class="button button--secondary" href="${esc(primaryLink.href)}"${primaryLink.href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${esc(primaryLink.label)}</a>` : ""}
            ${item.kind === "program" ? `<a class="tag" href="./programs.html">Programs</a>` : ""}
          </div>
        </article>
        <article class="panel program-detail-panel">
          <p class="card__meta">System shape</p>
          <p class="card__copy">${esc(item.domain || item.systemGroup || item.type || "Program system")}</p>
          ${metadataList([
            { label: "Domain", value: item.domain },
            { label: "System group", value: item.systemGroup },
            { label: "Creation year", value: item.temporality?.creationYear },
            { label: "Release date", value: item.temporality?.releaseDate || "—" },
            { label: "Last updated", value: item.temporality?.lastUpdated },
            { label: "Era", value: item.temporality?.era },
          ])}
        </article>
        <article class="panel program-detail-panel">
          <p class="card__meta">Signals</p>
          <p class="card__copy">Tags, mediums and disciplines frame how the program sits inside the archive.</p>
          ${tagRow([...(item.tags || []), ...(item.medium || []), ...(item.discipline || [])].filter(Boolean), { compact: true })}
        </article>
        <article class="panel program-detail-panel">
          <p class="card__meta">Network</p>
          <p class="card__copy">Nearby entries connected through origin, lineage and dependency.</p>
          <div class="link-row">
            ${resolveIds(networkItems)
              .slice(0, 8)
              .map((entry) => `<a class="tag" href="./entity.html?id=${encodeURIComponent(entry.id)}">${esc(entry.title)}</a>`)
              .join("")}
          </div>
        </article>
      </section>
    `;
  };

  const renderDetailPage = () => {
    const id =
      new URLSearchParams(window.location.search).get("id") ||
      document.body.dataset.projectId ||
      document.body.dataset.entityId;
    const item = id ? entityById(id) || collectionById(id) : null;
    const kind = document.body.dataset.detailKind || document.body.dataset.page || "entity";
    if (!item) {
      return `
        <section class="zone-card hero">
          <div class="section-head">
            <p class="eyebrow">${esc(kind.toUpperCase())}</p>
            <h1 class="display-title">Entry not found.</h1>
            <p class="lede">Return to the archive or open the knowledge system from the homepage.</p>
            <div class="button-row">
              <a class="button button--primary" href="./archive.html">Archive</a>
              <a class="button button--secondary" href="./index.html">Home</a>
            </div>
          </div>
        </section>
      `;
    }

    const primaryLinks = (item.links || []).map((link) => ({ ...link, target: link.href.startsWith("http") ? "_blank" : undefined }));
    const relatedCount = Object.values(item.relations || {}).flat().filter(Boolean).length;
    const heroMode =
      item.kind === "project"
        ? "project"
        : item.kind === "archive" || item.kind === "artefact"
          ? "archive"
          : item.kind === "person"
            ? "person"
            : item.kind === "program" || item.kind === "channel"
              ? "program"
              : "research";
    const heroActions = [
      ...primaryLinks.slice(0, 1),
      ...(item.kind === "project" ? [{ label: "RL", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` }] : []),
    ];
    const detailIntro = item.kind === "program" ? programSpecificPanels(item) : "";

    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">${esc(catalog.taxonomies?.entityTypes?.[item.kind] || item.kind || kind.toUpperCase())}</p>
          <h1 class="display-title">${esc(item.title)}</h1>
          <p class="lede">${esc(item.description || item.summary || "")}</p>
          ${projectSignatureBubble(item, "hero")}
          <div class="button-row button-row--compact">
            ${heroActions.map((link, index) => `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}" href="${esc(link.href)}"${link.target ? ' target="_blank" rel="noreferrer"' : ""}>${esc(link.label)}</a>`).join("")}
          </div>
          ${summaryMetrics(item, heroMode)}
        </div>
      </section>
      ${detailIntro}
      ${projectSpecificPanels(item) ? `<section class="detail-grid">${projectSpecificPanels(item)}</section>` : ""}
      ${projectPanels(item) ? `<section class="detail-grid project-visual-section">${projectPanels(item)}</section>` : ""}
      <section class="detail-grid">
        ${knowledgePanels(item)}
      </section>
    `;
  };

  const renderActivityFeed = () => {
    const rows = (catalog.activity || []).slice(0, 5);
    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">LATEST ACTIVITY</p>
          <h2>Recent Activity</h2>
        </div>
        <div class="stack">
          ${rows
            .map(
              (entry) => {
                const href = entry.entityId ? `./entity.html?id=${encodeURIComponent(entry.entityId)}` : "";
                return `
                <article class="panel panel--soft card-link-surface" ${cardLinkAttrs(href, `Open ${entry.title}`)}>
                  ${cardOverlayLink(href, `Open ${entry.title}`)}
                  <p class="card__meta">${esc(entry.date)} · ${esc(entry.type)}</p>
                  <h3 class="card__title">${esc(entry.title)}</h3>
                  <p class="card__copy">${esc(entry.summary)}</p>
                </article>
              `;
              },
            )
            .join("")}
        </div>
      </section>
    `;
  };

  const renderCollectionsPanel = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">COLLECTIONS</p>
        <h2>Explore the collections</h2>
      </div>
      <div class="card-grid card-grid--two">
        ${(catalog.collections || [])
          .map(
            (collection) => `
                <article class="panel card-link-surface" ${cardBaseAttrs(collection)} ${cardLinkAttrs(`./collection.html?id=${encodeURIComponent(collection.id)}`, `Open ${collection.title}`)}>
                ${cardOverlayLink(`./collection.html?id=${encodeURIComponent(collection.id)}`, `Open ${collection.title}`)}
                <p class="card__meta">Collection</p>
                <h3 class="card__title">${esc(collection.title)}</h3>
                <p class="card__copy">${esc(collection.summary)}</p>
                <div class="link-row">
                  <a class="tag" href="./collection.html?id=${encodeURIComponent(collection.id)}">Open</a>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const searchState = { query: "", status: "all", kind: "all" };
  const renderSearchPage = () => {
    const results = (catalog.indexes?.search || []).filter((item) => {
      if (searchState.status !== "all" && item.status !== searchState.status) return false;
      if (searchState.kind !== "all" && item.kind !== searchState.kind) return false;
      if (!searchState.query) return true;
      return item.value.includes(searchState.query.toLowerCase());
    });
    const groups = results.reduce((acc, item) => {
      const bucket = acc[item.kind] || (acc[item.kind] = []);
      bucket.push(item);
      return acc;
    }, {});

    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">SEARCH</p>
          <h1 class="display-title">Search the archive.</h1>
          <p class="lede">Titles, tags, relations and fields.</p>
        </div>
        <div class="taxonomy-grid">
          <div class="taxonomy-column">
            <p class="card__meta">Query</p>
            <input class="search-input" type="search" data-search-input placeholder="Search titles, tags, relations..." />
          </div>
          <div class="taxonomy-column">
            <p class="card__meta">Status</p>
            <div class="pill-cloud" data-search-status>
              ${[
                ["all", "All"],
                ...Object.entries(catalog.taxonomies?.statuses || {}).map(([key, value]) => [key, value.label]),
              ]
                .map(
                  ([key, label]) =>
                    `<button type="button" class="filter-chip${searchState.status === key ? " is-active" : ""}" data-search-status-chip data-value="${esc(key)}" aria-pressed="${searchState.status === key ? "true" : "false"}">${esc(label)}</button>`,
                )
                .join("")}
            </div>
          </div>
          <div class="taxonomy-column">
            <p class="card__meta">Entity type</p>
            <div class="pill-cloud" data-search-kind>
              ${[
                ["all", "All"],
                ...Object.entries(catalog.taxonomies?.entityTypes || {}).map(([key, value]) => [key, value]),
              ]
                .map(
                  ([key, label]) =>
                    `<button type="button" class="filter-chip${searchState.kind === key ? " is-active" : ""}" data-search-kind-chip data-value="${esc(key)}" aria-pressed="${searchState.kind === key ? "true" : "false"}">${esc(label)}</button>`,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>
      <section class="stack" data-search-results>
        ${
          Object.entries(groups).length
            ? Object.entries(groups)
                .map(
                  ([kind, items]) => `
                    <section class="zone-card hero">
                      <div class="section-head">
                        <p class="eyebrow">${esc(kind)}</p>
                        <h2>${esc(items.length)} result(s)</h2>
                      </div>
                      <div class="card-grid card-grid--two">
                        ${items
                          .map((item) => {
                            const entity = entityById(item.id);
                            if (!entity) return "";
                            if (entity.kind === "program") return programCard(entity);
                            if (entity.kind === "artist") return personCard(entity);
                            if (entity.kind === "channel") return channelCard(entity);
                            if (entity.kind === "artefact") return archiveCard(entity);
                            if (entity.kind === "researchLog") return archiveCard(entity);
                            return projectCard(entity);
                          })
                          .join("")}
                      </div>
                    </section>
                  `,
                )
                .join("")
            : `<section class="zone-card hero"><div class="section-head"><p class="eyebrow">No results</p><h2>Nothing matched.</h2><p class="lede">Try a broader query or clear the filters.</p></div></section>`
        }
      </section>
    `;
  };

  const renderCrossNavigation = () => crossNavigation();

  const renderFeaturedWork = () => featuredWork();
  const renderVasteBanner = () => vasteBanner();
  const renderFeaturedResearch = () => featuredResearch();
  const renderLatest = () => latestArtefacts();
  const renderPrograms = () => {
    const vaste = entityById("vaste");
    const forge = entityById("forge");
    const voidEntry = entityById("void");
    const oraclehub = entityById("oraclehub");

    const registryCard = (item, options = {}) => {
      if (!item) return "";
      const techItems = (options.tech || []).map((value) => String(value)).filter(Boolean);
      const classificationItems = (options.classification || []).map((value) => String(value)).filter(Boolean);
      const link = options.link || item.links?.[0] || null;
      return `
        <article class="program-card program-registry-card${options.accent ? " program-registry-card--accent" : ""}" ${cardBaseAttrs(item)}>
          <div class="program-registry-card__top">
            <p class="card__meta">${esc(options.kicker || catalog.taxonomies?.entityTypes?.[item.kind] || item.kind || "PROGRAM")}</p>
            ${statusBadge(options.statusKey || item.status, options.statusLabel || item.statusLabel)}
          </div>
          <div class="program-registry-card__headline">
            <h3 class="card__title">${esc(options.title || item.title)}</h3>
            <p class="program-registry-card__subtitle">${esc(options.role || item.subtitle || item.systemGroup || "")}</p>
          </div>
          ${cardCopy(options.copy || item.description || item.summary || "", 2)}
          <div class="program-registry-card__facts">
            <div class="program-registry-card__fact">
              <span>Technology</span>
              <strong>${esc(options.technology || techItems.join(" / ") || "—")}</strong>
            </div>
            <div class="program-registry-card__fact">
              <span>Lineage</span>
              <strong>${esc(options.lineage || (item.relations?.origin || []).slice(0, 1).join(" / ") || "Electronic Artefacts")}</strong>
            </div>
          </div>
          ${classificationItems.length ? `<div class="tag-cluster tag-cluster--compact program-registry-card__chips">${classificationItems.map((entry) => chip(entry)).join("")}</div>` : ""}
          ${link ? linkRow(link) : ""}
        </article>
      `;
    };

    const registryCards = [
      registryCard(vaste, {
        title: "VASTE",
        kicker: "PROGRAM",
        statusLabel: "Active Development",
        technology: "TypeScript",
        role: "Core Program",
        lineage: "ARCA",
        lineageNote: "Origin system",
        classification: ["Runtime", "Research Program", "Knowledge System", "Core Infrastructure"],
        copy:
          "VASTE is the primary proprietary runtime developed within Electronic Artefacts. It explores graph architectures, contextual execution, identity systems, simulation frameworks, knowledge structures and modular world construction.",
        link: { label: "Official site", href: "https://www.vaste.space/", target: "_blank" },
      }),
      registryCard(forge, {
        title: "FORGE",
        kicker: "PROGRAM",
        statusLabel: "Active Research",
        technology: "Rust",
        role: "Creative Production System",
        lineage: "VASTE",
        lineageNote: "Derived architecture",
        classification: ["Software Program", "Research Program", "Creative Technology", "Artifact Generation System"],
        copy:
          "Forge is an experimental software system dedicated to the creation, transformation and refinement of digital artefacts. The project investigates highly scalable production pipelines capable of generating multiple categories of artefacts from a shared architecture.",
        link: { label: "Research", href: "./research.html" },
      }),
      registryCard(voidEntry, {
        title: "VOID",
        kicker: "RESEARCH FIELD",
        statusLabel: "Archived",
        technology: "Rust",
        role: "Experimental Software Engine",
        lineage: "Electronic Artefacts",
        lineageNote: "Historical foundation",
        classification: ["Research Program", "Experimental Engine", "Archived System", "Creative Concept"],
        copy:
          "VOID was one of the earliest software research projects developed within Electronic Artefacts. Originally conceived as an experimental engine, the project shaped later reflections around systems architecture, modularity and creative technology.",
        link: { label: "Research field", href: "./entity.html?id=void" },
      }),
      registryCard(oraclehub, {
        title: "OracleHub",
        kicker: "PROGRAM",
        statusLabel: "Research Archive",
        technology: "Python / PostgreSQL / Redis / Docker",
        role: "Distributed Oracle System",
        lineage: "VASTE",
        lineageNote: "Concepts reappear in VASTE",
        classification: ["Prediction System", "Research Program", "Data Processing Framework"],
        copy:
          "OracleHub explored distributed prediction architectures through specialized oracle entities, asynchronous workers and dynamic data pipelines. Many concepts later reappeared in more generalized forms inside VASTE.",
        link: { label: "Research notes", href: "./research.html" },
      }),
    ].join("");

    const forgePrinciples = [
      {
        title: "Artifact Pipelines",
        copy: "Each artefact is treated as the result of a chain of transformations rather than a static output.",
      },
      {
        title: "Genetic Structures",
        copy: "Artefacts can inherit characteristics from previous generations and recombine parameters.",
      },
      {
        title: "Automated Refinement",
        copy: "The system studies iterative workflows that progressively improve generated artefacts.",
      },
      {
        title: "Scalability",
        copy: "The architecture stays medium-agnostic so it can extend from video and 3D toward more output families.",
      },
    ];

    const forgeCurrentDomains = ["Video", "3D Assets"];
    const forgeFutureDomains = ["Audio", "Text", "Interactive Experiences", "Research Documents", "Visual Systems", "Synthetic Worlds"];

    const relationshipColumns = [
      {
        title: "VASTE",
        nodes: ["Knowledge Systems", "Identity Systems", "Simulation Systems", "Runtime Research"],
      },
      {
        title: "FORGE",
        nodes: ["Artifact Pipelines", "Genome Systems", "Automated Refinement", "Creative Production Research"],
      },
      {
        title: "VOID",
        nodes: ["Experimental Architectures", "Creative Computing Research"],
      },
      {
        title: "OracleHub",
        nodes: ["Distributed Predictions", "Oracle Systems", "Data Pipelines"],
      },
    ];

    const technologyMap = [
      { title: "TypeScript", nodes: ["VASTE", "UnionMob"] },
      { title: "Rust", nodes: ["VOID", "Forge"] },
      { title: "PHP", nodes: ["AtypikHouse", "L'Oeil de Meg"] },
      { title: "Python", nodes: ["OracleHub", "Audio Analysis Research"] },
    ];

    const strategicObservation = [
      {
        title: "VASTE",
        copy: "Knowledge, runtime and systems. It is the core proprietary runtime and the technical anchor of the stack.",
      },
      {
        title: "LA FORGE",
        copy: "Artefact production and transformation. It studies pipelines, inheritance and multi-domain generation.",
      },
      {
        title: "VOID",
        copy: "Experimental architectures and conceptual foundations. It remains the archived theoretical engine.",
      },
      {
        title: "OracleHub",
        copy: "Distributed prediction and data systems. It preserves the archive lineage while feeding future runtime concepts.",
      },
    ];

    return `
      <section class="zone-card hero programs-hero">
        <div class="section-head">
          <p class="eyebrow">ELECTRONIC ARTEFACTS</p>
          <h1 class="display-title">Programs.</h1>
          <p class="lede">VASTE, Forge, VOID and OracleHub.</p>
          <div class="button-row button-row--compact">
            <a class="button button--primary" href="https://www.vaste.space/" target="_blank" rel="noreferrer">VASTE</a>
            <a class="button button--secondary" href="./research.html">Research</a>
          </div>
          ${metricRail(
            [
              { label: "DIRECTIONS", value: "4", note: "core branches", fill: 0.95, tone: "live" },
              { label: "RUNTIME", value: "VASTE", note: "core program", fill: 0.88, tone: "system" },
              { label: "PRODUCTION", value: "Forge", note: "active research", fill: 0.78, tone: "visual" },
              { label: "ARCHIVES", value: "VOID / OracleHub", note: "legacy lineages", fill: 0.68, tone: "archive" },
            ],
            { limit: 4, compact: true },
          )}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">CORE REGISTRY</p>
          <h2>Four software directions</h2>
          <p class="lede">Each card keeps one role, one technology anchor and one compact classification line.</p>
        </div>
        <div class="card-grid card-grid--two">
          ${registryCards}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">CORE PRINCIPLES</p>
          <h2>Forge</h2>
          <p class="lede">Production is organized as a shared architecture with pipelines, inheritance and refinement.</p>
        </div>
        <div class="card-grid card-grid--two">
          ${forgePrinciples
            .map(
              (item) => `
                <article class="panel panel--soft">
                  <p class="card__meta">${esc(item.title)}</p>
                  <p class="card__copy">${esc(item.copy)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="split">
          <article class="panel panel--soft">
            <p class="card__meta">Current domains</p>
            <h3 class="card__title">Video / 3D Assets</h3>
            <div class="tag-cluster tag-cluster--compact">${forgeCurrentDomains.map((item) => chip(item)).join("")}</div>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Future domains</p>
            <h3 class="card__title">Extensible output families</h3>
            <div class="tag-cluster tag-cluster--compact">${forgeFutureDomains.map((item) => chip(item)).join("")}</div>
          </article>
        </div>
        <article class="panel panel--soft">
          <p class="card__meta">Long term vision</p>
          <p class="card__copy">Forge studies production as a shared logic.</p>
        </article>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PROGRAM RELATIONSHIPS</p>
          <h2>Electronic Artefacts</h2>
          <p class="lede">Four software directions, one stack.</p>
        </div>
        <div class="relationship-graph">
          <div class="graph-root">Electronic Artefacts</div>
          <div class="graph-columns">
            ${relationshipColumns
              .map(
                (column) => `
                  <div class="graph-column">
                    <p class="card__meta">${esc(column.title)}</p>
                    ${column.nodes.map((node) => `<div class="graph-node">${esc(node)}</div>`).join("")}
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">TECHNOLOGY MAP</p>
          <h2>Language alignment</h2>
          <p class="lede">Each stack keeps a primary language visible.</p>
        </div>
        <div class="graph-columns">
          ${technologyMap
            .map(
              (column) => `
                <div class="graph-column">
                  <p class="card__meta">${esc(column.title)}</p>
                  ${column.nodes.map((node) => `<div class="graph-node">${esc(node)}</div>`).join("")}
                </div>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">STRATEGIC OBSERVATION</p>
          <h2>Four directions.</h2>
          <p class="lede">A compact set of directions.</p>
        </div>
        <div class="stat-grid">
          ${strategicObservation
            .map(
              (item, index) => `
                <article class="stat-card">
                  <p class="card__meta">0${index + 1}</p>
                  <strong>${esc(item.title)}</strong>
                  <span>${esc(item.copy)}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  };
  const renderProjects = () => {
    const grouped = [
      {
        label: "Art Translation",
        copy: "The central artistic project line translating VOID into public forms.",
        items: [catalog.projects.find((item) => item.id === "palimpsests")].filter(Boolean),
      },
      {
        label: "Narrative Extensions",
        copy: "Branches that extend the artistic material into broader narrative frames.",
        items: [catalog.projects.find((item) => item.id === "vestiges")].filter(Boolean),
      },
      {
        label: "Applied Surfaces",
        copy: "Project-shaped public or client surfaces that remain outside the core theory/art/technology triad.",
        items: [
          catalog.projects.find((item) => item.id === "unionmob"),
          catalog.projects.find((item) => item.id === "atypikhouse"),
          catalog.projects.find((item) => item.id === "oeil-de-meg"),
        ].filter(Boolean),
      },
    ].filter((group) => group.items.length);

    return `
      <section class="zone-card hero programs-hero">
        <div class="section-head">
          <p class="eyebrow">PROJECTS</p>
          <h1 class="display-title">Projects as artistic translation.</h1>
          <p class="lede">PALIMPSESTS leads the line. The rest stays in orbit.</p>
          <div class="button-row">
            <a class="button button--primary" href="./work.html">Work</a>
            <a class="button button--secondary" href="./research.html">Research</a>
            <a class="button button--secondary" href="./archive.html">Archive</a>
          </div>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">THREE PILLARS</p>
          <h2>Theory, art and technology</h2>
          <p class="lede">VOID, PALIMPSESTS and the program stack.</p>
        </div>
        <div class="split">
          <article class="panel panel--soft">
            <p class="card__meta">Theory</p>
            <h3 class="card__title">VOID</h3>
            <p class="card__copy">Theoretical source for entropy, emergence, runtime, systems, information and anthropic studies.</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Art</p>
            <h3 class="card__title">PALIMPSESTS</h3>
            <p class="card__copy">Research sandbox where theory becomes music, fragments, memory and narrative experience.</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Technology</p>
            <h3 class="card__title">VASTE / ORETH / FORGE / OracleHub</h3>
            <p class="card__copy">Technical systems that support execution, analysis, generation and knowledge flows.</p>
          </article>
        </div>
      </section>
      <section class="stack projects-stack">
        ${grouped
          .map(
            (group) => `
              <section class="zone-card hero">
                <div class="section-head">
                  <p class="eyebrow">PROJECT GROUP</p>
                  <h2>${esc(group.label)}</h2>
                  <p class="lede">${esc(group.copy)}</p>
                </div>
                <div class="card-grid card-grid--two projects-grid">
                  ${group.items.map(projectLandingCard).join("")}
                </div>
              </section>
            `,
          )
          .join("")}
      </section>
    `;
  };
  const renderProjectLine = () => {
    const id = new URLSearchParams(window.location.search).get("id");
    const item = id ? entityById(id) : null;
    if (!item || item.kind !== "project") {
      return `
        <section class="zone-card hero">
          <div class="section-head">
            <p class="eyebrow">PROJECT RL</p>
            <h1 class="display-title">Project line not found.</h1>
            <p class="lede">Open a project from the landing page to access its RL surface.</p>
            <div class="button-row">
              <a class="button button--primary" href="./projects.html">Projects</a>
              <a class="button button--secondary" href="./work.html">Work</a>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="zone-card hero">
        <div class="section-head${item.id === "oeil-de-meg" ? " section-head--signature" : ""}">
          ${projectSignatureBubble(item, "hero")}
          <p class="eyebrow">PROJECT RL</p>
          <h1 class="display-title">${esc(item.title)}</h1>
          <p class="lede">${esc(item.summary || item.description || "")}</p>
          <div class="button-row">
            <a class="button button--primary" href="./project.html?id=${encodeURIComponent(item.id)}">Detail page</a>
            <a class="button button--secondary" href="./projects.html">Projects</a>
            <a class="button button--secondary" href="./archive.html">Archive</a>
          </div>
        </div>
        <div class="stat-grid project-line-grid">
          <article class="stat-card">
            <p class="card__meta">Category</p>
            <strong>${esc(item.category || item.type || "Project")}</strong>
            <span>${esc(item.type || "Project entry")}</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Program</p>
            <strong>${esc(item.program || "Electronic Artefacts")}</strong>
            <span>Publishing and system context.</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Era</p>
            <strong>${esc(item.temporality?.era || "foundation")}</strong>
            <span>Temporal placement in the catalogue.</span>
          </article>
        </div>
      </section>
      <section class="detail-grid">
        ${metadataPanel(item)}
        ${relationsPanel(item)}
        ${timelinePanel(item)}
        ${activityPanel(item)}
        ${researchPanel(item)}
        ${dependenciesPanel(item)}
        ${tagsPanel(item)}
        ${relatedEntriesPanel(item)}
      </section>
    `;
  };
  const renderWork = () => pageLens("work") + workTaxonomy() + catalogSectionWork();
  const renderResearch = () => pageLens("research") + researchFields() + researchPrograms() + researchNotes();
  const renderProgramsPage = () => pageLens("programs") + renderPrograms();
  const renderProjectsPage = () => pageLens("projects") + renderProjects();
  const renderArchive = () => pageLens("archive") + archiveTaxonomy() + archiveLibrary();
  const renderAbout = () => pageLens("about") + aboutMap() + aboutNetwork();
  const renderContact = () => pageLens("contact") + contactLinks();

  const catalogSectionWork = () => {
    const groups = [
      {
        label: "Internal Projects",
        copy: "Core works, translations and pillars.",
        items: [
          catalog.researchFields.find((item) => item.id === "void"),
          catalog.projects.find((item) => item.id === "palimpsests"),
          catalog.artists.find((item) => item.id === "oreth"),
          catalog.programs.find((item) => item.id === "vaste"),
          catalog.programs.find((item) => item.id === "forge"),
          catalog.programs.find((item) => item.id === "oraclehub"),
        ].filter(Boolean),
      },
      {
        label: "Collaborations",
        copy: "Collaborative relationships and shared work.",
        items: [
          catalog.artists.find((item) => item.id === "noi-save"),
          catalog.artists.find((item) => item.id === "marjolaine-muller"),
        ].filter(Boolean),
      },
      {
        label: "External Works",
        copy: "Outside commissions and public-facing work.",
        items: [
          catalog.projects.find((item) => item.id === "seven-temps-seulement"),
          catalog.projects.find((item) => item.id === "atypikhouse"),
          catalog.projects.find((item) => item.id === "oeil-de-meg"),
        ].filter(Boolean),
      },
    ].filter((group) => group.items.length);

    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">WORK CATALOG</p>
          <h2>Internal works, collaborations and external works</h2>
          <p class="lede">Own work, collaborations and outside work.</p>
        </div>
        <div class="catalog-stack">
          ${groups
            .map(
              (group) => `
                <section class="catalog-group">
                  <div class="section-head">
                    <h3>${esc(group.label)}</h3>
                    <p class="lede">${esc(group.copy)}</p>
                  </div>
                  <div class="card-grid ${group.items.length > 2 ? "card-grid--two" : "card-grid--two"}">
                    ${group.items
                      .map((item) => {
                        if (item.kind === "artist") return personCard(item, { href: `./entity.html?id=${encodeURIComponent(item.id)}` });
                        if (item.kind === "program") return programCard(item, { href: `./entity.html?id=${encodeURIComponent(item.id)}` });
                        if (item.kind === "researchField") return researchCard(item, { href: `./entity.html?id=${encodeURIComponent(item.id)}` });
                        return projectCard(item);
                      })
                      .join("")}
                  </div>
                </section>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  };

  const renderers = {
    home: {
      "home-vaste-banner": renderVasteBanner,
      "home-featured-work": renderFeaturedWork,
      "home-featured-research": renderFeaturedResearch,
      "home-latest": renderLatest,
      "home-activity": renderActivityFeed,
      "home-collections": renderCollectionsPanel,
      "cross-navigation": renderCrossNavigation,
    },
    work: {
      "work-taxonomy": () => pageLens("work") + workTaxonomy(),
      "work-catalog": catalogSectionWork,
      "cross-navigation": renderCrossNavigation,
    },
    projects: {
      "projects-page": renderProjectsPage,
      "cross-navigation": renderCrossNavigation,
    },
    research: {
      "research-fields": () => pageLens("research") + researchFields(),
      "research-programs": researchPrograms,
      "research-notes": researchNotes,
      "cross-navigation": renderCrossNavigation,
    },
    programs: {
      "programs-page": renderProgramsPage,
      "cross-navigation": renderCrossNavigation,
    },
    archive: {
      "archive-taxonomy": () => pageLens("archive") + archiveTaxonomy(),
      "archive-library": archiveLibrary,
      "cross-navigation": renderCrossNavigation,
    },
    about: {
      "about-map": () => pageLens("about") + aboutMap(),
      "about-network": aboutNetwork,
      "cross-navigation": renderCrossNavigation,
    },
    contact: {
      "contact-links": renderContact,
      "cross-navigation": renderCrossNavigation,
    },
    search: {
      "search-page": renderSearchPage,
      "cross-navigation": renderCrossNavigation,
    },
    detail: {
      "entity-detail": renderDetailPage,
      "cross-navigation": renderCrossNavigation,
    },
    "project-rl": {
      "project-rl-page": renderProjectLine,
      "cross-navigation": renderCrossNavigation,
    },
  };

  const renderPageSections = () => {
    const pageRenderers = renderers[page];
    if (!pageRenderers) return;
    Object.entries(pageRenderers).forEach(([selector, renderer]) => {
      const target = document.querySelector(`[data-render="${selector}"]`);
      if (!target) return;
      try {
        target.innerHTML = renderer();
      } catch (error) {
        console.error(`Render failed for ${selector}`, error);
        target.innerHTML = `
          <section class="zone-card hero">
            <div class="section-head">
              <p class="eyebrow">RENDER ERROR</p>
              <h1 class="display-title">${esc(selector)}</h1>
              <p class="lede">This section failed to render. Reload the page and check the browser console for details.</p>
            </div>
            <div class="panel panel--soft">
              <p class="card__meta">Error</p>
              <p class="card__copy">${esc(error?.message || String(error))}</p>
            </div>
          </section>
        `;
      }
    });
    initFilters(filterState);
    initSearch(searchState, renderPageSections);
    initCardLinks();
    initUXEnhancements(filterState);
    startVasteEngineAnimation();
    startGraphSurfaceAnimation();
  };

  const load = async () => {
    await loadIncludes();
    document.querySelectorAll("[data-zone]").forEach((zone, index) => {
      zone.dataset.zoneIndex = String(index + 1);
      zone.style.setProperty("--zone-index", String(index + 1));
    });
    const current = document.body.dataset.page;
    syncNavigationState(current);
    syncPageTitle({ current, entityById, collectionById });
    renderPageSections();
    setYear();
  };

  load().catch(() => setYear());
})();
