"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedVessels", {
    enumerable: true,
    get: function() {
        return seedVessels;
    }
});
const _chance = require("chance");
const chance = new _chance.Chance();
const createVessel = async (index, organisation, prisma)=>{
    await prisma.vessel.create({
        data: {
            shortCode: `VSL-${String(index).padStart(3, '0')}`,
            organisation,
            name: chance.name(),
            type: chance.pickone([
                'TypeA',
                'TypeB',
                'TypeC'
            ]),
            subType: chance.pickone([
                'SubType1',
                'SubType2'
            ]),
            description: chance.sentence({
                words: 5
            }),
            permanent: chance.bool(),
            size: chance.floating({
                min: 1,
                max: 1000,
                fixed: 2
            }),
            weight: chance.floating({
                min: 1,
                max: 5000,
                fixed: 2
            }),
            // Optional fields
            facilityId: null,
            plotId: null
        }
    });
};
const seedVessels = async (prisma, organisation)=>{
    console.log('Seeding vessels...');
    // Create a number of vessels, adjust count as needed
    for(let i = 1; i <= 10; i++){
        await createVessel(i, organisation, prisma);
    }
    console.log('Vessels seeded successfully.');
};
