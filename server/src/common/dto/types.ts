import {
  GetOneInput,
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from './paginationAndSorting.dto';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AbstractDto {
  organisation: string;
  id?: string;
}

export interface AbstractImportCsvDto extends AbstractDto {
  organisation: string;

  shortCode?: string;
}
export interface CsvImportService<
  T extends AbstractImportCsvDto,
  MODEL extends AbstractModel,
> {
  upsertImport(input: T, metadata?: EntityOperationMetadata): Promise<MODEL>;
}

export interface AbstractModel {
  id: string;
}

export type EntityServiceOperationType = 'farmInspection' | 'farmImport';

export interface EntityOperationMetadata {
  operationType?: EntityServiceOperationType;
  updatedBy?: string;
}

export interface IEntityService<
  PRISMATYPE extends AbstractModel,
  MODEL extends AbstractModel,
  CSVIMPORTTYPE extends AbstractImportCsvDto,
  DTOTYPE extends AbstractDto,
  FILTERDTO extends StandardFilterDto,
> extends CsvImportService<CSVIMPORTTYPE, MODEL> {
  update(id: string, body: DTOTYPE): Promise<MODEL>;
  create(body: DTOTYPE, metadata?: EntityOperationMetadata): Promise<MODEL>;
  delete(
    id: string,
    metadata?: EntityOperationMetadata,
  ): Promise<{ sucess: boolean }>;
  getOne(
    params: GetOneInput,
    metadata?: EntityOperationMetadata,
  ): Promise<MODEL>;
  getMany(filters: FILTERDTO): Promise<PaginationAndSortingOutputDto<MODEL>>;
}

export interface PDelegate<
  PRISMATYPE,
  MODEL,
  CSVIMPORTTYPE,
  DTOTYPE,
  CONNECTEDDTO,
> {
  findMany(arg0: {
    where: {
      organisation?: string;
      deletedAt?: null;
      AND?: (
        | { organisation: string }
        | { OR: ({ id: string } | { shortCode: string })[] }
      )[];
      shortCode_organisation?: {
        shortCode: string;
        organisation: string;
      };
    };
    orderBy?: any;
    include?: any;
  }): Promise<PRISMATYPE[]>;

  findUnique(arg0: {
    where: {
      id?: string;
      shortCode?: string;
      organisation: string;
      deletedAt: null;
    };
    include?: any;
  }): Promise<PRISMATYPE>;

  create(param: { data: CONNECTEDDTO; include?: any }): Promise<PRISMATYPE>;

  update(param: {
    data: CONNECTEDDTO | { deletedAt: Date };
    include?: any;
    where: { id: string; deletedAt: null };
  }): Promise<PRISMATYPE>;

  count(parem: any): Promise<number>;

  delete(param: { where: { id: string } }): any;
}
