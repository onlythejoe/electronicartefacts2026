(function () {
  const root = document.documentElement;
  const body = document.body;
  if (!body || body.dataset.boundFlowRuntime === "true") return;
  body.dataset.boundFlowRuntime = "true";
  root.classList.add("has-flow-runtime");

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
