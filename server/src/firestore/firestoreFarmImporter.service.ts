import { FacilitiesDto } from '../facilities/dto/facilities.dto';
import { FacilityType } from '../facilities/models/facility.model';
import { FarmInputValues } from '../farms/dto/farms.dto';
import { Injectable, Logger } from '@nestjs/common';
import { SeasonsService } from '../seasons/seasons.service';
import { FarmsService } from '../farms/farms.service';
import { PlotsService } from '../farms/plots.service';
import { FirestoreUtilsService } from './firestore.helper.service';
import { LocationsService } from '../locations/locations.service';
import { UserType } from '../users/models/user.model';
import { PersonsService } from '../persons/persons.service';
import { Person } from '../persons/models/persons.model';
import { PersonsDto } from '../persons/dto/persons.dto';
import { PlotCoordinateSources } from '../farms/models/plots.model';
import { Location } from '@prisma/client';
import {
  SQUARE_METER_TO_ACRES_MULTIPLIER,
  SQUARE_METER_TO_HECTARES_MULTIPLIER,
} from '../common/constants';

@Injectable()
export class FirestoreFarmImporterService {
  private logger = new Logger(FirestoreFarmImporterService.name);

  constructor(
    private firestoreUtilsService: FirestoreUtilsService,
    private seasonService: SeasonsService,
    private farmsService: FarmsService,
    private plotsService: PlotsService,
    private locationsService: LocationsService,
    private personsService: PersonsService,
  ) {}

  parseBoolean = (value) => {
    return value && (value === 'true' || value === true);
  };

  parseNumber = (value) => {
    const parsed = parseInt(value);
    return !isNaN(parsed) ? parsed : null;
  };

  parseDate(value) {
    if (!value) {
      return null;
    }
    if (value.toDate) {
      return value.toDate();
    }
    return new Date(value);
  }

  parseContactPerson(organisation, firestoreData, sameStuffDifferentFormat?) {
    return {
      organisation,
      shortCode:
        firestoreData.id?.labelShort ||
        firestoreData.contactFirstName + '-' + Math.random(),

      firstName: firestoreData.firstName,
      middleName: firestoreData.middleName,
      lastName: firestoreData.lastName,
      nickName: firestoreData.nickName,

      type: UserType.Farmer,
      email: firestoreData.email,
      phone: firestoreData.phone,
      phone2: firestoreData.phone2,

      gender: firestoreData.gender || firestoreData.contactGender,
      dateOfBirth:
        new Date(firestoreData.dob) || firestoreData.contactDob?.toDate(),
      dateOfBirthApproximate:
        (firestoreData.dobApproximate ||
          firestoreData.contactDobApproximate) === 'true',

      education: firestoreData.education,
      identificationNumber: firestoreData.identificationNumber,
      identificationNumberType: firestoreData.identificationNumberType,
      maritalStatus: firestoreData.maritalStatus,
    };
  }

  parseFacilityValues(
    firestoreFarm,
    farmShortCode,
    farmLabel,
    storedLocation,
    prismaPerson,
    org,
  ): FacilitiesDto {
    return {
      firestoreId: firestoreFarm.id.id,
      organisation: org,
      shortCode: farmShortCode,
      type: FacilityType.Farm,
      name: farmLabel,
      // TODO: Complete Address storing in Prisma
      address:
        firestoreFarm.address == null &&
        firestoreFarm.city == null &&
        firestoreFarm.postalCode == null &&
        firestoreFarm.country == null
          ? null
          : {
              street: firestoreFarm.address,
              city: firestoreFarm.city,
              postalCode: firestoreFarm.postalCode,
              country: firestoreFarm.country,
            },
      mainContactPerson: prismaPerson as PersonsDto,
      areaTotalManual:
        firestoreFarm.areaTotal * SQUARE_METER_TO_HECTARES_MULTIPLIER,
      timezone: firestoreFarm.timezone,
      location: storedLocation,
    };
  }

  parseFarmValues(firestoreFarm, seasonId) {
    return {
      firestoreId: firestoreFarm.id.id,
      approvalStatus: firestoreFarm.approvalStatus,
      creationStatus: firestoreFarm.creationStatus,
      contractDate: this.parseDate(firestoreFarm.contractDate),
      registrationDate: this.parseDate(firestoreFarm.registrationDate),
      certificationStartDate: this.parseDate(
        firestoreFarm.certificationStartDate,
      ),
      lastChemicalUseDate: this.parseDate(firestoreFarm.lastChemicalUseDate),
      lastInspectionDate: this.parseDate(firestoreFarm.lastInspectionDate),
      firstVisitDate: this.parseDate(firestoreFarm.firstVisitDate),

      // TODO: Seasonia ei ole ainakaan UAT-esimerkeissä?
      seasonId,

      // TODO: Are these needed?
      // certifications: '',
      // contracts: '',
      // countItems: '',
      // houseHoldCoordinate: '',
      // usedAsOriginFarmForProducts: '',
    };
  }

  parsePlotValues = (plot) => {
    const {
      // Creation time data
      createdBy,
      createdDate,
      updatedBy,
      updatedDate,
      createdLocation, // already handled in top level
      updatedLocation, // already handled in top level

      // Actual data
      name,
      properties: surveyData, // Repeats some of the survey questions of main Farm object? like "farmInspection_plotsurvey_fungicides_yesno"
      farm, // duplication, no need
      auditActivityId,
      geodatas, // no need, use "full"
      geodatasFull,
      polygon, // no need, use "full"
      polygonFull,
      varieties, // no need, use "full"
      varietiesFull,
      primaryCrops,
      secondaryCrops,
      season, // Relevant? In Farm?
      seasons, // Relevant? In Farm?

      // Direct mapping to Plot
      traditionalOwners,
      // The rest
      ...moreSurveyTypeOfData
    } = plot;

    // console.log('geodatasFull', JSON.stringify(geodatasFull, null, 4));
    // console.log('polygonFull', JSON.stringify(polygonFull, null, 4));

    const geoData = geodatasFull[geodatasFull.length - 1];
    if (geodatasFull.length > 1) {
      this.logger.warn(
        'More than 1 geodata for plot! Processing the last one',
        geodatasFull.map((geo) => ({
          idLabelShort: geo.properties.idLabelShort,
          createdDate: geo.createdDate,
          isDeleted: geo.isDeleted,
          isArchived: geo.isArchived,
          enabled: geo.enabled,
          datapoints: geo.data.length,
        })),
      );
    }

    return {
      shortCode: plot.id.labelShort, // or entity.labelShort,

      // Plot data
      name: plot.name || plot.label,
      type: plot.type,
      cultivationStartDate: plot.cultivationStartDate,
      registrationDate: plot.registrationDate,
      lastChemicalUseDate: plot.lastChemicalUseDate,
      ownerName: plot.ownerName,
      principalOwnsLand: this.parseBoolean(plot.principalOwnsLand),
      principalLeasesLand: this.parseBoolean(plot.principalLeasesLand),
      hasRightToLand: this.parseBoolean(plot.hasRightToLand),
      hasLandTitle: this.parseBoolean(plot.hasLandTitle),
      establishedBefore2020: this.parseBoolean(plot.establishedBefore2020),
      hasShadeTrees: this.parseBoolean(plot.hasShadeTrees),
      distanceToForestKnown: this.parseBoolean(plot.distanceToForestKnown),
      // TODO! Add to DB
      // traditionalOwners: parseBoolean(traditionalOwners),
      traditionalOwnersPresent: this.parseBoolean(
        plot.traditionalOwnersPresent,
      ),
      distanceToForest: this.parseNumber(plot.distanceToForest),
      yieldEstimateProcessed: this.parseNumber(plot.yieldEstimateProcessed),
      yieldEstimateRaw: this.parseNumber(plot.yieldEstimateRaw),

      // Geodata
      areaSizeManual: geoData.areaManual * SQUARE_METER_TO_HECTARES_MULTIPLIER,
      polygonCoordinates: geoData.data.map((geo) => [geo.lng, geo.lat]),
      polygonSource: PlotCoordinateSources.ORIJIN_APP,
    };
  };

  getActualLocation = (
    firestoreFarm,
    locations: Location[] = [],
  ): Location | null => {
    let storedLocation: Location | null = null;
    const subCountyCode = firestoreFarm.parentLocationParentParent?.labelShort;
    if (subCountyCode) {
      storedLocation = locations.find((loc) => loc.shortCode === subCountyCode);
    } else {
      const farmShortCode = firestoreFarm.id.labelShort;
      this.logger.log('No subCounty found for farm ' + farmShortCode, {
        parentLocation: firestoreFarm.parentLocation,
        parentLocationParent: firestoreFarm.parentLocationParent,
        parentLocationParentParent: firestoreFarm.parentLocationParentParent,
        parentLocationParentParentParent:
          firestoreFarm.parentLocationParentParentParent,
      });
    }
    return storedLocation;
  };

  async importFarm(
    firestoreFarm,
    counter,
    seasons,
    locations: Location[],
    meta,
  ) {
    const organisation = meta.organisation;
    const farmShortCode = firestoreFarm.id.labelShort;
    const farmLabel = firestoreFarm.id.label;
    try {
      // TODO: SeasonCode piti määrittää siitä seasonista joka on active?
      let seasonId = seasons.find(
        (s) => s.shortCode === firestoreFarm.season?.labelShort,
      )?.id;
      if (!seasonId) {
        // TODO: Tarkista missä seasoncode nyt on, vai onko ees tollasta arvoa
        this.logger.warn(
          'No seasonCode found for farm ' +
            counter +
            ': ' +
            farmShortCode +
            ', assigning random one',
        );
        seasonId = seasons[0].id;
      }

      const storedLocation: Location | null = this.getActualLocation(
        firestoreFarm,
        locations,
      );

      // 1) Create the person
      const contactPerson = this.parseContactPerson(
        organisation,
        firestoreFarm,
      );
      // const contactPerson = {
      //   shortCode: firestoreFarm.contactFirstName + '-' + Math.random(),
      //   firstName:
      //     [
      //       firestoreFarm.contactFirstName,
      //       firestoreFarm.contactMiddleName,
      //     ].join(' ') ?? '',
      //   lastName: firestoreFarm.contactLastName ?? '',
      //   type: UserType.Farmer,
      //   email: firestoreFarm.email,
      //   phone: firestoreFarm.phone,
      //   gender: firestoreFarm.contactGender,
      //   dateOfBirth: firestoreFarm.contactDob?.toDate(),
      //   dateOfBirthApproximate: firestoreFarm.contactDobApproximate === 'true',
      // };
      const prismaPerson: Person = await this.personsService.create(
        {
          organisation,
          ...contactPerson,
        },
        {
          operationType: 'farmImport',
          updatedBy: firestoreFarm?.updatedBy?.label,
        },
      );

      const facilityValues = this.parseFacilityValues(
        firestoreFarm,
        farmShortCode,
        farmLabel,
        storedLocation,
        prismaPerson,
        organisation,
      );
      // const facilityValues: FacilitiesDto = {
      //   firestoreId: firestoreFarm.id.id,
      //   organisation: meta.organisation,
      //   shortCode: farmShortCode,
      //   type: FacilityType.Farm,
      //   name: farmLabel,
      //   // TODO: Complete Address storing in Prisma
      //   address: {
      //     street: firestoreFarm.address,
      //     city: firestoreFarm.city,
      //     postalCode: firestoreFarm.postalCode,
      //     country: firestoreFarm.country,
      //   },
      //   mainContactPerson: prismaPerson as PersonsDto,
      //   areaTotalManual: firestoreFarm.areaTotal,
      //   timezone: firestoreFarm.timezone,
      //   location: location,
      // };

      const farmValues: FarmInputValues = this.parseFarmValues(
        firestoreFarm,
        seasonId,
      );
      // const farmValues: FarmInputValues = {
      //   // NOTE: Shortcodea ei ole täällä vaan Facilityllä!
      //   firestoreId: firestoreFarm.id.id,
      //   approvalStatus: firestoreFarm.approvalStatus,
      //   creationStatus: firestoreFarm.creationStatus,
      //   cultivationStartDate: firestoreFarm.cultivationStartDate?.toDate(),
      //   contractDate: firestoreFarm.contractDate?.toDate(),
      //   registrationDate: firestoreFarm.registrationDate?.toDate(),
      //   certificationStartDate: firestoreFarm.certificationStartDate?.toDate(),
      //   lastChemicalUseDate: firestoreFarm.lastChemicalUseDate?.toDate(),
      //   lastInspectionDate: firestoreFarm.lastInspectionDate?.toDate(),
      //   firstVisitDate: firestoreFarm.firstVisitDate?.toDate(),
      //
      //   // TODO: Seasonia ei ole ainakaan UAT-esimerkeissä?
      //   seasonId,
      //
      //   // TODO: Are these needed?
      //   // certifications: '',
      //   // contracts: '',
      //   // countItems: '',
      //   // houseHoldCoordinate: '',
      //   // usedAsOriginFarmForProducts: '',
      // };

      // 2) Create the farm
      const prismaFarm = await this.farmsService.create({
        organisation: organisation,
        facilityValues,
        farmValues,
      });

      // 3) Create plots for the farm
      // TODO: Could create with "set" inside farmService's prisma.create too, but the usual workflow is that
      // plots are created only after Farm already exists
      if (firestoreFarm.plots && firestoreFarm.plots.length > 0) {
        const plots = firestoreFarm.plots.map((plot) => {
          return this.plotsService.upsert(
            {
              organisation: organisation,
              shortCode: plot.labelShort,
              name: plot.label,
              farmId: prismaFarm.id,
              type: plot.type,
            },
            {
              operationType: 'farmImport',
              updatedBy: firestoreFarm.updatedBy?.label,
            },
          );
        });
        await Promise.all(plots);
      }
      return prismaFarm;
    } catch (err) {
      if (
        err.name === 'PrismaClientKnownRequestError' &&
        err.code === 'P2002' &&
        err.meta.target[0] === 'shortCode'
      ) {
        this.logger.error(
          'Duplicate shortcode for farm ' +
            counter +
            ': ' +
            farmShortCode +
            ' / ' +
            farmLabel,
        );
      } else {
        console.log('ERROR with farm ' + counter + ': ' + err, firestoreFarm);
        console.log(err);
        throw 'Farm error';
      }
    }
  }

  async importFarms(subCollections, meta) {
    const farms =
      await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(
        subCollections,
        'farms',
        50,
      );

    const seasons = await this.seasonService.getMany({
      organisation: 'ltc',
    });
    const locations = await this.locationsService.getMany().then((l) => l.data);

    let totalCount = 0;
    const promises = farms.map(async (firestoreFarm) => {
      const counter = totalCount;
      totalCount++;
      await this.importFarm(firestoreFarm, counter, seasons, locations, meta);
    });
    const imported = await Promise.all(promises);
    return imported.filter((val) => val); // Filter out exceptions
  }
}
