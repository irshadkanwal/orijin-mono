"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _client = require("@prisma/client");
const _locationsservice = require("../../locations/locations.service");
const walletWithRelations = _client.Prisma.validator()({
    include: {
        contact: true
    }
});
const contactWithRelations = _client.Prisma.validator()({
    include: {
        wallets: true
    }
});
const personWithRelations = _client.Prisma.validator()({
    include: {
        contacts: {
            include: {
                wallets: true
            }
        },
        mainContactPersonFor: {
            include: {
                location: {
                    include: {
                        ..._locationsservice.locationParentInclude
                    }
                },
                customLocation: {
                    include: {
                        ..._locationsservice.locationParentInclude
                    }
                },
                coordinate: true
            }
        }
    }
});
const personWithActivities = _client.Prisma.validator()({
    include: {
        mainContactPersonFor: true,
        ServiceActivityBeneficiaries: true
    }
});
