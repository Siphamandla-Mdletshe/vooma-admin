import type { Driver } from "./data";

export function selectedDriversCsv(drivers: Driver[]) {
  const cell = (value: unknown) => {
    const text = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
    return '"' + safe.replace(/"/g, '""') + '"';
  };
  return (
    "\uFEFF" +
    [
      [
        "Application ID",
        "Driver",
        "Email",
        "Phone",
        "City",
        "Vehicle",
        "Plate",
        "Body type",
        "Status",
      ],
      ...drivers.map((driver) => [
        driver.id,
        driver.name,
        driver.email,
        driver.phone,
        driver.city,
        driver.vehicle,
        driver.plate,
        driver.vehicleBodyType,
        driver.status,
      ]),
    ]
      .map((row) => row.map(cell).join(","))
      .join("\r\n")
  );
}
