import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderSelect, type SelectArgs } from "./select.render";

const meta = {
  title: "Components/Select",

  args: {
    size: "md",
    error: false,
    disabled: false,
  },

  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },

    error: {
      control: "boolean",
    },

    disabled: {
      control: "boolean",
    },
  },

  render: (args) => renderSelect(args),

  parameters: {
    layout: "centered",
  },
} satisfies Meta<SelectArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
