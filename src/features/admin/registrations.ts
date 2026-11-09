import { apiBaseUrl } from "./auth";
import type { Driver, Vehicle } from "./data";

export type RegistrationDocument = {
  id: string;
  kind: string;
  mime: string;
  size: number;
  expiry: string | null;
  scan: "pending" | "clean" | "rejected";
  createdAt: number;
};
export type RegistrationDocuments = {
  documents: RegistrationDocument[];
  requirements: {
    kind: string;
    required: boolean;
    expiry: boolean;
    imageOnly: boolean;
  }[];
};
type Registration = {
  id: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  profile: { name: string; email: string; phone: string; city: string } | null;
  vehicle: {
    plate: string;
    make: string;
    model: string;
    year: number;
    colour: string;
  } | null;
};

export async function registrationRequest(
  path: string,
  accessToken: string,
  signal: AbortSignal,
) {
  const response = await fetch(apiBaseUrl() + "/v1/admin/drivers" + path, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    credentials: "omit",
    signal,
  });
  if (!response.ok) {
    if (response.status === 401)
      throw new Error(
        "Your admin session has expired. Sign out and sign in again.",
      );
    if (response.status === 404)
      throw new Error(
        "This registration or document is no longer available. Refresh the list.",
      );
    if (response.status === 409)
      throw new Error(
        "This document cannot be viewed until its security scan is clean.",
      );
    throw new Error("Unable to load registration data. Please try again.");
  }
  return response;
}

const statuses: Record<string, string> = {
  draft: "Incomplete",
  submitted: "Pending review",
  underReview: "Under review",
  changesRequested: "Changes requested",
  rejected: "Rejected",
  approved: "Approved",
  suspended: "Suspended",
};
const date = (value: number) =>
  new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export async function loadRegistrations(
  accessToken: string,
  signal: AbortSignal,
) {
  const records: Registration[] = [];
  let cursor: string | null = null;
  do {
    const response = await registrationRequest(
      cursor ? `?cursor=${encodeURIComponent(cursor)}` : "",
      accessToken,
      signal,
    );
    const page = (await response.json()) as {
      items: Registration[];
      nextCursor: string | null;
    };
    records.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  const vehicles: Vehicle[] = [];
  const drivers: Driver[] = records.map((record) => {
    const vehicle = record.vehicle;
    const name = record.profile?.name || "Profile not completed";
    const status = statuses[record.status] || record.status;
    if (vehicle)
      vehicles.push({
        ...vehicle,
        live: true,
        id: record.id,
        driverId: record.id,
        driver: name,
        name: `${vehicle.make} ${vehicle.model}`,
        status,
        submitted: date(record.createdAt),
      });
    return {
      live: true,
      id: record.id,
      name,
      email: record.profile?.email || "Not provided",
      phone: record.profile?.phone || "Not provided",
      city: record.profile?.city || "Not provided",
      vehicle: vehicle ? `${vehicle.make} ${vehicle.model}` : "Not provided",
      plate: vehicle?.plate || "Not provided",
      registeredVehicleId: vehicle ? record.id : null,
      status,
      joined: date(record.createdAt),
      trips: 0,
      rating: "—",
    };
  });
  return { drivers, vehicles };
}
