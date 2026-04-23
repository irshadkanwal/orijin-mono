type LocationData = {
  locationId: string;
  locationName: string;
  farmCount: number;
};
export type ChartData = {
  type: string;
  locationName: string;
  farmCount: number;
};
type LocationType =
  | "District"
  | "SubCounty"
  | "Village"
  | "Parish"
  | "CustomLocation";

type InputData = {
  [key in Exclude<LocationType, "CustomLocation">]?: LocationData[];
} & {
  [key: string]: LocationData[] | undefined; // For CustomLocation
};

export const transformData = (data: InputData): ChartData[] => {
  const allowedTypes: Set<LocationType> = new Set([
    "District",
    "SubCounty",
    "Village",
    "Parish",
  ]);
  const transformedArray: ChartData[] = [];

  for (const [type, locations] of Object.entries(data)) {
    // Determine if the type should be 'CustomLocation'
    const finalType: LocationType = allowedTypes.has(type as LocationType)
      ? (type as LocationType)
      : "CustomLocation";

    locations?.forEach((location) => {
      transformedArray.push({
        type: finalType,
        locationName: location.locationName,
        farmCount: location.farmCount,
      });
    });
  }

  return transformedArray;
};

// Function to preprocess data for stacked bar chart
export const preprocessData = (data: ChartData[]) => {
  const groupedData: Record<string, any> = {};

  data.forEach((item) => {
    if (!groupedData[item.type]) {
      groupedData[item.type] = { type: item.type };
    }
    groupedData[item.type][item.locationName] = item.farmCount;
  });

  return Object.values(groupedData);
};
