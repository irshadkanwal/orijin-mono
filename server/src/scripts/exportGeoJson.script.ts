import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FirestoreFarmInspectionGetterService } from '../firestore/firestoreFarmInspectionGetter.service';
import { FirestoreService } from '../firestore/firestore.service';
import { FarmsService } from '../farms/farms.service';
import { PolygonUtilService } from '../polygonUtil/polygonUtil.service';
import * as fs from 'fs';

const init = async () => {
  console.log(
    '== Get latest polygons from Firestore via API and import them as farm inspections == ',
  );

  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const farmService = context.get<FarmsService>(FarmsService);
  const polygonUtil = context.get<PolygonUtilService>(PolygonUtilService);
  const firestoreService = context.get<FirestoreService>(FirestoreService);
  const firestoreFarmInspectionGetterService: FirestoreFarmInspectionGetterService =
    context.get<FirestoreFarmInspectionGetterService>(
      FirestoreFarmInspectionGetterService,
    );

  // Get all farms and their polygons for LTC
  const farms = await farmService.getMany({
    organisation: 'ltc',
    seasonCode: '2024/25',
  });

  console.log('Processing: ' + farms.data.length);

  // Convert them to GeoJSON if active
  const goodPolygons = farms.data
    .flatMap((farm) =>
      farm.plots.map((plot) => {
        const activePolygons = plot.polygons.filter(
          (polygon) => polygon.active,
        );
        // console.log(activePolygons);
        if (activePolygons.length > 0) {
          const coords = activePolygons[0].coordinates as number[][];
          if (coords.length < 4) {
            console.log(
              'Polygon with less than 3 coordinates found: ' +
                farm.facility.shortCode +
                ' ' +
                plot.shortCode +
                ' ' +
                coords.length,
            );
            return null;
          }
          return {
            properties: {
              farmShortCode: farm.facility.shortCode,
              plotShortCode: plot.shortCode,
              updatedBy: farm.updatedBy,
              updatedAt: farm.updatedAt,
            },
            coordinates: coords,
          };
        }
        return null;
      }),
    )
    .filter((polygon) => polygon);

  const unfixablePolygons = farms.data
    .flatMap((farm) =>
      farm.plots.map((plot) => {
        const activePolygons = plot.polygons.filter(
          (polygon) => polygon.active,
        );
        if (
          plot.polygons.length > 0 &&
          activePolygons.length === 0 &&
          plot.polygons[0].coordinates
        ) {
          return {
            properties: {
              farmShortCode: farm.facility.shortCode,
              plotShortCode: plot.shortCode,
              updatedBy: farm.updatedBy,
              updatedAt: farm.updatedAt,
            },
            coordinates: plot.polygons[0].coordinates as number[][],
          };
        }
        return null;
      }),
    )
    .filter((polygon) => polygon);

  if (!fs.existsSync('test/out')) {
    fs.mkdirSync('test/out');
  }

  fs.writeFileSync(
    'test/out/ltc-fixed-polygons.json',
    JSON.stringify(polygonUtil.convertToGeoJson(goodPolygons, false)),
  );
  fs.writeFileSync(
    'test/out/ltc-unfixable-polygons.json',
    JSON.stringify(polygonUtil.convertToGeoJson(unfixablePolygons, false)),
  );
};

init();
