import type { Meta, StoryObj } from "@storybook/react";
import type { Polygon } from "@/types/farm";
import { examplePolygons } from "./autofix-polygon";
import { useEffect, useState } from "react";
import PolygonMap from "@/components/map/polygon-map";
import * as turf from "@turf/turf";

const handleAutoFix = async (
  coordinates: number[][] | undefined,
  source: string,
  plotShortCode: string
) => {
  try {
    const response = await fetch("http://localhost:3000/autofix-polygons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        polygonCoordinates: coordinates,
        polygonSource: source,
        plotShortCode: plotShortCode,
      }),
    });
    const data: Polygon[] = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};

const fixPolygons = async (
  callbackAutofixServerError: (is: boolean) => void
) => {
  const promises = examplePolygons.map(async (poly, i) => {
    const originalAndFixed = await handleAutoFix(
      poly.geometry.coordinates[0],
      "IMPORT",
      "SHORT-CODE"
    );

    // If fetch in handleAutoFix return error
    if (!originalAndFixed) {
      callbackAutofixServerError(true);
      return generatePolygon(poly);
    }

    if (originalAndFixed.length <= 1) {
      return originalAndFixed;
    }

    // Shift autofixed polygon
    const shiftedPolygonCoordinates = turf.transformTranslate(
      turf.polygon([originalAndFixed[1]?.coordinates]),
      80, // Shift distance in meters
      90, // Shift direction (90 degrees - east)
      { units: "meters" }
    );
    return [
      originalAndFixed[0],
      {
        ...originalAndFixed[1],
        coordinates: shiftedPolygonCoordinates.geometry.coordinates[0],
      },
    ];
  });
  const fixedPolygons = await Promise.all(promises);
  return fixedPolygons.flat();
};

function generatePolygon(polygon: (typeof examplePolygons)[0]) {
  return [
    {
      source: "IMPORT",
      coordinates: polygon.geometry.coordinates[0],
      polygonWarnings: [],
      areaCalculated: 0,
      active: false,
    },
  ];
}

const meta: Meta<typeof AutoFixPolygonsStory> = {
  component: AutoFixPolygonsStory,
};

export default meta;
type Story = StoryObj<typeof AutoFixPolygonsStory>;

export const Polygons: Story = {
  name: "I am the primary",
  args: {
    polygons: await fixPolygons(() => {}),
  },
};

export function AutoFixPolygonsStory() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [autofixServerError, setAutofixServerError] = useState(false);

  useEffect(() => {
    async function handleSetPolygons() {
      setPolygons((await fixPolygons(setAutofixServerError)) as Polygon[]);
    }
    handleSetPolygons().catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <div className="relative">
      {!!polygons.length && (
        <PolygonMap polygons={polygons} callback={() => {}} />
      )}

      {autofixServerError && (
        <div className="absolute right-2 top-2 rounded-lg bg-red-400 p-2 text-sm font-medium text-red-800">
          WARN: Failed to get a response from the server.
          <br />
          Start the server to see autofixed polygons
        </div>
      )}
      {/* {result && <pre>{JSON.stringify(result, null, 2)}</pre>} */}
    </div>
  );
}
