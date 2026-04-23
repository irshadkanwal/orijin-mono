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
    applyFiltersToQuery: function() {
        return applyFiltersToQuery;
    },
    applyPaginationToQuery: function() {
        return applyPaginationToQuery;
    },
    applySortingToQuery: function() {
        return applySortingToQuery;
    },
    getCollectionDisplayDefinitionWithName: function() {
        return getCollectionDisplayDefinitionWithName;
    }
});
const _displaydef = require("../common/displaydef");
const getCollectionDisplayDefinitionWithName = (collectionName)=>{
    const collection = Object.keys(_displaydef.DISPLAY_DEF.displayDefs).find((key)=>_displaydef.DISPLAY_DEF.displayDefs[key].source === collectionName);
    return collection ? _displaydef.DISPLAY_DEF.displayDefs[collection] : null;
};
const applyFiltersToQuery = (query, collection, filterParams)=>{
    const collectionData = getCollectionDisplayDefinitionWithName(collection);
    const columns = collectionData ? collectionData.columns : [];
    if (filterParams && columns.length) {
        Object.entries(filterParams).forEach(([filterKey, filterValue])=>{
            const matchingColumn = columns.find((col)=>col.title === filterKey && col.filtering);
            if (matchingColumn) {
                //.value is   actual path of the field in Firestore document (e.g. 'properties.location.label')
                const fieldPath = matchingColumn.value;
                query = query.where(fieldPath, '==', filterValue);
            }
        });
    }
    return query;
};
const applySortingToQuery = (query, sort, sortOrder)=>{
    const sortFields = sort ? sort.split(',') : [];
    const sortOrderValues = sortOrder ? sortOrder.split(',') : [];
    if (sortFields.length && sortOrderValues.length) {
        sortFields.forEach((field, index)=>{
            query = query.orderBy(field, sortOrderValues[index]);
        });
    } else {
        query = query.orderBy('__name__'); // Default sort by document ID
    }
    return query;
};
const applyPaginationToQuery = (query, page, pageSize)=>{
    const offset = (page - 1) * pageSize;
    query = query.limit(pageSize).offset(offset);
    return query;
};
