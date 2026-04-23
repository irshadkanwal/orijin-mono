import type { MainNavProps, MainNavItem } from "@/types";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import { Icons } from "../icons";

// Full screen sidebar - hidden by default, in md becomes "block" */}
export function SidebarNavigation({
  items,
  showAnnouncement = false,
}: MainNavProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const router = useRouter();

  // Function to toggle open state
  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Function to handle click: navigate and toggle
  const handleClick = (item: MainNavItem) => {
    if (item.subItems) {
      toggleItem(item.title);
    }
    if (!item.disabled && item.href) {
      router.navigate({ to: item.href });
    }
  };

  // Recursive function to render navigation items
  const renderNavItems = (navItems?: MainNavItem[]) => {
    return navItems?.map((item: MainNavItem, index: number) => (
      <div key={index}>
        <div
          onClick={() => handleClick(item)}
          className={cn(
            "flex items-center justify-between cursor-pointer gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.title}
          </div>
          {item.subItems && (
            <span className="text-muted-foreground">
              {openItems[item.title] ? <Icons.chevronDown className="h-4 w-4" /> : <Icons.chevronUp className="h-4 w-4" />}
            </span>
          )}
        </div>
        {item.subItems && openItems[item.title] && (
          <div className="pl-4">{renderNavItems(item.subItems)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {/*<Package2 className="h-6 w-6" />*/}
            {/*<span className="">Acme Inc</span>*/}
            <img
              src="/images/logo-dark.svg"
              height={50}
              width={100}
              alt="Orijin"
            />
          </Link>
        </div>
        <div className="flex-1 pt-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {renderNavItems(items)}
          </nav>
        </div>

        {/*Announcement box*/}
        {showAnnouncement && (
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
