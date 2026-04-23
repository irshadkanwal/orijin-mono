import { DISPLAY_DEF } from '../common/displaydef';

const getCollectionDisplayDefinitionWithName = (collectionName: string) => {
  const collection = Object.keys(DISPLAY_DEF.displayDefs).find(
    (key) => DISPLAY_DEF.displayDefs[key].source === collectionName,
  );
  return collection ? DISPLAY_DEF.displayDefs[collection] : null;
};

const applyFiltersToQuery = (
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  collection: string,
  filterParams: any,
) => {
  const collectionData = getCollectionDisplayDefinitionWithName(collection);
  const columns = collectionData ? collectionData.columns : [];

  if (filterParams && columns.length) {
    Object.entries(filterParams).forEach(([filterKey, filterValue]) => {
      const matchingColumn = columns.find(
        (col) => col.title === filterKey && col.filtering,
      );

      if (matchingColumn) {
        //.value is   actual path of the field in Firestore document (e.g. 'properties.location.label')
        const fieldPath = matchingColumn.value;
        query = query.where(fieldPath, '==', filterValue);
      }
    });
  }
  return query;
};

const applySortingToQuery = (
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  sort?: string,
  sortOrder?: string,
) => {
  const sortFields = sort ? sort.split(',') : [];
  const sortOrderValues = sortOrder ? sortOrder.split(',') : [];

  if (sortFields.length && sortOrderValues.length) {
    sortFields.forEach((field, index) => {
      query = query.orderBy(
        field,
        sortOrderValues[index] as FirebaseFirestore.OrderByDirection,
      );
    });
  } else {
    query = query.orderBy('__name__'); // Default sort by document ID
  }

  return query;
};

const applyPaginationToQuery = (
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  page: number,
  pageSize: number,
) => {
  const offset = (page - 1) * pageSize;
  query = query.limit(pageSize).offset(offset);
  return query;
};
export {
  getCollectionDisplayDefinitionWithName,
  applyFiltersToQuery,
  applySortingToQuery,
  applyPaginationToQuery,
};
