import { Card } from "@/components/ui/card";
import type { Polygon } from "@/types/farm";
import { Link, useNavigate } from "@tanstack/react-router";

type PolygonCardProps = {
  polygon: any;
  onClose: () => void;
};

export const PolygonCard: React.FC<PolygonCardProps> = ({
  onClose,
  polygon,
}) => {
  const navigation = useNavigate();

  const onLinkClick = (link: string) => {
    onClose();
    navigation({ to: `/farms/${link}` });
  };
  return (
    <Card
      className="absolute top-1 left-1 bg-white p-4 z-10" /* styles for the popup */
    >
      <button
        onClick={onClose}
        className="absolute top-0 right-2 hover:cursor-pointer bg-none border-none font-[20px]"
      >
        &times;
      </button>
      <div className="flex flex-col">
        <p>
          <strong>Farmer:</strong>&nbsp;{polygon.farmShortCode}
        </p>
        <p>
          <strong>Plot:</strong>&nbsp;{polygon.plotShortCode}
        </p>
        {!!polygon?.overlappingPolygons?.length && (
          <div>
            <strong>Overlapping Plots:</strong>
            <div className="flex flex-col">
              {polygon?.overlappingPolygons?.map(
                (polygon: Polygon, indx: number) => (
                  <p
                    key={indx}
                    onClick={() => {
                      onLinkClick(polygon.plot.farmId);
                    }}
                    className="underline text-blue-600 cursor-pointer"
                  >
                    {polygon.plot.shortCode}
                  </p>
                )
              )}
            </div>
          </div>
        )}
        <p>
          <strong>Facility:</strong>&nbsp;{polygon.facilityName}
        </p>
        <p>
          <strong>Area:</strong>&nbsp;
          {Number(polygon.areaCalculated).toFixed(2)}&nbsp;ha
        </p>
        <p>
          <strong>UpdatedBy:</strong>&nbsp;{polygon.updatedBy}
        </p>
        <p>
          <strong>UpdatedAt:</strong>&nbsp;
          {polygon.updatedAt
            ? new Date(polygon.updatedAt).toLocaleDateString()
            : ""}
        </p>
        <Link to={`/farms/${polygon.id}`} className="underline text-blue-600">
          View Farm
        </Link>
      </div>
    </Card>
  );
};
