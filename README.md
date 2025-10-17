# FeverTokens Documentation

This repository hosts the FeverTokens product docs built with [Docusaurus](https://docusaurus.io/). The site is focused on guiding developers through the Fever CLI quickstart experience, which lives at the `/quickstart` route and mirrors the in-product onboarding flow.

## Prerequisites

- Node.js `>=20`
- npm `>=9`

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm run start
```

The local dev server opens at `http://localhost:3000`. The homepage immediately redirects to the Quickstart introduction so you can validate the onboarding journey in the same way users will.

## Build for production

```bash
npm run build
```

Static assets are generated in the `build/` directory. To preview the production output locally run:

```bash
npm run serve
```

## Deploy

```bash
npm run deploy
```

Configure the usual Docusaurus environment variables (`USE_SSH`, `GIT_USER`, etc.) depending on how you publish the site.

## Contributing to the docs

- Quickstart guides live under `docs/quickstart/`. File names follow a numeric prefix so sidebar ordering stays intact.
- The sidebar definition is in `sidebars.ts` and the navbar configuration in `docusaurus.config.ts`.
- Use `npm run build` before opening a PR to catch broken links and frontmatter issues early.
