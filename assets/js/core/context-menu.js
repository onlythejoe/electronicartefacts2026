(function () {
  const actions = new Map();
  let initialized = false;
  let menu = null;
  let context = null;
  let returnFocus = null;

  const isFrench = () => document.documentElement.lang === "fr" || window.location.pathname.startsWith("/fr/");
  const copy = async (value) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  };
  const label = (en, fr) => isFrench() ? fr : en;
  const track = (action, ctx) => window.EA_ANALYTICS?.track?.("ea_context_action", {
    action,
    context_type: ctx.kind,
    item_id: ctx.entryId || ctx.href || window.location.pathname,
  });

  const register = (definition) => {
    if (!definition?.id || typeof definition.run !== "function") throw new TypeError("A context action needs an id and run function.");
    actions.set(definition.id, definition);
    return () => actions.delete(definition.id);
  };

  const closestText = (target) => {
    const semantic = target.closest("[data-global-graph-node], [data-entry-id], article, section, .panel, .card, main");
    const heading = semantic?.querySelector?.("h1, h2, h3, [data-global-graph-title]");
    return heading?.textContent?.trim() || document.querySelector("h1")?.textContent?.trim() || document.title;
  };

  const resolve = (target, event) => {
    const selection = window.getSelection?.()?.toString().trim() || "";
    const link = target.closest("a[href]");
    const image = target.closest("img");
    const graphNode = target.closest("[data-global-graph-node]");
    const card = target.closest("[data-card-link], article, .panel, .card");
    const entry = target.closest("[data-entry-id]") || document.body;
    const rawHref = link?.getAttribute("href") || graphNode?.dataset.globalGraphRoute || card?.dataset.cardLink || "";
    let href = "";
    try { href = rawHref ? new URL(rawHref, window.location.href).href : ""; } catch { href = ""; }
    return Object.freeze({
      target,
      x: event.clientX,
      y: event.clientY,
      selection: selection.slice(0, 5000),
      href,
      imageUrl: image?.currentSrc || image?.src || "",
      title: graphNode?.dataset.globalGraphTitle || closestText(target),
      entryId: graphNode?.dataset.globalGraphId || entry.dataset.entryId || "",
      kind: selection ? "selection" : graphNode ? "graph-node" : image ? "image" : link ? "link" : card ? "record" : "page",
    });
  };

  const availableActions = (ctx) => [...actions.values()]
    .filter((action) => !action.when || action.when(ctx))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const close = ({ restoreFocus = false } = {}) => {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menu.replaceChildren();
    document.body.classList.remove("has-context-menu");
    if (restoreFocus) returnFocus?.focus?.({ preventScroll: true });
    context = null;
  };

  const position = (x, y) => {
    const gap = 10;
    const rect = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(gap, Math.min(x, window.innerWidth - rect.width - gap))}px`;
    menu.style.top = `${Math.max(gap, Math.min(y, window.innerHeight - rect.height - gap))}px`;
  };

  const open = (ctx) => {
    const items = availableActions(ctx);
    if (!items.length) return;
    context = ctx;
    returnFocus = document.activeElement;
    menu.replaceChildren();
    let previousGroup = null;
    items.forEach((action) => {
      if (previousGroup !== null && action.group !== previousGroup) {
        const separator = document.createElement("div");
        separator.className = "site-context-menu__separator";
        separator.setAttribute("role", "separator");
        menu.append(separator);
      }
      previousGroup = action.group;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "site-context-menu__item";
      button.setAttribute("role", "menuitem");
      button.dataset.contextAction = action.id;
      const text = document.createElement("span");
      text.textContent = action.label(ctx);
      button.append(text);
      if (action.hint) {
        const hint = document.createElement("kbd");
        hint.textContent = action.hint;
        button.append(hint);
      }
      menu.append(button);
    });
    menu.hidden = false;
    document.body.classList.add("has-context-menu");
    position(ctx.x, ctx.y);
    menu.querySelector("button")?.focus({ preventScroll: true });
    track("open", ctx);
  };

  const share = async (ctx) => {
    const data = { title: ctx.title || document.title, url: ctx.href || window.location.href };
    if (navigator.share) return navigator.share(data);
    return copy(data.url);
  };

  const defaults = () => {
    register({ id: "open", group: "context", order: 10, label: () => label("Open", "Ouvrir"), when: (ctx) => Boolean(ctx.href), run: (ctx) => window.location.assign(ctx.href) });
    register({ id: "open-new", group: "context", order: 20, label: () => label("Open in new tab", "Ouvrir dans un nouvel onglet"), when: (ctx) => Boolean(ctx.href), run: (ctx) => window.open(ctx.href, "_blank", "noopener,noreferrer") });
    register({ id: "copy-selection", group: "context", order: 30, label: () => label("Copy selection", "Copier la sélection"), hint: "⌘C", when: (ctx) => Boolean(ctx.selection), run: (ctx) => copy(ctx.selection) });
    register({ id: "search-selection", group: "context", order: 40, label: () => label("Search this site", "Rechercher sur le site"), when: (ctx) => Boolean(ctx.selection), run: (ctx) => window.location.assign(`${isFrench() ? "/fr/search.html" : "/search.html"}?q=${encodeURIComponent(ctx.selection.slice(0, 180))}`) });
    register({ id: "copy-link", group: "share", order: 50, label: (ctx) => ctx.href ? label("Copy link", "Copier le lien") : label("Copy page link", "Copier le lien de la page"), run: (ctx) => copy(ctx.href || window.location.href) });
    register({ id: "copy-image", group: "share", order: 55, label: () => label("Copy image address", "Copier l’adresse de l’image"), when: (ctx) => Boolean(ctx.imageUrl), run: (ctx) => copy(ctx.imageUrl) });
    register({ id: "share", group: "share", order: 60, label: () => label("Share…", "Partager…"), run: share });
    register({ id: "back", group: "browser", order: 70, label: () => label("Back", "Précédent"), hint: "⌘←", run: () => history.back() });
    register({ id: "forward", group: "browser", order: 80, label: () => label("Forward", "Suivant"), hint: "⌘→", run: () => history.forward() });
    register({ id: "reload", group: "browser", order: 90, label: () => label("Reload", "Actualiser"), hint: "⌘R", run: () => window.location.reload() });
    register({ id: "print", group: "browser", order: 100, label: () => label("Print…", "Imprimer…"), hint: "⌘P", run: () => window.print() });
  };

  const init = () => {
    if (initialized) return;
    initialized = true;
    defaults();
    menu = document.createElement("div");
    menu.className = "site-context-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", label("Context actions", "Actions contextuelles"));
    menu.hidden = true;
    document.body.append(menu);

    document.addEventListener("contextmenu", (event) => {
      if (event.shiftKey || event.target.closest("input, textarea, [contenteditable='true']")) return;
      event.preventDefault();
      close();
      open(resolve(event.target, event));
    });
    document.addEventListener("keydown", (event) => {
      if ((event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) && !event.target.closest("input, textarea, [contenteditable='true']")) {
        event.preventDefault();
        const rect = event.target.getBoundingClientRect();
        open(resolve(event.target, { clientX: rect.left + 12, clientY: rect.top + 12 }));
        return;
      }
      if (!menu.hidden && event.key === "Escape") { event.preventDefault(); close({ restoreFocus: true }); }
      if (!menu.hidden && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const items = [...menu.querySelectorAll("button")];
        const current = items.indexOf(document.activeElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      }
    });
    menu.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-context-action]");
      if (!button || !context) return;
      const action = actions.get(button.dataset.contextAction);
      const activeContext = context;
      close();
      try { await action?.run(activeContext); track(action?.id || "unknown", activeContext); }
      catch (error) { if (error?.name !== "AbortError") console.warn("Context action unavailable", error); }
    });
    document.addEventListener("pointerdown", (event) => { if (!menu.hidden && !menu.contains(event.target)) close(); }, true);
    window.addEventListener("blur", () => close());
    window.addEventListener("resize", () => close());
    window.addEventListener("scroll", () => close(), true);
  };

  window.EA_CONTEXT_MENU = Object.freeze({ init, register, resolve });
})();
