"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cleanCsvImportFields: function() {
        return cleanCsvImportFields;
    },
    default: function() {
        return AbstractService;
    },
    isValidImportString: function() {
        return isValidImportString;
    },
    parseBooleanForImport: function() {
        return parseBooleanForImport;
    },
    parseDateForImport: function() {
        return parseDateForImport;
    },
    parseFloatForInport: function() {
        return parseFloatForInport;
    },
    parseIntForInport: function() {
        return parseIntForInport;
    }
});
const _client = require("@prisma/client");
const _prismahelper = require("../prisma.helper");
const _common = require("@nestjs/common");
const _comparisonUtil = require("../comparisonUtil");
let AbstractService = class AbstractService {
    async getOne(params, includes = this.standardInclude()) {
        if (params.id) {
            const itemById = await this.prismaDelegate.findUnique({
                where: {
                    id: params.id,
                    organisation: params.org,
                    deletedAt: null
                },
                include: includes
            });
            return this.convertModel(itemById);
        }
        // FIXME: asked for one but looking for many??
        const itemByShortCode = await this.prismaDelegate.findMany({
            where: {
                organisation: params.org,
                shortCode: params.shortCode,
                deletedAt: null
            },
            include: this.standardInclude()
        });
        const itemByShortCodeElement = itemByShortCode[0];
        return this.convertModel(itemByShortCodeElement);
    }
    async upsertImport(body) {
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
        const existing = await this.findUnique(shortCode, organisation);
        if (existing) {
            const convertedInput = await this.convertForImport({
                ...existing,
                ...body
            });
            return this.update(existing.id, convertedInput);
        }
        // this.logger.log('before conversion', body);
        const convertedInput = await this.convertForImport(body);
        return this.create(convertedInput);
    }
    async findUnique(shortCode, organisation) {
        const existing = await this.prismaDelegate.findUnique({
            where: {
                // shortCode: shortCode,
                // organisation: organisation,
                // shortCode_organisation: organisation,
                // TODO: SM this started complaining so had to change the findunique, need to start using proper prisma types here!!
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                shortCode_organisation: {
                    shortCode: shortCode,
                    organisation: organisation
                },
                id: undefined,
                deletedAt: null
            },
            include: this.standardInclude()
        });
        return existing;
    }
    async convertForImport(body) {
        return body;
    }
    async update(id, body, metadata) {
        const processed = await this.connectDependenciesForCreateAndUpdate(body, true);
        const existing = await this.getOne({
            id: id,
            org: body.organisation
        }, false);
        // FIXME: transaction
        const res = this.convertModel(await this.prismaDelegate.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                ...processed
            },
            include: this.standardInclude()
        }));
        if (this.objectType && this.changes) {
            // The body is partial, so compare with one complimented with existing values
            const diffs = (0, _comparisonUtil.getObjectDifferences)(existing, {
                ...existing,
                ...body
            }, true);
            await this.changes.populate(id, this.objectType, 'update', metadata?.updatedBy ?? 'system', metadata?.operationType, diffs);
        }
        return res;
    }
    async create(body, metadata) {
        const processed = await this.connectDependenciesForCreateAndUpdate(body, false);
        // this.logger.log('Create', processed);
        try {
            // FIXME: transaction
            const result = await this.prismaDelegate.create({
                data: processed,
                include: this.standardInclude()
            });
            if (this.objectType && this.changes) {
                const diff = (0, _comparisonUtil.getObjectDifferences)({}, processed, true);
                await this.changes.populate(result.id, this.objectType, 'create', metadata?.updatedBy ?? 'system', metadata?.operationType, diff);
            }
            const model = this.convertModel(result);
            // this.logger.log('create done', model);
            return model;
        } catch (err) {
            this.logger.error(err);
            if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2002' && err.meta.target[0] === 'shortCode') {
                this.logger.error({
                    shortCode: body['shortCode']
                });
            }
            throw err;
        }
    }
    connectDependenciesForCreateAndUpdate(body, isUpdate) {
        return Promise.resolve(body);
    }
    convertModel(prismaType) {
        return {
            ...prismaType
        };
    }
    standardInclude() {
        return {};
    }
    getDefaultOrderBy() {
        return [
            {
                createdAt: 'desc'
            }
        ];
    }
    async getMany(filters = {}) {
        const { pagination, sorting, filters: filterFields } = (0, _prismahelper.parseFilters)(filters);
        const { sort, sortOrder } = sorting;
        const { shortCode } = filterFields;
        const inputPagination = (0, _prismahelper.addPagination)(pagination);
        const decodedSearchTerm = shortCode ? decodeURIComponent(shortCode).trim() : undefined;
        const where = {
            organisation: filterFields.organisation,
            deletedAt: null,
            OR: []
        };
        if (decodedSearchTerm) {
            where.OR.push({
                name: {
                    contains: decodedSearchTerm,
                    mode: _client.Prisma.QueryMode.insensitive
                }
            });
            where.OR.push({
                shortCode: {
                    contains: decodedSearchTerm,
                    mode: _client.Prisma.QueryMode.insensitive
                }
            });
        }
        if (where.OR.length === 0) {
            delete where.OR;
        }
        const orderBy = sort ? [
            {
                [sort]: sortOrder || 'asc'
            }
        ] : this.getDefaultOrderBy();
        // const args: Prisma.SupportingServiceCategoryTypeFindManyArgs = {
        const args = {
            where: where,
            orderBy: orderBy,
            include: this.standardInclude(),
            ...inputPagination
        };
        // const items = await this.prismaDelegate.findMany(arg0);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [data, count] = await this.prisma.$transaction([
            this.prismaDelegate.findMany(args),
            this.prismaDelegate.count({
                where: args.where
            })
        ]);
        // return { data, count };
        return {
            data: data.map(this.convertModel),
            count: count
        };
    }
    async delete(id, metadata) {
        // const result =await this.prismaDelegate.update({
        //   where: { id, deletedAt: null },
        //   data: { deletedAt: new Date() },
        // });
        try {
            const deleted = await this.prismaDelegate.delete({
                where: {
                    id
                }
            });
            if (this.objectType && this.changes) {
                const diff = (0, _comparisonUtil.getObjectDifferences)(deleted, {}, true);
                await this.changes.populate(id, this.objectType, 'delete', metadata?.updatedBy ?? 'system', metadata?.operationType, diff);
            }
            return {
                sucess: true,
                message: 'Deleted successfully'
            };
        } catch (err) {
            let message = 'An unexpected error occurred. Please try again later.';
            let status = _common.HttpStatus.INTERNAL_SERVER_ERROR;
            if (err instanceof _client.Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    message = 'This record cannot be deleted because it is linked to child data. Please remove the child data first.';
                    status = _common.HttpStatus.CONFLICT;
                }
            // Handle other Prisma error codes as needed
            } else if (err instanceof _client.Prisma.PrismaClientUnknownRequestError) {
                message = 'An unknown error occurred. Please contact support.';
                status = _common.HttpStatus.INTERNAL_SERVER_ERROR;
            } else if (err instanceof _client.Prisma.PrismaClientRustPanicError) {
                message = 'A server error occurred. Please try again later.';
                status = _common.HttpStatus.INTERNAL_SERVER_ERROR;
            } else if (err instanceof _client.Prisma.PrismaClientInitializationError) {
                message = 'Failed to initialize the database connection. Please check the server.';
                status = _common.HttpStatus.INTERNAL_SERVER_ERROR;
            } else if (err instanceof _client.Prisma.PrismaClientValidationError) {
                message = 'Validation failed. Please check the input data.';
                status = _common.HttpStatus.BAD_REQUEST;
            }
            throw new _common.HttpException(message, status);
        }
    }
    constructor(prisma, prismaDelegate, changes){
        this.prisma = prisma;
        this.prismaDelegate = prismaDelegate;
        this.changes = changes;
        this.logger = new _common.Logger('AbstractService');
        this.objectType = undefined;
    }
};
function parseDateForImport(input) {
    return input && input.length > 0 ? new Date(input) : null;
}
function parseIntForInport(input) {
    return input && input.length > 0 ? parseInt(input) : null;
}
function parseFloatForInport(input) {
    return input && input.length > 0 ? parseFloat(input) : null;
}
function isValidImportString(input) {
    return input && input.length > 0 && input !== '#N/A';
}
function parseBooleanForImport(input) {
    return input && input.length > 0 && (input.toUpperCase() === 'YES' || input.toUpperCase() === 'Y' || input.toUpperCase() === 'TRUE') ? true : false;
}
function cleanCsvImportFields(body) {
    delete body['__parsed_extra'];
    delete body['idAuthTag'];
}
