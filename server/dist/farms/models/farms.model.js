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
    CertificationStatus: function() {
        return CertificationStatus;
    },
    CountCategory: function() {
        return CountCategory;
    },
    CountSubType: function() {
        return CountSubType;
    },
    CountType: function() {
        return CountType;
    },
    CreationStatus: function() {
        return CreationStatus;
    },
    ReviewStatus: function() {
        return ReviewStatus;
    }
});
const _client = require("@prisma/client");
var ReviewStatus;
(function(ReviewStatus) {
    ReviewStatus["NeedsReview"] = "NeedsReview";
    ReviewStatus["InReview"] = "InReview";
    ReviewStatus["Rejected"] = "Rejected";
    ReviewStatus["Approved"] = "Approved";
    ReviewStatus["TentativelyApproved"] = "TentativelyApproved";
    ReviewStatus["ApprovedWithConditions"] = "ApprovedWithConditions";
})(ReviewStatus || (ReviewStatus = {}));
var CertificationStatus;
(function(CertificationStatus) {
    CertificationStatus["Certified"] = "Certified";
    CertificationStatus["New"] = "New";
    CertificationStatus["NotCertified"] = "NotCertified";
    CertificationStatus["InTransition"] = "InTransition";
    CertificationStatus["NeverCertified"] = "NeverCertified";
    CertificationStatus["Expelled"] = "Expelled";
    CertificationStatus["Suspended"] = "Suspended";
    CertificationStatus["Sanctioned"] = "Sanctioned";
})(CertificationStatus || (CertificationStatus = {}));
var CreationStatus;
(function(CreationStatus) {
    CreationStatus["DataImport"] = "DataImport";
    CreationStatus["ByUser"] = "ByUser";
    CreationStatus["InBuying"] = "InBuying";
})(CreationStatus || (CreationStatus = {}));
const farmWithRelations = _client.Prisma.validator()({
    include: {
        facility: true,
        plots: true
    }
});
var CountType;
(function(CountType) {
    CountType["MainCrop"] = "MainCrop";
    CountType["Shade"] = "Shade";
    CountType["Goat"] = "Goat";
    CountType["Cow"] = "Cow";
    CountType["Chicken"] = "Chicken";
})(CountType || (CountType = {}));
var CountSubType;
(function(CountSubType) {
    CountSubType["Productive"] = "Productive";
    CountSubType["Young"] = "Young";
    CountSubType["Stumped"] = "Stumped";
})(CountSubType || (CountSubType = {}));
var CountCategory;
(function(CountCategory) {
    CountCategory["Plant"] = "Plant";
    CountCategory["Animal"] = "Animal";
})(CountCategory || (CountCategory = {}));
