import type { Driver } from "./data";

export const applicationStatusLabels: Record<string, string> = {
  submitted: "Pending review",
  underReview: "Under review",
  changesRequested: "Changes requested",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

export const applicationTabs = [
  "All",
  ...Object.values(applicationStatusLabels),
];
export const bodyTypeLabels: Record<string, string> = {
  hatchback: "Hatchback",
  sedan: "Sedan",
  suv: "SUV",
  mpv: "MPV / people carrier",
  wagon: "Station wagon",
  coupe: "Coupe",
  convertible: "Convertible",
  pickup: "Pickup",
  van: "Van",
  other: "Other",
};

export type ApplicationFilters = {
  city: string;
  make: string;
  bodyType: string;
  appealsOnly: boolean;
  from: string;
  until: string;
  sort: "newest" | "oldest" | "updated" | "name";
};

export const initialApplicationFilters: ApplicationFilters = {
  city: "",
  make: "",
  bodyType: "",
  appealsOnly: false,
  from: "",
  until: "",
  sort: "newest",
};

function dateKey(timestamp?: number) {
  if (timestamp === undefined) return "";
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function filterApplications(
  drivers: Driver[],
  query: string,
  filters: ApplicationFilters,
) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return drivers
    .filter((driver) => {
      if (!applicationTabs.slice(1).includes(driver.status)) return false;
      const search = [
        driver.id,
        driver.name,
        driver.email,
        driver.phone,
        driver.plate,
        driver.vehicle,
        driver.city,
      ]
        .join(" ")
        .toLowerCase();
      const created = dateKey(driver.createdAt);
      return (
        terms.every((term) => search.includes(term)) &&
        (!filters.city || driver.city === filters.city) &&
        (!filters.make || driver.vehicleMake === filters.make) &&
        (!filters.bodyType || driver.vehicleBodyType === filters.bodyType) &&
        (!filters.appealsOnly || driver.appeal?.status === "pending") &&
        (!filters.from || (!!created && created >= filters.from)) &&
        (!filters.until || (!!created && created <= filters.until))
      );
    })
    .sort((left, right) => {
      const difference =
        filters.sort === "name"
          ? left.name.localeCompare(right.name)
          : filters.sort === "oldest"
            ? (left.createdAt ?? 0) - (right.createdAt ?? 0)
            : filters.sort === "updated"
              ? (right.updatedAt ?? 0) - (left.updatedAt ?? 0)
              : (right.createdAt ?? 0) - (left.createdAt ?? 0);
      return difference || left.id.localeCompare(right.id);
    });
}
