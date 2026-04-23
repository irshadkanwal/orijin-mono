import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { MainNavProps } from "@/types";
import { cn } from "@/lib/utils.ts";

export function HamburgerNavigation({
  items,
  showAnnouncement = false,
}: MainNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <img
              src="/images/logo-dark.svg"
              height={50}
              width={100}
              alt="hello"
            />
            {/*<span className="sr-only">Acme Inc</span>*/}
          </Link>

          {items?.map((item, index) => (
            <Link
              key={index}
              to={item.disabled ? "#" : item.href}
              activeProps={{
                className: "bg-muted text-foreground",
              }}
              inactiveProps={{
                className: "text-muted-foreground",
              }}
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                // item.href.startsWith(`/${segment}`)
                //   ? "text-foreground"
                //   : "text-foreground/60",
                // item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.title}
            </Link>
          ))}
        </nav>

        {showAnnouncement && (
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
