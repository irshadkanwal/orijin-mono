import { GeoCoordinate, Plot as PrismaPlotType, Prisma } from '@prisma/client';
import { PolygonWarning } from '../../polygonUtil/dto/polygonUtil.dto';
import { Polygon } from '../../geodatas/models/geodatas.model';

export enum PlotType {
  Annual = 'Annual',
  Permanent = 'Permanent',
}
export enum PlotCoordinateSources {
  IMPORT = 'IMPORT',
  ORIJIN_APP = 'ORIJIN_APP',
  GEOCLEDIAN = 'GEOCLEDIAN',
  AUTOFIX = 'AUTOFIX',
}

const plotWithRelations = Prisma.validator<Prisma.PlotDefaultArgs>()({
  include: {
    polygons: true,
    satelliteAnalysis: true,
    farm: true,
  },
});

export interface Plot
  extends PrismaPlotType,
    Prisma.PlotGetPayload<typeof plotWithRelations> {
  type: PlotType | string;
  coordinate?: GeoCoordinate;
  polygons: Polygon[];
  polygonWarnings: PolygonWarning[];
}
