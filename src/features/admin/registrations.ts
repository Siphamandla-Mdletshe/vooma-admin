import { apiBaseUrl } from "./auth";
import type { Driver, Vehicle, DriverAppeal } from "./data";
import { applicationStatusLabels } from "./application-filters";

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
  appeal?: DriverAppeal | null;
  vehiclePhotoId?: string | null;
  id: string;
  status: string;
  version: number;
  reviewReason: string | null;
  createdAt: number;
  updatedAt: number;
  profile: { name: string; email: string; phone: string; city: string } | null;
  vehicle: {
    bodyType?: string;
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
    if (response.status === 503)
      throw new Error(
        "Driver onboarding is not configured on the API. Set its policy, cities, and encryption secrets, then restart the API.",
      );
    throw new Error("Unable to load registration data. Please try again.");
  }
  return response;
}

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
    records.push(
      ...page.items.filter((record) =>
        Object.hasOwn(applicationStatusLabels, record.status),
      ),
    );
    cursor = page.nextCursor;
  } while (cursor);
  const vehicles: Vehicle[] = [];
  const drivers: Driver[] = records.map((record) => {
    const vehicle = record.vehicle;
    const name = record.profile?.name || "Profile not completed";
    const status = applicationStatusLabels[record.status];
    if (vehicle)
      vehicles.push({
        ...vehicle,
        live: true,
        photoId: record.vehiclePhotoId,
        id: record.id,
        driverId: record.id,
        driver: name,
        name: `${vehicle.make} ${vehicle.model}`,
        status,
        submitted: date(record.createdAt),
      });
    return {
      live: true,
      applicationVersion: record.version,
      reviewReason: record.reviewReason,
      appeal: record.appeal,
      vehicleBodyType: vehicle?.bodyType,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      vehicleMake: vehicle?.make,
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

export type ReviewStatus =
  "underReview" | "changesRequested" | "rejected" | "approved" | "suspended";

export function reviewReasonError(status: ReviewStatus, reason = "") {
  if (!["changesRequested", "rejected", "suspended"].includes(status))
    return null;
  if (!reason.trim()) return "Enter a reason the driver can act on.";
  if (Array.from(reason).length > 1000)
    return "Keep the reason to 1,000 characters or fewer.";
  return null;
}

export class RegistrationConflictError extends Error {}

export async function updateRegistrationStatus(
  driverId: string,
  accessToken: string,
  expectedVersion: number,
  status: ReviewStatus,
  reason?: string,
) {
  const validationError = reviewReasonError(status, reason);
  if (validationError) throw new Error(validationError);
  let response: Response;
  try {
    response = await fetch(
      apiBaseUrl() + `/v1/admin/drivers/${encodeURIComponent(driverId)}/status`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          expectedVersion,
          status,
          ...((status === "changesRequested" ||
            status === "rejected" ||
            status === "suspended") && {
            reason: reason!.trim(),
          }),
        }),
        cache: "no-store",
        credentials: "omit",
      },
    );
  } catch {
    throw new Error("Unable to reach the Vooma API. Check that it is running.");
  }
  if (!response.ok) {
    if (response.status === 400)
      throw new Error("Enter a reason between 1 and 1,000 characters.");
    if (response.status === 401)
      throw new Error(
        "Your admin session has expired. Sign out and sign in again.",
      );
    if (response.status === 404)
      throw new Error(
        "This registration is no longer available. Refresh the list.",
      );
    if (response.status === 409)
      throw new RegistrationConflictError(
        "This application changed. Refresh registrations and try again.",
      );
    throw new Error(
      "Unable to update the application status. Please try again.",
    );
  }
  return (await response.json()) as { status: string; version: number };
}

export async function decideSuspensionAppeal(
  driverId: string,
  accessToken: string,
  expectedVersion: number,
  decision: "accepted" | "upheld",
  reason: string,
) {
  if (!reason.trim() || Array.from(reason).length > 2000)
    throw new Error("Enter a decision reason between 1 and 2,000 characters.");
  const response = await fetch(
    apiBaseUrl() +
      `/v1/admin/drivers/${encodeURIComponent(driverId)}/appeal/decision`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        expectedVersion,
        decision,
        reason: reason.trim(),
      }),
      credentials: "omit",
      cache: "no-store",
    },
  );
  if (response.status === 409)
    throw new RegistrationConflictError(
      "This appeal changed or the application is no longer eligible. Refresh registrations and review it again.",
    );
  if (!response.ok)
    throw new Error(
      "Unable to resolve the appeal. Refresh registrations and try again.",
    );
  return response.json();
}
