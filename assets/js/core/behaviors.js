(function () {
  const esc = window.EA_UTILS?.esc || ((value) => String(value ?? ""));
  const isFrench = () => window.EA_I18N?.locale === "fr";
  const translate = (value) => window.EA_I18N?.translateText?.(value) || value;
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
  const trackAnalytics = (eventName, params) => window.EA_ANALYTICS?.track?.(eventName, params);

  const initLanguageSwitcher = async () => {
    const root = document.querySelector("[data-language-switcher]");
    if (!root || root.dataset.boundLanguageSwitcher === "true") return;
    root.dataset.boundLanguageSwitcher = "true";

    const storageKey = "ea:language";
    const supported = ["en", "fr"];
    const labels = { en: "EN", fr: "FR" };
    const trigger = root.querySelector("[data-language-trigger]");
    const menu = root.querySelector("[data-language-menu]");
    const current = root.querySelector("[data-language-current]");
    const status = root.querySelector("[data-language-status]");
    const options = [...root.querySelectorAll("[data-language-option]")];
    const translate = window.EA_I18N?.translateText || ((value) => value);

    const normalizePath = (value) => {
      const url = new URL(value, window.location.origin);
      let path = url.pathname || "/";
      if (path.endsWith("/index.html")) path = `${path.slice(0, -"index.html".length)}`;
      if (!path.endsWith("/") && !path.includes(".")) path = `${path}/`;
      return path || "/";
    };

    const routeLocale = (path) => path.startsWith("/fr/") || path === "/fr" ? "fr" : "en";

    const preferredFromBrowser = () => {
      const languages = navigator.languages?.length ? navigator.languages : [navigator.language].filter(Boolean);
      const match = languages.map((language) => String(language).toLowerCase().split("-")[0]).find((language) => supported.includes(language));
      return match || "en";
    };

    const readPreference = () => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        return supported.includes(stored) ? stored : null;
      } catch {
        return null;
      }
    };

    const writePreference = (language) => {
      try {
        window.localStorage.setItem(storageKey, language);
      } catch {
        return;
      }
    };

    const fetchAlternates = async () => {
      try {
        const response = await fetch("/generated/i18n-alternates.json", { credentials: "same-origin" });
        if (!response.ok) return {};
        return await response.json();
      } catch {
        return {};
      }
    };

    const alternates = await fetchAlternates();
    const currentUrl = new URL(window.location.href, window.location.origin);
    const currentPath = normalizePath(currentUrl.href);
    const currentAlternates = alternates[currentPath] || alternates[normalizePath(currentPath)] || { [routeLocale(currentPath)]: currentPath };
    const preserveCurrentUrlState = (target) => {
      const targetUrl = new URL(target, window.location.origin);
      if (!targetUrl.search && currentUrl.search) targetUrl.search = currentUrl.search;
      if (!targetUrl.hash && currentUrl.hash) targetUrl.hash = currentUrl.hash;
      return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
    };

    const setOpen = (open) => {
      root.classList.toggle("is-open", open);
      trigger?.setAttribute("aria-expanded", open ? "true" : "false");
      if (menu) menu.hidden = !open;
      if (open) {
        window.requestAnimationFrame(() => {
          const checked = root.querySelector('[data-language-option][aria-checked="true"]');
          if (checked instanceof HTMLElement) checked.focus({ preventScroll: true });
        });
      }
    };

    const sync = (language) => {
      if (current) current.textContent = labels[language] || language.toUpperCase();
      let availableCount = 0;
      options.forEach((option) => {
        const optionLanguage = option.getAttribute("data-language-option");
        const available = Boolean(currentAlternates[optionLanguage]);
        if (available) availableCount += 1;
        option.setAttribute("aria-checked", optionLanguage === language ? "true" : "false");
        option.classList.toggle("is-unavailable", !available);
        option.title = available ? "" : translate("Translation not available yet");
      });
      if (status) {
        const label = language === "fr" ? "Français actif" : "English active";
        status.textContent = `${translate(label)} · ${availableCount}/${supported.length} ${translate("available")}`;
      }
      document.documentElement.dataset.preferredLanguage = language;
    };

    const navigateTo = (language, manual = false) => {
      const target = currentAlternates[language];
      const active = routeLocale(currentPath);
      sync(language);
      if (target && normalizePath(target) !== currentPath) {
        window.location.assign(preserveCurrentUrlState(target));
        return;
      }
      if (manual && language !== active && !target) {
        toast(translate(language === "fr" ? "French version not available yet" : "English version not available yet"));
      }
    };

    const stored = readPreference();
    const preferred = stored || preferredFromBrowser();
    sync(stored || routeLocale(currentPath));
    if (preferred !== routeLocale(currentPath) && currentAlternates[preferred]) navigateTo(preferred);

    trigger?.addEventListener("click", () => setOpen(!root.classList.contains("is-open")));
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const language = option.getAttribute("data-language-option");
        if (!supported.includes(language)) return;
        setOpen(false);
        if (!currentAlternates[language]) {
          navigateTo(language, true);
          return;
        }
        writePreference(language);
        navigateTo(language, true);
      });
    });

    menu?.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const activeIndex = Math.max(0, options.indexOf(document.activeElement));
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (activeIndex + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      options[nextIndex]?.focus();
    });

    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && root.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
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
      if (count) count.textContent = isFrench() ? `${visible} visibles` : `${visible} visible`;
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

  const initEngagementPanels = () => {
    document.querySelectorAll("[data-engagement-panel]").forEach((panel) => {
      if (panel.dataset.boundEngagement === "true") return;
      panel.dataset.boundEngagement = "true";

      const rawKey = panel.getAttribute("data-like-key") || window.location.pathname || "page";
      const shareButton = panel.querySelector("[data-share-button]");
      const feedback = panel.querySelector("[data-engagement-feedback]");

      const setFeedback = (message) => {
        if (!feedback) return;
        feedback.textContent = message;
        window.clearTimeout(panel._engagementFeedbackTimer);
        panel._engagementFeedbackTimer = window.setTimeout(() => {
          feedback.textContent = "";
        }, 2200);
      };

      shareButton?.addEventListener("click", async () => {
        const shareData = {
          title: document.title || "Electronic Artefacts",
          text: document.querySelector('meta[name="description"]')?.getAttribute("content") || "Electronic Artefacts article",
          url: window.location.href,
        };
        const trackShare = (method) => {
          window.EA_ANALYTICS?.track?.("share", {
            method,
            content_type: "page",
            item_id: rawKey,
          });
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
            trackShare("native_share");
            setFeedback(translate("Share sheet opened."));
            return;
          }
          await navigator.clipboard.writeText(shareData.url);
          trackShare("clipboard");
          setFeedback(translate("Link copied."));
        } catch {
          window.EA_ANALYTICS?.track?.("ea_ui_action", {
            action: "share_unavailable",
            link_location: "engagement_panel",
          });
          setFeedback(translate("Share unavailable."));
        }
      });
    });
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

  const initCapabilityMaps = (root = document) => {
    root.querySelectorAll("[data-capability-map]").forEach((map) => {
      if (map.dataset.boundCapabilityMap === "true") return;
      map.dataset.boundCapabilityMap = "true";

      const nodes = [...map.querySelectorAll("[data-capability-node]")];
      const kicker = map.querySelector("[data-capability-reader-kicker]");
      const title = map.querySelector("[data-capability-reader-title]");
      const copy = map.querySelector("[data-capability-reader-copy]");
      const tools = map.querySelector("[data-capability-reader-tools]");
      const outputs = map.querySelector("[data-capability-reader-outputs]");
      if (!nodes.length || !kicker || !title || !copy || !tools || !outputs) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactLayoutQuery = window.matchMedia("(max-width: 48rem)");
      let rafId = 0;
      let width = 1;
      let height = 1;
      let frameActive = false;
      let compactLayout = compactLayoutQuery.matches;
      const bubbleState = [];

      const resetBubbleStyles = () => {
        nodes.forEach((node) => {
          node.style.removeProperty("will-change");
          node.style.removeProperty("left");
          node.style.removeProperty("top");
          node.style.removeProperty("width");
          node.style.removeProperty("height");
        });
      };

      const renderTokens = (target, value) => {
        target.replaceChildren(
          ...String(value || "")
            .split("|")
            .filter(Boolean)
            .map((label) => {
              const token = document.createElement("span");
              token.textContent = label;
              return token;
            }),
        );
      };

      const activate = (node) => {
        nodes.forEach((candidate) => {
          const isActive = candidate === node;
          candidate.classList.toggle("is-active", isActive);
          candidate.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        kicker.textContent = node.dataset.capabilityKicker || "";
        title.textContent = node.dataset.capabilityTitle || "";
        copy.textContent = node.dataset.capabilityCopy || "";
        renderTokens(tools, node.dataset.capabilityTools);
        renderTokens(outputs, node.dataset.capabilityOutputs);
      };

      const measure = () => {
        const rect = map.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
      };

      const initBubbleState = () => {
        bubbleState.length = 0;
        nodes.forEach((node, index) => {
          const computed = window.getComputedStyle(node);
          const leftPct = Number.parseFloat(
            computed.getPropertyValue("--cap-x")
            || node.style.getPropertyValue("--cap-x")
            || node.dataset.capabilityX
            || "50",
          );
          const topPct = Number.parseFloat(
            computed.getPropertyValue("--cap-y")
            || node.style.getPropertyValue("--cap-y")
            || node.dataset.capabilityY
            || "50",
          );
          const sizeValue = computed.getPropertyValue("--cap-size")
            || node.style.getPropertyValue("--cap-size")
            || node.dataset.capabilitySize
            || "7rem";
          const baseWidth = node.getBoundingClientRect().width || (Number.parseFloat(sizeValue) * 16) || 112;
          const baseR = Math.max(44, baseWidth / 2);
          const x = (leftPct / 100) * width;
          const y = (topPct / 100) * height;
          bubbleState.push({
            el: node,
            ax: x,
            ay: y,
            x,
            y,
            px: x,
            py: y,
            r: baseR,
            baseR,
            hover: index === 0,
            phase: index * 1.17,
            vx: (index % 2 ? -1 : 1) * 0.08,
            vy: (index % 3 - 1) * 0.06,
          });
          node.style.willChange = "left, top, width, height, transform";
        });
      };

      const syncInfo = (node) => {
        if (!node) return;
        activate(node);
      };

      const frame = () => {
        if (compactLayout || !bubbleState.length) return;
        const hoverScale = 1;
        const iterations = 5;
        const time = performance.now() * 0.001;

        bubbleState.forEach((bubble) => {
          bubble.px = bubble.x;
          bubble.py = bubble.y;
        });

        bubbleState.forEach((bubble) => {
          const driftX = 0;
          const driftY = 0;
          const targetX = bubble.ax + driftX;
          const targetY = bubble.ay + driftY;
          bubble.vx += (targetX - bubble.x) * 0.0009;
          bubble.vy += (targetY - bubble.y) * 0.0009;
          bubble.vx *= 0.985;
          bubble.vy *= 0.985;
          bubble.x += bubble.vx;
          bubble.y += bubble.vy;
        });

        for (let iter = 0; iter < iterations; iter += 1) {
          for (let i = 0; i < bubbleState.length; i += 1) {
            for (let j = i + 1; j < bubbleState.length; j += 1) {
              const a = bubbleState[i];
              const b = bubbleState[j];
              let dx = b.x - a.x;
              let dy = b.y - a.y;
              let distSq = dx * dx + dy * dy;
              if (!distSq) {
                dx = 0.0001;
                dy = 0.0001;
                distSq = dx * dx + dy * dy;
              }
              const dist = Math.sqrt(distSq);
              const targetRa = a.hover ? a.baseR * hoverScale : a.baseR;
              const targetRb = b.hover ? b.baseR * hoverScale : b.baseR;
              const minDist = targetRa + targetRb + 24;
              if (dist < minDist) {
                const overlap = minDist - dist;
                const nx = dx / dist;
                const ny = dy / dist;
                const corr = overlap * 0.5;
                a.x -= nx * corr;
                a.y -= ny * corr;
                b.x += nx * corr;
                b.y += ny * corr;
              }
            }
          }
        }

        bubbleState.forEach((bubble) => {
          const targetR = bubble.hover ? bubble.baseR * hoverScale : bubble.baseR;
          bubble.r += (targetR - bubble.r) * 0.18;
          const r = bubble.r;
          bubble.x = Math.min(Math.max(bubble.x, r), width - r);
          bubble.y = Math.min(Math.max(bubble.y, r), height - r);

          bubble.el.style.left = `${(bubble.x / width) * 100}%`;
          bubble.el.style.top = `${(bubble.y / height) * 100}%`;
          bubble.el.style.width = `${bubble.r * 2}px`;
          bubble.el.style.height = `${bubble.r * 2}px`;
        });

        rafId = window.requestAnimationFrame(frame);
      };

      const start = () => {
        if (frameActive || reduceMotion || compactLayout) return;
        frameActive = true;
        rafId = window.requestAnimationFrame(frame);
      };

      const stop = () => {
        frameActive = false;
        window.cancelAnimationFrame(rafId);
      };

      if (!compactLayout) {
        measure();
        initBubbleState();
      }

      const syncFromPointer = (node) => {
        bubbleState.forEach((bubble) => {
          bubble.hover = bubble.el === node;
          const isActive = bubble.el === node;
          bubble.el.classList.toggle("is-active", isActive);
          bubble.el.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        syncInfo(node);
        start();
      };

      const moveSelection = (node, direction) => {
        const currentIndex = nodes.indexOf(node);
        const nextIndex = Math.min(nodes.length - 1, Math.max(0, currentIndex + direction));
        const nextNode = nodes[nextIndex];
        if (!nextNode || nextNode === node) return;
        syncFromPointer(nextNode);
        if (compactLayout) nextNode.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
        nextNode.focus({ preventScroll: true });
      };

      nodes.forEach((node) => {
        node.addEventListener("pointerenter", () => syncFromPointer(node));
        node.addEventListener("focus", () => syncFromPointer(node));
        node.addEventListener("click", () => syncFromPointer(node));
        node.addEventListener("keydown", (event) => {
          if (!compactLayout) return;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            moveSelection(node, 1);
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            moveSelection(node, -1);
          }
        });
      });

      if (bubbleState[0]) activate(bubbleState[0].el);
      if (!reduceMotion) start();

      const resize = () => {
        const nextCompactLayout = compactLayoutQuery.matches;
        if (nextCompactLayout) {
          if (!compactLayout) {
            compactLayout = true;
            stop();
            bubbleState.length = 0;
            resetBubbleStyles();
          }
          return;
        }

        if (compactLayout) {
          compactLayout = false;
          measure();
          initBubbleState();
          if (!reduceMotion) start();
          return;
        }

        const previousWidth = width;
        const previousHeight = height;
        measure();
        const scaleX = width / previousWidth;
        const scaleY = height / previousHeight;
        bubbleState.forEach((bubble) => {
          bubble.x *= scaleX;
          bubble.y *= scaleY;
          bubble.px *= scaleX;
          bubble.py *= scaleY;
        });
      };

      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => {
          resize();
        });
        observer.observe(map);
      } else {
        window.addEventListener("resize", resize, { passive: true });
      }
      compactLayoutQuery.addEventListener?.("change", resize);
    });
  };

  const initProgressiveGrids = (root = document) => {
    root.querySelectorAll("[data-progressive-grid]").forEach((grid) => {
      if (grid.dataset.boundProgressiveGrid === "true") return;
      grid.dataset.boundProgressiveGrid = "true";
      const items = [...grid.querySelectorAll("[data-progressive-grid-item]")];
      const more = grid.querySelector("[data-progressive-grid-more]");
      if (!items.length || !more) return;

      const initialCount = Number(grid.dataset.initialCount) || 12;
      const step = Number(grid.dataset.loadStep) || 12;
      let visibleCount = Math.min(initialCount, items.length);
      const render = () => {
        items.forEach((item, index) => {
          item.hidden = index >= visibleCount;
        });
        more.hidden = visibleCount >= items.length;
      };
      more.addEventListener("click", () => {
        visibleCount = Math.min(items.length, visibleCount + step);
        render();
        items[Math.min(visibleCount - step, items.length - 1)]?.querySelector("a")?.focus({ preventScroll: true });
      });
      render();
    });
  };

  const initAmbientField = () => {
    if (document.querySelector("[data-ambient-field]")) return;
    const root = document.createElement("div");
    root.className = "ambient-field";
    root.setAttribute("data-ambient-field", "");
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = "<canvas></canvas>";
    document.body.prepend(root);

    const canvas = root.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = 0;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const anchors = [
        { x: 0.2, y: 0.22, spreadX: 0.34, spreadY: 0.26, warmth: 1 },
        { x: 0.75, y: 0.34, spreadX: 0.3, spreadY: 0.24, warmth: 0.78 },
        { x: 0.45, y: 0.74, spreadX: 0.42, spreadY: 0.2, warmth: 0.9 },
      ];
      const count = Math.min(150, Math.max(72, Math.round((width * height) / 14500)));
      particles = Array.from({ length: count }, (_, index) => {
        const anchor = anchors[index % anchors.length];
        const angle = index * 2.399963229728653;
        const ring = Math.sqrt(((index * 37) % 101) / 101);
        const offsetX = Math.cos(angle) * ring * width * anchor.spreadX;
        const offsetY = Math.sin(angle * 1.17) * ring * height * anchor.spreadY;
        const haze = index % 5 === 0;
        return {
          x: anchor.x * width + offsetX,
          y: anchor.y * height + offsetY,
          driftX: 8 + ((index * 11) % 23),
          driftY: 7 + ((index * 17) % 21),
          phase: index * 0.73,
          phaseAlt: index * 1.19,
          radius: haze ? 16 + (index % 7) * 2.8 : 1.2 + (index % 6) * 0.55,
          alpha: haze ? 0.022 + (index % 4) * 0.006 : 0.055 + (index % 5) * 0.013,
          warmth: anchor.warmth,
          haze,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((particle) => {
        const driftScale = reduceMotion ? 0 : 1;
        const x =
          particle.x +
          Math.sin(time * 0.13 + particle.phase) * particle.driftX * driftScale +
          Math.sin(time * 0.07 + particle.phaseAlt) * particle.driftY * 0.45 * driftScale;
        const y =
          particle.y +
          Math.cos(time * 0.11 + particle.phaseAlt) * particle.driftY * driftScale +
          Math.sin(time * 0.06 + particle.phase) * particle.driftX * 0.38 * driftScale;
        const pulse = reduceMotion ? 0.5 : (Math.sin(time * 0.42 + particle.phase) + 1) * 0.5;
        const radius = particle.radius + (particle.haze ? pulse * 4.5 : pulse * 0.85);
        const alpha = particle.alpha * (0.68 + pulse * 0.38);

        if (particle.haze) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, `rgba(247,244,239,${(alpha * particle.warmth).toFixed(3)})`);
          gradient.addColorStop(0.48, `rgba(234,220,207,${(alpha * 0.46).toFixed(3)})`);
          gradient.addColorStop(1, "rgba(247,244,239,0)");
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = `rgba(247,244,239,${alpha.toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";

      if (!reduceMotion && !document.hidden) rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (rafId || reduceMotion || document.hidden) return;
      rafId = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    resize();
    draw();
    window.addEventListener("resize", () => {
      resize();
      if (reduceMotion) draw();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    start();
  };

  const makeEntryHref = (item) => {
    if (!item) return "./index.html";
    const canonicalRoute = window.EA_CATALOG?.routeFor?.(item);
    if (canonicalRoute) return canonicalRoute;
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
      document.body.classList.toggle("is-page-scrolled", window.scrollY > 140);
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
    root.querySelectorAll(".project-card, .program-card, .archive-card, .panel, .cross-nav-card, .stat-card, .signature-banner, .detail-hero").forEach((card) => {
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
    const textSelector = [
      "input",
      "textarea",
      "[contenteditable='true']",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "blockquote",
      "figcaption",
      "td",
      "th",
      ".lede",
      ".eyebrow",
      ".tag",
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
    let hoveringText = false;
    let frame = 0;

    const resolveScale = () => {
      targetScale = hoveringText ? 1 : pointerDown ? (hoveringInteractive ? 1.16 : 0.82) : hoveringInteractive ? 1.52 : 1;
      cursor.classList.toggle("is-interactive", hoveringInteractive);
      cursor.classList.toggle("is-pressed", pointerDown);
      cursor.classList.toggle("is-text", hoveringText);
    };

    const hasActiveTextSelection = () => {
      const activeElement = document.activeElement;
      const hasInputSelection = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement
        ? activeElement.selectionStart !== activeElement.selectionEnd
        : false;
      return hasInputSelection || Boolean(window.getSelection?.()?.toString());
    };

    const syncSelectionState = () => {
      cursor.classList.toggle("is-selecting", hasActiveTextSelection());
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
        const isEditableText = Boolean(event.target.closest("input, textarea, [contenteditable='true']"));
        const nextHoveringText = isEditableText || (!nextHoveringInteractive && Boolean(event.target.closest(textSelector)));
        if (nextHoveringInteractive !== hoveringInteractive) {
          hoveringInteractive = nextHoveringInteractive;
          resolveScale();
        }
        if (nextHoveringText !== hoveringText) {
          hoveringText = nextHoveringText;
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
      syncSelectionState();
      scheduleRender();
    });
    document.addEventListener("selectionchange", syncSelectionState);
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
          <span data-filter-count>${isFrench() ? "0 visibles" : "0 visible"}</span>
          <div class="active-filter-tray" data-active-filter-tray></div>
        </div>
        <button class="filter-reset" type="button" data-filter-reset>${esc(translate("Reset filters"))}</button>
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
    button.setAttribute("title", "Open quick navigation");
    button.innerHTML = `<span>${esc(translate("Search"))}</span><kbd>⌘K</kbd>`;

    const palette = document.createElement("div");
    palette.className = "command-palette";
    palette.hidden = true;
    palette.setAttribute("data-command-palette", "");
    palette.innerHTML = `
      <div class="command-palette__backdrop" data-command-close></div>
      <section class="command-palette__panel" role="dialog" aria-modal="true" aria-label="${esc(translate("Quick navigation"))}">
        <div class="command-palette__search">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="${esc(translate("Search pages, projects and programs..."))}" data-command-input />
          <button type="button" data-command-close aria-label="${esc(translate("Close quick navigation"))}">Esc</button>
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
    if (window.matchMedia("(max-width: 64rem)").matches) return;
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
    if (window.matchMedia("(max-width: 48rem)").matches) return;
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
        const mediaNode = card.querySelector(".card-media-plate img");
        const cardImageVar = getComputedStyle(card).getPropertyValue("--card-image").trim();
        const cardImageMatch = cardImageVar.match(/url\((['\"]?)(.*?)\1\)/);
        const mediaSrc = mediaNode?.currentSrc || mediaNode?.src || cardImageMatch?.[2] || "";
        const tags = [...card.querySelectorAll(".taxonomy-pill, .status-badge, .entity-badge")]
          .slice(0, 8)
          .map((node) => `<span class="${esc(node.className)}">${esc(node.textContent.trim())}</span>`)
          .join("");
        body.innerHTML = `
          ${mediaSrc ? `<div class="quick-view__media" style="background-image:url('${esc(mediaSrc)}')" aria-hidden="true"></div>` : ""}
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

  const initProjectButterflies = (root = document) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.querySelectorAll("[data-project-butterfly]").forEach((butterfly) => {
      if (butterfly.dataset.boundProjectButterfly === "true") return;
      const stage = butterfly.querySelector(".project-butterfly__stage");
      const left = butterfly.querySelector(".project-butterfly__hinge--left");
      const right = butterfly.querySelector(".project-butterfly__hinge--right");
      if (!stage || !left || !right) return;
      butterfly.dataset.boundProjectButterfly = "true";

      const random = (min, max) => min + Math.random() * (max - min);
      let phase = random(0, Math.PI * 2);
      let amplitude = random(11, 17);
      let targetAmplitude = amplitude;
      let frequency = random(0.48, 0.72);
      let targetFrequency = frequency;
      let nextShift = 0;
      let boost = 0;
      let boostUntil = 0;
      let last = performance.now();

      const shiftCadence = (now) => {
        if (now < nextShift) return;
        const resting = Math.random() < 0.22;
        targetAmplitude = resting ? random(3, 7) : random(12, 22);
        targetFrequency = resting ? random(0.16, 0.32) : random(0.5, 1.08);
        nextShift = now + random(resting ? 2300 : 1300, resting ? 6200 : 3900);
      };

      const flutter = () => {
        boost = Math.max(boost, 1);
        boostUntil = performance.now() + 900;
        butterfly.classList.add("is-fluttering");
        window.setTimeout(() => butterfly.classList.remove("is-fluttering"), 940);
      };

      butterfly.addEventListener("click", flutter);
      butterfly.addEventListener("pointerenter", () => {
        targetAmplitude = Math.max(targetAmplitude, 20);
        targetFrequency = Math.max(targetFrequency, 1.12);
      });

      const tick = (now) => {
        const dt = Math.min(52, now - last) / 1000;
        last = now;
        shiftCadence(now);
        boost *= Math.exp(-dt / 0.56);
        const lift = now < boostUntil ? 1 : 0;
        amplitude += (targetAmplitude - amplitude) * (1 - Math.exp(-dt / 0.85));
        frequency += (targetFrequency - frequency) * (1 - Math.exp(-dt / 0.9));
        phase += Math.PI * 2 * frequency * (1 + boost * 0.78) * dt;

        const flutterWave = Math.sin(phase) * amplitude * (1 + boost * 0.48);
        const asymmetry = Math.sin(now / 720 + 1.1) * 2.4;
        const torsion = Math.sin(now / 1040) * 4.2;
        const bob = Math.sin(now / 820) * 1.25 - lift * 2.2;
        const roll = Math.sin(now / 1680) * 2.6;

        stage.style.transform = `translate3d(0, ${bob.toFixed(2)}px, 0) rotateZ(${roll.toFixed(2)}deg)`;
        left.style.transform = `rotateZ(${-8 + torsion * 0.35}deg) rotateY(${(-flutterWave + asymmetry).toFixed(2)}deg) rotateX(${(torsion * 0.3).toFixed(2)}deg)`;
        right.style.transform = `rotateZ(${8 - torsion * 0.35}deg) rotateY(${(flutterWave + asymmetry).toFixed(2)}deg) rotateX(${(-torsion * 0.3).toFixed(2)}deg)`;
        window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
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
      <button type="button" data-ux-action="top" aria-label="Back to top" title="Back to top">↑</button>
      <button type="button" data-ux-action="compact" aria-label="Toggle compact view" title="Toggle compact view">▦</button>
      <button type="button" data-ux-action="vivid" aria-label="Toggle vivid mode" title="Toggle vivid mode">◐</button>
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

  const initProjectDossier = (root = document) => {
    root.querySelectorAll("[data-project-moodboard]").forEach((board) => {
      if (board.dataset.boundProjectMoodboard === "true") return;
      board.dataset.boundProjectMoodboard = "true";
      const filters = [...board.querySelectorAll("[data-project-mood-filter]")];
      const assets = [...board.querySelectorAll("[data-project-mood-asset]")];
      const activate = (filter) => {
        filters.forEach((button) => {
          const active = button.dataset.projectMoodFilter === filter;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", active ? "true" : "false");
        });
        assets.forEach((asset) => {
          const visible = filter === "all" || asset.dataset.moodKind === filter;
          asset.hidden = !visible;
          asset.classList.toggle("is-muted", !visible);
        });
      };
      filters.forEach((button) => {
        button.addEventListener("click", () => activate(button.dataset.projectMoodFilter || "all"));
      });
    });

    root.querySelectorAll("[data-project-tabs]").forEach((tabsRoot) => {
      if (tabsRoot.dataset.boundProjectTabs === "true") return;
      tabsRoot.dataset.boundProjectTabs = "true";
      tabsRoot.classList.add("is-tabbed");

      const tabs = [...tabsRoot.querySelectorAll("[data-project-tab]")];
      const panels = [...tabsRoot.querySelectorAll("[data-project-panel]")];
      const activate = (activeTab) => {
        const targetId = activeTab.getAttribute("aria-controls");
        tabs.forEach((tab) => {
          const active = tab === activeTab;
          tab.classList.toggle("is-active", active);
          tab.setAttribute("aria-selected", active ? "true" : "false");
          tab.tabIndex = active ? 0 : -1;
        });
        panels.forEach((panel) => {
          panel.classList.toggle("is-active", panel.id === targetId);
        });
      };

      tabs.forEach((tab, index) => {
        tab.tabIndex = tab.classList.contains("is-active") ? 0 : -1;
        tab.addEventListener("click", () => activate(tab));
        tab.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const nextIndex =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? tabs.length - 1
                : event.key === "ArrowRight"
                  ? (index + 1) % tabs.length
                  : (index - 1 + tabs.length) % tabs.length;
          tabs[nextIndex].focus();
          activate(tabs[nextIndex]);
        });
      });
    });

    root.querySelectorAll("[data-project-process]").forEach((process) => {
      if (process.dataset.boundProjectProcess === "true") return;
      process.dataset.boundProjectProcess = "true";
      process.addEventListener("click", (event) => {
        const item = event.target.closest("[data-project-step]");
        if (!item || !process.contains(item)) return;
        process.querySelectorAll("[data-project-step]").forEach((step) => step.classList.remove("is-active"));
        item.classList.add("is-active");
      });
    });

    root.querySelectorAll("[data-project-graph]").forEach((graph) => {
      if (graph.dataset.boundProjectGraph === "true") return;
      graph.dataset.boundProjectGraph = "true";
      const detail = graph.querySelector("[data-project-graph-detail]");
      const label = detail?.querySelector("[data-project-graph-label]");
      const title = detail?.querySelector("[data-project-graph-title]");
      const statement = detail?.querySelector("[data-project-graph-statement]");
      const nodes = [...graph.querySelectorAll("[data-project-graph-node]")];
      const activate = (node) => {
        nodes.forEach((item) => item.classList.toggle("is-active", item === node));
        if (label) label.textContent = node.dataset.relationLabel || "";
        if (title) {
          title.textContent = node.dataset.relationTitle || "";
          title.setAttribute("href", node.dataset.relationHref || "#");
        }
        if (statement) statement.textContent = node.dataset.relationStatement || "";
      };
      nodes.forEach((node) => node.addEventListener("click", () => activate(node)));
    });
  };

  const initContactDiscovery = () => {
    const root = document.querySelector("[data-contact-discovery]");
    if (!root || root.dataset.boundContactDiscovery === "true") return;
    root.dataset.boundContactDiscovery = "true";

    const pathways = {
      build: {
        label: "Build Something",
        copy: "A client or commissioned project requiring strategy, design, technology or delivery.",
        keywords: ["website", "site", "platform", "software", "app", "application", "brand", "branding", "identity", "ux", "ui", "product", "tool", "interface", "development", "develop", "build", "company", "business"],
        questions: [
          ["stage", "Project stage", "select", ["New idea", "Existing project", "Redesign", "Active product"]],
          ["audience", "Who is it for?", "text", "Audience, users or community"],
          ["timeline", "Preferred timing", "select", ["Exploring", "1–2 months", "3–6 months", "6+ months"]],
          ["budget", "Indicative budget", "select", ["Not defined", "Under €5k", "€5k–€10k", "€10k–€25k", "€25k+"]],
          ["requirements", "Known requirements", "text", "Existing stack, integrations, content or constraints"],
        ],
      },
      vaste: {
        label: "Work With VASTE",
        copy: "A technical, design, pilot or research collaboration around the VASTE ecosystem.",
        keywords: ["vaste", "runtime", "graph", "extension", "plugin", "protocol", "infrastructure", "open source", "developer", "engineer", "academic"],
        questions: [
          ["background", "Your background", "text", "Engineering, design, research, institution…"],
          ["expertise", "Relevant expertise", "text", "Languages, systems, disciplines or methods"],
          ["interest", "Area of interest", "select", ["Runtime", "Graph systems", "Knowledge systems", "Design", "Research", "Pilot project"]],
          ["goal", "Collaboration goal", "text", "What would a useful collaboration produce?"],
        ],
      },
      support: {
        label: "Support The Ecosystem",
        copy: "An institutional, strategic, financial, educational or cultural partnership.",
        keywords: ["invest", "investor", "sponsor", "fund", "funding", "museum", "school", "university", "institution", "accelerator", "partner", "partnership", "supplier", "grant", "foundation"],
        questions: [
          ["organizationType", "Organization type", "select", ["Institution", "University / school", "Museum / cultural venue", "Investor / fund", "Sponsor", "Research organization", "Other"]],
          ["strategicInterest", "Strategic interest", "text", "Why does Electronic Artefacts fit your work?"],
          ["resources", "Potential contribution", "text", "Funding, venue, expertise, network, research access…"],
          ["objective", "Partnership objective", "text", "What should the relationship make possible?"],
        ],
      },
      creative: {
        label: "Creative & Artistic Collaboration",
        copy: "A shared cultural, visual, spatial, narrative or experimental project.",
        keywords: ["artist", "art", "designer", "photographer", "film", "filmmaker", "writer", "curator", "collective", "exhibition", "installation", "residency", "visual", "creative", "culture", "cultural"],
        questions: [
          ["discipline", "Primary discipline", "text", "Visual art, film, photography, writing, curation…"],
          ["medium", "Medium or format", "text", "Installation, exhibition, publication, digital work…"],
          ["references", "References or existing work", "text", "Links or a short description"],
          ["outcome", "Desired outcome", "text", "What would you like to create together?"],
        ],
      },
      label: {
        label: "Label & Publishing",
        copy: "A music, sound, audiovisual, release, distribution or artistic publishing conversation.",
        keywords: ["music", "musician", "album", "ep", "track", "release", "label", "sound", "audio", "audiovisual", "distribution", "publishing", "producer", "production", "composer"],
        questions: [
          ["format", "Project format", "select", ["Single / EP / album", "Sound design", "Audiovisual work", "Visual album", "Artistic publication", "Other"]],
          ["releaseStage", "Current stage", "select", ["Idea", "In production", "Finished material", "Seeking release", "Seeking distribution"]],
          ["material", "Existing material", "text", "Private link, portfolio or short description"],
          ["labelGoal", "Collaboration goal", "text", "Production, release, publishing, visuals, distribution…"],
        ],
      },
    };

    const tagRules = {
      Website: ["website", "site", "portfolio", "web"],
      Platform: ["platform", "marketplace", "community"],
      Software: ["software", "app", "application", "tool", "saas"],
      Branding: ["brand", "branding", "identity", "logo"],
      "Creative Direction": ["creative direction", "art direction", "direction"],
      "UX / UI": ["ux", "ui", "interface", "experience"],
      Development: ["development", "develop", "code", "technical", "engineering"],
      Photography: ["photography", "photographer", "photo"],
      VASTE: ["vaste"],
      Developer: ["developer", "engineer", "engineering", "code"],
      Research: ["research", "academic", "study", "laboratory", "lab"],
      Collaboration: ["collaborate", "collaboration", "contribute", "partner", "together"],
      Institution: ["institution", "museum", "university", "school", "foundation"],
      Partnership: ["partnership", "partner", "sponsor", "support"],
      "Cultural Sector": ["cultural", "culture", "museum", "arts"],
      Music: ["music", "album", "ep", "track", "musician", "producer"],
      Label: ["label", "release", "record"],
      Publishing: ["publishing", "publication", "release", "distribution"],
      Audiovisual: ["audiovisual", "film", "video", "motion"],
      Exhibition: ["exhibition", "installation", "residency", "gallery"],
      Investment: ["investor", "investment", "funding", "fund", "grant"],
    };

    const state = { intent: "", pathway: "build", tags: [], answers: {}, started: false, ready: false };
    const intent = root.querySelector("[data-contact-intent]");
    const workspace = root.querySelector("[data-contact-workspace]");
    const status = root.querySelector("[data-contact-status]");
    const pathwayTitle = root.querySelector("[data-contact-pathway-title]");
    const pathwayCopy = root.querySelector("[data-contact-pathway-copy]");
    const pathwayTray = root.querySelector("[data-contact-pathways]");
    const tagTray = root.querySelector("[data-contact-tags]");
    const questions = root.querySelector("[data-contact-questions]");
    const summary = root.querySelector("[data-contact-summary]");
    const submit = root.querySelector("[data-contact-submit]");
    const completeness = root.querySelector("[data-contact-completeness]");
    const customTag = root.querySelector("[data-contact-custom-tag]");
    const nameInput = root.querySelector("[data-contact-name]");
    const emailInput = root.querySelector("[data-contact-email]");
    const organizationInput = root.querySelector("[data-contact-organization]");
    const keywordMatches = (text, keyword) => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
    };

    const detectPathway = (text) => {
      const normalized = text.toLowerCase();
      const scores = Object.entries(pathways).map(([key, config]) => [
        key,
        config.keywords.reduce((score, keyword) => score + (keywordMatches(normalized, keyword) ? (keyword.includes(" ") ? 3 : 1) : 0), 0),
      ]);
      scores.sort((left, right) => right[1] - left[1]);
      return scores[0][1] > 0 ? scores[0][0] : "build";
    };

    const detectTags = (text) => {
      const normalized = text.toLowerCase();
      return Object.entries(tagRules)
        .filter(([, keywords]) => keywords.some((keyword) => keywordMatches(normalized, keyword)))
        .map(([tag]) => tag)
        .slice(0, 8);
    };

    const renderPathways = () => {
      pathwayTray.innerHTML = Object.entries(pathways)
        .map(([key, config]) => `<button type="button" class="contact-pathway${state.pathway === key ? " is-active" : ""}" data-contact-pathway="${esc(key)}" aria-pressed="${state.pathway === key ? "true" : "false"}">${esc(translate(config.label))}</button>`)
        .join("");
      pathwayTitle.textContent = translate(pathways[state.pathway].label);
      pathwayCopy.textContent = translate(pathways[state.pathway].copy);
    };

    const renderTags = () => {
      tagTray.innerHTML = state.tags.length
        ? state.tags.map((tag) => `<button type="button" class="contact-detected-tag" data-contact-remove-tag="${esc(tag)}" aria-label="Remove ${esc(tag)}"><span>✓</span>${esc(tag)}<b aria-hidden="true">×</b></button>`).join("")
        : `<p class="card__copy">${esc(translate("No specific signals detected yet. Add a little more context or create a tag."))}</p>`;
    };

    const renderQuestions = () => {
      const config = pathways[state.pathway];
      questions.innerHTML = config.questions
        .map(([key, label, type, options]) => {
          const value = state.answers[key] || "";
          if (type === "select") {
            return `<label class="contact-question"><span>${esc(translate(label))}</span><select data-contact-answer="${esc(key)}"><option value="">${esc(translate("Select an option"))}</option>${options.map((option) => `<option value="${esc(option)}"${value === option ? " selected" : ""}>${esc(translate(option))}</option>`).join("")}</select></label>`;
          }
          return `<label class="contact-question"><span>${esc(translate(label))}</span><input type="text" data-contact-answer="${esc(key)}" value="${esc(value)}" placeholder="${esc(translate(options))}" /></label>`;
        })
        .join("");
    };

    const briefText = () => {
      const config = pathways[state.pathway];
      const answerLines = config.questions
        .map(([key, label]) => state.answers[key] ? `${label}: ${state.answers[key]}` : "")
        .filter(Boolean);
      return [
        "Electronic Artefacts — Discovery Brief",
        "",
        `Pathway: ${config.label}`,
        `Intent: ${state.intent}`,
        state.tags.length ? `Signals: ${state.tags.join(", ")}` : "",
        ...answerLines,
        "",
        `Name: ${nameInput.value.trim()}`,
        `Email: ${emailInput.value.trim()}`,
        organizationInput.value.trim() ? `Organization: ${organizationInput.value.trim()}` : "",
      ].filter((line) => line !== "").join("\n");
    };

    const renderSummary = () => {
      const config = pathways[state.pathway];
      const answered = config.questions.filter(([key]) => state.answers[key]).length;
      const rows = [
        [translate("Pathway"), translate(config.label)],
        [translate("Intent"), state.intent],
        [translate("Signals"), state.tags.join(", ") || translate("To be clarified")],
        ...config.questions.filter(([key]) => state.answers[key]).map(([key, label]) => [translate(label), state.answers[key]]),
      ];
      summary.innerHTML = rows.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("");
      completeness.textContent = answered === config.questions.length
        ? translate("Brief ready")
        : isFrench() ? `${answered}/${config.questions.length} questions renseignées` : `${answered}/${config.questions.length} questions answered`;
      const subject = encodeURIComponent(`[${config.label}] ${state.intent.slice(0, 70) || "New discovery brief"}`);
      const contactValid = Boolean(nameInput.value.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      if (contactValid && !state.ready) {
        state.ready = true;
        trackAnalytics("ea_contact_brief_ready", {
          contact_pathway: state.pathway,
          answered_question_count: answered,
          detected_signal_count: state.tags.length,
        });
      }
      if (!contactValid) state.ready = false;
      submit.href = contactValid
        ? `mailto:electronic.artefacts@gmail.com?subject=${subject}&body=${encodeURIComponent(briefText())}`
        : "#contact-identity-title";
      submit.setAttribute("aria-disabled", contactValid ? "false" : "true");
      submit.classList.toggle("is-disabled", !contactValid);
    };

    const refresh = ({ resetAnswers = false } = {}) => {
      if (resetAnswers) state.answers = {};
      renderPathways();
      renderTags();
      renderQuestions();
      renderSummary();
    };

    const analyze = () => {
      state.intent = intent.value.trim();
      if (state.intent.length < 3) {
        workspace.hidden = true;
        status.textContent = translate("Start with a sentence. No formal brief required.");
        return;
      }
      state.pathway = detectPathway(state.intent);
      state.tags = detectTags(state.intent);
      if (!state.started) {
        state.started = true;
        trackAnalytics("ea_contact_discovery_start", {
          contact_pathway: state.pathway,
          detected_signal_count: state.tags.length,
        });
      }
      workspace.hidden = false;
      status.textContent = isFrench()
        ? `Un parcours probable et ${state.tags.length} signaux ont été identifiés localement.`
        : `A likely pathway and ${state.tags.length} signals were identified locally.`;
      refresh({ resetAnswers: true });
    };

    intent.addEventListener("input", analyze);
    intent.addEventListener("change", analyze);
    intent.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        analyze();
        workspace.querySelector("button, input, select")?.focus();
      }
    });

    pathwayTray.addEventListener("click", (event) => {
      const button = event.target.closest("[data-contact-pathway]");
      if (!button) return;
      state.pathway = button.getAttribute("data-contact-pathway");
      trackAnalytics("ea_contact_pathway_select", { contact_pathway: state.pathway });
      refresh({ resetAnswers: true });
    });
    tagTray.addEventListener("click", (event) => {
      const button = event.target.closest("[data-contact-remove-tag]");
      if (!button) return;
      state.tags = state.tags.filter((tag) => tag !== button.getAttribute("data-contact-remove-tag"));
      renderTags();
      renderSummary();
    });
    root.querySelector("[data-contact-add-tag]")?.addEventListener("click", () => {
      const value = customTag.value.trim();
      if (!value || state.tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) return;
      state.tags.push(value);
      customTag.value = "";
      renderTags();
      renderSummary();
    });
    customTag.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      root.querySelector("[data-contact-add-tag]")?.click();
    });
    questions.addEventListener("input", (event) => {
      const field = event.target.closest("[data-contact-answer]");
      if (!field) return;
      state.answers[field.getAttribute("data-contact-answer")] = field.value.trim();
      renderSummary();
    });
    [nameInput, emailInput, organizationInput].forEach((field) => field.addEventListener("input", renderSummary));
    submit.addEventListener("click", (event) => {
      if (submit.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        status.textContent = translate("Add your name and a valid email address before preparing the message.");
        (!nameInput.value.trim() ? nameInput : emailInput).focus();
        return;
      }
      trackAnalytics("generate_lead", {
        method: "contact_brief_email",
        contact_pathway: state.pathway,
        answered_question_count: pathways[state.pathway].questions.filter(([key]) => state.answers[key]).length,
        detected_signal_count: state.tags.length,
      });
    });
    root.querySelector("[data-contact-copy]")?.addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(briefText());
        button.textContent = translate("Brief copied");
        trackAnalytics("ea_contact_brief_copy", {
          contact_pathway: state.pathway,
          answered_question_count: pathways[state.pathway].questions.filter(([key]) => state.answers[key]).length,
        });
      } catch {
        button.textContent = translate("Copy unavailable");
      }
      window.setTimeout(() => { button.textContent = original; }, 1600);
    });

    const prompts = [
      translate("Tell us what you’re working on."),
      translate("What would you like to build together?"),
      translate("Describe the idea that needs a system."),
      translate("What should exist that doesn’t exist yet?"),
    ];
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let promptIndex = 0;
      let characterIndex = prompts[0].length;
      let deleting = true;
      const animatePrompt = () => {
        if (document.activeElement === intent || intent.value) {
          window.setTimeout(animatePrompt, 500);
          return;
        }

        const prompt = prompts[promptIndex];
        if (deleting) {
          characterIndex -= 1;
          intent.placeholder = prompt.slice(0, characterIndex);
          if (characterIndex === 0) {
            deleting = false;
            promptIndex = (promptIndex + 1) % prompts.length;
          }
        } else {
          const nextPrompt = prompts[promptIndex];
          characterIndex += 1;
          intent.placeholder = nextPrompt.slice(0, characterIndex);
          if (characterIndex === nextPrompt.length) deleting = true;
        }

        const pause = characterIndex === 0 ? 300 : characterIndex === prompts[promptIndex].length && deleting ? 1800 : deleting ? 42 : 68;
        window.setTimeout(animatePrompt, pause);
      };
      window.setTimeout(animatePrompt, 1800);
    }
  };

  const initIntentHeroes = (root = document) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const automaticLayerSelector = [
      ".intent-hero__copy > .eyebrow",
      ".intent-hero__copy > .display-title",
      ".intent-hero__copy > .lede",
      ".intent-hero__copy > .button-row",
      ".intent-hero__copy > .pill-cloud",
      ".intent-hero__stage-label",
    ].join(",");
    const activeLayerSelector = [
      "[data-depth]",
      ".intent-hero__copy .button",
      ".intent-hero__copy .chip",
      ".intent-hero__copy .tag",
      ".home-intent-stage__frame",
      ".home-intent-stage__channels a",
      ".intent-media-stack a",
      ".projects-hero__frame",
      ".archive-stack__sheet",
      ".research-constellation__node",
      ".about-orbit__node",
      ".contact-signal__card",
      ".knowledge-graph-stage__node",
      ".intent-hero__stats span",
      ".computation-field",
    ].join(",");
    const movableLayerSelector = [
      ".home-intent-stage__frame",
      ".home-intent-stage__channels a",
      ".intent-media-stack a",
      ".projects-hero__frame",
      ".archive-stack__sheet",
      ".research-constellation__node",
      ".about-orbit__core",
      ".about-orbit__node",
      ".contact-signal__card",
      ".knowledge-graph-stage__node",
      ".intent-hero__stats span",
      ".computation-field",
      "[data-forge-artifact]",
    ].join(",");
    const layerDepth = (layer) => {
      const explicit = Number.parseFloat(layer.getAttribute("data-depth") || "");
      if (Number.isFinite(explicit)) return explicit;
      if (layer.matches(".intent-hero__copy > .eyebrow")) return 0.18;
      if (layer.matches(".intent-hero__copy > .display-title")) return 0.3;
      if (layer.matches(".intent-hero__copy > .lede")) return 0.42;
      if (layer.matches(".intent-hero__copy > .button-row")) return 0.68;
      if (layer.matches(".intent-hero__copy > .pill-cloud")) return 0.55;
      if (layer.matches(".intent-hero__stage-label")) return 0.34;
      return 1;
    };

    root.querySelectorAll("[data-intent-stage]").forEach((stage) => {
      const scope = stage.closest(".intent-hero") || stage;
      if (scope.dataset.intentHeroBound === "true") return;
      scope.dataset.intentHeroBound = "true";
      stage.dataset.intentHeroBound = "true";

      const layers = [...new Set([...scope.querySelectorAll("[data-depth]"), ...scope.querySelectorAll(automaticLayerSelector)])];
      const activeLayers = [...scope.querySelectorAll(activeLayerSelector)];
      scope.classList.add("is-intent-ready");
      layers.forEach((layer) => {
        layer.style.setProperty("--intent-layer-depth", layerDepth(layer).toFixed(2));
      });

      const movableLayers = [...scope.querySelectorAll(movableLayerSelector)].filter((layer) => stage.contains(layer));
      let selectedMovableLayer = null;
      const selectMovableLayer = (layer) => {
        if (selectedMovableLayer === layer) return;
        if (selectedMovableLayer) {
          selectedMovableLayer.classList.remove("is-hero-selected");
          delete selectedMovableLayer.dataset.heroSelected;
        }
        selectedMovableLayer = layer;
        layer.classList.add("is-hero-selected");
        layer.dataset.heroSelected = "true";
      };
      movableLayers.forEach((layer) => {
        if (layer.dataset.heroMovableBound === "true") return;
        layer.dataset.heroMovableBound = "true";
        layer.dataset.heroMovable = "true";
        layer.draggable = false;
        layer.querySelectorAll("img").forEach((image) => {
          image.draggable = false;
        });

        let drag = null;
        let pendingPress = null;
        let suppressClickUntil = 0;
        const dragThreshold = 6;
        const currentDragX = () => Number.parseFloat(layer.dataset.heroDragX || "0") || 0;
        const currentDragY = () => Number.parseFloat(layer.dataset.heroDragY || "0") || 0;
        const clamp = (value, min, max) => {
          if (min > max) return (min + max) / 2;
          return Math.min(Math.max(value, min), max);
        };
        const commitPosition = () => {
          if (!drag) return;
          drag.frame = 0;
          const nextX = clamp(drag.requestedX, drag.minX, drag.maxX);
          const nextY = clamp(drag.requestedY, drag.minY, drag.maxY);
          layer.dataset.heroDragX = nextX.toFixed(1);
          layer.dataset.heroDragY = nextY.toFixed(1);
          layer.style.setProperty("--hero-drag-x", `${nextX.toFixed(1)}px`);
          layer.style.setProperty("--hero-drag-y", `${nextY.toFixed(1)}px`);
        };
        const startDrag = (event) => {
          if (!pendingPress || drag || event.pointerId !== pendingPress.pointerId) return false;
          const stageRect = stage.getBoundingClientRect();
          const layerRect = layer.getBoundingClientRect();
          const startX = currentDragX();
          const startY = currentDragY();
          const padding = 12;
          drag = {
            pointerId: event.pointerId,
            pointerStartX: pendingPress.x,
            pointerStartY: pendingPress.y,
            startX,
            startY,
            requestedX: startX,
            requestedY: startY,
            minX: startX + stageRect.left + padding - layerRect.left,
            maxX: startX + stageRect.right - padding - layerRect.right,
            minY: startY + stageRect.top + padding - layerRect.top,
            maxY: startY + stageRect.bottom - padding - layerRect.bottom,
            frame: 0,
          };
          pendingPress = null;
          scope.classList.add("is-hero-dragging");
          layer.classList.add("is-hero-dragging");
          return true;
        };
        const requestPosition = (clientX, clientY) => {
          if (!drag) return;
          drag.requestedX = drag.startX + clientX - drag.pointerStartX;
          drag.requestedY = drag.startY + clientY - drag.pointerStartY;
          if (!drag.frame) drag.frame = requestAnimationFrame(commitPosition);
        };
        const finishDrag = () => {
          pendingPress = null;
          if (!drag) return;
          if (drag.frame) {
            cancelAnimationFrame(drag.frame);
            commitPosition();
          }
          scope.classList.remove("is-hero-dragging");
          layer.classList.remove("is-hero-dragging");
          layer.releasePointerCapture?.(drag.pointerId);
          suppressClickUntil = performance.now() + 220;
          drag = null;
        };

        layer.addEventListener("pointerdown", (event) => {
          if (event.button !== 0 || drag || selectedMovableLayer !== layer) return;
          pendingPress = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
          layer.setPointerCapture?.(event.pointerId);
        });

        layer.addEventListener("pointermove", (event) => {
          if (!drag) {
            if (
              pendingPress &&
              event.pointerId === pendingPress.pointerId &&
              Math.hypot(event.clientX - pendingPress.x, event.clientY - pendingPress.y) >= dragThreshold
            ) {
              startDrag(event);
              event.preventDefault();
              requestPosition(event.clientX, event.clientY);
            }
            return;
          }
          if (event.pointerId !== drag.pointerId) return;
          event.preventDefault();
          requestPosition(event.clientX, event.clientY);
        });

        layer.addEventListener("pointerup", finishDrag);
        layer.addEventListener("pointercancel", finishDrag);
        layer.addEventListener("dragstart", (event) => event.preventDefault());
        layer.addEventListener("contextmenu", (event) => {
          if (drag) event.preventDefault();
        });
        layer.addEventListener("click", (event) => {
          if (performance.now() <= suppressClickUntil) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          if (selectedMovableLayer === layer) return;
          event.preventDefault();
          event.stopPropagation();
          selectMovableLayer(layer);
        }, true);
      });

      if (reduceMotion || coarsePointer || !finePointer || !layers.length) return;

      let frame = 0;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let targetSpotlight = 0;
      let currentSpotlight = 0;
      let activeLayer = null;

      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(render);
      };

      const setActiveLayer = (layer) => {
        if (activeLayer === layer) return;
        if (activeLayer) activeLayer.classList.remove("is-intent-layer-active");
        activeLayer = layer;
        if (activeLayer) activeLayer.classList.add("is-intent-layer-active");
        scope.classList.toggle("has-intent-layer-active", Boolean(activeLayer));
      };

      const clearActiveLayer = () => {
        setActiveLayer(null);
      };

      const updateTargetFromPoint = (clientX, clientY) => {
        const rect = scope.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(1, rect.width)));
        const y = Math.min(1, Math.max(0, (clientY - rect.top) / Math.max(1, rect.height)));
        targetX = (x - 0.5) * 2;
        targetY = (y - 0.5) * 2;
        targetSpotlight = 1;
        scope.style.setProperty("--intent-pointer-x", `${(x * 100).toFixed(2)}%`);
        scope.style.setProperty("--intent-pointer-y", `${(y * 100).toFixed(2)}%`);
        schedule();
      };

      const updateTargetFromElement = (element) => {
        if (!element?.getBoundingClientRect) return;
        const rect = element.getBoundingClientRect();
        updateTargetFromPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
      };

      const render = () => {
        currentX += (targetX - currentX) * 0.095;
        currentY += (targetY - currentY) * 0.095;
        currentSpotlight += (targetSpotlight - currentSpotlight) * 0.14;
        const intentEnergy = Math.min(1, Math.hypot(currentX, currentY) * 0.34 + currentSpotlight * 0.52);
        scope.style.setProperty("--intent-energy", intentEnergy.toFixed(3));
        scope.style.setProperty("--intent-spotlight-opacity", (0.12 + currentSpotlight * 0.58).toFixed(3));
        scope.style.setProperty("--intent-grid-opacity", (0.54 + intentEnergy * 0.24).toFixed(3));
        scope.style.setProperty("--intent-glow-x", `${(68 + currentX * 12).toFixed(2)}%`);
        scope.style.setProperty("--intent-glow-y", `${(34 + currentY * 9).toFixed(2)}%`);
        scope.style.setProperty("--intent-rotate-x", `${(-currentY * 1.35).toFixed(2)}deg`);
        scope.style.setProperty("--intent-rotate-y", `${(currentX * 1.75).toFixed(2)}deg`);
        layers.forEach((layer) => {
          const depth = layerDepth(layer);
          const isActive = Boolean(activeLayer && (layer === activeLayer || layer.contains(activeLayer)));
          const activeBoost = isActive ? 1.18 : 1;
          layer.style.setProperty("--intent-shift-x", `${(currentX * depth * 7.2 * activeBoost).toFixed(2)}px`);
          layer.style.setProperty("--intent-shift-y", `${(currentY * depth * 6.1 * activeBoost).toFixed(2)}px`);
          layer.style.setProperty("--intent-shift-z", `${isActive ? Math.min(12, 2.4 + depth * 5.2).toFixed(2) : "0"}px`);
        });

        if (
          Math.abs(targetX - currentX) > 0.0015 ||
          Math.abs(targetY - currentY) > 0.0015 ||
          Math.abs(targetSpotlight - currentSpotlight) > 0.01
        ) {
          frame = requestAnimationFrame(render);
        } else {
          frame = 0;
        }
      };

      scope.addEventListener("pointerenter", () => {
        scope.classList.add("is-intent-active");
        targetSpotlight = 1;
        schedule();
      });
      scope.addEventListener("pointermove", (event) => {
        scope.classList.add("is-intent-active");
        if (scope.classList.contains("is-hero-dragging")) return;
        updateTargetFromPoint(event.clientX, event.clientY);
        if (!(event.target instanceof Element)) return;
        const layer = event.target.closest(activeLayerSelector);
        if (layer && scope.contains(layer)) setActiveLayer(layer);
      });

      scope.addEventListener("pointerleave", () => {
        scope.classList.remove("is-intent-active");
        clearActiveLayer();
        targetX = 0;
        targetY = 0;
        targetSpotlight = 0;
        schedule();
      });

      activeLayers.forEach((layer) => {
        layer.addEventListener("pointerenter", () => setActiveLayer(layer));
        layer.addEventListener("pointerleave", (event) => {
          if (event.relatedTarget instanceof Node && layer.contains(event.relatedTarget)) return;
          clearActiveLayer();
        });
      });

      scope.addEventListener("focusin", (event) => {
        if (!(event.target instanceof Element)) return;
        scope.classList.add("is-intent-active");
        const layer = event.target.closest(activeLayerSelector);
        if (layer && scope.contains(layer)) setActiveLayer(layer);
        updateTargetFromElement(layer || event.target);
      });

      scope.addEventListener("focusout", (event) => {
        if (event.relatedTarget instanceof Node && scope.contains(event.relatedTarget)) return;
        scope.classList.remove("is-intent-active");
        clearActiveLayer();
        targetX = 0;
        targetY = 0;
        targetSpotlight = 0;
        schedule();
      });
    });
  };

  const initUXEnhancements = (filterState) => {
    initAmbientField();
    initScrollProgress();
    initAutoHideHeader();
    initDesktopCursor();
    initReveal();
    initIntentHeroes();
    initFilterSummaries(filterState);
    initProjectDossier();
    initProjectButterflies();
    scheduleIdle(() => {
      initCommandPalette();
      initUXDock();
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
    initProjectButterflies(root);
    initTaxonomyPills(root);
    initLyricsHighlights(root);
    initProjectDossier(root);
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
      activeLink.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    });
  };

  const syncPageTitle = ({ current, entityById }) => {
    const fitTitle = (value) => {
      const suffix = " | Electronic Artefacts";
      const text = String(value || "").trim();
      if (!text) return "Electronic Artefacts";
      if (`${text}${suffix}`.length <= 60) return `${text}${suffix}`;
      return `${text.slice(0, Math.max(20, 59 - suffix.length)).trim()}${suffix}`;
    };

    if (current === "detail") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) : null;
      if (entry) document.title = fitTitle(entry.title);
      return;
    }

    if (current === "project-rl") {
      const id = new URLSearchParams(window.location.search).get("id");
      const entry = id ? entityById(id) : null;
      if (entry) document.title = fitTitle(`${entry.title} Dossier`);
      return;
    }

    if (current === "mentions-legales") document.title = "Legal Notice | Electronic Artefacts";
    if (current === "confidentialite") document.title = "Privacy Policy | Electronic Artefacts";
    if (current === "programs") document.title = "Proprietary Systems and Programs | Electronic Artefacts";
    if (current === "projects") document.title = "Projects | Electronic Artefacts";
    if (current === "search") document.title = "Search | Electronic Artefacts";
  };

  const syncSeoMeta = ({ current, entityById }) => {
    if (document.body.dataset.generatedPage === "true") return;
    if (document.documentElement.lang === "fr") return;
    syncPageTitle({ current, entityById });
    document.documentElement.lang = "en";

    const siteName = "Electronic Artefacts";
    const fallbackDescription = "Independent creative technology studio building client products, proprietary systems and research-led cultural work.";
    const fitDescription = (value) => {
      const text = String(value || fallbackDescription).replace(/\s+/g, " ").trim();
      if (text.length <= 155) return text;
      return `${text.slice(0, 152).replace(/\s+\S*$/, "").trim()}…`;
    };
    const enrichDetailDescription = (entry, value) => {
      const text = String(value || "").trim();
      if (!entry || text.length >= 90) return text;
      const additions = {
        project: "Explore the project scope, visual evidence and connected systems.",
        program: "Explore its role, architecture, lineage and connected projects.",
        researchField: "Explore connected research, projects, programs and artefacts.",
        researchLog: "Explore the research context and related work.",
        artefact: "Explore its archive context and related work.",
        collection: "Explore the connected projects and research records.",
        artist: "Explore the profile and connected work.",
        channel: "Explore the channel and related projects.",
      };
      return `${text} ${additions[entry.kind] || "Explore its context and connected work."}`.trim();
    };
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
      work: "Strategy, design and engineering for complex digital products, platforms and knowledge systems.",
      research: "Research into technology, knowledge and culture, developed through prototypes, publications and working systems.",
      programs: "Proprietary software systems available for technical review, pilots, implementation and licensing.",
      projects: "Cultural works, proprietary platforms and client products built by Electronic Artefacts.",
      archive: "Documents, prototypes, releases and research traces that preserve the lineage of the studio’s work.",
      about: "Electronic Artefacts is an independent creative technology studio connecting research, software, design and cultural production.",
      contact: "Contact Electronic Artefacts about a product, platform, technical system, partnership or cultural project.",
      search: "Search public Electronic Artefacts projects, programs, research and archive records.",
      project: "Electronic Artefacts project overview, visual evidence and connected systems.",
      "project-rl": "Extended Electronic Artefacts project documentation and technical context.",
      artefact: "A public artefact preserved in the Electronic Artefacts archive.",
      collection: "A curated collection of connected Electronic Artefacts projects and research.",
      channel: "A public channel connected to the Electronic Artefacts ecosystem.",
      artist: "Artist profile and connected work within Electronic Artefacts.",
      program: "Electronic Artefacts program profile with status, lineage and system context.",
      entity: "A connected public research or knowledge record from Electronic Artefacts.",
      palimpsests: "Explore Palimpsests, a conceptual album by ORETH structured in five acts around memory, inheritance and transmission.",
      "mentions-legales": "Legal information and publisher details for the Electronic Artefacts website.",
      confidentialite: "Privacy and browser-storage information for the Electronic Artefacts website.",
    };

    const rawDescription =
      (detailEntry?.kind === "project" && current === "project-rl"
        ? `${detailEntry.summary || detailEntry.description || detailEntry.title} Extended project dossier.`
        : detailEntry?.summary || detailEntry?.description || pageDescriptions[baseName] || pageDescriptions[current] || fallbackDescription) || fallbackDescription;
    const description = fitDescription(enrichDetailDescription(detailEntry, rawDescription));

    const canonicalPath = (() => {
      if (baseName === "index") return "./";
      if (baseName === "palimpsests") return "./palimpsests.html";
      if (detailEntry?.route && (current === "detail" || current === "project-rl")) return detailEntry.route;
      if (current === "project-rl" && queryId) return `./project.html?id=${encodeURIComponent(queryId)}`;
      if (current === "detail" && queryId) return `./${baseName}.html?id=${encodeURIComponent(queryId)}`;
      return `./${pageName}`;
    })();

    const canonicalUrl = new URL(canonicalPath, "https://electronicartefacts.com/").href;
    const imageCandidate =
      detailEntry?.media?.gallery?.find((item) => item?.src && item.mediaType !== "video" && /\.(png|jpe?g|webp|gif)$/i.test(item.src)) ||
      null;
    const imageSrc = imageCandidate?.src || "./assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg";
    const imageAlt = imageCandidate?.alt || detailEntry?.title || "Electronic Artefacts logo";
    const imageUrl = new URL(imageSrc, "https://electronicartefacts.com/").href;
    const robots =
      current === "search" || current === "project-rl" || ((current === "detail" || current === "project-rl") && !detailEntry)
        ? "noindex,follow"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
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
    const removeMeta = ({ name, property }) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      document.head.querySelector(selector)?.remove();
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
    ensureMeta({ name: "theme-color", content: "#000000" });
    ensureMeta({ property: "og:title", content: document.title });
    ensureMeta({ property: "og:description", content: description });
    ensureMeta({ property: "og:type", content: ogType });
    ensureMeta({ property: "og:url", content: canonicalUrl });
    ensureMeta({ property: "og:site_name", content: siteName });
    ensureMeta({ property: "og:locale", content: "en_US" });
    ensureMeta({ property: "og:image", content: imageUrl });
    ensureMeta({ property: "og:image:secure_url", content: imageUrl });
    ensureMeta({ property: "og:image:alt", content: imageAlt });
    if (imageCandidate) {
      removeMeta({ property: "og:image:type" });
      removeMeta({ property: "og:image:width" });
      removeMeta({ property: "og:image:height" });
    } else {
      ensureMeta({ property: "og:image:type", content: "image/jpeg" });
      ensureMeta({ property: "og:image:width", content: "1200" });
      ensureMeta({ property: "og:image:height", content: "630" });
    }
    ensureMeta({ name: "twitter:card", content: "summary_large_image" });
    ensureMeta({ name: "twitter:title", content: document.title });
    ensureMeta({ name: "twitter:description", content: description });
    ensureMeta({ name: "twitter:image", content: imageUrl });
    ensureMeta({ name: "twitter:image:alt", content: imageAlt });
    ensureLink("canonical", canonicalUrl);

    const jsonLd =
      baseName === "index"
        ? null
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
    initLanguageSwitcher,
    initCardLinks,
    initContactDiscovery,
    initCapabilityMaps,
    initProgressiveGrids,
    initEngagementPanels,
    initIntentHeroes,
    initUXEnhancements,
    initProjectButterflies,
    refreshCardSurfaces,
    syncNavigationState,
    syncPageTitle,
    syncSeoMeta,
  };
})();
