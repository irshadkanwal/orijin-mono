import { formatDatesForFS, HasId } from '../../v1utils/utils';
import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from './ObjectId';
import { cascadingDelete, expandFromId } from '../../v1utils/ormAnnotations';
import UploadDocument from '../general/UploadDocument';
import Approval from './Approval';
import Note from '../general/Note';
import Coordinates from './Coordinates';
import EntitySurveyV1 from '../general/EntitySurveyV1';
import {
  CreationStatus,
  FileDocument,
  ObjectIdUser,
  ReviewStatus,
} from './types';

export abstract class AbstractEntity implements HasId {
  isDeleted = false;
  approvalStatus: ReviewStatus = ReviewStatus.NotSet;
  reviewStatus: ReviewStatus = ReviewStatus.NotSet;
  creationStatus: CreationStatus = CreationStatus.NotSet;

  @Type(() => ObjectId)
  reviewEntityId: ObjectId;
  previousVersionId: ObjectId;
  followingVersionId: ObjectId;

  // systemStatus: FarmSystemStatus = null;
  isArchived = false;
  enabled = true;

  processingCounter: number;
  sourceSystem: string = null;

  meta_workspace: string = null;
  meta_organisation: string = null;
  meta_configkey: string = null;

  documents: FileDocument[];

  charts: FileDocument[];

  // reportsInCache: ReportDocument[];

  @Type(() => ObjectId)
  documentReferences: Array<ObjectId>;

  @Exclude()
  @expandFromId('documentReferences')
  documentReferencesFull: Array<UploadDocument>;

  @Type(() => ObjectId)
  @cascadingDelete()
  externalApprovals: Array<ObjectId>;

  @Exclude()
  @expandFromId('externalApprovals')
  externalApprovalsFull: Array<Approval>;

  @Type(() => ObjectId)
  @cascadingDelete()
  externalNotes: Array<ObjectId>;

  @Exclude()
  @expandFromId('externalNotes')
  externalNotesFull: Array<Note>;

  @Type(() => ObjectId)
  id: ObjectId;

  @Transform(({ value }) => formatDatesForFS(value))
  createdDate: Date;

  @Transform(({ value }) => formatDatesForFS(value))
  updatedDate: Date;

  @Transform(({ value }) => formatDatesForFS(value))
  lastActivityDate: Date;

  @Type(() => ObjectId)
  createdFromSubmission: ObjectId;

  @Type(() => ObjectIdUser)
  createdBy: ObjectIdUser;

  @Type(() => ObjectIdUser)
  operatedBy: ObjectIdUser;

  @Type(() => ObjectIdUser)
  updatedBy: ObjectIdUser;

  @Type(() => Coordinates)
  createdLocation: Coordinates;

  @Type(() => Coordinates)
  updatedLocation: Coordinates;

  @Type(() => ObjectId)
  @cascadingDelete()
  surveys: Array<ObjectId>;

  @Exclude()
  @expandFromId('surveys')
  surveysFull: Array<EntitySurveyV1>;

  abstract getCollection(): string;

  get idString(): string {
    return this.id.idString;
  }

  public removeDocument(item: FileDocument) {
    const index = this.documents.findIndex(
      (a) => a.storagePath === item.storagePath,
    );
    this.documents.splice(index, 1);
  }

  setId(id: string) {
    this.id = new ObjectId(id, this.getCollection());
  }

  setCustomId(id: string) {
    this.setProperty('customId', id);
  }
  properties: { [key: string]: any } = {};

  public setProperty(key: string, value: any) {
    this.properties[key] = value;
  }
}
