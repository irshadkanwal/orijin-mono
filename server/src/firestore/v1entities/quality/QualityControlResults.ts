import { Exclude, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import {
  HasNotes,
  LotState,
  ModificationStatus,
  NoteItem,
  SamplePreparationStatus,
} from '../utis/types';
import {
  DescriptorSummaryContainer,
  ScoreContainer,
  SummaryContainer,
  SummaryItemContainer,
} from './types';
import { cascadingDelete, expandFromId } from '../../v1utils/ormAnnotations';
import QualityControlResultSubmission from './QualityControlResultSubmission';
import ActivityCompletion from '../production/ActivityCompletion';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import QualityControlResultSubmissionItem from './QualityControlResultSubmissionItem';
import { IAnalysisPanelSheet } from './IAnalysisDefs';
import {sqrt} from "mathjs";

export default class QualityControlResults
  extends AbstractEntity
  implements HasNotes
{
  systemState: LotState = null;

  @Type(() => ObjectId)
  qualityControlSessionId: ObjectId = null;

  @Type(() => ObjectId)
  referenceObjectId: ObjectId = null;

  sheetId: string = null;
  totalScore: ScoreContainer;

  samplePreparationStatus: SamplePreparationStatus =
    SamplePreparationStatus.NotDone;
  modificationStatus: ModificationStatus = ModificationStatus.NotSet;

  summary: SummaryContainer;

  @Type(() => ObjectId)
  @cascadingDelete()
  submissions: ObjectId[] = [];

  @Exclude()
  @expandFromId('submissions')
  submissionsFull: QualityControlResultSubmission[] = [];

  @Type(() => ObjectId)
  @cascadingDelete()
  activityCompletions: Array<ObjectId> = <Array<ObjectId>>[];

  @Exclude()
  @expandFromId('activityCompletions')
  activityCompletionsFull: Array<ActivityCompletion> = <
    Array<ActivityCompletion>
  >[];

  @Type(() => NoteItem)
  noteItems: Array<NoteItem> = <Array<NoteItem>>[];

  public addActivityCompletion(activityCompletion: ActivityCompletion) {
    this.activityCompletions.push(activityCompletion.id);
    this.activityCompletionsFull.push(activityCompletion);
  }

  getCollection(): string {
    return collectionKeys.qualitycontrolresults;
  }

  calculateScores(sheetDef: IAnalysisPanelSheet) {
    this.totalScore = this.calculateAverageScoreAndVariations(
      this.submissionsFull.map((s) => s.score),
    );
    this.summary = {
      itemSummary: [],
      notes: [],
    };

    const totalDescriptors: DescriptorSummaryContainer[] = [];

    for (const variable of sheetDef.scoreVariables) {
      const allItems: QualityControlResultSubmissionItem[] =
        this.submissionsFull
          .flatMap((s) => s.submissions.find((ss) => ss.name === variable.name))
          .filter((item) => item != null);
      const allDescriptors: DescriptorSummaryContainer[] = [];
      const allNotes = [];

      for (const item of allItems) {
        if (item) {
          if (item.note) {
            allNotes.push(item.note);
          }
          if (item.descriptors == null || item.descriptors.length === 0) {
          } else {
            for (const d of item.descriptors) {
              const found = allDescriptors.find((f) => f.name === d.flavor);
              const foundTotal = totalDescriptors.find(
                (f) => f.name === d.flavor,
              );
              if (found) {
                found.count = found.count + 1;
              } else {
                allDescriptors.push({
                  name: d.flavor,
                  count: 1,
                });
              }
              if (foundTotal) {
                foundTotal.count = foundTotal.count + 1;
              } else {
                totalDescriptors.push({
                  name: d.flavor,
                  count: 1,
                });
              }
            }
          }
        }
      }

      const ss: SummaryItemContainer = {
        label: variable.name,
        intensity: this.calculateAverageScoreAndVariations(
          allItems.map((s) => s.intensity),
        ),
        quality: this.calculateAverageScoreAndVariations(
          allItems.map((s) => s.quality),
        ),
        descriptors: allDescriptors,
        notes: allNotes,
        variableType: variable.type,
      };

      if (!variable.noScore) {
        ss.score = this.calculateAverageScoreAndVariations(
          allItems.map((s) => s.score),
        );
        ss.noScore = false;
      } else {
        ss.noScore = true;
      }
      this.summary.itemSummary.push(ss);
    }

    this.summary.evaluators = this.submissionsFull.map((s) => s.evaluator);
    this.summary.notes = this.submissionsFull.map((s) => s.notes);

    this.summary.allDescriptors = totalDescriptors;
  }

  private calculateAverageScoreAndVariations(items: number[]): ScoreContainer {
    const total = items.reduce((total, s) => {
      if (s) {
        return total + s;
      }
      return total;
    }, 0);

    const averageScore = total / items.length;

    const result: ScoreContainer = {
      value: averageScore,
    };

    const xx = items.reduce((total, s) => {
      const number = s - averageScore;
      return number * number;
    }, 0);

    result.variance = xx / items.length;
    result.standardDeviation = sqrt(result.variance);
    return result;
  }
}
