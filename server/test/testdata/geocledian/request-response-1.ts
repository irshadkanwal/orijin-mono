const request = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [36.295803, -8.126165],
            [36.295333, -8.125192],
            [36.293371, -8.125919],
            [36.293923, -8.126959],
            [36.295803, -8.126165],
          ],
        ],
      },
      properties: {
        name: 'Sarah Maglass',
        entity: 'Sarah Maglass',
        foreign_id: 'clzxo8dmd0007wtmhohwjwhyb',
        commodity: 'cocoa',
        production_start: '2020-01-01',
        production_end: '2024-07-31',
        country_iso: 'TZA',
        process_timeseries: true,
        point_buffer_area: 1,
      },
      id: 0,
    },
  ],
};

const response = {
  content: {
    parcel_id: 51441,
    commodity: 'cocoa',
    name: 'Sarah Maglass',
    foreign_id: 'clzxo8dmd0007wtmhohwjwhyb',
    entity: 'Sarah Maglass',
    production_start: '2020-12-31',
    production_end: '2024-07-31',
    country_iso: 'TZA',
    area_rep: null,
    point_buffer_area: null,
    process_timeseries: true,
    area: 2.8343157957613228,
    centroid: {
      type: 'Point',
      coordinates: [36.294593442302705, -8.126062220178097],
    },
    bounding_box: [
      [-8.126959, 36.293371],
      [-8.125192, 36.295803],
    ],
    geohash: 'ey6nrp4',
    validation: {
      foreign_id: 'clzxo8dmd0007wtmhohwjwhyb',
      parcel_id: 51441,
      geometry: {
        valid: null,
        messages: null,
      },
      attr_schema: {
        valid: null,
        message: null,
      },
      attributes: [],
      generation_date: new Date('2024-08-17T11:47:00'),
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [36.295803, -8.126165],
            [36.295333, -8.125192],
            [36.293371, -8.125919],
            [36.293923, -8.126959],
            [36.295803, -8.126165],
          ],
        ],
      ],
      bbox: null,
    },
  },
};
