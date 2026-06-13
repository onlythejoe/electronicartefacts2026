(function () {
  const esc = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const slugify = (value) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const currentYear = () => new Date().getFullYear();

  const setYear = () => {
    const yearNode = document.getElementById("current-year");
    if (yearNode) yearNode.textContent = String(currentYear());
  };

  window.EA_UTILS = {
    esc,
    slugify,
    currentYear,
    setYear,
  };
})();
