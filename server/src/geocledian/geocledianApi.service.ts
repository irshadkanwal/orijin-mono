import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  GeoCledianRiskResponse,
  GeoCledianParcel,
  GeoCledianSubmitResponseWrapper,
} from './geocledian.model';

const oddTrickForJest = async () => {
  // Causes a "open handle TLSWRAP" without this... real magic.
  // https://stackoverflow.com/questions/69169492/async-external-function-leaves-open-handles-jest-supertest-express
  return process.nextTick(() => {
    // nada
  });
};

@Injectable()
export class GeocledianApiService {
  private logger = new Logger(GeocledianApiService.name);

  private apiKey = process.env.GEOCLEDIAN_KEY;
  private baseUrl = 'https://geocledian.com/agknow/api/v4/';

  constructor(private readonly httpService: HttpService) {}

  async get(url) {
    await oddTrickForJest();
    const fullUrl = this.baseUrl + url + '?key=' + this.apiKey;
    try {
      const response = await this.httpService.axiosRef.get(fullUrl);
      return response.data;
    } catch (err) {
      this.logger.error('Error in GET: ' + fullUrl, err);
    }
  }

  async post(url, payload) {
    // this.baseUrl = 'http://localhost:3000/';
    try {
      await oddTrickForJest();
      const response = await this.httpService.axiosRef.post(
        this.baseUrl + url + '?key=' + this.apiKey,
        payload,
      );
      return response.data;
    } catch (err) {
      this.logger.error(err);
      this.logger.error(err.response.data);
    }
  }

  async usageSummary() {
    return this.get('usage');
  }

  /**
   * https://geocledian.com/agknow/api/v4/docs#/EUDR%20-%20Beta/register_eudr_parcel_agknow_api_v4_eudr_parcels_post
   *
   * @param parcel
   */
  async registerParcel(
    parcel: GeoCledianParcel,
  ): Promise<GeoCledianSubmitResponseWrapper> {
    // console.log('Trying', JSON.stringify(parcel, null, 4));

    const geometry = Array.isArray(parcel.coordinates[0])
      ? {
          type: 'Polygon',
          coordinates: parcel.coordinates,
        }
      : {
          type: 'Point',
          coordinates: parcel.coordinates,
        };

    const payload = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: geometry,
          properties: parcel.properties,
          id: 0,
        },
      ],
    };

    // console.log('as payload', JSON.stringify(payload, null, 4));

    return this.post('eudr/parcels', payload);
  }

  async getParcels() {
    return this.get('eudr/parcels');
  }
  async getParcel(id) {
    return this.get('eudr/parcels/' + id);
  }

  async getParcelRisk(id) {
    return this.get('eudr/parcels/' + id + '/risk');
  }
}
