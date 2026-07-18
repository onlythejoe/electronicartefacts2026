(function () {
  const root = document.documentElement;
  const body = document.body;
  if (!body || body.dataset.boundFlowRuntime === "true") return;
  body.dataset.boundFlowRuntime = "true";
  root.classList.add("has-flow-runtime");
  performance.mark?.("ea:flow-ready");

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrainedConnection = Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || ""));
  const progress = document.createElement("div");
  progress.className = "flow-progress";
  progress.setAttribute("aria-hidden", "true");
  body.append(progress);

  let navigationTimer = 0;
  let intentTimer = 0;
  const prefetched = new Set();
  const prefetchLimit = 8;
  const performanceState = { lcp: 0, cls: 0, inp: 0, longTaskTotal: 0, longTaskMax: 0 };
  const observePerformance = (type, callback, options = {}) => {
    if (!("PerformanceObserver" in window) || !PerformanceObserver.supportedEntryTypes?.includes(type)) return;
    try {
      const observer = new PerformanceObserver((list) => list.getEntries().forEach(callback));
      observer.observe({ type, buffered: true, ...options });
    } catch {}
  };
  observePerformance("largest-contentful-paint", (entry) => { performanceState.lcp = Math.round(entry.startTime); });
  observePerformance("layout-shift", (entry) => { if (!entry.hadRecentInput) performanceState.cls += entry.value; });
  observePerformance("event", (entry) => { performanceState.inp = Math.max(performanceState.inp, Math.round(entry.duration)); }, { durationThreshold: 40 });
  observePerformance("longtask", (entry) => {
    performanceState.longTaskTotal += Math.round(entry.duration);
    performanceState.longTaskMax = Math.max(performanceState.longTaskMax, Math.round(entry.duration));
  });
  window.EA_PERFORMANCE = Object.freeze({ snapshot: () => ({ ...performanceState, cls: Number(performanceState.cls.toFixed(4)) }) });
  window.addEventListener("pagehide", () => {
    window.EA_ANALYTICS?.track?.("ea_web_vitals", window.EA_PERFORMANCE.snapshot());
  }, { once: true });

  const destinationFor = (anchor) => {
    if (!anchor?.href || anchor.hasAttribute("download")) return null;
    if (anchor.target && anchor.target !== "_self") return null;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return null;
    if (!(url.pathname.endsWith(".html") || url.pathname.endsWith("/"))) return null;
    url.hash = "";
    return url;
  };

  const prefetch = (anchor) => {
    if (constrainedConnection || prefetched.size >= prefetchLimit) return;
    const url = destinationFor(anchor);
    if (!url || prefetched.has(url.href)) return;
    prefetched.add(url.href);
    performance.mark?.("ea:navigation-prefetch");
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = url.href;
    link.fetchPriority = "low";
    document.head.append(link);
  };

  const prefetchFromIntent = (event, delay = 0) => {
    const anchor = event.target.closest?.("a[href]");
    window.clearTimeout(intentTimer);
    intentTimer = window.setTimeout(() => prefetch(anchor), delay);
  };

  document.addEventListener("pointerover", (event) => prefetchFromIntent(event, 65), { passive: true });
  document.addEventListener("pointerout", () => window.clearTimeout(intentTimer), { passive: true });
  document.addEventListener("touchstart", (event) => prefetchFromIntent(event), { passive: true });
  document.addEventListener("focusin", (event) => prefetchFromIntent(event));
  body.dataset.boundSmartPrefetch = "true";

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || anchor.dataset.noPageTransition === "true") return;
    const url = destinationFor(anchor);
    if (!url) return;

    event.preventDefault();
    if (body.classList.contains("is-page-leaving")) return;
    body.classList.add("is-page-leaving");
    root.dataset.navigationPending = "true";
    performance.mark?.("ea:navigation-intent");
    progress.classList.add("is-travelling");
    window.clearTimeout(navigationTimer);
    const destination = `${url.pathname}${url.search}${anchor.hash || ""}`;
    navigationTimer = window.setTimeout(() => window.location.assign(destination), reduceMotion ? 0 : 105);
  });
  body.dataset.boundPageTransitions = "true";

  window.addEventListener("pageshow", () => {
    window.clearTimeout(navigationTimer);
    body.classList.remove("is-page-leaving");
    progress.classList.remove("is-travelling");
    delete root.dataset.navigationPending;
  });
})();
