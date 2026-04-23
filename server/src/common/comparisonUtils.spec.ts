import { Prisma } from '@prisma/client';
import { getObjectDifferences } from './comparisonUtil';

describe('ComparisonUtil', () => {
  describe('Comparisons', () => {
    it('should compare objects"', () => {
      const oldObject = {
        name: 'Alice',
        age: 25,
        address: {
          city: 'Wonderland',
          zipcode: '12345',
        },
        hobbies: ['reading', 'gardening'],
        remainingValue: 'static',
      };

      const newObject = {
        name: 'Alice',
        age: 30,
        address: {
          city: 'Wonderland',
          zipcode: '54321',
        },
        hobbies: ['reading', 'gardening', 'coding'],
      };

      const diffs = getObjectDifferences(oldObject, newObject);
      expect(diffs).toEqual({
        address: {
          zipcode: {
            oldValue: '12345',
            newValue: '54321',
          },
        },
        age: {
          oldValue: 25,
          newValue: 30,
        },
        hobbies: {
          oldValue: ['reading', 'gardening'],
          newValue: ['reading', 'gardening', 'coding'],
        },
        remainingValue: {
          oldValue: 'static',
          newValue: undefined,
        },
      });

      expect(Object.keys(getObjectDifferences({}, {})).length).toBe(0);

      expect(Object.keys(getObjectDifferences({ a: 1 }, { a: 1 })).length).toBe(
        0,
      );

      // Removed and added keys
      expect(getObjectDifferences({ a: 1 }, { b: 1 })).toStrictEqual({
        a: { oldValue: 1, newValue: undefined },
        b: { oldValue: undefined, newValue: 1 },
      });

      // Scalar value change
      expect(
        getObjectDifferences({ a: 'dasds' }, { a: 'dsadas1' }),
      ).toStrictEqual({
        a: { oldValue: 'dasds', newValue: 'dsadas1' },
      });

      // Object decomposition into properties
      expect(
        getObjectDifferences(
          { address: { street: 'dsadas' } },
          { address: undefined },
        ),
      ).toStrictEqual({
        address: { street: { oldValue: 'dsadas', newValue: undefined } },
      });

      expect(
        getObjectDifferences({}, { areaTotalManual: new Prisma.Decimal(2) }),
      ).toStrictEqual({
        areaTotalManual: { oldValue: undefined, newValue: '2' },
      });
    });
  });

  it('should compare dates in objects"', () => {
    const oldObject = {
      date: new Date('2021-01-01'),
    };

    const newObject = {
      date: new Date('2021-01-02'),
    };

    const diffs = getObjectDifferences(oldObject, newObject);
    expect(diffs).toEqual({
      date: {
        oldValue: '2021-01-01T00:00:00.000Z',
        newValue: '2021-01-02T00:00:00.000Z',
      },
    });
  });
});
