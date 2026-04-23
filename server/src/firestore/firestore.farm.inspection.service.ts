import { Injectable, Logger } from '@nestjs/common';
import { FirestoreFarmInspectionDto } from './dto/firestore.farmInspection.dto';
import { Farm } from '../farms/models/farms.model';
import { FarmsService } from '../farms/farms.service';
import { FirestoreFarmImporterService } from './firestoreFarmImporter.service';
import { Person } from '../persons/models/persons.model';
import { PersonsService } from '../persons/persons.service';
import { LocationsService } from '../locations/locations.service';
import { FarmInputValues } from '../farms/dto/farms.dto';
import { FacilitiesDto } from '../facilities/dto/facilities.dto';
import { SeasonsService } from '../seasons/seasons.service';

@Injectable()
export class FirestoreFarmInspectionService {
  logger = new Logger(FirestoreFarmInspectionService.name);

  constructor(
    private farmsService: FarmsService,
    private personsService: PersonsService,
    private locationsService: LocationsService,
    private seasonService: SeasonsService,
    private firestoreFarmImporterService: FirestoreFarmImporterService,
  ) {}

  async handlePerson(
    org,
    mainContactPersonFull,
    sameStuffDifferentFormat,
    updatedBy?: string,
  ) {
    const parsedContactPerson =
      this.firestoreFarmImporterService.parseContactPerson(
        org,
        mainContactPersonFull,
        sameStuffDifferentFormat,
      );
    let prismaPerson: Person = null;
    const persons = await this.personsService.getMany({
      organisation: org,
      shortCode: parsedContactPerson.shortCode,
    });

    // TODO: If new shortcode for person, create & connect new one - otherwise update
    if (persons.data.length > 0) {
      // Update
      this.logger.log('Found existing person ' + parsedContactPerson.shortCode);
      prismaPerson = await this.personsService.update(
        persons.data[0].id,
        {
          organisation: org,
          ...parsedContactPerson,
          id: persons.data[0].id,
        },
        { operationType: 'farmInspection', updatedBy },
      );
    } else {
      // Create
      this.logger.log('Creating new person ' + parsedContactPerson.shortCode);
      prismaPerson = await this.personsService.create(
        {
          organisation: org,
          ...parsedContactPerson,
        },
        { operationType: 'farmInspection', updatedBy },
      );
    }
    return prismaPerson;
  }

  async handleFarm(
    farmData,
    location,
    person,
    plotsFull,
    organisation,
    updatedBy?: string,
  ): Promise<Farm> {
    const farmShortCode = farmData.id.labelShort;
    const farmLabel = farmData.id.label;
    const facilityValues: FacilitiesDto =
      this.firestoreFarmImporterService.parseFacilityValues(
        farmData,
        farmShortCode,
        farmLabel,
        location,
        person,
        organisation,
      );

    const seasonCode = farmData.season?.labelShort;
    let seasonId: string | undefined = undefined;
    if (seasonCode) {
      const seasons = (
        await this.seasonService.getMany({
          organisation: organisation,
        })
      ).data;
      seasonId = seasons.find((s) => s.shortCode === seasonCode)?.id;
      if (seasonId) {
        this.logger.log(
          'Found season ' + farmData.season.labelShort + ' id ' + seasonId,
        );
      } else {
        throw new Error('Specified season not found: ' + seasonCode);
      }
    }

    const farmValues: FarmInputValues =
      this.firestoreFarmImporterService.parseFarmValues(farmData, seasonId);
    farmValues.plots = plotsFull.map((firebasePlot) =>
      this.firestoreFarmImporterService.parsePlotValues(firebasePlot),
    );

    const existingFarms = await this.farmsService.getMany({
      organisation,
      shortCode: farmShortCode,
      ...(seasonCode ? { seasonCode } : {}),
    });

    if (existingFarms.data.length > 0) {
      const existingFarm = existingFarms.data[0];
      this.logger.log(
        'Found existing farm for shortCode ' +
          farmShortCode +
          ' season ' +
          farmData.season?.labelShort +
          ' location ' +
          facilityValues.location?.id,
      );
      farmValues.id = existingFarm.id;
      facilityValues.id = existingFarm.facility.id;
      return await this.farmsService.update(
        existingFarm.id,
        {
          organisation,
          facilityValues,
          farmValues,
        },
        { operationType: 'farmInspection', updatedBy },
      );
    } else {
      this.logger.log(
        'New farm, creating ' +
          farmShortCode +
          ' season ' +
          farmData.season?.labelShort +
          ' location ' +
          facilityValues.location?.id,
      );
      return await this.farmsService.create(
        {
          organisation,
          facilityValues,
          farmValues,
        },
        { operationType: 'farmInspection', updatedBy },
      );
    }
  }

  async parseSurveys(surveyData, animalCountsFull) {
    if (!surveyData) {
      this.logger.log('No surveydata, skipping');
      return;
    }
    const regularSurveys = surveyData.map((survey) => {
      const {
        id, //
        altitude,
        auditActivityId,
        customId,
        values,
        ...rest
      } = survey;
      const surveyName = survey.name; // 'SurveyFarming',
      const surveyTarget = survey.entityType; // entityType: 'farm',
      const surveyQuestionsAndAnswers = survey.values.map((qa) => {
        const result = {
          question: {
            name: qa.name,
            section: qa.section,
          },
          answer: qa.value,
        };
        // TODO: Confirm what to do with the jsonata-only values, AND the arrays
        // console.log(JSON.stringify({ old: qa, new: result }, null, 4));
        return result;
      });
      return {
        surveyName,
        surveyTarget,
        surveyQuestionsAndAnswers,
      };
    });

    // Convert animals into a survey
    const animalSurvey = {
      surveyName: 'SurveyAnimals',
      surveyTarget: 'farm', // entityType: 'farm',
      surveyQuestionsAndAnswers: [
        // TODO: Should this be lots of answers to same question, or one question per animal type or smthing?
        {
          question: { name: 'animals_at_farm' },
          answer: animalCountsFull.map((animal) => {
            return {
              animal_type: animal.type,
              animal_organic: animal.isOrganic,
              animal_usedForManure: animal.usedForManure,
              animal_description: animal.description,
              animal_notes: animal.notes,
            };
          }),
        },
      ],
    };
    return [...regularSurveys, animalSurvey];
  }

  async storeSurveys(surveyData, farmId) {
    // TODO: Store the survey here
    return surveyData;
  }

  parseMetadata = (json) => {
    const actualData = json.entity || json.farm;
    let shortCode = actualData?.id?.labelShort;
    let workspace = actualData?.meta_workspace;
    const latestLog = json.logs[json.logs.length - 1];
    const workFlowName = latestLog?.workflowName;
    if (!shortCode) {
      shortCode = latestLog?.properties?.idLabelShort;
      workspace = latestLog?.meta_workspace;
    }
    const auditactivities = json.auditactivities || [];

    this.logger.log(
      `Incoming Farm Inspection: ${workspace} - ${workFlowName} - ${shortCode}`,
    );
    this.logger.log('Keys in json: ' + Object.keys(json));
    // Object.keys(json).forEach((key) => {
    //   this.logger.log(
    //     JSON.stringify(
    //       {
    //         key: key,
    //         json: json[key],
    //       },
    //       null,
    //       4,
    //     ).substring(0, 500),
    //   );
    // });

    return { actualData, shortCode, workspace, auditactivities };
  };

  isProcessedAlready = async (org, shortCode, auditactivities) => {
    const latestActivityEntry = [...auditactivities] // don't pop the original array
      .sort(
        (a, b) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      )
      .pop();
    const latestActivityDate = new Date(latestActivityEntry.createdDate);
    this.logger.log(
      'Latest activity was ' +
        latestActivityEntry.workFlowName +
        ' done by ' +
        latestActivityDate.toISOString() +
        ' by ' +
        latestActivityEntry.createdBy.label,
    );
    const alreadyHandled = await this.farmsService.findPayload(
      org,
      shortCode,
      latestActivityDate,
    );
    if (alreadyHandled.length > 0) {
      console.log('alreadyHandled', alreadyHandled);
      return true;
    }
    return false;
  };

  async process(
    json: FirestoreFarmInspectionDto,
    org: string,
    preventDuplicates = false,
  ): Promise<Farm[] | null> {
    const { actualData, shortCode, workspace, auditactivities } =
      this.parseMetadata(json);

    if (!workspace.includes('master')) {
      // LTC has "master24" etc.. should be configured into DB someday
      this.logger.warn(
        'Got payload from non-master workspace, skipping: ' +
          actualData.meta_workspace,
      );
      return [];
    }

    if (!actualData) {
      this.logger.warn(
        'No actual data found from json.entity or json.farm, skipping',
      );
      return [];
    }

    if (preventDuplicates) {
      const processed = await this.isProcessedAlready(
        org,
        shortCode,
        auditactivities,
      );
      if (processed) {
        this.logger.log('-- Already handled, skipping ' + shortCode);
        return [];
      }
    }

    const storedPayloadId = await this.farmsService.storeIncomingJsonPayload(
      org,
      'farmInspection',
      json,
      shortCode,
    );
    this.logger.log(
      'Stored the JSON for ' + shortCode + ' with id ' + storedPayloadId,
    );

    const {
      // Data for Farm processing
      parentFacility,
      parentFacilityFull,
      location: gpsLocation, // The GPS coordinate

      // Locations
      parentLocation,
      parentLocationFull,
      parentLocationParent,
      parentLocationParentParent,
      parentLocationParentParentParent,

      // Contact person - all data probably duplicates "mainContactPersonFull"
      mainContactPerson,
      mainContactPersonFull,
      contactFirstName,
      contactMiddleName,
      contactLastName,
      contactGender,
      contactDob,
      contactDobApproximate,
      contactIdentificationNumber,
      contactIdentificationNumberType,
      contactEducation,
      contactMaritalStatus,
      contactHouseHoldMemberCount,
      contacts, // no need, use "full"
      contactsFull,

      // Data for separate methods
      plots, // no need
      plotsFull,
      animalCounts, // no need, use "full"
      animalCountsFull,
      trainings, // no need, use "full"
      trainingsFull,
      varieties, // no need, use "full"
      varietiesFull, // no need, will be handled by plots.varietiesFull
      surveys,
      surveysFull,

      // Metadata
      meta_organisation,
      meta_configkey,
      properties,

      // Creation data
      createdBy,
      createdDate,
      updatedBy,
      updatedDate,
      createdLocation,
      updatedLocation,
      ...rest
    } = actualData;

    // this.logger.log(
    //   'Incoming payload for org ' + meta_organisation + ' / ' + meta_workspace,
    //   json.farm,
    // );

    try {
      // 1) PERSON
      // 1A = new person
      // 1B = updated person
      const person = await this.handlePerson(
        org,
        mainContactPersonFull,
        {
          contactFirstName,
          contactMiddleName,
          contactLastName,
          contactGender,
          contactDob,
          contactDobApproximate,
          contactIdentificationNumber,
          contactIdentificationNumberType,
          contactEducation,
          contactMaritalStatus,
          contactHouseHoldMemberCount,
        },
        updatedBy.label,
      );
      // console.log('Person', person);

      // 2) LOCATION
      const existingLocations = await this.locationsService.getMany({
        organisation: org,
      });
      const storedLocation =
        this.firestoreFarmImporterService.getActualLocation(
          {
            parentLocation,
            parentLocationFull,
            parentLocationParent,
            parentLocationParentParent,
            parentLocationParentParentParent,
          },
          existingLocations.data,
        );

      // 3) FARM
      const storedFarm: Farm = await this.handleFarm(
        rest,
        storedLocation,
        person,
        plotsFull,
        org,
        updatedBy.label,
      );

      // TODO: add this to farm as proper relation for easier access
      // storedPayloadId

      // 4) SURVEYS
      const parsedSurveys = await this.parseSurveys(
        surveysFull,
        animalCountsFull,
      );

      const storedSurveys = await this.storeSurveys(
        parsedSurveys,
        storedFarm.id,
      );

      // Update the incomingJson
      await this.farmsService.updateIncomingJsonPayload(
        storedPayloadId,
        storedFarm.id,
      );

      // Return all with inclues
      return await this.farmsService
        .getMany({
          // FIXME: why meta_organisation?
          organisation: org,
          shortCode: rest.id.labelShort,
        })
        .then((l) => l.data);
    } catch (err) {
      this.logger.error(err);
      this.logger.error(err.stack);
      return null;
    }
  }
}
