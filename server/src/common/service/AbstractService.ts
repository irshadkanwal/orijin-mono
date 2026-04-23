import { PrismaService } from 'nestjs-prisma';
import {
  GetOneInput,
  PaginationAndSortingDto,
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../dto/paginationAndSorting.dto';
import {
  AbstractDto,
  AbstractImportCsvDto,
  AbstractModel,
  EntityOperationMetadata,
  IEntityService,
  PDelegate,
} from '../dto/types';
import { Prisma } from '@prisma/client';
import { addPagination, parseFilters } from '../prisma.helper';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { getObjectDifferences } from '../comparisonUtil';
import { ChangesService } from '../../changes/changes.service';

export default abstract class AbstractService<
  PRISMATYPE extends AbstractModel,
  MODEL extends AbstractModel,
  CSVIMPORTTYPE extends AbstractImportCsvDto,
  DTOTYPE extends AbstractDto,
  CONNECTEDDTO extends AbstractDto,
  FILTERDTO extends PaginationAndSortingDto,
  // PRISMAWHEREARGS extends $Extensions.DefaultArgs,
> implements
    IEntityService<PRISMATYPE, MODEL, CSVIMPORTTYPE, DTOTYPE, FILTERDTO>
{
  constructor(
    protected prisma: PrismaService,
    protected prismaDelegate: PDelegate<
      PRISMATYPE,
      MODEL,
      CSVIMPORTTYPE,
      DTOTYPE,
      CONNECTEDDTO
    >,
    protected changes?: ChangesService,
  ) {}

  logger = new Logger('AbstractService'); // TODO: Inject the original logger
  objectType: string | undefined = undefined;

  async getOne(
    params: GetOneInput,
    includes: any = this.standardInclude(),
  ): Promise<MODEL> {
    if (params.id) {
      const itemById = await this.prismaDelegate.findUnique({
        where: {
          id: params.id,
          organisation: params.org,
          deletedAt: null,
        },
        include: includes,
      });
      return this.convertModel(itemById as PRISMATYPE);
    }

    // FIXME: asked for one but looking for many??
    const itemByShortCode = await this.prismaDelegate.findMany({
      where: {
        organisation: params.org,
        shortCode: params.shortCode,
        deletedAt: null,
      } as any,
      include: this.standardInclude(),
    });

    const itemByShortCodeElement = itemByShortCode[0];
    return this.convertModel(itemByShortCodeElement as PRISMATYPE);
  }

  async upsertImport(body: CSVIMPORTTYPE): Promise<MODEL> {
    const { shortCode, organisation, ...restOfValues } = body;

    cleanCsvImportFields(body);

    // this.logger.debug(
    //   'Abstract Upsert with ',
    //   JSON.stringify(body, null, 4).substring(0, 200),
    // );

    if (!body.shortCode) {
      this.logger.error('all imports need to have a shortcode', body);
      throw Error('all imports need to have a shortcode');
    }

    const existing: PRISMATYPE = await this.findUnique(shortCode, organisation);

    if (existing) {
      const convertedInput = await this.convertForImport({
        ...existing,
        ...body,
      });
      return this.update(existing.id, convertedInput);
    }
    // this.logger.log('before conversion', body);

    const convertedInput = await this.convertForImport(body);

    return this.create(convertedInput);
  }

  async findUnique(
    shortCode: string,
    organisation: string,
  ): Promise<PRISMATYPE> {
    const existing: PRISMATYPE = await this.prismaDelegate.findUnique({
      where: {
        // shortCode: shortCode,
        // organisation: organisation,
        // shortCode_organisation: organisation,
        // TODO: SM this started complaining so had to change the findunique, need to start using proper prisma types here!!
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        shortCode_organisation: {
          shortCode: shortCode,
          organisation: organisation,
        } as any,
        id: undefined,
        deletedAt: null,
      },
      include: this.standardInclude(),
    });
    return existing;
  }

  async convertForImport(body: CSVIMPORTTYPE): Promise<DTOTYPE> {
    return body as any as DTOTYPE;
  }

  async update(
    id: string,
    body: DTOTYPE,
    metadata?: EntityOperationMetadata,
  ): Promise<MODEL> {
    const processed = await this.connectDependenciesForCreateAndUpdate(
      body,
      true,
    );

    const existing = await this.getOne(
      {
        id: id,
        org: body.organisation,
      },
      false,
    );

    // FIXME: transaction
    const res = this.convertModel(
      await this.prismaDelegate.update({
        where: { id, deletedAt: null },
        data: {
          ...processed,
        },
        include: this.standardInclude(),
      }),
    );

    if (this.objectType && this.changes) {
      // The body is partial, so compare with one complimented with existing values
      const diffs = getObjectDifferences(
        existing,
        { ...existing, ...body },
        true,
      );
      await this.changes.populate(
        id,
        this.objectType,
        'update',
        metadata?.updatedBy ?? 'system',
        metadata?.operationType,
        diffs,
      );
    }

    return res;
  }

  async create(
    body: DTOTYPE,
    metadata?: EntityOperationMetadata,
  ): Promise<MODEL> {
    const processed = await this.connectDependenciesForCreateAndUpdate(
      body,
      false,
    );
    // this.logger.log('Create', processed);

    try {
      // FIXME: transaction
      const result = await this.prismaDelegate.create({
        data: processed,
        include: this.standardInclude(),
      });

      if (this.objectType && this.changes) {
        const diff = getObjectDifferences({}, processed, true);
        await this.changes.populate(
          result.id,
          this.objectType,
          'create',
          metadata?.updatedBy ?? 'system',
          metadata?.operationType,
          diff,
        );
      }

      const model = this.convertModel(result);
      // this.logger.log('create done', model);
      return model;
    } catch (err) {
      this.logger.error(err);
      if (
        err.name === 'PrismaClientKnownRequestError' &&
        err.code === 'P2002' &&
        err.meta.target[0] === 'shortCode'
      ) {
        this.logger.error({ shortCode: body['shortCode'] });
      }
      throw err;
    }
  }

  connectDependenciesForCreateAndUpdate(
    body: CSVIMPORTTYPE | DTOTYPE,
    isUpdate: boolean,
  ): Promise<CONNECTEDDTO> {
    return Promise.resolve(body as any as CONNECTEDDTO);
  }

  convertModel(prismaType: PRISMATYPE): MODEL {
    return {
      ...(prismaType as any as MODEL),
    };
  }

  standardInclude() {
    return {};
  }

  protected getDefaultOrderBy() {
    return [
      {
        createdAt: 'desc',
      },
    ];
  }

  async getMany(
    filters: StandardFilterDto = {},
  ): Promise<PaginationAndSortingOutputDto<MODEL>> {
    const {
      pagination,
      sorting,
      filters: filterFields,
    } = parseFilters(filters);
    const { sort, sortOrder } = sorting;
    const { shortCode } = filterFields;
    const inputPagination = addPagination(pagination);
    const decodedSearchTerm = shortCode
      ? decodeURIComponent(shortCode).trim()
      : undefined;
    const where = {
      organisation: filterFields.organisation,
      deletedAt: null,
      OR: [],
    };

    if (decodedSearchTerm) {
      where.OR.push({
        name: {
          contains: decodedSearchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      });
      where.OR.push({
        shortCode: {
          contains: decodedSearchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      });
    }

    if (where.OR.length === 0) {
      delete where.OR;
    }

    const orderBy = sort
      ? [{ [sort]: sortOrder || 'asc' }]
      : this.getDefaultOrderBy();

    // const args: Prisma.SupportingServiceCategoryTypeFindManyArgs = {
    const args = {
      where: where,
      orderBy: orderBy,
      include: this.standardInclude(),
      ...inputPagination,
    };
    // const items = await this.prismaDelegate.findMany(arg0);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [data, count] = await this.prisma.$transaction([
      this.prismaDelegate.findMany(args),
      this.prismaDelegate.count({ where: args.where }),
    ]);
    // return { data, count };

    return {
      data: data.map(this.convertModel),
      count: count,
    };
  }

  async delete(
    id: string,
    metadata?: EntityOperationMetadata,
  ): Promise<{ sucess: boolean; message: string }> {
    // const result =await this.prismaDelegate.update({
    //   where: { id, deletedAt: null },
    //   data: { deletedAt: new Date() },
    // });
    try {
      const deleted = await this.prismaDelegate.delete({ where: { id } });

      if (this.objectType && this.changes) {
        const diff = getObjectDifferences(deleted, {}, true);
        await this.changes.populate(
          id,
          this.objectType,
          'delete',
          metadata?.updatedBy ?? 'system',
          metadata?.operationType,
          diff,
        );
      }

      return { sucess: true, message: 'Deleted successfully' };
    } catch (err) {
      let message = 'An unexpected error occurred. Please try again later.';
      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          message =
            'This record cannot be deleted because it is linked to child data. Please remove the child data first.';
          status = HttpStatus.CONFLICT;
        }
        // Handle other Prisma error codes as needed
      } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = 'An unknown error occurred. Please contact support.';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        message = 'A server error occurred. Please try again later.';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      } else if (err instanceof Prisma.PrismaClientInitializationError) {
        message =
          'Failed to initialize the database connection. Please check the server.';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        message = 'Validation failed. Please check the input data.';
        status = HttpStatus.BAD_REQUEST;
      }

      throw new HttpException(message, status);
    }
  }
}

export function parseDateForImport(input: string) {
  return input && input.length > 0 ? new Date(input) : null;
}

export function parseIntForInport(input: string) {
  return input && input.length > 0 ? parseInt(input) : null;
}

export function parseFloatForInport(input: string) {
  return input && input.length > 0 ? parseFloat(input) : null;
}

export function isValidImportString(input: string) {
  return input && input.length > 0 && input !== '#N/A';
}

export function parseBooleanForImport(input: string) {
  return input &&
    input.length > 0 &&
    (input.toUpperCase() === 'YES' ||
      input.toUpperCase() === 'Y' ||
      input.toUpperCase() === 'TRUE')
    ? true
    : false;
}
export function cleanCsvImportFields(body: any) {
  delete body['__parsed_extra'];
  delete body['idAuthTag'];
}
