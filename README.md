# Storybook + Tailwind CSS + Alpine.js

An HTML-first UI workspace built with Storybook, Tailwind CSS, and Alpine.js.

Components are rendered as complete Alpine-enabled HTML strings, documented in Storybook, and styled with generated Tailwind CSS design tokens.

## Features

- Storybook documentation for color, typography, and radius tokens
- Tailwind CSS v4 theme generation with Style Dictionary
- HTML-first Switch and Select components
- Storybook Controls for component configuration
- Alpine.js behavior for component interactions
- Automatic Storybook source output from the rendered HTML
- An Example Card pattern composed from the existing Select and Switch renderers
- A generated Portable HTML playground that uses the same design tokens

## Component Architecture

Each component exposes a small TypeScript renderer. The renderer accepts its configuration and returns the final Alpine HTML used by Storybook Canvas.

```text
Storybook args
      │
      ▼
component renderer
      │
      ▼
final Alpine HTML
      │
      ▼
Storybook Canvas
```

Stories call the renderer directly:

```ts
render: (args) => renderSwitch(args);
```

Renderers use readable HTML template literals and only handle markup, initial configuration, and composition.

### Inline Alpine state

Simple components can serialize their initial state directly into `x-data`. Switch uses this approach:

```html
<div x-data='{"enabled":false,"disabled":false}'>
  <!-- Switch markup -->
</div>
```

### Alpine providers

Components with more interaction logic keep that behavior in an Alpine provider. Select renders its initial configuration into the provider call:

```html
<div x-data='select({"size":"sm","error":false,"disabled":false})'>
  <!-- Select markup -->
</div>
```

The Select behavior remains in `select.ts`. Providers are registered centrally before Alpine starts, so renderers do not register providers or manage the Alpine runtime.

### Pattern composition

Patterns compose existing renderers instead of copying component markup. Example Card is assembled from the current Select and Switch implementations:

```ts
export function renderExampleCard() {
  return `
    <section>
      <!-- Pattern content -->
      ${renderSelect({ size: "sm" })}
      ${renderSwitch()}
    </section>
  `;
}
```

The pattern owns only its semantic content, container, and layout. Component state and behavior remain with the component renderers and Alpine providers.

## Tech Stack

- [Storybook](https://storybook.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Alpine.js](https://alpinejs.dev/)
- [Style Dictionary](https://styledictionary.com/)
- [Vite](https://vite.dev/)
- TypeScript

## Getting Started

### Requirements

- [nvm](https://github.com/nvm-sh/nvm)
- [pnpm](https://pnpm.io/)

The Node.js version for this project is defined in `.nvmrc`.

### 1. Set up Node.js

```sh
nvm install
nvm use
```

### 2. Install dependencies

```sh
pnpm install
```

### 3. Start Storybook

```sh
pnpm storybook
```

Storybook will start at:

```text
http://localhost:6006
```

Design tokens are automatically regenerated before Storybook starts.

## Design Token Workflow

Source tokens are stored as DTCG-compatible JSON data and processed with Style Dictionary.

```text
DTCG-compatible tokens
            │
            ▼
     Style Dictionary
            │
            ├──► Tailwind CSS v4 theme
            │
            ├──► Storybook documentation data
            │
            └──► Portable HTML
```

The current Storybook foundations document colors, typography, and radius values.

Generated files should not be edited manually.

To regenerate token outputs manually:

```sh
pnpm tokens:build
```

To remove generated token outputs:

```sh
pnpm tokens:clean
```

## Portable HTML

The project generates a standalone HTML file that includes the generated theme and loads Tailwind CSS and Alpine.js from a CDN.

This provides a lightweight playground where component markup can be copied and modified without installing dependencies or understanding the entire Storybook project.

Component HTML can be copied into the Portable HTML file and modified directly with Tailwind utilities and Alpine.js interactions.

The Portable HTML environment is generated from the same token source used by Storybook, which keeps standalone examples aligned with the documented foundations.

## Build

To build the static Storybook:

```sh
pnpm build-storybook
```

Token generation runs automatically before Storybook is built.

## License

This project is licensed under the [MIT License](LICENSE).
