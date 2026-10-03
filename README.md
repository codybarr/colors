# colors

A small, single-page web app for identifying the closest named color to an sRGB color.

Choose a color with the native picker or edit a color value directly. The app displays the selected color alongside its closest named-color match, then lets you switch to that match.

## Features

- Accepts `#RRGGBB`, `rgb(...)`, and (where supported) `oklch(...)` color values
- Shows HEX, RGB, and browser-supported OKLCH representations
- Copies each representation to the clipboard
- Matches against the [`color-name-list`](https://github.com/meodai/color-names) **Best Of** catalog
- Prefers exact catalog matches; otherwise compares colors by Euclidean distance in OKLab
- Uses a contrasting foreground color and keyboard-visible focus states

## Stack

- SvelteKit and Svelte 5
- TypeScript
- Tailwind CSS 4
- Ark UI Svelte
- Bun

## Getting started

Install dependencies and start the development server:

```sh
bun install
bun run dev
```

Create a production build and preview it locally:

```sh
bun run build
bun run preview
```

## Cloudflare Workers

The app uses the Cloudflare adapter and `wrangler.jsonc` to deploy to the `colors` Worker.
Configure the connected repository in Cloudflare with:

- **Build command:** `bun run build`
- **Deploy command:** `bunx wrangler deploy`
- **Root directory:** repository root

Validate the deployment bundle locally without publishing:

```sh
bun run build
bunx wrangler deploy --dry-run
```

## Quality checks

```sh
# Type-check Svelte and TypeScript
bun run check

# Run unit tests
bun run test:unit

# Run Playwright end-to-end tests
bun run test:e2e

# Run all tests
bun run test
```

## Updating the named-color catalog

The generated catalog lives at `src/lib/color/catalog.ts`. Regenerate it after updating `color-name-list`:

```sh
bun run generate:catalog
```

The catalog is derived from `color-name-list`'s Best Of subset. Its license is included at `src/lib/color/LICENSE-color-name-list.txt`.
