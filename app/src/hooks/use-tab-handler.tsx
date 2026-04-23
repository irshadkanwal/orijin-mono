import { useNavigate, useSearch } from "@tanstack/react-router";
import { RootKeyValues } from "@/config/rootKeys";
import { useCallback } from "react";

export type TabRecord<T extends string> = Record<T, string>;

export const useTabHandler = <T extends string>(
  tabConfig: TabRecord<T>,
  defaultTab: T,
  routeKey: RootKeyValues
) => {
  const validTabs = Object.values(tabConfig);
  const activeTab = useSearch({
    from: routeKey as any,
    select: (search) =>
      search.tab && validTabs.includes(search.tab)
        ? (search.tab as T)
        : defaultTab,
  });

  const navigate = useNavigate();
  const handleTabChange = useCallback(
    (tab: T) => {
      void navigate({
        search: (search) => ({ ...search, tab }),
      });
    },
    [navigate]
  );
  return {
    activeTab,
    handleTabChange,
  };
};
