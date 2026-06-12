(function () {
  const catalog = window.EA_CATALOG || {};
  const page = document.body.dataset.page || "home";
  const filterState = new Map();

  const esc = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const currentYear = () => new Date().getFullYear();

  const setYear = () => {
    const yearNode = document.getElementById("current-year");
    if (yearNode) yearNode.textContent = String(currentYear());
  };

  const resolveIncludeUrl = (key) => {
    if (!key) return null;
    if (key === "header") return "./assets/partials/header.html";
    if (key === "footer") return "./assets/partials/footer.html";
    return `./assets/partials/${key}`;
  };

  const loadIncludes = async (root = document) => {
    const nodes = [...root.querySelectorAll("[data-include]")];
    if (!nodes.length) return;

    await Promise.all(
      nodes.map(async (node) => {
        const url = resolveIncludeUrl(node.getAttribute("data-include"));
        if (!url) return;
        const response = await fetch(url);
        node.innerHTML = await response.text();
        node.removeAttribute("data-include");
      }),
    );

    if (root.querySelector("[data-include]")) {
      await loadIncludes(root);
    }
  };

  const statusMeta = (key) => (catalog.statuses ? catalog.statuses[key] : null);

  const statusBadge = (key, label) => {
    const meta = statusMeta(key) || {};
    const text = label || meta.label || key;
    return `<span class="status-badge ${esc(meta.className || "")}">${esc(meta.icon || "◌")} ${esc(text)}</span>`;
  };

  const entityBadge = (key) =>
    `<span class="entity-badge entity-badge--${esc(key)}">${esc(catalog.entityTypes?.[key] || key)}</span>`;

  const chip = (text, extraClass = "") =>
    `<span class="chip ${esc(extraClass)}">${esc(text)}</span>`;

  const tagRow = (items) => {
    if (!items || !items.length) return "";
    return `<div class="tag-cluster">${items.map((item) => chip(item)).join("")}</div>`;
  };

  const chunk = (items, size) => {
    const output = [];
    for (let index = 0; index < items.length; index += size) {
      output.push(items.slice(index, index + size));
    }
    return output;
  };

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

  const cardBaseAttrs = (item) => {
    const medium = (item.medium || []).join(" ");
    const discipline = (item.discipline || []).join(" ");
    const researchField = item.researchField || (item.relatedResearchFields || []).join(" ");
    const year = item.temporality?.creationYear || item.date || "";
    return `
      data-filter-card
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

  const projectCard = (item) => `
    <article class="project-card" ${cardBaseAttrs(item)}>
      ${item.kind === "project" ? `<a class="project-card__overlay-link" href="./project.html?id=${encodeURIComponent(item.id)}" aria-label="Open ${esc(item.title)} detail"></a>` : ""}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || catalog.entityTypes?.[item.kind] || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      <p class="card__copy">${esc(item.summary)}</p>
      <div class="project-card__meta">
        ${entityBadge(item.kind || "project")}
        ${chip(`Type: ${item.type || "Project"}`)}
        ${item.category ? chip(`Category: ${item.category}`) : ""}
      </div>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])])}
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
    <article class="project-card" data-project-detail-link="${esc(item.route || `./project.html?id=${encodeURIComponent(item.id)}`)}" tabindex="0" role="link" aria-label="Open ${esc(item.title)} detail" ${cardBaseAttrs(item)}>
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.category || item.type || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      <p class="card__copy">${esc(item.summary)}</p>
      <div class="project-card__meta">
        ${entityBadge("project")}
        ${item.program ? chip(`Program: ${item.program}`) : ""}
        ${item.temporality?.era ? chip(`Era: ${item.temporality.era}`) : ""}
      </div>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])])}
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
          <p class="card__copy">${esc(item.summary)}</p>
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
        ${tagRow([...(item.medium || []), ...(item.discipline || []), ...(item.related || [])])}
      </div>
      ${linkRow(item.cta || null, item.links || [])}
    </article>
  `;

  const researchCard = (item) => `
    <article class="project-card" ${cardBaseAttrs(item)}>
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "RESEARCH FIELD")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      <p class="card__copy">${esc(item.summary)}</p>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])])}
      ${metadataList([
        { label: "Projects", value: (item.relatedProjects || []).join(", ") },
        { label: "Artefacts", value: (item.relatedArtefacts || []).join(", ") },
        { label: "Programs", value: (item.relatedPrograms || []).join(", ") },
      ])}
    </article>
  `;

  const personCard = (item) => `
    <article class="project-card" ${cardBaseAttrs(item)}>
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "ARTIST")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      <p class="card__copy">${esc(item.summary)}</p>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])])}
      ${metadataList([
        { label: "Kind", value: item.kind },
      ])}
      ${relationList(item.related)}
      ${linkRow(item.cta)}
    </article>
  `;

  const programCard = (item) => `
    <article class="program-card" ${cardBaseAttrs(item)}>
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "PROGRAM")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      <p class="card__copy">${esc(item.summary)}</p>
      <div class="project-card__meta">
        ${entityBadge("program")}
      </div>
      ${tagRow([...(item.medium || []), ...(item.discipline || [])])}
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
      <p class="card__copy">${esc(item.summary)}</p>
      <div class="project-card__meta">
        ${entityBadge("channel")}
        ${chip(`Medium: ${(item.medium || []).join(", ") || "Channel"}`)}
      </div>
      ${tagRow([...(item.discipline || [])])}
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
          ${personCard(oreth)}
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
          ${programCard(vaste)}
          <article class="project-card">
            <div class="project-card__top">
              <div>
                <p class="card__meta">Research fields</p>
                <h3 class="card__title">Signals, memory, mythologies</h3>
              </div>
              ${statusBadge("research", "Lab")}
            </div>
            <p class="card__copy">The research page stays concise: references, notes and future branches only.</p>
            ${tagRow(catalog.mediums.slice(0, 5))}
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
                <article class="panel panel--soft">
                  <p class="card__meta">${esc(item.type)}</p>
                  <h3 class="card__title">${esc(item.title)}</h3>
                  <p class="card__copy">${esc(item.summary)}</p>
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

  const researchFields = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">RESEARCH FIELDS</p>
        <h2>Research fields</h2>
        <p class="lede">A compact map of the studio's ongoing research directions.</p>
      </div>
      <div class="card-grid card-grid--three">
        ${(catalog.researchFields || []).map(researchCard).join("")}
      </div>
    </section>
  `;

  const researchPrograms = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">PROGRAMS</p>
        <h2>Programs</h2>
        <p class="lede">VASTE anchors the stack, OracleHub remains the archive precursor, and Audio Analysis Engine keeps the dormant prototype line visible.</p>
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
        <p class="eyebrow">ABOUT</p>
        <h2>Ecology map</h2>
        <p class="lede">A readable map of the studio ecosystem, designed to be scanned like a taxonomy tree.</p>
      </div>
      <div class="relationship-graph">
        <div class="graph-root">${esc(catalog.ecosystem?.root || "Electronic Artefacts")}</div>
        <div class="graph-columns">
          <div class="graph-column">
            <p class="card__meta">Programs</p>
            ${["VASTE", "OracleHub", "Audio Analysis Engine"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
          <div class="graph-column">
            <p class="card__meta">Artists</p>
            ${["ORETH"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
          <div class="graph-column">
            <p class="card__meta">Projects</p>
            ${["Palimpsests", "Vestiges", "UnionMob", "AtypikHouse", "L’Œil de Meg"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
          <div class="graph-column">
            <p class="card__meta">Channels</p>
            ${["Electronic Artefacts", "CreativeStuff.jpg"].map((label) => `<div class="graph-node">${esc(label)}</div>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;

  const aboutNetwork = () => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">NETWORK</p>
        <h2>Positioning and network</h2>
      </div>
      <div class="network-grid">
        ${[
          {
            eyebrow: "Studio & Label",
            title: "Electronic Artefacts",
            copy: "Official studio channel, releases and research updates.",
            link: { label: "Contact", href: "./contact.html" },
          },
          {
            eyebrow: "Recording Artist",
            title: "ORETH",
            copy: "Artist layer carrying the Palimpsests cycle.",
            link: { label: "Work", href: "./work.html" },
          },
          {
            eyebrow: "Visual Research Channel",
            title: "CreativeStuff.jpg",
            copy: "Observatory for references, images and editorial signals.",
            link: { label: "Instagram", href: "https://www.instagram.com/creativestuff.jpg/", target: "_blank" },
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
        { label: "Status", value: catalog.taxonomies?.statuses?.[item.status]?.label || item.status },
        { label: "Maturity", value: catalog.taxonomies?.maturity?.[item.maturity]?.label || item.maturity },
        { label: "Confidence", value: catalog.taxonomies?.confidence?.[item.confidence]?.label || item.confidence },
        { label: "Visibility", value: catalog.taxonomies?.visibility?.[item.visibility]?.label || item.visibility },
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
    return panelShell(
      "Local dossier",
      "Project-specific image folder.",
      `
        <div class="project-gallery">
          ${
            gallery.length
              ? gallery
                  .map(
                    (image) => `
                      <figure class="project-gallery__item">
                        <img class="project-gallery__image" src="${esc(image.src)}" alt="${esc(image.alt || item.title)}" />
                        ${image.caption ? `<figcaption>${esc(image.caption)}</figcaption>` : ""}
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
    return [projectArchitecturePanel(item), projectGalleryPanel(item)].filter(Boolean).join("");
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
        <div class="section-head">
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
            ${statusBadge(item.status, item.status ? catalog.taxonomies?.statuses?.[item.status]?.label : "")}
            ${item.maturity ? chip(`Maturity: ${catalog.taxonomies?.maturity?.[item.maturity]?.label || item.maturity}`) : ""}
            ${item.confidence ? chip(`Confidence: ${catalog.taxonomies?.confidence?.[item.confidence]?.label || item.confidence}`) : ""}
            ${item.visibility ? chip(`Visibility: ${catalog.taxonomies?.visibility?.[item.visibility]?.label || item.visibility}`) : ""}
            ${relatedCount ? chip(`Relations: ${relatedCount}`) : ""}
          </div>
        </div>
      </section>
      ${projectPanels(item) ? `<section class="detail-grid">${projectPanels(item)}</section>` : ""}
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
              (entry) => `
                <article class="panel panel--soft">
                  <p class="card__meta">${esc(entry.date)} · ${esc(entry.type)}</p>
                  <h3 class="card__title">${esc(entry.title)}</h3>
                  <p class="card__copy">${esc(entry.summary)}</p>
                </article>
              `,
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
              <article class="panel">
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
    const programRows = chunk(programmingLanguages, 24).slice(0, 3);
    const activePrograms = (catalog.programs || []).length;
    return `
      <section class="zone-card hero programs-hero">
        <div class="section-head">
          <p class="eyebrow">PROGRAMS</p>
          <h1 class="display-title">All programs in one field.</h1>
          <p class="lede">
            A dedicated landing page for the program stack. The animation below is a curated, extensible language wall, not a literal census of every language ever written.
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
            <strong>Runtime / Archive / Prototype</strong>
            <span>The stack is split by function, not by noise.</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Surface</p>
            <strong>Animated language field</strong>
            <span>Representative languages drifting across the screen.</span>
          </article>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PROGRAM STACK</p>
          <h2>Active and historical programs</h2>
          <p class="lede">The landing page keeps the program catalog visible and browsable.</p>
        </div>
        <div class="card-grid card-grid--three programs-grid">
          ${(catalog.programs || []).map(programCard).join("")}
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
    const grouped = (catalog.projects || []).reduce((acc, item) => {
      const key = item.category || item.type || "Project";
      (acc[key] || (acc[key] = [])).push(item);
      return acc;
    }, {});

    return `
      <section class="zone-card hero programs-hero">
        <div class="section-head">
          <p class="eyebrow">PROJECTS</p>
          <h1 class="display-title">Project landing.</h1>
          <p class="lede">A dedicated page for all project entries. Each project now has a landing card, a detail route and a foundation for a future RL surface.</p>
          <div class="button-row">
            <a class="button button--primary" href="./work.html">Work</a>
            <a class="button button--secondary" href="./research.html">Research</a>
            <a class="button button--secondary" href="./archive.html">Archive</a>
          </div>
        </div>
      </section>
      <section class="stack">
        ${Object.entries(grouped)
          .map(
            ([group, items]) => `
              <section class="zone-card hero">
                <div class="section-head">
                  <p class="eyebrow">PROJECT GROUP</p>
                  <h2>${esc(group)}</h2>
                  <p class="lede">${esc(items.length)} project${items.length > 1 ? "s" : ""}.</p>
                </div>
                <div class="card-grid card-grid--two projects-grid">
                  ${items.map(projectLandingCard).join("")}
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
        <div class="section-head">
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
  const renderWork = () => workTaxonomy() + catalogSectionWork();
  const renderResearch = () => researchFields() + researchPrograms() + researchNotes();
  const renderProgramsPage = () => renderPrograms();
  const renderProjectsPage = () => renderProjects();
  const renderArchive = () => archiveTaxonomy() + archiveLibrary();
  const renderAbout = () => aboutMap() + aboutNetwork();
  const renderContact = () => contactLinks();

  const catalogSectionWork = () => {
    const groups = [
      {
        label: "Music",
        items: [
          catalog.projects.find((item) => item.id === "palimpsests"),
          catalog.artists.find((item) => item.id === "oreth"),
        ].filter(Boolean),
      },
      {
        label: "Technology",
        items: [
          catalog.programs.find((item) => item.id === "vaste"),
          catalog.programs.find((item) => item.id === "oraclehub"),
          catalog.projects.find((item) => item.id === "unionmob"),
          catalog.projects.find((item) => item.id === "atypikhouse"),
        ].filter(Boolean),
      },
      {
        label: "Creative",
        items: [catalog.projects.find((item) => item.id === "oeil-de-meg")].filter(Boolean),
      },
      {
        label: "Narrative Universes",
        items: [catalog.projects.find((item) => item.id === "vestiges")].filter(Boolean),
      },
    ];

    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">WORK CATALOG</p>
          <h2>Projects grouped by role</h2>
          <p class="lede">Every project carries a status, a type, a summary, a CTA and related links.</p>
        </div>
        <div class="catalog-stack">
          ${groups
            .map(
              (group) => `
                <section class="catalog-group">
                  <div class="section-head">
                    <h3>${esc(group.label)}</h3>
                    <p class="lede">${esc(group.items.length)} entries</p>
                  </div>
                  <div class="card-grid ${group.items.length > 2 ? "card-grid--two" : "card-grid--two"}">
                    ${group.items
                      .map((item) => {
                        if (item.kind === "artist") return personCard(item);
                        if (item.kind === "program") return programCard(item);
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
      "work-taxonomy": workTaxonomy,
      "work-catalog": catalogSectionWork,
      "cross-navigation": renderCrossNavigation,
    },
    projects: {
      "projects-page": renderProjectsPage,
      "cross-navigation": renderCrossNavigation,
    },
    research: {
      "research-fields": researchFields,
      "research-programs": researchPrograms,
      "research-notes": researchNotes,
      "cross-navigation": renderCrossNavigation,
    },
    programs: {
      "programs-page": renderProgramsPage,
      "cross-navigation": renderCrossNavigation,
    },
    archive: {
      "archive-taxonomy": archiveTaxonomy,
      "archive-library": archiveLibrary,
      "cross-navigation": renderCrossNavigation,
    },
    about: {
      "about-map": aboutMap,
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

  const applyFilters = (scope) => {
    const section = document.querySelector(`[data-filter-scope="${scope}"]`);
    if (!section) return;
    const state = filterState.get(scope) || {};
    const cards = document.querySelectorAll("[data-filter-card]");
    cards.forEach((card) => {
      const visible = Object.entries(state).every(([key, value]) => {
        if (!value || value === "all") return true;
        const raw = card.getAttribute(`data-${key}`) || "";
        return raw.toLowerCase().includes(value.toLowerCase());
      });
      card.hidden = !visible;
    });
  };

  const initFilters = () => {
    document.querySelectorAll("[data-filter-scope]").forEach((section) => {
      const scope = section.getAttribute("data-filter-scope");
      if (!scope) return;
      if (!filterState.has(scope)) filterState.set(scope, {});

      section.querySelectorAll("[data-filter-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          const key = button.getAttribute("data-filter-key");
          const value = button.getAttribute("data-filter-value");
          const state = filterState.get(scope) || {};
          const next = state[key] === value ? "all" : value;
          state[key] = next;
          filterState.set(scope, state);

          section.querySelectorAll(`[data-filter-key="${esc(key)}"]`).forEach((chip) => {
            chip.classList.toggle("is-active", chip.getAttribute("data-filter-value") === next);
            chip.setAttribute(
              "aria-pressed",
              chip.getAttribute("data-filter-value") === next ? "true" : "false",
            );
          });

          applyFilters(scope);
        });
      });
    });
  };

  const initSearch = () => {
    const input = document.querySelector("[data-search-input]");
    if (!input) return;
    input.value = searchState.query;
    input.addEventListener("input", () => {
      searchState.query = input.value.trim().toLowerCase();
      renderPageSections();
    });

    document.querySelectorAll("[data-search-status-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        searchState.status = chip.getAttribute("data-value") || "all";
        renderPageSections();
      });
    });

    document.querySelectorAll("[data-search-kind-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        searchState.kind = chip.getAttribute("data-value") || "all";
        renderPageSections();
      });
    });
  };

  const initProjectDetailLinks = () => {
    document.querySelectorAll("[data-project-detail-link]").forEach((card) => {
      if (card.dataset.boundProjectDetailLink === "true") return;
      card.dataset.boundProjectDetailLink = "true";
      const target = card.getAttribute("data-project-detail-link");
      if (!target) return;
      const navigate = () => {
        window.location.href = target;
      };

      card.addEventListener("click", (event) => {
        if (event.target.closest("a,button,input,select,textarea,label")) return;
        navigate();
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate();
        }
      });
    });
  };

  const renderPageSections = () => {
    const pageRenderers = renderers[page];
    if (!pageRenderers) return;
    Object.entries(pageRenderers).forEach(([selector, renderer]) => {
      const target = document.querySelector(`[data-render="${selector}"]`);
      if (!target) return;
      target.innerHTML = renderer();
    });
    initFilters();
    initSearch();
    initProjectDetailLinks();
  };

  const load = async () => {
    await loadIncludes();
    document.querySelectorAll("[data-zone]").forEach((zone, index) => {
      zone.dataset.zoneIndex = String(index + 1);
      zone.style.setProperty("--zone-index", String(index + 1));
    });
    const current = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === current) {
        link.setAttribute("aria-current", "page");
      }
    });
    if (current === "detail") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) || collectionById(id) : null;
      if (entry) document.title = `${entry.title} - Electronic Artefacts`;
    } else if (current === "project-rl") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) : null;
      if (entry) document.title = `${entry.title} RL - Electronic Artefacts`;
    } else if (current === "programs") {
      document.title = "Programs - Electronic Artefacts";
    } else if (current === "projects") {
      document.title = "Projects - Electronic Artefacts";
    } else if (current === "search") {
      document.title = "Search - Electronic Artefacts";
    }
    renderPageSections();
    setYear();
  };

  load().catch(() => setYear());
})();
