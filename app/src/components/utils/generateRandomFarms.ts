import { Farm, Plot, Polygon } from "@/types/farm";

const generateRandomName = (index: number): string => {
  const names = [
    "Adele Kambala",
    "John Doe",
    "Jane Smith",
    "Farmington",
    "Greenfield",
    "Sunnyvale",
  ];
  return names[index % names.length];
};

const getRandomPoint = (
  previousPoint: { lat: number; long: number },
  maxDistance: number
) => {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * maxDistance;
  const lat = previousPoint.lat + Math.cos(angle) * distance;
  const long = previousPoint.long + Math.sin(angle) * distance;
  return { lat, long };
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generatePolygon = (
  startingPoint: { lat: number; long: number },
  distanceFromStartingPointVariance: number,
  maxDistanceBetweenPoints: number,
  minPoints: number = 5,
  maxPoints: number = 8
): [number, number][] => {
  const numPoints = getRandomInt(minPoints, maxPoints);
  const start = getRandomPoint(
    startingPoint,
    distanceFromStartingPointVariance
  );
  const points = [start];

  for (let i = 1; i < numPoints; i++) {
    const newPoint = getRandomPoint(points[i - 1], maxDistanceBetweenPoints);
    points.push(newPoint);
  }

  return points.map((point) => [point.lat, point.long]);
};
const generateRandomPolygons = (
  numPolygons: number,
  index: number,
  farmId: string
): Polygon[] => {
  const polygons: Polygon[] = [];

  for (let i = 0; i < numPolygons; i++) {
    const randomLat = 30 + Math.random() * 2;
    const randomLng = 12 + Math.random() * 6;
    const startingPoint = { lat: randomLat, long: randomLng };

    const isSinglePointPolygon =
      index === 10 || index === 17 || index === 34 || index === 23;
    const coordinates = isSinglePointPolygon
      ? [[startingPoint.long, startingPoint.lat]]
      : generatePolygon(startingPoint, 0.1, 0.004);

    polygons.push({
      id: `polygon-${i}-${farmId.split("cm1hvjy5a")[0]}`,
      shortCode: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      active: true,
      status: null,
      areaCalculated: null,
      areaManual: null,
      coordinates,
      source: "IMPORT",
      plotId: Math.random().toString(16).substr(2, 8),
    });
  }

  return polygons;
};

const generateRandomPlots = (count: number) => {
  const plots = [];
  for (let i = 0; i < count; i++) {
    const polygonCoordinates = generatePolygon(
      { lat: 30.111, long: 0.6111 },
      0.1,
      0.004
    );

    plots.push({
      shortCode: "PLOT-" + Math.random().toString(36).substr(2, 8),
      name: "Plot-" + (i + 1),
      polygonCoordinates,
      polygonSource: "IMPORT",
    });
  }
  return plots;
};
const generateOffsetFromVertex = (coordinates: number[][]) => {
  const vertexIndex = Math.floor(Math.random() * coordinates.length);
  const vertex = coordinates[vertexIndex];
  const maxDistance = 0.003;
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * maxDistance;
  return {
    latitude: vertex?.[0]! + distance * Math.sin(angle),
    longitude: vertex?.[1]! + distance * Math.cos(angle),
  };
};

export const generateMultipleFarms = (numFarms: number): any[] => {
  const farms: any[] = [];
  for (let index = 0; index < numFarms; index++) {
    const farmId = `cm1hvjy5a${Math.random().toString(36).substring(2, 15)}`;
    const facilityId = `cm1hvjxsr${Math.random().toString(36).substring(2, 15)}`;

    const numPolygons = Math.floor(Math.random() * 2) + 1;
    const polygons = generateRandomPolygons(numPolygons, index, farmId);

    const plots = generateRandomPlots(Math.floor(Math.random() * 5) + 1);
    const firstPlot = plots[0];
    const farmhouseLocation = generateOffsetFromVertex(
      firstPlot.polygonCoordinates
    );

    const farmData = {
      id: farmId,
      facility: {
        id: facilityId,
        name: generateRandomName(index),
        shortCode: `FARM-${(index + 1).toString().padStart(3, "0")}`,
        coordinate: farmhouseLocation,
      },
      polygons: polygons,
      plots: plots,
      updatedBy: "system",
      updatedAt: new Date().toISOString(),
    };

    farms.push(farmData);
  }
  return farms;
};
