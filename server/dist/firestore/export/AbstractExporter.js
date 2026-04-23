"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AbstractExporter", {
    enumerable: true,
    get: function() {
        return AbstractExporter;
    }
});
let AbstractExporter = class AbstractExporter {
    async upsert(input) {
        await this.firestoreService.upsert(input);
        return input;
    }
    async onlyCreate(input) {
        await this.firestoreService.onlyCreate(input);
        return input;
    }
    async getMany(organisation) {
        const inputs = await this.v2Service.getMany({
            organisation
        });
        return inputs.data;
    }
    async exportAll(meta, key) {
        console.log('Exporting ' + key);
        const inputs = await this.getMany(meta.organisation);
        // console.log('inputs', inputs);
        const transformed = await Promise.all(inputs.map((s)=>this.transform(s, meta)));
        // console.log('transformed', transformed);
        if (meta.onlyCreate) {
            const upserted = await Promise.all(transformed.map((a)=>this.onlyCreate(a)));
            // console.log('upserted', upserted);
            console.log('Exporting Done ' + key);
            return upserted;
        } else {
            const upserted = await Promise.all(transformed.map((a)=>this.upsert(a)));
            // console.log('upserted', upserted);
            console.log('Exporting Done ' + key);
            return upserted;
        }
        const upserted = await Promise.all(transformed.map((a)=>this.upsert(a)));
        // console.log('upserted', upserted);
        console.log('Exporting Done ' + key);
        return upserted;
    }
    async exportOne(id, meta) {
        const input = await this.v2Service.getOne({
            id,
            org: meta.organisation
        });
        const transformed = await this.transform(input, meta);
        const res = await this.upsert(transformed);
        return res;
    }
    constructor(firestoreService, v2Service){
        this.firestoreService = firestoreService;
        this.v2Service = v2Service;
    }
};
