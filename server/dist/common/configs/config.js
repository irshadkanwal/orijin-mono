"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const config = {
    nest: {
        port: 3000
    },
    cors: {
        enabled: true
    },
    swagger: {
        enabled: true,
        title: 'Nestjs FTW',
        description: 'The nestjs API description',
        version: '1.5',
        path: 'api'
    },
    graphql: {
        playgroundEnabled: true,
        debug: true,
        schemaDestination: './src/schema.graphql',
        sortSchema: true
    },
    security: {
        expiresIn: '2m',
        refreshIn: '7d',
        bcryptSaltOrRound: 10
    }
};
const _default = ()=>config;
