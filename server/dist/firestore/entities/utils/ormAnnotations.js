"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getCascadingDeletes", {
    enumerable: true,
    get: function() {
        return getCascadingDeletes;
    }
});
const cascadingDeleteKey = 'cascadingDelete';
function getCascadingDeletes(target, propertyKey) {
    return Reflect.getMetadata(cascadingDeleteKey, target, propertyKey);
}
