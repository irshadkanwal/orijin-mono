import type { FilterValues } from "@/hooks/data-table/use-table-filter";

export const updateSortFields = (
  newFilters: FilterValues,
  updatedSearch: { [key: string]: string | string[] | number },
  sortFields: string[],
  sortOrderValues: string[]
) => {
  Object.entries(newFilters).forEach(([key, value]) => {
    const newValue = Array.isArray(value) ? value.join(",") : String(value);

    if (key === "sort") {
      const newSortFields = newValue.split(",").filter(Boolean);
      const existingSortFields: [string, number][] = [];
      sortFields.forEach((sortField, index) => {
        existingSortFields.push([sortField, index]);
      });

      newSortFields.forEach((sortField) => {
        const decodedSortField = decodeURIComponent(sortField);
        const existingIndex = existingSortFields.findIndex(
          ([field]) => field === decodedSortField
        );
        if (existingIndex !== -1) {
          existingSortFields.splice(existingIndex, 1, [
            decodedSortField,
            sortFields.indexOf(decodedSortField),
          ]);
        } else {
          existingSortFields.push([decodedSortField, sortFields.length]);
        }
      });

      sortFields.push(
        ...newSortFields.filter((field) => !sortFields.includes(field))
      );
      updatedSearch[key] = sortFields.join(",");
    } else if (key === "sortOrder") {
      const newSortOrderValues = newValue.split(",").filter(Boolean);

      if (newSortOrderValues.length === 0) {
        const sortFieldToRemove = newFilters["sort"];
        const sortFieldIndex = sortFields.indexOf(sortFieldToRemove);
        if (sortFieldIndex !== -1) {
          sortFields.splice(sortFieldIndex, 1);
          sortOrderValues.splice(sortFieldIndex, 1);
        }
        updatedSearch["sort"] = sortFields.join(",");
        updatedSearch["sortOrder"] = sortOrderValues.join(",");
      } else {
        newSortOrderValues.forEach((newSortOrder, newIndex) => {
          const sortField = String(newFilters["sort"]).split(",")[newIndex];
          const sortFieldIndex = sortFields.indexOf(sortField);

          if (sortFieldIndex !== -1) {
            sortOrderValues[sortFieldIndex] = newSortOrder;
          } else {
            sortOrderValues.push(newSortOrder);
          }
        });

        updatedSearch[key] = sortOrderValues.join(",");
      }
    }
  });
};
