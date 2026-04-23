"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedCertificationTypes", {
    enumerable: true,
    get: function() {
        return seedCertificationTypes;
    }
});
const seedCertificationTypes = async (prisma, organisation)=>{
    const organic = await prisma.certificationType.create({
        data: {
            shortCode: 'EC',
            name: 'Organic EU',
            organisation
        }
    });
    const fairtrade = await prisma.certificationType.create({
        data: {
            shortCode: 'FT',
            name: 'Fair Trade',
            organisation
        }
    });
    const rainforest = await prisma.certificationType.create({
        data: {
            shortCode: 'RFA',
            name: 'Rain Forest Alliance',
            organisation
        }
    });
    return [
        organic,
        fairtrade,
        rainforest
    ];
};
