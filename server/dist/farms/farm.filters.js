"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FarmFilters", {
    enumerable: true,
    get: function() {
        return FarmFilters;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FarmFilters = class FarmFilters {
    addLocationFilters(filters, where, fieldName) {
        if (filters[fieldName]) {
            const nameEqualsFilter = (location)=>({
                    OR: [
                        {
                            name: {
                                equals: location,
                                mode: 'insensitive'
                            }
                        },
                        {
                            shortCode: {
                                equals: location,
                                mode: 'insensitive'
                            }
                        }
                    ]
                });
            const districts = decodeURIComponent(filters[fieldName]).split(',');
            where.facility.AND.push({
                OR: districts.map((location)=>({
                        OR: [
                            {
                                [fieldName]: nameEqualsFilter(location)
                            },
                            {
                                [fieldName]: {
                                    parent: nameEqualsFilter(location)
                                }
                            },
                            {
                                [fieldName]: {
                                    parent: {
                                        parent: nameEqualsFilter(location)
                                    }
                                }
                            },
                            {
                                [fieldName]: {
                                    parent: {
                                        parent: {
                                            parent: nameEqualsFilter(location)
                                        }
                                    }
                                }
                            }
                        ]
                    }))
            });
        }
        return where;
    }
};
FarmFilters = _ts_decorate([
    (0, _common.Injectable)()
], FarmFilters);
