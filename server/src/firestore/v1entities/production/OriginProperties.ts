import { Exclude, Transform, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import AmountUnit from '../utis/AmountUnit';
import PriceContainer from '../utis/PriceContainer';
import FacilityV1 from '../refdata/FacilityV1';
import VarietyV1 from '../refdata/VarietyV1';
import {
  addIdToArrayIfNotExists,
  DateWrapper,
  formatDatesForFS,
} from '../../v1utils/utils';
import { AbstractEntity } from '../utis/AbstractEntity';
import VarietyPriceContainer from '../utis/VarietyPriceContainer';

export default class OriginProperties extends AbstractEntity {
  properties: { [key: string]: any } = {};
  sessionIds: string[];
  sessionId: string = null;

  @Type(() => AmountUnit)
  money: AmountUnit;

  afterWeight: number;
  beforeWeight: number;

  @Type(() => PriceContainer)
  price: VarietyPriceContainer = null;

  @Type(() => VarietyPriceContainer)
  prices: Array<VarietyPriceContainer>;

  @Type(() => ObjectId)
  product: ObjectId;

  @Type(() => ObjectId)
  products: Array<ObjectId> = [];

  @Type(() => ObjectId)
  location: ObjectId;

  @Type(() => ObjectId)
  locationParent: ObjectId;

  @Type(() => ObjectId)
  locations: Array<ObjectId>;

  @Type(() => ObjectId)
  locationParents: Array<ObjectId>;

  @Type(() => ObjectId)
  facility: ObjectId;

  @Type(() => ObjectId)
  facilities: Array<ObjectId>;

  @Exclude()
  facilitiesFull: Array<FacilityV1>;

  @Type(() => ObjectId)
  communities: Array<ObjectId>;

  @Exclude()
  communitiesFull: Array<FacilityV1>;

  @Exclude()
  countries: Array<string>;

  @Exclude()
  regions: Array<string>;

  @Type(() => ObjectId)
  producer: ObjectId;

  @Type(() => ObjectId)
  producers: Array<ObjectId> = [];

  @Type(() => ObjectId)
  plots: Array<ObjectId> = [];

  @Type(() => ObjectId)
  tree: ObjectId;

  @Type(() => ObjectId)
  variety: ObjectId;

  @Type(() => ObjectId)
  operator: ObjectId;

  @Type(() => ObjectId)
  season: ObjectId;

  @Type(() => ObjectId)
  varieties: Array<ObjectId>;

  @Type(() => ObjectId)
  operators: Array<ObjectId>;

  @Type(() => ObjectId)
  seasons: Array<ObjectId>;

  @Exclude()
  varietiesFull: Array<VarietyV1>;

  @Type(() => ObjectId)
  collectors: Array<ObjectId>;

  @Transform(({ value }) => formatDatesForFS(value))
  collectionDate: Date;

  @Type(() => DateWrapper)
  collectionDates: Array<DateWrapper>;

  @Transform(({ value }) => formatDatesForFS(value))
  receptionDate: Date;

  isBackDating: boolean;

  get hasItsOwnOrigin(): boolean {
    return (
      this.facility != null ||
      this.plots.length > 0 ||
      this.variety != null ||
      this.tree != null
    );
  }
  public addLocationParent(variety: ObjectId) {
    if (!this.locationParents) {
      this.locationParents = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.locationParents, variety);
  }

  public addLocation(variety: ObjectId) {
    if (!this.locations) {
      this.locations = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.locations, variety);
  }
  public addSeason(variety: ObjectId) {
    if (!this.seasons) {
      this.seasons = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.seasons, variety);
  }

  public addOperator(variety: ObjectId) {
    if (!this.operators) {
      this.operators = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.operators, variety);
  }

  public addVariety(variety: ObjectId) {
    if (!this.varieties) {
      this.varieties = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.varieties, variety);
  }

  public addCollectionDate(item: Date) {
    if (!this.collectionDates) {
      this.collectionDates = new Array<DateWrapper>();
    }

    const existing = this.collectionDates.find(
      (m) => m.date.getTime() == item.getTime(),
    );
    if (!existing) {
      const dateWrapper = new DateWrapper();
      dateWrapper.date = item;
      this.collectionDates.push(dateWrapper);
    }
  }

  public addVarietyPrice(item: VarietyPriceContainer): boolean {
    if (!this.prices) {
      this.prices = new Array<VarietyPriceContainer>();
    }

    const existing = this.prices.find(
      (m) =>
        m.variety.id === item.variety.id &&
        m.price.price.amount === item.price.price.amount,
    );
    if (!existing) {
      this.prices.push(item);
      return true;
    }
    return false;
  }

  public addProduct(item: ObjectId) {
    if (!this.products) {
      this.products = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.products, item);
  }

  public addFacility(item: ObjectId) {
    if (!this.facilities) {
      this.facilities = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.facilities, item);
  }

  public addProducer(item: ObjectId) {
    if (!this.producers) {
      this.producers = new Array<ObjectId>();
    }

    addIdToArrayIfNotExists(this.producers, item);
  }

  addSessionId(sessionId: any) {
    if (!this.sessionIds) {
      this.sessionIds = new Array<string>();
    }
    if (!this.sessionIds.includes(sessionId)) {
      this.sessionIds.push(sessionId);
    }
  }

  getCollection(): string {
    return collectionKeys.originproperties;
  }
}
