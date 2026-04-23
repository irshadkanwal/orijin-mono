"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChangesController", {
    enumerable: true,
    get: function() {
        return ChangesController;
    }
});
const _common = require("@nestjs/common");
const _changesservice = require("./changes.service");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ChangesController = class ChangesController {
    async createCrop(org, farmId) {
        const prisma = new _client.PrismaClient();
        const farm = await prisma.farm.findUnique({
            where: {
                id: farmId
            },
            include: {
                facility: true
            }
        });
        if (!farm) {
            throw new Error('Farm not found');
        }
        // Current plots
        const plotIds = await prisma.plot.findMany({
            where: {
                farmId
            },
            select: {
                id: true
            }
        }).then((plots)=>plots.map((p)=>p.id));
        const addedPlotsChanges = this.changesService.getMany({
            objectType: 'Plot',
            sourceType: 'create',
            name: 'farmId',
            newValue: farmId
        }).then((result)=>result.data);
        const deletedPlotsChanges = this.changesService.getMany({
            objectType: 'Plot',
            sourceType: 'delete',
            name: 'farmId',
            newValue: farmId
        }).then((result)=>result.data);
        const personChanges = this.changesService.getMany({
            objectId: farm.facility.mainContactPersonId,
            objectType: 'Person'
        }).then((result)=>result.data);
        const facilityChanges = await this.changesService.getMany({
            objectId: farm.facilityId,
            objectType: 'Facility'
        }).then((result)=>result.data);
        const previousMainContactPersonIds = facilityChanges.filter((c)=>c.name === 'mainContactPersonId' && c.sourceType === 'update').map((c)=>c.oldValue);
        return Promise.all([
            this.changesService.getMany({
                objectId: farmId,
                objectType: 'Farm'
            }).then((result)=>result.data),
            facilityChanges,
            ...plotIds.map((id)=>this.changesService.getMany({
                    objectId: id,
                    objectType: 'Plot'
                }).then((result)=>result.data)),
            personChanges,
            ...previousMainContactPersonIds.map((id)=>this.changesService.getMany({
                    objectId: id,
                    objectType: 'Person'
                }).then((result)=>result.data)),
            addedPlotsChanges,
            deletedPlotsChanges
        ]).then((l)=>l.flat().sort((a, b)=>[
                    a.objectType,
                    a.name,
                    b.startTime.toISOString()
                ].join().localeCompare([
                    b.objectType,
                    b.name,
                    a.startTime.toISOString()
                ].join())));
    }
    constructor(changesService){
        this.changesService = changesService;
    }
};
_ts_decorate([
    (0, _common.Get)(':org/changes/farms/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ChangesController.prototype, "createCrop", null);
ChangesController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _changesservice.ChangesService === "undefined" ? Object : _changesservice.ChangesService
    ])
], ChangesController);
