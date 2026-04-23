"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedFacilities", {
    enumerable: true,
    get: function() {
        return seedFacilities;
    }
});
const _client = require("@prisma/client");
const _chance = require("chance");
const prisma = new _client.PrismaClient();
const chance = new _chance.Chance();
const generateUniqueShortCode = async (prefix, prisma, organisation)=>{
    let shortCode;
    let isUnique = false;
    while(!isUnique){
        // Generate a short code
        const guid = chance.guid().replace(/-/g, '');
        shortCode = `${prefix}-${guid.slice(0, 3)}`;
        // Check if it already exists
        const existingFacility = await prisma.facility.findFirst({
            where: {
                shortCode,
                organisation
            }
        });
        if (!existingFacility) {
            isUnique = true;
        }
    }
    return shortCode;
};
const createFacility = async (index, organisation)=>{
    const shortCode = await generateUniqueShortCode("VSL", prisma, organisation);
    await prisma.facility.create({
        data: {
            shortCode: `FAC-${String(index).padStart(3, '0')}`,
            organisation,
            name: chance.name(),
            type: chance.pickone([
                'Other'
            ]),
            areaTotalManual: chance.floating({
                min: 100,
                max: 10000,
                fixed: 2
            }),
            address: {
                street: chance.address(),
                city: chance.city(),
                postalCode: chance.zip(),
                country: chance.country()
            },
            locationId: null,
            customLocationId: null,
            coordinateId: null,
            mainContactPersonId: null,
            countryIso: chance.country({
                full: true
            }),
            timezone: chance.pickone([
                "America/New_York",
                "Europe/London"
            ]),
            // Optional fields
            tags: {
                create: [
                    {
                        name: `Tag-${chance.word()}`,
                        organisation
                    },
                    {
                        name: `Tag-${chance.word()}`,
                        organisation
                    }
                ]
            },
            vessles: {
                create: [
                    {
                        shortCode: shortCode,
                        name: chance.name(),
                        type: 'TypeA',
                        organisation,
                        subType: ''
                    }
                ]
            }
        }
    });
};
const seedFacilities = async (organisation)=>{
    console.log('Seeding facilities...');
    // Create a number of facilities, adjust count as needed
    for(let i = 1; i <= 10; i++){
        await createFacility(i, organisation);
    }
    console.log('Facilities seeded successfully.');
};
