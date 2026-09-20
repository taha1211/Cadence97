# Cadence97

A personal workspace for documents, ideas, and canvases. Cadence97 is an independent fork of AFFiNE, built around local editing and the BlockSuite editor.

## Run locally

Use Node.js 22.23.2 and the Yarn version checked into this repository:

```sh
node .yarn/releases/yarn-4.18.0.cjs install --immutable
node .yarn/releases/yarn-4.18.0.cjs affine web dev
```

Open [localhost:8080](http://localhost:8080). On the configured development machine, `./af web dev` selects the isolated Node 22 runtime automatically. Keep the server terminal open while using the app.

## Current product

- Documents, canvases, folders, tags, journals, search, and local templates.
- Google Sans typography with shared Material 3 inspired controls and surfaces.
- Local workspace creation with a Cadence97 welcome document.
- Import and document export; the Export menu includes HTML, Markdown, PNG, snapshots, and printing.
- No hosted account requirement, pricing screens, app-download prompts, or vendor AI upsells in the desktop web interface.
- Vendor analytics and crash-reporting initialization are disabled.

Workspace data is stored in the browser profile for this origin. Clearing site data removes it. Export important work regularly; the Print action can save a PDF. Different browsers have separate workspaces.

The local web experience does not require the upstream hosted service. Legacy native clients, backend modules, package names, database identifiers, and document schemas remain in the repository where needed for compatibility. They are not a Cadence97 cloud offering.

## Development

Agents must follow [AGENTS.md](AGENTS.md). Adding or expanding any test or automated
check requires a concrete justification and the owner's explicit approval first.

The web entry point lives in `packages/frontend/apps/web`, application features in `packages/frontend/core`, and shared UI in `packages/frontend/component`. The editor is under `blocksuite`.

When relevant to a change, run the existing workspace-creation regression tests with Node 22:

```sh
node node_modules/vitest/vitest.mjs run packages/frontend/core/src/utils/__tests__/first-app-data.spec.ts
```

## Attribution and licenses

Cadence97 includes work by the AFFiNE and BlockSuite contributors. Original copyright and license notices remain in [LICENSE](LICENSE), [LICENSE-MIT](LICENSE-MIT), and component-specific license files. Backend and native portions have separate terms described in the root license. Google Sans is bundled with its own license and source record under `packages/frontend/component/src/fonts/google-sans`.
