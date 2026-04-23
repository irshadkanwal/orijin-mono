import { format } from "date-fns";

type PrintValueParams = {
  label: string;
  value: string | number | Date | null | undefined;
  type?: "string" | "date" | "decimal";
};

export const PrintKeyValue = ({
  label,
  value,
  type = "string",
}: PrintValueParams) => {
  if (!value) {
    return null;
  }
  let displayValue;
  if (type === "date") {
    displayValue = format(new Date(value as string), "dd.MM.yyyy");
  } else if (type === "decimal") {
    const float = parseFloat(value as string);
    displayValue = !isNaN(float) ? float.toFixed(2) : "-";
  } else {
    displayValue = value as string;
  }
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground capitalize">{label}</span>
      <span>{displayValue ?? "-"}</span>
    </li>
  );
};
