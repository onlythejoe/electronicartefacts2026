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
    if (value.startsWith("./assets/media/")) return value.replace("./assets/media/", "/assets/media/");
    return value;
  };

  const orethBannerMedia = {
    src: "./assets/media/projects/oreth/ORETH-hero-1200.webp",
    srcset: "./assets/media/projects/oreth/ORETH-hero-800.webp 800w, ./assets/media/projects/oreth/ORETH-hero-1200.webp 1200w",
    sizes: "(max-width: 48rem) 100vw, 44vw",
    alt: "Portrait of ORETH for banner use",
    width: 1200,
    height: 900,
  };

  const isOrethSignature = (item) => {
    if (!item) return false;
    const artist = String(item.artist || item.creditedArtist || item.signature || item.label || "").toLowerCase();
    const id = String(item.id || "").toLowerCase();
    const project = String(item.project || "").toLowerCase();
    return id === "oreth" || artist === "oreth" || project === "palimpsests";
  };

  const signatureActionIcons = {
    discover: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="7.25"></circle><path d="m14.8 9.2-1.7 4.1-4.1 1.7 1.7-4.1 4.1-1.7Z"></path></svg>`,
    archive: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 7.5h15v11h-15z"></path><path d="M3.5 4.5h17v3h-17zM9 12h6"></path></svg>`,
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
    const mediaAttrs = [
      `src="${esc(media.src)}"`,
      media.srcset ? `srcset="${esc(media.srcset)}"` : "",
      media.sizes ? `sizes="${esc(media.sizes)}"` : "",
      `alt="${esc(mediaAlt)}"`,
      `width="${esc(media.width || 2200)}"`,
      `height="${esc(media.height || 1650)}"`,
      `loading="${esc(options.loading || "eager")}"`,
      `fetchpriority="${esc(options.fetchPriority || "high")}"`,
      `decoding="async"`,
    ]
      .filter(Boolean)
      .join("\n            ");
    const tagMarkup = tags.length
      ? `<div class="tag-cluster tag-cluster--compact signature-banner__tags">${tags.map((value) => chip(value)).join("")}</div>`
      : "";
    const spacerMarkup = actions.length ? `<div class="signature-banner__spacer" aria-hidden="true"></div>` : "";
    const actionMarkup = actions.length
      ? `<div class="button-row button-row--compact signature-banner__actions">${actions
          .map(
            (action, index) => {
              const icon = signatureActionIcons[action.mobileIcon] || "";
              return `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}${icon ? " signature-banner__action--icon" : ""}" href="${esc(action.href)}"${action.target ? ` target="${esc(action.target)}" rel="noreferrer"` : ""}>${icon ? `<span class="signature-banner__action-icon">${icon}</span>` : ""}<span class="signature-banner__action-label">${esc(action.label)}</span></a>`;
            },
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
          <img class="signature-banner__image"
            ${mediaAttrs}
          />
        </div>
      </div>
    `;
  };

  const cardBaseAttrs = (item, options = {}) => {
    const medium = (item.medium || []).join(" ");
    const discipline = (item.discipline || []).join(" ");
    const researchField = item.researchField || (item.relatedResearchFields || []).join(" ");
    const year = item.temporality?.creationYear || item.date || "";
    const image = options.media === false ? null : cardImageFor(item);
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

  const entryHrefFor = (item, options = {}) => {
    if (options.href) return options.href;
    if (!item) return "";
    const canonicalRoute = catalog.routeFor?.(item);
    if (canonicalRoute) return canonicalRoute;
    if (item.route) return item.route;
    if (item.kind === "project") return `./project.html?id=${encodeURIComponent(item.id)}`;
    if (item.kind === "collection") return `./collection.html?id=${encodeURIComponent(item.id)}`;
    if (item.kind === "artefact" || item.kind === "researchLog") return `./artefact.html?id=${encodeURIComponent(item.id)}`;
    if (item.kind === "program") return `./program.html?id=${encodeURIComponent(item.id)}`;
    if (item.kind === "artist") return `./artist.html?id=${encodeURIComponent(item.id)}`;
    if (item.kind === "channel") return `./channel.html?id=${encodeURIComponent(item.id)}`;
    return "";
  };

  const mediaFrom = (entry) => {
    const gallery = entry?.media?.gallery || [];
    if (!gallery.length) return null;
    const images = gallery.filter((image) => mediaKindFor(image) === "image");
    const isRaster = (image) => /\.(png|jpe?g|webp|gif)(?:[?#]|$)/i.test(String(image?.src || ""));
    const isGenericMark = (image) => /(?:^|\/)(cover|logo|icon|picto|symbol)[^/]*\.(?:svg|png|jpe?g|webp|gif)(?:[?#]|$)/i.test(String(image?.src || ""));
    return (
      images.find((image) => String(image.src || "").includes("palimpsests.jpg")) ||
      images.find((image) => isRaster(image) && !isGenericMark(image)) ||
      images.find((image) => !isGenericMark(image)) ||
      images.find((image) => isRaster(image)) ||
      images[0] ||
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
      const preload = media.preload || "none";
      return `
        <video class="${className}" controls playsinline preload="${esc(preload)}">
          <source src="${esc(media.src)}" />
          ${esc(media.alt || item.title || "Project video")}
        </video>
      `;
    }
    const imageAttrs = [
      `src="${esc(media.src)}"`,
      media.srcset ? `srcset="${esc(media.srcset)}"` : "",
      media.sizes ? `sizes="${esc(media.sizes)}"` : "",
      `alt="${esc(media.alt || item.title)}"`,
      `loading="lazy"`,
      `decoding="async"`,
      media.width && media.height ? `width="${esc(media.width)}" height="${esc(media.height)}"` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<img class="${className}" ${imageAttrs} />`;
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
    const label = document.documentElement.lang?.startsWith("fr")
      ? "Faire battre le papillon de L’Œil de Meg"
      : "Make the L’Œil de Meg butterfly flutter";
    return `
      <button class="project-butterfly project-butterfly--${esc(variant)}" type="button" data-project-butterfly aria-label="${esc(label)}">
        <span class="project-butterfly__stage" aria-hidden="true">
          <span class="project-butterfly__hinge project-butterfly__hinge--left">
            <img class="project-butterfly__wing project-butterfly__wing--left" src="./assets/media/projects/oeil-de-meg/wing.png" alt="" loading="lazy" />
          </span>
          <span class="project-butterfly__hinge project-butterfly__hinge--right">
            <img class="project-butterfly__wing project-butterfly__wing--right" src="./assets/media/projects/oeil-de-meg/wing.png" alt="" loading="lazy" />
          </span>
        </span>
      </button>
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
    let interactionEnergy = 0;
    let interactionX = 0.5;

    const activate = (clientX) => {
      const bounds = root.getBoundingClientRect();
      interactionX = bounds.width > 0
        ? Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width))
        : 0.5;
      interactionEnergy = 1;
      root.classList.add("is-engaged");
    };

    root.addEventListener("pointerenter", (event) => activate(event.clientX));
    root.addEventListener("pointermove", (event) => {
      if (event.pointerType === "mouse") activate(event.clientX);
    });
    root.addEventListener("pointerdown", (event) => activate(event.clientX), { passive: true });
    root.addEventListener("pointerleave", () => root.classList.remove("is-engaged"));
    root.addEventListener("pointerup", () => {
      window.setTimeout(() => root.classList.remove("is-engaged"), 420);
    }, { passive: true });

    const animate = () => {
      if (!visible || document.hidden || !document.body.contains(root)) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        return;
      }

      phase += 0.02 + interactionEnergy * 0.006;
      interactionEnergy *= 0.965;

      const ambientEnergies = [
        (Math.sin(phase) + 1) * 0.5,
        (Math.sin(phase - 1.15) + 1) * 0.5,
        (Math.sin(phase - 2.3) + 1) * 0.5,
      ];
      const nodePositions = [0.22, 0.48, 0.78];
      const energies = ambientEnergies.map((energy, index) => {
        const proximity = Math.max(0, 1 - Math.abs(interactionX - nodePositions[index]) * 2.2);
        return Math.min(1.08, energy + interactionEnergy * proximity * 0.28);
      });

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

  const computationFieldMarkup = (variant = "hero") => `
    <figure class="program-commercial-hero__media computation-field computation-field--${esc(variant)}" data-computation-field data-computation-variant="${esc(variant)}" data-depth="0.86">
      <canvas class="computation-field__canvas" aria-hidden="true"></canvas>
      <div class="computation-field__hud" aria-hidden="true">
        <span>EA.MODEL / ARCHITECTURE</span>
        <span>CONTEXT / IDENTITY / EXECUTION</span>
      </div>
      <div class="computation-field__events" data-computation-events aria-hidden="true"></div>
      <figcaption>
        <span>Architecture study</span>
        <strong>A browser visualization of connected system layers, not live telemetry.</strong>
      </figcaption>
    </figure>
  `;

  const forgeArtifactMarkup = () => `
    <figure class="forge-artifact" data-forge-artifact data-depth="0.96">
      <model-viewer
        class="forge-artifact__model"
        src="./assets/media/forge/artifact-ultra-object-360.glb"
        alt="A textured physical artefact reconstructed by the FORGE production pipeline."
        loading="eager"
        reveal="auto"
        camera-controls
        auto-rotate
        rotation-per-second="10deg"
        interaction-prompt="none"
        camera-orbit="-28deg 74deg 112%"
        min-camera-orbit="auto auto 78%"
        max-camera-orbit="auto auto 170%"
        field-of-view="24deg"
        shadow-intensity="0.8"
        exposure="0.92">
        <div slot="poster" class="forge-artifact__poster" aria-hidden="true">
          <span class="forge-artifact__loading-mark"></span>
          <span>Preparing 3D artefact</span>
        </div>
      </model-viewer>
      <div class="forge-artifact__hud" aria-hidden="true">
        <span>FORGE / OBJECT 360</span>
        <span>TEXTURED GLB / 2026.06</span>
      </div>
      <div class="forge-artifact__axis" aria-hidden="true"><i></i><i></i><i></i></div>
      <figcaption>
        <span>Artefact 3D issu du pipeline FORGE</span>
        <strong>Reconstruction texturée manipulable — glissez pour l’examiner.</strong>
      </figcaption>
    </figure>
  `;

  const initForgeArtifactViewer = () => {
    const roots = [...document.querySelectorAll("[data-forge-artifact]")];
    if (!roots.length || document.querySelector('script[data-forge-model-viewer]')) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
    script.dataset.forgeModelViewer = "true";
    script.addEventListener("error", () => {
      roots.forEach((root) => root.classList.add("forge-artifact--fallback"));
    });
    document.head.append(script);
  };

  const startComputationFieldAnimation = () => {
    const roots = [...document.querySelectorAll("[data-computation-field]")];
    if (!roots.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const eventLabels = [
      "durable identity",
      "explicit relation",
      "context boundary",
      "permission rule",
      "event projection",
      "provenance record",
    ];
    const glyphs = ["0", "1", "A", "B", "C", "D", "E", "F", "/", "=", "∴", "◇"];

    roots.forEach((root, rootIndex) => {
      if (root.dataset.computationAnimated === "true") return;
      root.dataset.computationAnimated = "true";

      const canvas = root.querySelector(".computation-field__canvas");
      const ctx = canvas?.getContext("2d");
      const eventsRoot = root.querySelector("[data-computation-events]");
      const rate = root.querySelector("[data-computation-rate]");
      if (!canvas || !ctx) return;

      let width = 1;
      let height = 1;
      let dpr = 1;
      let visible = false;
      let rafId = 0;
      let lastFrame = 0;
      let elapsed = rootIndex * 1.7;
      let eventTimer = 0;
      let automaticWaveTimer = 0;
      let pointerActive = false;
      let pointerX = -1000;
      let pointerY = -1000;
      const waves = [];
      const particles = Array.from({ length: root.dataset.computationVariant === "detail" ? 72 : 104 }, (_, index) => ({
        offset: (index * 0.61803398875) % 1,
        lane: index % 2,
        phase: (index * 1.91) % (Math.PI * 2),
        speed: 0.035 + (index % 7) * 0.006,
        glyph: glyphs[index % glyphs.length],
        alpha: 0.22 + (index % 5) * 0.1,
      }));

      const syncSize = () => {
        const rect = root.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 1.6);
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const localPoint = (event) => {
        const rect = root.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      };

      const addWave = (x, y, strength = 1) => {
        waves.push({ x, y, age: 0, strength });
        if (waves.length > 5) waves.shift();
      };

      const spawnEvent = () => {
        if (!eventsRoot || reduceMotion || !visible) return;
        const node = document.createElement("span");
        const marker = document.createElement("i");
        const label = document.createElement("b");
        const labelIndex = Math.floor((elapsed * 2.7 + rootIndex) % eventLabels.length);
        const x = 16 + ((elapsed * 31 + rootIndex * 19) % 66);
        const y = 29 + Math.sin(elapsed * 1.3 + rootIndex) * 22;
        marker.setAttribute("aria-hidden", "true");
        label.textContent = eventLabels[labelIndex];
        node.className = "computation-field__event";
        node.style.left = `${x}%`;
        node.style.top = `${y}%`;
        node.append(marker, label);
        eventsRoot.append(node);
        window.setTimeout(() => node.remove(), 2600);
      };

      const draw = (timestamp = 0) => {
        if (!visible || document.hidden || !document.body.contains(root)) {
          rafId = 0;
          return;
        }

        if (!reduceMotion && timestamp - lastFrame < 1000 / 36) {
          rafId = requestAnimationFrame(draw);
          return;
        }

        const delta = lastFrame ? Math.min(0.05, (timestamp - lastFrame) / 1000) : 0.016;
        lastFrame = timestamp;
        if (!reduceMotion) elapsed += delta;
        eventTimer += delta;
        automaticWaveTimer += delta;
        waves.forEach((wave) => {
          wave.age += delta;
        });
        while (waves.length && waves[0].age > 2.4) waves.shift();

        ctx.clearRect(0, 0, width, height);

        const midY = height * 0.48;
        const amplitude = Math.min(height * 0.19, 66);
        const phase = elapsed * 1.18;
        const pointFor = (x, lane) => {
          const strandPhase = phase + x * 0.018 + (lane ? Math.PI : 0);
          let y = midY + Math.sin(strandPhase) * amplitude + Math.cos(strandPhase * 0.47) * 9;
          if (pointerActive) {
            const distance = Math.hypot(x - pointerX, y - pointerY);
            const influence = Math.max(0, 1 - distance / 190);
            y += (lane ? -1 : 1) * influence * 26;
          }
          waves.forEach((wave) => {
            const distance = Math.hypot(x - wave.x, y - wave.y);
            const radius = wave.age * 180;
            const ring = Math.max(0, 1 - Math.abs(distance - radius) / 70);
            y += Math.sin(distance * 0.035 - wave.age * 8) * ring * 18 * wave.strength * (1 - wave.age / 2.4);
          });
          return y;
        };

        const fadeAt = (x) => Math.max(0, 1 - Math.abs(x - width * 0.5) / (width * 0.58));
        ctx.lineCap = "round";

        for (let x = 8; x < width; x += 30) {
          const yA = pointFor(x, 0);
          const yB = pointFor(x, 1);
          const depth = (Math.sin(phase + x * 0.018) + 1) * 0.5;
          ctx.strokeStyle = `rgba(132, 196, 255, ${0.06 + depth * 0.1})`;
          ctx.lineWidth = 0.6 + depth * 0.75;
          ctx.beginPath();
          ctx.moveTo(x, yA);
          ctx.lineTo(x, yB);
          ctx.stroke();
        }

        [0, 1].forEach((lane) => {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 5) {
            const y = pointFor(x, lane);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          const gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, "rgba(91, 145, 255, 0)");
          gradient.addColorStop(0.28, lane ? "rgba(140, 183, 255, 0.36)" : "rgba(220, 238, 255, 0.5)");
          gradient.addColorStop(0.72, lane ? "rgba(220, 238, 255, 0.46)" : "rgba(112, 173, 255, 0.34)");
          gradient.addColorStop(1, "rgba(91, 145, 255, 0)");
          ctx.strokeStyle = gradient;
          ctx.lineWidth = lane ? 1 : 1.25;
          ctx.stroke();
        });

        particles.forEach((particle, index) => {
          const normalizedX = (particle.offset + elapsed * particle.speed) % 1;
          const x = normalizedX * width;
          const y = pointFor(x, particle.lane) + Math.sin(particle.phase + elapsed * 2.1) * (7 + (index % 4) * 2);
          const depth = (Math.sin(phase + x * 0.018 + (particle.lane ? Math.PI : 0)) + 1) * 0.5;
          const size = 7.5 + depth * 5.5;
          ctx.font = `${depth > 0.62 ? 650 : 420} ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
          ctx.fillStyle = `rgba(${185 + Math.round(depth * 55)}, ${207 + Math.round(depth * 36)}, 255, ${particle.alpha * fadeAt(x)})`;
          ctx.fillText(particle.glyph, x, y);
        });

        waves.forEach((wave) => {
          const opacity = Math.max(0, 0.28 * (1 - wave.age / 2.4));
          ctx.strokeStyle = `rgba(126, 184, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.age * 180, 0, Math.PI * 2);
          ctx.stroke();
        });

        if (rate) {
          const throughput = 118 + (Math.sin(elapsed * 0.82) + 1) * 9.4;
          rate.textContent = `${throughput.toFixed(1)} GB/s`;
        }

        if (!reduceMotion && eventTimer > 2.75 + rootIndex * 0.4) {
          eventTimer = 0;
          spawnEvent();
        }
        if (!reduceMotion && automaticWaveTimer > 4.8) {
          automaticWaveTimer = 0;
          addWave(width * (0.3 + ((elapsed * 0.17) % 0.4)), midY, 0.58);
        }

        if (!reduceMotion) rafId = requestAnimationFrame(draw);
        else rafId = 0;
      };

      root.addEventListener("pointermove", (event) => {
        const point = localPoint(event);
        pointerActive = true;
        pointerX = point.x;
        pointerY = point.y;
      });
      root.addEventListener("pointerleave", () => {
        pointerActive = false;
      });
      root.addEventListener("pointerdown", (event) => {
        const point = localPoint(event);
        addWave(point.x, point.y, 1.15);
        spawnEvent();
      });

      const observer = "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries.find((item) => item.target === root);
              if (!entry) return;
              visible = entry.isIntersecting || entry.intersectionRatio > 0;
              if (visible && !rafId && !document.hidden) {
                lastFrame = 0;
                rafId = requestAnimationFrame(draw);
              } else if (!visible && rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
              }
            },
            { rootMargin: "18% 0px", threshold: 0.04 },
          )
        : null;

      const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(syncSize) : null;
      syncSize();
      resizeObserver?.observe(root);
      window.addEventListener("resize", syncSize, { passive: true });

      if (observer) observer.observe(root);
      else {
        visible = true;
        rafId = requestAnimationFrame(draw);
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        } else if (!document.hidden && visible && !rafId) {
          lastFrame = 0;
          rafId = requestAnimationFrame(draw);
        }
      });
    });
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

  const signalStrip = () => "";

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
      ],
      archive: [
        { label: "FIELD", value: item.researchField || item.category || item.type || "Archive", note: item.project || "", fill: 0.82, tone: "archive" },
        { label: "RELATION", value: `${relatedCount}`, note: countLabel(relatedCount, "link"), fill: metricFill(relatedCount, 6), tone: "system" },
        { label: "DATE", value: item.date || updatedYear || "Undated", note: item.artist || item.type || "", fill: 0.58, tone: "live" },
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
      ],
    };

    return metricRail((variants[mode] || variants.project).filter(Boolean), { limit: 3, compact: true });
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
    const media = isOrethSignature(item) ? orethBannerMedia : cardImageFor(item);
    if (!media) return "";
    return mediaFigureMarkup(media, item, "project-immersive__image");
  };

  const cardMediaPlate = (item, options = {}) => {
    const media = cardImageFor(item);
    if (!media || mediaKindFor(media) !== "image") return "";
    const label = options.label || media.caption || item.title || "Visual";
    const showCaption = options.caption !== false;
    const imageAttrs = [
      `src="${esc(media.src)}"`,
      media.srcset ? `srcset="${esc(media.srcset)}"` : "",
      media.sizes ? `sizes="${esc(media.sizes)}"` : "",
      `alt=""`,
      `loading="lazy"`,
      `decoding="async"`,
      media.width && media.height ? `width="${esc(media.width)}" height="${esc(media.height)}"` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <figure class="card-media-plate"${options.action ? "" : ' aria-hidden="true"'}>
        <img ${imageAttrs} />
        ${
          showCaption
            ? `<figcaption>
                <span>${esc(options.kicker || "Visual")}</span>
                <strong>${esc(label)}</strong>
              </figcaption>`
            : ""
        }
        ${
          options.action?.href
            ? `<a class="card-media-plate__action" href="${esc(options.action.href)}"${options.action.target ? ` target="${esc(options.action.target)}" rel="noreferrer"` : ""}>${esc(options.action.label || "Discover")} <span aria-hidden="true">↗</span></a>`
            : ""
        }
      </figure>
    `;
  };

  const homeCardPills = (item) => {
    if (!item) return [];
    if (item.id === "oeil-de-meg") return ["Photography CRM", "Portfolio", "Live site", "WordPress"];
    if (item.id === "palimpsests") return ["Album cycle", "ORETH", "Five acts", "Archive"];
    if (item.id === "vestiges") return ["Living knowledge", "VASTE", "Cultural memory", "Public infrastructure"];
    if (item.id === "voice-capture-studio") return ["Live demo", "Open source", "Local-first", "Voice capture"];
    if (item.id === "unionmob") return ["External project", "CTO", "UMOS licence", "Violet identity"];

    const pills = [
      item.category || item.type || item.kind || "",
      item.statusLabel || item.status || "",
      item.temporality?.creationYear || "",
      item.links?.[0]?.label || item.program || "",
    ];

    return pills.filter(Boolean).slice(0, 4);
  };

  const projectReadAs = (item) => {
    if (!item) return "";
    if (item.id === "palimpsests") return "Album cycle, archive surface and ORETH world.";
    if (item.id === "oeil-de-meg") return "Live photography portfolio with CRM logic and performance evidence.";
    if (item.id === "vestiges") return "Platform for connecting people, practices, materials and institutions.";
    if (item.id === "voice-capture-studio") return "Open-source browser studio for local speech capture and structured voice exports.";
    if (item.id === "unionmob") return "External CTO partnership with a clear separation between UnionMob and UMOS.";
    if (item.category === "Client Work" || item.category === "External Work") return "Applied work with public-facing UX, visual evidence and delivery context.";
    if (item.category === "Platform" || item.type === "Platform") return "Product structure, workflow and operational logic.";
    return `${item.category || item.type || "Project"} inside the Electronic Artefacts world.`;
  };

  const projectCard = (item) => `
    <article class="project-card${item.id === "oeil-de-meg" ? " project-card--oeil-de-meg" : ""}" ${cardBaseAttrs(item)}>
      ${entryHrefFor(item) ? `<a class="project-card__overlay-link" href="${esc(entryHrefFor(item))}" aria-label="Open ${esc(item.title)} detail"></a>` : ""}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || catalog.taxonomies?.entityTypes?.[item.kind] || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        <div class="project-card__top-meta">
          ${item.id === "oeil-de-meg" ? chip("PHP") : ""}
          ${statusBadge(item.status, item.statusLabel)}
          ${projectSignatureBubble(item, "card")}
          ${projectButterflyBubble(item, "card")}
        </div>
      </div>
      ${cardMediaPlate(item)}
      ${cardCopy(item.summary, 1)}
      <p class="project-card__editorial-note">${esc(projectReadAs(item))}</p>
      ${signalStrip(item)}
      ${summaryMetrics(item, "project")}
      ${metadataList([
        { label: "Artist", value: item.artist },
        { label: "Program", value: item.program === "electronic-artefacts" ? "" : item.program },
      ])}
    </article>
  `;

  const projectLandingCard = (item) => {
    const href = entryHrefFor(item);
    return `
    <article class="project-card project-index-card${item.id === "oeil-de-meg" ? " project-card--oeil-de-meg" : ""}" data-project-detail-link="${esc(href)}" aria-label="Open ${esc(item.title)} detail" ${cardBaseAttrs(item)}>
      <a class="project-card__overlay-link" href="${esc(href)}" aria-label="Open ${esc(item.title)} detail"></a>
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.category || item.type || "PROJECT")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        <div class="project-card__top-meta">
          ${item.id === "oeil-de-meg" ? chip("PHP") : ""}
          ${statusBadge(item.status, item.statusLabel)}
          ${projectSignatureBubble(item, "card")}
          ${projectButterflyBubble(item, "card")}
        </div>
      </div>
      ${cardMediaPlate(item)}
      ${cardCopy(item.summary, 1)}
      <p class="project-card__editorial-note">${esc(projectReadAs(item))}</p>
      ${signalStrip(item)}
      ${tagRow(homeCardPills(item), { limit: 4, compact: true })}
      ${linkRow({ label: "View project", href })}
    </article>
  `;
  };

  const selectedWorksCard = (item, options = {}) => {
    if (!item) return "";
    const href = options.href || entryHrefFor(item);
    const featured = options.featured !== false;
    const compact = !featured;
    const isVestiges = item.id === "vestiges";
    const label = options.label || `Open ${item.title} detail`;
    const cardClasses = [
      "project-card",
      "selected-works-card",
      featured ? "selected-works-card--featured" : "selected-works-card--compact",
      item.id === "oeil-de-meg" ? "project-card--oeil-de-meg" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <article class="${cardClasses}" data-project-detail-link="${esc(href)}" ${cardBaseAttrs(item)} ${cardLinkAttrs(href, label)}>
        <a class="project-card__overlay-link" href="${esc(href)}" aria-label="${esc(label)}"></a>
        <div class="project-card__top">
          <div>
            <p class="card__meta">${esc(item.category || item.type || "PROJECT")}</p>
            <h3 class="card__title">${esc(item.title)}</h3>
            ${
              compact && (item.subtitle || item.statusLabel || item.maturity)
                ? `<p class="selected-works-card__subtitle">${esc(item.subtitle || item.statusLabel || item.maturity)}</p>`
                : ""
            }
          </div>
          <div class="project-card__top-meta">
            ${item.id === "oeil-de-meg" ? chip("PHP") : ""}
            ${statusBadge(item.status, item.statusLabel)}
            ${projectSignatureBubble(item, "card")}
            ${projectButterflyBubble(item, "card")}
          </div>
        </div>
        ${cardMediaPlate(item, { kicker: featured ? "Lead visual" : "Visual", caption: !isVestiges && item.id !== "oeil-de-meg", action: options.mediaAction })}
        ${cardCopy(item.summary || item.description, featured ? 2 : 1)}
        <p class="project-card__editorial-note">${esc(projectReadAs(item))}</p>
        ${signalStrip(item)}
        ${tagRow(homeCardPills(item), { limit: featured ? 4 : 2, compact: true })}
        ${
          options.actions?.length
            ? `<div class="selected-works-card__actions">${linkRow(options.actions[0], options.actions.slice(1))}</div>`
            : featured
              ? linkRow({ label: "View project", href }, [{ label: "More work", href: "./work.html" }])
              : ""
        }
      </article>
    `;
  };

  const archiveCard = (item) => `
    <article class="archive-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(entryHrefFor(item), `Open ${item.title}`)}>
      ${cardOverlayLink(entryHrefFor(item), `Open ${item.title}`)}
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
      ${cardMediaPlate(item)}
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
          <p class="research-dossier-card__subtitle">${esc(options.hideLineage ? item.statusLabel || item.maturity || "" : item.subtitle || item.statusLabel || item.maturity || "")}</p>
        </div>
        <div class="research-dossier-card__top-meta">
          ${typeof options.index === "number" ? `<span class="research-dossier-card__index">${String(options.index + 1).padStart(2, "0")}</span>` : ""}
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
        ${(item.relatedArtefacts || []).length ? `
          <div class="research-dossier-card__fact">
            <span>Artefacts</span>
            <strong>${esc((item.relatedArtefacts || []).length)}</strong>
          </div>` : ""}
      </div>
      <div class="tag-cluster tag-cluster--compact research-dossier-card__signals">
        ${[
          item.maturity,
          item.confidence,
          item.visibility,
          options.hideLineage ? "" : item.relations?.partOf?.[0],
        ]
          .filter(Boolean)
          .map((value) => `<span class="chip">${esc(catalog.taxonomies?.maturity?.[value]?.label || catalog.taxonomies?.confidence?.[value]?.label || catalog.taxonomies?.visibility?.[value]?.label || value)}</span>`)
          .join("")}
      </div>
      ${signalStrip(item)}
      ${tagRow([...(item.tags || []), ...(item.medium || []), ...(item.discipline || [])], { limit: 4, compact: true })}
    </article>
  `;

  const personCard = (item, options = {}) => {
    const href = entryHrefFor(item, options);
    if (options.variant === "collaborator") {
      const portrait = mediaFrom(item);
      const portraitMarkup = portrait && mediaKindFor(portrait) === "image"
        ? `
            <span class="collaborator-card__portrait" aria-hidden="true">
              <img
                src="${esc(portrait.src)}"
                alt=""
                loading="lazy"
                decoding="async"
                ${portrait.width && portrait.height ? `width="${esc(portrait.width)}" height="${esc(portrait.height)}"` : ""}
              />
            </span>
          `
        : "";
      const initials = String(item.title || "")
        .split(/[\s.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
      const related = entityById(item.relations?.relatedTo?.[0] || item.relations?.parent?.[0]);
      return `
        <article class="project-card collaborator-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(href, options.label || `Open ${item.title}`)}>
          ${cardOverlayLink(href, options.label || `Open ${item.title}`)}
          <div class="collaborator-card__header">
            <span class="collaborator-card__index">${String((options.index || 0) + 1).padStart(2, "0")}</span>
            ${portraitMarkup || `<span class="collaborator-card__monogram" aria-hidden="true">${esc(initials)}</span>`}
          </div>
          <div class="collaborator-card__identity">
            <p class="card__meta">${esc(item.subtitle || item.type || "Collaborator")}</p>
            <h3 class="card__title">${esc(item.title)}</h3>
            <p class="collaborator-card__role">${esc((item.discipline || []).slice(0, 3).join(" · "))}</p>
          </div>
          <p class="card__copy">${esc(item.description || item.summary || "")}</p>
          <div class="collaborator-card__footer">
            <div>
              <span>Connected work</span>
              <strong>${esc(related?.title || "Electronic Artefacts")}</strong>
            </div>
            <span class="collaborator-card__cta">View profile <span aria-hidden="true">↗</span></span>
          </div>
        </article>
      `;
    }
    return `
      <article class="project-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(href, options.label || `Open ${item.title}`)}>
        ${cardOverlayLink(href, options.label || `Open ${item.title}`)}
        <div class="project-card__top">
          <div>
            <p class="card__meta">${esc(item.type || "ARTIST")}</p>
            <h3 class="card__title">${esc(item.title)}</h3>
          </div>
          ${statusBadge(item.status, item.statusLabel)}
        </div>
        ${cardMediaPlate(item, { kicker: "Artist", label: item.media?.gallery?.[0]?.caption || item.title })}
        ${cardCopy(item.summary, 1)}
        ${signalStrip(item)}
        ${summaryMetrics(item, "person")}
        ${metadataList([{ label: "Kind", value: item.kind }])}
      </article>
    `;
  };

  const programCard = (item, options = {}) => `
    <article class="program-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(entryHrefFor(item, options), options.label || `Open ${item.title}`)}>
      ${cardOverlayLink(entryHrefFor(item, options), options.label || `Open ${item.title}`)}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "PROGRAM")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardMediaPlate(item)}
      ${cardCopy(item.summary, 1)}
      ${signalStrip(item)}
      ${summaryMetrics(item, "program")}
    </article>
  `;

  const channelCard = (item) => `
    <article class="program-card" ${cardBaseAttrs(item)} ${cardLinkAttrs(entryHrefFor(item), `Open ${item.title}`)}>
      ${cardOverlayLink(entryHrefFor(item), `Open ${item.title}`)}
      <div class="project-card__top">
        <div>
          <p class="card__meta">${esc(item.type || "CHANNEL")}</p>
          <h3 class="card__title">${esc(item.title)}</h3>
        </div>
        ${statusBadge(item.status, item.statusLabel)}
      </div>
      ${cardMediaPlate(item)}
      ${cardCopy(item.summary, 1)}
      ${signalStrip(item)}
      ${summaryMetrics(item, "program")}
    </article>
  `;

  const taxonomyPanel = (scope, title, description, groups, extraClass = "") => {
    const renderGroup = (group) => `
      <div class="taxonomy-column${group.options.length > 6 ? " taxonomy-column--scroll" : ""}">
        <p class="card__meta">${esc(group.label)}</p>
        <div class="pill-cloud taxonomy-pill-row" data-filter-group="${esc(group.key)}">
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
    `;
    const quickGroups = groups.slice(0, Math.min(3, groups.length));
    const advancedGroups = groups.slice(quickGroups.length);

    return `
      <section class="zone-card hero taxonomy-panel ${esc(extraClass)}" data-filter-scope="${esc(scope)}">
        <div class="section-head taxonomy-panel__head">
          <p class="eyebrow">${esc(title)}</p>
          <h2>${esc(description.heading)}</h2>
          <p class="lede">${esc(description.copy)}</p>
        </div>
        <div class="taxonomy-panel__quick-grid" aria-label="Priority filters">
          ${quickGroups.map(renderGroup).join("")}
        </div>
        ${
          advancedGroups.length
            ? `
              <details class="taxonomy-panel__drawer" data-taxonomy-drawer>
                <summary class="taxonomy-panel__drawer-summary">
                  <span class="taxonomy-panel__drawer-heading">
                    <strong>More filters</strong>
                    <span>${advancedGroups.length} groups</span>
                  </span>
                  <span class="taxonomy-panel__drawer-hint">Tap to show or hide</span>
                </summary>
                <div class="taxonomy-grid taxonomy-grid--advanced">
                  ${advancedGroups.map(renderGroup).join("")}
                </div>
              </details>
            `
            : ""
        }
      </section>
    `;
  };

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
    return signatureBanner(palimpsests, {
      variant: "oreth",
      eyebrow: "PALIMPSESTS / ORETH",
      title: "Palimpsests",
      copy: "Palimpsests is an album cycle by ORETH, unfolding across five acts and an evolving archive.",
      loading: "lazy",
      fetchPriority: "low",
      tags: homeCardPills(palimpsests),
      actions: [
        { label: "Discover", href: "./palimpsests.html", mobileIcon: "discover" },
        { label: "Browse archive", href: "./archive.html", mobileIcon: "archive" },
        { label: "Start a Collaboration", href: "./contact.html" },
      ],
    });
  };

  const vasteBanner = () => `
    <section class="zone-card hero latests-panel" id="latests">
      <div class="section-head">
        <p class="eyebrow">PROPRIETARY TECHNOLOGY</p>
        <h2>VASTE is the runtime behind the studio’s knowledge systems.</h2>
        <p class="lede">It provides the shared logic for identity, context, permissions and graph-based products.</p>
      </div>
      <div class="latests-grid latests-grid--cinematic">
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
              <p class="card__meta">RUNTIME FOUNDATION</p>
              <h3 class="vast-banner__title">VASTE</h3>
              <p class="vast-banner__copy">A reusable foundation for platforms where entities, relationships and permissions must remain coherent as the system grows.</p>
              <div class="pill-cloud vast-banner__chips" aria-label="VASTE attributes">
                <span class="chip">Runtime</span>
                <span class="chip">Graph systems</span>
                <span class="chip">Research engine</span>
              </div>
            </div>
            ${vasteEngineMarkup()}
            <div class="button-row button-row--compact vast-banner__actions">
              <a class="button button--primary vast-banner__action vast-banner__action--brief" href="https://www.vaste.space/" target="_blank" rel="noreferrer">
                <span>Explore Brief</span><span class="vast-banner__action-mark" aria-hidden="true">↗</span>
              </a>
              <a class="button button--secondary vast-banner__action vast-banner__action--research" href="${esc(entryHrefFor(vaste))}">
                <span>Open Research</span><span class="vast-banner__action-mark" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </article>
          `;
        })()}
      </div>
    </section>
  `;

  const featuredResearch = () => {
    const [lead, oeilDeMeg, vaste, vestiges, forge] = [
      "voice-capture-studio",
      "oeil-de-meg",
      "vaste",
      "vestiges",
      "forge",
    ].map(entityById);
    if (!lead) return "";
    const supporting = [oeilDeMeg, vaste, vestiges, forge].filter(Boolean);
    const signalCopy = document.documentElement.lang?.startsWith("fr")
      ? "Choisissez un système pour l’explorer directement : un signal, une destination."
      : "Choose a system to explore it directly — one signal, one destination.";

    return `
      <section class="zone-card hero selected-works-panel">
        <div class="selected-works-panel__head">
          <div class="section-head">
            <p class="eyebrow">WORK</p>
            <h2>A live studio signal, from client proof to internal R&amp;D.</h2>
            <p class="lede">Voice Capture Studio is the newest release. VASTE is the active runtime, Vestiges the future flagship, and Forge the internal production system behind emerging pipelines.</p>
          </div>
          <aside class="panel panel--soft selected-works-panel__info">
            <p class="card__meta">STUDIO SIGNALS</p>
            <strong>Four systems in motion.</strong>
            <p class="card__copy">${esc(signalCopy)}</p>
            ${metricRail(
              [
                { label: "Newest", value: "Voice Capture", note: "Live open source", tone: "live", fill: 0.96 },
                { label: "Trending", value: "VASTE", note: "Knowledge runtime", tone: "system", fill: 0.88 },
                { label: "Future flagship", value: "Vestiges", note: "Living knowledge platform", tone: "visual", fill: 0.82 },
                { label: "Internal R&D", value: "Forge", note: "ML · photogrammetry · AI", tone: "research", fill: 0.76 },
              ],
              { limit: 4, compact: true },
            )}
            <div class="selected-works-panel__signal-links" aria-label="Studio systems">
              ${[
                { item: lead, label: "Discover Voice Capture", href: "https://electronicartefacts.github.io/voice-capture-studio/", target: "_blank" },
                vaste ? { item: vaste, label: "View VASTE", href: entryHrefFor(vaste) } : null,
                vestiges ? { item: vestiges, label: "View Vestiges", href: entryHrefFor(vestiges) } : null,
                forge ? { item: forge, label: "Open Forge", href: entryHrefFor(forge) } : null,
              ].filter(Boolean).map((action) => `<a class="metric-pill metric-pill--${esc(action.item?.status || "active")}" href="${esc(action.href)}"${action.target ? ` target="${esc(action.target)}" rel="noreferrer"` : ""}><span>${esc(action.label)}</span><strong>${esc(action.item?.title || "")}</strong></a>`).join("")}
            </div>
          </aside>
        </div>
        <div class="selected-works-panel__grid">
          ${selectedWorksCard(lead, {
            featured: true,
            mediaAction: { label: "Discover", href: "https://electronicartefacts.github.io/voice-capture-studio/", target: "_blank" },
            actions: [
              { label: "Discover Voice Capture", href: "https://electronicartefacts.github.io/voice-capture-studio/", target: "_blank" },
              { label: "Project dossier", href: entryHrefFor(lead) },
            ],
          })}
          <div class="selected-works-panel__stack">
            <div class="selected-works-panel__stack-head">
              <p class="card__meta">MORE PATHS</p>
              <span>${esc(countLabel(supporting.length, "item"))}</span>
            </div>
            <div class="selected-works-panel__stack-grid">
              ${supporting.map((item) => selectedWorksCard(item, {
                featured: false,
                href: item.id === "forge" ? entryHrefFor(item) : undefined,
                actions: item.id === "oeil-de-meg"
                  ? [
                    { label: "Discover L’Œil de Meg", href: "https://oeildemeg.fr/", target: "_blank" },
                    { label: "Project dossier", href: entryHrefFor(item) },
                  ]
                  : [],
              })).join("")}
            </div>
          </div>
        </div>
        <div class="link-row selected-works-panel__links">
          <a class="tag" href="./projects.html">Browse Projects</a>
          <a class="tag" href="./work.html">See More Work</a>
        </div>
      </section>
    `;
  };

  const latestArtefacts = () => {
    const latest = (catalog.artefacts || [])
      .slice()
      .sort((a, b) => entityDateValue(b) - entityDateValue(a))
      .slice(0, 3);
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

  const routeCard = (item = {}) => {
    const href = item.href || "";
    const target = item.target ? ` target="${esc(item.target)}" rel="noreferrer"` : "";
    const label = item.ariaLabel || item.cta || `Open ${item.title || "destination"}`;
    return `
      <article class="panel panel--soft card-link-surface" ${href ? cardLinkAttrs(href, label) : ""}>
        <p class="card__meta">${esc(item.kicker || "")}</p>
        <h3 class="card__title">${esc(item.title || "")}</h3>
        <p class="card__copy">${esc(item.copy || "")}</p>
        ${item.reason ? `<p class="card__copy">${esc(item.reason)}</p>` : ""}
        <div class="link-row">
          ${href ? `<a class="tag" href="${esc(href)}"${target}>${esc(item.cta || "Open")}</a>` : ""}
        </div>
      </article>
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
    computationFieldMarkup,
    startComputationFieldAnimation,
    forgeArtifactMarkup,
    initForgeArtifactViewer,
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
    cardMediaPlate,
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
  };
})();
