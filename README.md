# FeverTokens Documentation

This repository contains the FeverTokens documentation site built with [Docusaurus](https://docusaurus.io/). The published site highlights the Fever CLI manuals—covering installation, getting-started workflows, advanced guides, and troubleshooting—accessible from the `/cli` routes.

## Documentation Structure

The content in `docs/` is currently organized around the Fever CLI:

- `docs/CLI/intro.md` introduces the CLI, highlights key features like declarative manifests and deterministic deployments, and clarifies who benefits from the tool.
- `docs/CLI/installation.md` walks through npm-based installation, version requirements, verification commands, and common permission fixes.
- `docs/CLI/getting-started.md` covers authenticating, selecting projects, compiling Solidity sources, and inspecting artifact status.
- `docs/CLI/commands/index.md` provides an overview of available commands, with detailed pages such as `apply.md`, `compile.md`, `networks.md`, `node.md`, `projects.md`, `artifacts.md`, `auth.md`, `wallets.md`, and `install.md` under `docs/CLI/commands/`.
- `docs/CLI/advanced-usage.md` explains advanced features including manifest structure, CREATE2 deployments, and Diamond application support.
- `docs/CLI/configuration.md` documents environment variables, project network files, and global CLI settings.
- `docs/CLI/troubleshooting.md` catalogues solutions for installation, authentication, compilation, deployment, and artifact sync issues.

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

The local dev server opens at `http://localhost:3000`. The homepage immediately redirects to the CLI introduction (`/cli/intro`) so you can validate the onboarding journey in the same way users will.

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

- CLI guides live under `docs/CLI/`, with subdirectories (like `commands/`) matching the sidebar grouping.
- The sidebar definition is in `sidebars.ts` and the navbar configuration in `docusaurus.config.ts`.
- Use `npm run build` before opening a PR to catch broken links and frontmatter issues early.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
