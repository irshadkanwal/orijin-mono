import { useEffect, useRef } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SearchFrom } from "@/config/rootKeys";
import type { z, ZodType } from "zod";
import type { TableFilterSchema } from "@/types/table-filter";

export function useTablePagination<TQuery extends TableFilterSchema>(
  searchFrom: SearchFrom,
  defaultPage = 1,
  defaultLimit = 10,
  totalRows: number,
  tableQuery: TQuery,
  fields: string[]
) {
  const navigate = useNavigate();

  type TableQuery = z.infer<typeof tableQuery>;
  const search: TableQuery = useSearch({ from: searchFrom });
  const { page = defaultPage, limit = defaultLimit } = search;

  // Track previous values of district and shortCode
  const dynamicFields =
    fields?.length > 0 ? fields?.map((field) => search[field] || null) : [];
  const prevDynamicFieldsRef = useRef(dynamicFields);

  const totalPages = Math.ceil(totalRows / limit);

  useEffect(() => {
    const hasFilterChanged = dynamicFields.some(
      (field, index) => field !== prevDynamicFieldsRef.current[index]
    );
    const hasPaginationChanged = search.page !== page || search.limit !== limit;
    if (hasFilterChanged) {
      navigate({
        search: (prev) => ({
          ...prev,
          page: defaultPage,
          limit: defaultLimit,
        }),
      });
    } else if (hasPaginationChanged) {
      navigate({
        search: (prev) => ({
          ...prev,
          page,
          limit,
        }),
      });
    }

    // Update previous values
    prevDynamicFieldsRef.current = dynamicFields;
  }, [page, limit, search.page, search.limit, ...dynamicFields, navigate]);

  const handlePageChange = (pageIndex: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: pageIndex + 1,
      }),
    });
  };

  const handlePageSizeChange = (pageSize: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        limit: pageSize,
        page: 1, // reset to first page on page size change
      }),
    });
  };

  const canGoNextPage = () => page < totalPages;
  const canGoPreviousPage = () => page > 1;

  const handleFirstPage = () => {
    handlePageChange(0);
  };

  const handlePreviousPage = () => {
    handlePageChange(page - 2); // Adjust for zero-based index
  };

  const handleNextPage = () => {
    handlePageChange(page);
  };

  const handleLastPage = () => {
    handlePageChange(totalPages - 1);
  };

  return {
    page,
    limit,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    canGoNextPage,
    canGoPreviousPage,
    handleFirstPage,
    handlePreviousPage,
    handleNextPage,
    handleLastPage,
  };
}
