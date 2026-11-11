import { useEffect, useRef, useState } from "react";
import {
  registrationRequest,
  type RegistrationDocument,
  type RegistrationDocuments,
} from "./registrations";

const labels: Record<string, string> = {
  vehicleFront: "Vehicle photo — front",
  vehicleRear: "Vehicle photo — rear",
  identity: "Identity document",
  selfie: "Driver photo",
  licenceFront: "Driver’s licence — front",
  licenceBack: "Driver’s licence — back",
  prdp: "Professional driving permit",
  registration: "Vehicle registration",
  insurance: "Vehicle insurance",
  roadworthy: "Roadworthy certificate",
  operating: "Operating licence",
};
const date = (value: number) => new Date(value).toLocaleString("en-ZA");

export function VerificationDocuments({
  driverId,
  accessToken,
}: {
  driverId: string;
  accessToken: string;
}) {
  const [data, setData] = useState<RegistrationDocuments | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [opening, setOpening] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    url: string;
    document: RegistrationDocument;
  } | null>(null);
  const request = useRef<AbortController | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setData(null);
    registrationRequest(
      `/${encodeURIComponent(driverId)}/documents`,
      accessToken,
      controller.signal,
    )
      .then((response) => response.json())
      .then((result: RegistrationDocuments) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load documents.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [driverId, accessToken, revision]);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (!preview) return;
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  async function open(document: RegistrationDocument) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setOpening(document.id);
    setError("");
    try {
      const response = await registrationRequest(
        `/${encodeURIComponent(driverId)}/documents/${encodeURIComponent(document.id)}`,
        accessToken,
        controller.signal,
      );
      const blob = await response.blob();
      if (!controller.signal.aborted)
        setPreview({ url: URL.createObjectURL(blob), document });
    } catch (reason) {
      if (!controller.signal.aborted)
        setError(
          reason instanceof Error ? reason.message : "Unable to open document.",
        );
    } finally {
      if (!controller.signal.aborted) setOpening(null);
    }
  }

  return (
    <div className="verification-documents">
      <div className="verification-toolbar">
        <p>Documents uploaded during driver registration.</p>
        <button
          className="secondary"
          disabled={loading}
          onClick={() => setRevision((value) => value + 1)}
        >
          Refresh documents
        </button>
      </div>
      {error && (
        <p className="registration-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p role="status">Loading documents…</p>}
      {!loading && data && (
        <>
          {!data.documents.length && (
            <p>No documents have been uploaded by this driver yet.</p>
          )}
          <ul className="verification-list">
            {data.requirements.map((requirement) => {
              const document = data.documents.find(
                (item) => item.kind === requirement.kind,
              );
              return (
                <li className="verification-row" key={requirement.kind}>
                  <div className="verification-info">
                    <strong>
                      {labels[requirement.kind] || requirement.kind}
                    </strong>
                    <span>
                      {requirement.required ? "Required" : "Optional"}
                    </span>
                    {document && (
                      <>
                        <span>
                          Uploaded {date(document.createdAt)} ·{" "}
                          {document.mime === "application/pdf"
                            ? "PDF"
                            : document.mime === "image/png"
                              ? "PNG"
                              : "JPEG"}{" "}
                          · {Math.max(1, Math.round(document.size / 1024))} KB
                        </span>
                        {document.expiry && (
                          <span>Expires {document.expiry}</span>
                        )}
                      </>
                    )}
                  </div>
                  <span
                    className={`badge ${document?.scan === "clean" ? "good" : document?.scan === "rejected" ? "bad" : "pending"}`}
                  >
                    {!document
                      ? "Not uploaded"
                      : document.scan === "clean"
                        ? "Scan clean"
                        : document.scan === "pending"
                          ? "Scan pending"
                          : "Scan rejected"}
                  </span>
                  {document && (
                    <button
                      className="secondary"
                      disabled={document.scan !== "clean" || opening !== null}
                      aria-label={`View ${labels[document.kind] || document.kind}`}
                      onClick={() => void open(document)}
                    >
                      {opening === document.id ? "Opening…" : "View document"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {data.documents.some((document) => document.scan !== "clean") && (
            <p className="panel-note">
              Files become viewable after a clean security scan.
            </p>
          )}
        </>
      )}
      {preview && (
        <dialog
          ref={dialog}
          className="document-preview"
          aria-label={labels[preview.document.kind] || "Document preview"}
          onCancel={(event) => {
            event.preventDefault();
            setPreview(null);
          }}
        >
          <div className="document-preview-heading">
            <h2>{labels[preview.document.kind] || preview.document.kind}</h2>
            <button className="secondary" onClick={() => setPreview(null)}>
              Close preview
            </button>
          </div>
          {preview.document.mime === "application/pdf" ? (
            <iframe
              title={labels[preview.document.kind] || "Submitted PDF"}
              src={preview.url}
            />
          ) : (
            <img
              alt={labels[preview.document.kind] || "Submitted document"}
              src={preview.url}
            />
          )}
          <a
            className="secondary"
            href={preview.url}
            download={`${preview.document.kind}.${preview.document.mime === "application/pdf" ? "pdf" : preview.document.mime === "image/png" ? "png" : "jpg"}`}
          >
            Download document
          </a>
        </dialog>
      )}
    </div>
  );
}
