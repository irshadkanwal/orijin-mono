import { Type } from 'class-transformer';

import LatLong from '../refdata/LatLong';
// import { GeoLocationInput } from '../orm/SearchDbOptions';

export default class Coordinates {
  @Type(() => LatLong)
  latLong: LatLong = new LatLong(null, null);
  altitude: number = null;
  accuracy: number = null;
  altitudeAccuracy: number = null;
  speed: number = null;
  altitudeMin: number = null;
  altitudeMax: number = null;
  name: string = null;

  // static ofGeoCoordinates(input: GeoLocationInput): Coordinates {
  //   const latLong1 = new LatLong(input.coords.latitude, input.coords.longitude);
  //   const coordinates = new Coordinates(latLong1, input.coords.altitude);
  //   coordinates.speed = input.coords.speed;
  //   coordinates.altitudeAccuracy = input.coords.altitudeAccuracy;
  //   coordinates.accuracy = input.coords.accuracy;
  //   return coordinates;
  // }

  static of(lat: number, long: number, altitude: number): Coordinates {
    return new Coordinates(new LatLong(lat, long), altitude);
  }

  constructor(latLong: LatLong, altitude: number) {
    this.latLong = latLong;

    this.altitude = altitude;
  }
}
