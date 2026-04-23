import { Injectable, Logger } from '@nestjs/common';
import { SeasonsService } from '../seasons/seasons.service';
import { Season } from '../seasons/models/seasons.model';
import { FirestoreUtilsService } from './firestore.helper.service';

@Injectable()
export class FirestoreSeasonImporterService {
  private logger = new Logger(FirestoreSeasonImporterService.name);

  constructor(
    private firestoreUtilsService: FirestoreUtilsService,
    private seasonService: SeasonsService,
  ) {}

  async importSeason(subCollections, meta): Promise<Season[]> {
    const seasons =
      await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(
        subCollections,
        'seasons',
      );

    const promises = seasons.map(async (season) => {
      // console.log(season.id, '=>', season);
      try {
        return await this.seasonService.create({
          organisation: meta.organisation,
          shortCode: season.id.labelShort,
          name: season.id.label,
          startsAt: season.startDate?.toDate(),
          active: season.enabled || false,
        });
      } catch (err) {
        this.logger.error(err);
        console.log(err);
      }
    });
    const imported = await Promise.all(promises);
    return imported.filter((val) => val); // Filter out exceptions
  }
}
