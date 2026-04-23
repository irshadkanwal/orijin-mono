"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    emptyDatabase: function() {
        return emptyDatabase;
    },
    mainSeed: function() {
        return mainSeed;
    }
});
const _client = require("@prisma/client");
const _seedVarieties = require("./seedVarieties");
const _seedUsers = require("./seedUsers");
const _seedFarms = require("./seedFarms");
const _seedLocations = require("./seedLocations");
const _seedServices = require("./seedServices");
const _seedSurvey = require("./seedSurvey");
const _seedSeasons = require("./seedSeasons");
const _seedProducts = require("./seedProducts");
const _seedCertificationTypes = require("./seedCertificationTypes");
const _seedVessels = require("./seedVessels");
const _seedFacilities = require("./seedFacilities");
const prisma = new _client.PrismaClient();
async function mainSeed(farmsService, farmInspectionService) {
    await emptyDatabase(prisma);
    const { user2 } = await (0, _seedUsers.seedUsers)(prisma);
    await seedOneOrganisation('seed', farmsService, farmInspectionService, user2);
    console.log('Seed done!');
}
const seedOneOrganisation = async (organisation, farmsService, farmInspectionService, user)=>{
    // Only for local devel purposes! Uncomment and run locally as needed - live DB won't need any seeds
    await (0, _seedSeasons.seedSeasons)(prisma, organisation);
    const varieties = await (0, _seedVarieties.seedVarieties)(prisma, organisation);
    const locations = await (0, _seedLocations.seedLocations)(prisma, organisation);
    const certificationtypes = await (0, _seedCertificationTypes.seedCertificationTypes)(prisma, organisation);
    await (0, _seedProducts.seedProducts)(varieties, prisma, organisation, locations.global);
    await (0, _seedFarms.seedFarms)(farmsService, farmInspectionService, locations.global, locations.custom, certificationtypes, prisma, organisation);
    await (0, _seedServices.seedServices)(prisma, locations.global, organisation);
    await (0, _seedSurvey.seedSurvey)(prisma, user, farmsService, organisation);
    await (0, _seedVessels.seedVessels)(prisma, organisation);
    await (0, _seedFacilities.seedFacilities)(organisation);
};
const emptyDatabase = async (prismaService)=>{
    await prismaService.change.deleteMany();
    await prismaService.surveyAnswer.deleteMany();
    await prismaService.surveyResult.deleteMany();
    await prismaService.surveyQuestion.deleteMany();
    await prismaService.survey.deleteMany();
    await prismaService.certification.deleteMany();
    await prismaService.satelliteAnalysis.deleteMany();
    await prismaService.polygonInteractionWarning.deleteMany();
    await prismaService.polygonWarning.deleteMany();
    await prismaService.polygon.deleteMany();
    await prismaService.plot.deleteMany();
    await prismaService.farm.deleteMany();
    await prismaService.facility.deleteMany();
    await prismaService.season.deleteMany();
    await prismaService.price.deleteMany();
    await prismaService.product.deleteMany();
    await prismaService.productType.deleteMany();
    await prismaService.cropVariety.deleteMany();
    await prismaService.serviceActivityBeneficiaries.deleteMany();
    await prismaService.serviceActivityLocation.deleteMany();
    await prismaService.supportingServiceActivity.deleteMany();
    await prismaService.supportingServiceInputType.deleteMany();
    await prismaService.supportingServiceActivityType.deleteMany();
    await prismaService.supportingServiceCategory.deleteMany();
    await prismaService.supportingServiceCategoryType.deleteMany();
    await prismaService.wallet.deleteMany();
    await prismaService.contact.deleteMany();
    await prismaService.certificationType.deleteMany();
    await prismaService.person.deleteMany();
    await prismaService.crop.deleteMany();
    await prismaService.location.deleteMany();
    await prismaService.rule.deleteMany();
    await prismaService.scoringResult.deleteMany();
    await prismaService.jsonPayload.deleteMany();
    await prismaService.vessel.deleteMany();
};
