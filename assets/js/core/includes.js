(function () {
  const includeCache = new Map();
  const includeVersion = "26";

  const resolveIncludeUrl = (key) => {
    if (!key) return null;
    const path =
      key === "header"
        ? "./assets/partials/header.html"
        : key === "footer"
          ? "./assets/partials/footer.html"
          : `./assets/partials/${key}`;
    return `${path}?v=${includeVersion}`;
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
