(function () {
  const bind = (root, { tabSelector, panelSelector, onActivate } = {}) => {
    if (!root || root.dataset.boundTabs === "true") return;
    const tabs = [...root.querySelectorAll(tabSelector)];
    const panels = [...root.querySelectorAll(panelSelector)];
    if (!tabs.length || !panels.length) return;
    root.dataset.boundTabs = "true";
    const activate = (selected) => {
      const target = selected.getAttribute("aria-controls");
      if (!panels.some((panel) => panel.id === target)) return;
      tabs.forEach((tab) => {
        const active = tab === selected;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        const active = panel.id === target;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
      onActivate?.(selected);
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus();
        activate(tabs[next]);
      });
    });
    activate(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
  };
  window.EA_TABS = Object.freeze({ bind });
})();
