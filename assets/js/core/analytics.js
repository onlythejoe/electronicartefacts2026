(function () {
  const CONFIG = {
    enabled: true,
    provider: "Google Analytics 4",
    measurementId: "",
    consentStorageKey: "ea:analytics-consent:v1",
    consentMaxAgeDays: 180,
    privacyUrl: "/confidentialite.html",
    maxEventValueLength: 120,
    maxSearchTermLength: 80,
    sectionViewLimit: 32,
    scrollMilestones: [25, 50, 75, 90, 100],
    timeMilestones: [30, 60, 120, 300],
  };

  const config = { ...CONFIG, ...(window.EA_ANALYTICS_CONFIG || {}) };
  const hasMeasurementId = /^G-[A-Z0-9]+$/i.test(config.measurementId || "");
  if (!config.enabled || !hasMeasurementId) {
    window.EA_ANALYTICS = {
      configured: false,
      openPreferences() {},
      getConsent() {
        return null;
      },
      track() {
        return false;
      },
    };
    return;
  }

  const state = {
    loaded: false,
    banner: null,
    instrumentationBound: false,
    sectionObserver: null,
    trackedSections: new Set(),
    trackedScrollMilestones: new Set(),
    trackedTimeMilestones: new Set(),
    searchTimers: new WeakMap(),
    timeTrackingStarted: false,
    visibleSince: 0,
    visibleSeconds: 0,
  };

  const isFrench = () => document.documentElement.lang === "fr" || document.body?.dataset.locale === "fr";
  const copy = () => isFrench()
    ? {
        title: "Mesure d'audience",
        body: "Electronic Artefacts utilise Google Analytics uniquement si vous l’acceptez, afin de comprendre les pages consultées et d’améliorer le site. Le refus est sans effet sur l’accès.",
        accept: "Accepter",
        reject: "Refuser",
        privacy: "Politique de confidentialité",
        settings: "Préférences de confidentialité",
      }
    : {
        title: "Audience measurement",
        body: "Electronic Artefacts uses Google Analytics only if you accept it, to understand which pages are visited and improve the site. Refusing has no effect on access.",
        accept: "Accept",
        reject: "Reject",
        privacy: "Privacy policy",
        settings: "Privacy preferences",
      };

  const now = () => Date.now();
  const maxAgeMs = Number(config.consentMaxAgeDays) * 24 * 60 * 60 * 1000;

  const readConsent = () => {
    try {
      const raw = window.localStorage.getItem(config.consentStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!["granted", "denied"].includes(parsed.status)) return null;
      if (!parsed.updatedAt || now() - parsed.updatedAt > maxAgeMs) {
        window.localStorage.removeItem(config.consentStorageKey);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const writeConsent = (status) => {
    const value = { status, updatedAt: now(), provider: config.provider };
    try {
      window.localStorage.setItem(config.consentStorageKey, JSON.stringify(value));
    } catch {
      return value;
    }
    return value;
  };

  const cookieDomainCandidates = () => {
    const host = window.location.hostname;
    const parts = host.split(".");
    const candidates = ["", host];
    if (parts.length > 2) candidates.push(`.${parts.slice(-2).join(".")}`);
    if (parts.length >= 2) candidates.push(`.${host}`);
    return [...new Set(candidates)];
  };

  const clearGoogleAnalyticsCookies = () => {
    const names = document.cookie
      .split(";")
      .map((item) => item.trim().split("=")[0])
      .filter((name) => /^(_ga|_gid|_gat)/.test(name));
    const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
    for (const name of names) {
      for (const domain of cookieDomainCandidates()) {
        document.cookie = `${name}=; expires=${expires}; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
      }
    }
  };

  const gtag = (...args) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  };

  const setConsentMode = (analyticsStorage) => {
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    gtag("consent", "update", {
      analytics_storage: analyticsStorage,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  };

  const clamp = (value, max = config.maxEventValueLength) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);

  const redactSensitiveText = (value, max = config.maxEventValueLength) =>
    clamp(value, max)
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
      .replace(/(?:\+?\d[\s().-]*){7,}/g, "[phone]");

  const pathWithoutQuery = (url) => `${url.pathname || "/"}${url.hash && url.hash.length < 64 ? url.hash : ""}`;

  const pageLocale = () => {
    const htmlLang = document.documentElement.lang || "";
    if (htmlLang.startsWith("fr") || window.location.pathname.startsWith("/fr/")) return "fr";
    return "en";
  };

  const contentGroup = () => {
    const path = window.location.pathname.replace(/^\/fr\//, "/");
    const first = path.split("/").filter(Boolean)[0] || "home";
    return first.replace(/\.html$/, "") || "home";
  };

  const currentPageParams = () => ({
    page_type: clamp(document.body?.dataset.page || "unknown", 48),
    page_locale: pageLocale(),
    page_path: clamp(window.location.pathname || "/", 100),
    content_group: clamp(contentGroup(), 48),
    entry_id: clamp(document.body?.dataset.entryId || "", 96),
  });

  const referrerHost = () => {
    if (!document.referrer) return "direct";
    try {
      return clamp(new URL(document.referrer).hostname.replace(/^www\./, ""), 80);
    } catch {
      return "unknown";
    }
  };

  const cleanParams = (params = {}) => {
    const clean = {};
    Object.entries(params).forEach(([key, value]) => {
      if (!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(key)) return;
      if (value === undefined || value === null || value === "") return;
      if (typeof value === "number") {
        if (Number.isFinite(value)) clean[key] = value;
        return;
      }
      if (typeof value === "boolean") {
        clean[key] = value;
        return;
      }
      clean[key] = redactSensitiveText(value);
    });
    return clean;
  };

  const track = (eventName, params = {}) => {
    if (!state.loaded || readConsent()?.status !== "granted" || typeof window.gtag !== "function") return false;
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(eventName)) return false;
    window.gtag("event", eventName, cleanParams({ ...currentPageParams(), ...params }));
    return true;
  };

  const elementText = (element) => {
    if (!element) return "";
    const label =
      element.getAttribute?.("aria-label") ||
      element.getAttribute?.("title") ||
      element.querySelector?.("[data-project-graph-title]")?.textContent ||
      element.querySelector?.(".card__title, h1, h2, h3, strong")?.textContent ||
      element.textContent ||
      "";
    return redactSensitiveText(label, 90);
  };

  const elementLocation = (element) => {
    if (!element?.closest) return "content";
    if (element.closest("header")) return "header";
    if (element.closest("footer")) return "footer";
    if (element.closest("[data-search-results], [data-generated-search-results]")) return "search_results";
    if (element.closest("[data-command-palette]")) return "command_palette";
    if (element.closest("[data-local-graph]")) return "local_graph";
    if (element.closest("[data-project-graph]")) return "project_graph";
    if (element.closest("[data-graph-surface]")) return "graph_surface";
    if (element.closest("[data-project-tabs]")) return "project_tabs";
    if (element.closest("[data-project-moodboard]")) return "project_moodboard";
    if (element.closest("[data-engagement-panel]")) return "engagement_panel";
    if (element.closest(".hero")) return "hero";
    return "content";
  };

  const nearestEntryId = (element) =>
    clamp(element?.closest?.("[data-entry-id]")?.getAttribute("data-entry-id") || document.body?.dataset.entryId || "", 96);

  const linkType = (anchor, url) => {
    if (anchor.closest("[data-nav]")) return "navigation";
    if (anchor.closest("footer")) return "footer";
    if (anchor.closest("[data-search-results], [data-generated-search-results]")) return "search_result";
    if (anchor.closest("[data-local-graph], [data-project-graph], [data-graph-surface]")) return "graph";
    if (anchor.closest(".button-row") || anchor.classList.contains("button")) return "cta";
    const anchorHref = typeof anchor.href === "string" ? anchor.href : anchor.getAttribute("href") || "";
    if (url.pathname.includes("contact") || anchorHref.startsWith("mailto:")) return "contact";
    if (anchor.closest(".project-card, .program-card, .archive-card, .cross-nav-card, .panel")) return "card";
    return "link";
  };

  const trackAnchorClick = (anchor) => {
    if (!anchor?.href) return;
    if (anchor.matches("[data-analytics-ignore]")) return;
    const href = anchor.getAttribute("href") || "";
    const label = elementText(anchor);
    const location = elementLocation(anchor);

    if (href.startsWith("mailto:")) {
      track("generate_lead", {
        method: "email_link",
        link_text: label,
        link_location: location,
        entry_id: nearestEntryId(anchor),
      });
      return;
    }

    if (href.startsWith("tel:")) {
      track("generate_lead", {
        method: "phone_link",
        link_text: label,
        link_location: location,
        entry_id: nearestEntryId(anchor),
      });
      return;
    }

    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }

    const fileLike = /\.(pdf|zip|mp3|wav|aiff|flac|mp4|mov|webm|jpg|jpeg|png|webp|svg)(?:$|[?#])/i.test(url.pathname);
    if (fileLike || anchor.hasAttribute("download")) {
      track("file_download", {
        file_name: clamp(url.pathname.split("/").pop() || "download", 90),
        file_extension: clamp((url.pathname.split(".").pop() || "").toLowerCase(), 16),
        link_text: label,
        link_url: clamp(`${url.origin}${url.pathname}`, 100),
      });
      return;
    }

    if (url.origin !== window.location.origin) {
      track("ea_outbound_click", {
        link_domain: clamp(url.hostname.replace(/^www\./, ""), 80),
        link_url: clamp(`${url.origin}${url.pathname}`, 100),
        link_text: label,
        link_location: location,
      });
      return;
    }

    const type = linkType(anchor, url);
    if (type === "contact") {
      track("ea_contact_intent", {
        method: "contact_page_link",
        link_text: label,
        link_location: location,
      });
      return;
    }

    track("select_content", {
      content_type: type,
      content_id: nearestEntryId(anchor) || clamp(pathWithoutQuery(url), 100),
      link_text: label,
      link_location: location,
    });
  };

  const searchSource = (input) => {
    if (input.matches("[data-command-input]")) return "command_palette";
    if (input.matches("[data-generated-search-input]")) return "generated_search";
    return "site_search";
  };

  const resultCountFor = (input) => {
    const source = searchSource(input);
    const selector = source === "command_palette"
      ? "[data-command-results] a[href]"
      : source === "generated_search"
        ? "[data-generated-search-results] a[href]"
        : "[data-search-results] a[href], [data-search-results] tbody tr";
    return document.querySelectorAll(selector).length;
  };

  const trackSearchInput = (input) => {
    const value = redactSensitiveText(input.value || "", config.maxSearchTermLength);
    if (value.length < 2) return;
    const source = searchSource(input);
    const eventName = source === "command_palette" ? "ea_command_search" : "search";
    const params = {
      search_term: value,
      search_source: source,
      result_count: resultCountFor(input),
    };
    track(eventName, params);
  };

  const trackButtonClick = (button) => {
    const location = elementLocation(button);
    const label = elementText(button);

    if (button.matches("[data-language-option]")) {
      track("ea_language_switch", {
        language: clamp(button.getAttribute("data-language-option") || "", 12),
        link_location: location,
      });
      return;
    }

    if (button.matches("[data-analytics-preferences]")) {
      track("ea_privacy_preferences", { action: "open", link_location: location });
      return;
    }

    if (button.matches("[data-filter-toggle]")) {
      track("ea_filter_change", {
        filter_key: clamp(button.getAttribute("data-filter-key") || "", 48),
        filter_value: clamp(button.getAttribute("data-filter-value") || "", 64),
        filter_scope: clamp(button.closest("[data-filter-scope]")?.getAttribute("data-filter-scope") || "", 48),
      });
      return;
    }

    if (button.matches("[data-filter-reset]")) {
      track("ea_filter_change", {
        filter_key: "reset",
        filter_scope: clamp(button.closest("[data-filter-scope]")?.getAttribute("data-filter-scope") || "", 48),
      });
      return;
    }

    if (button.matches("[data-search-status-chip], [data-search-kind-chip]")) {
      track("ea_filter_change", {
        filter_key: button.matches("[data-search-status-chip]") ? "search_status" : "search_kind",
        filter_value: clamp(button.getAttribute("data-value") || "", 64),
        filter_scope: "knowledge_search",
      });
      return;
    }

    if (button.matches("[data-search-more]")) {
      track("select_content", {
        content_type: "search_more",
        content_id: "knowledge_search_more",
        link_text: label,
      });
      return;
    }

    if (button.matches("[data-project-tab]")) {
      track("select_content", {
        content_type: "project_tab",
        content_id: clamp(button.getAttribute("aria-controls") || label, 96),
        link_text: label,
      });
      return;
    }

    if (button.matches("[data-project-mood-filter]")) {
      track("ea_filter_change", {
        filter_key: "project_mood",
        filter_value: clamp(button.getAttribute("data-project-mood-filter") || "", 64),
        filter_scope: "project_moodboard",
      });
      return;
    }

    if (button.matches("[data-project-graph-node]")) {
      track("ea_graph_node_select", {
        graph_type: "project_graph",
        node_label: clamp(button.getAttribute("data-relation-label") || label, 80),
        node_title: clamp(button.getAttribute("data-relation-title") || "", 80),
      });
      return;
    }

    if (button.matches("[data-graph-node]")) {
      track("ea_graph_node_select", {
        graph_type: "surface_graph",
        node_label: clamp(button.getAttribute("data-node-label") || label, 80),
        node_index: Number(button.getAttribute("data-node-index") || 0),
      });
      return;
    }

    if (button.matches("[data-share-button]")) {
      track("ea_share_intent", {
        method: navigator.share ? "native_share" : "clipboard",
        content_type: "page",
        item_id: nearestEntryId(button) || currentPageParams().page_path,
      });
      return;
    }

    if (button.matches(".command-fab")) {
      track("select_content", {
        content_type: "command_palette",
        content_id: "open",
        link_text: label,
      });
      return;
    }

    if (button.matches("[data-command-close]")) {
      track("ea_ui_action", {
        action: "command_palette_close",
        link_location: location,
      });
    }
  };

  const bindInteractionTracking = () => {
    if (state.instrumentationBound) return;
    state.instrumentationBound = true;

    document.addEventListener("click", (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (anchor) {
        trackAnchorClick(anchor);
        return;
      }
      const button = event.target?.closest?.("button, [role='button']");
      if (!button) return;
      if (button.matches("[data-analytics-preferences]")) showBanner();
      trackButtonClick(button);
    });

    document.addEventListener("input", (event) => {
      const input = event.target?.closest?.("[data-search-input], [data-generated-search-input], [data-command-input]");
      if (!input) return;
      const existing = state.searchTimers.get(input);
      if (existing) window.clearTimeout(existing);
      state.searchTimers.set(input, window.setTimeout(() => trackSearchInput(input), 900));
    });

    window.addEventListener("scroll", () => {
      if (!state.loaded) return;
      window.requestAnimationFrame(trackScrollDepth);
    }, { passive: true });
  };

  const sectionLabel = (section, index) =>
    clamp(
      section.getAttribute("aria-label") ||
        section.querySelector(".eyebrow")?.textContent ||
        section.querySelector("h1, h2, h3, .card__title")?.textContent ||
        section.id ||
        section.dataset.render ||
        `section_${index + 1}`,
      90,
    );

  const candidateSections = () => [
    ...document.querySelectorAll(
      "main > section, [data-local-graph], [data-project-graph], [data-project-tabs], [data-project-moodboard], [data-graph-surface]",
    ),
  ];

  const startSectionTracking = () => {
    if (!("IntersectionObserver" in window) || state.sectionObserver) return;
    let observedCount = 0;
    state.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;
          const key = entry.target.dataset.analyticsSectionKey;
          if (!key || state.trackedSections.has(key)) return;
          const sent = track("ea_section_view", {
            section_id: key,
            section_label: entry.target.dataset.analyticsSectionLabel || key,
            section_index: Number(entry.target.dataset.analyticsSectionIndex || 0),
          });
          if (!sent) return;
          state.trackedSections.add(key);
          state.sectionObserver.unobserve(entry.target);
        });
      },
      { threshold: [0.45, 0.65], rootMargin: "0px 0px -12% 0px" },
    );

    candidateSections().slice(0, Number(config.sectionViewLimit)).forEach((section, index) => {
      if (section.dataset.analyticsSectionKey) return;
      observedCount += 1;
      const key = section.id || section.dataset.render || section.dataset.graphSrc || `section_${observedCount}`;
      section.dataset.analyticsSectionKey = clamp(key, 80);
      section.dataset.analyticsSectionLabel = sectionLabel(section, index);
      section.dataset.analyticsSectionIndex = String(index + 1);
      state.sectionObserver.observe(section);
    });
  };

  const trackScrollDepth = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const percent = Math.min(100, Math.round(((window.scrollY || 0) / max) * 100));
    config.scrollMilestones.forEach((milestone) => {
      if (percent < milestone || state.trackedScrollMilestones.has(milestone)) return;
      const sent = track("ea_scroll_depth", {
        percent_scrolled: milestone,
        page_height: Math.round(document.documentElement.scrollHeight || 0),
      });
      if (sent) state.trackedScrollMilestones.add(milestone);
    });
  };

  const startTimeTracking = () => {
    if (state.timeTrackingStarted) return;
    state.timeTrackingStarted = true;
    state.visibleSince = document.hidden ? 0 : now();

    const syncVisibility = () => {
      if (document.hidden) {
        if (state.visibleSince) {
          state.visibleSeconds += Math.max(0, Math.round((now() - state.visibleSince) / 1000));
          state.visibleSince = 0;
        }
        return;
      }
      if (!state.visibleSince) state.visibleSince = now();
    };

    document.addEventListener("visibilitychange", syncVisibility);
    window.setInterval(() => {
      syncVisibility();
      const activeSeconds = state.visibleSeconds + (state.visibleSince ? Math.max(0, Math.round((now() - state.visibleSince) / 1000)) : 0);
      config.timeMilestones.forEach((milestone) => {
        if (activeSeconds < milestone || state.trackedTimeMilestones.has(milestone)) return;
        const sent = track("ea_time_milestone", { active_time_seconds: milestone });
        if (sent) state.trackedTimeMilestones.add(milestone);
      });
    }, 5000);
  };

  const trackPageContext = () => {
    window.gtag("set", cleanParams(currentPageParams()));
    track("ea_page_context", {
      page_title: document.title || "",
      referrer_host: referrerHost(),
      screen_width: window.screen?.width || window.innerWidth || 0,
      viewport_width: window.innerWidth || 0,
    });
  };

  const loadGoogleTag = () => {
    if (state.loaded) return;
    state.loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    setConsentMode("granted");
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`;
    document.head.appendChild(script);
    gtag("js", new Date());
    gtag("config", config.measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: "SameSite=Lax;Secure",
    });
    trackPageContext();
    startSectionTracking();
    startTimeTracking();
    trackScrollDepth();
  };

  const hideBanner = () => {
    state.banner?.remove();
    state.banner = null;
  };

  const applyConsent = (status) => {
    writeConsent(status);
    if (status === "granted") {
      loadGoogleTag();
      track("ea_analytics_consent", { consent_action: "granted" });
    } else {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
      clearGoogleAnalyticsCookies();
    }
    hideBanner();
  };

  const createBanner = () => {
    if (state.banner) return state.banner;
    const text = copy();
    const banner = document.createElement("section");
    banner.className = "consent-banner";
    banner.setAttribute("aria-label", text.settings);
    banner.innerHTML = `
      <div class="consent-banner__panel" role="dialog" aria-modal="false" aria-labelledby="ea-consent-title">
        <div class="consent-banner__copy">
          <p class="card__meta">${text.settings}</p>
          <h2 class="card__title" id="ea-consent-title">${text.title}</h2>
          <p class="card__copy">${text.body}</p>
          <a class="tag" href="${config.privacyUrl}">${text.privacy}</a>
        </div>
        <div class="consent-banner__actions">
          <button class="button button--secondary" type="button" data-consent-choice="denied">${text.reject}</button>
          <button class="button button--primary" type="button" data-consent-choice="granted">${text.accept}</button>
        </div>
      </div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent-choice]");
      if (!button) return;
      applyConsent(button.getAttribute("data-consent-choice"));
    });
    state.banner = banner;
    return banner;
  };

  const showBanner = () => {
    document.body.appendChild(createBanner());
  };

  const bindPreferenceButtons = () => {
    document.querySelectorAll("[data-analytics-preferences]").forEach((button) => {
      if (button.dataset.boundAnalyticsPreferences === "true") return;
      button.dataset.boundAnalyticsPreferences = "true";
      button.addEventListener("click", showBanner);
    });
  };

  const init = () => {
    bindInteractionTracking();
    bindPreferenceButtons();
    const consent = readConsent();
    if (consent?.status === "granted") {
      loadGoogleTag();
      return;
    }
    if (consent?.status === "denied") {
      clearGoogleAnalyticsCookies();
      return;
    }
    showBanner();
  };

  window.EA_ANALYTICS = {
    configured: true,
    openPreferences: showBanner,
    getConsent: readConsent,
    setConsent: applyConsent,
    track,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
