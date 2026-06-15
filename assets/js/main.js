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
        copy: "Filter by status, discipline, medium and visibility.",
      },
      groups,
    );
  };

  const researchFields = () => {
    const voidTheory = entityById("void");
    const theoryIds = ["entropy", "emergence", "runtime-theory", "systems-theory", "information-studies", "anthropic-studies"];
    const theoryFields = theoryIds.map((id) => entityById(id)).filter(Boolean);

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
            <h3 class="card__title">Narrative extension.</h3>
            <p class="card__copy">A speculative project frame that expands the same logic into a broader world.</p>
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
          <p class="lede">The same logic can appear as a runtime, a work, a label release or an archive entry.</p>
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
      "Dependencies",
      null,
      `<div class="link-row">${deps.map((entry) => `<a class="tag" href="${esc(entryHref(entry))}">${esc(entry.title)}</a>`).join("")}</div>`,
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
    if (isOrethSignature(item)) return "";
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
        actions.push({ label: "View Project Line", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` });
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
      ...(item.kind === "project" ? [{ label: "View Project Line", href: `./project-rl.html?id=${encodeURIComponent(item.id)}` }] : []),
    ];
    const detailIntro = item.kind === "program" ? programSpecificPanels(item) : "";
    const specificPanels = projectSpecificPanels(item);
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
                  <span>${esc(item.statusLabel || item.status || item.kind || "Entry")}</span>
                  <strong>${esc(item.category || item.type || item.domain || "Electronic Artefacts")}</strong>
                </figcaption>
              </figure>
            `
            : ""
        }
      </section>
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
  const getSearchIndex = () => catalog.indexes?.getSearchIndex?.() || catalog.indexes?.search || [];
  const searchResultOrder = ["program", "project", "artefact", "researchLog", "researchField", "collection", "artist", "channel", "worldbuilding"];

  const filteredSearchItems = () => {
    const searchIndex = getSearchIndex();
    const query = searchState.query;
    const status = searchState.status;
    const kind = searchState.kind;
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
    pushList("Secondary questions", item.secondaryQuestions);
    pushList("Interpretations", item.narrativeInterpretations);
    push("Body", item.body);

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
    const items = sortOverviewItems(filteredSearchItems()).map((item) => entityById(item.id) || item).filter(Boolean);
    const tagCount = items.reduce((total, item) => total + collectOverviewTags(item).length, 0);
    const blockCount = items.reduce((total, item) => total + collectOverviewBlocks(item).length, 0);
    const totalCount = catalog.indexes?.entities?.length || items.length || 1;
    return { items, tagCount, blockCount, totalCount };
  };

  const searchOverviewMarkup = () => {
    const { items, tagCount, blockCount, totalCount } = overviewStats();
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
          <h2>${esc(items.length)} elements in view</h2>
          <p class="lede">Contents, tags and metadata are shown together so you can tune the catalogue from a single overview.</p>
        </div>
        ${metricRail(
          [
            { label: "ELEMENTS", value: String(items.length), note: "visible rows", fill: metricFill(items.length, totalCount), tone: "live" },
            { label: "TAGS", value: String(tagCount), note: "all chips", fill: metricFill(tagCount, Math.max(tagCount, 1) * 2), tone: "visual" },
            { label: "CONTENTS", value: String(blockCount), note: "text blocks", fill: metricFill(blockCount, Math.max(blockCount, 1) * 2), tone: "archive" },
          ],
          { limit: 3, compact: true },
        )}
        <div class="catalog-table-shell" role="region" aria-label="Catalogue overview table" tabindex="0">
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
                  const contentBlocks = collectOverviewBlocks(item);
                  const tags = collectOverviewTags(item);
                  const typeLabel = esc(catalog.taxonomies?.entityTypes?.[item.kind] || item.kind || "ENTRY");
                  const year = item.temporality?.creationYear || item.temporality?.releaseDate || String(item.temporality?.lastUpdated || "").slice(0, 4) || "—";
                  const visibilityLabel = catalog.taxonomies?.visibility?.[item.visibility]?.label || item.visibility || "—";
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
                          ${tags.length ? tags.map((value) => chip(value)).join("") : `<span class="catalog-table__empty">No tags</span>`}
                        </div>
                      </td>
                      <td class="catalog-table__meta-cell">
                        <div class="catalog-table__meta">
                          ${statusBadge(item.status, item.statusLabel)}
                          <span class="catalog-table__meta-line">${esc(visibilityLabel)}</span>
                          <span class="catalog-table__meta-line">${esc(year)}</span>
                          <span class="catalog-table__meta-line">${esc(item.kind || "entry")}</span>
                        </div>
                      </td>
                      <td class="catalog-table__open-cell">
                        ${titleHref ? `<a class="tag catalog-table__open" href="${esc(titleHref)}">Open</a>` : `<span class="catalog-table__empty">—</span>`}
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  };

  const renderSearchPage = () => `
      <section class="zone-card hero" data-search-shell>
        <div class="section-head">
          <p class="eyebrow">OVERVIEW</p>
          <h1 class="display-title">Catalogue matrix.</h1>
          <p class="lede">Search titles, scan contents and compare every tag in one table.</p>
        </div>
        <div class="taxonomy-grid">
          <div class="taxonomy-column">
            <p class="card__meta">Query</p>
            <input class="search-input" type="search" data-search-input placeholder="Search title, content or tags..." />
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
      title: "Featured Paths",
      copy: "Choose the path that matches why you are here. Each route points to the part of the ecosystem that should answer your question first.",
      cards: [
        {
          kicker: "Investors",
          title: "VASTE as the core spine",
          copy: "Understand the runtime, the strategic logic and the broader system that generates the rest of the ecosystem.",
          reason: "Investors need the trunk before the branches.",
          cta: "Explore VASTE",
          href: "./vaste.html",
          ariaLabel: "Explore VASTE",
        },
        {
          kicker: "Clients",
          title: "Applied work and public outcomes",
          copy: "See how Electronic Artefacts handles commissions, systems and visible deliverables across the studio layer.",
          reason: "Clients need evidence of execution, not just language.",
          cta: "See Client Work",
          href: "./work.html",
          ariaLabel: "See Client Work",
        },
        {
          kicker: "Collaborators",
          title: "How the ecosystem operates",
          copy: "Learn how research, programs, projects and archive relate before starting a collaboration.",
          reason: "Collaborators need a map of the working model.",
          cta: "Understand the Ecosystem",
          href: "./about.html",
          ariaLabel: "Understand the Ecosystem",
        },
        {
          kicker: "Artists",
          title: "Palimpsests and the label layer",
          copy: "Enter the musical and editorial surface where artistic work, traces and publication logic meet.",
          reason: "Artists need to see the cultural register of the project.",
          cta: "Enter Palimpsests",
          href: "./palimpsests.html",
          ariaLabel: "Enter Palimpsests",
        },
      ],
    });
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
        items: [entityById("palimpsests")].filter(Boolean),
      },
      {
        label: "Narrative Extensions",
        copy: "Branches that extend the artistic material into broader narrative frames.",
        items: [entityById("vestiges")].filter(Boolean),
      },
      {
        label: "Applied Surfaces",
        copy: "Project-shaped public or client surfaces that remain outside the core theory/art/technology triad.",
        items: [
          entityById("unionmob"),
          entityById("atypikhouse"),
          entityById("oeil-de-meg"),
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
            <a class="button button--primary" href="./work.html">See Client Work</a>
            <a class="button button--secondary" href="./research.html">Enter Research</a>
            <a class="button button--secondary" href="./archive.html">Open Archive</a>
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
          <a class="button button--primary" href="./projects.html">Browse Projects</a>
          <a class="button button--secondary" href="./work.html">Return to Work</a>
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
            <a class="button button--primary" href="./project.html?id=${encodeURIComponent(item.id)}">Open Project Detail</a>
            <a class="button button--secondary" href="./projects.html">Browse Projects</a>
            <a class="button button--secondary" href="./archive.html">Open Archive</a>
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
          entityById("void"),
          entityById("palimpsests"),
          entityById("oreth"),
          entityById("vaste"),
          entityById("forge"),
          entityById("oraclehub"),
        ].filter(Boolean),
      },
      {
        label: "Collaborations",
        copy: "Collaborative relationships and shared work.",
        items: [
          entityById("noi-save"),
          entityById("marjolaine-muller"),
        ].filter(Boolean),
      },
      {
        label: "External Works",
        copy: "Outside commissions and public-facing work.",
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
          <h2>Internal works, collaborations and external work</h2>
          <p class="lede">Curated into a clean catalogue so the relation between the layers stays visible.</p>
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
