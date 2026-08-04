(function () {
  performance.mark?.("ea:project-runtime-start");
  const body = document.body;
  const behaviors = window.EA_BEHAVIORS || {};

  const setYear = () => {
    const year = document.getElementById("current-year");
    if (year) year.textContent = String(new Date().getFullYear());
  };

  const load = async () => {
    behaviors.syncNavigationState?.(body.dataset.page || "project");
    await behaviors.initLanguageSwitcher?.();
    document.querySelectorAll(".site-main .zone-card").forEach((zone, index) => {
      zone.dataset.zoneIndex = String(index + 1);
      zone.style.setProperty("--zone-index", String(index + 1));
    });
    behaviors.initCardLinks?.();
    behaviors.initUXEnhancements?.(new Map());
    behaviors.initEngagementPanels?.();
    behaviors.initPalimpsestsBoard?.();
    window.EA_CONTEXT_MENU?.init?.();
    setYear();
    body.classList.add("is-ready");
    performance.mark?.("ea:project-interactive");
    try {
      performance.measure?.("ea:project-start-to-interactive", "ea:project-runtime-start", "ea:project-interactive");
    } catch {
      /* Performance marks are diagnostic only. */
    }
  };

  load().catch(() => {
    setYear();
    body.classList.add("is-ready");
  });
})();
