import type { Meta, StoryObj } from "@storybook/react";
import PolygonMap from "@/components/map/polygon-map";
import type { Polygon } from "@/types/farm";
import { generateRandomPolygons } from "@/components/utils/generateRandomPolygons";

const polygons: Polygon[] = generateRandomPolygons(500);

const meta: Meta<typeof PolygonMap> = {
  component: PolygonMap,
};

export default meta;
type Story = StoryObj<typeof PolygonMap>;

export const Polygons: Story = {
  // 👇 Rename this story
  name: "I am the primary",
  args: {
    polygons,
  },
};

export const JustDots: Story = {
  // 👇 Rename this story
  name: "Justdots",
  args: {
    polygons,
  },
};

//
//
// export default { title: "PolygonMap", component: PolygonMap };
//
// export const PolygonMapStory = (args: {
//   polygons: Polygon[];
//   callback: (data: Polygon) => void;
// }) => <PolygonMap {...args} />;
//
// PolygonMapStory.args = { polygons };
