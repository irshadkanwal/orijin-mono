import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { farmHistoryQueryOptions } from "@/services/farm-service";
import type { UserWithToken } from "@/types/auth";
import type { Farm } from "@/types/farm";
import type { ChangesDto } from "@orijin-server/changes/dto/changes.dto";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "../ui/badge";
import { ChevronDown } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
const capitalize = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/** Convert thisValueIsNice to this Value Is Nice */
const camelToSpaced = (str: string) =>
  str
    .replace(/([A-Z/])/g, (match) => " " + (match === "/" ? "" : match))
    .replace(/^[-]+/, "")
    .split(" ")
    .map((s) =>
      s === "Email"
        ? "E-mail"
        : s === "_id"
          ? "ID"
          : s === "Id"
            ? "ID"
            : s === "Url"
              ? "URL"
              : s
    )
    .join(" ");

const dist = (o?: string | Date) =>
  o && o !== undefined && o !== null
    ? formatDistanceToNowStrict(typeof o === "string" ? new Date(o) : o, {
        addSuffix: true,
      })
    : undefined;

const groupByProperty = <T, K extends keyof T>(
  array: T[],
  propertyName: K
): Record<string, T[]> =>
  array.reduce(
    (acc, item) => {
      const val = item[propertyName] as string;
      let list = acc[val];
      if (!list) {
        list = [item];
        acc[val] = list;
      } else {
        list.push(item);
      }
      return acc;
    },
    {} as Record<string, T[]>
  );

/**
 * For change objects, for all create transaction for specific object type,
 * show as Plot added, for deletes, Plot deleted and for updates, show the
 * differences row.
 */
function ChangeGroupByObjectType({
  objectType,
  changes,
  objectLabel,
}: {
  objectType: string;
  changes: ChangesDto[];
  objectLabel?: string;
}) {
  const [openTransactions, setOpenTransactions] = useState<string[]>([]);
  const groupings = useMemo(() => {
    const relationChanges = changes.filter((c) => c.objectType === objectType);
    // group by objectId
    const groupings = Object.fromEntries(
      Object.entries(
        // group by create/update/delete
        groupByProperty(relationChanges, "sourceType")
      ).map(([objectId, changes]) => [
        objectId,
        groupByProperty(changes, "objectId"),
      ])
    );
    return groupings;
  }, [changes, objectType]);

  return (
    <>
      {Object.entries(groupings).map(([action, items]) => (
        <Fragment key={action}>
          {Object.entries(items).map(([id, changes]) => (
            <Fragment key={`${action}-${id}`}>
              <TableRow className="border-t-2 border-l-2 border-r-2 border-b-2 bg-accent">
                <TableCell colSpan={5}>
                  <a
                    className="flex justify-between items-center cursor-pointer gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTransactions((open) =>
                        open.includes(changes[0]!.transaction)
                          ? open.filter((t) => t !== changes[0]!.transaction)
                          : [...open, changes[0]!.transaction]
                      );
                    }}
                  >
                    <b className="grow select-none outline-none inline-flex gap-1">
                      <Badge variant="outline">
                        {camelToSpaced(
                          capitalize(changes[0]!.operationType ?? "Create")
                        )}
                      </Badge>

                      <span>
                        {action === "create"
                          ? "New"
                          : action === "update"
                            ? "Change"
                            : "Delete"}
                      </span>
                      <span>{objectLabel ?? objectType}</span>
                      <span className="text-muted-foreground">{id}</span>
                    </b>
                    <b className="flex gap-1 items-center">
                      {dist(changes[0]?.startTime)}

                      <Badge className="text-sm" variant={"default"}>
                        {changes[0]?.updatedBy}
                      </Badge>
                    </b>

                    <ChevronDown
                      className={
                        openTransactions.includes(changes[0]!.transaction)
                          ? "h-4 w-4 shrink-0 rotate-180 transition-transform duration-200"
                          : "h-4 w-4 shrink-0 transition-transform duration-200"
                      }
                    />
                  </a>
                </TableCell>
              </TableRow>

              {openTransactions.includes(changes[0]!.transaction) ? (
                <PropertiesChange
                  changes={changes}
                  className="border-l-2 border-r-2"
                  lastClassName="border-l-2 border-r-2 border-b-2"
                  showOldValue={action === "update"}
                  emptyValue={
                    <span className="text-muted-foreground">Not set</span>
                  }
                />
              ) : null}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}

const RelationChange = ({
  objectType,
  changes,
  objectLabel,
}: {
  objectType: string;
  changes: ChangesDto[];
  objectLabel?: string;
}) => (
  <ChangeGroupByObjectType
    objectLabel={objectLabel}
    objectType={objectType}
    changes={changes}
  />
);

const PropertiesChange = ({
  objectType,
  changes,
  className,
  lastClassName,
  showOldValue,
  emptyValue,
}: {
  objectType?: string;
  changes?: ChangesDto[];
  className?: string;
  lastClassName?: string;
  showOldValue?: boolean; // true by default
  emptyValue?: React.ReactNode;
}) =>
  changes
    ?.filter((change) => (objectType ? change.objectType === objectType : true))
    ?.map((change: ChangesDto) => readableChange(change))
    .filter(Boolean)
    .map((change, index, arr) => (
      <PropertyChange
        key={change.id}
        change={change}
        className={index === arr.length - 1 ? lastClassName : className}
        showOldValue={showOldValue}
        emptyValue={emptyValue}
      />
    ));

const PropertyChange = ({
  showObjectType,
  change,
  className,
  showOldValue,
  emptyValue,
}: {
  showObjectType?: boolean; // true by default
  change: Partial<ChangesDto>;
  className?: string;
  showOldValue?: boolean; // true by default
  emptyValue?: React.ReactNode;
}) => (
  <TableRow key={change.id} className={className}>
    <TableCell className="whitespace-nowrap">
      {showObjectType ?? true
        ? change.objectType + " - " + change.name
        : change.name}
    </TableCell>
    <TableCell className="whitespace-nowrap">
      {dist(change.startTime)}
    </TableCell>
    <TableCell className="hidden sm:table-cell">
      {showOldValue ?? true ? change.oldValue ?? emptyValue ?? "" : ""}
      {showOldValue ?? true ? (
        <span className="text-muted-foreground"> → </span>
      ) : (
        ""
      )}
      {change.newValue ?? emptyValue ?? ""}
    </TableCell>
  </TableRow>
);

const readableValue = (value: string | null | undefined) => {
  let newValue: string | null | undefined = value;

  // Scalars and well-known *empty* enums
  if ([null, undefined, "null", "[]", "NotSet", "NaN"].includes(newValue)) {
    newValue = undefined;
  }

  // Object
  if (newValue && newValue.startsWith("{") && newValue.endsWith("}")) {
    try {
      newValue = JSON.stringify(JSON.parse(newValue), null, 2);
    } catch (e) {
      // ignore
    }
  }

  // Array
  if (newValue && newValue.startsWith("[") && newValue.endsWith("]")) {
    try {
      newValue = JSON.stringify(JSON.parse(newValue), null, 2);
    } catch (e) {
      // ignore
    }
  }

  return newValue;
};

const readableChange = (change: ChangesDto) => {
  const oldValue: string | null | undefined = readableValue(change.oldValue);
  const newValue: string | null | undefined = readableValue(change.newValue);
  return oldValue != newValue ? { ...change, oldValue, newValue } : undefined;
};

export function FarmHistory({
  organisationId,
  farm,
  currentUser,
}: {
  organisationId: string;
  farm: Farm;
  currentUser?: UserWithToken;
}) {
  const response = useSuspenseQuery(
    farmHistoryQueryOptions(organisationId, farm.id, currentUser?.accessToken)
  );
  const farmHistory = response.data;
  if (!farmHistory) {
    return <>Loading</>;
  }

  return (
    <>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Farms</CardTitle>
          <CardDescription>History of changes for {farm.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <colgroup>
              <col style={{ width: "1%" }} />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Property</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">New</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <RelationChange objectType="Plot" changes={farmHistory} />
              <RelationChange objectType="Facility" changes={farmHistory} />
              <RelationChange
                objectType="Person"
                changes={farmHistory}
                objectLabel="Main contact person"
              />
              <PropertiesChange
                changes={farmHistory}
                objectType="Farm"
                emptyValue={
                  <span className="text-muted-foreground">Not set</span>
                }
              />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
