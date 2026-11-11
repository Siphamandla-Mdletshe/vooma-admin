import { useEffect, useState } from "react";
import type { Vehicle } from "./data";
import { registrationRequest } from "./registrations";

export function VehiclePhoto({
  vehicle,
  accessToken,
  large = false,
}: {
  vehicle: Vehicle;
  accessToken: string;
  large?: boolean;
}) {
  const [photo, setPhoto] = useState<{ id: string; url: string } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let url: string | undefined;
    setFailed(false);
    if (vehicle.photoId)
      void registrationRequest(
        `/${encodeURIComponent(vehicle.driverId)}/documents/${encodeURIComponent(vehicle.photoId)}`,
        accessToken,
        controller.signal,
      )
        .then((response) => response.blob())
        .then((blob) => {
          if (controller.signal.aborted) return;
          if (!["image/png", "image/jpeg"].includes(blob.type))
            throw new Error("Invalid vehicle image");
          url = URL.createObjectURL(blob);
          setPhoto({ id: vehicle.photoId!, url });
        })
        .catch(() => {
          if (!controller.signal.aborted) setFailed(true);
        });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [vehicle.photoId, vehicle.driverId, accessToken]);
  const className = large ? "vehicle-photo large" : "vehicle-photo";
  return photo && photo.id === vehicle.photoId && !failed ? (
    <img
      className={className}
      src={photo.url}
      alt={`Submitted vehicle photo for ${vehicle.plate}`}
      onError={() => setFailed(true)}
    />
  ) : (
    <span className={`${className} empty-photo`}>
      {!vehicle.photoId
        ? "No vehicle photo submitted"
        : failed
          ? "Vehicle photo unavailable"
          : "Loading vehicle photo…"}
    </span>
  );
}
