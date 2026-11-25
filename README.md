# deadmodel

A single-page dead model storefront built with TanStack Start. The homepage is the shop: explore the ADA denim, check the size Small guide, choose quantities and review an order without leaving the page. Checkout is a preview: it does **not** place an order or collect payment.

## Develop

### Editing the storefront without code

Once `.pages.yml` **and** the accompanying content files are on `main`, open [Pages CMS](https://app.pagescms.org/), select **deancochran/deadmodel** and branch **main**. Invited editors sign in with the email address that received the invitation. Refresh or reopen the repository after the initial setup.

- **Brand identity & page details**: change the brand name, horizontal logo and its accessible text, square PNG browser icon, tab title and search description. Change the logo **once**: the header, footer and printed product details use the same artwork. The browser icon is separate; choose something readable when tiny.
- **Garment & gallery**: edit the product heading, short name, description, weight, color, materials and fit details. Add, replace, reorder or remove still photographs (keep 1–8). Give each view a short name and useful alt text. **The first photo** is the main product image, order-review thumbnail and printed garment photo; put a clear full-length shot first.
- **Brand story & artwork**: edit the navigation/section label, story headline and paragraphs, and **either side of the print card**. Each side has its own image and description. These artwork images appear in the online story, not in the one-page product printout.
- **Size Small sample guide**: revise the introduction and the _public_ Small measurement rows (reference letter, measurement name, location note and inches). Do not add grading rules, measurements for other sizes or a private tech pack. Changing order quantities never changes the guide.
- Click **Save**. A save to `main` is a publishing action, not a draft: GitHub Actions tests the committed content and deploys it if checks pass. Refresh the storefront after the workflow finishes. If a save doesn't appear, check the selected branch and the [workflow status](https://github.com/deancochran/deadmodel/actions/workflows/check.yml).

**How to replace an image:** open the form where it appears, use the image picker, upload a web-sized public export with a new filename, select it, update the description and save the form. Uploading to the media library alone does not switch the image on the site. Don’t delete the old file until nothing references it. Use a transparent PNG for a wordmark and a square PNG for the favicon. Check the homepage, phone layout and browser print preview after changing a primary photo or logo.

`.pages.yml` points to four JSON files under `content/` plus separate media folders for the garment, identity, and editorial artwork. All uploads are public. The editor intentionally excludes prices, currency, SKUs, the range of sizes that can be ordered, checkout/eligibility rules, technical layout, licensed fonts and accessibility controls. Price changes need owner review because they affect both the displayed price and the order math. No admin interface, database, private assets or credentials are served by the shop.

**What isn't a content field?** The print and expand icons, close buttons, keyboard instructions, errors and no-payment notice are part of the interface, not brand assets. Leave those with the developer. Motion loops and the campaign film need separate decisions about still posters, captions, reduced motion, and who can see the film. Do not upload exclusive media to these public libraries. For a future design refresh, review font licensing, contrast and a print proof rather than changing global CSS from the editor.

**Before the collection grows:** a second garment would need a product collection, not another set of fields on this page. A dedicated image for shared links, campaign media, and a scheduled seasonal launch would also be separate features; adding files to Media alone does not create placements on the storefront.

### Local development

Use Node 22.12+ (or `nvm use`) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/. The homepage prerenders the product, prices, printable size grid and brand notes. `src/features/storefront/ada.ts` validates garment content alongside developer-owned size/SKU IDs and unit prices in USD cents. `order.ts` validates the order draft and calculates the displayed quote. **Print details** or the browser's print action produces a filled or blank line sheet on A4 or US Letter.

### Assets and launch review

`public/brand/` contains web exports based on the [prototype at f29a851](https://github.com/deancochran/deadmodel/tree/f29a851/public/buyer-sheet/assets), not final production masters. Keep the Inter OFL notice with its font. Asset URLs honor the Pages project prefix. Before live sales:

- Replace/approve all four garment views (full length, pockets, fringe, hem), print-quality full-length photography, crops, alt text and usage rights. The fringe reference is only 200×259; it isn't a high-resolution zoom asset.
- Replace/approve the wordmark, favicon artwork, front/reverse print cards, brand guide, and approved licensed sans/mono fonts. The mono face currently falls back to the system typewriter font.
- Confirm the ADA garment copy and retail/wholesale prices. Check the screen layouts and A4/Letter proofs with the final font and photos.
- Source loop/GIF masters with stills and the campaign video, poster, captions and rights once their placement and access are decided. They are not needed for this preview. Never put exclusive or unreleased originals in this public repository.

Future commerce needs a commerce-capable host ([Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)) and trusted backend. Resolve SKU, authorized tier, stock, payment and fulfillment server-side. The retail first-30 distinct paid buyers need durable, atomic eligibility and one claim per unique shirt; a wholesale campaign needs its **own** paid-order entitlement and private media delivery if exclusive. Neither decision may be made from the browser or a success redirect.

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

`npm test` builds and type-checks the project, then runs Playwright against the static files at desktop and mobile sizes. To match the Pages job, use `PAGES_BASE_PATH=/deadmodel npm test`. Coverage includes no-JavaScript reading, gallery keyboard navigation, offline order review, accessibility with axe, and single-page blank/filled A4 and Letter PDFs in `test-results/`.
