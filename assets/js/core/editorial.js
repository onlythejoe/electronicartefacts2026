(function () {
  performance.mark?.("ea:editorial-runtime-start");
  const body = document.body;
  const isFrench = document.documentElement.lang === "fr" || location.pathname.startsWith("/fr/");
  const label = (english, french) => isFrench ? french : english;
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const scheduleIdle = (callback) => "requestIdleCallback" in window
    ? requestIdleCallback(callback, { timeout: 1000 })
    : setTimeout(callback, 80);

  const localizeFrenchSurface = () => {
    if (!isFrench) return;
    const translations = window.EA_EDITORIAL_TRANSLATIONS || {};
    const translateValue = (value) => {
      const leading = value.match(/^\s*/)?.[0] || "";
      const trailing = value.match(/\s*$/)?.[0] || "";
      const normalized = value.trim().replace(/\s+/g, " ");
      return translations[normalized] ? `${leading}${translations[normalized]}${trailing}` : value;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.nodeValue?.trim()) continue;
      if (["SCRIPT", "STYLE"].includes(walker.currentNode.parentElement?.tagName || "")) continue;
      textNodes.push(walker.currentNode);
    }
    textNodes.forEach((node) => { node.nodeValue = translateValue(node.nodeValue || ""); });
    document.querySelectorAll("[placeholder], [title], [aria-label], [alt]").forEach((element) => {
      ["placeholder", "title", "aria-label", "alt"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value) element.setAttribute(attribute, translateValue(value));
      });
    });
    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("/fr/") || raw === "/fr" || raw.startsWith("/assets/") || raw.startsWith("/generated/") || raw.startsWith("/graph/")) return;
      const url = new URL(raw, location.origin);
      if (url.pathname === "/search/") url.pathname = "/fr/search.html";
      else url.pathname = url.pathname === "/" || url.pathname === "/index.html" ? "/fr/" : `/fr${url.pathname}`;
      link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    });
  };

  const initLanguage = () => {
    const root = document.querySelector("[data-language-switcher]");
    if (!root) return;
    const trigger = root.querySelector("[data-language-trigger]");
    const menu = root.querySelector("[data-language-menu]");
    const current = root.querySelector("[data-language-current]");
    const status = root.querySelector("[data-language-status]");
    const options = [...root.querySelectorAll("[data-language-option]")];
    const alternates = Object.fromEntries([...document.querySelectorAll('link[rel="alternate"][hreflang]')]
      .map((node) => [node.hreflang, node.href]));
    const active = isFrench ? "fr" : "en";

    const setOpen = (open) => {
      root.classList.toggle("is-open", open);
      trigger?.setAttribute("aria-expanded", String(open));
      if (menu) menu.hidden = !open;
    };
    if (current) current.textContent = active.toUpperCase();
    if (status) status.textContent = active === "fr" ? "Français actif" : "English active";
    options.forEach((option) => {
      const locale = option.dataset.languageOption;
      option.setAttribute("aria-checked", String(locale === active));
      option.classList.toggle("is-unavailable", !alternates[locale]);
      option.addEventListener("click", () => {
        const target = alternates[locale];
        setOpen(false);
        if (!target || locale === active) return;
        try { localStorage.setItem("ea:language", locale); } catch {}
        body.classList.add("is-page-leaving");
        setTimeout(() => location.assign(target), reduceMotion ? 0 : 105);
      });
    });
    trigger?.addEventListener("click", () => setOpen(!root.classList.contains("is-open")));
    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !root.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") setOpen(false); });
  };

  const syncNavigation = () => {
    const pageMap = {
      artefact: "archive", collection: "archive", concept: "knowledge", framework: "knowledge",
      method: "knowledge", publication: "knowledge", technology: "knowledge", project: "projects",
      program: "programs", researchField: "research", researchQuestion: "research",
      organization: "about", "generated-hub": "knowledge",
    };
    const current = pageMap[body.dataset.page] || body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const initMedia = () => {
    document.querySelectorAll(".site-main img[loading=lazy]").forEach((image) => {
      if (image.complete && image.naturalWidth) return;
      image.dataset.mediaState = "loading";
      const ready = () => { image.dataset.mediaState = "ready"; };
      image.addEventListener("load", ready, { once: true });
      image.addEventListener("error", ready, { once: true });
    });
  };

  const initScroll = () => {
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.dataset.scrollProgress = "";
    progress.ariaHidden = "true";
    body.append(progress);
    let frame = 0;
    let lastY = scrollY;
    const header = document.querySelector(".shell-header.zone-card");
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty("--scroll-progress", String(max > 0 ? Math.min(1, scrollY / max) : 0));
      body.classList.toggle("is-page-scrolled", scrollY > 140);
      if (scrollY < 12 || scrollY < lastY - 2) body.classList.remove("is-header-hidden");
      else if (scrollY > lastY + 4) body.classList.add("is-header-hidden");
      lastY = scrollY;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    if (header) {
      const syncOffset = () => body.style.setProperty("--header-offset", `${Math.ceil(header.getBoundingClientRect().height) + 12}px`);
      syncOffset();
      if ("ResizeObserver" in window) new ResizeObserver(syncOffset).observe(header);
      else addEventListener("resize", syncOffset, { passive: true });
      header.addEventListener("focusin", () => body.classList.remove("is-header-hidden"));
    }
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule, { passive: true });
    update();
  };

  const initReveal = () => {
    const targets = [...document.querySelectorAll(".zone-card, .panel")];
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("is-reveal-pending");
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { rootMargin: "0px 0px -8%", threshold: 0.12 });
    targets.forEach((target, index) => {
      if (target.getBoundingClientRect().top < innerHeight * 1.08) return;
      target.dataset.boundReveal = "true";
      target.style.setProperty("--reveal-index", String(index % 8));
      target.classList.add("is-reveal-pending");
      observer.observe(target);
    });
  };

  const initAmbient = () => {
    if (document.querySelector("[data-ambient-field]")) return;
    const root = document.createElement("div");
    root.className = "ambient-field";
    root.dataset.ambientField = "";
    root.ariaHidden = "true";
    root.innerHTML = "<canvas></canvas>";
    body.prepend(root);
    const canvas = root.firstElementChild;
    const context = canvas.getContext("2d");
    let width = 1;
    let height = 1;
    let frame = 0;
    let lastPaint = 0;
    const points = Array.from({ length: finePointer ? 44 : 28 }, (_, index) => ({
      x: ((index * 37) % 101) / 101,
      y: ((index * 61) % 97) / 97,
      radius: 1 + (index % 5) * 0.55,
      phase: index * 0.71,
    }));
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paint = (now) => {
      context.clearRect(0, 0, width, height);
      points.forEach((point) => {
        const x = point.x * width + Math.sin(now * 0.00012 + point.phase) * 14;
        const y = point.y * height + Math.cos(now * 0.0001 + point.phase) * 11;
        context.fillStyle = `rgba(247,244,239,${0.05 + (point.phase % 3) * 0.008})`;
        context.beginPath();
        context.arc(x, y, point.radius, 0, Math.PI * 2);
        context.fill();
      });
    };
    const draw = (now) => {
      if (now - lastPaint > 50) { lastPaint = now; paint(now); }
      if (!document.hidden && !reduceMotion) frame = requestAnimationFrame(draw);
    };
    resize();
    paint(performance.now());
    if (!reduceMotion) frame = requestAnimationFrame(draw);
    addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
      else if (!reduceMotion && !frame) frame = requestAnimationFrame(draw);
    });
  };

  const initCursor = () => {
    if (!finePointer) return;
    document.documentElement.classList.add("has-desktop-cursor");
    const cursor = document.createElement("div");
    cursor.className = "ea-cursor";
    cursor.ariaHidden = "true";
    body.append(cursor);
    let frame = 0;
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let targetX = x;
    let targetY = y;
    const render = () => {
      frame = 0;
      x += (targetX - x) * 0.3;
      y += (targetY - y) * 0.3;
      cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      if (Math.abs(targetX - x) > 0.2 || Math.abs(targetY - y) > 0.2) frame = requestAnimationFrame(render);
    };
    document.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.opacity = "1";
      cursor.classList.toggle("is-interactive", Boolean(event.target.closest?.("a,button,input,summary,[role=button]")));
      cursor.classList.toggle("is-text", Boolean(event.target.closest?.("p,h1,h2,h3,li,blockquote,figcaption")));
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });
    document.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
  };

  const toast = (message) => {
    let stack = document.querySelector("[data-toast-stack]");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.dataset.toastStack = "";
      body.append(stack);
    }
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    stack.append(item);
    setTimeout(() => item.classList.add("is-leaving"), 1800);
    setTimeout(() => item.remove(), 2300);
  };

  const initEngagement = () => document.querySelectorAll("[data-engagement-panel]").forEach((panel) => {
    const button = panel.querySelector("[data-share-button]");
    const feedback = panel.querySelector("[data-engagement-feedback]");
    button?.addEventListener("click", async () => {
      const data = { title: document.title, text: document.querySelector('meta[name="description"]')?.content || "", url: location.href };
      try {
        if (navigator.share) await navigator.share(data);
        else await navigator.clipboard.writeText(data.url);
        if (feedback) feedback.textContent = label("Link ready to share.", "Lien prêt à partager.");
      } catch { if (feedback) feedback.textContent = label("Share unavailable.", "Partage indisponible."); }
      setTimeout(() => { if (feedback) feedback.textContent = ""; }, 2200);
    });
  });

  const initDock = () => {
    const dock = document.createElement("div");
    dock.className = "ux-dock";
    dock.dataset.uxDock = "";
    dock.innerHTML = `<button type="button" data-action="top" aria-label="${label("Back to top", "Retour en haut")}">↑</button><button type="button" data-action="compact" aria-label="${label("Toggle compact view", "Changer la densité")}">▦</button><button type="button" data-action="vivid" aria-label="${label("Toggle vivid mode", "Changer l'intensité")}">◐</button>`;
    body.append(dock);
    try {
      body.classList.toggle("is-compact-view", localStorage.getItem("ea-compact-view") === "true");
      body.classList.toggle("is-vivid-mode", localStorage.getItem("ea-vivid-mode") === "true");
    } catch {}
    dock.addEventListener("click", (event) => {
      const action = event.target.closest?.("button")?.dataset.action;
      if (action === "top") scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      if (action === "compact" || action === "vivid") {
        const className = action === "compact" ? "is-compact-view" : "is-vivid-mode";
        body.classList.toggle(className);
        try { localStorage.setItem(action === "compact" ? "ea-compact-view" : "ea-vivid-mode", String(body.classList.contains(className))); } catch {}
        toast(body.classList.contains(className) ? label("Enabled", "Activé") : label("Disabled", "Désactivé"));
      }
    });
  };

  const initCommand = () => {
    const entries = [...document.querySelectorAll(".site-nav a[href], .site-main a[href]")]
      .filter((link, index, links) => links.findIndex((item) => item.href === link.href) === index)
      .slice(0, 80)
      .map((link) => ({ title: link.textContent.trim(), href: link.href }))
      .filter((entry) => entry.title);
    const button = document.createElement("button");
    button.className = "command-fab";
    button.type = "button";
    button.ariaLabel = label("Open quick navigation", "Ouvrir la navigation rapide");
    button.innerHTML = `<span>${label("Search", "Rechercher")}</span><kbd>⌘K</kbd>`;
    const palette = document.createElement("div");
    palette.className = "command-palette";
    palette.hidden = true;
    palette.dataset.commandPalette = "";
    palette.innerHTML = `<div class="command-palette__backdrop" data-close></div><section class="command-palette__panel" role="dialog" aria-modal="true"><div class="command-palette__search"><span>⌕</span><input type="search" placeholder="${label("Search this page and connected paths…", "Rechercher cette page et ses liens…")}" data-input><button type="button" data-close>Esc</button></div><div class="command-palette__results" data-results></div></section>`;
    body.append(button, palette);
    const input = palette.querySelector("[data-input]");
    const results = palette.querySelector("[data-results]");
    const render = () => {
      const query = input.value.trim().toLowerCase();
      results.innerHTML = entries.filter((entry) => !query || entry.title.toLowerCase().includes(query)).slice(0, 9)
        .map((entry, index) => `<a class="command-result${index ? "" : " is-active"}" href="${escapeHtml(entry.href)}"><span><strong>${escapeHtml(entry.title)}</strong></span><em>${label("Open", "Ouvrir")}</em></a>`).join("");
    };
    const open = () => { palette.hidden = false; body.classList.add("has-command-palette"); input.value = ""; render(); requestAnimationFrame(() => input.focus()); };
    const close = () => { palette.hidden = true; body.classList.remove("has-command-palette"); };
    button.addEventListener("click", open);
    palette.querySelectorAll("[data-close]").forEach((node) => node.addEventListener("click", close));
    input.addEventListener("input", render);
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); palette.hidden ? open() : close(); }
      if (event.key === "Escape" && !palette.hidden) close();
    });
  };

  localizeFrenchSurface();
  initLanguage();
  syncNavigation();
  initMedia();
  initScroll();
  initReveal();
  initAmbient();
  initCursor();
  initEngagement();
  document.querySelectorAll(".site-main .zone-card").forEach((zone, index) => {
    zone.dataset.zoneIndex = String(index + 1);
    zone.style.setProperty("--zone-index", String(index + 1));
  });
  body.classList.add("is-ready");
  performance.mark?.("ea:editorial-interactive");
  try { performance.measure?.("ea:editorial-start-to-interactive", "ea:editorial-runtime-start", "ea:editorial-interactive"); } catch {}
  scheduleIdle(() => { initCommand(); initDock(); window.EA_CONTEXT_MENU?.init?.(); });
})();
