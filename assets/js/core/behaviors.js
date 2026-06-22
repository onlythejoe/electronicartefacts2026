(function () {
  const esc = window.EA_UTILS?.esc || ((value) => String(value ?? ""));
  const slugify = window.EA_UTILS?.slugify || ((value) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""));
  const scheduleIdle = (callback) => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => callback(), { timeout: 1200 });
      return;
    }
    window.setTimeout(callback, 0);
  };

  const applyFilters = (scope, filterState, cards = [...document.querySelectorAll("[data-filter-card]")]) => {
    const section = document.querySelector(`[data-filter-scope="${scope}"]`);
    if (!section) return;
    const state = filterState.get(scope) || {};
    let visibleCount = 0;
    cards.forEach((card) => {
      const visible = Object.entries(state).every(([key, value]) => {
        if (!value || value === "all") return true;
        const raw = card.getAttribute(`data-${key}`) || "";
        return raw.toLowerCase().includes(value.toLowerCase());
      });
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    syncFilterSummaries(filterState, cards, visibleCount);
  };

  const syncFilterSummaries = (filterState, cards = [...document.querySelectorAll("[data-filter-card]")], visibleCount = null) => {
    const visible = visibleCount ?? cards.filter((card) => !card.hidden).length;
    document.querySelectorAll("[data-filter-scope]").forEach((section) => {
      const scope = section.getAttribute("data-filter-scope");
      const summary = section.querySelector(".filter-summary");
      if (!scope || !summary) return;
      const count = summary.querySelector("[data-filter-count]");
      if (count) count.textContent = `${visible} visible`;
      const active = Object.values(filterState.get(scope) || {}).some((value) => value && value !== "all");
      summary.classList.toggle("has-active-filters", active);
      const tray = summary.querySelector("[data-active-filter-tray]");
      if (tray) {
        const state = filterState.get(scope) || {};
        const chips = Object.entries(state).filter(([, value]) => value && value !== "all");
        tray.innerHTML = chips
          .map(
            ([key, value]) => `
              <button class="active-filter-token" type="button" data-remove-filter-key="${esc(key)}">
                <span>${esc(key)}</span>
                <strong>${esc(value)}</strong>
              </button>
            `,
          )
          .join("");
      }
    });
  };

  const initFilters = (filterState) => {
    const cards = [...document.querySelectorAll("[data-filter-card]")];
    document.querySelectorAll("[data-filter-scope]").forEach((section) => {
      const scope = section.getAttribute("data-filter-scope");
      if (!scope) return;
      if (!filterState.has(scope)) filterState.set(scope, {});
      if (section.dataset.boundFilterToggle === "true") return;
      section.dataset.boundFilterToggle = "true";

      section.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter-toggle]");
        if (!button) return;
        const key = button.getAttribute("data-filter-key");
        const value = button.getAttribute("data-filter-value");
        const state = filterState.get(scope) || {};
        const next = state[key] === value ? "all" : value;
        state[key] = next;
        filterState.set(scope, state);

        section.querySelectorAll(`[data-filter-key="${esc(key)}"]`).forEach((chip) => {
          const isActive = chip.getAttribute("data-filter-value") === next;
          chip.classList.toggle("is-active", isActive);
          chip.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        applyFilters(scope, filterState, cards);
      });
    });
  };

  const initSearch = (searchState, rerender) => {
    let rerenderId = 0;
    const scheduleRerender = () => {
      if (rerenderId) cancelAnimationFrame(rerenderId);
      rerenderId = requestAnimationFrame(() => {
        rerenderId = 0;
        rerender();
      });
    };
    const syncToggleGroup = (selector, activeValue) => {
      document.querySelectorAll(selector).forEach((chip) => {
        const isActive = (chip.getAttribute("data-value") || "all") === activeValue;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };

    const input = document.querySelector("[data-search-input]");
    if (input) {
      input.value = searchState.query;
      if (input.dataset.boundSearchInput !== "true") {
        input.dataset.boundSearchInput = "true";
        input.addEventListener("input", () => {
          const nextQuery = input.value.trim().toLowerCase();
          if (nextQuery === searchState.query) return;
          searchState.query = nextQuery;
          searchState.page = 1;
          scheduleRerender();
        });
      }
    }

    document.querySelectorAll("[data-search-status-chip]").forEach((chip) => {
      if (chip.dataset.boundSearchStatus === "true") return;
      chip.dataset.boundSearchStatus = "true";
      chip.addEventListener("click", () => {
        const nextStatus = chip.getAttribute("data-value") || "all";
        if (nextStatus === searchState.status) return;
        searchState.status = nextStatus;
        searchState.page = 1;
        syncToggleGroup("[data-search-status-chip]", searchState.status);
        scheduleRerender();
      });
    });

    document.querySelectorAll("[data-search-kind-chip]").forEach((chip) => {
      if (chip.dataset.boundSearchKind === "true") return;
      chip.dataset.boundSearchKind = "true";
      chip.addEventListener("click", () => {
        const nextKind = chip.getAttribute("data-value") || "all";
        if (nextKind === searchState.kind) return;
        searchState.kind = nextKind;
        searchState.page = 1;
        syncToggleGroup("[data-search-kind-chip]", searchState.kind);
        scheduleRerender();
      });
    });

    syncToggleGroup("[data-search-status-chip]", searchState.status);
    syncToggleGroup("[data-search-kind-chip]", searchState.kind);

    if (document.body.dataset.boundSearchMore !== "true") {
      document.body.dataset.boundSearchMore = "true";
      document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-search-more]");
        if (!button) return;
        searchState.page += 1;
        rerender();
      });
    }
  };

  const initCardLinks = () => {
    if (document.body.dataset.boundCardLinks === "true") return;
    document.body.dataset.boundCardLinks = "true";

    const navigate = (target) => {
      if (target) window.location.href = target;
    };

    document.addEventListener("click", (event) => {
      const card = event.target.closest("[data-project-detail-link], [data-card-link]");
      if (!card || event.target.closest("a,button,input,select,textarea,label,.taxonomy-pill")) return;
      navigate(card.getAttribute("data-project-detail-link") || card.getAttribute("data-card-link"));
    });

  };

  const makeEntryHref = (item) => {
    if (!item) return "./index.html";
    if (item.kind === "project") return `./project.html?id=${encodeURIComponent(item.id)}`;
    if (item.kind === "collection") return `./collection.html?id=${encodeURIComponent(item.id)}`;
    if (item.kind === "artefact" || item.kind === "researchLog") return `./artefact.html?id=${encodeURIComponent(item.id)}`;
    return `./entity.html?id=${encodeURIComponent(item.id)}`;
  };

  const initScrollProgress = () => {
    if (document.querySelector("[data-scroll-progress]")) return;
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("data-scroll-progress", "");
    progress.setAttribute("aria-hidden", "true");
    document.body.append(progress);

    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.setProperty("--scroll-progress", String(value));
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  const initAutoHideHeader = () => {
    const header = document.querySelector(".shell-header.zone-card");
    if (!header || document.body.dataset.boundAutoHideHeader === "true") return;
    document.body.dataset.boundAutoHideHeader = "true";

    let lastY = window.scrollY || 0;
    let ticking = false;
    let hidden = false;
    let resizeObserver = null;

    const setHidden = (nextHidden) => {
      if (hidden === nextHidden) return;
      hidden = nextHidden;
      document.body.classList.toggle("is-header-hidden", hidden);
    };

    const syncHeaderOffset = () => {
      const height = Math.ceil(header.getBoundingClientRect().height || 0);
      document.body.style.setProperty("--header-offset", `${height + 12}px`);
    };

    const update = () => {
      const currentY = window.scrollY || 0;
      const delta = currentY - lastY;
      const atTop = currentY < 12;

      if (atTop) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -2) {
        setHidden(false);
      }

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    const showHeader = () => {
      setHidden(false);
    };

    syncHeaderOffset();
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => syncHeaderOffset());
      resizeObserver.observe(header);
    } else {
      window.addEventListener("resize", syncHeaderOffset);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      syncHeaderOffset();
      update();
    });
    header.addEventListener("focusin", showHeader);
  };

  const initReveal = () => {
    const targets = document.querySelectorAll(".zone-card, .panel, .project-card, .program-card, .archive-card, .cross-nav-card, .signature-banner");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-reveal-pending");
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    targets.forEach((target, index) => {
      if (target.dataset.boundReveal === "true") return;
      target.dataset.boundReveal = "true";
      target.style.setProperty("--reveal-index", String(index % 8));
      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.08) {
        target.classList.add("is-visible");
        return;
      }
      target.classList.add("is-reveal-pending");
      observer.observe(target);
    });
  };

  const initCardSpotlight = (root = document) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    root.querySelectorAll(".project-card, .program-card, .archive-card, .panel, .cross-nav-card, .stat-card, .signature-banner").forEach((card) => {
      if (card.dataset.boundSpotlight === "true") return;
      card.dataset.boundSpotlight = "true";
      let rect = null;
      const syncRect = () => {
        rect = card.getBoundingClientRect();
      };
      const clearRect = () => {
        rect = null;
      };

      card.addEventListener("pointerenter", syncRect);
      card.addEventListener("pointerleave", clearRect);
      card.addEventListener("pointermove", (event) => {
        if (!rect) syncRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
        card.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
      });
    });
  };

  const initDesktopCursor = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (document.documentElement.dataset.boundDesktopCursor === "true") return;
    document.documentElement.dataset.boundDesktopCursor = "true";
    document.documentElement.classList.add("has-desktop-cursor");

    const cursor = document.createElement("div");
    cursor.className = "ea-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);

    const interactiveSelector = [
      "a",
      "button",
      "summary",
      "label",
      "[role='button']",
      "[data-card-link]",
      "[data-project-detail-link]",
      "input",
      "textarea",
      "select",
      ".button",
      ".chip",
      ".tag",
      ".filter-chip",
      ".taxonomy-pill",
      ".ux-dock button",
      ".site-nav a",
    ].join(",");

    let currentX = Math.max(0, window.innerWidth * 0.5);
    let currentY = Math.max(0, window.innerHeight * 0.5);
    let targetX = currentX;
    let targetY = currentY;
    let currentScale = 1;
    let targetScale = 1;
    let visible = false;
    let pointerDown = false;
    let hoveringInteractive = false;
    let frame = 0;

    const resolveScale = () => {
      targetScale = pointerDown ? (hoveringInteractive ? 2.55 : 0.95) : hoveringInteractive ? 2.3 : 1;
    };

    const render = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;
      currentScale += (targetScale - currentScale) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale})`;
      cursor.style.opacity = visible ? "1" : "0";

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1 ||
        Math.abs(targetScale - currentScale) > 0.01
      ) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const hideCursor = () => {
      visible = false;
      scheduleRender();
    };

    const updatePosition = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      visible = true;

      if (event.target instanceof Element) {
        const nextHoveringInteractive = Boolean(event.target.closest(interactiveSelector));
        if (nextHoveringInteractive !== hoveringInteractive) {
          hoveringInteractive = nextHoveringInteractive;
          resolveScale();
        }
      }

      scheduleRender();
    };

    document.addEventListener("pointermove", updatePosition, { passive: true });
    document.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      pointerDown = true;
      resolveScale();
      scheduleRender();
    });
    document.addEventListener("pointerup", (event) => {
      if (event.button !== 0) return;
      pointerDown = false;
      resolveScale();
      scheduleRender();
    });
    document.documentElement.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);
  };

  const initDragRails = () => {
    document.querySelectorAll(".archive-rail-shell, .taxonomy-column .pill-cloud, .project-immersive__rail--wide").forEach((rail) => {
      if (rail.dataset.boundDragRail === "true") return;
      rail.dataset.boundDragRail = "true";
      let pointerId = null;
      let startX = 0;
      let startScroll = 0;

      rail.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || event.target.closest("a,button,input,textarea,select")) return;
        pointerId = event.pointerId;
        startX = event.clientX;
        startScroll = rail.scrollLeft;
        rail.classList.add("is-dragging");
        rail.setPointerCapture(pointerId);
      });

      rail.addEventListener("pointermove", (event) => {
        if (pointerId !== event.pointerId) return;
        rail.scrollLeft = startScroll - (event.clientX - startX);
      });

      const release = (event) => {
        if (pointerId !== event.pointerId) return;
        pointerId = null;
        rail.classList.remove("is-dragging");
      };
      rail.addEventListener("pointerup", release);
      rail.addEventListener("pointercancel", release);
    });
  };

  const initFilterSummaries = (filterState) => {
    const cards = [...document.querySelectorAll("[data-filter-card]")];
    document.querySelectorAll("[data-filter-scope]").forEach((section) => {
      const scope = section.getAttribute("data-filter-scope");
      if (!scope || section.dataset.boundFilterSummary === "true") return;
      section.dataset.boundFilterSummary = "true";
      const summary = document.createElement("div");
      summary.className = "filter-summary";
      summary.innerHTML = `
        <div class="filter-summary__status">
          <span data-filter-count>0 visible</span>
          <div class="active-filter-tray" data-active-filter-tray></div>
        </div>
        <button class="filter-reset" type="button" data-filter-reset>Reset filters</button>
      `;
      const drawer = section.querySelector("[data-taxonomy-drawer]");
      const insertBefore = drawer || section.querySelector(".taxonomy-grid") || section.firstElementChild;
      if (insertBefore) section.insertBefore(summary, insertBefore);
      else section.append(summary);

      if (drawer && drawer.dataset.boundTaxonomyDrawer !== "true") {
        drawer.dataset.boundTaxonomyDrawer = "true";
        const media = window.matchMedia("(max-width: 48rem)");
        const syncDrawer = () => {
          drawer.open = !media.matches;
        };
        syncDrawer();
        if (typeof media.addEventListener === "function") {
          media.addEventListener("change", syncDrawer);
        } else if (typeof media.addListener === "function") {
          media.addListener(syncDrawer);
        }
      }

      summary.querySelector("[data-filter-reset]")?.addEventListener("click", () => {
        filterState.set(scope, {});
        section.querySelectorAll("[data-filter-toggle]").forEach((chip) => {
          const isAll = chip.getAttribute("data-filter-value") === "all";
          chip.classList.toggle("is-active", isAll);
          chip.setAttribute("aria-pressed", isAll ? "true" : "false");
        });
        applyFilters(scope, filterState, cards);
      });

      summary.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-filter-key]");
        if (!removeButton) return;
        const key = removeButton.getAttribute("data-remove-filter-key");
        const state = filterState.get(scope) || {};
        state[key] = "all";
        filterState.set(scope, state);
        section.querySelectorAll(`[data-filter-key="${esc(key)}"]`).forEach((chip) => {
          const isAll = chip.getAttribute("data-filter-value") === "all";
          chip.classList.toggle("is-active", isAll);
          chip.setAttribute("aria-pressed", isAll ? "true" : "false");
        });
        applyFilters(scope, filterState, cards);
      });

      syncFilterSummaries(filterState, cards);
    });
  };

  const initCommandPalette = () => {
    if (document.querySelector("[data-command-palette]")) return;
    const catalog = window.EA_CATALOG || {};
    const entries = [
      { title: "Home", type: "Page", href: "./index.html" },
      { title: "Work", type: "Page", href: "./work.html" },
      { title: "Projects", type: "Page", href: "./projects.html" },
      { title: "Programs", type: "Page", href: "./programs.html" },
      { title: "Research", type: "Page", href: "./research.html" },
      { title: "Archive", type: "Page", href: "./archive.html" },
      { title: "About", type: "Page", href: "./about.html" },
      { title: "Contact", type: "Page", href: "./contact.html" },
      ...((catalog.indexes?.entities || []).map((item) => ({
        title: item.title,
        type: catalog.taxonomies?.entityTypes?.[item.kind] || item.kind || "Entry",
        href: makeEntryHref(item),
        summary: item.summary || item.description || "",
      })) || []),
      ...((catalog.collections || []).map((item) => ({
        title: item.title,
        type: "Collection",
        href: makeEntryHref({ ...item, kind: "collection" }),
        summary: item.summary || "",
      })) || []),
    ];

    const button = document.createElement("button");
    button.className = "command-fab";
    button.type = "button";
    button.setAttribute("aria-label", "Open quick navigation");
    button.innerHTML = "<span>Search</span><kbd>⌘K</kbd>";

    const palette = document.createElement("div");
    palette.className = "command-palette";
    palette.hidden = true;
    palette.setAttribute("data-command-palette", "");
    palette.innerHTML = `
      <div class="command-palette__backdrop" data-command-close></div>
      <section class="command-palette__panel" role="dialog" aria-modal="true" aria-label="Quick navigation">
        <div class="command-palette__search">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search pages, projects and programs..." data-command-input />
          <button type="button" data-command-close aria-label="Close quick navigation">Esc</button>
        </div>
        <div class="command-palette__results" data-command-results></div>
      </section>
    `;
    document.body.append(button, palette);

    const input = palette.querySelector("[data-command-input]");
    const results = palette.querySelector("[data-command-results]");

    const renderResults = () => {
      const query = input.value.trim().toLowerCase();
      const matches = entries
        .filter((entry) => !query || `${entry.title} ${entry.type} ${entry.summary || ""}`.toLowerCase().includes(query))
        .slice(0, 9);
      results.innerHTML = matches
        .map(
          (entry, index) => `
            <a class="command-result${index === 0 ? " is-active" : ""}" href="${esc(entry.href)}">
              <span>
                <strong>${esc(entry.title)}</strong>
                ${entry.summary ? `<small>${esc(entry.summary)}</small>` : ""}
              </span>
              <em>${esc(entry.type)}</em>
            </a>
          `,
        )
        .join("");
    };

    const open = () => {
      palette.hidden = false;
      document.body.classList.add("has-command-palette");
      input.value = "";
      renderResults();
      requestAnimationFrame(() => input.focus());
    };
    const close = () => {
      palette.hidden = true;
      document.body.classList.remove("has-command-palette");
      button.focus({ preventScroll: true });
    };

    button.addEventListener("click", open);
    palette.querySelectorAll("[data-command-close]").forEach((node) => node.addEventListener("click", close));
    input.addEventListener("input", renderResults);
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        palette.hidden ? open() : close();
      }
      if (event.key === "/" && document.activeElement === document.body) {
        event.preventDefault();
        open();
      }
      if (event.key === "Escape" && !palette.hidden) close();
    });
  };

  const initImageLightbox = () => {
    if (document.querySelector("[data-image-lightbox]")) return;
    const images = document.querySelectorAll(".project-immersive__image, .project-gallery__image");
    if (!images.length) return;
    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("data-image-lightbox", "");
    lightbox.innerHTML = `
      <button class="image-lightbox__close" type="button" aria-label="Close image">Close</button>
      <img alt="" data-image-lightbox-img />
    `;
    document.body.append(lightbox);
    const image = lightbox.querySelector("[data-image-lightbox-img]");
    const close = () => {
      lightbox.hidden = true;
      document.body.classList.remove("has-image-lightbox");
    };
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest(".image-lightbox__close")) close();
    });
    images.forEach((node) => {
      node.closest("figure")?.classList.add("has-lightbox");
      node.addEventListener("click", () => {
        image.src = node.currentSrc || node.src;
        image.alt = node.alt || "";
        lightbox.hidden = false;
        document.body.classList.add("has-image-lightbox");
      });
    });
  };

  const initTaxonomyPills = (root = document) => {
    root.querySelectorAll(".taxonomy-pill").forEach((pill) => {
      if (pill.dataset.boundTaxonomyPill === "true") return;
      pill.dataset.boundTaxonomyPill = "true";
    });
  };

  const initLyricsHighlights = (root = document) => {
    root.querySelectorAll("[data-lyrics-card]").forEach((card) => {
      if (card.dataset.boundLyrics === "true") return;
      card.dataset.boundLyrics = "true";
      const annotation = card.querySelector("[data-lyrics-annotation]");

      card.addEventListener("click", (event) => {
        const line = event.target.closest("[data-lyric-line]");
        if (!line || !card.contains(line)) return;
        const isActive = line.classList.contains("is-active");
        card.querySelectorAll("[data-lyric-line]").forEach((node) => {
          node.classList.remove("is-active");
          node.setAttribute("aria-pressed", "false");
        });
        if (isActive) {
          if (annotation) {
            annotation.querySelector(".card__title").textContent = "Select a line";
            annotation.querySelector(".card__copy").textContent = "Click a phrase to isolate it. Notes, references and explanations can live here as the text grows.";
          }
          return;
        }
        line.classList.add("is-active");
        line.setAttribute("aria-pressed", "true");
        if (annotation) {
          const text = line.querySelector(".lyrics-line__text")?.textContent?.trim() || "";
          const number = line.querySelector(".lyrics-line__number")?.textContent?.trim() || "";
          annotation.querySelector(".card__title").textContent = number ? `Line ${number}` : "Selected line";
          annotation.querySelector(".card__copy").textContent = text;
        }
      });
    });
  };

  const initSectionRail = () => {
    const main = document.querySelector(".site-main");
    if (!main || document.querySelector("[data-section-rail]")) return;
    const headings = [...main.querySelectorAll(".zone-card .section-head h1, .zone-card .section-head h2, .catalog-group .section-head h3")]
      .filter((heading) => heading.textContent.trim())
      .slice(0, 9);
    if (headings.length < 3) return;

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `${slugify(heading.textContent) || "section"}-${index + 1}`;
    });

    const rail = document.createElement("nav");
    rail.className = "section-rail";
    rail.setAttribute("data-section-rail", "");
    rail.setAttribute("aria-label", "Navigation de section");
    const railLinks = [];
    rail.innerHTML = headings
      .map(
        (heading, index) => `
          <a href="#${esc(heading.id)}" data-section-target="${esc(heading.id)}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${esc(heading.textContent.trim())}</strong>
          </a>
        `,
      )
      .join("");
    document.body.append(rail);
    railLinks.push(...rail.querySelectorAll("a"));

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        const id = active.target.id;
        railLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("data-section-target") === id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.12, 0.35, 0.6] },
    );
    headings.forEach((heading) => observer.observe(heading));
  };

  const cardText = (card, selector) => card.querySelector(selector)?.textContent.trim() || "";

  const initQuickView = (root = document) => {
    if (!document.querySelector("[data-quick-view]")) {
      const drawer = document.createElement("aside");
      drawer.className = "quick-view";
      drawer.hidden = true;
      drawer.setAttribute("data-quick-view", "");
      drawer.setAttribute("aria-live", "polite");
      drawer.innerHTML = `
        <button class="quick-view__close" type="button" data-quick-view-close aria-label="Close preview">×</button>
        <div class="quick-view__body" data-quick-view-body></div>
      `;
      document.body.append(drawer);
      drawer.querySelector("[data-quick-view-close]")?.addEventListener("click", () => {
        drawer.hidden = true;
        document.body.classList.remove("has-quick-view");
      });
    }

    const drawer = document.querySelector("[data-quick-view]");
    const body = drawer?.querySelector("[data-quick-view-body]");
    if (!drawer || !body) return;

    root.querySelectorAll(".project-card, .program-card, .archive-card, .panel.card-link-surface").forEach((card) => {
      if (card.dataset.boundQuickView === "true") return;
      card.dataset.boundQuickView = "true";
      const button = document.createElement("button");
      button.className = "quick-view-button";
      button.type = "button";
      button.setAttribute("aria-label", "Quick preview");
      button.textContent = "↗";
      card.append(button);
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const title = cardText(card, ".card__title") || "Preview";
        const meta = cardText(card, ".card__meta");
        const copy = cardText(card, ".card__copy");
        const href = card.getAttribute("data-project-detail-link") || card.getAttribute("data-card-link") || card.querySelector("a[href]")?.getAttribute("href") || "";
        const tags = [...card.querySelectorAll(".taxonomy-pill, .status-badge, .entity-badge")]
          .slice(0, 8)
          .map((node) => `<span class="${esc(node.className)}">${esc(node.textContent.trim())}</span>`)
          .join("");
        body.innerHTML = `
          <p class="card__meta">${esc(meta || "Quick view")}</p>
          <h2>${esc(title)}</h2>
          ${copy ? `<p>${esc(copy)}</p>` : ""}
          ${tags ? `<div class="quick-view__tags">${tags}</div>` : ""}
          <div class="button-row">
            ${href ? `<a class="button button--primary" href="${esc(href)}">Open</a>` : ""}
            <button class="button button--secondary" type="button" data-quick-view-close>Close</button>
          </div>
        `;
        body.querySelector("[data-quick-view-close]")?.addEventListener("click", () => {
          drawer.hidden = true;
          document.body.classList.remove("has-quick-view");
        });
        drawer.hidden = false;
        document.body.classList.add("has-quick-view");
      });
    });
  };

  const toast = (message) => {
    let stack = document.querySelector("[data-toast-stack]");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("data-toast-stack", "");
      document.body.append(stack);
    }
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    stack.append(item);
    window.setTimeout(() => item.classList.add("is-leaving"), 1800);
    window.setTimeout(() => item.remove(), 2300);
  };

  const initUXDock = () => {
    if (document.querySelector("[data-ux-dock]")) return;
    const dock = document.createElement("div");
    dock.className = "ux-dock";
    dock.setAttribute("data-ux-dock", "");
    dock.innerHTML = `
      <button type="button" data-ux-action="top" aria-label="Back to top">↑</button>
      <button type="button" data-ux-action="compact" aria-label="Toggle compact view">▦</button>
      <button type="button" data-ux-action="vivid" aria-label="Toggle vivid mode">◐</button>
    `;
    document.body.append(dock);

    const compact = localStorage.getItem("ea-compact-view") === "true";
    const vivid = localStorage.getItem("ea-vivid-mode") === "true";
    document.body.classList.toggle("is-compact-view", compact);
    document.body.classList.toggle("is-vivid-mode", vivid);

    dock.addEventListener("click", (event) => {
      const button = event.target.closest("[data-ux-action]");
      if (!button) return;
      const action = button.getAttribute("data-ux-action");
      if (action === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast("Top");
      }
      if (action === "compact") {
        const active = !document.body.classList.contains("is-compact-view");
        document.body.classList.toggle("is-compact-view", active);
        localStorage.setItem("ea-compact-view", String(active));
        toast(active ? "Compact view" : "Comfort view");
      }
      if (action === "vivid") {
        const active = !document.body.classList.contains("is-vivid-mode");
        document.body.classList.toggle("is-vivid-mode", active);
        localStorage.setItem("ea-vivid-mode", String(active));
        toast(active ? "Vivid mode" : "Calm mode");
      }
    });
  };

  const initSmartPrefetch = () => {
    if (document.body.dataset.boundSmartPrefetch === "true") return;
    document.body.dataset.boundSmartPrefetch = "true";

    const prefetched = new Set();
    const canPrefetch = (anchor) => {
      if (!anchor || !anchor.href) return false;
      if (anchor.target && anchor.target !== "_self") return false;
      if (anchor.hasAttribute("download")) return false;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
      return url.pathname.endsWith(".html") || url.pathname.endsWith("/");
    };
    const prefetch = (anchor) => {
      if (!canPrefetch(anchor)) return;
      const url = new URL(anchor.href, window.location.href);
      url.hash = "";
      const key = url.href;
      if (prefetched.has(key)) return;
      prefetched.add(key);

      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "document";
      link.href = key;
      document.head.append(link);
    };
    const onIntent = (event) => {
      const anchor = event.target.closest?.("a[href]");
      prefetch(anchor);
    };

    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("touchstart", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
  };

  const initUXEnhancements = (filterState) => {
    initScrollProgress();
    initAutoHideHeader();
    initReveal();
    initFilterSummaries(filterState);
    scheduleIdle(() => {
      initCardSpotlight();
      initDragRails();
      initImageLightbox();
      initTaxonomyPills();
      initLyricsHighlights();
      initQuickView();
      initSmartPrefetch();
    });
  };

  const refreshCardSurfaces = (root = document) => {
    initCardSpotlight(root);
    initQuickView(root);
    initTaxonomyPills(root);
    initLyricsHighlights(root);
  };

  const syncNavigationState = (current) => {
    const detailNavMap = {
      artefact: "archive",
      artist: "work",
      channel: "work",
      collection: "archive",
      entity: "research",
      program: "programs",
      project: "projects",
    };
    const navCurrent =
      current === "detail"
        ? detailNavMap[document.body.dataset.detailKind || ""] || current
        : current === "project-rl"
          ? "projects"
          : current;
    let activeLink = null;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === navCurrent) {
        link.setAttribute("aria-current", "page");
        activeLink = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });
    if (!activeLink) return;
    const nav = activeLink.closest(".site-nav");
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    requestAnimationFrame(() => {
      activeLink.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
    });
  };

  const syncPageTitle = ({ current, entityById }) => {
    if (current === "detail") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) : null;
      if (entry) document.title = `${entry.title} - Electronic Artefacts`;
      return;
    }

    if (current === "project-rl") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) : null;
      if (entry) document.title = `${entry.title} Dossier - Electronic Artefacts`;
      return;
    }

    if (current === "mentions-legales") document.title = "Legal Notice - Electronic Artefacts";
    if (current === "confidentialite") document.title = "Privacy - Electronic Artefacts";
    if (current === "programs") document.title = "Programs - Electronic Artefacts";
    if (current === "projects") document.title = "Projects - Electronic Artefacts";
    if (current === "search") document.title = "Search - Electronic Artefacts";
  };

  const syncSeoMeta = ({ current, entityById }) => {
    syncPageTitle({ current, entityById });
    document.documentElement.lang = "en";

    const siteName = "Electronic Artefacts";
    const fallbackDescription = "Electronic Artefacts is an independent creative technology studio operating across research, software development, digital design, communication and artistic production.";
    const pageName = window.location.pathname.split("/").pop() || "index.html";
    const baseName = pageName.replace(/\.html$/, "");
    const queryId = new URLSearchParams(window.location.search).get("id");
    const detailEntry = (() => {
      if (baseName === "palimpsests") return entityById("palimpsests");
      if (current === "detail" || current === "project-rl") return queryId ? entityById(queryId) : null;
      return null;
    })();

    const pageDescriptions = {
      index: fallbackDescription,
      work: "Studio work, services and selected collaborations.",
      research: "Research fields, notes and system studies across the Electronic Artefacts ecosystem.",
      programs: "Programs, runtimes and architectural systems that power Electronic Artefacts.",
      projects: "Projects, albums and client work in the Electronic Artefacts archive.",
      archive: "Archived projects, systems and research threads preserved by Electronic Artefacts.",
      about: "Electronic Artefacts is an independent creative technology studio spanning research, software development, digital design, communication and artistic production.",
      contact: "Contact Electronic Artefacts by email and social channels.",
      search: "Search the Electronic Artefacts knowledge base.",
      project: "Electronic Artefacts project page.",
      "project-rl": "Electronic Artefacts project dossier.",
      artefact: "Electronic Artefacts artefact page.",
      collection: "Electronic Artefacts collection page.",
      channel: "Electronic Artefacts channel page.",
      artist: "Electronic Artefacts artist page.",
      program: "Detailed registry of Electronic Artefacts programs, with status, lineage and system context.",
      entity: "Electronic Artefacts knowledge piece.",
      palimpsests: "Palimpsests project page.",
      "mentions-legales": "Legal notice for the Electronic Artefacts site.",
      confidentialite: "Privacy policy for the Electronic Artefacts site.",
    };

    const description =
      (detailEntry?.kind === "project" && current === "project-rl"
        ? `${detailEntry.summary || detailEntry.description || detailEntry.title} Extended project dossier.`
        : detailEntry?.summary || detailEntry?.description || pageDescriptions[baseName] || pageDescriptions[current] || fallbackDescription) || fallbackDescription;

    const canonicalPath = (() => {
      if (baseName === "index") return "./";
      if (baseName === "palimpsests") return "./palimpsests.html";
      if (detailEntry?.route && (current === "detail" || current === "project-rl")) return detailEntry.route;
      if (current === "project-rl" && queryId) return `./project-rl.html?id=${encodeURIComponent(queryId)}`;
      if (current === "detail" && queryId) return `./${baseName}.html?id=${encodeURIComponent(queryId)}`;
      return `./${pageName}`;
    })();

    const canonicalUrl = new URL(canonicalPath, window.location.href).href;
    const imageCandidate =
      detailEntry?.media?.gallery?.find((item) => item?.src && item.mediaType !== "video" && /\.(png|jpe?g|webp|gif)$/i.test(item.src)) ||
      detailEntry?.media?.gallery?.find((item) => item?.src && item.mediaType !== "video") ||
      null;
    const imageSrc = imageCandidate?.src || "./assets/media/projects/electronic-artefacts/electronic-artefacts-logo.png";
    const imageAlt = imageCandidate?.alt || detailEntry?.title || "Electronic Artefacts logo";
    const imageUrl = new URL(imageSrc, window.location.href).href;
    const robots = current === "search" ? "noindex,follow" : "index,follow,max-image-preview:large";
    const ogType = current === "detail" || current === "project-rl" ? "article" : "website";

    const ensureMeta = ({ name, property, content }) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let node = document.head.querySelector(selector);
      if (!node) {
        node = document.createElement("meta");
        if (property) node.setAttribute("property", property);
        if (name) node.setAttribute("name", name);
        document.head.appendChild(node);
      }
      node.setAttribute("content", content);
      return node;
    };

    const ensureLink = (rel, href) => {
      let node = document.head.querySelector(`link[rel="${rel}"]`);
      if (!node) {
        node = document.createElement("link");
        node.setAttribute("rel", rel);
        document.head.appendChild(node);
      }
      node.setAttribute("href", href);
      return node;
    };

    const ensureJsonLd = (data) => {
      let node = document.head.querySelector('script[data-seo-jsonld="true"]');
      if (!data) {
        node?.remove();
        return;
      }
      if (!node) {
        node = document.createElement("script");
        node.type = "application/ld+json";
        node.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(node);
      }
      node.textContent = JSON.stringify(data);
    };

    ensureMeta({ name: "description", content: description });
    ensureMeta({ name: "robots", content: robots });
    ensureMeta({ name: "theme-color", content: "#0f1115" });
    ensureMeta({ property: "og:title", content: document.title });
    ensureMeta({ property: "og:description", content: description });
    ensureMeta({ property: "og:type", content: ogType });
    ensureMeta({ property: "og:url", content: canonicalUrl });
    ensureMeta({ property: "og:site_name", content: siteName });
    ensureMeta({ property: "og:locale", content: "en_US" });
    ensureMeta({ property: "og:image", content: imageUrl });
    ensureMeta({ property: "og:image:alt", content: imageAlt });
    ensureMeta({ name: "twitter:card", content: "summary_large_image" });
    ensureMeta({ name: "twitter:title", content: document.title });
    ensureMeta({ name: "twitter:description", content: description });
    ensureMeta({ name: "twitter:image", content: imageUrl });
    ensureMeta({ name: "twitter:image:alt", content: imageAlt });
    ensureLink("canonical", canonicalUrl);

    const jsonLd =
      baseName === "index"
        ? {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: canonicalUrl,
            description,
          }
        : detailEntry
          ? {
              "@context": "https://schema.org",
              "@type": detailEntry.kind === "program" ? "SoftwareApplication" : "CreativeWork",
              name: detailEntry.title,
              description,
              url: canonicalUrl,
              image: imageUrl,
            }
          : {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: document.title,
              description,
              url: canonicalUrl,
            };

    ensureJsonLd(jsonLd);
  };

  window.EA_BEHAVIORS = {
    applyFilters,
    initFilters,
    initSearch,
    initCardLinks,
    initUXEnhancements,
    refreshCardSurfaces,
    syncNavigationState,
    syncPageTitle,
    syncSeoMeta,
  };
})();
