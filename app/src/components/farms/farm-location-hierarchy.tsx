import type { ILocation } from "@/types/location";
import { PrintKeyValue } from "@/components/print-key-value.tsx";

export function FarmLocationHierarchy({
  location,
}: {
  location: ILocation;
}): JSX.Element {
  if (!location) return <>"No location"</>;
  return (
    <ul className="grid gap-3">
      {location && (
        // First tier
        <>
          <PrintKeyValue label={location.type} value={location.name} />
          {location.parent && (
            // Second tier
            <>
              <PrintKeyValue
                label={location.parent.type}
                value={location.parent.name}
              />
              {location.parent && (
                // Third tier
                <>
                  {location.parent.parent && (
                    <>
                      <PrintKeyValue
                        label={location.parent.parent.type}
                        value={location.parent.parent.name}
                      />
                      {location.parent.parent.parent && (
                        // Fourth tier
                        <PrintKeyValue
                          label={location.parent.parent.parent.type}
                          value={location.parent.parent.parent.name}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </ul>
  );
}
