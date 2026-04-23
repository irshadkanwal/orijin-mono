import { Exclude, Transform, Type } from 'class-transformer';
import { formatDatesForFS, LocationSearchHolder } from '../../v1utils/utils';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { cascadingDelete, expandFromId } from '../../v1utils/ormAnnotations';
import UploadDocument from '../general/UploadDocument';
import TrainingV1 from '../services/TrainingV1';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export enum UserType {
  Organisation = 'Organisation',
  Farmer = 'Farmer',
  Picker = 'Picker',
  Officer = 'Officer',
  FarmEmployee = 'FarmEmployee',
  FactoryEmployee = 'FactoryEmployee',
}
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export default class UserV1
  extends AbstractEntity
  implements LocationSearchHolder
{
  type: UserType = null;
  email: string = null;
  phone: string = null;
  phone2: string = null;

  name: string = null;
  firstName: string = null;
  middleName: string = null;
  lastName: string = null;
  nickName: string = null;
  gender: Gender = null;
  @Transform(({ value }) => formatDatesForFS(value))
  dob: Date = null;
  dobApproximate: boolean = null;
  identificationNumber: string = null;
  identificationNumberType: string = null;
  education: string = null;
  maritalStatus: string = null;
  houseHoldMemberCount: string = null;

  @Type(() => ObjectId)
  picture: ObjectId;

  @Exclude()
  @expandFromId('picture')
  pictureFull: UploadDocument;

  @Type(() => ObjectId)
  contactPersonForFacility: ObjectId;

  @Type(() => ObjectId)
  parentFacility: ObjectId = null;

  @Type(() => ObjectId)
  parentFacilityParent: ObjectId = null;

  @Type(() => ObjectId)
  parentFacilityParentParent: ObjectId = null;

  @Type(() => ObjectId)
  parentLocation: ObjectId = null;
  parentLocationCode: string = null;
  parentLocationName: string = null;

  @Type(() => ObjectId)
  parentLocationParent: ObjectId = null;
  parentLocationParentCode: string = null;
  parentLocationParentName: string = null;

  @Type(() => ObjectId)
  parentLocationParentParent: ObjectId = null;
  parentLocationParentParentCode: string = null;
  parentLocationParentParentName: string = null;

  @Type(() => ObjectId)
  parentLocationParentParentParent: ObjectId = null;
  parentLocationParentParentParentCode: string = null;
  parentLocationParentParentParentName: string = null;

  @Type(() => ObjectId)
  @cascadingDelete()
  trainings: Array<ObjectId>;
  //
  @Exclude()
  @expandFromId('trainings')
  trainingsFull: Array<TrainingV1>;

  public constructor() {
    super();
  }

  getCollection(): string {
    return collectionKeys.users;
  }
}
