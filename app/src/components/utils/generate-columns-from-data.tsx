import { ColumnDef } from "@tanstack/react-table";
/**
 * Flattens a nested object into a single-level object.
 * This not currently used with fieldTask because
 * when we flatten the object, we have tons of nested objects
 * but it's a useful utility function to have.
 */

const flattenObject = (
  obj: any,
  parentKey = "",
  result: { [key: string]: any } = {}
) => {
  for (let key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], fullKey, result);
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
};

/**
 * FOrmats the giving string like  ColumnName to Column Name
 *
 * @param {string} key - The string to be formatted
 * @returns {string} - Returns a formatted string
 */
const formatHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

/**
 * Generates dynamic columns forum table data.
 *
 * This function flattens any nested objects in the data and creates a column for each key.
 * It also provides custom cell renderers for timestamps (converts them to readable dates)
 * and numbers (formats them with commas for readability).
 *
 * @param {Array<any>} data - The array of objects for which the table columns will be generated.
 * @returns {Array<ColumnDef<unknown, any>>} - Returns an array of ColumnDef objects to be used in the table.
 */
export const generateDynamicColumns = (
  data: any[]
): ColumnDef<unknown, any>[] => {
  if (!data?.length) return [];

  // Extract the keys for the first document to generate the columns
  const sampleData = data[0]!;

  return Object.keys(sampleData).map((key) => {
    const isTimestamp = key.includes("Date") || key.includes("_seconds");
    const isNumber = typeof data[0]![key] === "number";
    return {
      id: key,
      accessorKey: key,
      header: formatHeader(key),
      cell: ({ getValue }) => {
        const value = getValue();

        // Handle date fields
        if (isTimestamp && value?._seconds) {
          const date = new Date(value._seconds * 1000);
          return date.toLocaleDateString();
        }

        if (isNumber) {
          return new Intl.NumberFormat().format(value);
        }

        if (typeof value === "object" && value !== null) {
          // Render the object properties stacked vertically
          return (
            <div className="flex flex-col space-y-1">
              {Object.entries(value).map(([subKey, subValue]) => (
                <div key={subKey}>
                  <span className="text-muted-foreground">{subKey}: </span>
                  <span>
                    {typeof subValue === "object" && subValue !== null
                      ? JSON.stringify(subValue) // Handle nested objects
                      : subValue === null
                        ? "-"
                        : String(subValue)}{" "}
                  </span>
                </div>
              ))}
            </div>
          );
        }
        if (value === null || value === undefined) {
          return "";
        }
        return String(value);
      },
    };
  }) as ColumnDef<unknown, any>[];
};
