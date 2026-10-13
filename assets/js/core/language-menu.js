(function () {
  const preserveUrlState = (target, current) => {
    const source = new URL(current);
    const destination = new URL(target, source.origin);
    if (!destination.search) destination.search = source.search;
    if (!destination.hash) destination.hash = source.hash;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  };

  const bind = (root) => {
    const trigger = root?.querySelector("[data-language-trigger]");
    const menu = root?.querySelector("[data-language-menu]");
    const options = [...(root?.querySelectorAll("[data-language-option]") || [])];
    if (!trigger || !menu) return { setOpen() {} };
    const setOpen = (open, { index, restoreFocus = false } = {}) => {
      root.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      if (open) {
        window.requestAnimationFrame(() => {
          if (menu.hidden) return;
          const selected = options.find((option) => option.getAttribute("aria-checked") === "true");
          (index === undefined ? selected || options[0] : options[index])?.focus?.({ preventScroll: true });
        });
      } else if (restoreFocus || menu.contains?.(document.activeElement)) trigger.focus?.({ preventScroll: true });
    };
    options.forEach((option) => { option.tabIndex = -1; });
    trigger.addEventListener("click", () => setOpen(menu.hidden));
    trigger.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      setOpen(true, { index: event.key === "ArrowUp" ? options.length - 1 : 0 });
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Tab") { setOpen(false); return; }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const current = Math.max(0, options.indexOf(document.activeElement));
      const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
        : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      options[next]?.focus?.();
    });
    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menu.hidden) return;
      event.preventDefault();
      setOpen(false, { restoreFocus: true });
    });
    return Object.freeze({ setOpen });
  };
  window.EA_LANGUAGE_MENU = Object.freeze({ bind, preserveUrlState });
})();
