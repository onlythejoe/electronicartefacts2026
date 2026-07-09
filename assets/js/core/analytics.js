(function () {
  const CONFIG = {
    enabled: true,
    provider: "Google Analytics 4",
    measurementId: "",
    consentStorageKey: "ea:analytics-consent:v1",
    consentMaxAgeDays: 180,
    privacyUrl: "/confidentialite.html",
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
    };
    return;
  }

  const state = {
    loaded: false,
    banner: null,
  };

  const isFrench = () => document.documentElement.lang === "fr" || document.body?.dataset.locale === "fr";
  const copy = () => isFrench()
    ? {
        title: "Mesure d'audience",
        body: "Electronic Artefacts utilise Google Analytics uniquement si vous l'acceptez, afin de comprendre les pages consultees et d'ameliorer le site. Le refus est sans effet sur l'acces.",
        accept: "Accepter",
        reject: "Refuser",
        privacy: "Politique de confidentialite",
        settings: "Preferences de confidentialite",
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
  };

  const hideBanner = () => {
    state.banner?.remove();
    state.banner = null;
  };

  const applyConsent = (status) => {
    writeConsent(status);
    if (status === "granted") {
      loadGoogleTag();
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
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
