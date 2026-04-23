import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export enum AgeStatus {
  UNKNOWN = "Unknown",
  UNDER_18 = "Under 18",
  YOUTH = "Youth",
  ADULT = "Adult",
  ELDER = "Elder",
}

export enum ParentLevels {
  LEVEL_0 = 0,
  LEVEL_1 = 1,
  LEVEL_2 = 2,
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const copy = {} as T;
  (Object.keys(obj) as K[])
    .filter((key) => !keys.includes(key))
    .forEach((key) => {
      copy[key] = obj[key];
    });
  return copy;
};

export const generateFilters = (query: any, properties: string[]) => {
  const filters: Record<string, string> = {};
  const filterProperties = properties;
  filterProperties.forEach((prop) => {
    if (query[prop as keyof any]) {
      filters[prop] = query[prop as keyof any] as string;
    }
  });
  return filters;
};

/**
 * The other filter generator expects an array of properties to include
 * but with v1Documents we do not know filter properties to include
 * so instead we just remove the properties we do not want
 * @param {Record<string, any>} query -
The filter object
 * @param {string[]} [excludedProperties] - The properties to exclude,
by default they are page, limit, sort, sortOrder
 * @returns {Record<string, string>}
 */
export const generateDynamicFiltersWithExclude = (
  query: Record<string, any>,
  excludedProperties: string[] = ["page", "limit", "sort", "sortOrder"]
) => {
  const filters: Record<string, string> = {};

  Object.keys(query).forEach((key) => {
    if (
      !excludedProperties.includes(key) &&
      query[key] !== undefined &&
      query[key] !== null
    ) {
      filters[key] = query[key]; // Add the remaining key-value pairs to filters
    }
  });

  return filters;
};

export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If the current date is before the birthday this year, subtract one year from the age
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function calculateTheStatusOfAge(dateOfBirth: string) {
  let status: AgeStatus = AgeStatus.UNKNOWN;
  const age = calculateAge(dateOfBirth);
  if (age < 18) {
    status = AgeStatus.UNDER_18;
  } else if (age >= 18 && age <= 30) {
    status = AgeStatus.YOUTH;
  } else if (age > 30 && age <= 50) {
    status = AgeStatus.ADULT;
  } else if (age > 50) {
    status = AgeStatus.ELDER;
  }
  return status;
}

export function calculateThePercentageOfGender(
  gender: string,
  beneficiaries?: any[]
) {
  if (!beneficiaries || beneficiaries.length === 0) return 0;
  const genderLength = beneficiaries.filter(
    (beneficiary) => beneficiary.person?.gender?.toLowerCase() === gender
  ).length;
  if (genderLength === 0) return 0;
  return Math.round((genderLength / beneficiaries.length) * 100);
}

export function countAgeGroups(
  status: AgeStatus,
  beneficiaries?: any[]
): { count: number; percentage: number } {
  let count = 0;
  if (!beneficiaries || beneficiaries.length === 0)
    return { count, percentage: 0 };
  beneficiaries.forEach((beneficiary) => {
    const ageStatus = calculateTheStatusOfAge(beneficiary.person.dateOfBirth);
    if (ageStatus.toLocaleLowerCase() === status.toLocaleLowerCase()) {
      count++;
    }
  });
  // Calculate the percentage based on the total number of beneficiaries
  const percentage = (count / beneficiaries.length) * 100;

  return { count, percentage: parseFloat(percentage.toFixed(2)) };
}

export function getUniqueParentNamesOfCustomLocation(
  parentLevel: ParentLevels = ParentLevels.LEVEL_0,
  customLocations?: any[]
) {
  const parentNames = new Set(); // To store unique parent names

  // Loop through each item in the data
  customLocations?.forEach((item) => {
    let currentLocation = item.location;

    // Directly add the shortCode for LEVEL_0 without any loop
    if (parentLevel === ParentLevels.LEVEL_0 && currentLocation?.shortCode) {
      parentNames.add(currentLocation.shortCode);
      return; // No further traversal required for LEVEL_0
    }

    // Traverse up through the parents and add their names based on the specified parent level
    while (currentLocation) {
      if (parentLevel === ParentLevels.LEVEL_1 && currentLocation.parent) {
        parentNames.add(currentLocation.parent.shortCode);
        currentLocation = currentLocation.parent;
      } else if (
        parentLevel === ParentLevels.LEVEL_2 &&
        currentLocation.parent?.parent
      ) {
        parentNames.add(currentLocation.parent.parent.shortCode);
        currentLocation = currentLocation.parent.parent;
      } else {
        break; // Exit loop if no more parents or not matching parent level
      }
    }
  });

  // Convert Set to comma-separated string
  return Array.from(parentNames).join(", ");
}

export function getAllFacilitySize(person: any) {
  // Initialize variables
  let count = 0;
  let totalArea = 0;

  // Iterate over each mainContactPersonFor
  person.mainContactPersonFor.forEach((contact) => {
    const facilities = contact.location?.facilities;
    if (facilities) {
      // Filter and calculate for the current facility
      facilities
        .filter((facility) => facility.mainContactPersonId === person.id)
        .forEach((entry) => {
          count += 1; // Increment count for each entry
          if (entry.areaTotalManual) {
            totalArea += parseFloat(entry.areaTotalManual);
          }
        });
    }
  });

  return {
    facilityCount: count,
    facilityTotalArea: totalArea,
  };
}

export const initializeCountArray = (ageRanges: any) =>
  ageRanges.map((range) => ({
    key: range.label,
    value: 0,
    color: "#2563eb",
  }));

export function getUniquePersonNames(data) {
  // Create a Set to store unique names
  const uniqueNames = new Set();

  // Iterate over the data array
  data.forEach((item) => {
    // Destructure firstName and lastName from the person object
    const { firstName, lastName } = item.person;

    // Combine firstName and lastName to form the full name
    const fullName = `${firstName} ${lastName}`.trim();

    // Add the full name to the Set to ensure uniqueness
    if (fullName) {
      uniqueNames.add(fullName);
    }
  });

  // Convert the Set to an array and join with a comma separator
  return Array.from(uniqueNames).join(", ");
}
