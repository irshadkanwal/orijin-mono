/* eslint-disable */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const _default = async ()=>{
    const t = {
        ["./facilities/models/facility.model"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./facilities/models/facility.model"))),
        ["./persons/dto/persons.dto"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/dto/persons.dto"))),
        ["./facilities/dto/facilities.dto"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./facilities/dto/facilities.dto"))),
        ["./common/models/firebase-metadata.model"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./common/models/firebase-metadata.model"))),
        ["./organisations/dto/organisations.dto"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./organisations/dto/organisations.dto"))),
        ["./tags/dto/tags.dto"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./tags/dto/tags.dto"))),
        ["./farms/models/farms.model"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./farms/models/farms.model"))),
        ["./farms/dto/farms.dto"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./farms/dto/farms.dto"))),
        ["./farms/models/plots.model"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./farms/models/plots.model"))),
        ["./contracts/dto/contracts.dto"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./contracts/dto/contracts.dto"))),
        ["./persons/dto/tags.dto"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/dto/tags.dto"))),
        ["./supportServices/models/supportService.model"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/models/supportService.model"))),
        ["./firestore/entities/org/OrganisationConfiguration"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./firestore/entities/org/OrganisationConfiguration"))),
        ["./users/models/user.model"]: await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./users/models/user.model")))
    };
    return {
        "@nestjs/swagger/plugin": {
            "models": [
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/createSupportServiceCategory.dto"))),
                    {
                        "AbstractDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: true,
                                type: ()=>String,
                                nullable: true
                            }
                        },
                        "CreateSupportServiceCategoryDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryTypeCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceCategoryDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryTypeId: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            service: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceCategoryDtoConnected": {
                            supportingServiceCategoryType: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./farms/dto/farms.filter.dto"))),
                    {
                        "FarmsFilter": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            text: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: false,
                                type: ()=>String
                            },
                            location: {
                                required: false,
                                type: ()=>String
                            },
                            customLocation: {
                                required: false,
                                type: ()=>String
                            },
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            'facility.name': {
                                required: false,
                                type: ()=>String
                            },
                            description: {
                                required: false,
                                type: ()=>String
                            },
                            seasonCode: {
                                required: false,
                                type: ()=>String
                            },
                            polygonStatus: {
                                required: false,
                                type: ()=>String
                            },
                            deforestation: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./farms/dto/plots.filter.dto"))),
                    {
                        "PlotsFilter": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: false,
                                type: ()=>String
                            },
                            farmId: {
                                required: false,
                                type: ()=>String
                            },
                            farmShortcode: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./firestore/dto/firestore.users.filter.dto"))),
                    {
                        "FirestoreUsersFilter": {
                            email: {
                                required: false,
                                type: ()=>String
                            },
                            organization: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./locations/dto/locations.filter.dto"))),
                    {
                        "LocationsFilter": {
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: false,
                                type: ()=>String
                            },
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            type: {
                                required: false,
                                type: ()=>String
                            },
                            mainType: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./common/dto/paginationAndSorting.dto"))),
                    {
                        "PaginationAndSortingOutputDto": {
                            data: {
                                required: true
                            },
                            count: {
                                required: true,
                                type: ()=>Number
                            }
                        },
                        "PaginationAndSortingDto": {
                            page: {
                                required: false,
                                type: ()=>String
                            },
                            limit: {
                                required: false,
                                type: ()=>String
                            },
                            order: {
                                required: false,
                                type: ()=>String
                            },
                            sort: {
                                required: false,
                                type: ()=>String
                            },
                            sortOrder: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "StandardFilterDto": {
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: false,
                                type: ()=>String
                            },
                            organisation: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./changes/dto/changes.dto"))),
                    {
                        "ChangesDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "ChangesDto": {
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            organisation: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "ChangesDtoConnected": {}
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./changes/dto/changes.filter.dto"))),
                    {
                        "ChangesFilter": {
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            objectId: {
                                required: false,
                                type: ()=>String
                            },
                            objectType: {
                                required: false,
                                type: ()=>String
                            },
                            sourceType: {
                                required: false,
                                type: ()=>Object
                            },
                            startTime: {
                                required: false,
                                type: ()=>Date
                            },
                            endTime: {
                                required: false,
                                type: ()=>Date
                            },
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            newValue: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/supportingServiceCategory.filter.dto"))),
                    {
                        "SupportingServiceCategoryFilterDto": {}
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/supportServiceCategory.filter.dto"))),
                    {
                        "SupportServiceCategoryFilterDto": {
                            categoryType: {
                                required: false,
                                type: ()=>Object
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/createSupportServiceActivity.dto"))),
                    {
                        "AbstractDto": {
                            description: {
                                required: true,
                                type: ()=>String
                            },
                            beneficiaryType: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceActivityDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            operator: {
                                required: true,
                                type: ()=>String
                            },
                            dateOfService: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceActivityTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceInputTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            locationCode: {
                                required: true,
                                type: ()=>String
                            },
                            farmerGroupCodes: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryTypeCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceActivityDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            operator: {
                                required: true,
                                type: ()=>String
                            },
                            farmerGroupIds: {
                                required: true,
                                type: ()=>[
                                        String
                                    ]
                            },
                            personIds: {
                                required: true,
                                type: ()=>[
                                        String
                                    ]
                            },
                            dateOfService: {
                                required: true,
                                type: ()=>Date
                            },
                            supportingServiceCategoryId: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceActivityTypeId: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceActivityTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceInputTypeId: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceInputTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            locationId: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryTypeId: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            itemsProcessed: {
                                required: false,
                                type: ()=>Number
                            },
                            itemValue: {
                                required: false,
                                type: ()=>Number
                            },
                            score: {
                                required: false,
                                type: ()=>Number
                            },
                            total: {
                                required: false,
                                type: ()=>Number
                            }
                        },
                        "CreateSupportServiceActivityDtoConnected": {
                            supportingServiceCategory: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            supportingServiceInputType: {
                                required: false,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            supportingServiceActivityType: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            ServiceActivityBeneficiaries: {
                                required: true,
                                type: ()=>({
                                        deleteMany: {
                                            required: true,
                                            type: ()=>Object
                                        },
                                        create: {
                                            required: false
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/supportServiceActivity.filter.dto"))),
                    {
                        "SupportServiceActivityFilterDto": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            personName: {
                                required: false,
                                type: ()=>String
                            },
                            activityType: {
                                required: false,
                                type: ()=>String
                            },
                            location: {
                                required: false,
                                type: ()=>String
                            },
                            customLocation: {
                                required: false,
                                type: ()=>String
                            },
                            program: {
                                required: false,
                                type: ()=>String
                            },
                            serviceType: {
                                required: false,
                                type: ()=>String
                            },
                            inputType: {
                                required: false,
                                type: ()=>String
                            },
                            gender: {
                                required: false,
                                type: ()=>String
                            },
                            ageRanges: {
                                required: false,
                                type: ()=>String
                            },
                            operator: {
                                required: false,
                                type: ()=>String
                            },
                            tab: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./locations/dto/locations.dto"))),
                    {
                        "LocationsDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                type: ()=>String
                            },
                            parent: {
                                required: false,
                                type: ()=>Object
                            },
                            parentId: {
                                required: false,
                                type: ()=>String
                            },
                            parentCode: {
                                required: false,
                                type: ()=>String
                            },
                            mainType: {
                                required: false,
                                type: ()=>Object
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/createSupportServiceCategoryType.dto"))),
                    {
                        "AbstracDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: false,
                                type: ()=>String,
                                nullable: true
                            }
                        },
                        "CreateServiceCategoryTypeValuesCSV": {},
                        "CreateServiceCategoryTypeValues": {}
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/supportServiceCategoryTypes.filter.dto"))),
                    {
                        "SupportServiceCategoryTypesFilterDto": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/updateSupportServiceActivity.dto"))),
                    {
                        "UpdateSupportServiceActivityDto": {
                            operator: {
                                required: false,
                                type: ()=>String
                            },
                            type: {
                                required: false,
                                type: ()=>String
                            },
                            farmerGroupIds: {
                                required: false,
                                type: ()=>[
                                        String
                                    ]
                            },
                            personIds: {
                                required: true,
                                type: ()=>[
                                        String
                                    ]
                            },
                            dateOfService: {
                                required: false,
                                type: ()=>Date
                            },
                            supportingServiceCategoryId: {
                                required: false,
                                type: ()=>String
                            },
                            locationId: {
                                required: false,
                                type: ()=>String
                            },
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            category: {
                                required: false,
                                type: ()=>String
                            },
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            userType: {
                                required: false,
                                type: ()=>String
                            },
                            supportingServiceCategoryTypeId: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/updateSupportServiceCategory.dto"))),
                    {
                        "UpdateSupportServiceCategoryDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            service: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: true,
                                type: ()=>String,
                                nullable: true
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/supportServiceActivityType.dto"))),
                    {
                        "AbstractDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            beneficiaryType: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "SupportServiceActivityTypeDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceInputTypeCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "SupportServiceActivityTypeDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryId: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceInputTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceInputTypeId: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceActivityTypeDtoConnected": {
                            supportingServiceCategory: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        },
                        "SupportServiceActivityTypesFilterDto": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/supportServiceInputType.dto"))),
                    {
                        "AbstractDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "SupportServiceInputTypeDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "SupportServiceInputTypeDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryId: {
                                required: true,
                                type: ()=>String
                            },
                            supportingServiceCategoryCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceInputTypeDtoConnected": {
                            supportingServiceCategory: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        },
                        "SupportServiceInputTypesFilterDto": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/dto/createSupportServiceActivityBeneficiary.dto"))),
                    {
                        "CreateSupportServiceActivityBeneficiaryDtoCsvAbstract": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            serviceActivityCode: {
                                required: true,
                                type: ()=>String
                            },
                            beneficiaryCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceActivityBeneficiaryDtoCsv": {
                            primary: {
                                required: false,
                                type: ()=>String
                            },
                            itemValue: {
                                required: false,
                                type: ()=>String
                            },
                            itemsProcessed: {
                                required: false,
                                type: ()=>String
                            },
                            grade: {
                                required: false,
                                type: ()=>String
                            },
                            score: {
                                required: false,
                                type: ()=>String
                            },
                            total: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "CreateSupportServiceActivityBeneficiaryDtoCsvConverted": {
                            primary: {
                                required: false,
                                type: ()=>Boolean
                            },
                            itemValue: {
                                required: false,
                                type: ()=>Number
                            },
                            itemsProcessed: {
                                required: false,
                                type: ()=>Number
                            },
                            grade: {
                                required: false,
                                type: ()=>Number
                            },
                            score: {
                                required: false,
                                type: ()=>Number
                            },
                            total: {
                                required: false,
                                type: ()=>Number
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./crops/dto/crops.dto"))),
                    {
                        "CropsDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: false,
                                type: ()=>String,
                                nullable: true
                            }
                        },
                        "CropsDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String,
                                nullable: true
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: false,
                                type: ()=>String,
                                nullable: true
                            }
                        },
                        "AbstractCropVarietyDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "CropVarietyDtoCsv": {
                            cropCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "CropVarietyDtoConnected": {
                            crop: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        },
                        "CropVarietyDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            cropId: {
                                required: false,
                                type: ()=>String
                            },
                            cropCode: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./crops/dto/crops.filter.dto"))),
                    {
                        "CropVarietyFilter": {
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: false,
                                type: ()=>String
                            },
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            description: {
                                required: false,
                                type: ()=>String
                            },
                            cropCode: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/dto/persons.dto"))),
                    {
                        "PersonsDtoCsv": {
                            dateOfBirth: {
                                required: true,
                                type: ()=>String
                            },
                            dateOfBirthApproximate: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "PersonsDto": {
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            dateOfBirth: {
                                required: false,
                                type: ()=>Date
                            },
                            dateOfBirthApproximate: {
                                required: false,
                                type: ()=>Boolean
                            }
                        },
                        "PersonsDtoConnected": {}
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/dto/persons.filter.dto"))),
                    {
                        "PersonsFilter": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            text: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: false,
                                type: ()=>String
                            },
                            location: {
                                required: false,
                                type: ()=>String
                            },
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            includeActivities: {
                                required: false,
                                type: ()=>Boolean
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/dto/contacts.dto"))),
                    {
                        "ContactsDtoCsv": {},
                        "ContactsDto": {},
                        "ContactsDtoConnected": {
                            person: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/dto/wallets.dto"))),
                    {
                        "WalletsDtoCsv": {},
                        "WalletsDto": {
                            id: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "WalletsDtoConnected": {
                            contact: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./facilities/dto/facilities.dto"))),
                    {
                        "AbstractDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                enum: t["./facilities/models/facility.model"].FacilityType
                            },
                            timezone: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "FacilitiesDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            mainContactPersonCode: {
                                required: false,
                                type: ()=>String
                            },
                            locationCode: {
                                required: false,
                                type: ()=>String
                            },
                            customLocationCode: {
                                required: false,
                                type: ()=>String
                            },
                            areaTotalManual: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "FacilitiesDto": {
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            firestoreId: {
                                required: false,
                                type: ()=>String
                            },
                            mainContactPerson: {
                                required: false,
                                type: ()=>t["./persons/dto/persons.dto"].PersonsDto
                            },
                            mainContactPersonId: {
                                required: false,
                                type: ()=>String
                            },
                            locationId: {
                                required: false,
                                type: ()=>String
                            },
                            location: {
                                required: false,
                                type: ()=>Object
                            },
                            customLocation: {
                                required: false,
                                type: ()=>Object
                            },
                            customLocationId: {
                                required: false,
                                type: ()=>String
                            },
                            areaTotalManual: {
                                required: true,
                                type: ()=>Number
                            },
                            address: {
                                required: false,
                                type: ()=>Object
                            },
                            coordinate: {
                                required: false,
                                type: ()=>t["./facilities/dto/facilities.dto"].GeoCoordinateInput
                            },
                            countryIso: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "FacilityFilterDto": {
                            type: {
                                required: false,
                                type: ()=>String
                            },
                            notFarm: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "GeoCoordinateInput": {
                            latitude: {
                                required: true,
                                type: ()=>Number
                            },
                            longitude: {
                                required: true,
                                type: ()=>Number
                            },
                            altitude: {
                                required: false,
                                type: ()=>Number
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./organisations/dto/organisations.dto"))),
                    {
                        "OrganisationValues": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "OrganisationsDto": {
                            meta: {
                                required: true,
                                type: ()=>t["./common/models/firebase-metadata.model"].FirebaseMetaData
                            },
                            values: {
                                required: true,
                                type: ()=>t["./organisations/dto/organisations.dto"].OrganisationValues
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./tags/dto/tags.dto"))),
                    {
                        "TagValues": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            organisation: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "TagsDto": {
                            meta: {
                                required: true,
                                type: ()=>t["./common/models/firebase-metadata.model"].FirebaseMetaData
                            },
                            values: {
                                required: true,
                                type: ()=>t["./tags/dto/tags.dto"].TagValues
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./farms/dto/farms.dto"))),
                    {
                        "FarmInputValues": {
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            firestoreId: {
                                required: false,
                                type: ()=>String
                            },
                            seasonCode: {
                                required: false,
                                type: ()=>String
                            },
                            seasonId: {
                                required: false,
                                type: ()=>String
                            },
                            cultivationStartDate: {
                                required: false,
                                type: ()=>Date
                            },
                            contractDate: {
                                required: false,
                                type: ()=>Date
                            },
                            registrationDate: {
                                required: false,
                                type: ()=>Date
                            },
                            certificationStartDate: {
                                required: false,
                                type: ()=>Date
                            },
                            lastChemicalUseDate: {
                                required: false,
                                type: ()=>Date
                            },
                            lastInspectionDate: {
                                required: false,
                                type: ()=>Date
                            },
                            firstVisitDate: {
                                required: false,
                                type: ()=>Date
                            },
                            certificationStatus: {
                                required: false,
                                enum: t["./farms/models/farms.model"].CertificationStatus
                            },
                            approvalStatus: {
                                required: false,
                                enum: t["./farms/models/farms.model"].ReviewStatus
                            },
                            creationStatus: {
                                required: false,
                                enum: t["./farms/models/farms.model"].CreationStatus
                            },
                            parentFacilityName: {
                                required: false,
                                type: ()=>String
                            },
                            plots: {
                                required: false,
                                type: ()=>[
                                        t["./farms/dto/farms.dto"].PlotDto
                                    ]
                            }
                        },
                        "CountItemDto": {
                            category: {
                                required: true,
                                enum: t["./farms/models/farms.model"].CountCategory
                            },
                            type: {
                                required: true,
                                enum: t["./farms/models/farms.model"].CountType
                            },
                            subType: {
                                required: false,
                                enum: t["./farms/models/farms.model"].CountSubType
                            },
                            count: {
                                required: true,
                                type: ()=>Number
                            },
                            farmId: {
                                required: false,
                                type: ()=>String
                            },
                            farmCode: {
                                required: false,
                                type: ()=>String
                            },
                            plotId: {
                                required: false,
                                type: ()=>String
                            },
                            plotCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "FarmsDtoCSv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            seasonCode: {
                                required: true,
                                type: ()=>String
                            },
                            cultivationStartDate: {
                                required: false,
                                type: ()=>String
                            },
                            contractDate: {
                                required: false,
                                type: ()=>String
                            },
                            registrationDate: {
                                required: false,
                                type: ()=>String
                            },
                            certificationStartDate: {
                                required: false,
                                type: ()=>String
                            },
                            lastChemicalUseDate: {
                                required: false,
                                type: ()=>String
                            },
                            lastInspectionDate: {
                                required: false,
                                type: ()=>String
                            },
                            firstVisitDate: {
                                required: false,
                                type: ()=>String
                            },
                            certificationStatus: {
                                required: false,
                                type: ()=>String
                            },
                            approvalStatus: {
                                required: false,
                                type: ()=>String
                            },
                            creationStatus: {
                                required: false,
                                type: ()=>String
                            },
                            longitude: {
                                required: false,
                                type: ()=>String
                            },
                            latitude: {
                                required: false,
                                type: ()=>String
                            },
                            altitude: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "FarmsDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            farmValues: {
                                required: true,
                                type: ()=>t["./farms/dto/farms.dto"].FarmInputValues
                            },
                            facilityValues: {
                                required: true,
                                type: ()=>t["./facilities/dto/facilities.dto"].FacilitiesDto
                            }
                        },
                        "PlotDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                enum: t["./farms/models/plots.model"].PlotType
                            },
                            farmId: {
                                required: false,
                                type: ()=>String
                            },
                            farmCode: {
                                required: false,
                                type: ()=>String
                            },
                            status: {
                                required: false,
                                type: ()=>String
                            },
                            polygonSource: {
                                required: false,
                                enum: t["./farms/models/plots.model"].PlotCoordinateSources
                            },
                            polygonCoordinates: {
                                required: false,
                                type: ()=>[
                                        [
                                            Number
                                        ]
                                    ]
                            },
                            yieldEstimateRaw: {
                                required: false,
                                type: ()=>Number
                            },
                            yieldEstimateProcessed: {
                                required: false,
                                type: ()=>Number
                            },
                            cultivationStartDate: {
                                required: false,
                                type: ()=>Date
                            },
                            registrationDate: {
                                required: false,
                                type: ()=>Date
                            },
                            lastChemicalUseDate: {
                                required: false,
                                type: ()=>Date
                            },
                            principalOwnsLand: {
                                required: false,
                                type: ()=>Boolean
                            },
                            principalLeasesLand: {
                                required: false,
                                type: ()=>Boolean
                            },
                            hasRightToLand: {
                                required: false,
                                type: ()=>Boolean
                            },
                            hasLandTitle: {
                                required: false,
                                type: ()=>Boolean
                            },
                            ownerName: {
                                required: false,
                                type: ()=>String
                            },
                            establishedBefore2020: {
                                required: false,
                                type: ()=>Boolean
                            },
                            hasShadeTrees: {
                                required: false,
                                type: ()=>Boolean
                            },
                            distanceToForestKnown: {
                                required: false,
                                type: ()=>Boolean
                            },
                            distanceToForest: {
                                required: false,
                                type: ()=>Number
                            },
                            traditionalOwnersPresent: {
                                required: false,
                                type: ()=>Boolean
                            },
                            areaSizeManual: {
                                required: false,
                                type: ()=>Number
                            },
                            areaSizeOrganicManual: {
                                required: false,
                                type: ()=>Number
                            },
                            interCropped: {
                                required: false,
                                type: ()=>Boolean
                            },
                            active: {
                                required: false,
                                type: ()=>Boolean
                            },
                            countItems: {
                                required: false,
                                type: ()=>[
                                        t["./farms/dto/farms.dto"].CountItemDto
                                    ]
                            }
                        },
                        "PlotDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                enum: t["./farms/models/plots.model"].PlotType
                            },
                            farmId: {
                                required: false,
                                type: ()=>String
                            },
                            farmCode: {
                                required: false,
                                type: ()=>String
                            },
                            status: {
                                required: false,
                                type: ()=>String
                            },
                            polygonSource: {
                                required: false,
                                enum: t["./farms/models/plots.model"].PlotCoordinateSources
                            },
                            polygonCoordinates: {
                                required: false,
                                type: ()=>[
                                        [
                                            Number
                                        ]
                                    ]
                            },
                            yieldEstimateRaw: {
                                required: false,
                                type: ()=>String
                            },
                            yieldEstimateProcessed: {
                                required: false,
                                type: ()=>Number
                            },
                            cultivationStartDate: {
                                required: false,
                                type: ()=>String
                            },
                            registrationDate: {
                                required: false,
                                type: ()=>String
                            },
                            lastChemicalUseDate: {
                                required: false,
                                type: ()=>String
                            },
                            principalOwnsLand: {
                                required: false,
                                type: ()=>Boolean
                            },
                            principalLeasesLand: {
                                required: false,
                                type: ()=>Boolean
                            },
                            hasRightToLand: {
                                required: false,
                                type: ()=>Boolean
                            },
                            hasLandTitle: {
                                required: false,
                                type: ()=>Boolean
                            },
                            ownerName: {
                                required: false,
                                type: ()=>String
                            },
                            establishedBefore2020: {
                                required: false,
                                type: ()=>Boolean
                            },
                            hasShadeTrees: {
                                required: false,
                                type: ()=>Boolean
                            },
                            distanceToForestKnown: {
                                required: false,
                                type: ()=>Boolean
                            },
                            distanceToForest: {
                                required: false,
                                type: ()=>Number
                            },
                            traditionalOwnersPresent: {
                                required: false,
                                type: ()=>Boolean
                            },
                            areaSizeManual: {
                                required: false,
                                type: ()=>String
                            },
                            areaSizeOrganicManual: {
                                required: false,
                                type: ()=>Number
                            },
                            interCropped: {
                                required: false,
                                type: ()=>String
                            },
                            active: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "PlotDtoConnected": {
                            farm: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./seasons/dto/seasons.dto"))),
                    {
                        "AbstractSeasonsDto": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "SeasonsDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            startsAt: {
                                required: true,
                                type: ()=>String
                            },
                            endsAt: {
                                required: false,
                                type: ()=>String
                            },
                            active: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "SeasonsDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            startsAt: {
                                required: true,
                                type: ()=>Date
                            },
                            endsAt: {
                                required: false,
                                type: ()=>Date
                            },
                            active: {
                                required: true,
                                type: ()=>Boolean
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./firestore/dto/firebase.query.dto"))),
                    {
                        "FieldTaskQuery": {
                            workspace: {
                                required: false,
                                type: ()=>String
                            },
                            collection: {
                                required: false,
                                type: ()=>String
                            },
                            tab: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./firestore/dto/firestore.user.dto"))),
                    {
                        "ReferenceIdDto": {
                            id: {
                                required: true,
                                type: ()=>String
                            },
                            refCollection: {
                                required: true,
                                type: ()=>String
                            },
                            isPreviousVersion: {
                                required: true,
                                type: ()=>Boolean
                            }
                        },
                        "FireStoreCreateUserDto": {
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            email: {
                                required: true,
                                type: ()=>String
                            },
                            password: {
                                required: true,
                                type: ()=>String
                            },
                            role: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "FireStoreUpdateUserDto": {
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            email: {
                                required: true,
                                type: ()=>String
                            },
                            role: {
                                required: true,
                                type: ()=>String
                            },
                            ids: {
                                required: true,
                                type: ()=>[
                                        Object
                                    ]
                            }
                        },
                        "FireStoreDeleteUsersDto": {
                            ids: {
                                required: true,
                                type: ()=>[
                                        Object
                                    ]
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./firestore/dto/firestore.organisations.filter.dto"))),
                    {
                        "FirestoreOrganisationFilter": {
                            name: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./firestore/dto/firestore.organisation.dto"))),
                    {
                        "FireStoreCreateUpdateOrganisationDto": {
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            userId: {
                                required: true,
                                type: ()=>String
                            },
                            isToAddWorkspaces: {
                                required: true,
                                type: ()=>Boolean
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./products/dto/products.dto"))),
                    {
                        "AbstractProduct": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "ProductDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            productTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            singleOrigin: {
                                required: true,
                                type: ()=>String
                            },
                            grade: {
                                required: true,
                                type: ()=>String
                            },
                            dry: {
                                required: true,
                                type: ()=>String
                            },
                            organic: {
                                required: true,
                                type: ()=>String
                            },
                            cropVarietyCodes: {
                                required: true,
                                type: ()=>String
                            },
                            originLocationCodes: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "ProductDto": {
                            productTypeId: {
                                required: true,
                                type: ()=>String
                            },
                            productTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            singleOrigin: {
                                required: false,
                                type: ()=>Boolean
                            },
                            grade: {
                                required: false,
                                type: ()=>Number
                            },
                            dry: {
                                required: false,
                                type: ()=>Boolean
                            },
                            organic: {
                                required: false,
                                type: ()=>Boolean
                            },
                            originVarietyIds: {
                                required: false,
                                type: ()=>[
                                        String
                                    ]
                            },
                            originVarietyId: {
                                required: true,
                                type: ()=>String
                            },
                            originLocationId: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "ProductDtoConnected": {
                            singleOrigin: {
                                required: true,
                                type: ()=>Boolean
                            },
                            productType: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            originVariety: {
                                required: false,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            originLocations: {
                                required: false,
                                type: ()=>({
                                        create: {
                                            required: true
                                        }
                                    })
                            },
                            originLocation: {
                                required: false,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        },
                        "AbstractProductTypeDto": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "ProductTypeDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            cropCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "ProductTypeDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            cropId: {
                                required: false,
                                type: ()=>String
                            },
                            cropCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "ProductTypeDtoConnected": {
                            crop: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        },
                        "AbstractPriceDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            unit: {
                                required: true,
                                type: ()=>String
                            },
                            perAmountUnit: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "PriceDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            amount: {
                                required: true,
                                type: ()=>String
                            },
                            perAmountAmount: {
                                required: true,
                                type: ()=>String
                            },
                            productCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "PriceDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            amount: {
                                required: true,
                                type: ()=>Number
                            },
                            perAmountAmount: {
                                required: true,
                                type: ()=>Number
                            },
                            productId: {
                                required: true,
                                type: ()=>String
                            },
                            productCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "PriceDtoConnected": {
                            active: {
                                required: true,
                                type: ()=>Boolean
                            },
                            product: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./certifications/dto/certifications.dto"))),
                    {
                        "CertificationTypeDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "AbstractCertificationsDto": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            status: {
                                required: true,
                                type: ()=>String
                            },
                            certificationTypeId: {
                                required: true,
                                type: ()=>String
                            },
                            certificationTypeCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CertificationsDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            startsAt: {
                                required: true,
                                type: ()=>Date
                            },
                            endsAt: {
                                required: false,
                                type: ()=>Date
                            },
                            farmId: {
                                required: false,
                                type: ()=>String
                            },
                            farmCode: {
                                required: false,
                                type: ()=>String
                            },
                            plotId: {
                                required: false,
                                type: ()=>String
                            },
                            plotCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "CertificationsDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            startsAt: {
                                required: true,
                                type: ()=>String
                            },
                            endsAt: {
                                required: false,
                                type: ()=>String
                            },
                            farmCode: {
                                required: false,
                                type: ()=>String
                            },
                            plotCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "CertificationsDtoConnected": {
                            farm: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            certificationType: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            plot: {
                                required: true,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./certifications/dto/certificationType.dto"))),
                    {
                        "AbstractCertificationType": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "CertificationTypeDto": {},
                        "CertificationTypeDtoCsv": {},
                        "CertificationsDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            certificationTypeId: {
                                required: true,
                                type: ()=>String
                            },
                            certificationTypeCode: {
                                required: true,
                                type: ()=>String
                            },
                            status: {
                                required: true,
                                type: ()=>String
                            },
                            startsAt: {
                                required: true,
                                type: ()=>Date
                            },
                            endsAt: {
                                required: false,
                                type: ()=>Date
                            },
                            farmId: {
                                required: true,
                                type: ()=>String
                            },
                            farmCode: {
                                required: true,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./vessels/dto/vessels.dto"))),
                    {
                        "AbstractVesselsDto": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            type: {
                                required: true,
                                type: ()=>String
                            },
                            subType: {
                                required: true,
                                type: ()=>String
                            },
                            description: {
                                required: false,
                                type: ()=>String,
                                nullable: true
                            }
                        },
                        "VesselsDtoCsv": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            permanent: {
                                required: false,
                                type: ()=>String
                            },
                            size: {
                                required: false,
                                type: ()=>String,
                                nullable: true
                            },
                            weight: {
                                required: false,
                                type: ()=>String,
                                nullable: true
                            },
                            plotCode: {
                                required: false,
                                type: ()=>String
                            },
                            facilityCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "VesselsDto": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            },
                            permanent: {
                                required: false,
                                type: ()=>Boolean
                            },
                            size: {
                                required: false,
                                type: ()=>Number,
                                nullable: true
                            },
                            weight: {
                                required: false,
                                type: ()=>Number,
                                nullable: true
                            },
                            plotId: {
                                required: false,
                                type: ()=>String
                            },
                            plotCode: {
                                required: false,
                                type: ()=>String
                            },
                            facilityId: {
                                required: false,
                                type: ()=>String
                            },
                            facilityCode: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "VesselsDtoConnected": {
                            plot: {
                                required: false,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            },
                            facility: {
                                required: false,
                                type: ()=>({
                                        connect: {
                                            required: true,
                                            type: ()=>({
                                                    id: {
                                                        required: true,
                                                        type: ()=>String
                                                    }
                                                })
                                        }
                                    })
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./rule/dto/rule.dto"))),
                    {
                        "CreateRuleDto": {
                            category: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            functionCode: {
                                required: true,
                                type: ()=>String
                            },
                            functionType: {
                                required: true,
                                type: ()=>Object
                            },
                            commonThreshold: {
                                required: true,
                                type: ()=>Number
                            },
                            countryAdjustments: {
                                required: false,
                                type: ()=>String
                            }
                        },
                        "UpdateRuleDto": {
                            category: {
                                required: false,
                                type: ()=>String
                            },
                            name: {
                                required: false,
                                type: ()=>String
                            },
                            functionCode: {
                                required: false,
                                type: ()=>String
                            },
                            commonThreshold: {
                                required: false,
                                type: ()=>Number
                            },
                            countryAdjustments: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./scoring/dto/scoring.dto"))),
                    {
                        "RunScoringDto": {
                            ruleIDs: {
                                required: true,
                                type: ()=>[
                                        String
                                    ]
                            },
                            farmID: {
                                required: true,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./lot/dto/lot.dto"))),
                    {
                        "LotsDtoCsv": {},
                        "LotsDto": {
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            organisation: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "LotsDtoConnected": {}
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./lot/dto/lots.filter.dto"))),
                    {
                        "LotsFilter": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            idCode: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./paymentTransaction/dto/paymentTransactions.dto"))),
                    {
                        "paymentTransactionsDtoCsv": {},
                        "paymentTransactionsDto": {
                            id: {
                                required: false,
                                type: ()=>String
                            },
                            organisation: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "paymentTransactionsDtoConnected": {
                            organisation: {
                                required: true,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./paymentTransaction/dto/paymentTransactions.filter.dto"))),
                    {
                        "PaymentTransactionsFilter": {
                            organisation: {
                                required: false,
                                type: ()=>String
                            },
                            name: {
                                required: false,
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./contracts/dto/contracts.dto"))),
                    {
                        "ContractValues": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            status: {
                                required: true,
                                type: ()=>String
                            },
                            startsAt: {
                                required: true,
                                type: ()=>Date
                            },
                            endsAt: {
                                required: true,
                                type: ()=>Date
                            },
                            farmId: {
                                required: true,
                                type: ()=>String
                            },
                            farmCode: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "ContractsDto": {
                            meta: {
                                required: true,
                                type: ()=>t["./common/models/firebase-metadata.model"].FirebaseMetaData
                            },
                            values: {
                                required: true,
                                type: ()=>t["./contracts/dto/contracts.dto"].ContractValues
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/dto/tags.dto"))),
                    {
                        "TagValues": {
                            shortCode: {
                                required: true,
                                type: ()=>String
                            },
                            name: {
                                required: true,
                                type: ()=>String
                            },
                            organisation: {
                                required: true,
                                type: ()=>String
                            }
                        },
                        "TagsDto": {
                            meta: {
                                required: true,
                                type: ()=>t["./common/models/firebase-metadata.model"].FirebaseMetaData
                            },
                            values: {
                                required: true,
                                type: ()=>t["./persons/dto/tags.dto"].TagValues
                            }
                        }
                    }
                ]
            ],
            "controllers": [
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./app.controller"))),
                    {
                        "AppController": {
                            "getHello": {
                                type: String
                            },
                            "getHelloName": {
                                type: String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./supportServices/supportService.controller"))),
                    {
                        "SupportServiceController": {
                            "postServiceCategoryType": {},
                            "getServiceCategoryTypes": {},
                            "getServiceCategoryType": {},
                            "updateServiceCategoryType": {},
                            "deleteServiceCategoryType": {},
                            "postServiceCategory": {
                                type: Object
                            },
                            "getServiceCategories": {},
                            "getServiceCategory": {
                                type: Object
                            },
                            "updateServiceCategory": {
                                type: Object
                            },
                            "deleteServiceCategory": {},
                            "getServiceActivities": {},
                            "getServiceActivity": {
                                type: Object
                            },
                            "postServiceActivity": {
                                type: Object
                            },
                            "updateServiceActivity": {
                                type: Object
                            },
                            "deleteServiceActivity": {},
                            "getServiceInputs": {},
                            "getServiceInputType": {
                                type: t["./supportServices/models/supportService.model"].SupportServiceInputType
                            },
                            "postServiceInputType": {
                                type: t["./supportServices/models/supportService.model"].SupportServiceInputType
                            },
                            "updateServiceInputType": {
                                type: t["./supportServices/models/supportService.model"].SupportServiceInputType
                            },
                            "deleteServiceInputType": {},
                            "getServiceActivityTypes": {},
                            "getServiceActivityType": {},
                            "postServiceActivityType": {},
                            "updateServiceActivityType": {},
                            "deleteServiceActivityType": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./crops/crops.controller"))),
                    {
                        "CropsController": {
                            "createCrop": {},
                            "updateCrop": {},
                            "deleteCrop": {},
                            "getCrop": {},
                            "getCrops": {},
                            "createCropVariety": {},
                            "updateCropVariety": {},
                            "deleteCropVariety": {},
                            "getCropVariety": {},
                            "getCropVarieties": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./geodatas/geodatas.controller"))),
                    {
                        "GeodatasController": {
                            "postGeoData": {
                                type: Object
                            },
                            "getVarieties": {},
                            "getGeoData": {
                                type: Object
                            },
                            "updateGeoData": {
                                type: Object
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./persons/persons.controller"))),
                    {
                        "PersonsController": {
                            "postPerson": {
                                type: Object
                            },
                            "getPersons": {},
                            "getPerson": {
                                type: Object
                            },
                            "getPersonsFilter": {
                                type: [
                                    Object
                                ]
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./changes/changes.controller"))),
                    {
                        "ChangesController": {
                            "createCrop": {
                                type: [
                                    Object
                                ]
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./facilities/facilities.controller"))),
                    {
                        "FacilitiesController": {
                            "createFacility": {
                                type: Object
                            },
                            "updateFacility": {
                                type: Object
                            },
                            "deleteFacility": {},
                            "getFacility": {
                                type: Object
                            },
                            "getFacilitys": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./tags/tags.controller"))),
                    {
                        "TagsController": {
                            "postTag": {},
                            "getVarieties": {},
                            "getTag": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./farms/farms.controller"))),
                    {
                        "FarmsController": {
                            "getPlotsCountItem": {
                                type: [
                                    Object
                                ]
                            },
                            "getCountItem": {
                                type: Object
                            },
                            "postPlot": {
                                type: Object
                            },
                            "autofixAndStore": {
                                type: [
                                    Object
                                ]
                            },
                            "getPlot": {
                                type: Object
                            },
                            "getVessels": {
                                type: [
                                    Object
                                ]
                            },
                            "postFarm": {
                                type: Object
                            },
                            "getFarmsOrg": {},
                            "getFarmsOrgMinimal": {},
                            "getFarmOrg": {
                                type: Object
                            },
                            "getFarmStats": {
                                type: Object
                            },
                            "getFarmSeasons": {
                                type: Object
                            },
                            "getFarmSeasonsHistory": {
                                type: Object
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./seasons/seasons.controller"))),
                    {
                        "SeasonsController": {
                            "createSeason": {},
                            "updateSeason": {},
                            "deleteSeason": {},
                            "getSeason": {},
                            "getSeasons": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./locations/locations.controller"))),
                    {
                        "LocationsController": {
                            "postLocation": {
                                type: Object
                            },
                            "updateLocation": {
                                type: Object
                            },
                            "getLocations": {},
                            "getLocationsForFilters": {
                                type: [
                                    Object
                                ]
                            },
                            "deleteLocation": {},
                            "getLocation": {
                                type: Object
                            },
                            "getLocationsByType": {
                                type: Object
                            },
                            "getLocationsFilter": {
                                type: [
                                    Object
                                ]
                            },
                            "getLocationsStats": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./firestore/firestore.controller"))),
                    {
                        "FirestoreController": {
                            "allowedOrgs": {
                                type: [
                                    String
                                ]
                            },
                            "postFarmInspectionResult": {
                                type: [
                                    Object
                                ]
                            },
                            "isAdmin": {
                                type: Boolean
                            },
                            "users": {},
                            "createUser": {},
                            "updateUser": {},
                            "removeUserFully": {
                                type: Object
                            },
                            "organizations": {},
                            "createOrganization": {},
                            "updateOrganization": {},
                            "resetPassword": {
                                type: Object
                            },
                            "updateUsername": {},
                            "deleteDocument": {},
                            "getPaginatedDocuments": {},
                            "getDocument": {
                                type: Object
                            },
                            "createDocument": {
                                type: String
                            },
                            "updateDocument": {},
                            "getWorkspacesAndCollections": {},
                            "getCollectionColumns": {},
                            "getOrganisationConfig": {
                                type: t["./firestore/entities/org/OrganisationConfiguration"].default
                            },
                            "updateOrgConfigLocality": {},
                            "getAllWorkSpacesByOrganisationId": {
                                type: [
                                    Object
                                ]
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./products/products.controller"))),
                    {
                        "ProductsController": {
                            "createProduct": {
                                type: Object
                            },
                            "updateProduct": {
                                type: Object
                            },
                            "deleteProduct": {},
                            "getProduct": {
                                type: Object
                            },
                            "getProducts": {},
                            "getProductType": {},
                            "createProductType": {},
                            "updateProductType": {},
                            "deleteProductType": {},
                            "getProductTypes": {},
                            "createPrice": {},
                            "updatePrice": {},
                            "deletePrice": {},
                            "getPrice": {},
                            "getPrices": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./certifications/certifications.controller"))),
                    {
                        "CertificationsController": {
                            "getAllCertificateType": {},
                            "getCertificateType": {},
                            "createCertificateType": {},
                            "deleteCertificateType": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./vessels/vessels.controller"))),
                    {
                        "VesselsController": {
                            "createVessel": {},
                            "updateVessel": {},
                            "deleteVessel": {},
                            "getVessel": {},
                            "getVessels": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./filters/filters.controller"))),
                    {
                        "FiltersController": {
                            "getFilters": {
                                type: [
                                    Object
                                ]
                            },
                            "getOrgFilters": {
                                type: [
                                    Object
                                ]
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./scoring/scoring.controller"))),
                    {
                        "ScoringController": {
                            "getScoringResultsByScoringId": {},
                            "runScoring": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./externalScheduler/externalScheduler.controller"))),
                    {
                        "ExternalSchedulerController": {
                            "runScheduler": {
                                type: Boolean
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./geocledian/geocledian.controller"))),
                    {
                        "GeocledianController": {
                            "startSatelliteAnalysisForFarm": {},
                            "getRiskAnalysisResultForPlot": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./dataImports/data-import.controller"))),
                    {
                        "DataImportController": {
                            "importData": {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./lot/lots.controller"))),
                    {
                        "LotsController": {
                            "getLots": {},
                            "getLot": {
                                type: Object
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./paymentTransaction/paymentTransactions.controller"))),
                    {
                        "PaymentTransactionsController": {
                            "getPaymentTransactions": {},
                            "getLot": {
                                type: Object
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./contracts/contracts.controller"))),
                    {
                        "ContractsController": {
                            "postContract": {},
                            "getVarieties": {},
                            "getContract": {}
                        }
                    }
                ]
            ]
        },
        "@nestjs/graphql/plugin": {
            "models": [
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./auth/dto/signup.input"))),
                    {
                        "SignupInput": {
                            email: {},
                            password: {},
                            firstname: {
                                nullable: true
                            },
                            lastname: {
                                nullable: true
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./auth/models/token.model"))),
                    {
                        "Token": {
                            accessToken: {},
                            refreshToken: {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./common/models/base.graphql.model"))),
                    {
                        "BaseGraphqlModel": {
                            id: {},
                            createdAt: {},
                            updatedAt: {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./posts/models/post.model"))),
                    {
                        "Post": {
                            title: {},
                            content: {
                                nullable: true
                            },
                            published: {},
                            author: {
                                nullable: true
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./users/models/user.model"))),
                    {
                        "User": {
                            picture: {
                                type: ()=>String
                            },
                            type: {
                                type: ()=>t["./users/models/user.model"].UserType
                            },
                            phone: {
                                type: ()=>String
                            },
                            phone2: {
                                type: ()=>String
                            },
                            name: {
                                type: ()=>String
                            },
                            nickName: {
                                type: ()=>String
                            },
                            gender: {
                                type: ()=>t["./users/models/user.model"].Gender
                            },
                            dob: {
                                type: ()=>Date
                            },
                            dobApproximate: {
                                type: ()=>Boolean
                            },
                            identificationNumber: {
                                type: ()=>String
                            },
                            identificationNumberType: {
                                type: ()=>String
                            },
                            education: {
                                type: ()=>String
                            },
                            maritalStatus: {
                                type: ()=>String
                            },
                            email: {},
                            firstName: {
                                nullable: true
                            },
                            lastName: {
                                nullable: true
                            },
                            role: {},
                            posts: {
                                nullable: true
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./auth/models/auth.model"))),
                    {
                        "Auth": {
                            user: {
                                type: ()=>t["./users/models/user.model"].User
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./auth/dto/login.input"))),
                    {
                        "LoginInput": {
                            email: {},
                            password: {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./auth/dto/refresh-token.input"))),
                    {
                        "RefreshTokenInput": {
                            token: {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./users/dto/change-password.input"))),
                    {
                        "ChangePasswordInput": {
                            oldPassword: {},
                            newPassword: {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./users/dto/update-user.input"))),
                    {
                        "UpdateUserInput": {
                            firstname: {
                                nullable: true
                            },
                            lastname: {
                                nullable: true
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./common/pagination/pagination.args"))),
                    {
                        "PaginationArgs": {
                            skip: {
                                nullable: true,
                                type: ()=>Number
                            },
                            after: {
                                nullable: true,
                                type: ()=>String
                            },
                            before: {
                                nullable: true,
                                type: ()=>String
                            },
                            first: {
                                nullable: true,
                                type: ()=>Number
                            },
                            last: {
                                nullable: true,
                                type: ()=>Number
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./posts/args/post-id.args"))),
                    {
                        "PostIdArgs": {
                            postId: {
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./posts/args/user-id.args"))),
                    {
                        "UserIdArgs": {
                            userId: {
                                type: ()=>String
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./common/pagination/page-info.model"))),
                    {
                        "PageInfo": {
                            endCursor: {
                                nullable: true
                            },
                            hasNextPage: {},
                            hasPreviousPage: {},
                            startCursor: {
                                nullable: true
                            }
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./posts/models/post-connection.model"))),
                    {
                        "PostConnection": {}
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./posts/dto/post-order.input"))),
                    {
                        "PostOrder": {
                            field: {}
                        }
                    }
                ],
                [
                    Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./posts/dto/createPost.input"))),
                    {
                        "CreatePostInput": {
                            content: {},
                            title: {}
                        }
                    }
                ]
            ]
        }
    };
};
