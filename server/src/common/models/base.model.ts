export type ID = string;
export abstract class BaseModel {
  id: ID;
  shortCode?: string;
  organisationId?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export abstract class BaseSeasonalModel extends BaseModel {}
