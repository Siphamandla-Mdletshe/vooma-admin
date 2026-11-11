import type { Vehicle } from "./data";
import { VehiclePhoto } from "./VehiclePhoto";
import { bodyTypeLabels } from "./application-filters";

export function VehicleDetails({
  vehicle,
  accessToken,
}: {
  vehicle: Vehicle;
  accessToken: string;
}) {
  const fields = [
    ["Number plate", vehicle.plate],
    ["Make", vehicle.make],
    ["Model", vehicle.model],
    ["Year", vehicle.year],
    ["Colour", vehicle.colour],
    [
      "Body type",
      vehicle.bodyType
        ? (bodyTypeLabels[vehicle.bodyType] ?? vehicle.bodyType)
        : undefined,
    ],
    ["Registered driver", vehicle.driver],
    ["Vehicle ID", vehicle.id],
    ["Submitted", vehicle.submitted],
  ];

  return (
    <div>
      <VehiclePhoto vehicle={vehicle} accessToken={accessToken} large />
      <dl className="registered-vehicle-details">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              {value === null || value === undefined || value === ""
                ? "Not provided"
                : value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
