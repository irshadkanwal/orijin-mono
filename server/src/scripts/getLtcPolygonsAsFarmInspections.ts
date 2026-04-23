import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FirestoreFarmInspectionGetterService } from '../firestore/firestoreFarmInspectionGetter.service';
import { FirestoreService } from '../firestore/firestore.service';
import { FarmsService } from '../farms/farms.service';

const getViaFarmInspections = async (
  firestoreService,
  firestoreFarmInspectionGetterService,
  preventDuplicates = true,
) => {
  const inspections = await firestoreService.getCompletedAndWipFromFirestore(
    'ltc_master24',
    'auditactivities',
    '2024-09-01T00:00:00Z',
    999,
    false,
  );

  // console.log(JSON.stringify(inspections.finished[0], null, 4));
  const parsed = inspections.finished
    .map((inspection) => {
      return {
        updatedDate: new Date(inspection.updatedDate.toDate()),
        workFlowName: inspection.workFlowName,
        updatedBy: inspection.updatedBy.labelShort,
        shortCode: inspection.targetEntity.labelShort,
        firebaseId: inspection.targetEntity.id,
      };
    })
    .sort((a, b) => a.updatedDate.getTime() - b.updatedDate.getTime());
  // console.log(JSON.stringify(parsed, null, 4));

  // const toImport = [
  //   'clwysdsz50wqs6wyhyt974mxd', // NNT-0129
  // ];

  console.log(parsed.length);

  const processed = {};
  let counter = 200;
  const howFar = 200;
  for (const farmInspection of parsed.slice(counter, counter + howFar)) {
    console.log('\n\nProcessing ' + counter + ' / ' + parsed.length);
    if (farmInspection.workFlowName === 'farmInternalInspection') {
      if (processed[farmInspection.shortCode]) {
        console.log('Duplicate for ' + farmInspection.shortCode);
      }
      processed[farmInspection.shortCode] = true;
      await firestoreFarmInspectionGetterService.getFromV1Api(
        'ltc',
        farmInspection.firebaseId,
        preventDuplicates,
      );
    } else {
      console.log('New ' + farmInspection.workFlowName);
    }
    counter++;
  }
};

const init = async () => {
  console.log(
    '== Get latest polygons from Firestore via API and import them as farm inspections == ',
  );

  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const farmService = context.get<FarmsService>(FarmsService);
  const firestoreService = context.get<FirestoreService>(FirestoreService);
  const firestoreFarmInspectionGetterService: FirestoreFarmInspectionGetterService =
    context.get<FirestoreFarmInspectionGetterService>(
      FirestoreFarmInspectionGetterService,
    );

  // Get all
  // await getViaFarmInspections(
  //   firestoreService,
  //   firestoreFarmInspectionGetterService,
  //   false,
  // );

  // Get single
  // const farms = await farmService.getMany({
  //   polygonStatus: 'NONE',
  //   seasonCode: '2024/25',
  //   organisation: 'ltc',
  // });
  // console.log('Processing: ' + farms.data.length);
  // // console.log(farms.data.map((farm) => farm.firestoreId));
  // for (const farm of farms.data) {
  //   await firestoreFarmInspectionGetterService.getFromV1Api(
  //     'ltc',
  //     farm.firestoreId,
  //     false,
  //   );
  // }
  await firestoreFarmInspectionGetterService.getFromV1Api(
    'ltc',
    'clwysall80evp6wyhunmpshe3',
    false,
  );
};

init();
