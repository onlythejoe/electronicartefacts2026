(function () {
  const { esc, setYear } = window.EA_UTILS;
  const { loadIncludes } = window.EA_INCLUDES;
  const { routeCard, vasteBanner, featuredWork, featuredResearch, startVasteEngineAnimation, startComputationFieldAnimation, initForgeArtifactViewer } = window.EA_VIEW;
  const { crossNavigation, ecosystemExplorer, researchAtlas, startGraphSurfaceAnimation, startResearchAtlas } = window.EA_SURFACE;
  const { initLanguageSwitcher, initCardLinks, initProgressiveGrids, initUXEnhancements, initEngagementPanels, refreshCardSurfaces, syncNavigationState } = window.EA_BEHAVIORS;
  const isFrench = () => window.EA_I18N?.locale === "fr";

  const orientationSection = ({ eyebrow, title, copy, cards }) => `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h2>${esc(title)}</h2>
        <p class="lede">${esc(copy)}</p>
      </div>
      <div class="card-grid card-grid--two">
        ${cards.map((card) => routeCard(card)).join("")}
      </div>
    </section>
  `;

  const renderFeaturedPaths = () =>
    `${orientationSection({
      eyebrow: "THREE PRACTICES",
      title: "One studio. Three distinct ways of working.",
      copy: "Client work solves immediate problems. Proprietary systems extend what the studio can build. Research and artistic publishing keep the practice open to new forms.",
      cards: [
        {
          kicker: "Technology",
          title: "Proprietary systems",
          copy: "Explore VASTE and the reusable software programs behind the studio’s knowledge and product platforms.",
          reason: "Technical partnerships, pilots and licensing.",
          cta: "Review the programs",
          href: "./vaste.html",
          ariaLabel: "Explore VASTE",
        },
        {
          kicker: "Delivery",
          title: "Client products and platforms",
          copy: "See how strategy, content, interface and engineering come together in commissioned work.",
          reason: "Product definition, design, delivery and recovery.",
          cta: "View client work",
          href: "./work.html",
          ariaLabel: "See Client Work",
        },
        {
          kicker: "Culture and research",
          title: "Research and artistic publishing",
          copy: "Follow the investigations, publications and musical works that give the studio its cultural depth.",
          reason: "Research, editorial partnerships and artistic collaboration.",
          cta: "Explore the cultural work",
          href: "./palimpsests.html",
          ariaLabel: "Enter Palimpsests",
        },
      ],
    })}${ecosystemExplorer()}`;

  const renderers = {
    "home-featured-paths": renderFeaturedPaths,
    "home-research-atlas": researchAtlas,
    "home-vaste-banner": vasteBanner,
    "home-featured-work": featuredWork,
    "home-featured-research": featuredResearch,
    "cross-navigation": crossNavigation,
  };

  const initSelectedWorks = () => {
    document.querySelectorAll("[data-selected-works-toggle]").forEach((button) => {
      if (button.dataset.selectedWorksBound === "true") return;
      button.dataset.selectedWorksBound = "true";
      const targetId = button.getAttribute("aria-controls");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        target.hidden = expanded;
        target.classList.toggle("is-visible", !expanded);
        const icon = button.querySelector(".selected-works-action__icon");
        if (icon) icon.textContent = expanded ? "+" : "−";
        const label = button.querySelector(".selected-works-action__label");
        if (label) label.textContent = expanded
          ? (isFrench() ? "Voir plus de réalisations" : "See more work")
          : (isFrench() ? "Voir moins de réalisations" : "See less work");
        button.setAttribute("aria-label", expanded
          ? (isFrench() ? "Voir plus de réalisations" : "See more work")
          : (isFrench() ? "Masquer les réalisations supplémentaires" : "Hide additional work"));
        if (!expanded) refreshCardSurfaces(target);
      });
    });
  };

  const load = async () => {
    performance.mark?.("ea:home-runtime-start");
    await loadIncludes();
    Object.entries(renderers).forEach(([selector, render]) => {
      const target = document.querySelector(`[data-render="${selector}"]`);
      if (!target || target.dataset.runtimeStatic === "true") return;
      try {
        const html = render();
        target.innerHTML = html;
      } catch (error) {
        console.error(`Render failed for ${selector}`, error);
      }
    });
    window.EA_I18N?.localizeRoot(document);
    syncNavigationState("home");
    await initLanguageSwitcher();
    document.querySelectorAll(".site-main .zone-card").forEach((zone, index) => {
      zone.dataset.zoneIndex = String(index + 1);
      zone.style.setProperty("--zone-index", String(index + 1));
    });
    initCardLinks();
    initProgressiveGrids();
    initUXEnhancements(new Map());
    initEngagementPanels();
    window.EA_CONTEXT_MENU?.init?.();
    startVasteEngineAnimation();
    startComputationFieldAnimation();
    initForgeArtifactViewer();
    startGraphSurfaceAnimation();
    startResearchAtlas?.();
    initSelectedWorks();
    document.body.classList.add("is-ready");
    performance.mark?.("ea:home-interactive");
    performance.measure?.("ea:home-start-to-interactive", "ea:home-runtime-start", "ea:home-interactive");
    setYear();
  };

  load().catch((error) => {
    console.error("Home initialization failed", error);
    setYear();
  });
})();
