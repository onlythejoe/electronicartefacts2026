(function () {
  const catalog = window.EA_CATALOG || {};
  const { esc } = window.EA_UTILS;
  const { statusBadge, chip, tagRow, metadataList, linkRow, metricRail, cardLinkAttrs, cardOverlayLink } = window.EA_UI;
  const entityIndex = catalog.indexes?.byId || {};
  const cardImageCache = new Map();
  const homeProjectsCache = new Map();
  const entityById = (id) => entityIndex[id] || null;
  const cardCssUrl = (src) => {
    const value = String(src || "");
    if (value.startsWith("./assets/media/")) return value.replace("./assets/media/", "../media/");
    return value;
  };

  const orethBannerMedia = {
    src: "./assets/media/projects/oreth/ORETH.png",
    alt: "Portrait of ORETH for banner use",
    width: 2200,
    height: 1650,
  };

  const isOrethSignature = (item) => {
    if (!item) return false;
    const artist = String(item.artist || item.creditedArtist || item.signature || item.label || "").toLowerCase();
    const id = String(item.id || "").toLowerCase();
    const project = String(item.project || "").toLowerCase();
    return id === "oreth" || artist === "oreth" || project === "palimpsests";
  };

  const signatureBanner = (item, options = {}) => {
    const title = options.title || item?.title || "ORETH";
    const copy = options.copy || item?.summary || item?.description || "";
    const eyebrow = options.eyebrow || item?.type || item?.statusLabel || "FEATURED";
    const titleTag = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(String(options.titleTag || "h2").toLowerCase())
      ? String(options.titleTag || "h2").toLowerCase()
      : "h2";
    const tags = (options.tags || []).filter(Boolean);
    const actions = (options.actions || []).filter(Boolean);
    const media = options.media || orethBannerMedia;
    const mediaAlt = options.mediaAlt || media.alt || "";
    const titleMarkup = `<${titleTag} class="signature-banner__title">${esc(title)}</${titleTag}>`;
    const tagMarkup = tags.length
      ? `<div class="tag-cluster tag-cluster--compact signature-banner__tags">${tags.map((value) => chip(value)).join("")}</div>`
      : "";
    const spacerMarkup = actions.length ? `<div class="signature-banner__spacer" aria-hidden="true"></div>` : "";
    const actionMarkup = actions.length
      ? `<div class="button-row button-row--compact signature-banner__actions">${actions
          .map(
            (action, index) =>
              `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}" href="${esc(action.href)}"${action.target ? ` target="${esc(action.target)}" rel="noreferrer"` : ""}>${esc(action.label)}</a>`,
          )
          .join("")}</div>`
      : "";

    return `
      <div class="signature-banner${options.className ? ` ${esc(options.className)}` : ""}${options.variant ? ` signature-banner--${esc(options.variant)}` : ""}">
        <div class="signature-banner__copy">
          <p class="card__meta">${esc(eyebrow)}</p>
          ${titleMarkup}
          ${copy ? `<p class="signature-banner__lede">${esc(copy)}</p>` : ""}
          ${tagMarkup}
          ${spacerMarkup}
          ${actionMarkup}
        </div>
        <div class="signature-banner__media" aria-hidden="true">
          <img
            class="signature-banner__image"
            src="${esc(media.src)}"
            alt="${esc(mediaAlt)}"
            width="${esc(media.width || 2200)}"
            height="${esc(media.height || 1650)}"
            loading="${options.loading || "eager"}"
            fetchpriority="${options.fetchPriority || "high"}"
            decoding="async"
          />
        </div>
      </div>
    `;
  };

  const cardBaseAttrs = (item) => {
    const medium = (item.medium || []).join(" ");
    const discipline = (item.discipline || []).join(" ");
    const researchField = item.researchField || (item.relatedResearchFields || []).join(" ");
    const year = item.temporality?.creationYear || item.date || "";
    const image = cardImageFor(item);
    return `
      data-filter-card
      data-entry-id="${esc(item.id || "")}"
      ${image ? `data-card-media="true" style="--card-image:url('${esc(cardCssUrl(image.src))}');"` : ""}
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
    let rafId = 0;
    let visible = false;

    const animate = () => {
      if (!visible || document.hidden || !document.body.contains(root)) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        return;
      }

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

      rafId = requestAnimationFrame(animate);
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.target !== root) return;
              visible = entry.isIntersecting || entry.intersectionRatio > 0;
              if (visible && !rafId && !document.hidden) {
                rafId = requestAnimationFrame(animate);
              }
              if (!visible && rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
              }
            });
          },
          { rootMargin: "20% 0px 20% 0px", threshold: 0.05 },
        )
      : null;

    const syncVisibility = () => {
      if (document.hidden || !visible) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        return;
      }
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    if (observer) observer.observe(root);
    else {
      visible = true;
      rafId = requestAnimationFrame(animate);
    }

    document.addEventListener("visibilitychange", syncVisibility);
  };

  const cardImageFor = (item) => {
    const cacheKey = item?.id || "";
    if (cacheKey && cardImageCache.has(cacheKey)) return cardImageCache.get(cacheKey);

    const direct = mediaFrom(item);
    if (direct) {
      if (cacheKey) cardImageCache.set(cacheKey, direct);
      return direct;
    }

    if (cacheKey) cardImageCache.set(cacheKey, null);
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

  const homeProjects = (excludeIds = []) => {
    const cacheKey = excludeIds.length ? [...new Set(excludeIds)].sort().join("|") : "__all__";
    if (homeProjectsCache.has(cacheKey)) return homeProjectsCache.get(cacheKey);

    const excluded = new Set(excludeIds);
    const projects = (catalog.projects || [])
      .filter((item) => item.visibility !== "internal" && !excluded.has(item.id))
      .slice()
      .sort((a, b) => entityDateValue(b) - entityDateValue(a));

    homeProjectsCache.set(cacheKey, projects);
    return projects;
  };

  const featuredProjectForHome = (excludeIds = []) => {
    const projects = homeProjects(excludeIds);
    return projects.find((item) => cardImageFor(item)) || projects[0] || null;
  };

  const projectHeroMedia = (item) => {
    const media = isOrethSignature(item) ? orethBannerMedia : mediaFrom(item) || cardImageFor(item);
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
          <p class="card__meta">${esc(item.type || catalog.taxonomies?.entityTypes?.[item.kind] || "PROJECT")}</p>
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
      <details class="taxonomy-panel__drawer" data-taxonomy-drawer open>
        <summary class="taxonomy-panel__drawer-summary">
          <span class="taxonomy-panel__drawer-heading">
            <strong>Advanced filters</strong>
            <span>${groups.length} groups</span>
          </span>
          <span class="taxonomy-panel__drawer-hint">Tap to show or hide</span>
        </summary>
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
      </details>
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
    const palimpsests = entityById("palimpsests");
    if (!palimpsests) return "";
    return `
      <section class="zone-card hero">
        ${signatureBanner(palimpsests, {
          variant: "oreth",
          eyebrow: "PALIMPSESTS / ORETH",
          title: "Palimpsests",
          copy: "Album cycle carried by ORETH. A single full surface, no nested panels.",
          tags: homeCardPills(palimpsests),
          actions: [
            { label: "Open project", href: "./palimpsests.html" },
            { label: "Archive", href: "./archive.html" },
            { label: "Contact", href: "./contact.html" },
          ],
        })}
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
          const vaste = entityById("vaste") || {};
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

  window.EA_VIEW = {
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
  };
})();
