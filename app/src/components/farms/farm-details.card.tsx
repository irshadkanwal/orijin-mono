import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PrintKeyValue } from "@/components/print-key-value";
import { Separator } from "@/components/ui/separator";
import { FarmLocationHierarchy } from "./farm-location-hierarchy";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { Farm, Person } from "@/types/farm";
import { Icons } from "../icons";

interface FarmDetailsCardProps {
  farm: Farm;
  mainContactPerson: Person | undefined;
}

export function FarmDetailsCard({
  farm,
  mainContactPerson,
}: FarmDetailsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Farm Details</div>
          <ul className="grid gap-3">
            <PrintKeyValue
              label="Approval status"
              value={farm.approvalStatus}
            />
            <PrintKeyValue
              label="Contract Date"
              value={farm.contractDate}
              type="date"
            />
            <PrintKeyValue
              label="Registration Date"
              value={farm.registrationDate}
              type="date"
            />
            <PrintKeyValue
              label="Last Inspection Date"
              value={farm.lastInspectionDate}
              type="date"
            />
            <PrintKeyValue
              label="Area Total Manual (h)"
              value={farm.facility.areaTotalManual}
              type="decimal"
            />
            <PrintKeyValue
              label="Area Total Calculated"
              value={farm.areaTotal}
              type="decimal"
            />
          </ul>

          {/*<pre>{JSON.stringify(farm.facility.coordinate, null, 4)}</pre>*/}

          <Separator className="my-2" />

          {mainContactPerson && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Contact Person / Farmer</span>
                <Link
                  className="blue underline"
                  to={`/persons/${mainContactPerson.id}`}
                >
                  View person
                </Link>
              </div>

              <ul className="grid gap-3">
                <PrintKeyValue
                  label="Name"
                  value={`${mainContactPerson.firstName} ${mainContactPerson.lastName}`}
                />
                <PrintKeyValue
                  label="Gender"
                  value={mainContactPerson.gender}
                />
                <PrintKeyValue
                  label="Date of Birth"
                  value={mainContactPerson.dateOfBirth}
                  type="date"
                />
                <PrintKeyValue
                  label="Marital Status"
                  value={mainContactPerson.maritalStatus}
                />
                <PrintKeyValue label="Phone" value={mainContactPerson.phone} />
                <PrintKeyValue label="Email" value={mainContactPerson.email} />
                <PrintKeyValue
                  label="Identification Number"
                  value={mainContactPerson.identificationNumber}
                />
                <PrintKeyValue
                  label="Identification Number Type"
                  value={mainContactPerson.identificationNumberType}
                />
              </ul>
            </>
          )}

          <Separator className="my-2" />

          <div className="font-semibold">Processing Facility</div>
          <ul className="grid gap-3">
            <PrintKeyValue
              label="Parent Facility"
              value={farm.parentFacilityName}
            />
          </ul>

          <Separator className="my-2" />

          <div className="font-semibold">Country</div>
          <ul className="grid gap-3">
            <PrintKeyValue label="Country" value={farm.facility.countryIso} />
          </ul>

          <Separator className="my-2" />

          <div className="font-semibold">Location</div>
          <FarmLocationHierarchy location={farm.facility.location} />

          <Separator className="my-2" />

          <div className="font-semibold">Farmer Group</div>
          <FarmLocationHierarchy location={farm.facility.customLocation} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{" "}
          <time dateTime={farm.updatedAt}>
            {new Date(farm.updatedAt).toISOString()}
          </time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <Icons.chevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <Icons.chevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
