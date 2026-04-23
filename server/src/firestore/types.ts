export type EntityParent = {
  label: string;
  labelShort: string;
};

export type V1GeoData = {
  wip: boolean;
  entityParent: EntityParent;
  areaAc: number;
  areaHa: number;
  selfIntersects: boolean;
  areaCalculated: number;
  areaManual: number;
  data: Array<{
    lat: number;
    lng: number;
    altitude: number;
  }>;
  createdDate: {
    toDate: () => Date;
  };
  updatedBy: {
    label: string;
  };
  notes: string;
  name: string;
  farm: string;
};

export type GeoDataProperties = {
  areaAc: number;
  areaHa: number;
  selfIntersects: boolean;
  areaCalculated: number;
  areaManual: number;
  pointCount: number;
  label: string;
  entity: string;
  createdDate: Date;
  updatedBy: string;
  notes: string;
  name: string;
  farm: string;
  wip: boolean;
};

export type OurGeoData = GeoDataProperties & {
  data: number[][];
};

export function convertProperties(
  data: V1GeoData,
  points: any[],
): GeoDataProperties {
  return {
    wip: data.wip,
    entity: data.entityParent.labelShort,
    label: data.entityParent.labelShort,
    areaAc: data.areaAc,
    areaHa: data.areaHa,
    selfIntersects: data.selfIntersects,
    areaCalculated: data.areaCalculated,
    areaManual: data.areaManual,
    pointCount: points.length,
    createdDate: data.createdDate.toDate(),
    updatedBy: data.updatedBy.label,
    notes: data.notes,
    name: data.name,
    farm: data.entityParent.label,
  };
}

export const REQUIRED_POLYGON_LENGTH = 4;

export function convertToPreGeodataFormat(geodatas: OurGeoData[]) {
  const polygons1 = geodatas.map((geodata: OurGeoData) => {
    return {
      coordinates: geodata.data,
      properties: {
        ...geodata,
        data: undefined,
      },
    };
  });
  return polygons1;
}

export function isVAlid(geodata: V1GeoData) {
  return (
    geodata.data.length >= REQUIRED_POLYGON_LENGTH &&
    geodata.areaHa &&
    parseFloat(geodata.areaHa + '') < 10
  );
}
export function convertToCsv(data: V1GeoData, index) {
  return {
    index,
    status: data.wip ? 'WIP ' : 'Done',
    ...data,
    createdDate: data.createdDate.toDate().toISOString(),
  };
}

export function convertToCsvOurGeoData(data: OurGeoData, index) {
  return {
    index,
    status: data.wip ? 'WIP ' : 'Done',
    ...data,
    createdDate: data.createdDate.toISOString(),
  };
}
