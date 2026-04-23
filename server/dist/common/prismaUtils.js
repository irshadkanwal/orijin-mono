"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setupDependencyBasedOnShortCodeOrId", {
    enumerable: true,
    get: function() {
        return setupDependencyBasedOnShortCodeOrId;
    }
});
const _AbstractService = require("./service/AbstractService");
async function setupDependencyBasedOnShortCodeOrId(name, findManyPrismaDelegate, code, id, organisation, mandatory, isUpdate, updateData) {
    let returnId = undefined;
    const idKey = name + 'Id';
    const codeKey = name + 'Code';
    delete updateData[idKey];
    delete updateData[codeKey];
    delete updateData[name];
    if (!(0, _AbstractService.isValidImportString)(id) && !(0, _AbstractService.isValidImportString)(code)) {
        if (mandatory) {
            throw new Error(name + ' mandatory dep but nothing provided ' + (id || code));
        }
    } else {
        const items = await findManyPrismaDelegate.findMany({
            where: {
                AND: [
                    {
                        organisation: organisation
                    },
                    {
                        OR: [
                            {
                                id: id
                            },
                            {
                                shortCode: code
                            }
                        ]
                    }
                ]
            }
        });
        if (mandatory) {
            if (items.length !== 1) {
                console.error(name + ' not found for code/id: ' + (id || code), items);
                throw new Error(name + ' not found for code/id: ' + (id || code));
            }
        }
        if (items.length > 0) {
            returnId = items[0].id;
        }
    }
    if (isUpdate) {
        updateData[idKey] = returnId;
        updateData[name] = undefined;
    } else {
        updateData[idKey] = undefined;
        if (returnId) {
            updateData[name] = {
                connect: {
                    id: returnId
                }
            };
        }
    }
}
