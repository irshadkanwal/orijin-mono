"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getValidationPipeWithMessages", {
    enumerable: true,
    get: function() {
        return getValidationPipeWithMessages;
    }
});
const _common = require("@nestjs/common");
const getValidationPipeWithMessages = ()=>{
    return new _common.ValidationPipe({
        // transform: true,
        exceptionFactory: (errors)=>{
            const messages = errors.map((error)=>{
                if (error.children.length > 0) {
                    console.log(error);
                    return error.children.map((childError)=>({
                            property: error.property + '.' + childError.property,
                            constraints: childError.constraints
                        }));
                }
                return {
                    property: error.property,
                    constraints: error.constraints
                };
            });
            // console.log('Message', JSON.stringify(messages, null, 4));
            return new _common.BadRequestException(messages);
        }
    });
};
