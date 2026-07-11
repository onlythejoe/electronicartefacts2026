import { escapeHtml } from "./html.js";

export const renderLegacyRedirectPage = (title: string, routeMap: Record<string, string>, fallback: string): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,follow" />
    <title>${escapeHtml(title)} | Electronic Artefacts</title>
    <link rel="stylesheet" href="/assets/css/app.css?v=52" />
    <script>
      (function () {
        var id = new URLSearchParams(window.location.search).get("id");
        var routes = ${JSON.stringify(routeMap).replaceAll("<", "\\u003c")};
        if (id && routes[id]) window.location.replace(routes[id] + window.location.hash);
      })();
    </script>
  </head>
  <body>
    <main class="site-main">
      <section class="zone-card hero">
        <div class="section-head">
          <p class="eyebrow">LEGACY ROUTE</p>
          <h1 class="display-title">${escapeHtml(title)}</h1>
          <p class="lede">This address has moved to a canonical knowledge-platform route.</p>
        </div>
        <div class="link-row"><a class="button button--primary" href="${escapeHtml(fallback)}">Continue</a></div>
      </section>
    </main>
  </body>
</html>`;
