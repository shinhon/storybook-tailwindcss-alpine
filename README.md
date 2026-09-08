# Storybook + Tailwind CSS + Alpine.js

An experimental, HTML-first Storybook setup for designers and engineers to build and discuss UI designs and interactions—with help from AI tools.

The project explores a workflow in which component code stays lightweight and portable, so design decisions can be inspected, modified, and discussed without being tied to an application's business logic.

## Current Scope

The token-generation workflow currently support colors only.

DTCG-compatible color tokens are processed with Style Dictionary to generate:

- Tailwind CSS v4 theme variables
- structured color data for Storybook documentation
- a standalone Portable HTML environment that uses the same generated color theme

Support for generating code and MDX documentation for other token types is planned.

The project also contains lightweight HTML + Alpine.js component examples for experimenting with interactions inside Storybook.

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

## Color Token Workflow

Source tokens are stored as DTCG-compatible JSON data and processed with Style Dictionary.

```text
DTCG-compatible color tokens
            │
            ▼
     Style Dictionary
            │
            ├──► Tailwind CSS v4 theme
            │
            ├──► Storybook color data
            │
            └──► Portable HTML
```

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

The project generates a standalone HTML file that includes the generated color theme and loads Tailwind CSS and Alpine.js from a CDN.

This provides a lightweight playground where component markup can be copied and modified without installing dependencies or understanding the entire Storybook project.

For example, a designer can copy a component's HTML, open the Portable HTML file locally, and experiment directly with Tailwind utilities and Alpine.js interactions, either manually or with the help of an AI coding tool.

The Portable HTML environment is generated from the same token source used by Storybook, which helps keep experiments aligned with the documented color palette.

## Alpine.js and Storybook Controls

Components remain close to plain HTML and use Alpine.js for interactions.

A small Storybook helper maps Storybook `args` to the component root's `x-data`, allowing Storybook Controls to manipulate Alpine component state without requiring a separate implementation for the story.

```ts
render: (args) => renderAlpine(componentHtml, args);
```

The goal is to keep the component markup readable on its own and portable while still making it interactive inside Storybook.

## Build

To build the static Storybook:

```sh
pnpm build-storybook
```

Token generation runs automatically before Storybook is built.

## Project Status

This project is experimental and under active development.

The initial token-generation workflow intentionally focuses on colors. Additional design-token and documentation workflows may be explored in future releases.

## License

This project is licensed under the [MIT License](LICENSE).
