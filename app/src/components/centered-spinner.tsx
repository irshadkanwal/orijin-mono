import { cn } from "@/lib/utils";
import { Icons } from "./icons";

interface CenteredSpinnerProps {
  className?: string;
}

export const CenteredSpinner: React.FC<CenteredSpinnerProps> = ({
  className,
}) => {
  return (
    <div
      className={cn("flex justify-center items-center min-h-[80vh]", className)}
    >
      <Icons.spinner className="animate-spin h-12 w-12" />
    </div>
  );
};
