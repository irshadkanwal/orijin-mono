import { Injectable } from '@nestjs/common';

@Injectable()
export class FarmFilters {
  addLocationFilters(filters, where, fieldName: 'location' | 'customLocation') {
    if (filters[fieldName]) {
      const nameEqualsFilter = (location) => ({
        OR: [
          { name: { equals: location, mode: 'insensitive' } },
          { shortCode: { equals: location, mode: 'insensitive' } },
        ],
      });
      const districts = decodeURIComponent(filters[fieldName]).split(',');
      where.facility.AND.push({
        OR: districts.map((location) => ({
          OR: [
            {
              [fieldName]: nameEqualsFilter(location),
            },
            {
              [fieldName]: {
                parent: nameEqualsFilter(location),
              },
            },
            {
              [fieldName]: {
                parent: {
                  parent: nameEqualsFilter(location),
                },
              },
            },
            {
              [fieldName]: {
                parent: {
                  parent: {
                    parent: nameEqualsFilter(location),
                  },
                },
              },
            },
          ],
        })),
      });
    }
    return where;
  }
}
