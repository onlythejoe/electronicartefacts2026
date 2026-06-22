(function () {
  const catalog = window.EA_CATALOG || {};
  const page = document.body.dataset.page || "home";
  const filterState = new Map();
  const { esc, setYear, slugify } = window.EA_UTILS;
  const { loadIncludes } = window.EA_INCLUDES;
  const { statusBadge, chip, tagRow, metadataList, linkRow, metricRail, cardLinkAttrs, cardOverlayLink } = window.EA_UI;
  const { initFilters, initSearch, initCardLinks, initUXEnhancements, refreshCardSurfaces, syncNavigationState, syncSeoMeta } = window.EA_BEHAVIORS;
  const {
    cardBaseAttrs,
    mediaFrom,
    mediaKindFor,
    mediaFigureMarkup,
    projectSignatureBubble,
    projectButterflyBubble,
    vasteEngineMarkup,
    startVasteEngineAnimation,
    cardImageFor,
    signalStrip,
    cardCopy,
    metricFill,
    summaryMetrics,
    countLabel,
    entityDateValue,
    homeProjects,
    featuredProjectForHome,
    projectHeroMedia,
    homeCardPills,
    projectCard,
    projectLandingCard,
    archiveCard,
    researchCard,
    personCard,
    programCard,
    channelCard,
    taxonomyPanel,
    manifestPanel,
    featuredWork,
    signatureBanner,
    isOrethSignature,
    vasteBanner,
    featuredResearch,
    latestArtefacts,
    routeCard,
  } = window.EA_VIEW;
  const { graphSurface, crossNavigation, uxSurface, nodesFromItems, ecosystemExplorer, startGraphSurfaceAnimation, pageLens } = window.EA_SURFACE;
  const indexes = catalog.indexes || {};
  const entityIndex = indexes.byId || {};
  const titleIndex = indexes.byTitleSlug || {};
  const timelineIndex = indexes.timelinesByEntityId || {};
  const activityIndex = indexes.activityByEntityId || {};

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
        options: ["all", "Public", "Archive"].map((value) => ({
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
        copy: "Filter by status, discipline, medium and visibility.",
      },
      groups,
    );
  };

  const researchFields = () => {
    const publicFields = (catalog.researchFields || []).filter((item) => item.visibility !== "internal" && item.id !== "void");
    const researchPaths = [
      {
        label: "Systems & infrastructure",
        title: "How can complex systems remain legible, adaptable and governed?",
        copy: "Runtime architecture, graph execution, information structures, simulation and organisational governance.",
        ids: ["runtime-theory", "systems-theory", "graph-runtime-studies", "governance-studies"],
      },
      {
        label: "Knowledge & transmission",
        title: "How does knowledge persist, circulate and become actionable?",
        copy: "Taxonomy, memory, signals, archives and the relationships that make knowledge discoverable.",
        ids: ["information-studies", "signal-archaeology", "artifact-theory"],
      },
      {
        label: "Perception & emergence",
        title: "What appears when rules, people and environments interact?",
        copy: "Emergence, entropy, human interpretation and the boundary between observation and construction.",
        ids: ["entropy", "emergence", "anthropic-studies", "simulation-studies"],
      },
    ];
    const researchMethod = [
      { number: "01", title: "Question", copy: "Frame a precise uncertainty, tension or behaviour worth investigating." },
      { number: "02", title: "Map", copy: "Connect references, entities, prior experiments and adjacent disciplines." },
      { number: "03", title: "Test", copy: "Build the smallest useful prototype, model, interface or artefact." },
      { number: "04", title: "Translate", copy: "Move the result into a program, project, document or reusable method." },
    ];

    return `
      <section class="zone-card hero research-overview" id="research-fields">
        <div class="section-head">
          <p class="eyebrow">RESEARCH PRACTICE</p>
          <h2>A shared space for questions that cross disciplines.</h2>
          <p class="lede">Research is organised around active questions rather than a single doctrine. Fields overlap, feed programs and produce evidence through projects, prototypes and notes.</p>
        </div>
        <div class="research-path-grid">
          ${researchPaths
            .map(
              (path, index) => `
                <article class="panel research-path-card">
                  <div class="research-path-card__top">
                    <p class="card__meta">${esc(path.label)}</p>
                    <span>0${index + 1}</span>
                  </div>
                  <h3 class="card__title">${esc(path.title)}</h3>
                  <p class="card__copy">${esc(path.copy)}</p>
                  <div class="link-row">
                    ${resolveIds(path.ids)
                      .map((field) => `<a class="tag" href="./entity.html?id=${encodeURIComponent(field.id)}">${esc(field.title)}</a>`)
                      .join("")}
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="zone-card hero research-method">
        <div class="section-head">
          <p class="eyebrow">WORKING METHOD</p>
          <h2>From uncertainty to a reusable result.</h2>
          <p class="lede">The process stays lightweight enough for exploration and structured enough to preserve what was learned.</p>
        </div>
        <div class="research-method__steps">
          ${researchMethod
            .map(
              (step) => `
                <article class="panel panel--soft">
                  <span class="research-method__number">${esc(step.number)}</span>
                  <h3 class="card__title">${esc(step.title)}</h3>
                  <p class="card__copy">${esc(step.copy)}</p>
                </article>
              `,
            )
            .join("")}
          </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">FIELD DIRECTORY</p>
          <h2>Open research fields.</h2>
          <p class="lede">${publicFields.length} connected areas of inquiry. Open any field to inspect its projects, programs, artefacts and relations.</p>
        </div>
        <div class="card-grid card-grid--three">
          ${publicFields.map((item, index) => researchCard(item, { href: `./entity.html?id=${encodeURIComponent(item.id)}`, index, hideLineage: true })).join("")}
        </div>
      </section>
    `;
  };

  const researchPrograms = () => {
    const appliedPrograms = ["vaste", "forge", "unionmob-os1", "oraclehub"]
      .map((id) => entityById(id))
      .filter(Boolean);
    return `
    <section class="zone-card hero" id="research-programs">
      <div class="section-head">
        <p class="eyebrow">APPLIED RESEARCH</p>
        <h2>When an investigation becomes a system.</h2>
        <p class="lede">Programs hold long-running technical questions. They provide continuity between experiments, production constraints and reusable infrastructure.</p>
      </div>
      <div class="card-grid card-grid--two">
        ${appliedPrograms.map(programCard).join("")}
      </div>
      <div class="link-row">
        <a class="button button--secondary" href="./programs.html">Open the full program registry</a>
        <a class="tag" href="https://www.vaste.space/" target="_blank" rel="noreferrer">Explore VASTE</a>
      </div>
    </section>
  `;
  };

  const researchNotes = () => {
    const notes = (catalog.researchLogs || []).filter((item) => item.visibility !== "internal");
    return `
    <section class="zone-card hero" id="research-notes">
      <div class="section-head">
        <p class="eyebrow">RESEARCH RECORDS</p>
        <h2>Evidence stays attached to the work.</h2>
        <p class="lede">Logs preserve decisions, tests and unresolved questions. They keep research inspectable after a prototype or project has moved on.</p>
      </div>
      <div class="card-grid card-grid--three">
        ${notes
          .map(
            (item, index) => `
              <article class="panel research-note-card${index === 0 ? " research-note-card--featured" : ""}" ${cardLinkAttrs(entryHref(item), `Open ${item.title}`)}>
                ${cardOverlayLink(entryHref(item), `Open ${item.title}`)}
                <div class="research-note-card__top">
                  <div class="research-note-card__identity">
                    <p class="card__meta">${esc(item.type || "Research log")}</p>
                    <h3 class="card__title">${esc(item.title)}</h3>
                  </div>
                  <span class="research-note-card__index">0${index + 1}</span>
                </div>
                <p class="card__copy">${esc(item.summary || item.description || "")}</p>
                <div class="tag-cluster tag-cluster--compact research-note-card__chips">
                  ${[item.date || item.temporality?.lastUpdated, ...(item.tags || []).slice(0, 3)]
                    .filter(Boolean)
                    .map((fact) => chip(fact))
                    .join("")}
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="link-row">
        <a class="button button--secondary" href="./archive.html">Browse the complete archive</a>
        <a class="tag" href="./search.html">Search all records</a>
      </div>
    </section>
  `;
  };

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
          options: ["all", "Public", "Archive"].map((value) => ({
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
      <section class="zone-card hero" id="archive-library">
        <div class="section-head">
          <p class="eyebrow">ARCHIVE LIBRARY</p>
          <h2>Browse by the form each trace currently takes.</h2>
          <p class="lede">Categories describe the artefact, not its final value. A document may become a product decision; a prototype may become a program; an audio fragment may become a release.</p>
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

  const aboutDivisions = [
    {
      id: "about-research",
      href: "#about-research",
      nodeLabel: "RESEARCH",
      meta: "Source layer",
      title: "Investigations, notes and hypotheses.",
      copy: "Research produces the concepts, tests and observations that feed the rest of the ecosystem.",
      chips: ["Notes", "Tests", "Methods", "Hypotheses", "Branches"],
      x: "-15rem",
      y: "-8rem",
      z: "-16rem",
    },
    {
      id: "about-programs",
      href: "#about-programs",
      nodeLabel: "PROGRAMS",
      meta: "System layer",
      title: "Software systems and reusable engines.",
      copy: "Programs turn research into operational logic, runtimes and internal frameworks.",
      chips: ["Runtime", "Systems", "Logic", "Infrastructure", "Engines"],
      x: "15rem",
      y: "-8rem",
      z: "16rem",
    },
    {
      id: "about-projects",
      href: "#about-projects",
      nodeLabel: "PROJECTS",
      meta: "Public layer",
      title: "Works, commissions and translated outputs.",
      copy: "Projects are the public forms that show how the system becomes visible to others.",
      chips: ["Works", "Commissions", "Translations", "Releases", "Client outputs"],
      x: "-16rem",
      y: "5rem",
      z: "10rem",
    },
    {
      id: "about-archive",
      href: "#about-archive",
      nodeLabel: "ARCHIVE",
      meta: "Memory layer",
      title: "Traces, fragments and historic material.",
      copy: "Archive keeps the ecosystem legible over time and allows the cycle to continue.",
      chips: ["Fragments", "Releases", "History", "Memory", "Context"],
      x: "16rem",
      y: "5rem",
      z: "-10rem",
    },
    {
      id: "about-vaste",
      href: "./vaste.html",
      nodeLabel: "VASTE",
      meta: "Core runtime",
      title: "The central runtime that links the stack.",
      copy: "VASTE is the core program that informs the system logic behind programs, research and related projects.",
      chips: ["Runtime", "Core", "Graph systems", "Coordination", "Knowledge"],
      x: "0rem",
      y: "16rem",
      z: "-2rem",
      emphasis: true,
    },
  ];

  const aboutMap = () =>
    graphSurface({
      eyebrow: "ECOSYSTEM VIEW",
      title: "Electronic Artefacts as an evolving ecosystem.",
      copy: "Research, programs, projects and archive stay linked as one trunk with multiple public surfaces.",
      coreLabel: catalog.ecosystem?.root || "Electronic Artefacts",
      coreCopy: "Research → Programs → Projects → Archive",
      nodes: aboutDivisions.map((division) => ({
        label: division.nodeLabel,
        note: division.meta,
        href: division.href || `#${division.id}`,
        x: division.x,
        y: division.y,
        z: division.z,
        emphasis: Boolean(division.emphasis),
      })),
      actions: [
        { label: "Overview", href: "#about-overview" },
        { label: "Layers", href: "#about-layers" },
        { label: "Entities", href: "#about-entities" },
      ],
    });

  const aboutNetwork = () => `
    <div class="stack">
      <section class="zone-card hero" id="about-overview">
        <div class="section-head">
          <p class="eyebrow">ABOUT</p>
          <h2>The trunk before the branches.</h2>
          <p class="lede">Electronic Artefacts is a creative systems ecosystem. Research feeds programs, programs shape projects, and projects accumulate into archive.</p>
        </div>
        <div class="split">
          <article class="panel panel--soft">
            <p class="card__meta">How it works</p>
            <p class="card__copy">Research produces methods and hypotheses. Programs turn those methods into reusable systems. Projects translate the systems into public works and client outcomes. Archive preserves the traces so the cycle remains legible.</p>
            <p class="card__copy">The project is not a conventional agency because the output is not a service menu. It is a system that can express itself as software, research, cultural production and memory.</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">The cycle</p>
            <h3 class="card__title">Research → Programs → Projects → Archive</h3>
            <p class="card__copy">That is the trunk. Everything else is a branch, a manifestation or a trace.</p>
            ${tagRow(["Research", "Programs", "Projects", "Archive"], { compact: true })}
            <div class="link-row">
              <a class="tag" href="./research.html">Enter Research</a>
              <a class="tag" href="./programs.html">View Programs</a>
              <a class="tag" href="./projects.html">Browse Projects</a>
              <a class="tag" href="./archive.html">Open Archive</a>
            </div>
          </article>
        </div>
      </section>

      <section class="zone-card hero" id="about-layers">
        <div class="section-head">
          <p class="eyebrow">ECOSYSTEM</p>
          <h2>The four operating layers.</h2>
          <p class="lede">Each layer has a distinct role. None of them works alone.</p>
        </div>
        <div class="network-grid">
          <article class="panel panel--soft" id="about-research">
            <p class="card__meta">Research</p>
            <h3 class="card__title">Investigations and hypotheses.</h3>
            <p class="card__copy">Research produces the questions, references and experiments that define the next move.</p>
            ${tagRow(["Notes", "Tests", "Methods", "Branches"], { compact: true })}
            <div class="link-row"><a class="tag" href="./research.html">Enter Research</a></div>
          </article>
          <article class="panel panel--soft" id="about-programs">
            <p class="card__meta">Programs</p>
            <h3 class="card__title">Reusable systems and runtimes.</h3>
            <p class="card__copy">Programs turn research into infrastructure that can be used again in other contexts.</p>
            ${tagRow(["Runtime", "Systems", "Infrastructure", "Engines"], { compact: true })}
            <div class="link-row"><a class="tag" href="./programs.html">View Programs</a></div>
          </article>
          <article class="panel panel--soft" id="about-projects">
            <p class="card__meta">Projects</p>
            <h3 class="card__title">Public works and commissions.</h3>
            <p class="card__copy">Projects translate the internal system into work that can be seen, used and published.</p>
            ${tagRow(["Works", "Commissions", "Translations", "Releases"], { compact: true })}
            <div class="link-row"><a class="tag" href="./projects.html">Browse Projects</a></div>
          </article>
          <article class="panel panel--soft" id="about-archive">
            <p class="card__meta">Archive</p>
            <h3 class="card__title">Traces, fragments and memory.</h3>
            <p class="card__copy">Archive keeps the structure visible over time and makes older layers available again.</p>
            ${tagRow(["Fragments", "History", "Context", "Memory"], { compact: true })}
            <div class="link-row"><a class="tag" href="./archive.html">Open Archive</a></div>
          </article>
        </div>
      </section>

      <section class="zone-card hero" id="about-entities">
        <div class="section-head">
          <p class="eyebrow">NAMED ENTITIES</p>
          <h2>How the named entities fit.</h2>
          <p class="lede">VASTE, Forge, Palimpsests, Vestiges and client work each occupy a different place in the same structure.</p>
        </div>
        <div class="card-grid card-grid--two">
          <article class="panel panel--soft">
            <p class="card__meta">VASTE</p>
            <h3 class="card__title">Core runtime.</h3>
            <p class="card__copy">The central program that anchors the stack and informs how systems are modeled.</p>
            <div class="link-row"><a class="tag" href="./vaste.html">Explore VASTE</a></div>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Forge</p>
            <h3 class="card__title">Production system.</h3>
            <p class="card__copy">The production layer that turns shared logic into multiple families of outputs.</p>
            <div class="link-row"><a class="tag" href="./program.html?id=forge">View Forge</a></div>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Palimpsests</p>
            <h3 class="card__title">Artistic translation.</h3>
            <p class="card__copy">The album cycle where theory becomes music, fragments and narrative residue.</p>
            <div class="link-row"><a class="tag" href="./palimpsests.html">Enter Palimpsests</a></div>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Vestiges</p>
            <h3 class="card__title">VASTE flagship platform.</h3>
            <p class="card__copy">A knowledge infrastructure for culture and craft, designed to map, preserve and activate human know-how.</p>
            <div class="link-row"><a class="tag" href="./project.html?id=vestiges">Open Vestiges</a></div>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Client work</p>
            <h3 class="card__title">Applied surfaces.</h3>
            <p class="card__copy">External commissions like L’Œil de Meg and AtypikHouse show the system in use.</p>
            <div class="link-row"><a class="tag" href="./work.html">See Client Work</a></div>
          </article>
        </div>
      </section>

      <section class="zone-card hero" id="about-philosophy">
        <div class="section-head">
          <p class="eyebrow">PHILOSOPHY</p>
          <h2>One language, many forms.</h2>
          <p class="lede">The same logic can appear as a runtime, a work, a label release or an archive piece.</p>
        </div>
        <div class="split">
          <article class="panel panel--soft">
            <p class="card__meta">Principle</p>
            <p class="card__copy">Electronic Artefacts treats systems as cultural material. The point is not to flatten the project into a service business, but to keep one conceptual core across multiple public forms.</p>
            <p class="card__copy">That is why the ecosystem can hold research, software, projects, archive and production without losing continuity.</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Vision</p>
            <p class="card__copy">Design systems. Create artefacts. Shape futures.</p>
            <p class="card__copy">The phrase works because it describes a pipeline, not a slogan.</p>
            ${tagRow(["Research", "Programs", "Projects", "Archive", "Production"], { compact: true })}
          </article>
        </div>
      </section>
    </div>
  `;

  const contactLinks = () => `
    <section class="zone-card hero contact-channels">
      <div class="section-head">
        <p class="eyebrow">DIRECT CHANNELS</p>
        <h2>Choose the channel that matches the conversation.</h2>
        <p class="lede">Email is the primary route for projects and partnerships. Social channels document the work; GitHub, SoundCloud and VASTE expose specific parts of the practice.</p>
      </div>
      <div class="contact-grid">
        ${[
          {
            title: "electronic.artefacts@gmail.com",
            type: "Email",
            copy: "Best for project briefs, partnerships, commissions and considered introductions.",
            link: { label: "Send email", href: "mailto:electronic.artefacts@gmail.com" },
          },
          {
            title: "@electronic.artefacts",
            type: "Instagram",
            copy: "Studio updates, releases and public signals from the wider ecosystem.",
            link: {
              label: "Open Instagram",
              href: "https://www.instagram.com/electronic.artefacts/",
              target: "_blank",
            },
          },
          {
            title: "@creativestuff.jpg",
            type: "Instagram",
            copy: "Visual research, references and informal observations from the image practice.",
            link: {
              label: "Open Instagram",
              href: "https://www.instagram.com/creativestuff.jpg/",
              target: "_blank",
            },
          },
          {
            title: "GitHub, SoundCloud, VASTE",
            type: "External links",
            copy: "Code, audio and the external VASTE runtime each provide a deeper technical or cultural entry point.",
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
      <div class="split contact-expectations">
        <article class="panel panel--soft">
          <p class="card__meta">Good fit</p>
          <h3 class="card__title">Complex projects that need structure.</h3>
          <p class="card__copy">Knowledge platforms, digital products, creative technology, cultural infrastructure, research-led interfaces and distinctive public systems.</p>
        </article>
        <article class="panel panel--soft">
          <p class="card__meta">Working relationship</p>
          <h3 class="card__title">Clarity before scale.</h3>
          <p class="card__copy">Early conversations focus on the real objective, available evidence, decision constraints and the smallest meaningful first phase.</p>
        </article>
      </div>
      <div class="contact-process">
        ${[
          ["01", "Frame", "Clarify the objective, users, constraints and available evidence."],
          ["02", "Scope", "Define the smallest useful phase, responsibilities and decision points."],
          ["03", "Build", "Design and implement in short reviewable increments."],
          ["04", "Transfer", "Document the system, decisions and next operating steps."],
        ]
          .map(
            ([number, title, copy]) => `
              <article class="panel panel--soft">
                <span class="research-method__number">${number}</span>
                <h3 class="card__title">${title}</h3>
                <p class="card__copy">${copy}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const entityById = (id) => entityIndex[id] || null;
  const timelineFor = (id) => timelineIndex[id] || null;
  const activityFor = (id) => activityIndex[id] || [];
  const pageRoutes = {
    home: "./index.html",
    index: "./index.html",
    work: "./work.html",
    projects: "./projects.html",
    programs: "./programs.html",
    research: "./research.html",
    archive: "./archive.html",
    about: "./about.html",
    contact: "./contact.html",
    search: "./search.html",
  };
  const labelFromSlug = (value) =>
    String(value ?? "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  const entryHref = (entry) => {
    if (!entry) return "";
    if (entry.href) return entry.href;
    if (entry.kind === "page" && entry.id && pageRoutes[entry.id]) return pageRoutes[entry.id];
    if (entry.kind === "collection") return `./collection.html?id=${encodeURIComponent(entry.id)}`;
    if (entry.kind === "project") return entry.route || `./project.html?id=${encodeURIComponent(entry.id)}`;
    if (entry.kind === "program") return `./program.html?id=${encodeURIComponent(entry.id)}`;
    if (entry.kind === "artist") return `./artist.html?id=${encodeURIComponent(entry.id)}`;
    if (entry.kind === "channel") return `./channel.html?id=${encodeURIComponent(entry.id)}`;
    if (entry.kind === "artefact" || entry.kind === "researchLog") return `./artefact.html?id=${encodeURIComponent(entry.id)}`;
    return `./entity.html?id=${encodeURIComponent(entry.id)}`;
  };
  const resolveIds = (values) =>
    (values || [])
      .map((value) => {
        if (typeof value !== "string") return value;
        const exact = entityById(value);
        if (exact) return exact;
        const slug = slugify(value);
        const byTitle = titleIndex[slug];
        if (byTitle) return byTitle;
        const pageHref = pageRoutes[slug];
        if (pageHref) {
          return {
            id: slug,
            title: labelFromSlug(value),
            kind: "page",
            href: pageHref,
          };
        }
        return { title: value, id: slug || value, kind: "reference" };
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

  const taxonomyLabel = (group, value) => catalog.taxonomies?.[group]?.[value]?.label || value;
  const statusLabelFor = (item) => item.statusLabel || catalog.taxonomies?.statuses?.[item.status]?.label || item.status || "In progress";
  const detailTypeLabel = (item) => catalog.taxonomies?.entityTypes?.[item.kind] || item.category || item.type || labelFromSlug(item.kind || "piece");
  const compactValues = (values) => values.map((value) => String(value || "").trim()).filter(Boolean);
  const readableList = (values, fallback = "") => {
    const items = compactValues(values);
    if (!items.length) return fallback;
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  };
  const relationEntriesFor = (item) => Object.values(item.relations || {}).flat().filter(Boolean);
  const signalValuesFor = (item, limit = 5) =>
    compactValues([item.category, item.type, ...(item.medium || []), ...(item.discipline || []), ...(item.tags || [])]).slice(0, limit);
  const publicEventLabel = (value) => {
    const labels = {
      artifact_published: "Publication",
      channel_updated: "Update",
      concept: "Concept",
      development: "Composition",
      production: "Production",
      program_milestone: "Milestone",
      project_created: "Definition",
      prototype: "Study",
      release: "Release",
      released: "Release",
      research: "Research",
      research_updated: "Research update",
    };
    return labels[value] || labelFromSlug(value || "Note");
  };

  const detailEditorialCopy = (item, heroMode, relatedCount) => {
    const typeLabel = detailTypeLabel(item);
    const status = statusLabelFor(item);
    const mediumPhrase = readableList([...(item.medium || []), ...(item.discipline || [])].slice(0, 3), typeLabel.toLowerCase());
    const relationPhrase = relatedCount ? `${countLabel(relatedCount, "mapped relation")}` : "a compact context map";
    const galleryCount = item.media?.gallery?.length || 0;
    const dateLabel = item.temporality?.lastUpdated || item.temporality?.creationYear || item.date || "";
    const visualSupport = galleryCount
      ? `${countLabel(galleryCount, "visual asset")} ${galleryCount === 1 ? "supports" : "support"}`
      : "Narrative material supports";
    const assetDocumentation = galleryCount
      ? `${countLabel(galleryCount, "asset")} ${galleryCount === 1 ? "documents" : "document"}`
      : "The dossier documents";

    if (item.id === "vestiges") {
      return {
        title: "Read this as VASTE's flagship product.",
        intro: "Vestiges turns the VASTE runtime into a concrete platform for culture, craft and applied knowledge. Its core asset is the graph, not the profile, product or transaction.",
        why: "The platform is designed to preserve know-how while making it discoverable, collaborative and economically useful across generations.",
        inspect: ["The knowledge-first graph model", "The multi-actor contribution system", "The path from public knowledge pages to services and exchange"],
        proof: `${countLabel(item.graphNodeTypes?.length || 0, "node category", "node categories")}, ${countLabel(item.relationshipTypes?.length || 0, "relationship type")} and a VASTE-powered product architecture.`,
        next: "Follow the platform layers from knowledge graph to collaboration, visual exploration and economic activation.",
        cta: item.links?.[0] || { label: "Explore VASTE", href: "https://www.vaste.space/" },
      };
    }

    if (isOrethSignature(item)) {
      return {
        title: "Read this as an artistic dossier.",
        intro: `${item.title} connects release logic, image memory and archive structure. The page keeps the work legible as a cultural object first, then opens the world around it.`,
        why: "The important point is the translation: fragments become acts, references become a world, and the archive becomes part of the work rather than a footnote.",
        inspect: ["The opening frame for mood and authorship", "The act structure for narrative order", "The lineage around the work"],
        proof: `${visualSupport} the dossier, with ${relationPhrase} around it.`,
        next: "Move from the thesis into the visual plates, then follow the album back into the wider Electronic Artefacts world.",
        cta: item.kind === "project" ? { label: "Open Dossier", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` } : { label: "Open Archive", href: "./archive.html" },
      };
    }

    if (item.kind === "project" && item.category === "Client Work") {
      return {
        title: "Read this as proof of a live client system.",
        intro: `${item.title} shows how identity, content, interface and operational workflows are gathered into one public surface.`,
        why: "The useful evidence is not only the look of the site. It is the way visual direction, portfolio browsing, back-office structure and performance snapshots hold together.",
        inspect: ["The public promise", "The interface evidence", "The organisation of the work"],
        proof: `${assetDocumentation} the public surface, admin layer and performance signals.`,
        next: "Start with the visuals, then continue through scope, status and system placement.",
        cta: item.links?.[0] || { label: "Browse Projects", href: "./projects.html" },
      };
    }

    if (heroMode === "project") {
      return {
        title: "Read this as a project dossier.",
        intro: `${item.title} sits inside the studio as ${typeLabel.toLowerCase()}, shaped by ${mediumPhrase}.`,
        why: "The page explains what the project is, where it comes from and which surrounding systems make it meaningful.",
        inspect: ["The public angle", "The visual material", "The lineage and nearby work"],
        proof: `${status} status, ${galleryCount ? countLabel(galleryCount, "media item") : "visual material"} and ${relationPhrase}.`,
        next: "Open the extended dossier for the deeper reading, or move into the archive for adjacent fragments.",
        cta: { label: "Open Dossier", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` },
      };
    }

    if (heroMode === "program") {
      return {
        title: "Read this as an operating layer inside the ecosystem.",
        intro: `${item.title} explains a system role: ${item.domain || item.systemGroup || item.type || "program infrastructure"}.`,
        why: "Programs clarify how the studio thinks, builds and connects work behind the visible projects.",
        inspect: ["The program profile for scope", "The system shape for operating context", "The network for dependencies and influence"],
        proof: `${status} status${dateLabel ? `, updated ${dateLabel}` : ""}, with ${relationPhrase}.`,
        next: "Follow the connected works to move from program logic into projects, research fields and archives.",
        cta: item.links?.[0] || { label: "View Programs", href: "./programs.html" },
      };
    }

    if (heroMode === "archive") {
      return {
        title: "Read this as a fragment with context attached.",
        intro: `${item.title} is a trace inside the archive: ${item.summary || item.description || typeLabel}.`,
        why: "Archive entries are useful when they keep the fragment connected to projects, research fields and dates.",
        inspect: ["The field label for subject matter", "The date and status for placement", "Nearby entries for what to open next"],
        proof: `${item.date || dateLabel || status} placement, with ${relationPhrase}.`,
        next: "Follow the related entries when you want the larger project or research line around this fragment.",
        cta: { label: "Open Archive", href: "./archive.html" },
      };
    }

    return {
        title: "Read this as a knowledge piece with a clear path outward.",
        intro: `${item.title} frames ${mediumPhrase} inside the Electronic Artefacts world.`,
      why: "The page gives the piece a public explanation first, then keeps the surrounding context available.",
      inspect: ["The opening summary for meaning", "The signals for subject matter", "The relations for where it belongs"],
      proof: `${status} status, ${relationPhrase}${dateLabel ? ` and ${dateLabel} temporal placement` : ""}.`,
      next: "Use the related works and collections to move through the archive without losing context.",
      cta: item.links?.[0] || { label: "Explore Research", href: "./research.html" },
    };
  };

  const detailEditorialPanel = (item, heroMode, relatedCount, actions = []) => {
    const copy = detailEditorialCopy(item, heroMode, relatedCount);
    const signals = signalValuesFor(item, 5);
    const normalizeAction = (action) =>
      action
        ? {
            ...action,
            target: action.target || (String(action.href || "").startsWith("http") ? "_blank" : undefined),
          }
        : null;
    const primary = normalizeAction(copy.cta || actions[0] || item.links?.[0] || null);
    const secondary = normalizeAction(actions.find((action) => primary && action.href !== primary.href) || null);
    return `
      <section class="detail-grid detail-editorial-grid" aria-label="${esc(item.title)} reading guide">
        <article class="panel detail-editorial-card detail-editorial-card--lead">
          <div class="section-head">
          <p class="card__meta">Reading guide</p>
            <h2 class="card__title">${esc(copy.title)}</h2>
            <p class="lede">${esc(copy.intro)}</p>
          </div>
          ${signals.length ? tagRow(signals, { limit: 5, compact: true }) : ""}
        </article>
        <article class="panel detail-editorial-card">
          <p class="card__meta">Why it matters</p>
          <p class="card__copy">${esc(copy.why)}</p>
        </article>
        <article class="panel detail-editorial-card">
          <p class="card__meta">What to inspect</p>
          <ul class="detail-editorial-list">
            ${copy.inspect.map((itemCopy) => `<li>${esc(itemCopy)}</li>`).join("")}
          </ul>
        </article>
        <article class="panel detail-editorial-card detail-editorial-card--wide">
          <p class="card__meta">Evidence</p>
          <p class="card__copy">${esc(copy.proof)}</p>
          ${primary ? linkRow(primary, secondary ? [secondary] : []) : ""}
        </article>
        <article class="panel detail-editorial-card">
          <p class="card__meta">Continue</p>
          <p class="card__copy">${esc(copy.next)}</p>
        </article>
      </section>
    `;
  };

  const referenceDossierPanel = (item) => {
    const relationCount = relationEntriesFor(item).length;
    const galleryCount = item.media?.gallery?.length || 0;
    const signalCount = signalValuesFor(item, 12).length;
    return `
      <section class="panel knowledge-panel knowledge-panel--intro">
        <div class="section-head">
          <p class="card__meta">Dossier notes</p>
          <h2 class="card__title">A compact frame around the work.</h2>
          <p class="lede">Classification, dates and relationships stay visible so the piece can be read in context.</p>
        </div>
        <div class="detail-reference-strip">
          <span><strong>${esc(statusLabelFor(item))}</strong><em>Status</em></span>
          <span><strong>${esc(countLabel(relationCount, "link"))}</strong><em>Relations</em></span>
          <span><strong>${esc(countLabel(galleryCount, "asset"))}</strong><em>Media</em></span>
          <span><strong>${esc(countLabel(signalCount, "signal"))}</strong><em>Signals</em></span>
        </div>
      </section>
    `;
  };

  const metadataPanel = (item) =>
    panelShell(
      "Identity",
      "Core facts, dates and classification for this work.",
      metadataList([
        { label: "Title", value: item.title },
        { label: "Role", value: item.subtitle || item.type },
        { label: "Status", value: statusLabelFor(item) },
        { label: "Maturity", value: taxonomyLabel("maturity", item.maturity) },
        { label: "Confidence", value: taxonomyLabel("confidence", item.confidence) },
        { label: "Visibility", value: taxonomyLabel("visibility", item.visibility) },
        { label: "Domain", value: item.domain },
        { label: "System group", value: item.systemGroup },
        { label: "Created", value: item.temporality?.creationYear },
        { label: "Release date", value: item.temporality?.releaseDate },
        { label: "Era", value: item.temporality?.era },
      ]),
    );

  const tagsPanel = (item) =>
    panelShell(
      "Themes",
      "Subjects, mediums and disciplines that shape this work.",
      tagRow([...(item.tags || []), ...(item.medium || []), ...(item.discipline || []), item.category, item.type].filter(Boolean)),
    );

  const relationsPanel = (item) => {
    const relations = item.relations || {};
    const sections = [
      ["Source", relations.origin],
      ["Parent context", relations.parent],
      ["Contains", relations.children],
      ["Built on", relations.dependencies],
      ["Influenced by", relations.influences],
      ["Derived from", relations.derivedFrom],
      ["Inspired by", relations.inspiredBy],
      ["Powered by", relations.poweredBy],
      ["Produced by", relations.producedBy],
      ["Published by", relations.publishedBy],
      ["Maintained by", relations.maintainedBy],
      ["Part of", relations.partOf],
      ["Nearby", relations.relatedTo],
    ].filter(([, values]) => values && values.length);

    if (!sections.length) return "";

    return panelShell(
      "Lineage",
      "Where this work comes from, what supports it and what sits nearby.",
      `<div class="stack">
        ${sections
          .map(
            ([label, values]) => `
              <div class="panel panel--soft">
                <p class="card__meta">${esc(label)}</p>
                <div class="link-row">
                  ${resolveIds(values)
                    .map((entry) => `<a class="tag" href="${esc(entryHref(entry))}">${esc(entry.title)}</a>`)
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
      "Built on",
      "Source systems that explain the foundation of the work.",
      `<div class="link-row">${deps.map((entry) => `<a class="tag" href="${esc(entryHref(entry))}">${esc(entry.title)}</a>`).join("")}</div>`,
    );
  };

  const timelinePanel = (item) => {
    const timeline = timelineFor(item.id);
    if (!timeline || !timeline.entries?.length) return "";
    return panelShell(
      "Timeline",
      "Milestones that place the work in time.",
      `<div class="stack">
        ${timeline.entries
          .map(
            (entry) => `
              <article class="panel panel--soft">
                <p class="card__meta">${esc(entry.year)} · ${esc(publicEventLabel(entry.type))}</p>
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
      "Recent activity",
      "Visible changes, notes or publication signals connected to this work.",
      `<div class="stack">
        ${rows
          .map(
            (entry) => `
              <article class="panel panel--soft">
                <p class="card__meta">${esc(entry.date)} · ${esc(publicEventLabel(entry.type))}</p>
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
      "Research thread",
      "Questions, fields and programs behind the visible surface.",
      `<div class="link-row">${resolveIds(fields).map((entry) => `<a class="tag" href="${esc(entryHref(entry))}">${esc(entry.title)}</a>`).join("")}</div>`,
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
      "Continue reading",
      "Adjacent works and contexts to open next.",
      `<div class="card-grid card-grid--two">
        ${entries
          .map(
            (entry) => `
              <article class="panel panel--soft">
                <p class="card__meta">${esc(catalog.taxonomies?.entityTypes?.[entry.kind] || entry.kind)}</p>
                <h3 class="card__title">${esc(entry.title)}</h3>
                <p class="card__copy">${esc(entry.summary || entry.description || "")}</p>
                <div class="link-row">
                  <a class="tag" href="${esc(entryHref(entry))}">Open</a>
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
      "How the project is structured",
      architecture.note || "Public surface, visual material and content layers.",
      `
        <div class="project-architecture">
          <div class="project-architecture__hero">
            <p class="card__meta">Public form</p>
            <strong>${esc(item.category || item.type || "Project")}</strong>
          </div>
          <div class="project-architecture__grid">
            <article class="panel panel--soft">
              <p class="card__meta">Public surface</p>
              <h3 class="card__title">${esc(architecture.surface || item.type || "Project")}</h3>
              <p class="card__copy">${esc(architecture.surfaceCopy || item.description || item.summary || "")}</p>
            </article>
            <article class="panel panel--soft">
              <p class="card__meta">Image material</p>
              <h3 class="card__title">${esc(countLabel(item.media?.gallery?.length || 0, "piece"))}</h3>
              <p class="card__copy">Images and recordings are gathered with the work so the case study reads as one coherent dossier.</p>
            </article>
            <article class="panel panel--soft">
              <p class="card__meta">System frame</p>
              <h3 class="card__title">${esc(architecture.stack || item.program || "Electronic Artefacts")}</h3>
              <p class="card__copy">${esc(architecture.stackCopy || "The project carries its own visual material, narrative and references while staying connected to the wider studio structure.")}</p>
            </article>
            <article class="panel panel--soft">
              <p class="card__meta">Content layers</p>
              <h3 class="card__title">${esc((layers.length || 0).toString())}</h3>
              <p class="card__copy">${esc(architecture.layerCopy || "Each layer gives the visitor a different way to read the project: surface, system, archive or proof.")}</p>
            </article>
          </div>
          ${layers.length ? `<div class="tag-cluster">${layers.map((layer) => chip(layer)).join("")}</div>` : ""}
        </div>
      `,
    );
  };

  const projectGalleryPanel = (item) => {
    if (item.kind !== "project") return "";
    if (isOrethSignature(item)) return "";
    const gallery = item.media?.gallery || [];
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
      "Visual material",
      "Images, recordings and interface captures that carry the work beyond the summary.",
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
                  <p class="card__meta">Images</p>
                  <h3 class="card__title">Visual material attached to the work</h3>
                  <p class="card__copy">Images, recordings and interface captures are shown here when they are part of the public dossier.</p>
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
        "Opening frame",
        "The shortest way into the album before the track material.",
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
        "Release identity",
        "The identity of the release.",
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
        "Five-act structure",
        "The album is easier to read as a sequence of movements than as a flat track list.",
        `<div class="stack">
          ${acts.map(actCard).join("")}
        </div>`,
      ),
      panelShell(
        "Core thesis",
        "The conceptual sentence that holds the dossier together.",
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

  const vestigesDossierPanels = (item) => {
    if (item.id !== "vestiges") return "";
    const softPanel = (meta, title, copy, extra = "") => `
      <article class="panel panel--soft">
        <p class="card__meta">${esc(meta)}</p>
        <h3 class="card__title">${esc(title)}</h3>
        ${copy ? `<p class="card__copy">${esc(copy)}</p>` : ""}
        ${extra}
      </article>
    `;
    const chipList = (values, limit) =>
      values?.length
        ? `<div class="tag-cluster">${values.slice(0, limit || values.length).map((value) => chip(value)).join("")}</div>`
        : "";

    return [
      panelShell(
        "Product definition",
        "Vestiges is a premium technology platform and VASTE flagship, not a narrative universe, artistic project, wiki or simple marketplace.",
        `<div class="stack">
          ${softPanel("Position", "VASTE made concrete", item.productPosition || "")}
          ${softPanel("Mission", item.mission || "", "A global infrastructure for knowledge applied to human know-how.")}
          ${softPanel("Primary resource", item.coreResource || "Knowledge", "People, products and transactions remain important, but the graph of knowledge is the system's durable foundation.")}
        </div>`,
      ),
      panelShell(
        "The living knowledge graph",
        "Every entity has its own identity and every relationship remains explicit.",
        `<div class="stack">
          ${softPanel("Graph principle", "Everything becomes an addressable node", item.graphPrinciple || "")}
          <div class="card-grid card-grid--two">
            ${softPanel("Node families", `${item.graphNodeTypes?.length || 0} mapped families`, "People, organisations, techniques, materials, places, works and records can each become public knowledge pages.", chipList(item.graphNodeTypes, 12))}
            ${softPanel("Relationship vocabulary", `${item.relationshipTypes?.length || 0} explicit relations`, "Mastery, teaching, use, provenance, collaboration and certification create the paths through the graph.", chipList(item.relationshipTypes, 10))}
          </div>
        </div>`,
      ),
      panelShell(
        "Native public knowledge",
        "The graph produces an expanding network of indexable pages without treating SEO as a separate module.",
        `<div class="stack">
          ${softPanel("Infinite pages", "One canonical surface per node", item.seoModel || "")}
          ${chipList(["Public page", "Canonical URL", "Description", "Relations", "Media", "History", "Metadata"])}
        </div>`,
      ),
      panelShell(
        "Multi-actor contribution",
        "Expertise can enter the same governed graph from the workshop, school, museum, institution or field.",
        `<div class="stack">
          ${softPanel("Participants", `${item.stakeholders?.length || 0} initial actor groups`, "Vestiges connects professional, cultural, educational, institutional and private actors.", chipList(item.stakeholders))}
          ${softPanel("Collaboration", "Distributed knowledge with governance", "Contributions remain attributable, reviewable and enrich the same shared graph.", chipList(item.collaborationCapabilities))}
        </div>`,
      ),
      panelShell(
        "Explore knowledge spatially",
        "Relationships are designed to be seen as networks, maps and immersive constellations rather than only as lists.",
        `<div class="stack">
          ${softPanel("Visualisation", "From graph to navigable space", "A technique can reveal its materials, tools, practitioners, buildings, schools and museums in one connected view.", chipList(item.visualizationModes))}
        </div>`,
      ),
      panelShell(
        "Economic activation",
        "The marketplace is a consequence of trusted knowledge and explicit relationships, not the product's final horizon.",
        `<div class="stack">
          ${softPanel("Business model", "Services grow from the graph", "Professional tools, exchange, APIs and specialised intelligence can operate on top of the shared knowledge infrastructure.", chipList(item.economicModel))}
        </div>`,
      ),
      panelShell(
        "Long-term horizon",
        "Vestiges is conceived as infrastructure capable of growing for decades.",
        `<div class="stack">
          ${softPanel("Global scope", "A living map of human know-how", "Heritage, production, learning, research and innovation remain connected inside the same evolving system.", chipList(item.longTermDomains))}
        </div>`,
      ),
    ].join("");
  };

  const lyricsDossierPanel = (item) => {
    const lyricEntries = item.lyrics || [];
    if (!lyricEntries.length) return "";
    const lineMarkup = (entry, line, index) => {
      if (line.type === "space") return `<div class="lyrics-line lyrics-line--space" aria-hidden="true"></div>`;
      const lineId = `${entry.id}-line-${index + 1}`;
      return `
        <button
          class="lyrics-line${line.type ? ` lyrics-line--${esc(line.type)}` : ""}"
          type="button"
          data-lyric-line="${esc(lineId)}"
          data-track-id="${esc(entry.id)}"
          aria-pressed="false"
        >
          <span class="lyrics-line__number">${String(index + 1).padStart(2, "0")}</span>
          <span class="lyrics-line__text">${esc(line.text || "")}</span>
        </button>
      `;
    };
    const entryMarkup = (entry) => `
      <details class="lyrics-card" data-lyrics-card="${esc(entry.id)}">
        <summary class="lyrics-card__head">
          <div>
            <p class="card__meta">Lyrics / ${esc(entry.act || item.title)}</p>
            <h3 class="card__title">${esc(`${entry.trackNumber ? `${entry.trackNumber}. ` : ""}${entry.title || "Untitled"}`)}</h3>
            ${entry.subtitle ? `<p class="lede">${esc(entry.subtitle)}</p>` : ""}
          </div>
          <div class="lyrics-card__meta">
            ${entry.status ? chip(entry.status) : ""}
            ${entry.language ? chip(entry.language.toUpperCase()) : ""}
            <span class="tag">Open text</span>
          </div>
        </summary>
        <div class="lyrics-card__body">
          <div class="lyrics-sheet" aria-label="${esc(entry.title || "Lyrics")} lyrics">
            ${(entry.lines || []).map((line, index) => lineMarkup(entry, line, index)).join("")}
          </div>
          <aside class="lyrics-annotation" data-lyrics-annotation="${esc(entry.id)}">
            <p class="card__meta">Notes</p>
            <h4 class="card__title">Select a line</h4>
            <p class="card__copy">Click a phrase to isolate it. Notes, references and explanations can live here as the text grows.</p>
          </aside>
        </div>
        ${entry.note ? `<p class="card__copy lyrics-card__note">${esc(entry.note)}</p>` : ""}
      </details>
    `;

    return panelShell(
      "Texts / Lyrics",
      "A lyric surface for Palimpsests, built for close reading line by line.",
      `<div class="lyrics-stack">${lyricEntries.map(entryMarkup).join("")}</div>`,
    );
  };

  const clientCaseStudyPanel = (item) => {
    if (item.kind !== "project" || item.category !== "Client Work") return "";
    const galleryCount = item.media?.gallery?.length || 0;
    const architecture = item.architecture || {};
    const role = item.role || "Strategy, information structure, interface direction and implementation.";
    const delivered = [
      architecture.surface,
      ...(architecture.layers || []),
    ].filter(Boolean);

    return panelShell(
      "Engagement summary",
      "A concise view of the problem, role, delivered system and available evidence.",
      `
        <div class="case-study-summary">
          <article class="panel panel--soft">
            <p class="card__meta">Objective</p>
            <h3 class="card__title">${esc(item.theme || item.subtitle || item.type || "Client system")}</h3>
            <p class="card__copy">${esc(item.summary || item.description || "")}</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Electronic Artefacts role</p>
            <h3 class="card__title">Structure before surface.</h3>
            <p class="card__copy">${esc(role)}</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Delivered system</p>
            <h3 class="card__title">${esc(architecture.surface || "Public product and operating workflow")}</h3>
            ${delivered.length ? tagRow(delivered, { limit: 6, compact: true }) : ""}
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Evidence</p>
            <h3 class="card__title">${esc(countLabel(galleryCount, "documented asset"))}</h3>
            <p class="card__copy">Public screens, operational views and performance evidence are attached where available.</p>
          </article>
        </div>
      `,
    );
  };

  const unionMobDossierPanels = (item) => {
    if (item.id !== "unionmob") return "";

    const softPanel = (meta, title, copy, extra = "") => `
      <article class="panel panel--soft">
        <p class="card__meta">${esc(meta)}</p>
        <h3 class="card__title">${esc(title)}</h3>
        ${copy ? `<p class="card__copy">${esc(copy)}</p>` : ""}
        ${extra}
      </article>
    `;
    const listMarkup = (values) => `
      <ul class="detail-editorial-list">
        ${(values || []).map((value) => `<li>${esc(value)}</li>`).join("")}
      </ul>
    `;
    const sequenceMarkup = (values) => values?.length ? `<div class="tag-cluster">${values.map((value) => chip(value)).join("")}</div>` : "";

    const distinction = item.projectDistinction || {};
    const security = item.securityModel || {};
    const governance = item.governanceModel || {};
    const aiBroker = item.aiBroker || {};
    const umos = item.umosArchitecture || {};
    const traits = item.traits || {};

    return [
      panelShell(
        "Overview",
        "UnionMob is presented as a client project and organisational system, not as a generic platform card.",
        `<div class="stack">
          ${softPanel("Client", item.client || "Client project", item.role || "")}
          ${softPanel("Core definition", item.title, item.description || item.summary || "", tagRow(item.subThemes || [], { compact: true }))}
          ${softPanel("Separation", "UnionMob and UMOS", distinction.relationship || "", metadataList([
            { label: "UnionMob", value: distinction.unionMob },
            { label: "UMOS", value: distinction.umos },
          ]))}
        </div>`,
      ),
      panelShell(
        "Vision",
        "The project was treated as systems research, organisational design and experimental infrastructure.",
        `<div class="stack">
          ${softPanel("Research question", item.centralQuestion || "Organisational operating system", item.coreIdea || "")}
          ${sequenceMarkup(item.primitives || [])}
        </div>`,
      ),
      panelShell(
        "The Signal",
        "The lifecycle begins before a user exists and treats security as part of the organism.",
        `<div class="stack">
          ${softPanel("Lifecycle", "Signal to governance evolution", "", sequenceMarkup(item.lifecycle || []))}
          ${softPanel("Before the user", "Gateway, Vault and Risk Engine", security.note || "", sequenceMarkup(security.beforeUser || []))}
        </div>`,
      ),
      panelShell(
        "Facets",
        "UnionMob does not rely on fixed roles. It uses cumulative facets that assign capabilities.",
        `<div class="stack">
          <div class="card-grid card-grid--two">
            ${(item.facets || [])
              .map((facet) => softPanel("Facet", facet.name || "", facet.capability || ""))
              .join("")}
          </div>
          ${softPanel("Controls", "What facets govern", "", sequenceMarkup(item.facetControls || []))}
        </div>`,
      ),
      panelShell(
        "Traits",
        "Traits describe professions; facets describe capability.",
        `<div class="stack">
          ${softPanel("Distinction", "Identity and capability stay separate", traits.distinction || "")}
          ${sequenceMarkup(traits.examples || [])}
        </div>`,
      ),
      panelShell(
        "Unions",
        "Unions are programmable organisational contexts, not user roles.",
        `<div class="stack">
          ${softPanel("Definition", "Creative cells inside the ecosystem", item.unionDefinition || "")}
          ${sequenceMarkup(item.unions || [])}
        </div>`,
      ),
      panelShell(
        "Governance",
        "Authority is contextual, traceable, reversible and auditable.",
        `<div class="stack">
          ${softPanel("Authority model", "Power is never absolute", governance.note || "", sequenceMarkup(governance.properties || []))}
          ${softPanel("Explored mechanisms", "Delegation, ABAC and distributed authority", "", sequenceMarkup(governance.explored || []))}
        </div>`,
      ),
      panelShell(
        "AI Broker",
        "AI capabilities are mediated by governance rather than direct database access.",
        `<div class="stack">
          ${softPanel("Access flow", "User to governed response", aiBroker.note || "", sequenceMarkup(aiBroker.flow || []))}
          ${softPanel("Constraints", "The AI can never see more than the user it assists", "", sequenceMarkup(aiBroker.constraints || []))}
        </div>`,
      ),
      panelShell(
        "UMOS Architecture",
        "UMOS is the technical operating system powering the creative organisation.",
        `<div class="stack">
          ${softPanel("Architecture", "Research-grade operating system", umos.description || umos.note || "")}
          ${softPanel("Principles", "Event-driven, zero-trust, distributed, modular and governance-first", "", sequenceMarkup(umos.principles || []))}
          ${softPanel("Layers", "Service architecture", umos.note || "", sequenceMarkup(umos.layers || []))}
        </div>`,
      ),
      panelShell(
        "Research Outcomes",
        "What the project contributed to the Electronic Artefacts research line.",
        listMarkup(item.researchOutcomes || []),
      ),
      panelShell(
        "Lessons Learned",
        "The project is best understood as an operating system for living organisations.",
        listMarkup(item.lessonsLearned || []),
      ),
      panelShell(
        "Technical Stack",
        "The implementation study was framed around modular services and evented projections.",
        `<div class="stack">
          ${sequenceMarkup(umos.stack || [])}
          ${softPanel("Architecture note", "Services remain separated at runtime", umos.note || "")}
        </div>`,
      ),
      panelShell(
        "Current State",
        "The public context of the project and the paths around it.",
        `<div class="stack">
          ${metadataList([
            { label: "Status", value: item.statusLabel || statusLabelFor(item) },
            { label: "Client", value: item.client },
            { label: "Role", value: item.role },
            { label: "Maturity", value: taxonomyLabel("maturity", item.maturity) },
            { label: "Visibility", value: taxonomyLabel("visibility", item.visibility) },
            { label: "Last updated", value: item.temporality?.lastUpdated },
          ])}
          <div class="link-row">
            ${(item.crossLinks || [])
              .map((link) => `<a class="tag" href="${esc(link.href)}">${esc(link.label)}</a>`)
              .join("")}
          </div>
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
      "Collection shelf",
      "Curated groups where this work also appears.",
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
      "Included works",
      "The works collected inside this shelf.",
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
    referenceDossierPanel(item),
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
    return [projectGalleryPanel(item), projectArchitecturePanel(item)].filter(Boolean).join("");
  };

  const projectSpecificPanels = (item) => {
    if (item.kind !== "project") return "";
    return [clientCaseStudyPanel(item), vestigesDossierPanels(item), palimpsestsDossierPanels(item), lyricsDossierPanel(item), unionMobDossierPanels(item)].filter(Boolean).join("");
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
            <p class="card__meta">What this program does</p>
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
          <p class="card__meta">Operating shape</p>
          <p class="card__copy">${esc(item.domain || item.systemGroup || item.type || "Program system")}</p>
          ${metadataList([
            { label: "Domain", value: item.domain },
            { label: "System group", value: item.systemGroup },
            { label: "Creation year", value: item.temporality?.creationYear },
            { label: "Release date", value: item.temporality?.releaseDate || "No public date" },
            { label: "Last updated", value: item.temporality?.lastUpdated },
            { label: "Era", value: item.temporality?.era },
          ])}
        </article>
        <article class="panel program-detail-panel">
          <p class="card__meta">Reading signals</p>
          <p class="card__copy">Mediums, disciplines and tags explain how to compare this program with nearby systems.</p>
          ${tagRow([...(item.tags || []), ...(item.medium || []), ...(item.discipline || [])].filter(Boolean), { compact: true })}
        </article>
        <article class="panel program-detail-panel">
          <p class="card__meta">Nearby systems</p>
          <p class="card__copy">Works connected through origin, lineage, dependency or influence.</p>
          <div class="link-row">
            ${resolveIds(networkItems)
              .slice(0, 8)
              .map((entry) => `<a class="tag" href="${esc(entryHref(entry))}">${esc(entry.title)}</a>`)
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
    const item = id ? entityById(id) : null;
    const kind = document.body.dataset.detailKind || document.body.dataset.page || "entity";
    if (!item) {
      return `
        <section class="zone-card hero">
          <div class="section-head">
            <p class="eyebrow">${esc(kind.toUpperCase())}</p>
            <h1 class="display-title">Work not found.</h1>
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
    const uniqueActions = (actions) => {
      const seen = new Set();
      return actions.filter((action) => {
        if (!action) return false;
        const key = `${action.label || ""}::${action.href || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    const signatureActions = (() => {
      const actions = [...primaryLinks.slice(0, 1)];
      if (item.kind === "project") {
        actions.push({ label: "Open Dossier", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` });
        actions.push({ label: "Archive", href: "./archive.html" });
      } else if (item.kind === "artist") {
        actions.push({ label: "Work", href: "./work.html" });
        actions.push({ label: "About", href: "./about.html" });
      } else if (item.project === "palimpsests") {
        actions.push({ label: "Palimpsests", href: "./palimpsests.html" });
        actions.push({ label: "Archive", href: "./archive.html" });
      }
      return uniqueActions(actions).slice(0, 3);
    })();
    const heroActions = [
      ...primaryLinks.slice(0, 1),
      ...(item.kind === "project" ? [{ label: "Open Dossier", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` }] : []),
    ];
    const detailIntro = item.kind === "program" ? programSpecificPanels(item) : "";
    const specificPanels =
      item.id === "palimpsests"
        ? projectSpecificPanels(item)
        : clientCaseStudyPanel(item);
    const visualPanels = projectPanels(item);
    const signatureCopy = item.description || item.summary || "";
    const signatureTags = (item.tags && item.tags.length ? item.tags : homeCardPills(item)).filter(Boolean);
    const detailHeroMedia = item.media?.gallery?.length || item.kind === "project" ? projectHeroMedia(item) : "";

    if (isOrethSignature(item)) {
      return `
        <section class="zone-card hero signature-hero">
          ${signatureBanner(item, {
            variant: "oreth",
            titleTag: "h1",
            eyebrow: item.kind === "artist" ? "ORETH" : "PALIMPSESTS / ORETH",
            copy: signatureCopy,
            tags: signatureTags,
            actions: signatureActions,
          })}
        </section>
        ${detailEditorialPanel(item, heroMode, relatedCount, signatureActions)}
        ${detailIntro}
        ${specificPanels ? `<section class="detail-grid">${specificPanels}</section>` : ""}
        ${visualPanels ? `<section class="detail-grid project-visual-section">${visualPanels}</section>` : ""}
        <section class="detail-grid">
          ${knowledgePanels(item)}
        </section>
      `;
    }

    return `
      <section class="zone-card hero detail-hero${detailHeroMedia ? " detail-hero--with-media" : ""}" data-entry-id="${esc(item.id || "")}">
        <div class="section-head detail-hero__content">
          <p class="eyebrow">${esc(catalog.taxonomies?.entityTypes?.[item.kind] || item.kind || kind.toUpperCase())}</p>
          <h1 class="display-title">${esc(item.title)}</h1>
          <p class="lede">${esc(signatureCopy)}</p>
          ${projectSignatureBubble(item, "hero")}
          <div class="button-row button-row--compact">
            ${heroActions.map((link, index) => `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}" href="${esc(link.href)}"${link.target ? ' target="_blank" rel="noreferrer"' : ""}>${esc(link.label)}</a>`).join("")}
          </div>
          ${summaryMetrics(item, heroMode)}
        </div>
        ${
          detailHeroMedia
            ? `
              <figure class="detail-hero__visual">
                ${detailHeroMedia}
                <figcaption>
                  <span>${esc(item.statusLabel || item.status || item.kind || "Piece")}</span>
                  <strong>${esc(item.category || item.type || item.domain || "Electronic Artefacts")}</strong>
                </figcaption>
              </figure>
            `
            : ""
        }
      </section>
      ${detailEditorialPanel(item, heroMode, relatedCount, heroActions)}
      ${detailIntro}
      ${specificPanels ? `<section class="detail-grid">${specificPanels}</section>` : ""}
      ${visualPanels ? `<section class="detail-grid project-visual-section">${visualPanels}</section>` : ""}
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
                const entity = entry.entityId ? entityById(entry.entityId) : null;
                const href = entity ? entryHref(entity) : "";
                return `
                <article class="panel panel--soft card-link-surface" ${cardLinkAttrs(href, `Open ${entry.title}`)}>
                  ${cardOverlayLink(href, `Open ${entry.title}`)}
                  <p class="card__meta">${esc(entry.date)} · ${esc(publicEventLabel(entry.type))}</p>
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

  const initialSearchParams = new URLSearchParams(window.location.search);
  const searchState = {
    query: String(initialSearchParams.get("q") || "").trim().toLowerCase(),
    status: initialSearchParams.get("status") || "all",
    kind: initialSearchParams.get("kind") || "all",
    page: 1,
    pageSize: 12,
  };
  const getSearchIndex = () => catalog.indexes?.getSearchIndex?.() || catalog.indexes?.search || [];
  const searchResultOrder = ["program", "project", "artefact", "researchLog", "researchField", "collection", "artist", "channel", "worldbuilding"];

  const filteredSearchItems = () => {
    const searchIndex = getSearchIndex();
    const query = searchState.query;
    const status = searchState.status;
    const kind = searchState.kind;
    const hasActiveSearch = Boolean(query) || status !== "all" || kind !== "all";
    if (!hasActiveSearch) return [];
    return searchIndex.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (kind !== "all" && item.kind !== kind) return false;
      if (!query) return true;
      return item.value.includes(query);
    });
  };

  const sortOverviewItems = (items) =>
    [...items].sort((left, right) => {
      const leftIndex = searchResultOrder.indexOf(left.kind);
      const rightIndex = searchResultOrder.indexOf(right.kind);
      if (leftIndex !== rightIndex) return (leftIndex === -1 ? searchResultOrder.length : leftIndex) - (rightIndex === -1 ? searchResultOrder.length : rightIndex);
      return String(left.title || "").localeCompare(String(right.title || ""));
    });

  const collectOverviewBlocks = (item) => {
    const blocks = [];
    const seen = new Set();

    const push = (label, value) => {
      const text = String(value ?? "").trim();
      if (!text) return;
      const key = `${label}::${text}`;
      if (seen.has(key)) return;
      seen.add(key);
      blocks.push([label, text]);
    };

    const pushList = (label, values, transform = (value) => value) => {
      const items = (values || []).map((value) => String(transform(value) ?? "").trim()).filter(Boolean);
      if (!items.length) return;
      push(label, items.join("\n"));
    };

    push("Summary", item.summary);
    push("Description", item.description);
    push("Copy", item.copy);
    push("Theme", item.theme);
    push("Core idea", item.coreIdea);
    push("Note", item.note || item.architecture?.note);
    push("Origin of title", item.originOfTitle);
    push("Question", item.centralQuestion);
    push("Vision", item.longTermVision);
    push("Client", item.client);
    push("Role", item.role);
    pushList("Secondary questions", item.secondaryQuestions);
    pushList("Interpretations", item.narrativeInterpretations);
    pushList("Subthemes", item.subThemes);
    (item.lyrics || []).forEach((entry, index) => {
      if (!entry || typeof entry !== "object") return;
      push(`Lyrics ${String(index + 1).padStart(2, "0")}`, [entry.trackNumber, entry.title, entry.subtitle, entry.act, entry.note].filter(Boolean).join("\n"));
      pushList(
        `Lyrics lines ${String(index + 1).padStart(2, "0")}`,
        (entry.lines || []).filter((line) => line?.text).map((line) => line.text),
      );
    });
    pushList("Lifecycle", item.lifecycle);
    pushList("Primitives", item.primitives);
    push("Mission", item.mission);
    push("Primary resource", item.coreResource);
    push("Product position", item.productPosition);
    push("Graph principle", item.graphPrinciple);
    push("SEO model", item.seoModel);
    pushList("Graph node types", item.graphNodeTypes);
    pushList("Relationship types", item.relationshipTypes);
    pushList("Stakeholders", item.stakeholders);
    pushList("Collaboration capabilities", item.collaborationCapabilities);
    pushList("Visualization modes", item.visualizationModes);
    pushList("Economic model", item.economicModel);
    pushList("Long-term domains", item.longTermDomains);
    pushList("Facet controls", item.facetControls);
    pushList("Unions", item.unions);
    pushList("Research outcomes", item.researchOutcomes);
    pushList("Lessons learned", item.lessonsLearned);
    push("Body", item.body);

    const distinction = item.projectDistinction || {};
    push("UnionMob", distinction.unionMob);
    push("UMOS", distinction.umos);
    push("Relationship", distinction.relationship);

    const security = item.securityModel || {};
    pushList("Security model", security.beforeUser);
    push("Security note", security.note);

    (item.facets || []).forEach((facet, index) => {
      if (!facet || typeof facet !== "object") return;
      push(`Facet ${String(index + 1).padStart(2, "0")}`, [facet.name, facet.capability].filter(Boolean).join(" - "));
    });

    const traits = item.traits || {};
    push("Trait distinction", traits.distinction);
    pushList("Trait examples", traits.examples);

    const governance = item.governanceModel || {};
    pushList("Governance properties", governance.properties);
    pushList("Governance mechanisms", governance.explored);
    push("Governance note", governance.note);

    const aiBroker = item.aiBroker || {};
    pushList("AI broker flow", aiBroker.flow);
    pushList("AI broker constraints", aiBroker.constraints);
    push("AI broker note", aiBroker.note);

    const umosArchitecture = item.umosArchitecture || {};
    push("UMOS architecture", umosArchitecture.description);
    pushList("UMOS principles", umosArchitecture.principles);
    pushList("UMOS stack", umosArchitecture.stack);
    pushList("UMOS layers", umosArchitecture.layers);
    push("UMOS note", umosArchitecture.note);

    const architecture = item.architecture || {};
    push("Surface", architecture.surface);
    push("Stack", architecture.stack);
    pushList("Layers", architecture.layers);
    push("Architecture note", architecture.note);

    const orethStructure = item.orethStructure || {};
    push("Structure note", orethStructure.note);
    pushList("Current material", orethStructure.currentMaterial);
    pushList("Cycles", orethStructure.cycles, (cycle) => {
      if (!cycle || typeof cycle !== "object") return "";
      return [cycle.letter, cycle.title].filter(Boolean).join(" - ");
    });

    (item.acts || []).forEach((act, index) => {
      if (!act || typeof act !== "object") return;
      const lines = [act.title, act.subtitle, act.mood, act.description];
      if (act.tracks?.length) lines.push(`Tracks: ${act.tracks.join(" / ")}`);
      if (act.keywords?.length) lines.push(`Keywords: ${act.keywords.join(" / ")}`);
      push(`Act ${String(index + 1).padStart(2, "0")}`, lines.filter(Boolean).join("\n"));
    });

    return blocks;
  };

  const collectOverviewTags = (item) => {
    const sources = [
      item.tags,
      item.medium,
      item.discipline,
      item.currentDomains,
      item.futureDomains,
      item.corePrinciples,
      item.subThemes,
      item.symbols,
      item.textures,
      item.musicalLanguage,
      item.visualLanguage,
    ];
    return [...new Set(sources.flat().filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
  };

  const overviewStats = () => {
    const allItems = sortOverviewItems(filteredSearchItems()).map((item) => entityById(item.id) || item).filter(Boolean);
    const items = allItems.slice(0, searchState.page * searchState.pageSize);
    const tagCount = items.reduce((total, item) => total + collectOverviewTags(item).length, 0);
    const blockCount = items.reduce((total, item) => total + collectOverviewBlocks(item).length, 0);
    const totalCount = catalog.indexes?.entities?.length || items.length || 1;
    return { items, tagCount, blockCount, totalCount, matchCount: allItems.length };
  };

  const searchOverviewMarkup = () => {
    const hasActiveSearch = Boolean(searchState.query) || searchState.status !== "all" || searchState.kind !== "all";
    if (!hasActiveSearch) {
      return `
        <section class="zone-card hero catalog-overview catalog-overview--idle">
          <div class="section-head">
            <p class="eyebrow">SEARCH READY</p>
            <h2>Enter a subject, project or program.</h2>
            <p class="lede">Results appear after you type or select a filter. This keeps the full archive out of the initial page.</p>
          </div>
        </section>
      `;
    }

    const { items, tagCount, blockCount, totalCount, matchCount } = overviewStats();
    if (!items.length) {
      return `
        <section class="zone-card hero catalog-overview">
          <div class="section-head">
            <p class="eyebrow">CATALOG MATRIX</p>
            <h2>Nothing matched.</h2>
            <p class="lede">Try a broader query or clear the filters.</p>
          </div>
        </section>
      `;
    }

    return `
      <section class="zone-card hero catalog-overview">
        <div class="section-head">
          <p class="eyebrow">CATALOG MATRIX</p>
          <h2>${esc(matchCount)} ${matchCount === 1 ? "result" : "results"}</h2>
          <p class="lede">Showing ${esc(items.length)} concise entries. Open an item for the complete record.</p>
        </div>
        ${metricRail(
          [
            { label: "MATCHES", value: String(matchCount), note: "public records", fill: metricFill(matchCount, totalCount), tone: "live" },
            { label: "SHOWN", value: String(items.length), note: "current page", fill: metricFill(items.length, Math.max(matchCount, 1)), tone: "visual" },
            { label: "TAGS", value: String(tagCount), note: "visible labels", fill: metricFill(tagCount, Math.max(tagCount, 1) * 2), tone: "archive" },
          ],
          { limit: 3, compact: true },
        )}
        <div class="catalog-table-shell" role="region" aria-label="Archive overview table" tabindex="0">
          <table class="catalog-table">
            <thead>
              <tr>
                <th scope="col">Type / ID</th>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
                <th scope="col">Tags</th>
                <th scope="col">Meta</th>
                <th scope="col">Open</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map((item) => {
                  const titleHref = entryHref(item);
                  const contentBlocks = collectOverviewBlocks(item).slice(0, 2);
                  const tags = collectOverviewTags(item).slice(0, 6);
                  const typeLabel = esc(catalog.taxonomies?.entityTypes?.[item.kind] || item.kind || "Piece");
                  const year = item.temporality?.creationYear || item.temporality?.releaseDate || String(item.temporality?.lastUpdated || "").slice(0, 4) || "Undated";
                  const visibilityLabel = catalog.taxonomies?.visibility?.[item.visibility]?.label || item.visibility || "Not specified";
                  return `
                    <tr data-entry-id="${esc(item.id || "")}">
                      <td class="catalog-table__identity">
                        <span class="catalog-table__kind">${typeLabel}</span>
                        <span class="catalog-table__id">${esc(item.id || "")}</span>
                      </td>
                      <td class="catalog-table__title-cell">
                        <div class="catalog-table__title">
                          <a href="${esc(titleHref)}">${esc(item.title || item.id || "Untitled")}</a>
                          ${item.subtitle ? `<span class="catalog-table__subtitle">${esc(item.subtitle)}</span>` : ""}
                        </div>
                      </td>
                      <td class="catalog-table__content-cell">
                        <div class="catalog-table__content">
                          ${contentBlocks
                            .map(
                              ([label, value]) => `
                                <div class="catalog-table__content-item">
                                  <span>${esc(label)}</span>
                                  <p>${esc(value)}</p>
                                </div>
                              `,
                            )
                            .join("")}
                        </div>
                      </td>
                      <td class="catalog-table__tags-cell">
                        <div class="catalog-tags">
                          ${tags.length ? tags.map((value) => chip(value)).join("") : `<span class="catalog-table__empty">Unlisted</span>`}
                        </div>
                      </td>
                      <td class="catalog-table__meta-cell">
                        <div class="catalog-table__meta">
                          ${statusBadge(item.status, item.statusLabel)}
                          <span class="catalog-table__meta-line">${esc(visibilityLabel)}</span>
                          <span class="catalog-table__meta-line">${esc(year)}</span>
                          <span class="catalog-table__meta-line">${esc(item.kind || "piece")}</span>
                        </div>
                      </td>
                      <td class="catalog-table__open-cell">
                        ${titleHref ? `<a class="tag catalog-table__open" href="${esc(titleHref)}">Open</a>` : `<span class="catalog-table__empty">Unavailable</span>`}
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
        ${
          items.length < matchCount
            ? `<div class="catalog-overview__more">
                <button class="button button--secondary" type="button" data-search-more>
                  Show ${esc(Math.min(searchState.pageSize, matchCount - items.length))} more
                </button>
              </div>`
            : ""
        }
      </section>
    `;
  };

  const renderSearchPage = () => `
      <section class="zone-card hero" data-search-shell>
        <div class="section-head">
          <p class="eyebrow">KNOWLEDGE SEARCH</p>
          <h1 class="display-title">Find the work behind the words.</h1>
          <p class="lede">Search across projects, programs, people, research fields, artefacts and collections. Results retain their type, status and relations so a match always has context.</p>
        </div>
        <div class="stat-grid search-guide">
          <article class="stat-card">
            <p class="card__meta">Search by subject</p>
            <strong>Knowledge, memory, governance</strong>
            <span>Use concepts when you want to move across several projects and entity types.</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Search by name</p>
            <strong>Vestiges, VASTE, Palimpsests</strong>
            <span>Use a project or program name when you already know the entry point.</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Narrow the field</p>
            <strong>Status and entity type</strong>
            <span>Filters distinguish active systems, archived work, research and public projects.</span>
          </article>
        </div>
        <div class="taxonomy-grid">
          <div class="taxonomy-column">
            <label class="card__meta" for="knowledge-search-input">Query</label>
            <input id="knowledge-search-input" class="search-input" type="search" data-search-input placeholder="Search title, text or tags..." autocomplete="off" />
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
        ${searchOverviewMarkup()}
      </section>
    `;
  const renderSearchResults = () => {
    const target = document.querySelector("[data-search-results]");
    if (!target) return;
    target.innerHTML = searchOverviewMarkup();
  };

  const renderCrossNavigation = () => crossNavigation();

  const renderFeaturedWork = () => featuredWork();
  const renderVasteBanner = () => vasteBanner();
  const renderFeaturedResearch = () => featuredResearch();
  const renderLatest = () => latestArtefacts();
  const orientationSection = ({ eyebrow, title, copy, cards }) => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h2>${esc(title)}</h2>
        <p class="lede">${esc(copy)}</p>
      </div>
      <div class="card-grid card-grid--two">
        ${cards.map((card) => routeCard(card)).join("")}
      </div>
    </section>
  `;

  const renderHomeOrientation = () =>
    orientationSection({
      eyebrow: "ORIENTATION",
      title: "Explore Electronic Artefacts",
      copy: "Choose the layer that fits your intent. Projects, research, programs and archive are different entrances into the same ecosystem.",
      cards: [
        {
          kicker: "Projects",
          title: "Public works and collaborations",
          copy: "See the public-facing works, commissioned surfaces and translated outputs that make the ecosystem visible.",
          reason: "This is the fastest way to understand what the studio actually produces.",
          cta: "Browse Projects",
          href: "./projects.html",
          ariaLabel: "Browse Projects",
        },
        {
          kicker: "Research",
          title: "Experimental investigations",
          copy: "Follow the notes, theoretical branches and working questions that feed the rest of the system.",
          reason: "This is where the thinking behind the work becomes legible.",
          cta: "Enter Research",
          href: "./research.html",
          ariaLabel: "Enter Research",
        },
        {
          kicker: "Programs",
          title: "Software systems and engines",
          copy: "Inspect the runtime logic, internal frameworks and production systems that hold the ecosystem together.",
          reason: "This is the operational core of the project.",
          cta: "View Programs",
          href: "./programs.html",
          ariaLabel: "View Programs",
        },
        {
          kicker: "Archive",
          title: "Traces and historical material",
          copy: "Move through releases, fragments and older surfaces that document how the ecosystem accumulated over time.",
          reason: "This is the memory layer, not a graveyard.",
          cta: "Open Archive",
          href: "./archive.html",
          ariaLabel: "Open Archive",
        },
      ],
    });

  const renderFeaturedPaths = () =>
    orientationSection({
      eyebrow: "FEATURED PATHS",
      title: "Start from your real question.",
      copy: "The ecosystem is easier to understand when you begin with intent: evaluate the technology, inspect delivered work, understand the operating model or enter through culture.",
      cards: [
        {
          kicker: "Technology",
          title: "Understand the core runtime",
          copy: "Open VASTE to inspect the strategic and technical foundation behind the wider family of systems.",
          reason: "Best when architecture, scalability and the long-term platform thesis matter first.",
          cta: "Explore VASTE",
          href: "./vaste.html",
          ariaLabel: "Explore VASTE",
        },
        {
          kicker: "Delivery",
          title: "Inspect applied work and outcomes",
          copy: "See how strategy, interface, content and implementation hold together across commissions and public products.",
          reason: "Best when you need evidence of execution under concrete constraints.",
          cta: "See Client Work",
          href: "./work.html",
          ariaLabel: "See Client Work",
        },
        {
          kicker: "Culture",
          title: "Enter through Palimpsests",
          copy: "Explore the musical and editorial surface where artistic production, memory and publication meet.",
          reason: "Best when you want the cultural register before the technical system.",
          cta: "Enter Palimpsests",
          href: "./palimpsests.html",
          ariaLabel: "Enter Palimpsests",
        },
      ],
    });

  const renderWorkOffer = () => `
    <section class="zone-card hero work-offer">
      <div class="section-head">
        <p class="eyebrow">ENGAGEMENTS</p>
        <h2>Three ways to work together.</h2>
        <p class="lede">The format follows the problem. Each engagement produces explicit decisions, working artefacts and a clear next phase.</p>
      </div>
      <div class="card-grid card-grid--three">
        ${[
          {
            meta: "Direction",
            title: "Product and system framing",
            copy: "Clarify the proposition, users, information model, constraints and technical direction before committing to a large build.",
            outputs: ["Brief", "Architecture", "Roadmap"],
          },
          {
            meta: "Delivery",
            title: "Design and implementation",
            copy: "Turn an existing direction into a coherent public product across content structure, UX, interface and development.",
            outputs: ["UX / UI", "Prototype", "Production"],
          },
          {
            meta: "Evolution",
            title: "Platform and workflow redesign",
            copy: "Rework a fragmented site or operating process into a maintainable system with clearer ownership and reusable components.",
            outputs: ["Audit", "Refactor", "Documentation"],
          },
        ]
          .map(
            (offer) => `
              <article class="panel panel--soft">
                <p class="card__meta">${offer.meta}</p>
                <h3 class="card__title">${offer.title}</h3>
                <p class="card__copy">${offer.copy}</p>
                ${tagRow(offer.outputs, { compact: true })}
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="button-row">
        <a class="button button--primary" href="./contact.html">Discuss the right starting point</a>
      </div>
    </section>
  `;
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
              <strong>${esc(options.technology || techItems.join(" / ") || "Research stack")}</strong>
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
        statusLabel: "Active Research",
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
        role: "Runtime and knowledge infrastructure",
        copy: "The core runtime coordinates graph execution, identity, context and long-lived knowledge structures.",
        nodes: ["Knowledge Systems", "Identity Systems", "Simulation Systems", "Runtime Research"],
        exchanges: ["Powers Vestiges", "Informs UnionMob", "Feeds Forge"],
        href: "https://www.vaste.space/",
        linkLabel: "Explore VASTE",
      },
      {
        title: "FORGE",
        role: "Artefact production and transformation",
        copy: "Forge studies how shared pipelines can generate, inherit, evaluate and refine many families of digital artefacts.",
        nodes: ["Artifact Pipelines", "Genome Systems", "Automated Refinement", "Creative Production Research"],
        exchanges: ["Consumes runtime context", "Produces artefacts", "Returns production evidence"],
        href: "./program.html?id=forge",
        linkLabel: "Open Forge",
      },
      {
        title: "VOID",
        role: "Archived experimental foundation",
        copy: "VOID preserves early experiments in modular architecture and creative computation without acting as the centre of the current stack.",
        nodes: ["Experimental Architectures", "Creative Computing Research"],
        exchanges: ["Historical precedent", "Research vocabulary", "Archived decisions"],
        href: "./entity.html?id=void",
        linkLabel: "Open archive field",
      },
      {
        title: "OracleHub",
        role: "Distributed data and prediction lineage",
        copy: "OracleHub explored asynchronous workers, specialised oracle entities and dynamic data pipelines later generalised elsewhere.",
        nodes: ["Distributed Predictions", "Oracle Systems", "Data Pipelines"],
        exchanges: ["Supplies data patterns", "Preserves distributed lineage", "Informs runtime design"],
        href: "./program.html?id=oraclehub",
        linkLabel: "Open OracleHub",
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
            <a class="button button--primary" href="https://www.vaste.space/" target="_blank" rel="noreferrer">Explore VASTE</a>
            <a class="button button--secondary" href="./research.html">Enter Research</a>
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
          <h2>How the programs exchange responsibilities.</h2>
          <p class="lede">The stack is not a hierarchy of interchangeable tools. Each program owns a different problem, preserves a different lineage and passes useful context to the others.</p>
        </div>
        <div class="program-stack-flow" aria-label="Program exchange flow">
          <span>Research questions</span>
          <i aria-hidden="true">→</i>
          <span>Runtime context</span>
          <i aria-hidden="true">→</i>
          <span>Production systems</span>
          <i aria-hidden="true">→</i>
          <span>Projects and evidence</span>
        </div>
        <div class="program-stack-map">
          <div class="program-stack-map__core">
            <p class="card__meta">Shared context</p>
            <strong>Electronic Artefacts</strong>
            <span>Research, programs, projects and archive remain connected through explicit lineage.</span>
          </div>
          <div class="program-stack-map__list">
            ${relationshipColumns
              .map(
                (column, index) => `
                  <details class="program-stack-card"${index === 0 ? " open" : ""}>
                    <summary>
                      <span class="program-stack-card__number">0${index + 1}</span>
                      <span class="program-stack-card__identity">
                        <strong>${esc(column.title)}</strong>
                        <small>${esc(column.role)}</small>
                      </span>
                      <span class="program-stack-card__toggle" aria-hidden="true">+</span>
                    </summary>
                    <div class="program-stack-card__body">
                      <p>${esc(column.copy)}</p>
                      <div class="program-stack-card__grid">
                        <div>
                          <span class="card__meta">Responsibilities</span>
                          <div class="tag-cluster tag-cluster--compact">
                            ${column.nodes.map((node) => chip(node)).join("")}
                          </div>
                        </div>
                        <div>
                          <span class="card__meta">Exchanges</span>
                          <ul>
                            ${column.exchanges.map((exchange) => `<li>${esc(exchange)}</li>`).join("")}
                          </ul>
                        </div>
                      </div>
                      <div class="link-row">
                        <a class="tag" href="${esc(column.href)}"${column.href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${esc(column.linkLabel)}</a>
                      </div>
                    </div>
                  </details>
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
        copy: "Start here for the cultural and artistic line. These projects turn theory into release, image, sound and narrative.",
        items: [entityById("palimpsests")].filter(Boolean),
      },
      {
        label: "Knowledge Platforms",
        copy: "Flagship products that turn research and runtime architecture into public infrastructure with a concrete economic purpose.",
        items: [entityById("vestiges")].filter(Boolean),
      },
      {
        label: "Applied Surfaces",
        copy: "Public and client-facing systems. Open these when you want concrete UX, interface and delivery evidence.",
        items: [
          entityById("unionmob"),
          entityById("atypikhouse"),
          entityById("oeil-de-meg"),
        ].filter(Boolean),
      },
    ].filter((group) => group.items.length);
    const projectPathways = [
      {
        kicker: "For the artistic line",
        title: "Enter Palimpsests first.",
        copy: "It is the clearest path into ORETH, memory, traces and the label layer.",
        href: "./palimpsests.html",
        cta: "Open Palimpsests",
      },
      {
        kicker: "For proof of delivery",
        title: "Compare the applied surfaces.",
        copy: "Client work and product-shaped systems show how the studio handles public pages, visual evidence and workflow.",
        href: "./work.html",
        cta: "See Client Work",
      },
      {
        kicker: "For the system behind it",
        title: "Move into programs and research.",
        copy: "VASTE, Forge and the wider research field explain the operating model beneath the visible projects.",
        href: "./programs.html",
        cta: "View Programs",
      },
    ];

    return `
      <section class="zone-card hero projects-hero">
        <div class="section-head">
          <p class="eyebrow">PROJECTS</p>
          <h1 class="display-title">Projects, from art systems to applied surfaces.</h1>
          <p class="lede">Start with the artistic line, then compare client work, product surfaces and the systems that support them.</p>
          <div class="button-row">
            <a class="button button--primary" href="./work.html">See Client Work</a>
            <a class="button button--secondary" href="./research.html">Enter Research</a>
            <a class="button button--secondary" href="./archive.html">Open Archive</a>
          </div>
        </div>
      </section>
      <section class="zone-card hero project-pathways-panel">
        <div class="section-head">
          <p class="eyebrow">HOW TO READ THIS PAGE</p>
          <h2>Choose the path that matches your intent.</h2>
          <p class="lede">The same body of work can be read as art, delivery proof or systems research. These three paths make that choice explicit.</p>
        </div>
        <div class="card-grid card-grid--three project-pathways-grid">
          ${projectPathways
            .map(
              (item) => `
                <article class="panel panel--soft project-pathway-card">
                  <p class="card__meta">${esc(item.kicker)}</p>
                  <h3 class="card__title">${esc(item.title)}</h3>
                  <p class="card__copy">${esc(item.copy)}</p>
                  <div class="link-row">
                    <a class="tag" href="${esc(item.href)}">${esc(item.cta)}</a>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      ${pageLens("projects")}
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">THREE MODES OF OUTPUT</p>
          <h2>Research, cultural work and applied systems.</h2>
          <p class="lede">Projects differ in public form, but each one translates investigation into something that can be experienced, used or developed further.</p>
        </div>
        <div class="split">
          <article class="panel panel--soft">
            <p class="card__meta">Research-led</p>
            <h3 class="card__title">Questions become models.</h3>
            <p class="card__copy">Systems, knowledge, perception and governance research provide reusable methods rather than a single fixed doctrine.</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Cultural</p>
            <h3 class="card__title">Ideas become experiences.</h3>
            <p class="card__copy">Music, image and editorial forms create emotional and cultural access to the wider practice.</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Applied</p>
            <h3 class="card__title">Models become working systems.</h3>
            <p class="card__copy">Runtimes, products and client platforms turn the research into operational tools and public infrastructure.</p>
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
            <p class="eyebrow">PROJECT DOSSIER</p>
            <h1 class="display-title">Dossier not found.</h1>
            <p class="lede">Open a project from the landing page to access its extended dossier.</p>
            <div class="button-row">
          <a class="button button--primary" href="./projects.html">Browse Projects</a>
          <a class="button button--secondary" href="./work.html">Return to Work</a>
            </div>
          </div>
        </section>
      `;
    }
    const relatedCount = relationEntriesFor(item).length;
    const projectLineActions = [
      { label: "Overview", href: `./project.html?id=${encodeURIComponent(item.id)}` },
      { label: "Browse Projects", href: "./projects.html" },
    ];
    const specificPanels = projectSpecificPanels(item);

    return `
      <section class="zone-card hero">
        <div class="section-head${item.id === "oeil-de-meg" ? " section-head--signature" : ""}">
          ${projectSignatureBubble(item, "hero")}
          <p class="eyebrow">PROJECT DOSSIER</p>
          <h1 class="display-title">${esc(item.title)}</h1>
          <p class="lede">${esc(item.summary || item.description || "")}</p>
          <div class="button-row">
            <a class="button button--primary" href="./project.html?id=${encodeURIComponent(item.id)}">Overview</a>
            <a class="button button--secondary" href="./projects.html">Browse Projects</a>
            <a class="button button--secondary" href="./archive.html">Open Archive</a>
          </div>
        </div>
        <div class="stat-grid project-line-grid">
          <article class="stat-card">
            <p class="card__meta">Category</p>
            <strong>${esc(item.category || item.type || "Project")}</strong>
            <span>${esc(item.type || "Project work")}</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Program</p>
            <strong>${esc(item.program || "Electronic Artefacts")}</strong>
            <span>The system or publishing layer that frames the project.</span>
          </article>
          <article class="stat-card">
            <p class="card__meta">Era</p>
            <strong>${esc(item.temporality?.era || "foundation")}</strong>
            <span>Where the project sits in the timeline.</span>
          </article>
        </div>
      </section>
      ${detailEditorialPanel(item, "project", relatedCount, projectLineActions)}
      ${specificPanels ? `<section class="detail-grid">${specificPanels}</section>` : ""}
      <section class="detail-grid">
        ${knowledgePanels(item)}
      </section>
    `;
  };
  const renderWork = () => renderWorkOffer() + workTaxonomy() + catalogSectionWork();
  const renderResearch = () => researchFields() + researchPrograms() + researchNotes();
  const renderProgramsPage = () => pageLens("programs") + renderPrograms();
  const renderProjectsPage = () => renderProjects();
  const renderArchive = () => pageLens("archive") + archiveTaxonomy() + archiveLibrary();
  const renderAbout = () => pageLens("about") + aboutMap() + aboutNetwork();
  const renderContact = () => contactLinks();

  const catalogSectionWork = () => {
    const groups = [
      {
        label: "Internal Projects",
        copy: "Core programs, flagship products and artistic works developed inside the Electronic Artefacts ecosystem.",
        items: [
          entityById("void"),
          entityById("palimpsests"),
          entityById("oreth"),
          entityById("vaste"),
          entityById("forge"),
          entityById("oraclehub"),
          entityById("vestiges"),
        ].filter(Boolean),
      },
      {
        label: "Collaborations",
        copy: "People and shared practices that expand the work through specialist knowledge, artistic exchange and production.",
        items: [
          entityById("noi-save"),
          entityById("marjolaine-muller"),
        ].filter(Boolean),
      },
      {
        label: "External Works",
        copy: "Commissioned and client-facing systems where strategy, design and implementation are judged against a real public use.",
        items: [
          entityById("seven-temps-seulement"),
          entityById("atypikhouse"),
          entityById("oeil-de-meg"),
        ].filter(Boolean),
      },
    ].filter((group) => group.items.length);

    return `
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">WORK CATALOG</p>
          <h2>One practice, three working contexts.</h2>
          <p class="lede">Internal work develops the language, collaborations introduce other forms of expertise, and external projects prove the approach under concrete constraints.</p>
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
                  <div class="card-grid card-grid--two work-card-grid">
                    ${group.items
                      .map((item, index) => {
                        if (item.kind === "artist") return personCard(item, {
                          href: `./artist.html?id=${encodeURIComponent(item.id)}`,
                          variant: group.label === "Collaborations" ? "collaborator" : "",
                          index,
                        });
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
      "home-orientation": renderHomeOrientation,
      "home-featured-paths": renderFeaturedPaths,
      "home-vaste-banner": renderVasteBanner,
      "home-featured-work": renderFeaturedWork,
      "home-featured-research": renderFeaturedResearch,
      "home-latest": renderLatest,
      "home-activity": renderActivityFeed,
      "home-collections": renderCollectionsPanel,
      "cross-navigation": renderCrossNavigation,
    },
    work: {
      "work-offer": renderWorkOffer,
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
              <p class="eyebrow">UNAVAILABLE</p>
              <h1 class="display-title">Section unavailable.</h1>
              <p class="lede">This part of the page could not be displayed for the moment.</p>
            </div>
            <div class="panel panel--soft">
              <p class="card__meta">Notice</p>
              <p class="card__copy">Please continue with the rest of the page.</p>
            </div>
          </section>
        `;
      }
    });
  };

  const initPageInteractions = () => {
    initFilters(filterState);
    initSearch(searchState, renderSearchResults);
    initCardLinks();
    initUXEnhancements(filterState);
    startVasteEngineAnimation();
    startGraphSurfaceAnimation();
  };

  const load = async () => {
    const current = document.body.dataset.page;
    syncSeoMeta({ current, entityById });
    const includesReady = loadIncludes();
    renderPageSections();
    await includesReady;
    syncNavigationState(current);
    document.querySelectorAll(".site-main .zone-card").forEach((zone, index) => {
      zone.dataset.zoneIndex = String(index + 1);
      zone.style.setProperty("--zone-index", String(index + 1));
    });
    initPageInteractions();
    document.body.classList.add("is-ready");
    setYear();
  };

  load().catch(() => setYear());
})();
