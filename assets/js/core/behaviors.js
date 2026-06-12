(function () {
  const esc = window.EA_UTILS?.esc || ((value) => String(value ?? ""));

  const applyFilters = (scope, filterState) => {
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
    syncFilterSummaries(filterState);
  };

  const syncFilterSummaries = (filterState) => {
    document.querySelectorAll("[data-filter-scope]").forEach((section) => {
      const scope = section.getAttribute("data-filter-scope");
      const summary = section.querySelector(".filter-summary");
      if (!scope || !summary) return;
      const cards = [...document.querySelectorAll("[data-filter-card]")];
      const visible = cards.filter((card) => !card.hidden).length;
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
    document.querySelectorAll("[data-filter-scope]").forEach((section) => {
      const scope = section.getAttribute("data-filter-scope");
      if (!scope) return;
      if (!filterState.has(scope)) filterState.set(scope, {});

      section.querySelectorAll("[data-filter-toggle]").forEach((button) => {
        if (button.dataset.boundFilterToggle === "true") return;
        button.dataset.boundFilterToggle = "true";

        button.addEventListener("click", () => {
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

          applyFilters(scope, filterState);
        });
      });
    });
  };

  const initSearch = (searchState, rerender) => {
    const input = document.querySelector("[data-search-input]");
    if (input) {
      input.value = searchState.query;
      if (input.dataset.boundSearchInput !== "true") {
        input.dataset.boundSearchInput = "true";
        input.addEventListener("input", () => {
          searchState.query = input.value.trim().toLowerCase();
          rerender();
        });
      }
    }

    document.querySelectorAll("[data-search-status-chip]").forEach((chip) => {
      if (chip.dataset.boundSearchStatus === "true") return;
      chip.dataset.boundSearchStatus = "true";
      chip.addEventListener("click", () => {
        searchState.status = chip.getAttribute("data-value") || "all";
        rerender();
      });
    });

    document.querySelectorAll("[data-search-kind-chip]").forEach((chip) => {
      if (chip.dataset.boundSearchKind === "true") return;
      chip.dataset.boundSearchKind = "true";
      chip.addEventListener("click", () => {
        searchState.kind = chip.getAttribute("data-value") || "all";
        rerender();
      });
    });
  };

  const initCardLinks = () => {
    document.querySelectorAll("[data-project-detail-link], [data-card-link]").forEach((card) => {
      if (card.dataset.boundProjectDetailLink === "true") return;
      card.dataset.boundProjectDetailLink = "true";
      const target = card.getAttribute("data-project-detail-link") || card.getAttribute("data-card-link");
      if (!target) return;

      const navigate = () => {
        window.location.href = target;
      };

      card.addEventListener("click", (event) => {
        if (event.target.closest("a,button,input,select,textarea,label,.taxonomy-pill")) return;
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

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.setProperty("--scroll-progress", String(value));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  };

  const initReveal = () => {
    const targets = document.querySelectorAll(".zone-card, .panel, .project-card, .program-card, .archive-card, .cross-nav-card");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
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
      observer.observe(target);
    });
  };

  const initCardSpotlight = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll(".project-card, .program-card, .archive-card, .panel, .cross-nav-card, .stat-card").forEach((card) => {
      if (card.dataset.boundSpotlight === "true") return;
      card.dataset.boundSpotlight = "true";
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
        card.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
      });
    });
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
      section.append(summary);

      summary.querySelector("[data-filter-reset]")?.addEventListener("click", () => {
        filterState.set(scope, {});
        section.querySelectorAll("[data-filter-toggle]").forEach((chip) => {
          const isAll = chip.getAttribute("data-filter-value") === "all";
          chip.classList.toggle("is-active", isAll);
          chip.setAttribute("aria-pressed", isAll ? "true" : "false");
        });
        applyFilters(scope, filterState);
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
        applyFilters(scope, filterState);
      });

      section.addEventListener("click", (event) => {
        if (event.target.closest("[data-filter-toggle]")) requestAnimationFrame(() => syncFilterSummaries(filterState));
      });
      syncFilterSummaries(filterState);
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
          <input type="search" placeholder="Jump to a page, project, program..." data-command-input />
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

  const initTaxonomyPills = () => {
    document.querySelectorAll(".taxonomy-pill").forEach((pill) => {
      if (pill.dataset.boundTaxonomyPill === "true") return;
      pill.dataset.boundTaxonomyPill = "true";
      const toggle = (event) => {
        event?.preventDefault();
        event?.stopPropagation();
        const picked = !pill.classList.contains("is-picked");
        pill.classList.toggle("is-picked", picked);
        pill.setAttribute("aria-pressed", picked ? "true" : "false");
        pill.closest(".project-card, .program-card, .archive-card, .panel")?.classList.toggle("has-picked-taxonomy", picked);
      };
      pill.addEventListener("click", toggle);
      pill.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        toggle(event);
      });
    });
  };

  const slugify = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

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

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        const id = active.target.id;
        rail.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("data-section-target") === id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.12, 0.35, 0.6] },
    );
    headings.forEach((heading) => observer.observe(heading));
  };

  const cardText = (card, selector) => card.querySelector(selector)?.textContent.trim() || "";

  const initQuickView = () => {
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

    document.querySelectorAll(".project-card, .program-card, .archive-card, .panel.card-link-surface").forEach((card) => {
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

  const initUXEnhancements = (filterState) => {
    initScrollProgress();
    initReveal();
    initCardSpotlight();
    initDragRails();
    initFilterSummaries(filterState);
    initCommandPalette();
    initImageLightbox();
    initTaxonomyPills();
    initSectionRail();
    initQuickView();
    initUXDock();
  };

  const syncNavigationState = (current) => {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const syncPageTitle = ({ current, entityById, collectionById }) => {
    if (current === "detail") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) || collectionById(id) : null;
      if (entry) document.title = `${entry.title} - Electronic Artefacts`;
      return;
    }

    if (current === "project-rl") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) : null;
      if (entry) document.title = `${entry.title} RL - Electronic Artefacts`;
      return;
    }

    if (current === "programs") document.title = "Programs - Electronic Artefacts";
    if (current === "projects") document.title = "Projects - Electronic Artefacts";
    if (current === "search") document.title = "Search - Electronic Artefacts";
  };

  window.EA_BEHAVIORS = {
    applyFilters,
    initFilters,
    initSearch,
    initCardLinks,
    initUXEnhancements,
    syncNavigationState,
    syncPageTitle,
  };
})();
