(function () {
  const includeCache = new Map();

  const resolveIncludeUrl = (key) => {
    if (!key) return null;
    if (key === "header") return "./assets/partials/header.html";
    if (key === "footer") return "./assets/partials/footer.html";
    return `./assets/partials/${key}`;
  };

  const fetchInclude = async (url) => {
    if (!includeCache.has(url)) {
      includeCache.set(
        url,
        fetch(url).then((response) => {
          if (!response.ok) throw new Error(`Failed to load include: ${url}`);
          return response.text();
        }),
      );
    }
    return includeCache.get(url);
  };

  const loadIncludes = async (root = document) => {
    const nodes = [...root.querySelectorAll("[data-include]")];
    if (!nodes.length) return;

    await Promise.all(
      nodes.map(async (node) => {
        const url = resolveIncludeUrl(node.getAttribute("data-include"));
        if (!url) return;
        node.innerHTML = await fetchInclude(url);
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
