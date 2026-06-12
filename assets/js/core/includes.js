(function () {
  const resolveIncludeUrl = (key) => {
    if (!key) return null;
    if (key === "header") return "./assets/partials/header.html";
    if (key === "footer") return "./assets/partials/footer.html";
    return `./assets/partials/${key}`;
  };

  const loadIncludes = async (root = document) => {
    const nodes = [...root.querySelectorAll("[data-include]")];
    if (!nodes.length) return;

    await Promise.all(
      nodes.map(async (node) => {
        const url = resolveIncludeUrl(node.getAttribute("data-include"));
        if (!url) return;
        const response = await fetch(url);
        node.innerHTML = await response.text();
        node.removeAttribute("data-include");
      }),
    );

    if (root.querySelector("[data-include]")) {
      await loadIncludes(root);
    }
  };

  window.EA_INCLUDES = {
    resolveIncludeUrl,
    loadIncludes,
  };
})();
