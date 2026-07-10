# Electronic Artefacts Vitrine

Static knowledge-platform website for Electronic Artefacts.

The repository is organized around a generated-site pipeline:

1. Structured records live in `content/`.
2. TypeScript build code in `src/` validates, connects, renders, and indexes those records.
3. `scripts/build-site.ts` writes the public HTML, JSON-LD, graph, search, sitemap, and manifest outputs.
4. Root HTML files and route directories are the published static surface.

## Working Commands

```sh
npm run validate
npm run typecheck
npm test
npm run build
npm run check
```

After a successful production deployment, notify IndexNow-compatible search engines about either selected routes or the full sitemap:

```sh
npm run indexnow:submit -- /work.html /projects.html
npm run indexnow:submit -- --all
```

Do not submit before the deployment is live: search engines verify the public key file on `electronicartefacts.com`.

## Repository Map

- `content/` - source-of-truth Markdown entities and YAML relation statements.
- `src/schema/` - entity, relation, predicate, and frontmatter contracts.
- `src/legacy-data/` - non-published compatibility inputs for the legacy browser runtime.
- `src/config/` - site constants, route rules, and publication contracts.
- `src/build/` - loaders, graph validation, catalog building, route building, and output helpers.
- `src/templates/` - page layouts and reusable HTML components.
- `src/semantic/`, `src/seo/`, `src/search/`, `src/graph/` - generated metadata, JSON-LD, indexes, and graph views.
- `scripts/` - executable build, validation, migration, and SEO entry points.
- `assets/` - CSS, browser JS, partials, imagery, media, and static frontend resources.
- `tests/` - Node test coverage for schema, routes, relations, graph, search, SEO, and build output.
- `generated/`, `graph/`, `id/`, `search/`, route folders, and root `*.html` files - tracked static output and published pages.
- `docs/` - architecture notes, audits, specs, and implementation records.

See [docs/architecture/repository-architecture.md](docs/architecture/repository-architecture.md) for the detailed architecture rules.
