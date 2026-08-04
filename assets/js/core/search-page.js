(function () {
  performance.mark?.("ea:search-runtime-start");
  const catalog = window.EA_SEARCH_CATALOG || { entities: [] };
  const isFrench = document.documentElement.lang === "fr" || location.pathname.startsWith("/fr/");
  const locale = isFrench ? "fr" : "en";
  const translations = window.EA_EDITORIAL_TRANSLATIONS || {};
  const tr = (value) => isFrench ? translations[value] || value : value;
  const local = (english, french) => isFrench ? french : english;
  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const pretty = (value) => String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
  const frenchTypeLabels = {
    artefact: "Artefact", collection: "Collection", concept: "Concept", framework: "Cadre",
    organization: "Organisation", program: "Programme", project: "Projet", publication: "Publication",
    researchField: "Domaine de recherche", researchQuestion: "Question de recherche", technology: "Technologie",
  };
  const frenchStatusLabels = { active: "Actif", archived: "Archivé", canonical: "Canonique", development: "Développement", experimental: "Expérimental", public: "Public", research: "Recherche", validated: "Validé" };
  const typeLabel = (value) => isFrench ? frenchTypeLabels[value] || pretty(value) : pretty(value);
  const statusLabel = (value) => isFrench ? frenchStatusLabels[value] || pretty(value) : pretty(value);
  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const records = (catalog.entities || []).filter((record) => record.locale === locale && record.visibility === "public");
  const statuses = [...new Set(records.map((record) => record.status).filter(Boolean))].sort();
  const types = [...new Set(records.map((record) => record.type).filter(Boolean))].sort();
  const params = new URLSearchParams(location.search);
  const state = { query: params.get("q") || "", status: params.get("status") || "all", type: params.get("kind") || "all", page: 1, pageSize: 12 };
  const searchTarget = document.querySelector('[data-render="search-page"]');
  const crossTarget = document.querySelector('[data-render="cross-navigation"]');

  const statusBadge = (record) => record.status
    ? `<span class="status-badge" data-status="${esc(record.status)}">${esc(statusLabel(record.status))}</span>`
    : "";
  const chip = (value) => `<span class="chip">${esc(value)}</span>`;
  const routeCard = ({ kicker, title, copy, reason, cta, href }) => `
    <article class="panel panel--soft card-link-surface" data-card-link="${esc(href)}">
      <p class="card__meta">${esc(tr(kicker))}</p><h3 class="card__title">${esc(tr(title))}</h3>
      <p class="card__copy">${esc(tr(copy))}</p><p class="card__copy">${esc(tr(reason))}</p>
      <div class="link-row"><a class="tag" href="${esc(href)}">${esc(tr(cta))}</a></div>
    </article>`;
  const syncUrl = () => {
    const url = new URL(location.href);
    [["q", state.query], ["status", state.status === "all" ? "" : state.status], ["kind", state.type === "all" ? "" : state.type]].forEach(([key, value]) => value ? url.searchParams.set(key, value) : url.searchParams.delete(key));
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };
  const matches = () => {
    const terms = normalize(state.query).split(/\s+/).filter(Boolean);
    return records.filter((record) => {
      if (state.status !== "all" && record.status !== state.status) return false;
      if (state.type !== "all" && record.type !== state.type) return false;
      if (!terms.length) return true;
      const searchable = normalize([record.title, record.subtitle, record.summary, record.abstract, record.type, record.status, ...(record.tags || []), ...(record.discipline || [])].filter(Boolean).join(" "));
      return terms.every((term) => searchable.includes(term));
    }).sort((left, right) => String(left.type).localeCompare(String(right.type)) || String(left.title).localeCompare(String(right.title), locale));
  };
  const resultsMarkup = () => {
    const hasSearch = Boolean(state.query.trim()) || state.status !== "all" || state.type !== "all";
    if (!hasSearch) return `<section class="zone-card hero catalog-overview catalog-overview--idle"><div class="section-head"><p class="eyebrow">${esc(local("SEARCH READY", "RECHERCHE PRÊTE"))}</p><h2>${esc(local("Enter a subject, project or program.", "Saisissez un sujet, un projet ou un programme."))}</h2><p class="lede">${esc(local("Results appear after you type or select a filter. This keeps the full archive out of the initial page.", "Les résultats apparaissent après la saisie ou la sélection d’un filtre. Le catalogue complet reste ainsi hors du chargement initial."))}</p></div></section>`;
    const all = matches();
    if (!all.length) return `<section class="zone-card hero catalog-overview"><div class="section-head"><p class="eyebrow">${esc(local("CATALOG MATRIX", "MATRICE DU CATALOGUE"))}</p><h2>${esc(local("Nothing matched.", "Aucun résultat."))}</h2><p class="lede">${esc(local("Try a broader query or clear the filters.", "Essayez une requête plus large ou effacez les filtres."))}</p></div></section>`;
    const shown = all.slice(0, state.page * state.pageSize);
    return `<section class="zone-card hero catalog-overview">
      <div class="section-head"><p class="eyebrow">${esc(local("CATALOG MATRIX", "MATRICE DU CATALOGUE"))}</p><h2>${all.length} ${esc(local(all.length === 1 ? "result" : "results", all.length === 1 ? "résultat" : "résultats"))}</h2><p class="lede">${esc(local("Open an item to consult its complete canonical page.", "Ouvrez un élément pour consulter sa page canonique complète."))}</p></div>
      <div class="catalog-table-shell" role="region" aria-label="${esc(local("Archive overview table", "Tableau d’ensemble des archives"))}" tabindex="0"><table class="catalog-table"><thead><tr>
        <th scope="col">${esc(local("Type / ID", "Type / ID"))}</th><th scope="col">${esc(local("Title", "Titre"))}</th><th scope="col">${esc(local("Content", "Contenu"))}</th><th scope="col">${esc(local("Tags", "Mots-clés"))}</th><th scope="col">${esc(local("Meta", "Métadonnées"))}</th><th scope="col">${esc(local("Open", "Ouvrir"))}</th>
      </tr></thead><tbody>${shown.map((record) => {
        const tags = [...new Set([...(record.tags || []), ...(record.discipline || [])])].slice(0, 6);
        return `<tr data-entry-id="${esc(record.id)}"><td class="catalog-table__identity"><span class="catalog-table__kind">${esc(typeLabel(record.type))}</span><span class="catalog-table__id">${esc(record.id)}</span></td>
          <td class="catalog-table__title-cell"><div class="catalog-table__title"><a href="${esc(record.route)}">${esc(record.title)}</a>${record.subtitle ? `<span class="catalog-table__subtitle">${esc(record.subtitle)}</span>` : ""}</div></td>
          <td class="catalog-table__content-cell"><div class="catalog-table__content"><div class="catalog-table__content-item"><span>${esc(local("Summary", "Résumé"))}</span><p>${esc(record.summary || record.abstract || local("No public summary is available for this record.", "Aucun résumé public n’est disponible pour cette fiche."))}</p></div></div></td>
          <td class="catalog-table__tags-cell"><div class="catalog-tags">${tags.length ? tags.map(chip).join("") : `<span class="catalog-table__empty">${esc(local("Unlisted", "Non renseigné"))}</span>`}</div></td>
          <td class="catalog-table__meta-cell"><div class="catalog-table__meta">${statusBadge(record)}<span class="catalog-table__meta-line">${esc(typeLabel(record.type))}</span></div></td>
          <td class="catalog-table__open-cell"><a class="tag catalog-table__open" href="${esc(record.route)}">${esc(local("Open", "Ouvrir"))}</a></td></tr>`;
      }).join("")}</tbody></table></div>
      ${shown.length < all.length ? `<div class="catalog-overview__more"><button class="button button--secondary" type="button" data-search-more>${esc(local("Show more", "Afficher la suite"))}</button></div>` : ""}
    </section>`;
  };
  const renderResults = () => {
    const target = document.querySelector("[data-search-results]");
    if (target) target.innerHTML = resultsMarkup();
  };
  if (searchTarget) searchTarget.innerHTML = `
    <section class="zone-card hero" data-search-shell><div class="section-head"><p class="eyebrow">${esc(tr("KNOWLEDGE SEARCH"))}</p><h1 class="display-title">${esc(tr("Find the work behind the words."))}</h1><p class="lede">${esc(tr("Search across projects, programs, people, research fields, artefacts and collections. Results retain their type, status and relations so a match always has context."))}</p></div>
      <div class="stat-grid search-guide"><article class="stat-card"><p class="card__meta">${esc(tr("Search by subject"))}</p><strong>${esc(tr("Knowledge, memory, governance"))}</strong><span>${esc(tr("Use concepts when you want to move across several projects and entity types."))}</span></article>
      <article class="stat-card"><p class="card__meta">${esc(tr("Search by name"))}</p><strong>Vestiges, VASTE, Palimpsests</strong><span>${esc(tr("Use a project or program name when you already know the entry point."))}</span></article>
      <article class="stat-card"><p class="card__meta">${esc(tr("Narrow the field"))}</p><strong>${esc(tr("Status and entity type"))}</strong><span>${esc(tr("Filters distinguish active systems, archived work, research and public projects."))}</span></article></div>
      <div class="taxonomy-grid"><div class="taxonomy-column"><label class="card__meta" for="knowledge-search-input">${esc(tr("Query"))}</label><input id="knowledge-search-input" class="search-input" type="search" data-search-input placeholder="${esc(tr("Search title, text or tags..."))}" autocomplete="off" value="${esc(state.query)}" /></div>
      <div class="taxonomy-column"><p class="card__meta">${esc(tr("Status"))}</p><div class="pill-cloud" data-search-status>${[["all", tr("All")], ...statuses.map((status) => [status, statusLabel(status)])].map(([value, label]) => `<button type="button" class="filter-chip${state.status === value ? " is-active" : ""}" data-search-status-chip data-value="${esc(value)}" aria-pressed="${state.status === value}">${esc(label)}</button>`).join("")}</div></div>
      <div class="taxonomy-column"><p class="card__meta">${esc(tr("Entity type"))}</p><div class="pill-cloud" data-search-kind>${[["all", tr("All")], ...types.map((type) => [type, typeLabel(type)])].map(([value, label]) => `<button type="button" class="filter-chip${state.type === value ? " is-active" : ""}" data-search-kind-chip data-value="${esc(value)}" aria-pressed="${state.type === value}">${esc(label)}</button>`).join("")}</div></div></div>
    </section><section class="stack" data-search-results>${resultsMarkup()}</section>`;
  if (crossTarget) crossTarget.innerHTML = `<section class="zone-card hero"><div class="section-head"><p class="eyebrow">${esc(tr("CONTINUE EXPLORING"))}</p><h2>${esc(tr("A site held together by clear paths."))}</h2><p class="lede">${esc(tr("Pages stay linked through the same frame: work, research, archive, contact and the external systems around them."))}</p></div><div class="card-grid card-grid--two">${(isFrench ? [
    ["Socle", "Expertise", "Projets, musique et technologie.", "La couche studio et ses réalisations.", "Retour à l’expertise", "/work.html"],
    ["Socle", "Projets", "Réalisations publiques et dossiers détaillés.", "La constellation publique des projets.", "Parcourir les projets", "/projects.html"],
    ["Socle", "Programmes", "Tous les programmes logiciels visibles.", "La couche des runtimes et des systèmes.", "Voir les programmes", "/programs.html"],
    ["Socle", "Recherche", "Programmes, domaines et notes.", "La couche conceptuelle et expérimentale.", "Explorer la recherche", "/research.html"],
  ] : [
    ["Core", "Work", "Projects, music and technology.", "The studio layer and applied outcomes.", "Return to Work", "/work.html"],
    ["Core", "Projects", "Public works and extended dossiers.", "The public project constellation.", "Browse Projects", "/projects.html"],
    ["Core", "Programs", "All visible software programs.", "The runtime and systems layer.", "View Programs", "/programs.html"],
    ["Core", "Research", "Program, fields and notes.", "The conceptual and experimental layer.", "Explore Research", "/research.html"],
  ]).map(([kicker, title, copy, reason, cta, href]) => routeCard({ kicker, title, copy, reason, cta, href })).join("")}</div></section>`;

  const scheduleResults = (() => {
    let frame = 0;
    return () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; syncUrl(); renderResults(); });
    };
  })();
  document.querySelector("[data-search-input]")?.addEventListener("input", (event) => { state.query = event.currentTarget.value.trim(); state.page = 1; scheduleResults(); });
  document.querySelectorAll("[data-search-status-chip]").forEach((button) => button.addEventListener("click", () => {
    state.status = button.dataset.value || "all"; state.page = 1;
    document.querySelectorAll("[data-search-status-chip]").forEach((candidate) => { const active = candidate === button; candidate.classList.toggle("is-active", active); candidate.setAttribute("aria-pressed", String(active)); });
    scheduleResults();
  }));
  document.querySelectorAll("[data-search-kind-chip]").forEach((button) => button.addEventListener("click", () => {
    state.type = button.dataset.value || "all"; state.page = 1;
    document.querySelectorAll("[data-search-kind-chip]").forEach((candidate) => { const active = candidate === button; candidate.classList.toggle("is-active", active); candidate.setAttribute("aria-pressed", String(active)); });
    scheduleResults();
  }));
  document.addEventListener("click", (event) => {
    if (!event.target.closest?.("[data-search-more]")) return;
    state.page += 1; renderResults();
  });
  performance.mark?.("ea:search-interactive");
  try { performance.measure?.("ea:search-start-to-interactive", "ea:search-runtime-start", "ea:search-interactive"); } catch {}
})();
