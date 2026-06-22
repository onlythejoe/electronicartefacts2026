const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const normalize = (value) => String(value || "").toLowerCase().normalize("NFKD");

const scoreDocument = (document, query) => {
  const phrase = normalize(query).trim();
  if (!phrase) return 0;
  const fields = [
    [document.title, 12],
    [(document.alternateNames || []).join(" "), 9],
    [document.definition, 8],
    [(document.questions || []).join(" "), 7],
    [(document.headings || []).join(" "), 5],
    [document.abstract, 4],
    [(document.tags || []).join(" "), 3],
    [(document.relationLabels || []).join(" "), 2],
    [document.body, 1],
  ];
  return fields.reduce((score, [value, boost]) => {
    const text = normalize(value);
    if (!text.includes(phrase)) return score;
    return score + boost * (text === phrase ? 1.5 : 1);
  }, 0);
};

const resultMarkup = (document) => `
  <article class="panel">
    <p class="card__meta">${escapeHtml(document.type)} · ${escapeHtml(document.status)}</p>
    <h2 class="card__title"><a href="${escapeHtml(document.route)}">${escapeHtml(document.title)}</a></h2>
    <p class="card__copy">${escapeHtml(document.definition || document.abstract)}</p>
    <div class="link-row"><a class="tag" href="${escapeHtml(document.route)}">Open canonical record</a></div>
  </article>`;

const start = async () => {
  const input = document.querySelector("[data-generated-search-input]");
  const results = document.querySelector("[data-generated-search-results]");
  if (!input || !results) return;
  const response = await fetch("/search/documents.json");
  const documents = await response.json();
  const render = () => {
    const query = input.value.trim();
    const matches = documents
      .map((document) => ({ document, score: scoreDocument(document, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
      .slice(0, 30);
    results.innerHTML = query
      ? matches.length
        ? matches.map((item) => resultMarkup(item.document)).join("")
        : `<article class="panel"><p class="card__copy">No matching public records.</p></article>`
      : `<article class="panel"><p class="card__copy">Search Graph Runtime, VASTE, Vestiges or Runtime Theory.</p></article>`;
  };
  input.addEventListener("input", render);
  const query = new URLSearchParams(location.search).get("q");
  if (query) input.value = query;
  render();
};

start();
