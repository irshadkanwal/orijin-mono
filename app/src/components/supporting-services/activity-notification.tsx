import { SupportServiceActivity } from "@/types/support-service";
import { Card,  CardHeader, CardTitle } from "../ui/card";

export function ActivityNotification({ activity }: { activity: SupportServiceActivity }) {
    return (
        // <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="grid gap-4 grid-cols-1">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                    <CardTitle>{activity.description}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
