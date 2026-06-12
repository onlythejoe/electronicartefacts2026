(function () {
  const catalog = window.EA_CATALOG || {};
  const page = document.body.dataset.page || "home";
  const filterState = new Map();
  const { esc, setYear, chunk } = window.EA_UTILS;
  const { loadIncludes } = window.EA_INCLUDES;
  const { statusBadge, entityBadge, chip, tagRow, relationList, metadataList, linkRow, cardLinkAttrs, cardOverlayLink } =
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
      <div class="project-mark-bubble project-mark-bubble--${esc(variant)}" aria-hidden="true">
        <img class="project-mark-bubble__logo" src="./assets/media/projects/oeil-de-meg/oeil-de-meg-logo.png" alt="" loading="lazy" />
        <span class="project-mark-bubble__coin">
          <img class="project-mark-bubble__picto" src="./assets/media/projects/oeil-de-meg/oeil-de-meg-picto.svg" alt="" loading="lazy" />
        </span>
      </div>
    `;
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

  const projectCard = (item) => `
    <article class="project-card${item?.id === "oeil-de-meg" ? " project-card--signature" : ""}" ${cardBaseAttrs(item)}>
      ${item.kind === "project" ? `<a class="project-card__overlay-link" href="./project.html?id=${encodeURIComponent(item.id)}" aria-label="Open ${esc(item.title)} detail"></a>` : ""}
      ${projectSignatureBubble(item, "card")}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || catalog.entityTypes?.[item.kind] || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardCopy(item.summary, 2)}
      ${signalStrip(item)}
      <div class="project-card__meta">
        ${entityBadge(item.kind || "project")}
        ${chip(`Type: ${item.type || "Project"}`)}
        ${item.category ? chip(`Category: ${item.category}`) : ""}
      </div>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])], { limit: 3, compact: true })}
      ${metadataList([
        { label: "Artist", value: item.artist },
        { label: "Program", value: item.program },
      ])}
      ${relationList(item.related)}
      ${linkRow(
        item.kind === "project" ? { label: "Detail", href: `./project.html?id=${encodeURIComponent(item.id)}` } : item.cta,
        [
          ...(item.kind === "project" ? [{ label: "RL", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` }] : []),
          ...(item.links || []),
        ],
      )}
    </article>
  `;

  const projectLandingCard = (item) => `
    <article class="project-card${item?.id === "oeil-de-meg" ? " project-card--signature" : ""}" data-project-detail-link="${esc(item.route || `./project.html?id=${encodeURIComponent(item.id)}`)}" tabindex="0" role="link" aria-label="Open ${esc(item.title)} detail" ${cardBaseAttrs(item)}>
      <a class="project-card__overlay-link" href="${esc(item.route || `./project.html?id=${encodeURIComponent(item.id)}`)}" aria-label="Open ${esc(item.title)} detail"></a>
      ${projectSignatureBubble(item, "card")}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.category || item.type || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardCopy(item.summary, 2)}
      ${signalStrip(item)}
      <div class="project-card__meta">
        ${entityBadge("project")}
        ${item.program ? chip(`Program: ${item.program}`) : ""}
        ${item.temporality?.era ? chip(`Era: ${item.temporality.era}`) : ""}
      </div>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])], { limit: 2, compact: true })}
      <div class="link-row">
        <a class="tag" href="${esc(item.route || `./project.html?id=${encodeURIComponent(item.id)}`)}">Detail</a>
        <a class="tag" href="./project-rl.html?id=${encodeURIComponent(item.id)}">RL</a>
      </div>
    </article>
  `;

  const archiveCard = (item) => `
    <article class="archive-card" ${cardBaseAttrs(item)}>
      <div class="archive-card__header">
        <div class="archive-card__identity">
          <p class="card__meta">${esc(item.type || "ARCHIVE")}${item.category ? ` · ${esc(item.category)}` : ""}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
          ${cardCopy(item.summary, 2)}
          ${signalStrip(item)}
        </div>
        <div class="archive-card__status">
          ${statusBadge(item.status, item.statusLabel)}
          ${item.date ? chip(`Date: ${item.date}`) : ""}
        </div>
      </div>
      <div class="archive-card__facts">
        ${item.researchField ? `<div class="archive-card__fact archive-card__fact--wide"><span>Research field</span><strong>${esc(item.researchField)}</strong></div>` : ""}
        ${item.project ? `<div class="archive-card__fact"><span>Project</span><strong>${esc(item.project)}</strong></div>` : ""}
        ${item.artist ? `<div class="archive-card__fact"><span>Artist</span><strong>${esc(item.artist)}</strong></div>` : ""}
      </div>
      <div class="archive-card__chips">
        ${tagRow([...(item.medium || []), ...(item.discipline || []), ...(item.related || [])], { limit: 4, compact: true })}
      </div>
      ${linkRow(item.cta || null, item.links || [])}
    </article>
  `;

  const researchCard = (item, options = {}) => `
    <article class="project-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(options.href, options.label || `Open ${item.title}`)}>
      ${cardOverlayLink(options.href, options.label || `Open ${item.title}`)}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "RESEARCH FIELD")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardCopy(item.summary, 2)}
      ${signalStrip(item)}
      ${tagRow([...(item.medium || []), ...(item.discipline || [])], { limit: 3, compact: true })}
      ${metadataList([
        { label: "Projects", value: (item.relatedProjects || []).join(", ") },
        { label: "Artefacts", value: (item.relatedArtefacts || []).join(", ") },
        { label: "Programs", value: (item.relatedPrograms || []).join(", ") },
      ])}
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
      ${cardCopy(item.summary, 2)}
      ${signalStrip(item)}
      ${tagRow([...(item.medium || []), ...(item.discipline || [])], { limit: 3, compact: true })}
      ${metadataList([
        { label: "Kind", value: item.kind },
      ])}
      ${relationList(item.related)}
      ${linkRow(item.cta)}
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
      ${cardCopy(item.summary, 2)}
      ${signalStrip(item)}
      <div class="project-card__meta">
        ${entityBadge("program")}
        ${item.domain ? chip(`Domain: ${item.domain}`) : ""}
        ${item.systemGroup ? chip(`System: ${item.systemGroup}`) : ""}
      </div>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])], { limit: 3, compact: true })}
      ${relationList(item.related)}
      ${linkRow(item.cta)}
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
      ${cardCopy(item.summary, 2)}
      ${signalStrip(item)}
      <div class="project-card__meta">
        ${entityBadge("channel")}
        ${chip(`Medium: ${(item.medium || []).join(", ") || "Channel"}`)}
      </div>
      ${tagRow([...(item.discipline || [])], { limit: 2, compact: true })}
      ${relationList(item.related)}
      ${linkRow(item.cta)}
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
        <h2>Three layers, one public surface.</h2>
      </div>
      <div class="stat-grid">
        ${[
          {
            label: "Layer 01",
            title: "Studio & Label",
            copy: "Electronic Artefacts carries the public identity and the releases.",
          },
          {
            label: "Layer 02",
            title: "Recording Artist",
            copy: "ORETH carries the musical output and the Palimpsests cycle.",
          },
          {
            label: "Layer 03",
            title: "Research Program",
            copy: "VASTE stays external as the official program and system research node.",
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
    const oreth = catalog.artists?.find((item) => item.id === "oreth");
    if (!palimpsests || !oreth) return "";
    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">FEATURED WORK</p>
          <h2>Palimpsests / ORETH</h2>
          <p class="lede">Music through ORETH, with Palimpsests as the main project and a first run of audio artefacts.</p>
        </div>
        <div class="project-grid">
          ${projectCard(palimpsests)}
          ${personCard(oreth, { href: `./entity.html?id=${encodeURIComponent(oreth.id)}`, label: `Open ${oreth.title}` })}
        </div>
      </section>
    `;
  };

  const vasteBanner = () => `
    <section class="zone-card hero vaste-banner">
      <a class="vast-banner__link" href="https://www.vaste.space/" target="_blank" rel="noreferrer" aria-label="Ouvrir VASTE ENGINE sur vaste.space">
        <span class="vast-banner__eyebrow">FEATURED PROGRAM</span>
        <strong class="vast-banner__title">VASTE ENGINE</strong>
        <span class="vast-banner__copy">Runtime / research engine for systems, memory and public experimentation.</span>
        <span class="button button--primary vast-banner__cta">Visit vaste.space</span>
      </a>
    </section>
  `;

  const featuredResearch = () => {
    const vaste = catalog.programs?.find((item) => item.id === "vaste");
    const fields = catalog.researchFields?.slice(0, 2) || [];
    if (!vaste) return "";
    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">FEATURED RESEARCH</p>
          <h2>VASTE and the research field</h2>
          <p class="lede">Core program, runtime and system research. The official public link stays external.</p>
        </div>
        <div class="project-grid">
          ${programCard(vaste, { href: `./entity.html?id=${encodeURIComponent(vaste.id)}`, label: `Open ${vaste.title}` })}
          <article class="project-card" ${cardLinkAttrs("./research.html", "Open research page")}>
            ${cardOverlayLink("./research.html", "Open research page")}
            <div class="project-card__top">
              <div>
                <p class="card__meta">Research fields</p>
                <h3 class="card__title">Signals, memory, mythologies</h3>
              </div>
              ${statusBadge("research", "Lab")}
            </div>
            <p class="card__copy">The research page stays concise: references, notes and future branches only.</p>
            ${tagRow((fields.length ? fields.map((field) => field.title) : catalog.schema?.mediums || []).slice(0, 4), { limit: 4, compact: true })}
            <div class="link-row">
              <a class="tag" href="./research.html">Research</a>
              <a class="tag" href="./about.html">About</a>
            </div>
          </article>
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
          <h2>Current fragments and channels</h2>
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

  const crossNavigation = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">CROSS NAVIGATION</p>
        <h2>Always one step away from another page.</h2>
      </div>
      <div class="cross-nav-grid">
        <a class="cross-nav-card" href="./work.html"><strong>WORK</strong><span>Projects, music and technology.</span></a>
        <a class="cross-nav-card" href="./projects.html"><strong>PROJECTS</strong><span>Project landing and detail routes.</span></a>
        <a class="cross-nav-card" href="./programs.html"><strong>PROGRAMS</strong><span>All visible programs.</span></a>
        <a class="cross-nav-card" href="./research.html"><strong>RESEARCH</strong><span>Program, fields and notes.</span></a>
        <a class="cross-nav-card" href="./archive.html"><strong>ARCHIVE</strong><span>Artefacts and drafts.</span></a>
        <a class="cross-nav-card" href="./about.html"><strong>ABOUT</strong><span>Positioning and network.</span></a>
        <a class="cross-nav-card" href="./contact.html"><strong>CONTACT</strong><span>Direct channels and links.</span></a>
        <a class="cross-nav-card" href="https://www.vaste.space/" target="_blank" rel="noreferrer"><strong>VASTE</strong><span>Official external program.</span></a>
      </div>
    </section>
  `;

  const uxSurface = (eyebrow, title, copy, metrics = [], links = []) => `
    <section class="zone-card hero ux-surface">
      <div class="ux-surface__content">
        <div class="section-head">
          <p class="eyebrow">${esc(eyebrow)}</p>
          <h2>${esc(title)}</h2>
          <p class="lede">${esc(copy)}</p>
        </div>
        <div class="button-row">
          ${links.map((link, index) => `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}" href="${esc(link.href)}"${link.target ? ` target="${esc(link.target)}" rel="noreferrer"` : ""}>${esc(link.label)}</a>`).join("")}
        </div>
      </div>
      <div class="ux-surface__visual" aria-hidden="true">
        <div class="signal-orbit">
          ${metrics
            .slice(0, 5)
            .map(
              (item, index) => `
                <span class="signal-node signal-node--${index + 1}">
                  <strong>${esc(item.value)}</strong>
                  <small>${esc(item.label)}</small>
                </span>
              `,
            )
            .join("")}
        </div>
        <div class="signal-bars">
          ${metrics
            .slice(0, 6)
            .map((item, index) => `<span style="--bar:${Math.max(18, Math.min(96, Number(item.level) || 50))}%;--bar-index:${index};"></span>`)
            .join("")}
        </div>
      </div>
    </section>
  `;

  const ecosystemExplorer = () => {
    const projects = catalog.projects?.length || 0;
    const programs = catalog.programs?.length || 0;
    const artefacts = catalog.artefacts?.length || 0;
    const research = catalog.researchFields?.length || 0;
    return uxSurface(
      "INTERACTIVE LAYER",
      "Explore the system by page, relation and status.",
      "Use the quick palette, filtered taxonomies and linked cards to move through the catalogue without losing context.",
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

  const pageLens = (type) => {
    const configs = {
      work: {
        eyebrow: "WORK LENS",
        title: "Filter the public surface by role and material.",
        copy: "The work page now behaves like a small operating panel: active filter counts, draggable taxonomies and card-level navigation.",
        metrics: [
          { label: "Core", value: "06", level: 82 },
          { label: "Collab", value: "02", level: 44 },
          { label: "External", value: "03", level: 56 },
          { label: "Filters", value: "09", level: 94 },
        ],
        links: [
          { label: "Projects", href: "./projects.html" },
          { label: "Search", href: "./search.html" },
        ],
      },
      projects: {
        eyebrow: "PROJECT MAP",
        title: "Theory, art and technology stay connected.",
        copy: "Project groups now have clearer entry points, richer card motion and a direct path into detail and RL surfaces.",
        metrics: [
          { label: "Pillars", value: "03", level: 90 },
          { label: "Groups", value: "03", level: 72 },
          { label: "RL", value: "ON", level: 84 },
        ],
        links: [
          { label: "Work", href: "./work.html" },
          { label: "Research", href: "./research.html" },
        ],
      },
      research: {
        eyebrow: "RESEARCH FIELD",
        title: "Navigate theory as a structured graph.",
        copy: "The research page emphasizes hierarchy, branch relations and translation paths into PALIMPSESTS.",
        metrics: [
          { label: "VOID", value: "01", level: 96 },
          { label: "Branches", value: "06", level: 76 },
          { label: "Outputs", value: "04", level: 66 },
        ],
        links: [
          { label: "Programs", href: "./programs.html" },
          { label: "Archive", href: "./archive.html" },
        ],
      },
      programs: {
        eyebrow: "SYSTEM MONITOR",
        title: "Program groups read like a runtime stack.",
        copy: "Animated fields, genealogy and grouped cards make the technical layer easier to scan and compare.",
        metrics: [
          { label: "Systems", value: String(catalog.programs?.length || 0), level: 88 },
          { label: "Groups", value: "04", level: 80 },
          { label: "Lineage", value: "ARCA", level: 58 },
          { label: "Runtime", value: "VASTE", level: 96 },
        ],
        links: [
          { label: "VASTE", href: "https://www.vaste.space/", target: "_blank" },
          { label: "Research", href: "./research.html" },
        ],
      },
      archive: {
        eyebrow: "ARCHIVE CONSOLE",
        title: "Browse fragments as a living library.",
        copy: "Archive rails can be dragged, filtered and opened through a faster visual reading flow.",
        metrics: [
          { label: "Entries", value: String(catalog.artefacts?.length || 0), level: 82 },
          { label: "Filters", value: "08", level: 92 },
          { label: "Rails", value: "DRAG", level: 70 },
        ],
        links: [
          { label: "Search", href: "./search.html" },
          { label: "Work", href: "./work.html" },
        ],
      },
      about: {
        eyebrow: "ECOSYSTEM VIEW",
        title: "The studio reads as a connected operating system.",
        copy: "The about page now keeps method, pillars and navigation in the same visual grammar.",
        metrics: [
          { label: "Theory", value: "VOID", level: 88 },
          { label: "Art", value: "ORETH", level: 72 },
          { label: "Tech", value: "VASTE", level: 96 },
        ],
        links: [
          { label: "Work", href: "./work.html" },
          { label: "Contact", href: "./contact.html" },
        ],
      },
      contact: {
        eyebrow: "CONTACT ROUTER",
        title: "Every channel has a clear action.",
        copy: "Contact cards now sit inside the same interactive layer as the rest of the catalogue.",
        metrics: [
          { label: "Email", value: "01", level: 84 },
          { label: "Social", value: "02", level: 68 },
          { label: "External", value: "03", level: 78 },
        ],
        links: [
          { label: "Email", href: "mailto:electronic.artefacts@gmail.com" },
          { label: "Archive", href: "./archive.html" },
        ],
      },
    };
    const config = configs[type];
    if (!config) return "";
    return uxSurface(config.eyebrow, config.title, config.copy, config.metrics, config.links);
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
        copy: "Filter by status, category and discipline. Every project reads like an archive record, not a sales page.",
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
          <p class="lede">Research is no longer a flat list of topics. VOID is the core theoretical frame, and the other fields descend from it as structured branches.</p>
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
          <p class="lede">The hierarchy now distinguishes theory, interpretive bridges and artistic translation.</p>
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
          <p class="lede">Each field now belongs to VOID rather than being presented as an isolated standalone topic.</p>
        </div>
        <div class="card-grid card-grid--three">
          ${theoryFields.map((item) => researchCard(item, { href: `./entity.html?id=${encodeURIComponent(item.id)}` })).join("")}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PALIMPSESTS SANDBOX</p>
          <h2>Artistic translation of theory</h2>
          <p class="lede">PALIMPSESTS is not the research itself. It is the sandbox where VOID becomes songs, fragments, characters, visuals and narrative residues.</p>
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
        <p class="lede">VASTE anchors the stack, ARCA remains visible as the archived lineage, and ORETH plus FORGE keep the experimental branches legible.</p>
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
        <h2>Notes, fragments and observations</h2>
        <p class="lede">Short, readable records that keep the lab legible without becoming a dump.</p>
      </div>
      <div class="card-grid card-grid--two">
        ${[
          {
            title: "Fragments",
            copy: "Short observations and archival fragments that stay connected to the research system.",
          },
          {
            title: "Documents",
            copy: "Specs, references and structural notes used to keep the catalogue scalable.",
          },
          {
            title: "Observations",
            copy: "Signals, tests and process notes that can move back into Work or Archive.",
          },
          {
            title: "Foundational Era",
            copy: "Before Electronic Artefacts, the work already moved through architecture, communication systems and taxonomies. That lineage now feeds the research division.",
          },
        ]
          .map(
            (item) => `
              <article class="panel">
                <p class="card__meta">Note type</p>
                <h3 class="card__title">${esc(item.title)}</h3>
                <p class="card__copy">${esc(item.copy)}</p>
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

  const archiveTaxonomy = () =>
    taxonomyPanel(
      "archive",
      "ARCHIVE TAXONOMY",
      {
        heading: "Archive as a library",
        copy: "Filter by status, medium and discipline. Every entry should read like a fiches d'archive.",
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

  const aboutMap = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">METHOD</p>
        <h2>From theory to documentation</h2>
        <p class="lede">Electronic Artefacts organizes its work as a chain: theory, research, programs, artefacts and documentation.</p>
      </div>
      <div class="graph-root">THEORY → RESEARCH → PROGRAMS → ARTEFACTS → DOCUMENTATION</div>
      <div class="relationship-graph">
        <div class="graph-root">${esc(catalog.ecosystem?.root || "Electronic Artefacts")}</div>
        <div class="graph-columns">
          <div class="graph-column">
            <p class="card__meta">Theory</p>
            ${["VOID"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
          <div class="graph-column">
            <p class="card__meta">Art</p>
            ${["PALIMPSESTS", "ORETH"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
          <div class="graph-column">
            <p class="card__meta">Technology</p>
            ${["VASTE", "FORGE", "OracleHub", "ORETH", "UnionMob"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
          <div class="graph-column">
            <p class="card__meta">Surfaces</p>
            ${["Electronic Artefacts", "CreativeStuff.jpg", "Vestiges", "AtypikHouse", "L’Œil de Meg"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;

  const aboutNetwork = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">PILLARS</p>
        <h2>Three pillars structure the ecosystem</h2>
      </div>
      <div class="network-grid">
        ${[
          {
            eyebrow: "Theory",
            title: "VOID",
            copy: "The fundamental research frame exploring information, entropy, emergence, causality, memory and consciousness as the source theory of the studio.",
            link: { label: "Research", href: "./research.html" },
          },
          {
            eyebrow: "Art",
            title: "PALIMPSESTS",
            copy: "The musical and narrative translation sandbox where VOID becomes songs, fragments, experiences, visuals and memory-bearing structures.",
            link: { label: "Work", href: "./work.html" },
          },
          {
            eyebrow: "Technology",
            title: "VASTE",
            copy: "The central technical program: a universal runtime exploring organizations, simulations, business engines, knowledge systems and generative environments.",
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
        <h2>Direct channels and useful links</h2>
        <p class="lede">Keep it simple: email, social channels and the main external references.</p>
      </div>
      <div class="contact-grid">
        ${[
          {
            title: "electronic.artefacts@gmail.com",
            type: "Email",
            copy: "Primary contact for studio, label and research requests.",
            link: { label: "Send email", href: "mailto:electronic.artefacts@gmail.com" },
          },
          {
            title: "@electronic.artefacts",
            type: "Instagram",
            copy: "Official studio and label channel.",
            link: {
              label: "Open Instagram",
              href: "https://www.instagram.com/electronic.artefacts/",
              target: "_blank",
            },
          },
          {
            title: "@creativestuff.jpg",
            type: "Instagram",
            copy: "Visual research channel and observatory.",
            link: {
              label: "Open Instagram",
              href: "https://www.instagram.com/creativestuff.jpg/",
              target: "_blank",
            },
          },
          {
            title: "GitHub, SoundCloud, VASTE",
            type: "External links",
            copy: "Keep the public ecosystem connected without overloading the menu.",
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
              <p class="card__copy">${esc(architecture.layerCopy || "Structure, public surface, archive path and asset folder.")}</p>
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
              <h2 class="display-title">A memory dossier in images.</h2>
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
    const cycles = structure.cycles || [];
    const acts = item.acts || [];
    return [
      panelShell(
        "Identification",
        "Canonical project dossier v0.2.",
        metadataList([
          { label: "Title", value: item.title },
          { label: "Type", value: item.type },
          { label: "Medium", value: (item.medium || []).join(", ") },
          { label: "Artist", value: "ORETH" },
          { label: "Label", value: "Electronic Artefacts" },
          { label: "Status", value: catalog.taxonomies?.statuses?.[item.status]?.label || item.status },
          { label: "Classification", value: "Album, Music Project, Narrative Work, Concept Album" },
        ]),
      ),
      panelShell(
        "Core Idea",
        null,
        `<div class="stack">
          <article class="panel panel--soft">
            <p class="card__copy">${esc(item.coreIdea || item.description || item.summary || "")}</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Central question</p>
            <h3 class="card__title">${esc(item.centralQuestion || "")}</h3>
          </article>
        </div>`,
      ),
      panelShell(
        "Theme",
        null,
        `<div class="stack">
          <article class="panel panel--soft">
            <p class="card__meta">Primary theme</p>
            <h3 class="card__title">${esc(item.theme || "Heritage")}</h3>
          </article>
          ${item.subThemes?.length ? `<div class="tag-cluster">${item.subThemes.map((theme) => chip(theme)).join("")}</div>` : ""}
        </div>`,
      ),
      panelShell(
        "Origin of the Title",
        null,
        `<p class="card__copy">${esc(item.originOfTitle || "")}</p>`,
      ),
      panelShell(
        "ORETH Structure",
        structure.note || null,
        `
          <div class="project-architecture__grid">
            <article class="panel panel--soft">
              <p class="card__meta">Cycles</p>
              <h3 class="card__title">${esc(cycles.length.toString())}</h3>
              <p class="card__copy">Five letters define the long structure of ORETH.</p>
            </article>
            <article class="panel panel--soft">
              <p class="card__meta">Current material</p>
              <h3 class="card__title">${esc((structure.currentMaterial || []).length.toString())}</h3>
              <p class="card__copy">The currently identified material remains open-ended.</p>
            </article>
          </div>
          <div class="tag-cluster">
            ${cycles.map((cycle) => chip(`${cycle.letter} · ${cycle.title}`)).join("")}
          </div>
          ${(structure.currentMaterial || []).length ? `<div class="tag-cluster">${structure.currentMaterial.map((item) => chip(item)).join("")}</div>` : ""}
        `,
      ),
      panelShell(
        "Acts",
        null,
        `<div class="stack">
          ${acts
            .map(
              (act) => `
                <article class="panel panel--soft">
                  <p class="card__meta">${esc(act.title)}</p>
                  <h3 class="card__title">${esc(act.question)}</h3>
                  <p class="card__copy">${esc((act.themes || []).join(" · "))}</p>
                  ${act.artefacts?.length ? `<div class="tag-cluster">${act.artefacts.map((artefact) => chip(artefact)).join("")}</div>` : ""}
                </article>
              `,
            )
            .join("")}
        </div>`,
      ),
      panelShell(
        "Language",
        null,
        `<div class="project-architecture__grid">
          <article class="panel panel--soft">
            <p class="card__meta">Musical language</p>
            <p class="card__copy">${esc((item.musicalLanguage || []).join(", "))}</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Visual language</p>
            <p class="card__copy">${esc((item.visualLanguage || []).join(", "))}</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Textures</p>
            <p class="card__copy">${esc((item.textures || []).join(", "))}</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Symbols</p>
            <p class="card__copy">${esc((item.symbols || []).join(", "))}</p>
          </article>
        </div>`,
      ),
      panelShell(
        "Interpretations",
        null,
        `<div class="stack">
          ${(item.narrativeInterpretations || [])
            .map(
              (interpretation) => `
                <article class="panel panel--soft">
                  <p class="card__copy">${esc(interpretation)}</p>
                </article>
              `,
            )
            .join("")}
        </div>`,
      ),
      panelShell(
        "Autonomy",
        "Important",
        `<p class="card__copy">Palimpsests is autonomous. It is not defined as a sub-part of Vestiges. It exists as an independent project inside the Electronic Artefacts ecosystem, with future relations only when explicitly defined.</p>`,
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

    return `
      <section class="zone-card hero">
        <div class="section-head${item.id === "oeil-de-meg" ? " section-head--signature" : ""}">
          ${projectSignatureBubble(item, "hero")}
          <p class="eyebrow">${esc(catalog.taxonomies?.entityTypes?.[item.kind] || item.kind || kind.toUpperCase())}</p>
          <h1 class="display-title">${esc(item.title)}</h1>
          <p class="lede">${esc(item.description || item.summary || "")}</p>
          <div class="button-row">
            ${primaryLinks.map((link) => `<a class="button button--primary" href="${esc(link.href)}"${link.target ? ' target="_blank" rel="noreferrer"' : ""}>${esc(link.label)}</a>`).join("")}
            ${item.kind === "project" ? `<a class="button button--secondary" href="./project-rl.html?id=${encodeURIComponent(item.id)}">RL</a>` : ""}
            <a class="button button--secondary" href="./archive.html">Archive</a>
            <a class="button button--secondary" href="./search.html">Search</a>
          </div>
          <div class="pill-cloud">
            ${statusBadge(item.status, item.statusLabel || (item.status ? catalog.taxonomies?.statuses?.[item.status]?.label : ""))}
            ${item.maturity ? chip(`Maturity: ${catalog.taxonomies?.maturity?.[item.maturity]?.label || item.maturity}`) : ""}
            ${item.confidence ? chip(`Confidence: ${catalog.taxonomies?.confidence?.[item.confidence]?.label || item.confidence}`) : ""}
            ${item.visibility ? chip(`Visibility: ${catalog.taxonomies?.visibility?.[item.visibility]?.label || item.visibility}`) : ""}
            ${relatedCount ? chip(`Relations: ${relatedCount}`) : ""}
          </div>
        </div>
      </section>
      ${projectPanels(item) ? `<section class="detail-grid project-visual-section">${projectPanels(item)}</section>` : ""}
      ${projectSpecificPanels(item) ? `<section class="detail-grid">${projectSpecificPanels(item)}</section>` : ""}
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
          <h1 class="display-title">Search the knowledge base.</h1>
          <p class="lede">Search across titles, descriptions, tags, relations and research fields.</p>
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
    const groupOrder = [
      "Core Systems",
      "Intelligence Systems",
      "Organizational Systems",
      "Production Systems",
    ];
    const groupCopy = {
      "Core Systems": "Foundational systems that define the runtime, archive backbone and artefact engine.",
      "Intelligence Systems": "Systems that observe, analyze or produce knowledge.",
      "Organizational Systems": "Systems intended to organize humans, teams, roles and operations.",
      "Production Systems": "Tools used to produce, extend and operate other projects.",
    };
    const programDetailHref = (item) => `./entity.html?id=${encodeURIComponent(item.id)}`;
    const groupedPrograms = groupOrder
      .map((group) => ({
        group,
        items: (catalog.programs || []).filter((item) => item.systemGroup === group),
      }))
      .filter((entry) => entry.items.length);
    const programRows = chunk(programmingLanguages, 24).slice(0, 3);
    const activePrograms = (catalog.programs || []).length;
    return `
      <section class="zone-card hero programs-hero">
        <div class="section-head">
          <p class="eyebrow">PROGRAMS</p>
          <h1 class="display-title">Programs, genealogy and system branches.</h1>
          <p class="lede">
            Electronic Artefacts now separates core systems, intelligence systems, organizational systems and production systems while keeping their lineage readable.
          </p>
          <div class="button-row">
            <a class="button button--primary" href="https://www.vaste.space/" target="_blank" rel="noreferrer">VASTE</a>
            <a class="button button--secondary" href="./research.html">Research</a>
            <a class="button button--secondary" href="./archive.html">Archive</a>
          </div>
        </div>
        <div class="stat-grid programs-stats">
          <article class="stat-card">
            <p class="card__meta">Programs</p>
            <strong>${esc(String(activePrograms))}</strong>
            <span>Visible program entries in the catalog.</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Roles</p>
            <strong>Core / Intelligence / Organization / Production</strong>
            <span>The program layer is split by system function, not by chronology alone.</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Lineage</p>
            <strong>ARCA → VASTE</strong>
            <span>The current runtime stack is grounded in a visible technical genealogy.</span>
          </article>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">GENEALOGY</p>
          <h2>From ARCA to VASTE</h2>
          <p class="lede">ARCA established the asset and authenticity logic. VASTE generalizes that heritage into a broader runtime for systems, simulations, knowledge and organizational environments.</p>
        </div>
        <div class="relationship-graph">
          <div class="graph-root">ARCA → VASTE</div>
          <div class="graph-columns">
            <div class="graph-column">
              <p class="card__meta">ARCA</p>
              <div class="graph-node">NFT</div>
              <div class="graph-node">Certificates</div>
              <div class="graph-node">Auctions</div>
              <div class="graph-node">Authenticity</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">VASTE</p>
              <div class="graph-node">Runtime</div>
              <div class="graph-node">Graph Engine</div>
              <div class="graph-node">Modules</div>
              <div class="graph-node">Simulations</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Systems</p>
              <div class="graph-node">Knowledge Systems</div>
              <div class="graph-node">Operating System</div>
              <div class="graph-node">Snapshots</div>
              <div class="graph-node">Determinism</div>
            </div>
            <div class="graph-column">
              <p class="card__meta">Branches</p>
              <div class="graph-node">FORGE</div>
              <div class="graph-node">OracleHub</div>
              <div class="graph-node">UnionMob OS</div>
            </div>
          </div>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PROGRAM STACK</p>
          <h2>Electronic Artefacts program systems</h2>
          <p class="lede">Each cluster keeps the stack readable by role: foundation, intelligence, organization or production.</p>
        </div>
        <div class="catalog-stack">
          ${groupedPrograms
            .map(
              ({ group, items }) => `
                <section class="catalog-group">
                  <div class="section-head">
                    <p class="eyebrow">${esc(group.toUpperCase())}</p>
                    <h3>${esc(group)}</h3>
                    <p class="lede">${esc(groupCopy[group] || "")}</p>
                  </div>
                  <div class="card-grid card-grid--three programs-grid">
                    ${items
                      .map((item) => programCard(item, { href: programDetailHref(item), label: `Open ${item.title}` }))
                      .join("")}
                  </div>
                </section>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">LANGUAGE FIELD</p>
          <h2>Animated system wall</h2>
          <p class="lede">Electronic Artefacts can adapt across many cases, contexts, frameworks and operating conditions.</p>
        </div>
        <div class="language-field" aria-label="Programming languages animation">
          ${programRows
            .map(
              (row, index) => `
                <div class="language-marquee ${index % 2 ? "language-marquee--reverse" : ""}" style="--marquee-duration:${28 + index * 8}s;">
                  <div class="language-track">
                    ${[...row, ...row]
                      .map((language) => `<span class="language-pill">${esc(language)}</span>`)
                      .join("")}
                  </div>
                </div>
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
          <p class="lede">The central project division is no longer a flat catalogue. PALIMPSESTS is the main artistic translation of VOID, while adjacent surfaces stay secondary.</p>
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
          <p class="lede">VOID is theory, PALIMPSESTS is artistic translation, and the program stack remains the technical toolset.</p>
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
        copy: "Core Electronic Artefacts works, theory-to-art translations and internal technology pillars.",
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
        copy: "Artists and co-creation relationships that contribute to the ecosystem without being internal core projects.",
        items: [
          catalog.artists.find((item) => item.id === "noi-save"),
          catalog.artists.find((item) => item.id === "marjolaine-muller"),
        ].filter(Boolean),
      },
      {
        label: "External Works",
        copy: "Client or external-facing production work distinct from Electronic Artefacts' internal works.",
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
          <p class="lede">The work surface now separates your own works, the works you co-create, and the works you contribute to from the outside.</p>
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
      "home-featured-work": () => ecosystemExplorer() + renderFeaturedWork(),
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
