import type { Polygon } from "@/types/farm";

export const generateRandomPolygons = (numPolygons: number): Polygon[] => {
  const polygons: Polygon[] = [];
  for (let i = 0; i < numPolygons; i++) {
    const randomLat = 60 + Math.random() * 2;
    const randomLng = 24 + Math.random() * 6;
    const randomOffset = () => (Math.random() - 0.5) * 0.01;

    polygons.push({
      id: `polygon-${i}`,
      shortCode: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      active: true,
      status: null,
      areaCalculated: null,
      areaManual: null,
      coordinates: [
        [randomLng, randomLat],
        [randomLng + randomOffset(), randomLat + randomOffset()],
        [randomLng + randomOffset(), randomLat + randomOffset()],
        [randomLng + randomOffset(), randomLat + randomOffset()],
        [randomLng, randomLat], // Close the polygon
      ],
      source: "IMPORT",
      plotId: Math.random().toString(16).substr(2, 8), // Random plotId
    });
  }
  return polygons;
};
