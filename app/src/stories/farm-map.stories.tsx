import FarmMap from "@/components/map/farm-map-story";
import StoryDataProvider from "@/components/map/story-data-provider";
import { MapData } from "@/components/map/utils/config/farm-map-config";
import { generateMultipleFarms } from "@/components/utils/generateRandomFarms";
import { Meta, StoryObj } from "@storybook/react";

const mapData: MapData[] = generateMultipleFarms(50);

const meta: Meta<typeof FarmMap> = {
  component: (props) => <StoryDataProvider {...props} mapData={mapData} />,
};

export default meta;
type Story = StoryObj<typeof StoryDataProvider>;

export const DataProvider: Story = {
  name: "Map Story Provider",
  args: {},
};
