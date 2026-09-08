import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderAlpine } from "../../helpers/render-alpine";

import switchHtml from "./switch.html?raw";

type SwitchArgs = {
  enabled: boolean;
  disabled: boolean;
};

const meta = {
  title: "Components/Switch",

  args: {
    enabled: false,
    disabled: false,
  },

  argTypes: {
    enabled: {
      control: "boolean",
    },

    disabled: {
      control: "boolean",
    },
  },

  render: (args) => renderAlpine(switchHtml, args),

  parameters: {
    layout: "centered",

    docs: {
      source: {
        code: switchHtml,
        language: "html",
        type: "code",
      },
    },
  },
} satisfies Meta<SwitchArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
