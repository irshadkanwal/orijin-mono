import { ReferenceData } from "@/components/reference/reference-data";
import {
  certificationTypesTableFilters,
  initialCertificationTypesColumns,
} from "@/config/certification-types-columns";
import { rootKeys } from "@/config/rootKeys";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(rootKeys.configurationsCertificationTypes)({
  loaderDeps: ({ search }) => {
    const parsed = commonTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const { page, limit, name } = parsed.data;
    return { page, limit, name };
  },

  loader: async ({ deps, context, location }) => {
    // Extract the last path segment
    const lastPathSegment: string =
      location.pathname.split("/").filter(Boolean).pop() ?? "";
    const { queryClient, auth } = context;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data = await queryClient.ensureQueryData(
      fetchAllQueryOptions(
        auth.organisations.current,
        lastPathSegment,
        deps,
        auth.currentUser?.accessToken
      )
    );
    return {
      data,
      lastPathSegment,
    };
  },
  validateSearch: (search) => {
    const result = commonTableQuerySchema.safeParse(search);
    return result.success ? result.data : {};
  },
  component: ConfigurationCertificationTypeComponent,
});

function ConfigurationCertificationTypeComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsCertificationTypes,
  });

  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={initialCertificationTypesColumns}
        rootKey={rootKeys.configurationsCertificationTypes}
        tableFilters={certificationTypesTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Certification Types"
      />
    </div>
  );
}
