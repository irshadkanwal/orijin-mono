import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { HamburgerNavigation } from "@/components/layout/HamburgerNavigation.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation.tsx";
import { Icons } from "@/components/icons";
import type { MainNavItem } from "@/types";
import { Suspense, useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import { fetchAllQueryOptions } from "@/services/common-service";
import type { Season } from "@/types/season";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_loggedin")({
  component: LayoutComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.currentUser) {
      throw redirect({
        to: "/login",
      });
    }
    return {
      context,
    };
  },
});

function LayoutComponent() {
  const { auth } = useRouteContext({ from: "/_loggedin" });

  // Active season
  const [seasonCode, setSeasonCode] = useState<string | undefined>();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient
      .ensureQueryData(
        fetchAllQueryOptions<Season>(
          auth.organisations.current,
          "seasons",
          { page: 1, limit: 9999 },
          auth.currentUser?.accessToken
        )
      )
      .then((result) => {
        setSeasonCode(result.data.find((s) => s.active)?.shortCode);
      })
      .catch((error) => {
        console.warn("Error fetching seasons", error);
      });
  }, [auth]);
  window.scrollTo(0, 0);
  const items: MainNavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Icons.dashboard,
      disabled: false,
    },
    {
      title: "Farms",
      href: "/farms" + (seasonCode ? `?seasonCode=${seasonCode}` : ""),
      icon: Icons.fence,
      disabled: false,
    },
    {
      title: "Persons",
      href: "/persons",
      icon: Icons.user,
      disabled: false,
    },
    {
      title: "Services",
      href: "/supporting-services?tab=activities",
      icon: Icons.earth,
      disabled: false,
    },
    {
      title: "Lots",
      href: "/lots",
      icon: Icons.boxIcon,
      disabled: false,
    },
    {
      title: "Payment Transactions",
      href: "/payment-transactions",
      icon: Icons.HandCoins,
      disabled: false,
    },
    {
      title: "Configuration",
      href: "",
      icon: Icons.settings,
      disabled: false,
      subItems: [
        {
          title: "Import Data",
          href: "/configurations/import-data",
          icon: Icons.import,
          disabled: false,
        },
        {
          title: "Services",
          href: "",
          icon: Icons.settings,
          disabled: false,
          subItems: [
            {
              title: "Service Types",
              href: "/configurations/service-category-types",
              icon: Icons.settings,
              disabled: false,
            },
            {
              title: "Programs",
              href: "/configurations/service-categories",
              icon: Icons.settings,
              disabled: false,
            },
            {
              title: "Activity Types",
              href: "/configurations/service-activity-types",
              icon: Icons.settings,
              disabled: false,
            },
            {
              title: "Input Types",
              href: "/configurations/service-input-types",
              icon: Icons.settings,
              disabled: false,
            },
          ],
        },
        {
          title: "Crops",
          href: "/configurations/crops",
          icon: Icons.sprout,
          disabled: false,
        },
        {
          title: "Crop Varieties",
          href: "/configurations/crop-varieties",
          icon: Icons.sprout,
          disabled: false,
        },
        {
          title: "Product Types",
          href: "/configurations/product-types",
          icon: Icons.productTypes,
          disabled: false,
        },
        {
          title: "Products",
          href: "/configurations/products",
          icon: Icons.product,
          disabled: false,
        },
        {
          title: "Seasons",
          href: "/configurations/seasons",
          icon: Icons.season,
          disabled: false,
        },
        {
          title: "Prices",
          href: "/configurations/prices",
          icon: Icons.price,
          disabled: false,
        },
        {
          title: "Locations",
          href: "/configurations/locations",
          icon: Icons.mapPin,
          disabled: false,
        },
        {
          title: "Users",
          href: "/configurations/users",
          icon: Icons.users,
          disabled: false,
        },
        {
          title: "Certification Types",
          href: "/configurations/certification-types",
          icon: Icons.certificate,
          disabled: false,
        },
        {
          title: "Vessels",
          href: "/configurations/vessels",
          icon: Icons.ship,
          disabled: false,
        },
        {
          title: "Facilities",
          href: "/configurations/facilities",
          icon: Icons.factory,
          disabled: false,
        },
      ],
    },
  ];

  if (auth.isAdmin) {
    items.push({
      title: "ADMIN",
      href: "",
      icon: Icons.settings,
      disabled: false,
      subItems: [
        {
          title: "Production Data",
          href: "/production-data",
          icon: Icons.files,
        },
        {
          title: "Field Tasks",
          href: "/field-tasks",
          icon: Icons.fileCheck,
          disabled: false,
        },
        {
          title: "Organisations",
          href: "/configurations/organisations",
          icon: Icons.organisationBuilding,
          disabled: false,
        },
      ],
    });
  }

  return (
    <div className="grid min-h-screen h-auto w-full md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr] overflow-y-auto transition-all ease-in-out duration-2000">
      {/*Full screen sidebar - hidden by default, in md becomes "block" */}
      <SidebarNavigation items={items} />

      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 ">
          <HamburgerNavigation items={items} />
          <Header />
        </header>
        <div className="flex-1 max-h-fit h-dvh  overflow-auto overflow-x-hidden">
          <Suspense
            fallback={
              <div className="fixed left-[55vw]">
                <Loader />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
