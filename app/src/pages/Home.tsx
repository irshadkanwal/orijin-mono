import { Link, Outlet, ReactNode } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

const hello = (): boolean => {
  console.log("Hello, world!");
  return false;
};

export const Home = (): FunctionComponent => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            {/*<MainNav items={marketingConfig.mainNav} />*/}
            <nav>
              <Link
                to="/dashboard"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <h3 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Orijin Back-office app
              </h3>
           </div>
          </section>
        </main>
        {/*<SiteFooter />*/}
      </div>
    </>
  );
};
