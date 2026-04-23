"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceController", {
    enumerable: true,
    get: function() {
        return SupportServiceController;
    }
});
const _common = require("@nestjs/common");
const _supportServiceCategoryservice = require("./supportServiceCategory.service");
const _supportServiceActivityservice = require("./supportServiceActivity.service");
const _supportServiceCategoryTypeservice = require("./supportServiceCategoryType.service");
const _createSupportServiceActivitydto = require("./dto/createSupportServiceActivity.dto");
const _updateSupportServiceActivitydto = require("./dto/updateSupportServiceActivity.dto");
const _createSupportServiceCategorydto = require("./dto/createSupportServiceCategory.dto");
const _updateSupportServiceCategorydto = require("./dto/updateSupportServiceCategory.dto");
const _supportServiceCategoryTypesfilterdto = require("./dto/supportServiceCategoryTypes.filter.dto");
const _supportServiceActivityfilterdto = require("./dto/supportServiceActivity.filter.dto");
const _createSupportServiceCategoryTypedto = require("./dto/createSupportServiceCategoryType.dto");
const _supportServiceInputTypeservice = require("./supportServiceInputType.service");
const _supportServiceActivityTypeservice = require("./supportServiceActivityType.service");
const _supportServiceInputTypedto = require("./dto/supportServiceInputType.dto");
const _supportServiceActivityTypedto = require("./dto/supportServiceActivityType.dto");
const _express = require("express");
const _supportServiceCategoryfilterdto = require("./dto/supportServiceCategory.filter.dto");
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
let SupportServiceController = class SupportServiceController {
    //////
    // Support Service Category Types - just named wrong in v1 at the moment
    //////
    postServiceCategoryType(org, body) {
        body.organisation = org;
        return this.supportServiceCategoryTypeService.create(body);
    }
    getServiceCategoryTypes(org, filters) {
        filters.organisation = org;
        return this.supportServiceCategoryTypeService.getMany(filters);
    }
    getServiceCategoryType(org, id) {
        return this.supportServiceCategoryTypeService.getOne({
            id,
            org: org
        });
    }
    updateServiceCategoryType(org, id, body) {
        body.organisation = org;
        return this.supportServiceCategoryTypeService.update(id, body);
    }
    async deleteServiceCategoryType(res, org, id) {
        const resp = await this.supportServiceCategoryTypeService.delete(id);
        if (resp.sucess) {
            return res.status(_common.HttpStatus.OK).json(resp);
        } else {
            // Handle error response
            return res.status(_common.HttpStatus.BAD_REQUEST).json(resp);
        }
    }
    //////
    // Support Service Categories
    //////
    postServiceCategory(org, body) {
        body.organisation = org;
        return this.supportServiceCategoryService.create(body);
    }
    getServiceCategories(org, filters) {
        filters.organisation = org;
        return this.supportServiceCategoryService.getMany(filters);
    }
    getServiceCategory(org, id) {
        return this.supportServiceCategoryTypeService.getOne({
            id,
            org: org
        });
    }
    updateServiceCategory(org, id, body) {
        body.organisation = org;
        return this.supportServiceCategoryService.update(id, body);
    }
    async deleteServiceCategory(res, org, id) {
        const resp = await this.supportServiceCategoryService.delete(id);
        if (resp.sucess) {
            return res.status(_common.HttpStatus.OK).json(resp);
        } else {
            // Handle error response
            return res.status(_common.HttpStatus.BAD_REQUEST).json(resp);
        }
    }
    //////
    // Support Service Activities
    //////
    async getServiceActivities(org, filters) {
        filters.organisation = org;
        const response = await this.supportServiceActivityService.getMany(filters);
        const data = response.data.map((item)=>{
            return {
                ...item,
                farmerGroupIds: item.serviceActivityLocations?.map((x)=>x.locationId) ?? [],
                personIds: item.ServiceActivityBeneficiaries?.map((x)=>x.personId) ?? [],
                itemsProcessed: item.ServiceActivityBeneficiaries?.[0]?.itemsProcessed,
                itemValue: item.ServiceActivityBeneficiaries?.[0]?.itemValue,
                score: item.ServiceActivityBeneficiaries?.[0]?.score,
                total: item.ServiceActivityBeneficiaries?.[0]?.total
            };
        });
        return {
            data,
            count: response.count
        };
    }
    getServiceActivity(org, id) {
        return this.supportServiceActivityService.getOne({
            id,
            org: org
        });
    }
    postServiceActivity(org, body) {
        body.organisation = org;
        return this.supportServiceActivityService.create(body);
    }
    updateServiceActivity(org, id, body) {
        body.organisation = org;
        return this.supportServiceActivityService.update(id, body);
    }
    async deleteServiceActivity(res, org, id) {
        const resp = await this.supportServiceActivityService.delete(id);
        if (resp.sucess) {
            return res.status(_common.HttpStatus.OK).json(resp);
        } else {
            // Handle error response
            return res.status(_common.HttpStatus.BAD_REQUEST).json(resp);
        }
    }
    //////
    // Support Service Input Types
    //////
    getServiceInputs(org, filters) {
        filters.organisation = org;
        return this.supportServiceInputTypeService.getMany(filters);
    }
    getServiceInputType(org, id) {
        return this.supportServiceInputTypeService.getOne({
            id,
            org: org
        });
    }
    postServiceInputType(org, body) {
        body.organisation = org;
        return this.supportServiceInputTypeService.create(body);
    }
    updateServiceInputType(org, id, body) {
        body.organisation = org;
        return this.supportServiceInputTypeService.update(id, body);
    }
    async deleteServiceInputType(res, org, id) {
        const resp = await this.supportServiceInputTypeService.delete(id);
        if (resp.sucess) {
            return res.status(_common.HttpStatus.OK).json(resp);
        } else {
            // Handle error response
            return res.status(_common.HttpStatus.BAD_REQUEST).json(resp);
        }
    }
    //////
    // Support Service actiivty Types
    //////
    getServiceActivityTypes(org, filters) {
        filters.organisation = org;
        return this.supportServiceActivityTypeService.getMany(filters);
    }
    getServiceActivityType(org, id) {
        return this.supportServiceActivityTypeService.getOne({
            id,
            org: org
        });
    }
    postServiceActivityType(org, body) {
        body.organisation = org;
        return this.supportServiceActivityTypeService.create(body);
    }
    updateServiceActivityType(org, id, body) {
        body.organisation = org;
        return this.supportServiceActivityTypeService.update(id, body);
    }
    async deleteServiceActivityType(res, org, id) {
        const resp = await this.supportServiceActivityTypeService.delete(id);
        if (resp.sucess) {
            return res.status(_common.HttpStatus.OK).json(resp);
        } else {
            // Handle error response
            return res.status(_common.HttpStatus.BAD_REQUEST).json(resp);
        }
    }
    constructor(supportServiceCategoryTypeService, supportServiceCategoryService, supportServiceInputTypeService, supportServiceActivityTypeService, supportServiceActivityService){
        this.supportServiceCategoryTypeService = supportServiceCategoryTypeService;
        this.supportServiceCategoryService = supportServiceCategoryService;
        this.supportServiceInputTypeService = supportServiceInputTypeService;
        this.supportServiceActivityTypeService = supportServiceActivityTypeService;
        this.supportServiceActivityService = supportServiceActivityService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/service-category-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _createSupportServiceCategoryTypedto.CreateServiceCategoryTypeValues === "undefined" ? Object : _createSupportServiceCategoryTypedto.CreateServiceCategoryTypeValues
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "postServiceCategoryType", null);
_ts_decorate([
    (0, _common.Get)(':org/service-category-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _supportServiceCategoryTypesfilterdto.SupportServiceCategoryTypesFilterDto === "undefined" ? Object : _supportServiceCategoryTypesfilterdto.SupportServiceCategoryTypesFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceCategoryTypes", null);
_ts_decorate([
    (0, _common.Get)(':org/service-category-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceCategoryType", null);
_ts_decorate([
    (0, _common.Patch)(':org/service-category-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _createSupportServiceCategoryTypedto.CreateServiceCategoryTypeValues === "undefined" ? Object : _createSupportServiceCategoryTypedto.CreateServiceCategoryTypeValues
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "updateServiceCategoryType", null);
_ts_decorate([
    (0, _common.Delete)(':org/service-category-types/:id'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('org')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportServiceController.prototype, "deleteServiceCategoryType", null);
_ts_decorate([
    (0, _common.Post)(':org/service-categories') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _createSupportServiceCategorydto.CreateSupportServiceCategoryDto === "undefined" ? Object : _createSupportServiceCategorydto.CreateSupportServiceCategoryDto
    ]),
    _ts_metadata("design:returntype", Object)
], SupportServiceController.prototype, "postServiceCategory", null);
_ts_decorate([
    (0, _common.Get)(':org/service-categories'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _supportServiceCategoryfilterdto.SupportServiceCategoryFilterDto === "undefined" ? Object : _supportServiceCategoryfilterdto.SupportServiceCategoryFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceCategories", null);
_ts_decorate([
    (0, _common.Get)(':org/service-categories/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceCategory", null);
_ts_decorate([
    (0, _common.Patch)(':org/service-categories/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _updateSupportServiceCategorydto.UpdateSupportServiceCategoryDto === "undefined" ? Object : _updateSupportServiceCategorydto.UpdateSupportServiceCategoryDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "updateServiceCategory", null);
_ts_decorate([
    (0, _common.Delete)(':org/service-categories/:id'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('org')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportServiceController.prototype, "deleteServiceCategory", null);
_ts_decorate([
    (0, _common.Get)(':org/serviceactivities'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _supportServiceActivityfilterdto.SupportServiceActivityFilterDto === "undefined" ? Object : _supportServiceActivityfilterdto.SupportServiceActivityFilterDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportServiceController.prototype, "getServiceActivities", null);
_ts_decorate([
    (0, _common.Get)(':org/serviceactivities/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceActivity", null);
_ts_decorate([
    (0, _common.Post)(':org/serviceactivities'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _createSupportServiceActivitydto.CreateSupportServiceActivityDto === "undefined" ? Object : _createSupportServiceActivitydto.CreateSupportServiceActivityDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "postServiceActivity", null);
_ts_decorate([
    (0, _common.Patch)(':org/serviceactivities/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _updateSupportServiceActivitydto.UpdateSupportServiceActivityDto === "undefined" ? Object : _updateSupportServiceActivitydto.UpdateSupportServiceActivityDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "updateServiceActivity", null);
_ts_decorate([
    (0, _common.Delete)(':org/serviceactivities/:id'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('org')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportServiceController.prototype, "deleteServiceActivity", null);
_ts_decorate([
    (0, _common.Get)(':org/service-input-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _supportServiceInputTypedto.SupportServiceInputTypesFilterDto === "undefined" ? Object : _supportServiceInputTypedto.SupportServiceInputTypesFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceInputs", null);
_ts_decorate([
    (0, _common.Get)(':org/service-input-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceInputType", null);
_ts_decorate([
    (0, _common.Post)(':org/service-input-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _supportServiceInputTypedto.SupportServiceInputTypeDto === "undefined" ? Object : _supportServiceInputTypedto.SupportServiceInputTypeDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "postServiceInputType", null);
_ts_decorate([
    (0, _common.Patch)(':org/service-input-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _supportServiceInputTypedto.SupportServiceInputTypeDto === "undefined" ? Object : _supportServiceInputTypedto.SupportServiceInputTypeDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "updateServiceInputType", null);
_ts_decorate([
    (0, _common.Delete)(':org/service-input-types/:id'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('org')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportServiceController.prototype, "deleteServiceInputType", null);
_ts_decorate([
    (0, _common.Get)(':org/service-activity-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _supportServiceActivityTypedto.SupportServiceActivityTypesFilterDto === "undefined" ? Object : _supportServiceActivityTypedto.SupportServiceActivityTypesFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceActivityTypes", null);
_ts_decorate([
    (0, _common.Get)(':org/service-activity-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "getServiceActivityType", null);
_ts_decorate([
    (0, _common.Post)(':org/service-activity-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _supportServiceActivityTypedto.SupportServiceActivityTypeDto === "undefined" ? Object : _supportServiceActivityTypedto.SupportServiceActivityTypeDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "postServiceActivityType", null);
_ts_decorate([
    (0, _common.Patch)(':org/service-activity-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _supportServiceActivityTypedto.SupportServiceActivityTypeDto === "undefined" ? Object : _supportServiceActivityTypedto.SupportServiceActivityTypeDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SupportServiceController.prototype, "updateServiceActivityType", null);
_ts_decorate([
    (0, _common.Delete)(':org/service-activity-types/:id'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('org')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportServiceController.prototype, "deleteServiceActivityType", null);
SupportServiceController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _supportServiceCategoryTypeservice.SupportServiceCategoryTypeService === "undefined" ? Object : _supportServiceCategoryTypeservice.SupportServiceCategoryTypeService,
        typeof _supportServiceCategoryservice.SupportServiceCategoryService === "undefined" ? Object : _supportServiceCategoryservice.SupportServiceCategoryService,
        typeof _supportServiceInputTypeservice.SupportServiceInputTypeService === "undefined" ? Object : _supportServiceInputTypeservice.SupportServiceInputTypeService,
        typeof _supportServiceActivityTypeservice.SupportServiceActivityTypeService === "undefined" ? Object : _supportServiceActivityTypeservice.SupportServiceActivityTypeService,
        typeof _supportServiceActivityservice.SupportServiceActivityService === "undefined" ? Object : _supportServiceActivityservice.SupportServiceActivityService
    ])
], SupportServiceController);
