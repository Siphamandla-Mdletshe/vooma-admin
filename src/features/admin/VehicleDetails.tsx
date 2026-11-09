import type { Vehicle } from "./data";

export function VehicleDetails({ vehicle }: { vehicle: Vehicle }) {
  const fields = [
    ["Number plate", vehicle.plate],
    ["Make", vehicle.make],
    ["Model", vehicle.model],
    ["Year", vehicle.year],
    ["Colour", vehicle.colour],
    ["Registered driver", vehicle.driver],
    ["Vehicle ID", vehicle.id],
    ["Submitted", vehicle.submitted],
  ];

  return (
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
  );
}
