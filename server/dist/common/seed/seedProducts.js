"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedProducts", {
    enumerable: true,
    get: function() {
        return seedProducts;
    }
});
const seedProducts = async (varieties, prisma, organisation, locations)=>{
    const cherryCoffee = await prisma.productType.create({
        data: {
            shortCode: 'CCO',
            name: 'Cherry Coffee',
            organisation
        }
    });
    const parchmentCoffee = await prisma.productType.create({
        data: {
            shortCode: 'PCO',
            name: 'Parchment Coffee',
            organisation
        }
    });
    const freshCocoa = await prisma.productType.create({
        data: {
            shortCode: 'FC',
            name: 'Fresh Cocoa',
            organisation
        }
    });
    const dryCocoa = await prisma.productType.create({
        data: {
            shortCode: 'DC',
            name: 'Dry Cocoa',
            organisation
        }
    });
    const cherryCoffeeInDBG = await prisma.product.create({
        data: {
            shortCode: 'O-CCO-BDG',
            name: 'Cherry Coffee in BDG',
            organic: true,
            productType: {
                connect: {
                    id: cherryCoffee.id
                }
            },
            originVariety: {
                connect: {
                    id: varieties[1].id
                }
            },
            originLocation: {
                connect: {
                    id: locations[0].id
                }
            },
            singleOrigin: true,
            organisation
        }
    });
    const freshCocoaInBDG = await prisma.product.create({
        data: {
            shortCode: 'O-FC-BDG',
            name: 'Organic Fresh Cocoa BDG',
            organic: true,
            productType: {
                connect: {
                    id: freshCocoa.id
                }
            },
            originVariety: {
                connect: {
                    id: varieties[0].id
                }
            },
            originLocation: {
                connect: {
                    id: locations[0].id
                }
            },
            singleOrigin: true,
            organisation
        }
    });
    const parchmentCocoaInBDG = await prisma.product.create({
        data: {
            shortCode: 'O-PCO-BDG',
            name: 'Organic Parchment Coffee BDG',
            organic: true,
            dry: true,
            productType: {
                connect: {
                    id: parchmentCoffee.id
                }
            },
            originVariety: {
                connect: {
                    id: varieties[1].id
                }
            },
            originLocation: {
                connect: {
                    id: locations[0].id
                }
            },
            singleOrigin: true,
            organisation
        }
    });
    const dryCocoaInBDG = await prisma.product.create({
        data: {
            shortCode: 'O-DC-BDG',
            name: 'Organic Dry Cocoa BDG',
            organic: true,
            dry: true,
            productType: {
                connect: {
                    id: dryCocoa.id
                }
            },
            originVariety: {
                connect: {
                    id: varieties[0].id
                }
            },
            originLocation: {
                connect: {
                    id: locations[0].id
                }
            },
            singleOrigin: true,
            organisation
        }
    });
    const freshCocoaInBDGPrice = await prisma.price.create({
        data: {
            amount: 11,
            perAmountAmount: 1,
            perAmountUnit: 'kg',
            unit: 'ugx',
            productId: freshCocoaInBDG.id,
            organisation
        }
    });
};
