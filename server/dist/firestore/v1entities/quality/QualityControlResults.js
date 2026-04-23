"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return QualityControlResults;
    }
});
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _types = require("../utis/types");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _mathjs = require("mathjs");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let QualityControlResults = class QualityControlResults extends _AbstractEntity.AbstractEntity {
    addActivityCompletion(activityCompletion) {
        this.activityCompletions.push(activityCompletion.id);
        this.activityCompletionsFull.push(activityCompletion);
    }
    getCollection() {
        return _dbMappingUtils.collectionKeys.qualitycontrolresults;
    }
    calculateScores(sheetDef) {
        this.totalScore = this.calculateAverageScoreAndVariations(this.submissionsFull.map((s)=>s.score));
        this.summary = {
            itemSummary: [],
            notes: []
        };
        const totalDescriptors = [];
        for (const variable of sheetDef.scoreVariables){
            const allItems = this.submissionsFull.flatMap((s)=>s.submissions.find((ss)=>ss.name === variable.name)).filter((item)=>item != null);
            const allDescriptors = [];
            const allNotes = [];
            for (const item of allItems){
                if (item) {
                    if (item.note) {
                        allNotes.push(item.note);
                    }
                    if (item.descriptors == null || item.descriptors.length === 0) {} else {
                        for (const d of item.descriptors){
                            const found = allDescriptors.find((f)=>f.name === d.flavor);
                            const foundTotal = totalDescriptors.find((f)=>f.name === d.flavor);
                            if (found) {
                                found.count = found.count + 1;
                            } else {
                                allDescriptors.push({
                                    name: d.flavor,
                                    count: 1
                                });
                            }
                            if (foundTotal) {
                                foundTotal.count = foundTotal.count + 1;
                            } else {
                                totalDescriptors.push({
                                    name: d.flavor,
                                    count: 1
                                });
                            }
                        }
                    }
                }
            }
            const ss = {
                label: variable.name,
                intensity: this.calculateAverageScoreAndVariations(allItems.map((s)=>s.intensity)),
                quality: this.calculateAverageScoreAndVariations(allItems.map((s)=>s.quality)),
                descriptors: allDescriptors,
                notes: allNotes,
                variableType: variable.type
            };
            if (!variable.noScore) {
                ss.score = this.calculateAverageScoreAndVariations(allItems.map((s)=>s.score));
                ss.noScore = false;
            } else {
                ss.noScore = true;
            }
            this.summary.itemSummary.push(ss);
        }
        this.summary.evaluators = this.submissionsFull.map((s)=>s.evaluator);
        this.summary.notes = this.submissionsFull.map((s)=>s.notes);
        this.summary.allDescriptors = totalDescriptors;
    }
    calculateAverageScoreAndVariations(items) {
        const total = items.reduce((total, s)=>{
            if (s) {
                return total + s;
            }
            return total;
        }, 0);
        const averageScore = total / items.length;
        const result = {
            value: averageScore
        };
        const xx = items.reduce((total, s)=>{
            const number = s - averageScore;
            return number * number;
        }, 0);
        result.variance = xx / items.length;
        result.standardDeviation = (0, _mathjs.sqrt)(result.variance);
        return result;
    }
    constructor(...args){
        super(...args);
        this.systemState = null;
        this.qualityControlSessionId = null;
        this.referenceObjectId = null;
        this.sheetId = null;
        this.samplePreparationStatus = _types.SamplePreparationStatus.NotDone;
        this.modificationStatus = _types.ModificationStatus.NotSet;
        this.submissions = [];
        this.submissionsFull = [];
        this.activityCompletions = [];
        this.activityCompletionsFull = [];
        this.noteItems = [];
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], QualityControlResults.prototype, "qualityControlSessionId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], QualityControlResults.prototype, "referenceObjectId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", Array)
], QualityControlResults.prototype, "submissions", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('submissions'),
    _ts_metadata("design:type", Array)
], QualityControlResults.prototype, "submissionsFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], QualityControlResults.prototype, "activityCompletions", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('activityCompletions'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], QualityControlResults.prototype, "activityCompletionsFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.NoteItem),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], QualityControlResults.prototype, "noteItems", void 0);
