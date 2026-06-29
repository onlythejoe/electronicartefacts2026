(function () {
  const catalog = window.EA_CATALOG || {};
  const page = document.body.dataset.page || "home";
  const filterState = new Map();
  const { esc, setYear, slugify } = window.EA_UTILS;
  const { loadIncludes } = window.EA_INCLUDES;
  const { statusBadge, chip, tagRow, metadataList, linkRow, metricRail, cardLinkAttrs, cardOverlayLink } = window.EA_UI;
  const { initFilters, initSearch, initLanguageSwitcher, initCardLinks, initContactDiscovery, initCapabilityMaps, initUXEnhancements, initEngagementPanels, refreshCardSurfaces, syncNavigationState, syncSeoMeta } = window.EA_BEHAVIORS;
  const {
    cardBaseAttrs,
    mediaFrom,
    mediaKindFor,
    mediaFigureMarkup,
    projectSignatureBubble,
    projectButterflyBubble,
    vasteEngineMarkup,
    startVasteEngineAnimation,
    computationFieldMarkup,
    startComputationFieldAnimation,
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
  const { crossNavigation, uxSurface, nodesFromItems, ecosystemExplorer, startGraphSurfaceAnimation, pageLens } = window.EA_SURFACE;
  const indexes = catalog.indexes || {};
  const entityIndex = indexes.byId || {};
  const titleIndex = indexes.byTitleSlug || {};
  const timelineIndex = indexes.timelinesByEntityId || {};
  const activityIndex = indexes.activityByEntityId || {};
  const contactEmail = "electronic.artefacts@gmail.com";
  const isFrench = () => window.EA_I18N?.locale === "fr";
  const translate = (value) => window.EA_I18N?.translateText?.(value) || value;
  const countEntries = (count) => isFrench() ? `${count} ${count > 1 ? "entrées" : "entrée"}` : `${count} ${count === 1 ? "entry" : "entries"}`;
  const searchResultLabel = (count) => isFrench() ? `${count} ${count > 1 ? "résultats" : "résultat"}` : `${count} ${count === 1 ? "result" : "results"}`;
  const mailto = (subject, body = "") =>
    `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const programAccessMailto = mailto(
    "Program repository access request",
    [
      "Program or repository:",
      "GitHub username:",
      "Organization or practice:",
      "Use case:",
      "Commercial context:",
      "Requested access window:",
      "NDA, licensing or procurement constraints:",
    ].join("\n"),
  );

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
        copy: "Runtime architecture, information structures, simulation and organisational governance.",
        ids: ["runtime-theory", "systems-theory", "graph-runtime-studies", "governance-studies"],
      },
      {
        label: "Knowledge & transmission",
        title: "How does knowledge persist, circulate and become actionable?",
        copy: "Taxonomy, memory, archives and the relationships that make knowledge discoverable.",
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
          <h2>Explore the research fields.</h2>
          <p class="lede">${publicFields.length} areas of inquiry. Open any field to see the projects, notes and references around it.</p>
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
        <a class="button button--secondary" href="./programs.html">See all programs</a>
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
        <p class="lede">Logs preserve decisions, tests and unresolved questions, so useful learning remains visible after a prototype or project has moved on.</p>
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
        <a class="button button--secondary" href="./archive.html">Browse the archive</a>
        <a class="tag" href="./search.html">Search the site</a>
      </div>
    </section>
  `;
  };

  const archiveTaxonomy = () =>
    taxonomyPanel(
      "archive",
      "ARCHIVE TAXONOMY",
      {
        heading: "Archive as a working library",
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
                    <p class="lede">${esc(countEntries(items.length))}</p>
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

  const aboutNetwork = () => `
    <div class="stack">
      <section class="zone-card hero" id="about-overview">
        <div class="section-head">
          <p class="eyebrow">ABOUT</p>
          <h2>What Electronic Artefacts is.</h2>
          <p class="lede">An independent creative technology studio for products and platforms that need strategy, system architecture, interface design, implementation and cultural context to stay aligned.</p>
        </div>
        <div class="split">
          <article class="panel panel--soft">
            <p class="card__meta">Institutional role</p>
            <h3 class="card__title">Studio, software lab and publishing line, in that order.</h3>
            <p class="card__copy">The primary public identity is a studio. Client work proves the approach, proprietary programs extend it, and research or artistic publishing keeps the deeper context available.</p>
            <p class="card__copy">This hierarchy prevents the label, archive and research language from competing with the simple answer: Electronic Artefacts designs and builds complex digital systems.</p>
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Operating cycle</p>
            <h3 class="card__title">Research → Programs → Projects → Archive</h3>
            <p class="card__copy">Research produces methods and hypotheses. Programs turn those methods into reusable systems. Projects translate the systems into public works and client outcomes. Archive preserves the evidence.</p>
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

  const contactDiscovery = () => `
    <section class="zone-card contact-discovery" id="contact-discovery" data-contact-discovery>
      <div class="contact-discovery__intro">
        <div>
          <p class="eyebrow">PROJECT / COLLABORATION DISCOVERY</p>
          <h2 class="display-title">What should exist that doesn’t exist yet?</h2>
          <p class="lede">Describe the situation in your own words. This interface organizes your intent into a concise brief. Classification happens locally in your browser.</p>
        </div>
      </div>
      <div class="contact-command">
        <label class="sr-only" for="contact-intent">Describe your idea, project or collaboration</label>
        <textarea id="contact-intent" class="contact-command__input" rows="4" data-contact-intent placeholder="Tell us what you’re working on." aria-describedby="contact-discovery-status"></textarea>
        <div class="contact-command__footer"><span id="contact-discovery-status" data-contact-status aria-live="polite">Start with a sentence. No formal brief required.</span><span><kbd>⌘</kbd><kbd>Enter</kbd> to continue</span></div>
      </div>
      <div class="contact-discovery__workspace" data-contact-workspace hidden>
        <div class="contact-discovery__main">
          <section class="contact-discovery__step" aria-labelledby="contact-pathway-title">
            <div class="contact-discovery__step-head"><span>01</span><div><p class="card__meta">Likely pathway</p><h2 id="contact-pathway-title" data-contact-pathway-title>Clarifying intent</h2></div></div>
            <p class="card__copy" data-contact-pathway-copy></p>
            <div class="contact-pathways" data-contact-pathways aria-label="Change collaboration pathway"></div>
          </section>
          <section class="contact-discovery__step" aria-labelledby="contact-tags-title">
            <div class="contact-discovery__step-head"><span>02</span><div><p class="card__meta">Detected signals</p><h2 id="contact-tags-title">Confirm what matters.</h2></div></div>
            <div class="contact-detected-tags" data-contact-tags aria-live="polite"></div>
            <div class="contact-custom-tag"><label for="contact-custom-tag">Add another signal</label><div><input id="contact-custom-tag" type="text" data-contact-custom-tag placeholder="e.g. exhibition, API, distribution" /><button type="button" class="tag" data-contact-add-tag>Add</button></div></div>
          </section>
          <section class="contact-discovery__step" aria-labelledby="contact-questions-title">
            <div class="contact-discovery__step-head"><span>03</span><div><p class="card__meta">Relevant questions</p><h2 id="contact-questions-title">Give the idea enough context.</h2></div></div>
            <div class="contact-questions" data-contact-questions></div>
          </section>
          <section class="contact-discovery__step contact-identity" aria-labelledby="contact-identity-title">
            <div class="contact-discovery__step-head"><span>04</span><div><p class="card__meta">Contact details</p><h2 id="contact-identity-title">Where should the reply go?</h2></div></div>
            <div class="contact-field-grid"><label><span>Name</span><input type="text" autocomplete="name" data-contact-name required /></label><label><span>Email</span><input type="email" autocomplete="email" data-contact-email required /></label><label class="contact-field-grid__wide"><span>Organization or practice <em>optional</em></span><input type="text" autocomplete="organization" data-contact-organization /></label></div>
          </section>
        </div>
        <aside class="contact-brief" aria-labelledby="contact-brief-title">
          <div class="contact-brief__head"><p class="card__meta">LIVE BRIEF</p><h2 id="contact-brief-title">Your entry point</h2><span data-contact-completeness>Intent captured</span></div>
          <dl data-contact-summary></dl>
          <div class="contact-brief__actions"><a class="button button--primary" data-contact-submit href="mailto:electronic.artefacts@gmail.com">Prepare email</a><button class="button button--secondary" type="button" data-contact-copy>Copy brief</button></div>
          <p class="contact-brief__note">Nothing is uploaded. “Prepare email” opens your mail application with the brief included.</p>
        </aside>
      </div>
    </section>
  `;

  const contactLinks = () => `
    <section class="zone-card hero contact-channels">
      <div class="section-head"><p class="eyebrow">DIRECT ROUTES</p><h2>Prefer to contact us directly?</h2><p class="lede">The discovery interface is optional. Email remains the primary route; public channels expose the studio's code, sound, research and ongoing work.</p></div>
      <div class="contact-grid">
        <article class="panel"><p class="card__meta">Email</p><h3 class="card__title">electronic.artefacts@gmail.com</h3><p class="card__copy">Project briefs, partnerships, commissions and considered introductions.</p>${linkRow({ label: "Send email", href: "mailto:electronic.artefacts@gmail.com" })}</article>
        <article class="panel"><p class="card__meta">Studio channel</p><h3 class="card__title">@electronic.artefacts</h3><p class="card__copy">Studio updates, releases and public signals.</p>${linkRow({ label: "Open Instagram", href: "https://www.instagram.com/electronic.artefacts/", target: "_blank" })}</article>
        <article class="panel"><p class="card__meta">Visual observatory</p><h3 class="card__title">@creativestuff.jpg</h3><p class="card__copy">Visual research, references and observations.</p>${linkRow({ label: "Open Instagram", href: "https://www.instagram.com/creativestuff.jpg/", target: "_blank" })}</article>
        <article class="panel"><p class="card__meta">Code / sound / runtime</p><h3 class="card__title">Public surfaces</h3><p class="card__copy">Code, audio and the external VASTE runtime.</p><div class="link-row"><a class="tag" href="https://github.com/onlythejoe" target="_blank" rel="noreferrer">GitHub</a><a class="tag" href="https://soundcloud.com/electronic-artefacts" target="_blank" rel="noreferrer">SoundCloud</a><a class="tag" href="https://www.vaste.space/" target="_blank" rel="noreferrer">VASTE</a></div></article>
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
    const canonicalRoute = catalog.routeFor?.(entry);
    if (canonicalRoute) return canonicalRoute;
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
        title: "Read this as living knowledge infrastructure.",
        intro: "Vestiges is the flagship public application of VASTE: a platform where people, practices, materials, places and institutions can be preserved, connected and revisited over time.",
        why: "The product preserves paths of transmission while making knowledge discoverable, attributable and useful across public, cultural and professional contexts.",
        inspect: ["The living knowledge base", "The contribution and trust model", "The path from public discovery to professional utility"],
        proof: `${countLabel(item.graphNodeTypes?.length || 0, "knowledge category", "knowledge categories")}, ${countLabel(item.relationshipTypes?.length || 0, "relation type")} and a VASTE-powered architecture for identity, provenance and context.`,
        next: "Follow the project from stable identity to contribution, public presentation and professional activation.",
        cta: item.links?.[0] || { label: "Explore VASTE", href: "https://www.vaste.space/" },
      };
    }

    if (item.id === "unionmob") {
      return {
        title: "Read this as an external CTO partnership.",
        intro: "UnionMob is owned and led by Zarah Nkounkou. Electronic Artefacts contributes technical leadership, back-end architecture and governance systems without owning the UnionMob project or claiming its visual identity.",
        why: "The central distinction is contractual and technical: UnionMob remains the external organisation, while UMOS remains Electronic Artefacts property and is made available through usage rights.",
        inspect: ["The project ownership and CTO role", "The official UnionMob identity and violet palette", "The separation between UnionMob and the licensed UMOS system"],
        proof: `${assetDocumentation} the supplied UnionMob identity, while the dossier records the CTO scope and software-rights model.`,
        next: "Continue into the architecture to understand the back-end, governance and operating-system contribution.",
        cta: item.links?.[0] || { label: "Explore Research", href: "./research.html" },
      };
    }

    if (isOrethSignature(item)) {
      return {
        title: "Read this as an artistic dossier.",
        intro: `${item.title} connects release logic, image memory and archive structure. The page keeps the work legible as a cultural object first, then opens the world around it.`,
        why: "The important point is the translation: fragments become acts, references become a world, and the archive becomes part of the work rather than a footnote.",
        inspect: ["The opening frame for mood and authorship", "The act structure for narrative order", "The context around the work"],
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

    if (heroMode === "person" || item.kind === "artist") {
      const profile = item.artistProfile || {};
      return {
        title: "Read this as an artist profile.",
        intro: profile.headline || `${item.title} is mapped through ${mediumPhrase} and connected work inside the Electronic Artefacts catalogue.`,
        why: profile.intro || "Artist pages give collaborators their own public context, then keep production work, credits and nearby projects connected underneath.",
        inspect: ["The artist position", "The connected work", "The production and collaboration notes"],
        proof: `${status} status, ${galleryCount ? countLabel(galleryCount, "portrait asset") : "artist context"} and ${relationPhrase}.`,
        next: "Move from the profile into the connected project, or return to the work catalogue to compare the wider artistic line.",
        cta: item.links?.[0] || { label: "Open Work", href: "./work.html" },
      };
    }

    if (heroMode === "project") {
      return {
        title: "Read this as a project dossier.",
        intro: `${item.title} sits inside the studio as ${typeLabel.toLowerCase()}, shaped by ${mediumPhrase}.`,
        why: "The page explains what the project is, where it comes from and which surrounding systems make it meaningful.",
        inspect: ["The public angle", "The visual material", "The nearby work"],
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
        inspect: ["The program scope", "The operating context", "The related projects and influences"],
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
        inspect: ["The subject matter", "The date and status", "Nearby entries for what to open next"],
        proof: `${item.date || dateLabel || status} placement, with ${relationPhrase}.`,
        next: "Follow the related entries when you want the larger project or research line around this fragment.",
        cta: { label: "Open Archive", href: "./archive.html" },
      };
    }

    return {
        title: "Read this as a knowledge piece with a clear path outward.",
        intro: `${item.title} frames ${mediumPhrase} inside the Electronic Artefacts world.`,
      why: "The page gives the piece a public explanation first, then keeps the surrounding context available.",
      inspect: ["The opening summary", "The subject matter", "The related pages"],
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
          <p class="card__meta">Guide</p>
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
          <p class="card__meta">What to look at</p>
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
          <p class="card__meta">Dossier frame</p>
          <h2 class="card__title">A compact frame around the work.</h2>
          <p class="lede">Status, dates and related material stay close so the piece can be read in context.</p>
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

  const metadataPanel = (item) => `
    <section class="panel knowledge-panel engagement-panel" data-engagement-panel data-like-key="${esc(item.id || item.title || "record")}">
      <div class="engagement-panel__header">
        <div>
          <p class="card__meta">Save and share</p>
          <h2 class="card__title">${esc(item.title || "Record")}</h2>
        </div>
        <span class="engagement-panel__status">${esc(statusLabelFor(item))}</span>
      </div>
      <div class="engagement-panel__actions" aria-label="Article actions">
        <button class="engagement-action engagement-action--like" type="button" data-like-button aria-label="Like this article">
          <span aria-hidden="true">♡</span>
          <strong data-like-count>0</strong>
        </button>
        <button class="engagement-action" type="button" data-share-button>
          <span aria-hidden="true">↗</span>
          <strong>Share</strong>
        </button>
      </div>
      <dl class="engagement-meta" aria-label="Compact article metadata">
        ${[
          { label: "Type", value: item.subtitle || item.type || detailTypeLabel(item) },
          { label: "Domain", value: item.domain || item.category },
          { label: "Updated", value: item.temporality?.lastUpdated || item.temporality?.creationYear },
        ]
          .filter((pair) => pair.value)
          .map(
            (pair) => `
              <div>
                <dt>${esc(pair.label)}</dt>
                <dd>${esc(pair.value)}</dd>
              </div>
            `,
          )
          .join("")}
      </dl>
      <p class="engagement-panel__feedback" data-engagement-feedback aria-live="polite"></p>
    </section>
  `;

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

  const projectDesignPattern =
    /\b(art direction|brand|branding|charte|cover|design|identity|logo|mark|mood|moodboard|monogram|palette|picto|signage|symbol|ui|visual|wordmark)\b/i;
  const projectIdentityPattern = /\b(brand|branding|cover|identity|logo|mark|monogram|picto|symbol|wordmark)\b/i;
  const projectInterfacePattern = /\b(admin|app|dashboard|flow|interface|landing|mobile|navigation|page|portfolio|screen|site|ui|ux)\b/i;
  const projectAtmospherePattern = /\b(atmosphere|forest|hero|image|mood|moodboard|room|signage|suite|texture|visual)\b/i;
  const projectSwatchMap = {
    amber: "#d89f4f",
    black: "#050505",
    blue: "#2563eb",
    cream: "#eadccf",
    gold: "#d8b86a",
    gray: "#8d8f95",
    grey: "#8d8f95",
    green: "#4f7d5d",
    ink: "#111115",
    ivory: "#f2eadf",
    navy: "#13213a",
    "navy blue": "#13213a",
    orange: "#d97738",
    purple: "#7c3aed",
    red: "#b94a48",
    slate: "#334155",
    violet: "#8b5cf6",
    white: "#f7f4ef",
  };
  const projectFallbackSwatches = ["#f2eadf", "#161616", "#7dd3fc", "#4f7d5d", "#d8b86a", "#8d8f95"];
  const compactUnique = (values) => [...new Set((values || []).filter(Boolean))];
  const labelize = (value) => String(value || "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  const projectMediaText = (media) => [media.src, media.alt, media.caption, media.id].filter(Boolean).join(" ");
  const projectText = (item) =>
    [
      item.title,
      item.subtitle,
      item.summary,
      item.description,
      item.category,
      item.type,
      ...(item.tags || []),
      ...(item.discipline || []),
      ...(item.medium || []),
      ...(item.visualLanguage || []),
      ...(item.textures || []),
      ...(item.symbols || []),
    ]
      .filter(Boolean)
      .join(" ");
  const projectVisualGroup = (media) => {
    const text = projectMediaText(media);
    if (projectIdentityPattern.test(text)) return "identity";
    if (projectInterfacePattern.test(text)) return "interface";
    if (projectAtmospherePattern.test(text)) return "atmosphere";
    return "reference";
  };
  const projectMediaHasVisualSignal = (media) => {
    const text = projectMediaText(media);
    return projectDesignPattern.test(text) || projectIdentityPattern.test(text) || projectInterfacePattern.test(text) || projectAtmospherePattern.test(text);
  };
  const projectDesignAssets = (item) => {
    const gallery = item.media?.gallery || [];
    const matches = gallery.filter(projectMediaHasVisualSignal);
    if (matches.length) return matches;
    return projectDesignPattern.test(projectText(item)) ? gallery.filter(Boolean).slice(0, 8) : [];
  };
  const projectHasArtDirection = (item) =>
    Boolean(item.visualLanguage?.length || item.textures?.length || item.symbols?.length || projectDesignAssets(item).length);
  const projectSwatchColor = (token, index) => projectSwatchMap[String(token || "").toLowerCase().trim()] || projectFallbackSwatches[index % projectFallbackSwatches.length];
  const projectVisualTokens = (item) => {
    if (item.visualLanguage?.length) return compactUnique(item.visualLanguage).slice(0, 6);
    return compactUnique([
      ...(item.discipline || []).filter((value) => projectDesignPattern.test(value)),
      ...(item.tags || []).filter((value) => projectDesignPattern.test(value)),
    ]).slice(0, 6);
  };
  const projectMoodCues = (item) =>
    compactUnique([...(item.textures || []), ...(item.symbols || []), ...(item.discipline || []), ...(item.tags || [])]).slice(0, 10);

  const projectMoodboardPanel = (item) => {
    if (item.kind !== "project" || !projectHasArtDirection(item)) return "";
    const assets = projectDesignAssets(item);
    const identityAssets = assets.filter((media) => projectVisualGroup(media) === "identity");
    const groups = compactUnique(assets.map((media) => projectVisualGroup(media)));
    const visualTokens = projectVisualTokens(item);
    const cues = projectMoodCues(item);
    const isUnionMob = item.id === "unionmob";

    return panelShell(
      isUnionMob ? "Project identity" : "Art direction",
      isUnionMob
        ? item.visualAttribution || "Identity assets supplied by the project are shown for context."
        : "Moodboard, marks and graphic system pulled from the project assets.",
      `
        <div class="project-moodboard project-moodboard--runtime" data-project-moodboard>
          <div class="project-moodboard__intro">
            <div>
              <p class="card__meta">Moodboard</p>
              <h3 class="card__title">${esc(identityAssets.length ? "Identity, atmosphere and interface cues." : "Visual language attached to the project.")}</h3>
            </div>
            ${
              groups.length > 1
                ? `<div class="project-moodboard__filters" aria-label="Moodboard asset filters">
                    <button class="project-command__tab is-active" type="button" aria-pressed="true" data-project-mood-filter="all">All</button>
                    ${groups
                      .map(
                        (group) =>
                          `<button class="project-command__tab" type="button" aria-pressed="false" data-project-mood-filter="${esc(group)}">${esc(labelize(group))}</button>`,
                      )
                      .join("")}
                  </div>`
                : ""
            }
          </div>
          <div class="project-moodboard__layout">
            <article class="panel panel--soft project-moodboard__identity">
              <p class="card__meta">Identity kit</p>
              <h3 class="card__title">${esc(identityAssets.length ? countLabel(identityAssets.length, "mark asset") : item.subtitle || item.type || "Visual system")}</h3>
              <p class="card__copy">${esc(identityAssets[0]?.caption || item.summary || item.description || "")}</p>
              ${
                identityAssets.length
                  ? `<div class="project-moodboard__logo-rail">
                      ${identityAssets
                        .slice(0, 3)
                        .map(
                          (media) => `
                            <figure>
                              ${mediaFigureMarkup(media, item, "project-moodboard__logo")}
                            </figure>
                          `,
                        )
                        .join("")}
                    </div>`
                  : tagRow(visualTokens, { compact: true, limit: 6 })
              }
            </article>
            <div class="project-moodboard__canvas">
              ${assets
                .slice(0, 10)
                .map((media, index) => {
                  const group = projectVisualGroup(media);
                  return `
                    <figure class="project-moodboard__asset project-moodboard__asset--${index % 5}" data-project-mood-asset data-mood-kind="${esc(group)}">
                      ${mediaFigureMarkup(media, item, "project-moodboard__media")}
                      ${media.caption ? `<figcaption>${esc(media.caption)}</figcaption>` : ""}
                    </figure>
                  `;
                })
                .join("")}
            </div>
            <aside class="panel panel--soft project-moodboard__system">
              <p class="card__meta">${isUnionMob ? "Project palette" : "Graphic charter"}</p>
              <div class="project-moodboard__swatches" aria-label="Visual language">
                ${(visualTokens.length ? visualTokens : ["Identity", "Interface", "Material"])
                  .map(
                    (token, index) => `
                      <span class="project-moodboard__swatch">
                        <i style="--swatch: ${esc(projectSwatchColor(token, index))}" aria-hidden="true"></i>
                        <strong>${esc(token)}</strong>
                      </span>
                    `,
                  )
                  .join("")}
              </div>
              ${cues.length ? `<div class="project-moodboard__cues"><p class="card__meta">Cues</p>${tagRow(cues, { compact: true, limit: 10 })}</div>` : ""}
            </aside>
          </div>
        </div>
      `,
    );
  };

  const projectDevelopmentPanel = (item) => {
    if (item.kind !== "project") return "";
    const architecture = item.architecture || {};
    const layers = compactUnique([...(architecture.layers || []), ...(item.umosArchitecture?.layers || [])]).slice(0, 10);
    const stack = Array.isArray(architecture.stack)
      ? architecture.stack
      : String(architecture.stack || item.umosArchitecture?.stack?.join(", ") || "")
          .split(/,\s*|\s+and\s+/)
          .map((value) => value.trim())
          .filter(Boolean);
    const relatedSystems = compactUnique([
      ...(item.relatedPrograms || []),
      ...(item.relations?.dependencies || []),
      ...(item.relations?.poweredBy || []),
    ]);
    const related = resolveIds(relatedSystems).slice(0, 6);

    return panelShell(
      "Development",
      architecture.note || "Architecture, implementation logic and system dependencies.",
      `
        <div class="project-discipline project-discipline--dev">
          <div class="project-discipline__grid">
            <article class="panel panel--soft project-discipline__card project-discipline__card--lead">
              <p class="card__meta">Build surface</p>
              <h3 class="card__title">${esc(architecture.surface || item.type || item.category || "Project system")}</h3>
              <p class="card__copy">${esc(architecture.surfaceCopy || item.description || item.summary || "")}</p>
            </article>
            <article class="panel panel--soft project-discipline__card">
              <p class="card__meta">Stack</p>
              <h3 class="card__title">${esc(stack.length ? countLabel(stack.length, "stack signal") : architecture.stack || item.program || "System stack")}</h3>
              ${stack.length ? tagRow(stack, { compact: true, limit: 8 }) : `<p class="card__copy">${esc(architecture.stackCopy || "Stack details appear when they are useful to the public dossier.")}</p>`}
            </article>
            <article class="panel panel--soft project-discipline__card">
              <p class="card__meta">Layers</p>
              <h3 class="card__title">${esc(layers.length ? countLabel(layers.length, "layer") : "Layer model")}</h3>
              ${layers.length ? tagRow(layers, { compact: true, limit: 10 }) : `<p class="card__copy">${esc(architecture.layerCopy || "Layered architecture will appear here when available.")}</p>`}
            </article>
            <article class="panel panel--soft project-discipline__card">
              <p class="card__meta">Connected systems</p>
              <h3 class="card__title">${esc(related.length ? countLabel(related.length, "system") : item.program || item.statusLabel || item.status || "Project graph")}</h3>
              ${
                related.length
                  ? `<div class="project-discipline__links">${related.map((entry) => `<a class="tag" href="${esc(entryHref(entry))}">${esc(entry.title)}</a>`).join("")}</div>`
                  : `<p class="card__copy">Runtime dependencies and related programs are shown when they are public.</p>`
              }
            </article>
          </div>
        </div>
      `,
    );
  };

  const projectMarketingPanel = (item) => {
    if (item.kind !== "project") return "";
    const galleryCount = item.media?.gallery?.length || 0;
    const audience = compactUnique([
      item.client,
      item.artist,
      ...(item.stakeholders || []),
      ...(item.medium || []),
      ...(item.discipline || []),
    ]).slice(0, 8);
    const proof = compactUnique([
      item.statusLabel || item.status,
      item.visibility,
      galleryCount ? countLabel(galleryCount, "asset") : "",
      ...(item.researchOutcomes || []),
      ...(item.lessonsLearned || []),
    ]).slice(0, 6);
    const messaging = compactUnique([item.category, item.type, ...(item.tags || []), ...(item.subThemes || [])]).slice(0, 10);

    return panelShell(
      "Marketing",
      "Positioning, audience, message and proof signals.",
      `
        <div class="project-discipline project-discipline--marketing">
          <div class="project-marketing__grid">
            <article class="panel panel--soft project-marketing__statement">
              <p class="card__meta">Positioning</p>
              <h3 class="card__title">${esc(item.summary || item.subtitle || item.type || "Project positioning")}</h3>
              <p class="card__copy">${esc(item.description || item.coreIdea || "")}</p>
            </article>
            <article class="panel panel--soft project-discipline__card">
              <p class="card__meta">Audience</p>
              <h3 class="card__title">${esc(audience.length ? countLabel(audience.length, "audience signal") : "Audience")}</h3>
              ${audience.length ? tagRow(audience, { compact: true, limit: 8 }) : `<p class="card__copy">Audience groups appear when client, stakeholder or medium data is present.</p>`}
            </article>
            <article class="panel panel--soft project-discipline__card">
              <p class="card__meta">Proof</p>
              <h3 class="card__title">${esc(proof.length ? countLabel(proof.length, "signal") : "Proof pending")}</h3>
              <ul class="project-list">
                ${proof.map((value) => `<li>${esc(value)}</li>`).join("")}
              </ul>
            </article>
            <article class="panel panel--soft project-discipline__card">
              <p class="card__meta">Messaging fields</p>
              <h3 class="card__title">${esc(item.subtitle || item.category || item.type || "Message system")}</h3>
              ${messaging.length ? tagRow(messaging, { compact: true, limit: 10 }) : ""}
            </article>
          </div>
        </div>
      `,
    );
  };

  const projectDossierReaderPanel = (item) => {
    if (item.kind !== "project") return "";
    const dossier = item.marketingDossier || item.dossier;
    if (!dossier?.src) return "";
    const panelId = `${item.id || "project"}-dossier-marketing`;
    const readerSrc = `${dossier.src}#toolbar=1&navpanes=0&view=FitH`;
    const highlights = compactUnique(dossier.highlights || []).slice(0, 6);
    const credits = Array.isArray(item.credits) ? item.credits : [];
    const creditItems = credits.map((credit) => ({
      label: credit.label || labelize(credit.id || ""),
      value: credit.role || "Contribution",
    }));
    const stats = [
      dossier.pages ? { label: "Pages", value: String(dossier.pages) } : null,
      dossier.format ? { label: "Format", value: dossier.format } : null,
      dossier.fileSize ? { label: "Web PDF", value: dossier.fileSize } : null,
      dossier.year ? { label: "Year", value: dossier.year } : null,
    ].filter(Boolean);

    return `
      <section class="panel knowledge-panel project-pdf-panel" id="${esc(panelId)}">
        <div class="project-pdf-reader">
          <div class="project-pdf-reader__intro">
            ${
              dossier.cover
                ? `
                  <figure class="project-pdf-reader__cover">
                    <img src="${esc(dossier.cover)}" alt="${esc(`${dossier.title || item.title} cover`)}" loading="lazy" decoding="async" />
                  </figure>
                `
                : ""
            }
            <div class="project-pdf-reader__copy">
              <p class="card__meta">${esc(dossier.agency ? `Dossier marketing / ${dossier.agency}` : "Dossier marketing")}</p>
              <h2 class="card__title">${esc(dossier.title || `${item.title} dossier`)}</h2>
              ${dossier.subtitle ? `<p class="lede">${esc(dossier.subtitle)}</p>` : ""}
              ${dossier.copy ? `<p class="card__copy">${esc(dossier.copy)}</p>` : ""}
              ${stats.length ? `
                <div class="project-pdf-reader__metrics" aria-label="Dossier details">
                  ${stats.map((stat) => `
                    <span>
                      <strong>${esc(stat.value)}</strong>
                      <em>${esc(stat.label)}</em>
                    </span>
                  `).join("")}
                </div>
              ` : ""}
              ${creditItems.length ? `
                <div class="project-pdf-reader__credits">
                  <p class="card__meta">Credits</p>
                  ${metadataList(creditItems)}
                </div>
              ` : ""}
              ${highlights.length ? tagRow(highlights, { compact: true, limit: 6 }) : ""}
              <div class="button-row button-row--compact">
                <a class="button button--primary" href="${esc(dossier.src)}" target="_blank" rel="noreferrer">Open PDF</a>
                <a class="button button--secondary" href="${esc(dossier.src)}" download="${esc(`${item.id || "project"}-marketing-dossier.pdf`)}">Download</a>
              </div>
            </div>
          </div>
          <div class="project-pdf-reader__viewport" role="region" aria-label="${esc(`${dossier.title || item.title} PDF reader`)}">
            <iframe class="project-pdf-reader__frame" title="${esc(dossier.title || `${item.title} PDF dossier`)}" src="${esc(readerSrc)}" loading="lazy"></iframe>
          </div>
        </div>
      </section>
    `;
  };

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
        "Vestiges is the flagship public application of VASTE: a living knowledge infrastructure rather than a directory, encyclopedia or marketplace.",
        `<div class="stack">
          ${softPanel("Position", "Living knowledge, made operational", item.productPosition || "")}
          ${softPanel("Mission", item.mission || "", "A durable infrastructure for documenting, connecting and reactivating human know-how.")}
          ${softPanel("Primary resource", item.coreResource || "Knowledge", "Profiles, services and transactions remain useful, but trusted knowledge and its provenance form the durable foundation.")}
        </div>`,
      ),
      panelShell(
        "The living knowledge base",
        "The system preserves both the entities and the paths through which knowledge moves.",
        `<div class="stack">
          ${softPanel("Identity principle", "Every important element keeps a durable identity", item.graphPrinciple || "")}
          <div class="card-grid card-grid--two">
            ${softPanel("Knowledge families", `${item.graphNodeTypes?.length || 0} mapped families`, "People, organisations, techniques, materials, places and works can each become durable public surfaces.", chipList(item.graphNodeTypes, 12))}
            ${softPanel("Relationship vocabulary", `${item.relationshipTypes?.length || 0} explicit relations`, "Teaching, making, use, restoration, supply and certification reveal how know-how is transmitted.", chipList(item.relationshipTypes, 10))}
          </div>
        </div>`,
      ),
      panelShell(
        "Public discovery",
        "Public pages and relation paths make the knowledge base readable without separating publishing from the model.",
        `<div class="stack">
          ${softPanel("Knowledge projection", "One canonical surface per node", item.seoModel || "")}
          ${chipList(["Public page", "Canonical URL", "Description", "Relations", "Media", "History", "Metadata"])}
        </div>`,
      ),
      panelShell(
        "Contribution and trust",
        "Expertise can enter from workshops, schools, museums and institutions without losing authorship or editorial responsibility.",
        `<div class="stack">
          ${softPanel("Participants", `${item.stakeholders?.length || 0} initial actor groups`, "Vestiges connects professional, cultural, educational, institutional and private actors.", chipList(item.stakeholders))}
          ${softPanel("Collaboration", "Distributed knowledge with governance", "Contributions remain attributable, contextual, reviewable and connected to the same shared graph.", chipList(item.collaborationCapabilities))}
        </div>`,
      ),
      panelShell(
        "Explore relation paths",
        "Knowledge can be read as paths, maps and constellations rather than as isolated profiles.",
        `<div class="stack">
          ${softPanel("Visualisation", "From graph to navigable space", "A technique can reveal its materials, tools, practitioners, places, schools and institutions in one connected view.", chipList(item.visualizationModes))}
        </div>`,
      ),
      panelShell(
        "Professional activation",
        "Services emerge from trusted knowledge and explicit relationships; they do not replace the platform's cultural purpose.",
        `<div class="stack">
          ${softPanel("Service model", "Utility grows from trusted knowledge", "Professional workspaces, collaboration, learning, research and APIs can operate on top of the shared knowledge infrastructure.", chipList(item.economicModel))}
        </div>`,
      ),
      panelShell(
        "Long-term horizon",
        "Vestiges is conceived as durable infrastructure for knowledge that continues to change.",
        `<div class="stack">
          ${softPanel("Long view", "A living map of human know-how", "Craft, heritage, production, learning, research and innovation remain connected inside the same evolving system.", chipList(item.longTermDomains))}
          ${softPanel("Public channel", "@vestiges.world", "Visual identity, editorial research and product development.", linkRow({ label: "Open Instagram", href: "https://www.instagram.com/vestiges.world/", target: "_blank" }))}
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

  const artistProfilePanels = (item) => {
    if (item.kind !== "artist") return "";
    const profile = item.artistProfile || {};
    const focus = compactValues([...(profile.focus || []), ...(item.discipline || []), ...(item.medium || [])]).slice(0, 8);
    const connected = resolveIds([
      ...(item.relatedProjects || []),
      ...(item.relations?.children || []),
      ...(item.relations?.relatedTo || []),
      ...(item.relations?.parent || []),
    ]);
    const uniqueConnected = connected.filter((entry, index, entries) => entries.findIndex((candidate) => candidate?.id === entry?.id) === index);
    const credits = Array.isArray(profile.credits) && profile.credits.length
      ? profile.credits
      : [
          { label: "Role", value: item.role || item.subtitle || item.type },
          { label: "Connected work", value: uniqueConnected[0]?.title },
          { label: "Medium", value: readableList(item.medium || []) },
        ];
    const notes = compactValues(profile.notes || []);

    return `
      <section class="detail-grid artist-profile-grid" aria-label="${esc(item.title)} artist profile">
        <article class="panel artist-profile-card artist-profile-card--lead">
          <div class="section-head">
            <p class="card__meta">Artist profile</p>
            <h2 class="card__title">${esc(profile.headline || item.subtitle || item.type || item.title)}</h2>
            <p class="lede">${esc(profile.intro || item.description || item.summary || "")}</p>
          </div>
          ${focus.length ? tagRow(focus, { limit: 8, compact: true }) : ""}
        </article>
        <article class="panel artist-profile-card">
          <p class="card__meta">Collaboration</p>
          <p class="card__copy">${esc(profile.collaboration || item.description || item.summary || "")}</p>
        </article>
        <article class="panel artist-profile-card">
          <p class="card__meta">Credits</p>
          ${metadataList(credits)}
        </article>
        <article class="panel artist-profile-card artist-profile-card--wide">
          <p class="card__meta">Connected work</p>
          ${
            uniqueConnected.length
              ? `<div class="link-row">${uniqueConnected
                  .slice(0, 6)
                  .map((entry) => `<a class="tag" href="${esc(entryHref(entry))}">${esc(entry.title)}</a>`)
                  .join("")}</div>`
              : `<p class="card__copy">No connected public work is attached yet.</p>`
          }
        </article>
        ${
          notes.length
            ? `<article class="panel artist-profile-card">
                <p class="card__meta">Notes</p>
                <ul class="detail-editorial-list">
                  ${notes.map((note) => `<li>${esc(note)}</li>`).join("")}
                </ul>
              </article>`
            : ""
        }
      </section>
    `;
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
    const ownership = item.ownership || {};

    return [
      panelShell(
        "Ownership and collaboration",
        "UnionMob is an external project. The organisation, the technical collaboration and the software ownership remain explicitly separated.",
        `<div class="stack">
          ${softPanel("Project owner", item.client || "Zarah Nkounkou", ownership.project || "")}
          ${softPanel("Electronic Artefacts", "Technological collaborator / CTO", item.role || "")}
          ${softPanel("Brand attribution", "UnionMob identity", ownership.brandDirection || item.visualAttribution || "")}
          ${softPanel("Software rights", "UMOS ownership and licence", ownership.license || "", metadataList([
            { label: "Owner", value: ownership.software || "Electronic Artefacts" },
            { label: "User", value: "UnionMob" },
          ]))}
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
        "UnionMob is the external organisation; UMOS is the operating system developed and owned by Electronic Artefacts.",
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
    return [
      projectMoodboardPanel(item),
      projectDevelopmentPanel(item),
      projectMarketingPanel(item),
      projectDossierReaderPanel(item),
      projectGalleryPanel(item),
      projectArchitecturePanel(item),
    ].filter(Boolean).join("");
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
    const commercialProfile = {
      vaste: {
        access: "Private repository review",
        engagement: "Runtime pilot / licensing / implementation",
        evaluation: ["Graph model", "Identity and permissions", "Context execution", "Projection surfaces"],
        buyerFit: ["Knowledge platforms", "Cultural infrastructure", "Product teams", "Research partners"],
      },
      forge: {
        access: "Gated prototype review",
        engagement: "Creative pipeline pilot",
        evaluation: ["Generation pipelines", "Refinement loops", "Asset structures", "Production workflows"],
        buyerFit: ["Studios", "Artists", "Media teams", "R&D partners"],
      },
      "oreth-program": {
        access: "Research repository review",
        engagement: "Audio research pilot",
        evaluation: ["Signal analysis", "Event detection", "Pattern recognition", "Adaptive learning"],
        buyerFit: ["Audio labs", "Artists", "Research groups", "Cultural partners"],
      },
      "ea-lightweight-template": {
        access: "Implementation package",
        engagement: "Template transfer / production setup",
        evaluation: ["Static surfaces", "Design system", "Content structure", "Deployment workflow"],
        buyerFit: ["Small teams", "Studios", "Cultural projects", "Independent brands"],
      },
      oraclehub: {
        access: "Architecture archive review",
        engagement: "Distributed-data advisory",
        evaluation: ["Oracle entities", "Worker pipelines", "Data contracts", "Runtime lineage"],
        buyerFit: ["Data teams", "Research partners", "Prediction systems", "Platform architects"],
      },
      arca: {
        access: "Archive review",
        engagement: "Traceability and certification advisory",
        evaluation: ["Digital assets", "Certification", "Authenticity", "Lineage"],
        buyerFit: ["Archive teams", "Cultural platforms", "Asset systems", "Collectors"],
      },
    }[item.id] || {
      access: "Scoped repository or documentation review",
      engagement: "Technical review / implementation",
      evaluation: (item.tags || []).slice(0, 4),
      buyerFit: ["Partners", "Technical teams", "Cultural projects", "Product owners"],
    };

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
          <p class="card__meta">Reading cues</p>
          <p class="card__copy">Mediums, disciplines and tags help compare this program with nearby systems.</p>
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
      <section class="detail-grid program-commercial-detail">
        <article class="panel program-detail-panel program-detail-panel--lead">
          <div class="section-head">
            <p class="card__meta">Commercial access</p>
            <h2 class="card__title">Evaluate, license or build with ${esc(item.title)}.</h2>
            <p class="card__copy">Repository access is granted case by case. The first step is a short brief that identifies the program, intended use, GitHub account and commercial context.</p>
          </div>
          ${metadataList([
            { label: "Access mode", value: commercialProfile.access },
            { label: "Engagement", value: commercialProfile.engagement },
            { label: "Maintainer", value: "Electronic Artefacts" },
          ])}
          <div class="button-row button-row--compact">
            <a class="button button--primary" href="${esc(programAccessMailto)}">Request repo access</a>
            <a class="button button--secondary" href="./contact.html">Discuss implementation</a>
          </div>
        </article>
        <article class="panel program-detail-panel">
          <p class="card__meta">What can be reviewed</p>
          <p class="card__copy">A qualified review can include code, architecture notes, setup constraints, roadmap context and licensing boundaries.</p>
          ${tagRow(commercialProfile.evaluation, { compact: true })}
        </article>
        <article class="panel program-detail-panel">
          <p class="card__meta">Best fit</p>
          <p class="card__copy">The programs are sold as technical assets, pilots or implementation foundations rather than as generic SaaS subscriptions.</p>
          ${tagRow(commercialProfile.buyerFit, { compact: true })}
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
    document.body.dataset.entryId = item.id || "";

    const primaryLinks = (item.links || []).map((link) => ({ ...link, target: link.href.startsWith("http") ? "_blank" : undefined }));
    const relatedCount = Object.values(item.relations || {}).flat().filter(Boolean).length;
    const heroMode =
      item.kind === "project"
        ? "project"
        : item.kind === "archive" || item.kind === "artefact"
          ? "archive"
          : item.kind === "person" || item.kind === "artist"
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
    const primaryLinkLimit = item.id === "vestiges" ? 2 : item.kind === "artist" ? 3 : 1;
    const heroActionLimit = item.id === "vestiges" ? 3 : item.kind === "artist" ? 3 : 2;
    const heroActions = uniqueActions([
      ...primaryLinks.slice(0, primaryLinkLimit),
      ...(item.kind === "artist" ? [{ label: "Work", href: "./work.html" }] : []),
      ...(item.kind === "project" ? [{ label: "Open Dossier", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` }] : []),
    ]).slice(0, heroActionLimit);
    const detailIntro = item.kind === "program" ? programSpecificPanels(item) : "";
    const artistIntro = item.kind === "artist" ? artistProfilePanels(item) : "";
    const specificPanels =
      item.id === "palimpsests" || item.id === "unionmob" || item.id === "vestiges"
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
        ${artistIntro}
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
      ${artistIntro}
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
          <h2>${esc(searchResultLabel(matchCount))}</h2>
          <p class="lede">${esc(isFrench() ? `${items.length} entrées synthétiques affichées. Ouvrez un élément pour consulter la page complète.` : `Showing ${items.length} concise entries. Open an item for the full page.`)}</p>
        </div>
        ${metricRail(
          [
            { label: translate("MATCHES"), value: String(matchCount), note: translate("public pages"), fill: metricFill(matchCount, totalCount), tone: "live" },
            { label: translate("SHOWN"), value: String(items.length), note: translate("current page"), fill: metricFill(items.length, Math.max(matchCount, 1)), tone: "visual" },
            { label: translate("TAGS"), value: String(tagCount), note: translate("visible labels"), fill: metricFill(tagCount, Math.max(tagCount, 1) * 2), tone: "archive" },
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
  const intentHeroStats = (items, label) => `
    <div class="intent-hero__stats" aria-label="${esc(label)}" data-depth="1.65">
      ${items.map((item) => `<span><strong>${esc(item.value)}</strong><em>${esc(item.label)}</em></span>`).join("")}
    </div>
  `;
  const homeHeroFrame = (item, className, options = {}) => {
    if (!item) return "";
    const media = cardImageFor(item);
    if (!media) return "";
    const href = entryHref(item);
    return `
      <a class="home-intent-stage__frame ${esc(className)}" href="${esc(href)}" data-depth="${esc(options.depth || 1)}" aria-label="Open ${esc(item.title)}">
        <img src="${esc(media.src)}" alt="${esc(media.alt || item.title)}" loading="${options.eager ? "eager" : "lazy"}"${options.eager ? ' fetchpriority="high"' : ""} />
        <figcaption>
          <span>${esc(options.kicker || item.category || item.type || "Project")}</span>
          <strong>${esc(item.title)}</strong>
        </figcaption>
      </a>
    `;
  };
  const renderHomeHero = () => {
    const ranked = homeProjects().filter((item) => cardImageFor(item));
    const lead = ranked[0] || entityById("vestiges");
    const system = ranked.find((item) => item.id === "unionmob") || ranked.find((item) => item.id !== lead?.id);
    const publicProof = entityById("oeil-de-meg") || ranked.find((item) => ![lead?.id, system?.id].includes(item.id));
    const distinct = [lead, system, publicProof].filter((item, index, items) => item && items.findIndex((candidate) => candidate?.id === item.id) === index);
    const latestDate = distinct
      .map((item) => item?.temporality?.lastUpdated || "")
      .filter(Boolean)
      .sort()
      .reverse()[0] || "2026";

    return `
      <section class="zone-card hero home-cinematic-hero intent-hero intent-hero--home">
        <div class="intent-hero__grid home-cinematic-hero__layout">
          <div class="hero-copy intent-hero__copy">
            <p class="eyebrow">ELECTRONIC ARTEFACTS</p>
            <h1 class="display-title">Creative systems made visible.</h1>
            <p class="lede">Electronic Artefacts is a creative technology studio for client systems, proprietary platforms and research-led cultural publishing.</p>
            <div class="button-row">
              <a class="button button--primary" href="./work.html">See selected work</a>
              <a class="button button--secondary" href="./contact.html">Start a project</a>
            </div>
            <div class="pill-cloud intent-hero__chips" aria-label="Studio practices">
              <span class="chip">Client systems</span>
              <span class="chip">Proprietary platforms</span>
              <span class="chip">Research</span>
              <span class="chip">Artistic publishing</span>
            </div>
          </div>
          <aside class="intent-hero__stage home-intent-stage" data-intent-stage aria-label="Current Electronic Artefacts projects">
            <div class="intent-hero__stage-label"><span>Now showing</span><strong>Current products and public work</strong></div>
            <div class="home-intent-stage__orbit" aria-hidden="true"></div>
            ${homeHeroFrame(lead, "home-intent-stage__frame--lead", { depth: 0.82, kicker: "Latest platform", eager: true })}
            ${homeHeroFrame(system, "home-intent-stage__frame--system", { depth: 1.35, kicker: system?.id === "unionmob" ? "External CTO partnership" : "Product system" })}
            ${homeHeroFrame(publicProof, "home-intent-stage__frame--proof", { depth: 1.62, kicker: "Live public proof" })}
            <div class="home-intent-stage__channels" data-depth="1.42" aria-label="Instagram channels">
              <a href="https://www.instagram.com/electronic.artefacts/" target="_blank" rel="noreferrer" aria-label="Open the Electronic Artefacts Instagram channel">
                <img src="./assets/media/projects/electronic-artefacts/electronic-artefacts-logo.jpg" alt="" loading="lazy" />
                <span>@electronic.artefacts</span>
              </a>
              <a href="https://www.instagram.com/creativestuff.jpg/" target="_blank" rel="noreferrer" aria-label="Open the CreativeStuff.jpg Instagram channel">
                <img src="./assets/media/projects/creativestuff/creativestuff-logo.jpg" alt="" loading="lazy" />
                <span>@creativestuff.jpg</span>
              </a>
            </div>
            ${intentHeroStats(
              [
                { value: String(distinct.length).padStart(2, "0"), label: "current spotlights" },
                { value: latestDate.slice(5).replace("-", "."), label: "latest update" },
                { value: "LIVE", label: "public surfaces" },
              ],
              "Current studio statistics",
            )}
          </aside>
        </div>
      </section>
    `;
  };
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
        copy: "Choose the path that fits your intent. Projects, research, programs and archive are different ways into the work.",
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
          copy: "Follow the notes, theoretical branches and working questions behind the work.",
          reason: "This is where the thinking behind the work becomes legible.",
          cta: "Enter Research",
          href: "./research.html",
          ariaLabel: "Enter Research",
        },
        {
          kicker: "Programs",
          title: "Software systems and engines",
          copy: "Understand the software foundations and production systems that hold the work together.",
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
    `${orientationSection({
      eyebrow: "FEATURED PATHS",
      title: "Choose what you need first.",
      copy: "Start with the path that matches your intent: technology, delivery or cultural work.",
      cards: [
        {
          kicker: "Technology",
          title: "Understand the core runtime",
          copy: "Open VASTE to understand the strategic and technical foundation behind the wider family of systems.",
          reason: "Best when architecture, scalability and the long-term platform thesis matter first.",
          cta: "Explore VASTE",
          href: "./vaste.html",
          ariaLabel: "Explore VASTE",
        },
        {
          kicker: "Delivery",
          title: "See applied work and outcomes",
          copy: "See how strategy, interface, content and implementation hold together across commissions and public products.",
          reason: "Best when you need evidence of execution under concrete constraints.",
          cta: "See Client Work",
          href: "./work.html",
          ariaLabel: "See Client Work",
        },
        {
          kicker: "Culture",
          title: "Enter through Palimpsests",
          copy: "Explore the musical and editorial space where artistic production, memory and publication meet.",
          reason: "Best when you want the cultural register before the technical system.",
          cta: "Enter Palimpsests",
          href: "./palimpsests.html",
          ariaLabel: "Enter Palimpsests",
        },
      ],
    })}${ecosystemExplorer()}`;

  const renderWorkForensics = () => {
    const workflow = [
      ["01", "Audit", "Establish the system, data, dependencies and trust boundaries."],
      ["02", "Investigation", "Map the architecture and isolate material that cannot be trusted."],
      ["03", "Forensic", "Inspect evidence without executing compromised application code."],
      ["04", "Reconstruction", "Recover verified data and rebuild on a clean foundation."],
      ["05", "Validation", "Test integrity, behaviour, security and deployment assumptions."],
      ["06", "Deployment", "Release through a documented migration and rollback plan."],
      ["07", "Supervision", "Monitor the new system and maintain its operating record."],
    ];
    const fields = [
      {
        meta: "Technical audit",
        title: "Understand the system before changing it.",
        copy: "Architecture, security, performance, dependencies, packages, modules, data flows and technical SEO are assessed as one operating system.",
        items: ["Architecture and trust boundaries", "Security and performance", "Packages, modules and dependencies", "Data integrity and technical SEO"],
      },
      {
        meta: "Digital investigation",
        title: "Determine what happened and what can be trusted.",
        copy: "Suspicious files and data are inspected in isolation. Evidence is preserved while indicators, backdoors, shells and malicious server-side code are investigated.",
        items: ["IOC and persistence research", "Backdoor and shell detection", "Server-side malware analysis", "Evidence inventory and preservation"],
      },
      {
        meta: "Clean reconstruction",
        title: "Rebuild without carrying the compromise forward.",
        copy: "A platform can be recovered from a snapshot, partial backup, database export or compromised server without treating untrusted code as a production dependency.",
        items: ["Controlled content recovery", "Progressive build candidates", "Clean-room implementation", "Documented validation gates"],
      },
      {
        meta: "Recovery engineering",
        title: "Turn incident response into durable architecture.",
        copy: "The replacement system reduces hidden dependencies and introduces reproducible environments, automated checks, explicit ownership and a tested rollback path.",
        items: ["Reproducible environments", "Automated validation", "Deployment and rollback", "Documentation and supervision"],
      },
    ];

    return `
      <section class="zone-card hero forensic-offer" id="forensic-web">
        <div class="section-head">
          <p class="eyebrow">FORENSIC WEB &amp; SYSTEM RECOVERY</p>
          <h2>When an existing web system can no longer be trusted.</h2>
          <p class="lede">Electronic Artefacts investigates compromised, undocumented or structurally fragile web systems, preserves the useful evidence and reconstructs a clean production path. The method applies to CMS platforms, custom applications, hosting estates, databases and incomplete backups.</p>
        </div>

        <div class="forensic-offer__scope">
          <article class="panel panel--soft">
            <p class="card__meta">What changes</p>
            <h3 class="card__title">From emergency repair to controlled engineering.</h3>
            <p class="card__copy">The objective is not to make a compromised system appear functional again. It is to establish what can be trusted, recover what has value and produce a maintainable system with a documented chain of decisions.</p>
            ${tagRow(["Architecture", "Reliability", "Security", "Documentation", "Reproducibility"], { compact: true })}
          </article>
          <article class="panel panel--soft">
            <p class="card__meta">Intervention scope</p>
            <h3 class="card__title">CMS, custom applications and hosting systems.</h3>
            <p class="card__copy">The investigation starts from the available evidence: server snapshot, partial backup, database export, source repository or live infrastructure. The technology determines the tooling, not the method.</p>
            ${tagRow(["CMS", "Custom applications", "Servers", "Databases", "Backups"], { compact: true })}
          </article>
        </div>

        <div class="work-services__grid forensic-offer__fields">
          ${fields.map((field, index) => `
            <article class="work-service-card">
              <div class="work-service-card__top"><span>${String(index + 1).padStart(2, "0")}</span><p class="card__meta">${esc(field.meta)}</p></div>
              <h3>${esc(field.title)}</h3>
              <p>${esc(field.copy)}</p>
              <ul>${field.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
            </article>
          `).join("")}
        </div>

        <div class="section-head forensic-offer__workflow-head">
          <p class="eyebrow">DOCUMENTED WORKFLOW</p>
          <h2>Audit → Supervision.</h2>
          <p class="lede">Every stage produces an explicit record, a validation point and a usable input for the next decision.</p>
        </div>
        <ol class="forensic-workflow" aria-label="Forensic web reconstruction workflow">
          ${workflow.map(([number, title, copy]) => `
            <li><span>${number}</span><strong>${esc(title)}</strong><p>${esc(copy)}</p></li>
          `).join("")}
        </ol>
      </section>
    `;
  };

  const renderWorkCapabilities = () => {
    const capabilities = [
      {
        mark: "STR",
        kicker: "Direction",
        title: "Strategy and product framing",
        copy: "Clarify the opportunity, the audience, the constraints and the sequence of decisions before time and budget are committed.",
        tools: ["Research", "Workshops", "Notion", "Figma"],
        outputs: ["Positioning", "Brief", "Roadmap"],
        x: 20,
        y: 18,
        size: "7.6rem",
        rgb: "234, 220, 207",
      },
      {
        mark: "ID",
        kicker: "Identity",
        title: "Brand systems and art direction",
        copy: "Design identity as a working system: marks, typography, image direction and motion rules that survive beyond the launch window.",
        tools: ["Illustrator", "Photoshop", "InDesign", "Figma"],
        outputs: ["Identity", "Art direction", "Brand kit"],
        x: 42,
        y: 12,
        size: "8rem",
        rgb: "244, 114, 182",
      },
      {
        mark: "ED",
        kicker: "Narrative",
        title: "Editorial and content architecture",
        copy: "Organise messages, stories and knowledge so a complex subject becomes clear without collapsing into generic marketing language.",
        tools: ["Content models", "Taxonomy", "Writing", "CMS"],
        outputs: ["Narrative", "Information model", "Editorial system"],
        x: 68,
        y: 17,
        size: "7.8rem",
        rgb: "251, 191, 36",
      },
      {
        mark: "UX",
        kicker: "Experience",
        title: "UX, UI and interaction",
        copy: "Shape interfaces around real tasks, responsive constraints and a visual hierarchy that makes the next action obvious.",
        tools: ["Figma", "Accessibility", "Prototypes", "Testing"],
        outputs: ["User flows", "Interface", "Interaction model"],
        x: 16,
        y: 58,
        size: "7.2rem",
        rgb: "56, 189, 248",
      },
      {
        mark: "PRD",
        kicker: "Product",
        title: "Digital product design",
        copy: "Connect user needs, business rules and content structures into products that remain understandable as scope grows.",
        tools: ["Discovery", "User flows", "Figma", "Prototyping"],
        outputs: ["Product model", "Prototype", "Design system"],
        x: 38,
        y: 47,
        size: "7.9rem",
        rgb: "45, 212, 191",
      },
      {
        mark: "WEB",
        kicker: "Engineering",
        title: "Web development and delivery",
        copy: "Implement the public surface, not only the mock-up: responsive front ends, content systems, APIs, deployment and measurable performance.",
        tools: ["JavaScript", "TypeScript", "PHP", "WordPress"],
        outputs: ["Front end", "CMS", "Production site"],
        x: 66,
        y: 49,
        size: "7.6rem",
        rgb: "96, 165, 250",
      },
      {
        mark: "SYS",
        kicker: "Systems",
        title: "Platforms and technical architecture",
        copy: "Design data models, workflows, services and maintainable architectures when the work exceeds a single website.",
        tools: ["Node.js", "Python", "Rust", "GitHub"],
        outputs: ["Architecture", "Platform", "Workflow"],
        x: 87,
        y: 61,
        size: "8rem",
        rgb: "74, 222, 128",
      },
      {
        mark: "AI",
        kicker: "Augmentation",
        title: "AI, automation and knowledge systems",
        copy: "Prototype workflows, assistants and knowledge structures when automation should create leverage without obscuring authorship or control.",
        tools: ["OpenAI", "Python", "APIs", "Custom tooling"],
        outputs: ["Prototype", "Automation", "Knowledge system"],
        x: 59,
        y: 82,
        size: "7.9rem",
        rgb: "34, 211, 238",
      },
    ];
    const active = capabilities[0];
    const capabilityButtons = capabilities
      .map(
        (capability, index) => `
          <button
            class="capability-node${index === 0 ? " is-active" : ""}"
            type="button"
            style="--cap-x:${capability.x}%;--cap-y:${capability.y}%;--cap-size:${capability.size};--cap-rgb:${capability.rgb}"
            data-capability-node
            data-capability-kicker="${esc(capability.kicker)}"
            data-capability-title="${esc(capability.title)}"
            data-capability-copy="${esc(capability.copy)}"
            data-capability-tools="${esc(capability.tools.join("|"))}"
            data-capability-outputs="${esc(capability.outputs.join("|"))}"
            aria-pressed="${index === 0 ? "true" : "false"}"
          >
            <span class="capability-node__mark" aria-hidden="true">${esc(capability.mark)}</span>
            <strong>${esc(capability.title)}</strong>
          </button>
        `,
      )
      .join("");

    return `
      <section class="zone-card hero work-capabilities" id="capabilities">
        <div class="work-capabilities__intro">
          <div class="section-head">
            <p class="eyebrow">CREATIVE CAPABILITIES</p>
            <h2>Choose the capability you need first.</h2>
          </div>
          <p class="lede">Electronic Artefacts brings direction, design, technology and cultural production into one system. Start from the part of the brief that needs the most clarity, then expand only when the work needs it.</p>
        </div>

        <div class="capability-experience" data-capability-map>
          <aside class="capability-reader" aria-live="polite" aria-atomic="true">
            <div class="capability-reader__index">
              <span data-capability-reader-kicker>${esc(active.kicker)}</span>
              <span>EA / capability selector</span>
            </div>
            <div class="capability-reader__copy">
              <h3 data-capability-reader-title>${esc(active.title)}</h3>
              <p data-capability-reader-copy>${esc(active.copy)}</p>
            </div>
            <div class="capability-reader__group">
              <span>Typical tools</span>
              <div class="capability-reader__tokens" data-capability-reader-tools>
                ${active.tools.map((tool) => `<span>${esc(tool)}</span>`).join("")}
              </div>
            </div>
            <div class="capability-reader__group">
              <span>What it produces</span>
              <div class="capability-reader__tokens capability-reader__tokens--strong" data-capability-reader-outputs>
                ${active.outputs.map((output) => `<span>${esc(output)}</span>`).join("")}
              </div>
            </div>
            <p class="capability-reader__prompt">Pick a capability to see the typical tools and outputs.</p>
          </aside>

          <div class="capability-map" aria-label="Interactive map of Electronic Artefacts capabilities">
            <div class="capability-map__core" aria-hidden="true">
              <span>Electronic</span>
              <strong>Artefacts</strong>
              <small>Direction · Design<br />Technology · Culture</small>
            </div>
            ${capabilityButtons}
          </div>
        </div>

        <div class="capability-outcomes" aria-label="What the combined practice can produce">
          ${[
            ["Brands and campaigns", "Identity, editorial direction, original imagery, content systems and launch surfaces."],
            ["Products and platforms", "Research, product framing, UX, interface, engineering and operational workflows."],
            ["Worlds and experiences", "Narrative, sound, image direction, 3D environments and interactive systems."],
            ["Knowledge and automation", "Taxonomies, archives, publishing tools, AI workflows and custom technical infrastructure."],
          ]
            .map(
              ([title, copy], index) => `
                <article>
                  <span>0${index + 1}</span>
                  <h3>${esc(title)}</h3>
                  <p>${esc(copy)}</p>
                </article>
              `,
            )
            .join("")}
        </div>

        <div class="work-capabilities__closing">
          <p>Capabilities are combined around the problem, then carried through to a live, documented or reproducible result.</p>
          <a class="button button--secondary" href="./contact.html">Describe the brief</a>
        </div>
      </section>
    `;
  };

  const renderWorkServices = () => {
    const serviceGroups = [
      {
        meta: "Consulting",
        title: "Strategy, diagnosis and decision support",
        copy:
          "Clarify what is blocked, what matters, what should be built, and what should be stopped before time and budget are spent in the wrong direction.",
        services: [
          "Discovery and strategic framing",
          "Product, brand and platform diagnosis",
          "Business, audience and offer analysis",
          "Technical and operational due diligence",
          "Roadmaps, prioritisation and decision memos",
          "Stakeholder workshops and advisory sessions",
        ],
      },
      {
        meta: "Growth",
        title: "Marketing, SEO and visibility systems",
        copy:
          "Connect positioning, content, technical SEO and analytics so the public surface can be found, understood and improved over time.",
        services: [
          "SEO audits and technical SEO fixes",
          "Content strategy and search intent mapping",
          "Metadata, schema, sitemaps and indexability",
          "Landing pages, funnels and campaign structure",
          "Analytics setup, dashboards and measurement plans",
          "Marketing diagnostics and conversion improvements",
        ],
      },
      {
        meta: "Brand",
        title: "Branding, communication and art direction",
        copy:
          "Give the project a recognisable voice, visual system and editorial logic that can hold across website, product, deck, social and internal material.",
        services: [
          "Positioning, naming and messaging",
          "Visual identity and brand systems",
          "Art direction and image direction",
          "Editorial guidelines and copywriting",
          "Pitch decks, presentations and sales material",
          "Communication architecture and launch narratives",
        ],
      },
      {
        meta: "Product",
        title: "UX, UI and digital product design",
        copy:
          "Turn a complex service, tool or content system into a usable product with clear flows, states, components and responsive interface rules.",
        services: [
          "User journeys and information architecture",
          "Wireframes, prototypes and design systems",
          "Interface design for web apps and tools",
          "Accessibility and responsive UX reviews",
          "Content models, taxonomies and CMS structures",
          "Usability debugging and interface simplification",
        ],
      },
      {
        meta: "Build",
        title: "Development, architecture and implementation",
        copy:
          "Move from strategy to working software: front ends, back ends, content pipelines, APIs, deployment and maintainable systems.",
        services: [
          "Static sites, landing pages and web applications",
          "Front-end development and interaction systems",
          "CMS, data models and publishing workflows",
          "APIs, integrations and automation scripts",
          "Performance, security and reliability hardening",
          "Debugging, refactoring and production recovery",
        ],
      },
      {
        meta: "R&D",
        title: "Research, automation and knowledge systems",
        copy:
          "Prototype the less standard work: AI workflows, archives, internal tools and custom systems that connect content, people and process.",
        services: [
          "R&D scoping and technical prototypes",
          "AI assistants, workflows and tool integrations",
          "Knowledge systems, archives and semantic models",
          "Custom dashboards and internal operating tools",
          "Data cleanup, enrichment and migration",
          "Documentation, handoff and team enablement",
        ],
      },
    ];

    return `
      <section class="zone-card hero work-services" id="services">
        <div class="section-head">
          <p class="eyebrow">SERVICE FIELD</p>
          <h2>Consulting, creative direction and implementation under one roof.</h2>
          <p class="lede">Electronic Artefacts can enter at diagnosis, strategy, design, build, recovery or R&D level. The work can stay advisory, become a focused audit, or move all the way into production.</p>
        </div>
        <div class="work-services__grid">
          ${serviceGroups
            .map(
              (group, index) => `
                <article class="work-service-card">
                  <div class="work-service-card__top">
                    <span>${String(index + 1).padStart(2, "0")}</span>
                    <p class="card__meta">${esc(group.meta)}</p>
                  </div>
                  <h3>${esc(group.title)}</h3>
                  <p>${esc(group.copy)}</p>
                  <ul>
                    ${group.services.map((service) => `<li>${esc(service)}</li>`).join("")}
                  </ul>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="work-services__scope">
          <article>
            <p class="card__meta">Typical entry points</p>
            <strong>Audit, consulting, diagnostic, build, R&D, recovery.</strong>
          </article>
          <article>
            <p class="card__meta">Useful when</p>
            <strong>The problem crosses marketing, design, technology and operations.</strong>
          </article>
          <article>
            <p class="card__meta">Output</p>
            <strong>Clear decisions, working artefacts, implementation and documentation.</strong>
          </article>
        </div>
      </section>
    `;
  };

  const renderWorkOffer = () => `
    <section class="zone-card hero work-offer">
      <div class="section-head">
        <p class="eyebrow">ENGAGEMENTS</p>
        <h2>Three ways to work together.</h2>
        <p class="lede">The format follows the problem. Each engagement produces explicit decisions, working artefacts and a clear next phase before scope or budget is locked.</p>
      </div>
      <div class="card-grid card-grid--three">
        ${[
          {
            meta: "Direction",
            title: "Product and system framing",
            copy: "Clarify the proposition, users, information model, constraints and technical direction before committing to a large build.",
            outputs: ["Brief", "Architecture", "Roadmap"],
            fit: "Best for new products, repositioning and ambiguous systems.",
            timeline: "Typical start: discovery sprint",
          },
          {
            meta: "Delivery",
            title: "Design and implementation",
            copy: "Turn an existing direction into a coherent public product across content structure, UX, interface and development.",
            outputs: ["UX / UI", "Prototype", "Production"],
            fit: "Best for public surfaces, product MVPs and client platforms.",
            timeline: "Typical start: scoped build",
          },
          {
            meta: "Evolution",
            title: "Platform and workflow redesign",
            copy: "Rework a fragmented site or operating process into a maintainable system with clearer ownership and reusable components.",
            outputs: ["Audit", "Refactor", "Documentation"],
            fit: "Best for existing tools, content systems and operational workflows.",
            timeline: "Typical start: audit and recovery map",
          },
        ]
          .map(
            (offer) => `
              <article class="panel panel--soft">
                <p class="card__meta">${offer.meta}</p>
                <h3 class="card__title">${offer.title}</h3>
                <p class="card__copy">${offer.copy}</p>
                <p class="card__copy"><strong>${offer.timeline}</strong></p>
                <p class="card__copy">${offer.fit}</p>
                ${tagRow(offer.outputs, { compact: true })}
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="stat-grid work-qualification">
        <article class="stat-card">
          <p class="card__meta">Qualification</p>
          <strong>Problem first</strong>
          <span>Timing, budget and constraints are captured in the contact brief before a proposal is shaped.</span>
        </article>
        <article class="stat-card">
          <p class="card__meta">Evidence</p>
          <strong>Live or documented</strong>
          <span>Case pages show public screens, operational views, dossiers, media and performance evidence when available.</span>
        </article>
        <article class="stat-card">
          <p class="card__meta">Handoff</p>
          <strong>Reusable system</strong>
          <span>The expected output is a maintained surface, workflow, repository or documented decision, not a loose visual concept.</span>
        </article>
      </div>
      <div class="button-row">
        <a class="button button--primary" href="./contact.html">Discuss the right starting point</a>
        <a class="button button--secondary" href="#work-evidence">Review evidence</a>
      </div>
    </section>
  `;
  const renderPrograms = () => {
    const vaste = entityById("vaste");
    const forge = entityById("forge");
    const orethProgram = entityById("oreth-program");
    const lightweightTemplate = entityById("ea-lightweight-template");
    const arca = entityById("arca");
    const voidEntry = entityById("void");
    const oraclehub = entityById("oraclehub");
    const linkAttrs = (href = "") => href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
    const programRoute = (item) => catalog.routeFor?.(item) || `./program.html?id=${encodeURIComponent(item.id)}`;

    const registryCard = (item, options = {}) => {
      if (!item) return "";
      const techItems = (options.tech || []).map((value) => String(value)).filter(Boolean);
      const classificationItems = (options.classification || []).map((value) => String(value)).filter(Boolean);
      const deliverables = (options.deliverables || []).map((value) => String(value)).filter(Boolean);
      const recordHref = options.href || programRoute(item);
      const accessHref = options.accessHref || programAccessMailto;
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
              <span>Package</span>
              <strong>${esc(options.package || options.lineage || (item.relations?.origin || []).slice(0, 1).join(" / ") || "Electronic Artefacts")}</strong>
            </div>
            <div class="program-registry-card__fact">
              <span>Access</span>
              <strong>${esc(options.access || "Request-based review")}</strong>
            </div>
            <div class="program-registry-card__fact">
              <span>Buyer fit</span>
              <strong>${esc(options.buyerFit || item.domain || "Technical partners")}</strong>
            </div>
          </div>
          ${deliverables.length ? `<ul class="program-offer-card__list">${deliverables.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ul>` : ""}
          ${classificationItems.length ? `<div class="tag-cluster tag-cluster--compact program-registry-card__chips">${classificationItems.map((entry) => chip(entry)).join("")}</div>` : ""}
          <div class="link-row">
            <a class="tag" href="${esc(recordHref)}"${linkAttrs(recordHref)}>View program</a>
            <a class="tag" href="${esc(accessHref)}">Request repo access</a>
            ${options.official ? `<a class="tag" href="${esc(options.official)}" target="_blank" rel="noreferrer">Official site</a>` : ""}
          </div>
        </article>
      `;
    };

    const registryCards = [
      registryCard(vaste, {
        title: "VASTE",
        kicker: "PROGRAM",
        statusLabel: "Active Research",
        technology: "TypeScript / graph runtime",
        role: "Core proprietary runtime",
        package: "Runtime foundation",
        access: "Private repository review",
        buyerFit: "Knowledge and product platforms",
        classification: ["Runtime", "Knowledge Graph", "Identity", "Licensing"],
        deliverables: ["Architecture map", "Repository walkthrough", "Pilot scope", "Licensing discussion"],
        copy:
          "VASTE is sold as the core runtime foundation for graph architectures, contextual execution, identity systems and modular knowledge products.",
        official: "https://www.vaste.space/",
        href: catalog.routeFor?.(vaste) || "./programs/vaste/",
      }),
      registryCard(forge, {
        title: "FORGE",
        kicker: "PROGRAM",
        statusLabel: "Active Research",
        technology: "Rust / production pipelines",
        role: "Creative production system",
        package: "Generation and refinement pilot",
        access: "Gated prototype review",
        buyerFit: "Studios and R&D teams",
        classification: ["Pipelines", "Artefact Generation", "Creative Technology", "Pilot"],
        deliverables: ["Pipeline audit", "Prototype review", "Output families", "Integration plan"],
        copy:
          "Forge packages artefact creation, transformation and refinement as an evaluable production system for media, 3D and future output families.",
      }),
      registryCard(orethProgram, {
        title: "ORETH",
        kicker: "PROGRAM",
        statusLabel: "Prototype",
        technology: "Python / audio analysis",
        role: "Audio intelligence research",
        package: "Research prototype",
        access: "Research repository review",
        buyerFit: "Audio, culture and research partners",
        classification: ["Signal Processing", "Audio Intelligence", "Pattern Recognition", "Prototype"],
        deliverables: ["Prototype orientation", "Analysis stack", "Research constraints", "Pilot questions"],
        copy:
          "ORETH packages audio analysis, event detection and adaptive-learning experiments for partners exploring sonic systems and cultural research.",
      }),
      registryCard(lightweightTemplate, {
        title: "EA Lightweight Template",
        kicker: "FRAMEWORK",
        statusLabel: "Production",
        technology: "HTML / CSS / JavaScript",
        role: "Public-surface starter",
        package: "Template transfer",
        access: "Repo transfer or implementation",
        buyerFit: "Small teams and cultural projects",
        classification: ["Vanilla Web", "Static Surface", "Fast Prototype", "Implementation"],
        deliverables: ["Repository access", "Design tokens", "Component patterns", "Deployment checklist"],
        copy:
          "The lightweight template is the practical production base for fast public showcases, small product surfaces and low-maintenance sites.",
      }),
      registryCard(voidEntry, {
        title: "VOID",
        kicker: "RESEARCH FIELD",
        statusLabel: "Archived",
        technology: "Rust",
        role: "Experimental Software Engine",
        package: "Architecture archive",
        access: "Documentation review",
        buyerFit: "Research and systems partners",
        classification: ["Experimental Engine", "Archived System", "Creative Concept", "Lineage"],
        deliverables: ["Concept archive", "Architecture lineage", "Reusable decisions"],
        copy:
          "VOID was one of the earliest software research projects developed within Electronic Artefacts. Originally conceived as an experimental engine, the project shaped later reflections around systems architecture, modularity and creative technology.",
        href: "./entity.html?id=void",
      }),
      registryCard(oraclehub, {
        title: "OracleHub",
        kicker: "PROGRAM",
        statusLabel: "Research Archive",
        technology: "Python / PostgreSQL / Redis / Docker",
        role: "Distributed Oracle System",
        package: "Distributed-data archive",
        access: "Case-by-case architecture review",
        buyerFit: "Data and prediction systems",
        classification: ["Prediction System", "Data Processing", "Workers", "Archive"],
        deliverables: ["Worker model", "Data contracts", "System lineage", "Advisory scope"],
        copy:
          "OracleHub explored distributed prediction architectures through specialized oracle entities, asynchronous workers and dynamic data pipelines. Many concepts later reappeared in more generalized forms inside VASTE.",
      }),
      registryCard(arca, {
        title: "ARCA",
        kicker: "ARCHIVE",
        statusLabel: "Archived",
        technology: "Asset systems / certification",
        role: "VASTE ancestor",
        package: "Traceability archive",
        access: "Documentation and lineage review",
        buyerFit: "Asset, archive and authenticity systems",
        classification: ["Digital Assets", "Traceability", "Authenticity", "Lineage"],
        deliverables: ["Origin decisions", "Certification model", "Asset-flow notes"],
        copy:
          "ARCA preserves the asset, traceability and certification lineage that later moved into the broader VASTE runtime questions.",
      }),
    ].join("");

    const commercialPaths = [
      {
        kicker: "Repository access",
        title: "Review the actual program.",
        copy: "For qualified technical conversations, access can include private repositories, architecture notes, setup constraints and roadmap context.",
        includes: ["GitHub invite", "Repository walkthrough", "Architecture map", "License boundaries"],
        cta: "Request repo access",
        href: programAccessMailto,
      },
      {
        kicker: "Technical pilot",
        title: "Test a focused use case.",
        copy: "A pilot turns one program into a contained implementation with agreed inputs, outputs, validation criteria and a clear decision point.",
        includes: ["Pilot brief", "Integration scope", "Success criteria", "Delivery review"],
        cta: "Discuss a pilot",
        href: "./contact.html",
      },
      {
        kicker: "Implementation",
        title: "Adapt the program to production.",
        copy: "Programs can be used as implementation foundations for public systems, internal tools, cultural platforms and knowledge products.",
        includes: ["Product framing", "Technical build", "Documentation", "Operational handoff"],
        cta: "Start implementation",
        href: "./contact.html",
      },
      {
        kicker: "Licensing",
        title: "Use program logic in your own context.",
        copy: "For longer partnerships, the conversation can move toward licensing, white-label use, dedicated modules or shared product development.",
        includes: ["Rights perimeter", "Support model", "Roadmap alignment", "Partnership terms"],
        cta: "Open licensing discussion",
        href: "./contact.html",
      },
    ];

    const accessSteps = [
      {
        title: "Qualify the program",
        copy: "Name the program, use case, organization, technical lead and expected access window.",
      },
      {
        title: "Scope the review",
        copy: "Define whether you need repository access, documentation, a demo, advisory work, a pilot or a license conversation.",
      },
      {
        title: "Grant the right access",
        copy: "Access is scoped through GitHub, shared documents or a guided technical session depending on maturity and confidentiality.",
      },
      {
        title: "Decide the engagement",
        copy: "The review ends with a clear next step: no fit, paid pilot, implementation scope, licensing track or partnership roadmap.",
      },
    ];

    const accessChecklist = [
      "Target program",
      "GitHub username",
      "Organization",
      "Intended use",
      "Commercial context",
      "Access window",
      "NDA constraints",
      "License expectations",
    ];

    const relationshipColumns = [
      {
        title: "VASTE",
        role: "Runtime, identity and knowledge infrastructure",
        copy: "The core program coordinates identity, permissions, context and long-lived knowledge structures.",
        nodes: ["Knowledge Systems", "Identity Systems", "Simulation Systems", "Runtime Research"],
        exchanges: ["Powers Vestiges", "Frames repository access", "Feeds implementation work"],
        href: "https://www.vaste.space/",
        linkLabel: "Explore VASTE",
      },
      {
        title: "FORGE",
        role: "Artefact production and transformation",
        copy: "Forge turns production research into pipelines that can generate, inherit, evaluate and refine families of digital artefacts.",
        nodes: ["Artifact Pipelines", "Genome Systems", "Automated Refinement", "Creative Production Research"],
        exchanges: ["Consumes runtime context", "Produces artefacts", "Returns pilot evidence"],
        href: "./program.html?id=forge",
        linkLabel: "Open Forge",
      },
      {
        title: "EA Template",
        role: "Fast public-surface implementation",
        copy: "The lightweight template packages the site system used for small production surfaces, public showcases and low-maintenance delivery.",
        nodes: ["Static Interfaces", "Design Tokens", "Component Patterns", "Deployment Workflow"],
        exchanges: ["Receives product requirements", "Ships public surfaces", "Returns delivery constraints"],
        href: "./program.html?id=ea-lightweight-template",
        linkLabel: "Open template",
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
      {
        title: "TypeScript",
        mark: "TS",
        role: "Runtimes, interfaces and connected product systems",
        copy: "Used where shared models, connected data, interactive product surfaces and repository-level contracts need to evolve together.",
        strengths: ["Typed models", "Web runtime", "Shared contracts"],
        systems: [
          { label: "VASTE", href: "https://www.vaste.space/" },
          { label: "UnionMob", href: "./project.html?id=unionmob" },
        ],
      },
      {
        title: "Rust",
        mark: "RS",
        role: "Performance-sensitive production and pipeline research",
        copy: "Used for experiments where execution control, reliability and scalable transformation pipelines are central.",
        strengths: ["Performance", "Memory safety", "Pipeline control"],
        systems: [
          { label: "Forge", href: "./program.html?id=forge" },
          { label: "VOID archive", href: "./entity.html?id=void" },
        ],
      },
      {
        title: "Vanilla Web",
        mark: "WEB",
        role: "Transferable public surfaces and fast delivery",
        copy: "Used for public program pages, small product surfaces and implementation packages that should stay inspectable and portable.",
        strengths: ["Low maintenance", "Portable code", "Fast deployment"],
        systems: [
          { label: "EA Template", href: "./program.html?id=ea-lightweight-template" },
          { label: "Electronic Artefacts", href: "./projects.html" },
        ],
      },
      {
        title: "Python",
        mark: "PY",
        role: "Data processing, analysis and asynchronous research",
        copy: "Used for specialised workers, data pipelines, experimental analysis and rapid technical investigation.",
        strengths: ["Data tooling", "Async workers", "Rapid research"],
        systems: [
          { label: "OracleHub", href: "./program.html?id=oraclehub" },
          { label: "Audio analysis", href: "./research.html" },
        ],
      },
    ];

    const selectionGuide = [
      {
        title: "Need a runtime",
        copy: "Start with VASTE when the problem is identity, permissions, contextual execution or knowledge infrastructure.",
      },
      {
        title: "Need production pipelines",
        copy: "Start with Forge when the problem is repeated creation, transformation, refinement or generation of digital artefacts.",
      },
      {
        title: "Need a public surface",
        copy: "Start with the lightweight template when the goal is to ship a precise site, catalogue, showcase or knowledge interface fast.",
      },
      {
        title: "Need lineage or advisory",
        copy: "Start with ARCA, VOID or OracleHub when the value is architecture history, traceability, distributed data or research precedent.",
      },
    ];

    return `
      <section class="zone-card hero programs-hero program-commercial-hero intent-hero intent-hero--programs">
        <div class="program-commercial-hero__grid intent-hero__grid">
          <div class="section-head intent-hero__copy">
            <p class="eyebrow">PROGRAMS</p>
            <h1 class="display-title">Programs for repo access, pilots and licensing.</h1>
            <p class="lede">Electronic Artefacts programs are packaged technical systems. They can be evaluated through repository access, scoped pilots, implementation work or licensing conversations.</p>
            <div class="button-row button-row--compact">
              <a class="button button--primary" href="${esc(programAccessMailto)}">Request repo access</a>
              <a class="button button--secondary" href="./contact.html">Discuss a program</a>
              <a class="button button--secondary" href="https://www.vaste.space/" target="_blank" rel="noreferrer">Explore VASTE</a>
            </div>
            <div class="pill-cloud intent-hero__chips" aria-label="Program access formats">
              <span class="chip">Repository access</span>
              <span class="chip">Pilot</span>
              <span class="chip">Implementation</span>
              <span class="chip">Licensing</span>
            </div>
          </div>
          <div class="intent-hero__stage intent-hero__stage--programs" data-intent-stage>
            ${computationFieldMarkup("hero")}
            ${intentHeroStats(
              [
                { value: "04", label: "access formats" },
                { value: "VASTE", label: "runtime core" },
                { value: "BUILD", label: "delivery path" },
              ],
              "Program statistics",
            )}
          </div>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">COMMERCIAL ACCESS</p>
          <h2>How programs are sold.</h2>
          <p class="lede">The offer is not a generic download. Each access path has a different level of code exposure, technical support, implementation responsibility and rights discussion.</p>
        </div>
        <div class="card-grid card-grid--two">
          ${commercialPaths
            .map(
              (offer, index) => `
                <article class="panel panel--soft program-offer-card">
                  <p class="card__meta">0${index + 1} / ${esc(offer.kicker)}</p>
                  <h3 class="card__title">${esc(offer.title)}</h3>
                  <p class="card__copy">${esc(offer.copy)}</p>
                  <ul class="program-offer-card__list">
                    ${offer.includes.map((entry) => `<li>${esc(entry)}</li>`).join("")}
                  </ul>
                  <div class="link-row">
                    <a class="tag" href="${esc(offer.href)}">${esc(offer.cta)}</a>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">PROGRAM CATALOG</p>
          <h2>Available program packages.</h2>
          <p class="lede">Each card states what the program is, what can be evaluated, what kind of access is realistic and who it is for.</p>
        </div>
        <div class="card-grid card-grid--two">
          ${registryCards}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">REQUEST WORKFLOW</p>
          <h2>Repository access is qualified, not automatic.</h2>
          <p class="lede">A useful request contains enough information to decide which code, docs or technical session should be opened first.</p>
        </div>
        <div class="program-access-layout">
          <article class="panel program-access-card">
            <p class="card__meta">Request checklist</p>
            <h3 class="card__title">Include these details.</h3>
            <div class="tag-cluster tag-cluster--compact">
              ${accessChecklist.map((item) => chip(item)).join("")}
            </div>
            <div class="button-row button-row--compact">
              <a class="button button--primary" href="${esc(programAccessMailto)}">Request repo access</a>
            </div>
          </article>
          <div class="program-access-steps">
            ${accessSteps
            .map(
              (step, index) => `
                <article class="panel panel--soft program-access-step">
                  <p class="card__meta">0${index + 1}</p>
                  <h3 class="card__title">${esc(step.title)}</h3>
                  <p class="card__copy">${esc(step.copy)}</p>
                </article>
              `,
            )
            .join("")}
          </div>
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">SYSTEM MAP</p>
          <h2>How the programs exchange responsibilities.</h2>
          <p class="lede">The stack is not a list of interchangeable tools. Each program owns a problem class and becomes saleable when that problem matches a buyer context.</p>
        </div>
        <div class="program-stack-flow" aria-label="Program exchange flow">
          <span>Qualified request</span>
          <i aria-hidden="true">→</i>
          <span>Repository review</span>
          <i aria-hidden="true">→</i>
          <span>Pilot or license</span>
          <i aria-hidden="true">→</i>
          <span>Implementation</span>
        </div>
        <div class="program-stack-map">
          <div class="program-stack-map__core">
            <p class="card__meta">Shared context</p>
            <strong>Electronic Artefacts</strong>
            <span>Research, programs, projects and archive stay connected so code access can be explained through evidence and lineage.</span>
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
                        <a class="tag" href="${esc(column.href)}"${linkAttrs(column.href)}>${esc(column.linkLabel)}</a>
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
          <h2>Languages are selected by system responsibility.</h2>
          <p class="lede">The stack is intentionally polyglot. Each language is attached to a class of constraints: interactive products, high-control pipelines, operational publishing or data-intensive research.</p>
        </div>
        <div class="technology-register">
          ${technologyMap
            .map(
              (technology, index) => `
                <details class="technology-card"${index === 0 ? " open" : ""}>
                  <summary>
                    <span class="technology-card__mark">${esc(technology.mark)}</span>
                    <span class="technology-card__identity">
                      <strong>${esc(technology.title)}</strong>
                      <small>${esc(technology.role)}</small>
                    </span>
                    <span class="technology-card__toggle" aria-hidden="true">+</span>
                  </summary>
                  <div class="technology-card__body">
                    <p>${esc(technology.copy)}</p>
                    <div class="technology-card__meta">
                      <div>
                        <span class="card__meta">Why it fits</span>
                        <div class="tag-cluster tag-cluster--compact">
                          ${technology.strengths.map((strength) => chip(strength)).join("")}
                        </div>
                      </div>
                      <div>
                        <span class="card__meta">Used in</span>
                        <div class="link-row">
                          ${technology.systems
                            .map(
                              (system) =>
                                `<a class="tag" href="${esc(system.href)}"${linkAttrs(system.href)}>${esc(system.label)}</a>`,
                            )
                            .join("")}
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">SELECTION GUIDE</p>
          <h2>Choose the right program first.</h2>
          <p class="lede">A good conversation starts with the problem class. The repository or pilot only matters once the right program is identified.</p>
        </div>
        <div class="stat-grid">
          ${selectionGuide
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
    const publicProjectCount = (catalog.projects || []).filter((item) => item.visibility !== "internal" && item.visibility !== "restricted").length;
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
        label: "External Partnership",
        copy: "Independent initiatives owned outside Electronic Artefacts, with the studio contributing a defined technical or strategic role.",
        items: [entityById("unionmob")].filter(Boolean),
      },
      {
        label: "Applied Surfaces",
        copy: "Public and client-facing systems. Open these when you want concrete UX, interface and delivery evidence.",
        items: [
          entityById("atypikhouse"),
          entityById("oeil-de-meg"),
        ].filter(Boolean),
      },
    ].filter((group) => group.items.length);
    const indexedGroups = grouped.map((group, index) => {
      const key = slugify(group.label) || `group-${index + 1}`;
      const categories = [
        ...new Set(group.items.map((item) => item.category || item.type || item.kind).filter(Boolean)),
      ];
      return {
        ...group,
        key,
        index,
        categories,
        primary: group.items[0]?.title || group.label,
      };
    });

    return `
      <section class="zone-card hero projects-hero intent-hero intent-hero--projects">
        <div class="projects-hero__grid intent-hero__grid">
          <div class="section-head intent-hero__copy">
            <p class="eyebrow">PROJECTS</p>
            <h1 class="display-title">Projects, from art systems to applied surfaces.</h1>
            <p class="lede">Start with the artistic line, then compare client work, product surfaces and the systems that support them.</p>
            <div class="button-row">
              <a class="button button--primary" href="./work.html">See Client Work</a>
              <a class="button button--secondary" href="./research.html">Enter Research</a>
              <a class="button button--secondary" href="./archive.html">Open Archive</a>
            </div>
          </div>
          <div class="projects-hero__stage intent-hero__stage" data-intent-stage aria-label="Project media previews">
            <div class="intent-hero__stage-label"><span>Project spectrum</span><strong>Art / product / public proof</strong></div>
            <a class="projects-hero__frame projects-hero__frame--wide" href="./palimpsests.html" data-depth="0.78" aria-label="Open Palimpsests">
              <img src="./assets/media/projects/palimpsests/P1288759-edit-1800.webp" alt="Palimpsests portrait visual" loading="eager" />
              <figcaption><span>Art system</span><strong>Palimpsests</strong></figcaption>
            </a>
            <a class="projects-hero__frame" href="./project.html?id=atypikhouse" data-depth="1.18" aria-label="Open AtypikHouse project">
              <img src="./assets/media/projects/atypikhouse/atypikhouse-dashboard-ipad.jpg" alt="AtypikHouse tablet dashboard" loading="lazy" />
              <figcaption><span>Applied surface</span><strong>AtypikHouse</strong></figcaption>
            </a>
            <a class="projects-hero__frame" href="./project.html?id=oeil-de-meg" data-depth="1.48" aria-label="Open L’Œil de Meg project">
              <img src="./assets/media/projects/oeil-de-meg/oeil-de-meg-pagespeed-desktop.png" alt="L’Œil de Meg PageSpeed desktop report" loading="lazy" />
              <figcaption><span>Delivery proof</span><strong>L’Œil de Meg</strong></figcaption>
            </a>
          </div>
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
      <nav class="projects-index-rail" aria-label="Project groups">
        ${indexedGroups
          .map(
            (group) => `
              <a class="projects-index-rail__link" href="#projects-${esc(group.key)}">
                <span>${String(group.index + 1).padStart(2, "0")}</span>
                <strong>${esc(group.label)}</strong>
              </a>
            `,
          )
          .join("")}
      </nav>
      <section class="stack projects-stack">
        ${indexedGroups
          .map(
            (group) => `
              <section id="projects-${esc(group.key)}" class="zone-card hero projects-group projects-group--${esc(group.key)}" data-project-group="${esc(group.key)}">
                <div class="projects-group__head">
                  <div class="section-head">
                    <p class="eyebrow">PROJECT GROUP</p>
                    <h2>${esc(group.label)}</h2>
                    <p class="lede">${esc(group.copy)}</p>
                  </div>
                  <aside class="projects-group__summary" aria-label="${esc(group.label)} summary">
                    <div>
                      <span>Projects</span>
                      <strong>${group.items.length}</strong>
                    </div>
                    <div>
                      <span>Lead</span>
                      <strong>${esc(group.primary)}</strong>
                    </div>
                    <div>
                      <span>Read</span>
                      <strong>${esc(group.categories.slice(0, 2).join(" / ") || "Project")}</strong>
                    </div>
                  </aside>
                </div>
                <div class="card-grid card-grid--two projects-grid projects-grid--${group.items.length === 1 ? "single" : "multi"}">
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
    document.body.dataset.entryId = item.id || "";
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
  const renderWork = () => renderWorkServices() + renderWorkOffer() + workTaxonomy() + catalogSectionWork();
  const renderResearch = () => researchFields() + researchPrograms() + researchNotes();
  const renderProgramsPage = () => renderPrograms() + pageLens("programs");
  const renderProjectsPage = () => renderProjects();
  const renderArchive = () => pageLens("archive") + archiveTaxonomy() + archiveLibrary();
  const renderAbout = () => aboutNetwork();
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
        label: "External Partnerships",
        copy: "Independent projects owned outside Electronic Artefacts, where the studio contributes a clearly bounded technical leadership role.",
        items: [
          entityById("unionmob"),
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
      <section class="zone-card hero" id="work-evidence">
        <div class="section-head">
          <p class="eyebrow">WORK CATALOG</p>
          <h2>One practice, four working contexts.</h2>
          <p class="lede">Internal work develops the language, collaborations introduce specialist expertise, external partnerships define bounded leadership roles, and commissioned work proves delivery under concrete constraints.</p>
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
      "home-hero": renderHomeHero,
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
      "work-forensics": renderWorkForensics,
      "work-capabilities": renderWorkCapabilities,
      "work-services": renderWorkServices,
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
      "about-network": aboutNetwork,
      "cross-navigation": renderCrossNavigation,
    },
    contact: {
      "contact-discovery": contactDiscovery,
      "contact-links": renderContact,
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
    initContactDiscovery();
    initCapabilityMaps();
    initUXEnhancements(filterState);
    initEngagementPanels();
    startVasteEngineAnimation();
    startComputationFieldAnimation();
    startGraphSurfaceAnimation();
  };

  const load = async () => {
    const current = document.body.dataset.page;
    syncSeoMeta({ current, entityById });
    const includesReady = loadIncludes();
    renderPageSections();
    await includesReady;
    window.EA_I18N?.localizeRoot(document);
    syncNavigationState(current);
    await initLanguageSwitcher();
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
