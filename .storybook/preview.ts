import type { Preview } from "@storybook/html-vite";

import "../src/styles/global.css";

import { initAlpine } from "../src/alpine";
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
