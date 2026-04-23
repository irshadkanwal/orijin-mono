import { CenteredSpinner } from "@/components/centered-spinner";
import { farmQueryOptions } from "@/services/farm-service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { z } from "zod";
import * as turf from "@turf/turf";
import { Badge } from "@/components/ui/badge";
import type { Farm, Plot } from "@/types/farm";
import ExportPdfButton from "@/components/export-pdf-button";
import { useRef } from "react";

const EUDRReportSearchSchema = z.object({
  farmIds: z.array(z.string()).nonempty("At least one farm is required"),
});

type EUDRReport = z.infer<typeof EUDRReportSearchSchema>;

export const Route = createFileRoute("/_loggedin/farms/eudr-report")({
  component: EUDRReportPage,
  validateSearch: (search) => EUDRReportSearchSchema.parse(search),
});

function EUDRReportPage(): JSX.Element {
  const { farmIds } = Route.useSearch();
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: "/_loggedin/farms/eudr-report" });
  const pageRef = useRef<HTMLDivElement>(null);

  const farmsQuery = useSuspenseQuery({
    queryKey: ["eudr-farms", farmIds],
    queryFn: async () => {
      const farms = await Promise.all(
        farmIds.map(async (farmId) => {
          const queryOptions = farmQueryOptions(
            organisations.current,
            farmId,
            currentUser?.accessToken
          );
          const farmData = await queryOptions.queryFn();
          return farmData;
        })
      );
      return farms;
    },
  });

  if (farmsQuery.isLoading) {
    return <CenteredSpinner />;
  }

  if (farmsQuery.isError) {
    return <div>Error loading farms data</div>;
  }

  function getDeforRisk(plots: Plot[]) {
    const allAnalyses = plots.map((plot) => plot.satelliteAnalysis);
    const allAnalysesFlat = allAnalyses.flat();
    if (
      allAnalysesFlat.filter((x) => x.deforestationRisk === "high").length > 0
    ) {
      return "high";
    }
    if (
      allAnalysesFlat.filter((x) => x.deforestationRisk === "medium").length > 0
    ) {
      return "medium";
    }
    if (
      allAnalysesFlat.filter((x) => x.deforestationRisk === "low").length > 0
    ) {
      return "low";
    }
    if (allAnalysesFlat.length > 0) {
      return "pending";
    }
    return "";
  }

  return (
    <main className="p-4 sm:px-6 sm:py-4" ref={pageRef}>
      <div className="min-h-8 text-right">
        <ExportPdfButton
          elementRef={pageRef}
          filename="EUDR Risk Assessment Report"
        />
      </div>

      <div className="flex flex-col gap-1 items-center py-5">
        <div className="flex items-center gap-12 py-5">
          <div>
            <img
              src="/images/logo-dark.svg"
              height={100}
              width={200}
              alt="Orijin"
            />
          </div>
          <div>
            <img
              src="/images/ACM-logo.png"
              height={100}
              width={200}
              alt="Orijin"
            />
          </div>
        </div>
        <span className="inline-block max-w-98 text-sm text-center text-muted-foreground mt-3">
          This report is to certify that all necessary steps have been carried
          out for due diligence in accordance with regulation (EU) 2023/1115,
          and that no, or only negligible risk was found that the relevant
          products do not comply with Article 3, point (a) and (b) of that
          regulation.
        </span>
        <span className="inline-block max-w-96 text-sm text-center text-muted-foreground mt-3">
          Batch code: <b>DRAFT-DRAFT-1111</b>
          <br />
          Commodity: <b>Coffee</b>
          <br />
          Country of origin: <b>Uganda</b>
          <br />
          Quantity: <b>2.4 metric tons</b>
          <br />
        </span>
      </div>

      <table className="text-sm min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Shortcode</th>
            <th className="py-2 px-4 border-b text-left">Hectare Size</th>
            <th className="py-2 px-4 border-b text-left">Geolocation Type</th>
            <th className="py-2 px-4 border-b text-left">Lat / Long</th>
            <th className="py-2 px-4 border-b text-left">Defor Risk</th>
            <th className="py-2 px-4 border-b text-left">
              Legal Framework Result
            </th>
          </tr>
        </thead>
        <tbody>
          {farmsQuery.data.map((farm: Farm) => {
            const polygonDeforRiskBadge = () => {
              const deforRisk = getDeforRisk(farm.plots);
              if (deforRisk === "high" || deforRisk === "medium") {
                return <Badge variant="destructive">{deforRisk}</Badge>;
              }
              if (deforRisk === "low") {
                return <Badge variant="default">{deforRisk}</Badge>;
              }
              return <Badge variant="outline">Not done</Badge>;
            };

            return farm.plots.map((plot: Plot) => {
              const plotPolygon = plot.polygons[plot.polygons.length - 1];

              if (!plotPolygon) return;

              const polygonHectareSize =
                plotPolygon.areaCalculated &&
                parseFloat(plotPolygon.areaCalculated.toString())?.toFixed(2);
              const polygonCenter = turf.center(
                turf.points(plotPolygon.coordinates)
              ).geometry.coordinates;

              return (
                <tr key={plot.shortCode}>
                  <td className="py-2 px-4 border-b">
                    {farm.facility.shortCode}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {polygonHectareSize || "-"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {plotPolygon.coordinates?.length > 2 ? "Polygon" : "Point"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {polygonCenter[0].toFixed(6)} /{" "}
                    {polygonCenter[1].toFixed(6)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                      Not analyzed
                    </span>
                    {/*{polygonDeforRiskBadge()}*/}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                      Not analyzed
                    </span>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>

      <div className="mt-16 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="pt-5 pb-4 px-6 text-lg font-medium">
          <h3 className="">Deforestation detection methodology</h3>
        </div>
        <hr className="border-t" />
        <div className="flex gap-6 pt-4 pb-5 px-6 bg-white rounded-b-lg">
          <ul className="ml-8 flex flex-col gap-4 list-disc text-sm">
            <li>
              The geolocation has been tested to the criteria indicated below.
              These criteria have been defined to support an assessment of the
              deforestation risk in accordance with the requirements of
              Regulation (EU) 2023/1115, Article 2 (1 - 13) and Article 3 (a).
            </li>
            <li>
              The assessment is based on the scientifically validated datasets
              listed in the annex. Depending on the geographic location
              different datasets may be applicable.
            </li>
            <li>
              To achieve the best possible land cover map for the baseline date
              (31.12.2024) multiple datasets are combined. Auxiliary datasets
              like radar and optical satellite data and canopy height data are
              used to distinguish between forest (primary, natural regenerating,
              planted), shrubs (other wooded lands) and agricultural
              plantations, as required by the regulation. The result is a land
              cover map with world wide resolution of 10m to also support
              smallholder plots.
            </li>
            <li>
              The resulting deforestation risk is defined as follows: high risk
              is assigned if the deforested area is ≥ 0,5 ha (FAO minimum size
              to define a forest); a medium risk is assigned if the deforested
              area is ≥ 0,1 ha and {"<"}. 0,5ha; a low risk is assigned if the
              deforested area is less then 0,1 ha
            </li>
          </ul>
          <ul className="ml-8 flex flex-col gap-3 list-disc text-sm">
            <li>
              In case the plot contained forest at baseline date a change
              detection analysis using satellite data time series is conducted.
              The time span analysed covers the period from baseline date to
              production end date (harvest). As a result the deforested and
              degraded forest area are determined. If no forest was detected no
              change detection is conducted.
            </li>
            <li>
              It is understood that the analysis and the resulting risk
              assessment may contain errors. This may result e.g. from errors in
              the datasets used or limitations of the methodology applied. The
              service provider may not be held liable for these errors. It
              remains the sole responsibility of the operator to comply with the
              EUDR regulation.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="pt-5 pb-4 px-6 text-lg font-medium">
          <h3 className="">Legal framework and methodology</h3>
        </div>
        <hr className="border-t" />
        <div className="flex gap-6 pt-4 pb-5 px-6 bg-white rounded-b-lg text-sm">
          <span>
            Individual farmer and supplier-level responses are aggregated and
            analyzed using a weighted scoring methodology that assesses the risk
            of legal non-compliance according to the standards as set forth in
            the regulation. The application of the weighted scoring methodology
            produces a score for each farm plot, which determines whether that
            farm presents zero or negligible risk for legal non-compliance, or
            greater than zero or negligible risk for legal non-compliance. If a
            farm plot presents greater than zero or negligible risk for legal
            non-compliance, the Forests & Farmers First consortium offers a
            range of risk mitigation options.
          </span>
        </div>
      </div>
    </main>
  );
}
