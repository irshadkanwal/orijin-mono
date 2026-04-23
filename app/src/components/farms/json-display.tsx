import ReactJson from "@microlink/react-json-view";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export function JsonDisplay({ jsonArray }: { jsonArray: JSON[] }) {
  return (
    <>
      {jsonArray.map((json) => {
        return (
          <Card>
            <CardHeader className="px-7">
              <CardTitle>
                {new Date(json.createdAt).toLocaleDateString()}
              </CardTitle>
              {/*<CardDescription>History of changes for {farm.id}</CardDescription>*/}
            </CardHeader>
            <CardContent>
              <ReactJson src={json.payload?.entity || json} collapsed={2} />
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
