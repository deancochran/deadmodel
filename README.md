# deadmodel

A small, static TanStack Start site. Its first page pairs an SVG form study with a caption editor that works entirely in the browser. Edits reset on reload; nothing is stored or sent.

## Develop

Use Node 22.12+ (or `nvm use`) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Change the homepage in `src/routes/index.tsx`, the study and validated form in `src/components/study.tsx`, or the palette and typography in `src/styles.css`.

## GitHub Pages

Live site: **https://deancochran.github.io/deadmodel/**.

Push or merge into `main` to publish. [GitHub Actions](https://github.com/deancochran/deadmodel/actions/workflows/check.yml) lints, builds, type-checks, and runs browser tests at the Pages URL path. Only a successful `main` build uploads `dist/client/` and deploys it to the `github-pages` environment. Pull requests test without deploying. To redeploy the current version, select **Run workflow** on `main`. Keep **Settings → Pages → Source** set to **GitHub Actions**. No deployment secrets or `gh-pages` branch are needed.

## Preview static files locally

```sh
npm run build
npm run preview
```

Preview at http://127.0.0.1:4173. To mirror the project-site URL locally, set `PAGES_BASE_PATH=/deadmodel` in the environment for **both** commands, then visit http://127.0.0.1:4173/deadmodel/. Leave it unset for root hosting. No Node server, API, runtime environment variables, or SPA fallback is needed in production. The `dist/server/` bundle is used during the build, not deployed.

## Project conventions

- Routes live in `src/routes/`. TanStack generates `src/routeTree.gen.ts` during dev/build; keep it in version control and do not edit it by hand. For future parameterized routes, list the concrete paths for prerendering in `vite.config.ts`.
- Use Tailwind CSS and the local shadcn/ui components in `src/components/ui/`. Add another with `npx shadcn@4 add <component>`; `components.json` defines the paths and theme.
- Define form constraints once in Zod, infer the TypeScript type, and connect the schema to React Hook Form with `zodResolver`.
- `npm run typecheck` enforces strict TypeScript; `npm run check` checks formatting, imports, and lint rules with Biome. `npm run format` applies safe fixes.

## Verify

```sh
npx playwright install --with-deps --only-shell chromium
npm run check
npm test
```

`npm test` builds and type-checks the project, then runs Playwright against the static files at desktop and mobile sizes. It checks the no-JavaScript page, offline form validation, layout overflow, and automated accessibility rules with axe.
