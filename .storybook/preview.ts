import type { Preview } from "@storybook/html-vite";

import "../src/styles/global.css";

import { initAlpine } from "../src/alpine";
import { registerAlpineComponents } from "../src/alpine-components";
import { docsTheme } from "./docs-theme";

registerAlpineComponents();
initAlpine();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      disableSaveFromUI: true,
    },
    docs: {
      codePanel: true,
      theme: docsTheme,
    },
    options: {
      storySort: {
        order: ["Documents", "Foundations", "Components"],
        method: "alphabetical",
      },
    },
  },
};

export default preview;
