import 'reflect-metadata';
import {
  PaginationAndSortingDto,
  IPaginationAndSorting,
} from './dto/paginationAndSorting.dto';
import { DataTableFilterType } from 'src/filters/models/filters.model';

interface FilterMetadata {
  type: DataTableFilterType;
  placeholder?: string;
  label?: string;
}

export const filterMetadataMap = new Map<string, Map<string, FilterMetadata>>(); // Map className to properties and types

/** Assigns additional metadata for a filter. */
export function FilterType(
  type: DataTableFilterType,
  placeholder?: string,
  label?: string,
): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const className = target.constructor.name;

    if (!filterMetadataMap.has(className)) {
      filterMetadataMap.set(className, new Map());
    }

    const classMetadata = filterMetadataMap.get(className);
    classMetadata.set(String(propertyKey), {
      type,
      placeholder,
      label,
    });
    // console.log(`Filter metadata ${className}.${String(propertyKey)}: ${type}`);
  };
}

/** Retrieves the filter metadata for a class. */
export function getFilterMetadata(
  className: string,
): Map<string, FilterMetadata> | undefined {
  return filterMetadataMap.get(className);
}

export const applyFilters = (filters, where) => {
  const proto = Object.getPrototypeOf(filters);
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    console.log('one filter', value);
    if (value !== undefined) {
      try {
        const filterType = Reflect.getMetadata('filterType', proto, key);
        console.log('Filter Type:', filterType);
        switch (filterType) {
          case 'relation':
            where[key] = value;
            break;
          case 'string':
            where[key] = { contains: value, mode: 'insensitive' };
            break;
          case 'equals':
          default:
            where[key] = value;
            break;
        }
      } catch (err) {
        console.error('Error applying filter', err);
      }
    }
  });
  console.log({ from: filters, to: where });
  return where;
};

export const addPagination = (
  filterWithPagination: PaginationAndSortingDto,
) => {
  const { limit, page } = filterWithPagination;
  const limitNumber = parseInt(limit) ?? 20;
  const pageNumber = parseInt(page);
  const take = !isNaN(limitNumber) ? limitNumber : undefined;
  const skip =
    take && pageNumber && !isNaN(pageNumber)
      ? (pageNumber - 1) * limitNumber
      : 0;

  // TODO: Add total counts & total pages
  // https://medium.com/@flavionobre11/simple-pagination-with-prisma-and-typescript-23be77762ba3
  // https://www.prisma.io/docs/orm/prisma-client/queries/pagination
  return {
    skip,
    take,
  };
};

export function parseFilters<T extends IPaginationAndSorting>(filters: T) {
  const { page, limit, sort, sortOrder, ...filterFields } = filters;
  return {
    pagination: { page, limit },
    sorting: { sort, sortOrder },
    filters: filterFields,
  };
}
