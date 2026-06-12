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
        if (event.target.closest("a,button,input,select,textarea,label")) return;
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
    syncNavigationState,
    syncPageTitle,
  };
})();
