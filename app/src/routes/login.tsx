import { Link, createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { UserAuthForm } from "@/components/user-auth-form.tsx";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          {/*<Icons.chevronLeft className="mr-2 h-4 w-4" />*/}
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          {/*<Icons.logo className="mx-auto h-6 w-6" />*/}
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            to="/dashboard"
            className="hover:text-brand underline underline-offset-4"
          >
            Top Secret Testing Link!
          </Link>
        </p>
      </div>
    </div>
  );
}
