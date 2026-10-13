import { findSearchMatches } from "/assets/js/search/scoring.js?v=1";

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const locale = document.documentElement.lang === "fr" ? "fr" : "en";
const label = (english, french) => locale === "fr" ? french : english;
const resultMarkup = (document) => `
  <article class="panel">
    <p class="card__meta">${escapeHtml(document.type)} · ${escapeHtml(document.status)}</p>
    <h2 class="card__title"><a href="${escapeHtml(document.route)}">${escapeHtml(document.title)}</a></h2>
    <p class="card__copy">${escapeHtml(document.definition || document.abstract)}</p>
    <div class="link-row"><a class="tag" href="${escapeHtml(document.route)}">${label("Open canonical record", "Ouvrir la fiche canonique")}</a></div>
  </article>`;

const start = async () => {
  const input = document.querySelector("[data-generated-search-input]");
  const results = document.querySelector("[data-generated-search-results]");
  if (!input || !results) return;
  const status = document.querySelector("[data-generated-search-status]");
  let documents = null;
  let loading = false;
  input.value = new URLSearchParams(location.search).get("q") || "";
  const render = () => {
    if (!documents) return;
    const query = input.value.trim();
    const matches = findSearchMatches(documents, query, locale);
    results.innerHTML = query
      ? matches.length ? matches.map(resultMarkup).join("")
        : `<article class="panel"><p class="card__copy">${label("No matching public records.", "Aucune fiche publique correspondante.")}</p></article>`
      : `<article class="panel"><p class="card__copy">${label("Search Graph Runtime, VASTE, Vestiges or Runtime Theory.", "Recherchez Runtime de graphe, VASTE, Vestiges ou Théorie du runtime.")}</p></article>`;
    if (status) status.textContent = query ? label(`${matches.length} results`, `${matches.length} résultats`) : "";
  };
  input.addEventListener("input", () => {
    const url = new URL(location.href);
    const query = input.value.trim();
    if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
    history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
    render();
  });
  const load = async (retry = false) => {
    if (loading) return;
    loading = true;
    results.setAttribute("aria-busy", "true");
    results.innerHTML = `<p class="card__copy">${label("Loading public records…", "Chargement des fiches publiques…")}</p>`;
    try {
      const response = await fetch("/search/documents.json", { credentials: "same-origin" });
      if (!response.ok) throw new Error(`Search data HTTP ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload) || !payload.every((item) => item && typeof item.title === "string" && typeof item.route === "string" && ["en", "fr"].includes(item.locale))) throw new Error("Invalid search data");
      documents = payload;
      render();
      if (retry) input.focus({ preventScroll: true });
    } catch {
      documents = null;
      if (status) status.textContent = "";
      results.innerHTML = `<article class="panel"><p class="card__copy" role="alert">${label("Search is temporarily unavailable. Please try again.", "La recherche est temporairement indisponible. Réessayez.")}</p><button class="button button--secondary" type="button" data-generated-search-retry>${label("Try again", "Réessayer")}</button></article>`;
      const button = results.querySelector("[data-generated-search-retry]");
      button.addEventListener("click", () => load(true));
      if (retry) button.focus({ preventScroll: true });
    } finally {
      loading = false;
      results.setAttribute("aria-busy", "false");
    }
  };
  await load();
};

start();
