import { randomUUID } from 'crypto';
import { FacilityType } from '../src/facilities/models/facility.model';
import { PlotDto, FarmsDto } from '../src/farms/dto/farms.dto';
import { ReviewStatus } from '../src/farms/models/farms.model';
import {
  FirestoreFarmInspectionDto,
  InspectedFarm,
} from '../src/firestore/dto/firestore.farmInspection.dto';
import { UserType } from '../src/users/models/user.model';

export const minimalFarm = (
  organisation: string,
  shortCode: string,
  seasonCode?: string,
  plots?: PlotDto[],
): FarmsDto => ({
  organisation,
  facilityValues: {
    organisation,
    areaTotalManual: 11,
    name: 'Cocoland',
    type: FacilityType.Farm,
    shortCode,
    mainContactPerson: {
      organisation,
      shortCode,
      firstName: 'Joanna',
      lastName: 'Test',
      type: UserType.Farmer,
      gender: 'Female',
      dateOfBirth: new Date('2001-05-01T00:00:00.000Z'),
      dateOfBirthApproximate: false,
    },
  },
  farmValues: {
    approvalStatus: ReviewStatus.NeedsReview,
    seasonCode,
    plots,
  },
});

export const minimalInspectionChange = (
  shortCode: string,
  name: string,
  seasonShortCode?: string,
  plotsFull?: FirestoreFarmInspectionDto['farm']['plotsFull'],
) => {
  const now = new Date();
  const inspection: FirestoreFarmInspectionDto & {
    farm: InspectedFarm & {
      season: {
        label: string;
        labelShort: string;
      };
    };
  } = {
    logs: [],
    farm: {
      properties: {
        shortCode,
      },
      surveys: [],
      surveysFull: [],
      isDeleted: false,
      approvalStatus: 'NeedsReview',
      reviewStatus: 'NotSet',
      creationStatus: null,
      systemStatus: null,
      isArchived: false,
      enabled: true,
      sourceSystem: null,
      meta_workspace: 'master_latitude_salla',
      meta_organisation: 'latitude',
      meta_configkey: 'ltc',
      reviewEntityId: null,
      id: {
        id: randomUUID(),
        label: 'Cocoaland',
        labelShort: shortCode,
      },
      createdDate: now.toISOString(),
      updatedDate: now.toISOString(),
      createdBy: {
        id: randomUUID(),
        label: 'salla@orijin.io',
      },
      updatedBy: {
        id: randomUUID(),
        label: 'salla@orijin.io',
      },
      lastActivityDate: null,
      createdLocation: null,
      updatedLocation: null,
      name,
      contactFirstName: null,
      contactMiddleName: null,
      contactLastName: null,
      contactGender: null,
      contactDob: null,
      contactDobApproximate: null,
      contactIdentificationNumberType: null,
      contactEducation: null,
      contactIdentificationNumber: null,
      contactMaritalStatus: null,
      contactHouseHoldMemberCount: null,
      nickName: null,
      type: 'Farm',
      season: seasonShortCode
        ? {
            label: seasonShortCode,
            labelShort: seasonShortCode,
          }
        : null,
      parentFacility: null,
      parentFacilityFull: null,
      parentFacilityParent: null,
      parentFacilityParentParent: null,
      parentLocation: null,
      parentLocationParent: null,
      parentLocationParentParent: {
        label: 'BIREMBO',
        labelShort: 'BII',
      },
      parentLocationParentParentParent: {
        labelShort: 'BTC',
        label: 'BUGANIKERE TOWN COUNCIL',
      },
      parentLocationFull: null,
      mainContactPerson: null,
      mainContactPersonFull: {
        properties: {
          idLabelShort: shortCode,
          id: {
            labelShort: shortCode,
          },
        },
        isDeleted: false,
        approvalStatus: 'NotSet',
        reviewStatus: 'NotSet',
        creationStatus: 'NotSet',
        id: {
          labelShort: shortCode,
        },
        createdDate: now.toISOString(),
        updatedDate: now.toISOString(),
        type: 'Farmer',
        phone: '778434715',
        firstName: 'Joanna',
        lastName: 'Test',
        gender: 'Female',
        dob: '2000-01-01T00:00:00.000Z',
        dobApproximate: false,
      },
      location: {
        latLong: {
          lat: 60.24962521410096,
          lon: 24.971673072638996,
        },
        altitude: 2,
      },
      address: null,
      geodatas: null,
      polygon: null,
      polygonFull: null,
      areaTotal: 11,
      certificationStatus: null,
      isOrganic: true,
      complianceImplementationDeadline: null,
      numberOfPlantsTotal: null,
      areaOrganic: 0,
      areaNonOrganic: 0,
      areaPermanentCrop: 0,
      areaAnnualCrop: 0,
      cultivationStartDate: null,
      varieties: [],
      varietiesFull: [],
      primaryCrops: [],
      secondaryCrops: [],
      yieldEstimateRaw: null,
      contractDate: null,
      registrationDate: null,
      certificationStartDate: null,
      lastChemicalUseDate: null,
      lastInspectionDate: null,
      firstVisitDate: null,
      trainings: [],
      trainingsFull: [],
      contacts: [],
      contactsFull: [],
      animalCounts: [],
      animalCountsFull: [],
      certifications: null,
      complianceItems: null,
      plots: [], // Ignored on import
      plotsFull: plotsFull || [],
      mobilePayWalletsFullIds: [],
      mobilePayRegistrationStatus: 'NotSet',
      identityVerificationStatus: 'NotSet',
      source: null,
    },
  };

  inspection.entity = inspection.farm;
  return inspection;
};
