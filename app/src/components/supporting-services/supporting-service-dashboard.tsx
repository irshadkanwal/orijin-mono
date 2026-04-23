import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import {
  SupportServiceActivity,
  SupportServiceBeneficiary,
} from "@/types/support-service";
import { SupportServiceTableQuery } from "@/types/support-service-types";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import { PageTitle } from "../page-title";
import { SingleValueChart } from "../charts/SingleValueChart";
import { Icons } from "../icons";
import { GaugeChart } from "../charts/GaugeChart";
import { LocationBarChart } from "../charts/LocationBarChart";
import { ageRanges } from "@/types/persons-types";
import { PolygonWarningChart } from "../charts/PolygonWarningsBarChart";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { useEffect, useState } from "react";
import { calculateAge, initializeCountArray } from "@/lib/utils";
import { CustomSelect } from "../utils/CustomSelect";

export function SupportingServiceBeneficiaryDashboard() {
  const [size, setSize] = useState<number>(0);
  const [category, setCategory] = useState<string>("All categories");
  const [operators, setOperators] = useState<string>("All operators");
  const [location, setLocation] = useState<string>("All locations");
  let faciltyIds: string[];

  // Destructure context values
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: rootKeys.supportingServices });

  const search: SupportServiceTableQuery = useSearch({
    from: rootKeys.supportingServices,
  });

  const { fetchData: supportingServiceActivities } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.SERVICE_ACTIVITIES,
    search,
  });

  // Flatten beneficiaries data
  const beneficiaries: SupportServiceBeneficiary[] =
    supportingServiceActivities.data.data.flatMap(
      (item: SupportServiceActivity) => item.ServiceActivityBeneficiaries
    );

  // Helper functions
  const normalizeGender = (gender?: string) =>
    gender ? gender.toLowerCase() : "unknown";

  const countGenders = (dataArray: any[]) => {
    return dataArray.reduce(
      (genderCount, item) => {
        const gender = normalizeGender(item?.gender || item?.person?.gender);
        genderCount[gender] = (genderCount[gender] || 0) + 1;
        return genderCount;
      },
      { male: 0, female: 0, unknown: 0 }
    );
  };

  const extractLocationData = (data: any[]) => {
    const result = {
      SubCounty: new Map<
        string,
        { locationId: any; locationName: any; beneficiariesCount: number }
      >(),
      District: new Map<
        string,
        { locationId: any; locationName: any; beneficiariesCount: number }
      >(),
    };

    data?.forEach((item) => {
      const person = item.person;
      const location = item.location;

      if (person) {
        const fullName =
          `${person?.firstName} ${person?.lastName}`.toLowerCase();
        person?.mainContactPersonFor?.forEach(
          ({ name, customLocation }: any) => {
            if (name.toLowerCase() !== fullName) {
              const subCounty = customLocation?.parent;
              const district = subCounty?.parent;

              // Update SubCounty
              const subCountyKey = subCounty?.id;
              if (subCountyKey) {
                if (!result.SubCounty.has(subCountyKey)) {
                  result.SubCounty.set(subCountyKey, {
                    locationId: subCountyKey,
                    locationName: subCounty?.name,
                    beneficiariesCount: 0,
                  });
                }
                result.SubCounty.get(subCountyKey)!.beneficiariesCount++;
              }

              // Update District
              const districtKey = district?.id;
              if (districtKey) {
                if (!result.District.has(districtKey)) {
                  result.District.set(districtKey, {
                    locationId: districtKey,
                    locationName: district?.name,
                    beneficiariesCount: 0,
                  });
                }
                result.District.get(districtKey)!.beneficiariesCount++;
              }
            }
          }
        );
      } else if (location) {
        const subCounty = location?.parent;
        const district = subCounty?.parent;

        // Update SubCounty
        const subCountyKey = subCounty?.id;
        if (subCountyKey) {
          if (!result.SubCounty.has(subCountyKey)) {
            result.SubCounty.set(subCountyKey, {
              locationId: subCountyKey,
              locationName: subCounty?.name,
              beneficiariesCount: 0,
            });
          }
          result.SubCounty.get(subCountyKey)!.beneficiariesCount++;
        }

        // Update District
        const districtKey = district?.id;
        if (districtKey) {
          if (!result.District.has(districtKey)) {
            result.District.set(districtKey, {
              locationId: districtKey,
              locationName: district?.name,
              beneficiariesCount: 0,
            });
          }
          result.District.get(districtKey)!.beneficiariesCount++;
        }
      }
    });

    return {
      SubCounty: Array.from(result.SubCounty.values()),
      District: Array.from(result.District.values()),
    };
  };

  const genricDataFilter = (data: any[], activityType: string) => {
    return data.reduce<any>(
      (result, item) => {
        const activityTypeMatch =
          item?.supportingServiceActivity?.supportingServiceActivityType?.type;

        if (activityTypeMatch?.toLowerCase() === activityType) {
          result.count++;
          const gender = item?.person?.gender;
          const age = calculateAge(item?.person?.dateOfBirth);
          const location = item?.supportingServiceActivity?.location;
          const operator = item?.supportingServiceActivity?.operator;
          const categoryName =
            item?.supportingServiceActivity?.supportingServiceCategory?.name;
          const activityTypes =
            item?.supportingServiceActivity?.supportingServiceActivityType
              ?.type;
          // Ensure categoryName is defined before calling trim

          result.total.push({
            gender,
            age,
            location,
            operator,
            categoryName,
            activityTypes,
          });
        }
        return result;
      },
      { count: 0, total: [] }
    );
  };

  const beneficiariesLocations = extractLocationData(beneficiaries);
  const filteredData = {
    Region: beneficiariesLocations.SubCounty.filter(
      (item) => item.locationName
    ),
    Zone: beneficiariesLocations.District.filter((item) => item.locationName),
  };

  const calculateUniqueValues = (data: any, key: any) => {
    const uniqueValues = new Set();
    data?.forEach((item: any) => {
      const value =
        key === "location" ? item.location?.name?.trim() : item[key]?.trim();
      if (value) uniqueValues.add(value);
    });
    return Array.from(uniqueValues);
  };

  const totalDistributionData = genricDataFilter(
    beneficiaries,
    "distribution"
  );

  // Get unique category names
  const categoriesArray = calculateUniqueValues(
    totalDistributionData.total,
    "categoryName"
  );
  const newCategoriesArray = [...categoriesArray, "All categories"];

  // Filter data based on selected category
  if (category !== "All categories") {
    totalDistributionData.total = totalDistributionData.total.filter(
      (d: any) => d?.categoryName === category
    );
  }

  // Calculate total training delivered
  const totalTrainingDelivered = genricDataFilter(
    beneficiaries,
    "training"
  );

  // Get unique operators and locations
  const operatorsArray = calculateUniqueValues(
    totalTrainingDelivered.total,
    "operator"
  );
  const newOperatorsArray = [...operatorsArray, "All operators"];
  const locationsArray = calculateUniqueValues(
    totalTrainingDelivered.total,
    "location"
  );
  const newLocationsArray = [...locationsArray, "All locations"];

  // Filter data based on selected operators
  if (operators !== "All operators") {
    totalTrainingDelivered.total = totalTrainingDelivered.total.filter(
      (d: any) => d?.operator === operators
    );
  }

  // Filter data based on selected locations
  if (location !== "All locations") {
    totalTrainingDelivered.total = totalTrainingDelivered.total.filter(
      (d: any) => d?.location?.name === location
    );
  }

  // Initialize age counts
  const initializeAgeCount = (data: any[], ageRanges: any[]) => {
    const ageCount = initializeCountArray(ageRanges);
    data?.forEach(({ age }) => {
      if (age < 18) {
        ageCount[0].value++;
      } else if (age <= 30) {
        ageCount[1].value++;
      } else if (age <= 50) {
        ageCount[2].value++;
      } else {
        ageCount[3].value++;
      }
    });
    return ageCount;
  };

  const beneficiariesAgeCount = initializeAgeCount(beneficiaries, ageRanges);
  const distributionAgeCount = initializeAgeCount(
    totalDistributionData.total,
    ageRanges
  );
  const trainingAgeCount = initializeAgeCount(
    totalTrainingDelivered.total,
    ageRanges
  );

  const genders = countGenders(beneficiaries);
  const distributionGenderSplit = countGenders(totalDistributionData.total);
  const trainingGenderSplit = countGenders(totalTrainingDelivered.total);

  // Calculate total area
  const calculateTotalArea = (beneficiaries: any[]) => {
    return beneficiaries.reduce((acc, item) => {
      const facilities =
        item.person?.mainContactPersonFor?.flatMap(
          (contact: any) => contact.location?.facilities
        ) || [];
      faciltyIds = facilities.map((facility: any) => facility.id);
      return (
        acc +
        facilities.reduce(
          (sum: any, facility: any) =>
            sum +
            (facility.mainContactPersonId === item.person?.id
              ? parseFloat(facility.areaTotalManual)
              : 0),
          0
        )
      );
    }, 0);
  };

  const totalArea = calculateTotalArea(beneficiaries);

  // Calculate average plot size
  const plotSize = async () => {
    const filteredFarms = beneficiaries.flatMap((contact: any) => {
      return (
        contact?.person?.mainContactPersonFor
          ?.map((mainContact: any) => mainContact.farm)
          .filter(
            (farm: any) => farm && faciltyIds.includes(farm.facilityId)
          ) || []
      );
    });

    const totalFarmArea = filteredFarms.reduce((total, farm) => {
      return (
        total +
        (farm.plots?.reduce((plotTotal: any, plot: any) => {
          return (
            plotTotal +
            (plot.polygons?.reduce(
              (polyTotal: any, polygon: any) =>
                polyTotal + Number(polygon.areaCalculated) || 0,
              0
            ) || 0)
          );
        }, 0) || 0)
      );
    }, 0);

    const averageArea =
      filteredFarms.length > 0 ? totalFarmArea / filteredFarms.length : 0;
    setSize(averageArea);
  };

  useEffect(() => {
    plotSize();
  }, [beneficiaries]);

  const averagePlotSize = size.toFixed(2);

  // Location Data for Distribution and Training
  const distributionLocations = extractLocationData(
    totalDistributionData.total
  );

  const trainingLocations = extractLocationData(totalTrainingDelivered.total);

  const distributionLocationFilteredData = {
    Region: distributionLocations.SubCounty.filter((item) => item.locationName),
    Zone: distributionLocations.District.filter((item) => item.locationName),
  };

  const trainingLocationFilteredData = {
    Region: trainingLocations.SubCounty.filter((item) => item.locationName),
    Zone: trainingLocations.District.filter((item) => item.locationName),
  };

  const lengthOfFilteredArray = totalDistributionData.total;
  const lengthOfFilterdTraining = totalTrainingDelivered.total;

  return (
    <main className="grid flex-1 items-start gap-y-2 sm:px-6 sm:py-4 md:p-0 md:gap-y-4 lg:grid-cols-1 xl:grid-cols-1">
      <div className="flex-1 space-y-4 p-8 pt-6 overflow-auto min-w-full max-w-[calc(100vh-200px)]">
        <PageTitle title={"Dashboard"} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SingleValueChart
            title="Total Beneficiaries"
            value={beneficiaries.length}
            units="Beneficiaries"
            Icon={Icons.user}
          />
          <SingleValueChart
            title="Total farm size"
            value={totalArea}
            units="Farm size"
            Icon={Icons.settings}
          />
          <SingleValueChart
            title="Average plot size"
            value={averagePlotSize}
            units="Plot size"
            Icon={Icons.settings}
          />
          <GaugeChart
            title="Gender Split"
            subTitle={`Out of total ${genders.female + genders.male} Beneficiaries`}
            summary={`${genders.female} / ${genders.male}`}
            explanation="Female / Male"
            chartData={[
              {
                month: "January",
                valueLeft: genders.female,
                valueRight: genders.male,
              },
            ]}
          />
          <LocationBarChart
            data={filteredData}
            countKey="beneficiariesCount"
            title="Beneficiaries by Location"
          />

          {/* {ageCount.filter((item) => item.value >= 0).length > 0 && ( */}
          <PolygonWarningChart
            polygonWarningsCount={beneficiariesAgeCount}
            title="Age Split"
            description="Age Ranges"
            defaultColor="#ff0000"
            tooltipContent={"Hello"}
            labelFormatter={(value) => value.toUpperCase()}
          />
          {/* )} */}
        </div>
        <div className="flex-1 space-y-4 overflow-auto min-w-full max-w-[calc(100vh-200px)]">
          <PageTitle title={"Distribution"} />
          <CustomSelect
            onChange={(category: any) => setCategory(category)}
            options={newCategoriesArray}
            value={category}
            id="category"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-[#F3FCF5] rounded p-5 border">
            <SingleValueChart
              title="Total distributed items"
              value={lengthOfFilteredArray.length}
              units="Distributions"
              Icon={Icons.settings}
            />
            <LocationBarChart
              data={distributionLocationFilteredData}
              countKey="beneficiariesCount"
              title="Distributution Beneficiaries by Location"
            />
            {distributionAgeCount.filter((item) => item.value > 0).length >
              0 && (
              <PolygonWarningChart
                polygonWarningsCount={distributionAgeCount}
                title="Distributution Age Split"
                description="Age Ranges"
                defaultColor="#ff0000"
                tooltipContent={"Hello"}
                labelFormatter={(value) => value.toUpperCase()}
              />
            )}
            <GaugeChart
              title="Distributution Gender Split"
              subTitle={`Out of total ${distributionGenderSplit.female + distributionGenderSplit.male} Beneficiaries`}
              summary={`${distributionGenderSplit.female} / ${distributionGenderSplit.male}`}
              explanation="Female / Male"
              chartData={[
                {
                  month: "January",
                  valueLeft: distributionGenderSplit.female,
                  valueRight: distributionGenderSplit.male,
                },
              ]}
            />
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-auto min-w-full max-w-[calc(100vh-200px)]">
          <PageTitle title={"Training"} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 rounded">
            <CustomSelect
              onChange={(operator) => setOperators(operator)}
              options={newOperatorsArray}
              value={operators}
              id="Operator"
            />
            <CustomSelect
              onChange={(location) => setLocation(location)}
              options={newLocationsArray}
              value={location}
              id="location"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-[#F3FCF5] rounded p-5 border">
            <SingleValueChart
              title="Total Training Delivered"
              value={lengthOfFilterdTraining.length}
              units="Distributions"
              Icon={Icons.settings}
            />
            <LocationBarChart
              data={trainingLocationFilteredData}
              countKey="beneficiariesCount"
              title="Training Beneficiaries by Location"
            />
            {distributionAgeCount.filter((item) => item.value > 0).length >
              0 && (
              <PolygonWarningChart
                polygonWarningsCount={trainingAgeCount}
                title="Training Age Split"
                description="Age Ranges"
                defaultColor="#ff0000"
                tooltipContent={"Hello"}
                labelFormatter={(value) => value.toUpperCase()}
              />
            )}
            <GaugeChart
              title="Training Gender Split"
              subTitle={`Out of total ${trainingGenderSplit.female + trainingGenderSplit.male} Beneficiaries`}
              summary={`${trainingGenderSplit.female} / ${trainingGenderSplit.male}`}
              explanation="Female / Male"
              chartData={[
                {
                  month: "January",
                  valueLeft: trainingGenderSplit.female,
                  valueRight: trainingGenderSplit.male,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
