export default class LatLong {
  lat: number = null;
  lon: number = null;

  constructor(lat: number, lon: number) {
    this.lat = lat;
    this.lon = lon;
  }

  get latLong(): string {
    return '[' + this.lat + ',' + this.lon + ']';
  }

  public getCoordsArray(): [] {
    return [this.lat, this.lon] as any;
  }

  public getLatLon(): any {
    return { lat: this.lat, lon: this.lon };
  }
}
