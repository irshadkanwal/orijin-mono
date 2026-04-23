import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { generateDynamicColumns } from "../utils/generate-columns-from-data";

type DashBoardTableProps = {
  data: any[];
  tableHeader: string;
};

export function DashboardTable({ data, tableHeader }: DashBoardTableProps) {
  const columns = generateDynamicColumns(data);

  return (
    <Card className="w-full" style={{ backgroundColor: "#efefef" }}>
      <CardHeader className="font-bold text-xl">{tableHeader}</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {columns.map((column, index) => (
              <TableHead
                key={column.accessorKey}
                className={
                  index === 0
                    ? "sticky left-0 bg-secondary z-10 rounded-t-sm"
                    : ""
                }
              >
                {column.header}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.accessorKey}
                    className={
                      index === 0
                        ? "sticky left-0 bg-secondary z-10 rounded-b-sm"
                        : ""
                    }
                  >
                    {row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
