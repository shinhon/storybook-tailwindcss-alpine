import type { Meta, StoryObj } from "@storybook/html-vite";

import { renderExampleCard } from "./example-card.render";

const meta = {
  title: "Patterns/Example Card",

  render: () => renderExampleCard(),

  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
