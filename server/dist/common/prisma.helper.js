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
    FilterType: function() {
        return FilterType;
    },
    addPagination: function() {
        return addPagination;
    },
    applyFilters: function() {
        return applyFilters;
    },
    filterMetadataMap: function() {
        return filterMetadataMap;
    },
    getFilterMetadata: function() {
        return getFilterMetadata;
    },
    parseFilters: function() {
        return parseFilters;
    }
});
require("reflect-metadata");
const filterMetadataMap = new Map(); // Map className to properties and types
function FilterType(type, placeholder, label) {
    return (target, propertyKey)=>{
        const className = target.constructor.name;
        if (!filterMetadataMap.has(className)) {
            filterMetadataMap.set(className, new Map());
        }
        const classMetadata = filterMetadataMap.get(className);
        classMetadata.set(String(propertyKey), {
            type,
            placeholder,
            label
        });
    // console.log(`Filter metadata ${className}.${String(propertyKey)}: ${type}`);
    };
}
function getFilterMetadata(className) {
    return filterMetadataMap.get(className);
}
const applyFilters = (filters, where)=>{
    const proto = Object.getPrototypeOf(filters);
    Object.keys(filters).forEach((key)=>{
        const value = filters[key];
        console.log('one filter', value);
        if (value !== undefined) {
            try {
                const filterType = Reflect.getMetadata('filterType', proto, key);
                console.log('Filter Type:', filterType);
                switch(filterType){
                    case 'relation':
                        where[key] = value;
                        break;
                    case 'string':
                        where[key] = {
                            contains: value,
                            mode: 'insensitive'
                        };
                        break;
                    case 'equals':
                    default:
                        where[key] = value;
                        break;
                }
            } catch (err) {
                console.error('Error applying filter', err);
            }
        }
    });
    console.log({
        from: filters,
        to: where
    });
    return where;
};
const addPagination = (filterWithPagination)=>{
    const { limit, page } = filterWithPagination;
    const limitNumber = parseInt(limit) ?? 20;
    const pageNumber = parseInt(page);
    const take = !isNaN(limitNumber) ? limitNumber : undefined;
    const skip = take && pageNumber && !isNaN(pageNumber) ? (pageNumber - 1) * limitNumber : 0;
    // TODO: Add total counts & total pages
    // https://medium.com/@flavionobre11/simple-pagination-with-prisma-and-typescript-23be77762ba3
    // https://www.prisma.io/docs/orm/prisma-client/queries/pagination
    return {
        skip,
        take
    };
};
function parseFilters(filters) {
    const { page, limit, sort, sortOrder, ...filterFields } = filters;
    return {
        pagination: {
            page,
            limit
        },
        sorting: {
            sort,
            sortOrder
        },
        filters: filterFields
    };
}
