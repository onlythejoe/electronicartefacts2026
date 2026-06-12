(function () {
  const esc = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const currentYear = () => new Date().getFullYear();

  const setYear = () => {
    const yearNode = document.getElementById("current-year");
    if (yearNode) yearNode.textContent = String(currentYear());
  };

  const chunk = (items, size) => {
    const output = [];
    for (let index = 0; index < items.length; index += size) {
      output.push(items.slice(index, index + size));
    }
    return output;
  };

  window.EA_UTILS = {
    esc,
    currentYear,
    setYear,
    chunk,
  };
})();
