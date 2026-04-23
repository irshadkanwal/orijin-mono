import { supportingServicesActivitiesQueryOptions } from "@/services/supportingService-service";
import { personsQueryOptions } from "@/services/person-service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { useRouteContext } from "@tanstack/react-router";
import { useCommonQuery } from "@/hooks/common/use-common-queries";

export function useSupportingServiceActivityQuery() {
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: rootKeys.supportingServices });

  const { data: supportingServiceActivities, refetch: refetchActivities } =
    useSuspenseQuery(
      supportingServicesActivitiesQueryOptions(
        organisations.current,
        { page: 1, limit: 1000 },
        currentUser?.accessToken
      )
    );

  const { fetchData: locationsData } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    search: {
      page: 1,
      limit: 1000,
      type: "Farmergroup,SubCounty,Village,District,Parish,Farmergroups",
    },
    path: lastPathSegments.LOCATIONS,
  });

  const farmerGroups = locationsData?.data.data.filter(
    (location) =>
      location.type.toLowerCase() === "farmergroup" ||
      location.type.toLowerCase() === "farmergroups"
  );

  const locationTypes = ["subcounty", "village", "district", "parish"];
  const locations = locationsData?.data.data.filter((location) =>
    locationTypes.includes(location.type.toLowerCase())
  );

  const { data: persons, refetch: refetchPersons } = useSuspenseQuery(
    personsQueryOptions(
      organisations.current,
      {
        page: 1,
        limit: 1000,
      },
      currentUser?.accessToken
    )
  );

  return {
    supportingServiceActivities,
    refetchActivities,
    persons,
    refetchPersons,
    farmerGroups,
    locations,
    refetchLocations: locationsData.refetch,
  };
}
