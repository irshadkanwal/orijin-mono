/**
 * Await whole object for all properties of object to execute, returns new object with all properties
 *
 * Usage: (await promiseObject({ property: Promise.resolve(value) })).property === value
 **/ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "promiseObject", {
    enumerable: true,
    get: function() {
        return promiseObject;
    }
});
const promiseObject = async (obj)=>{
    const keys = Object.keys(obj);
    const values = await Promise.all(Object.values(obj));
    const newObj = {};
    return keys.reduce((obj, key, index)=>{
        obj[key] = values[index];
        return obj;
    }, newObj);
};
