import type { Meta, StoryObj } from "@storybook/react";
import { FacetedSelect } from "./faceted-select";
import { Icons } from "@/components/icons";

const meta: Meta<typeof FacetedSelect> = {
  component: FacetedSelect,
  title: "UI/FacetedSelect",
};

export default meta;

type Story = StoryObj<typeof FacetedSelect>;

const options = [
  { value: "react", label: "React", icon: Icons.arrowBigDown },
  { value: "vue", label: "Vue", icon: Icons.arrowRight },
  { value: "svelte", label: "Svelte", icon: Icons.billing },
  { value: "angular", label: "Angular", icon: Icons.boxIcon },
];

export const Default: Story = {
  args: {
    title: "Frameworks",
    options,
    values: [],
    handleChange: (values) => {
      console.log("Selected values:", values);
    },
  },
};

export const WithPreselectedValues: Story = {
  args: {
    ...Default.args,
    values: ["react", "vue"],
  },
};

export const NoOptions: Story = {
  args: {
    ...Default.args,
    options: [],
  },
};
