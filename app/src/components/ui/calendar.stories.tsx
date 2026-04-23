import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => <Calendar />,
};

export const WithSelectedDate: Story = {
  render: () => <Calendar selected={new Date()} />,
};

export const WithDateRange: Story = {
  render: () => (
    <Calendar
      mode="range"
      selected={{
        from: new Date(2023, 0, 1),
        to: new Date(2023, 0, 5),
      }}
    />
  ),
};
