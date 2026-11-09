import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  supportId,
  supportNow,
  type SupportAssignment,
  type SupportAttachment,
  type SupportCase,
  type SupportResolution,
  type SupportTicket,
} from "./supportData";
import { supportCss } from "./supportStyles";

const iconPaths: Record<string, string> = {
  user: "M20 21a8 8 0 0 0-16 0M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  chat: "M21 11a9 9 0 0 1-9 9H4l-3 2 2-6a9 9 0 1 1 18-5Z",
  note: "M5 3h14v18H5ZM8 7h8M8 11h8M8 15h5",
  clock: "M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
  send: "m22 2-7 20-4-9-9-4Zm0 0L11 13",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  back: "M19 12H5m5-5-5 5 5 5",
  up: "M12 20V4m-6 6 6-6 6 6",
  tag: "M3 3h8l10 10-8 8L3 11ZM7 7h.01",
  car: "m3 11 2-7h14l2 7v8H3ZM3 11h18M6 15h2M16 15h2",
  phone: "M7 2h10v20H7ZM11 18h2",
  file: "M14 2H5v20h14V7ZM14 2v6h5M8 12h8M8 16h8",
  attach: "m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L13 2m-7 14 10-10",
  download: "M12 3v12m-5-5 5 5 5-5M4 18v3h16v-3",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  bolt: "m13 2-9 12h7l-1 8 10-13h-8Z",
  info: "M12 11v6M12 7h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
};
function SupportIcon({ name }: { name: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name] ?? iconPaths.note} />
    </svg>
  );
}
function Status({ value }: { value: string }) {
  const tone =
    value === "Resolved"
      ? "good"
      : value === "Open"
        ? "bad"
        : ["High", "Urgent"].includes(value)
          ? "pending"
          : "progress";
  return <span className={`badge ${tone}`}>{value}</span>;
}
function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <section className="panel support-card">
      <div className="support-card-heading">
        {icon && <SupportIcon name={icon} />}
        <h3>{title}</h3>
      </div>
      <div className="support-card-body">{children}</div>
    </section>
  );
}
function Facts({ entries }: { entries: [string, ReactNode][] }) {
  return (
    <dl className="support-facts">
      {entries.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
function MessageBody({ text }: { text: string }) {
  // Render a small formatting vocabulary as React nodes; never inject message HTML.
  return (
    <div className="support-message-text">
      {text.split("\n").map((line, lineIndex) => (
        <p key={lineIndex}>
          {line
            .split(
              /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g,
            )
            .map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**"))
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              if (part.startsWith("__") && part.endsWith("__"))
                return <u key={i}>{part.slice(2, -2)}</u>;
              if (part.startsWith("*") && part.endsWith("*"))
                return <em key={i}>{part.slice(1, -1)}</em>;
              const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
              if (link)
                return (
                  <a
                    key={i}
                    href={link[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link[1]}
                  </a>
                );
              return part;
            })}
          {!line && <br />}
        </p>
      ))}
    </div>
  );
}

function AttachmentPreview({
  attachment,
  onClose,
}: {
  attachment: SupportAttachment;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [url, setUrl] = useState("");
  useEffect(() => {
    const previous =
      returnFocus.current ?? (document.activeElement as HTMLElement | null);
    returnFocus.current = previous;
    const modal = dialog.current;
    const objectUrl = URL.createObjectURL(attachment.file);
    setUrl(objectUrl);
    modal?.showModal();
    return () => {
      modal?.close();
      URL.revokeObjectURL(objectUrl);
      previous?.focus();
    };
  }, [attachment]);
  return (
    <dialog
      ref={dialog}
      className="support-file-dialog"
      onCancel={onClose}
      aria-labelledby="support-preview-title"
    >
      <div className="support-dialog-heading">
        <h2 id="support-preview-title">{attachment.file.name}</h2>
        <button
          className="icon-button"
          aria-label="Close attachment preview"
          onClick={onClose}
        >
          <SupportIcon name="close" />
        </button>
      </div>
      {url &&
        (attachment.file.type.startsWith("image/") ? (
          <img src={url} alt={attachment.file.name} />
        ) : attachment.file.type === "application/pdf" ? (
          <iframe src={url} title={attachment.file.name} />
        ) : (
          <p>Download this text attachment to read it.</p>
        ))}
      <a
        className="secondary"
        href={url || undefined}
        download={attachment.file.name}
      >
        <SupportIcon name="download" />
        Download attachment
      </a>
    </dialog>
  );
}

const agents = ["Estelle Ngono", "Sandra Bissou", "Paul Tchoua"];
const categories = [
  "Driver App Issue",
  "Trip Issue",
  "Payment Issue",
  "Account Access",
  "Vehicle Documents",
  "Lost Item",
];
function AssignmentDrawer({
  initial,
  escalate,
  actor,
  ticketId,
  onClose,
  onSave,
}: {
  initial: SupportAssignment;
  escalate: boolean;
  actor: string;
  ticketId: string;
  onClose: () => void;
  onSave: (value: SupportAssignment) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState<SupportAssignment>({
    ...initial,
    note: "",
    escalated: escalate || initial.escalated,
    level: escalate && initial.level === "Level 1" ? "Level 2" : initial.level,
    due:
      initial.due ||
      new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Africa/Johannesburg",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .format(new Date(Date.now() + 86400000))
        .replace(" ", "T"),
  });
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const previous =
      returnFocus.current ?? (document.activeElement as HTMLElement | null);
    returnFocus.current = previous;
    const modal = dialog.current;
    modal?.showModal();
    return () => {
      modal?.close();
      previous?.focus();
    };
  }, []);
  function addTag() {
    const next = tag.trim().replace(/\s+/g, "-").slice(0, 30);
    if (next && !value.tags.includes(next) && value.tags.length < 12)
      setValue({ ...value, tags: [...value.tags, next] });
    setTag("");
  }
  const target =
    value.priority === "Urgent"
      ? ["Within 15 minutes", "Within 2 hours"]
      : value.priority === "High"
        ? ["Within 1 hour", "Within 8 hours"]
        : ["Within 4 hours", "Within 24 hours"];
  return (
    <dialog
      ref={dialog}
      className="support-drawer"
      onCancel={onClose}
      aria-labelledby="support-assignment-title"
    >
      <div className="support-dialog-heading">
        <div>
          <h2 id="support-assignment-title">Assign &amp; Escalate Ticket</h2>
          <p>Manage assignment and routing for {ticketId}.</p>
        </div>
        <button
          className="icon-button"
          aria-label="Close assignment"
          onClick={onClose}
        >
          <SupportIcon name="close" />
        </button>
      </div>
      <form
        className="support-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!value.note.trim()) {
            setError("Add an internal note explaining this assignment.");
            return;
          }
          if (value.escalated && value.level === "Level 1") {
            setError("Choose Level 2 or Level 3 when escalating a ticket.");
            return;
          }
          onSave({ ...value, note: value.note.trim() });
        }}
      >
        <div className="support-form-grid">
          <label>
            Assigned agent <span>*</span>
            <select
              required
              value={value.agent}
              onChange={(e) => setValue({ ...value, agent: e.target.value })}
            >
              {[...new Set([...agents, actor, initial.agent])].map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Team <span>*</span>
            <select
              required
              value={value.team}
              onChange={(e) => setValue({ ...value, team: e.target.value })}
            >
              {["Customer Support", "Engineering", "Payments", "Safety"].map(
                (team) => (
                  <option key={team}>{team}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Priority <span>*</span>
            <select
              required
              value={value.priority}
              onChange={(e) => setValue({ ...value, priority: e.target.value })}
            >
              {["Normal", "High", "Urgent", "Low"].map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
          <label>
            Escalation level <span>*</span>
            <select
              required
              value={value.level}
              onChange={(e) => setValue({ ...value, level: e.target.value })}
            >
              {["Level 1", "Level 2", "Level 3"].map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
          <label>
            Category <span>*</span>
            <select
              required
              value={value.category}
              onChange={(e) => setValue({ ...value, category: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Due date <span>*</span>
            <input
              type="datetime-local"
              required
              value={value.due}
              onChange={(e) => setValue({ ...value, due: e.target.value })}
            />
            <small>South Africa time</small>
          </label>
        </div>
        <div>
          <label htmlFor="support-tag">Tags</label>
          <div className="support-tags">
            {value.tags.map((item) => (
              <span key={item}>
                {item}
                <button
                  type="button"
                  aria-label={`Remove tag ${item}`}
                  onClick={() =>
                    setValue({
                      ...value,
                      tags: value.tags.filter((t) => t !== item),
                    })
                  }
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="support-tag"
              placeholder="Add a tag…"
              maxLength={30}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              className="text-link"
              onClick={addTag}
              disabled={!tag.trim() || value.tags.length >= 12}
            >
              Add
            </button>
          </div>
        </div>
        <label>
          Internal note <span>*</span>
          <textarea
            required
            rows={4}
            maxLength={3000}
            value={value.note}
            onChange={(e) => setValue({ ...value, note: e.target.value })}
            placeholder="Explain why this ticket is being assigned or escalated."
          />
        </label>
        <Card title="SLA & Routing" icon="clock">
          <Facts
            entries={[
              ["Response target", target[0]],
              ["Resolution target", target[1]],
            ]}
          />
        </Card>
        <label className="support-checkbox">
          <input
            type="checkbox"
            checked={value.notify}
            onChange={(e) => setValue({ ...value, notify: e.target.checked })}
          />
          <span>
            Notify assigned agent
            <small>
              Record a notification preference for this sample assignment.
            </small>
          </span>
        </label>
        <label className="support-checkbox">
          <input
            type="checkbox"
            checked={value.escalated}
            onChange={(e) =>
              setValue({
                ...value,
                escalated: e.target.checked,
                level:
                  e.target.checked && value.level === "Level 1"
                    ? "Level 2"
                    : value.level,
              })
            }
          />
          <span>
            Mark as escalated
            <small>Flag this ticket for specialist review.</small>
          </span>
        </label>
        {error && (
          <p className="support-error" role="alert">
            {error}
          </p>
        )}
        <div className="support-form-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" type="submit">
            Save assignment
          </button>
        </div>
      </form>
    </dialog>
  );
}

export function SupportTicketView({
  ticket,
  data,
  actor,
  onUpdate,
  onBack,
  onTrip,
  onToast,
  onViewChange,
}: {
  ticket: SupportTicket;
  data: SupportCase;
  actor: string;
  onUpdate: (value: SupportCase, patch?: Partial<SupportTicket>) => void;
  onBack: () => void;
  onTrip: (id: string) => void;
  onToast: (message: string) => void;
  onViewChange: () => void;
}) {
  const [view, setView] = useState<"details" | "reply" | "resolve">("details");
  const [tab, setTab] = useState("Conversation");
  const [drawer, setDrawer] = useState<
    "assign" | "escalate" | "engineering" | null
  >(null);
  const [reply, setReply] = useState(data.replyDraft);
  const [note, setNote] = useState(data.noteDraft);
  const [files, setFiles] = useState(data.draftAttachments);
  const [resolution, setResolution] = useState<SupportResolution>(
    data.resolutionDraft,
  );
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<SupportAttachment | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const resolved = ticket.status === "Resolved";
  const isNote = tab === "Internal Notes";
  const draft = isNote ? note : reply;
  const setDraft = isNote ? setNote : setReply;
  const attachments = data.messages
    .filter((message) => message.kind !== "note")
    .flatMap((message) => message.attachments);
  const lastReply = data.messages
    .filter((message) => message.kind === "reply")
    .at(-1);
  const addActivity = (text: string) => [
    ...data.activity,
    { id: supportId(), text, time: supportNow() },
  ];
  function changeView(next: typeof view) {
    setView(next);
    if (next === "details") setTab("Conversation");
    setError("");
    onViewChange();
  }
  function focusReply(internal = false) {
    changeView("reply");
    setTab(internal ? "Internal Notes" : "Conversation");
    requestAnimationFrame(() => editor.current?.focus());
  }
  function sendReply() {
    if (resolved) return;
    if (!draft.trim()) {
      setError(
        isNote
          ? "Write an internal note first."
          : "Write a reply before sending.",
      );
      editor.current?.focus();
      return;
    }
    const time = supportNow();
    onUpdate(
      {
        ...data,
        messages: [
          ...data.messages,
          {
            id: supportId(),
            kind: isNote ? "note" : "reply",
            author: `${actor} (Support)`,
            time,
            body: draft.trim(),
            attachments: isNote ? [] : files,
          },
        ],
        replyDraft: isNote ? data.replyDraft : "",
        noteDraft: isNote ? "" : data.noteDraft,
        draftAttachments: isNote ? data.draftAttachments : [],
        activity: addActivity(
          isNote ? "Internal note added" : "Reply recorded",
        ),
      },
      !isNote && ticket.status === "Open"
        ? { status: "In progress" }
        : undefined,
    );
    setDraft("");
    if (!isNote) setFiles([]);
    setError("");
    onToast(
      isNote ? "Internal note saved" : "Reply recorded in this sample ticket",
    );
  }
  function saveDraft() {
    onUpdate({
      ...data,
      replyDraft: reply,
      noteDraft: note,
      draftAttachments: files,
    });
    onToast("Draft saved for this session");
  }
  function format(before: string, after = before) {
    const field = editor.current;
    if (!field) return;
    const start = field.selectionStart,
      end = field.selectionEnd;
    const selected = draft.slice(start, end) || "text";
    setDraft(
      draft.slice(0, start) + before + selected + after + draft.slice(end),
    );
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    });
  }
  function addFiles(selected: FileList | null) {
    if (!selected) return;
    const incoming = Array.from(selected);
    if (files.length + incoming.length > 5) {
      setError("Attach up to five files per reply.");
      return;
    }
    if (
      incoming.some(
        (file) =>
          file.size > 10 * 1024 * 1024 ||
          ![
            "image/png",
            "image/jpeg",
            "image/webp",
            "application/pdf",
            "text/plain",
          ].includes(file.type),
      )
    ) {
      setError("Choose PNG, JPG, WebP, PDF, or text files up to 10 MB each.");
      return;
    }
    setFiles([
      ...files,
      ...incoming.map((file) => ({ id: supportId(), file })),
    ]);
    setError("");
  }
  function resolveTicket() {
    if (resolved) return;
    if (!resolution.action.trim() || !resolution.communication.trim()) {
      setError("Complete the action taken and customer communication summary.");
      return;
    }
    if (
      resolution.compensate &&
      (!Number.isSafeInteger(Number(resolution.amount)) ||
        Number(resolution.amount) <= 0)
    ) {
      setError("Enter a positive whole-number compensation amount.");
      return;
    }
    const time = supportNow();
    const saved = {
      ...resolution,
      action: resolution.action.trim(),
      communication: resolution.communication.trim(),
      amount: resolution.compensate ? resolution.amount : "",
    };
    onUpdate(
      {
        ...data,
        resolution: saved,
        resolutionDraft: saved,
        resolvedAt: time,
        activity: addActivity(`Ticket resolved · ${resolution.type}`),
        messages: [
          ...data.messages,
          {
            id: supportId(),
            kind: "system",
            author: "System update",
            time,
            body: `Ticket resolved\n${saved.action}`,
            attachments: [],
          },
        ],
      },
      { status: "Resolved" },
    );
    setError("");
    onToast("Sample ticket resolved");
  }
  const customerCard = (
    <Card
      title={view === "reply" ? "Customer" : "Customer Details"}
      icon="user"
    >
      <Facts
        entries={[
          ["Name", ticket.user],
          ["Role", <Status value={ticket.type} />],
          ["Phone", data.customer.phone],
          ["Email", data.customer.email],
        ]}
      />
    </Card>
  );
  const tripCard = (
    <Card title="Related Trip" icon="car">
      <Facts
        entries={[
          [
            "Trip ID",
            data.tripId ? (
              <button
                className="text-link"
                onClick={() => onTrip(data.tripId!)}
              >
                {data.tripId}
              </button>
            ) : (
              "No related trip"
            ),
          ],
          ["City", data.customer.city],
        ]}
      />
    </Card>
  );
  const progress = [
    ["Ticket created", data.createdAt],
    ["Agent assigned", data.assignedAt],
    ["Customer contacted", lastReply?.time ?? ""],
    [
      "Troubleshooting completed",
      data.resolvedAt ?? (data.checks.length === 3 ? "Checklist complete" : ""),
    ],
    ["Resolution recorded", data.resolvedAt ?? ""],
    ["Closed", data.resolvedAt ?? ""],
  ];
  return (
    <div className="support-workspace">
      <style>{supportCss}</style>
      <nav className="support-breadcrumb" aria-label="Support breadcrumb">
        <button onClick={onBack}>Support</button>
        <span>/</span>
        {view === "details" ? (
          <span>Ticket Details</span>
        ) : (
          <>
            <button onClick={() => changeView("details")}>
              Ticket {ticket.id}
            </button>
            <span>/</span>
            <span>{view === "reply" ? "Reply" : "Resolve"}</span>
          </>
        )}
      </nav>
      <div className="support-heading">
        <div>
          <div className="support-title">
            <h2>
              {view === "resolve"
                ? "Resolve Ticket"
                : view === "reply"
                  ? `Reply to Ticket ${ticket.id}`
                  : `Ticket ${ticket.id}`}
            </h2>
            <Status value={ticket.status} />
          </div>
          <p>{ticket.subject}</p>
        </div>
        <div className="support-actions">
          {view === "details" ? (
            <>
              <button
                className="secondary"
                disabled={resolved}
                onClick={() => setDrawer("assign")}
              >
                <SupportIcon name="user" />
                Assign
              </button>
              <button
                className="secondary"
                disabled={resolved}
                onClick={() => setDrawer("escalate")}
              >
                <SupportIcon name="up" />
                Escalate
              </button>
              <button
                className="primary"
                disabled={resolved}
                onClick={() => focusReply()}
              >
                <SupportIcon name="chat" />
                Reply to customer
              </button>
              <button
                className="secondary"
                onClick={() => changeView("resolve")}
              >
                <SupportIcon name="check" />
                {resolved ? "View resolution" : "Resolve ticket"}
              </button>
            </>
          ) : view === "reply" ? (
            <>
              <button
                className="secondary"
                onClick={() => changeView("details")}
              >
                <SupportIcon name="info" />
                View details
              </button>
              <button
                className="secondary"
                disabled={resolved}
                onClick={() => focusReply(true)}
              >
                <SupportIcon name="note" />
                Add internal note
              </button>
              <button
                className="primary"
                disabled={resolved || tab === "Activity Log"}
                onClick={sendReply}
              >
                <SupportIcon name="send" />
                {isNote ? "Save note" : "Send reply"}
              </button>
            </>
          ) : null}
        </div>
      </div>
      <p className="support-preview-note">
        Sample ticket · Replies, assignments, and compensation are recorded in
        this session only.
      </p>
      {view === "details" && (
        <div className="panel support-meta">
          <div>
            <SupportIcon name="tag" />
            <span>
              <small>Priority</small>
              <Status value={ticket.priority} />
            </span>
          </div>
          <div>
            <SupportIcon name="file" />
            <span>
              <small>Type</small>
              {ticket.type}
            </span>
          </div>
          <div>
            <SupportIcon name="clock" />
            <span>
              <small>Created</small>
              {data.createdAt}
            </span>
          </div>
          <div>
            <SupportIcon name="user" />
            <span>
              <small>Assigned to</small>
              {data.assignment.agent}
              <button
                className="text-link"
                disabled={resolved}
                onClick={() => setDrawer("assign")}
              >
                Change
              </button>
            </span>
          </div>
          {data.assignment.escalated && (
            <span className="badge pending">
              Escalated · {data.assignment.level}
            </span>
          )}
        </div>
      )}
      <div className="support-layout">
        {view === "resolve" ? (
          <section className="panel support-card">
            <div className="support-card-heading">
              <SupportIcon name="check" />
              <div>
                <h3>Resolution Details</h3>
                <p>Provide the resolution information and close the ticket.</p>
              </div>
            </div>
            <form
              className="support-form support-card-body"
              onSubmit={(event) => {
                event.preventDefault();
                resolveTicket();
              }}
            >
              <fieldset disabled={resolved}>
                <div className="support-form-grid">
                  <label>
                    Resolution type <span>*</span>
                    <select
                      required
                      value={resolution.type}
                      onChange={(e) =>
                        setResolution({ ...resolution, type: e.target.value })
                      }
                    >
                      <option value="">Select a resolution</option>
                      {[
                        "Technical issue fixed",
                        "Information provided",
                        "Payment corrected",
                        "Documents updated",
                        "Account restored",
                        "Other",
                      ].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Root cause <span>*</span>
                    <select
                      required
                      value={resolution.cause}
                      onChange={(e) =>
                        setResolution({ ...resolution, cause: e.target.value })
                      }
                    >
                      <option value="">Select a root cause</option>
                      {[
                        "Outdated app version",
                        "Network connection",
                        "Service issue",
                        "Payment processing",
                        "Missing documents",
                        "Customer guidance needed",
                        "Other",
                      ].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Action taken <span>*</span>
                  <textarea
                    rows={4}
                    maxLength={5000}
                    required
                    value={resolution.action}
                    onChange={(e) =>
                      setResolution({ ...resolution, action: e.target.value })
                    }
                  />
                </label>
                <label>
                  Customer communication summary <span>*</span>
                  <textarea
                    rows={4}
                    maxLength={5000}
                    required
                    value={resolution.communication}
                    onChange={(e) =>
                      setResolution({
                        ...resolution,
                        communication: e.target.value,
                      })
                    }
                  />
                </label>
                <div className="support-form-grid">
                  <label className="support-checkbox">
                    <input
                      type="checkbox"
                      role="switch"
                      checked={resolution.compensate}
                      onChange={(e) =>
                        setResolution({
                          ...resolution,
                          compensate: e.target.checked,
                        })
                      }
                    />
                    <span>
                      Provide compensation (optional)
                      <small>Record a proposed credit or reimbursement.</small>
                    </span>
                  </label>
                  <label>
                    Amount (XAF)
                    <input
                      type="number"
                      min="1"
                      step="1"
                      disabled={!resolution.compensate}
                      required={resolution.compensate}
                      value={resolution.amount}
                      onChange={(e) =>
                        setResolution({ ...resolution, amount: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label className="support-checkbox">
                  <input
                    type="checkbox"
                    required
                    checked={resolution.notified}
                    onChange={(e) =>
                      setResolution({
                        ...resolution,
                        notified: e.target.checked,
                      })
                    }
                  />
                  <span>
                    Customer notified
                    <small>
                      I’ve informed the customer about the resolution.
                    </small>
                  </span>
                </label>
                <label className="support-checkbox">
                  <input
                    type="checkbox"
                    required
                    checked={resolution.close}
                    onChange={(e) =>
                      setResolution({ ...resolution, close: e.target.checked })
                    }
                  />
                  <span>
                    Mark ticket as resolved
                    <small>
                      Move this ticket to Resolved and close the case.
                    </small>
                  </span>
                </label>
              </fieldset>
              {error && (
                <p role="alert" className="support-error">
                  {error}
                </p>
              )}
              <div className="support-form-actions">
                <button
                  type="button"
                  className="secondary support-back"
                  onClick={() => changeView("details")}
                >
                  <SupportIcon name="back" />
                  Back
                </button>
                {!resolved && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      onUpdate({ ...data, resolutionDraft: resolution });
                      onToast("Resolution draft saved for this session");
                    }}
                  >
                    Save draft
                  </button>
                )}
                <button
                  className="primary support-resolve-button"
                  disabled={resolved}
                  type="submit"
                >
                  <SupportIcon name="check" />
                  {resolved ? "Ticket resolved" : "Resolve ticket"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="panel support-card support-conversation">
            {view === "reply" ? (
              <div
                className="tabs support-conversation-tabs"
                role="tablist"
                aria-label="Ticket information"
              >
                {["Conversation", "Internal Notes", "Activity Log"].map(
                  (item) => (
                    <button
                      key={item}
                      id={`support-tab-${item.replaceAll(" ", "-")}`}
                      role="tab"
                      aria-selected={tab === item}
                      aria-controls="support-tab-panel"
                      className={tab === item ? "active" : ""}
                      onClick={() => {
                        setTab(item);
                        setError("");
                      }}
                    >
                      <SupportIcon
                        name={
                          item === "Conversation"
                            ? "chat"
                            : item === "Internal Notes"
                              ? "note"
                              : "clock"
                        }
                      />
                      {item}
                    </button>
                  ),
                )}
              </div>
            ) : (
              <div className="support-card-heading">
                <h3>Conversation</h3>
              </div>
            )}
            <div
              className="support-card-body"
              id="support-tab-panel"
              role={view === "reply" ? "tabpanel" : undefined}
              aria-labelledby={
                view === "reply"
                  ? `support-tab-${tab.replaceAll(" ", "-")}`
                  : undefined
              }
            >
              {view === "reply" && tab === "Activity Log" ? (
                <ol className="support-activity">
                  {data.activity.map((event) => (
                    <li key={event.id}>
                      <SupportIcon name="clock" />
                      <div>
                        <strong>{event.text}</strong>
                        <small>{event.time}</small>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <ol className="support-timeline">
                    {data.messages
                      .filter((message) =>
                        view === "reply" && isNote
                          ? message.kind === "note"
                          : message.kind !== "note",
                      )
                      .map((message) => (
                        <li
                          key={message.id}
                          className={`support-event ${message.kind}`}
                        >
                          <span className="support-event-icon">
                            <SupportIcon
                              name={
                                message.kind === "system"
                                  ? "info"
                                  : message.kind === "note"
                                    ? "note"
                                    : "user"
                              }
                            />
                          </span>
                          <div className="support-event-content">
                            <strong>{message.author}</strong>
                            <small>{message.time}</small>
                            <div className="support-bubble">
                              <MessageBody text={message.body} />
                              {message.attachments.map((attachment) => (
                                <button
                                  className="text-link support-message-file"
                                  key={attachment.id}
                                  onClick={() => setPreview(attachment)}
                                >
                                  <SupportIcon name="attach" />
                                  {attachment.file.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                  </ol>
                  {isNote &&
                    !data.messages.some(
                      (message) => message.kind === "note",
                    ) && (
                      <p className="support-empty">
                        No internal notes yet. Notes are visible to the support
                        team.
                      </p>
                    )}
                  {!resolved ? (
                    <div className="support-composer">
                      <div className="support-editor">
                        <div
                          className="support-formatting"
                          role="toolbar"
                          aria-label="Message formatting"
                        >
                          <button
                            type="button"
                            aria-label="Bold"
                            onClick={() => format("**")}
                          >
                            <b>B</b>
                          </button>
                          <button
                            type="button"
                            aria-label="Italic"
                            onClick={() => format("*")}
                          >
                            <i>I</i>
                          </button>
                          <button
                            type="button"
                            aria-label="Underline"
                            onClick={() => format("__")}
                          >
                            <u>U</u>
                          </button>
                          <span />
                          <button
                            type="button"
                            aria-label="Bullet list"
                            onClick={() => format("\n- ", "")}
                          >
                            • List
                          </button>
                          <button
                            type="button"
                            aria-label="Numbered list"
                            onClick={() => format("\n1. ", "")}
                          >
                            1. List
                          </button>
                          <button
                            type="button"
                            aria-label="Insert link"
                            onClick={() => format("[", "](https://)")}
                          >
                            <SupportIcon name="attach" />
                          </button>
                        </div>
                        <textarea
                          ref={editor}
                          aria-label={
                            isNote ? "Internal note" : "Reply message"
                          }
                          rows={view === "reply" ? 5 : 3}
                          maxLength={10000}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder={
                            isNote
                              ? "Write a note for the support team…"
                              : `Type your reply to ${ticket.user}…`
                          }
                        />
                      </div>
                      {!isNote && files.length > 0 && (
                        <ul className="support-draft-files">
                          {files.map((attachment) => (
                            <li key={attachment.id}>
                              <button
                                className="text-link"
                                onClick={() => setPreview(attachment)}
                              >
                                {attachment.file.name}
                              </button>
                              <button
                                className="icon-button"
                                aria-label={`Remove ${attachment.file.name}`}
                                onClick={() =>
                                  setFiles(
                                    files.filter(
                                      (item) => item.id !== attachment.id,
                                    ),
                                  )
                                }
                              >
                                <SupportIcon name="close" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {error && (
                        <p className="support-error" role="alert">
                          {error}
                        </p>
                      )}
                      <div className="support-composer-actions">
                        {!isNote && (
                          <>
                            <input
                              ref={fileInput}
                              className="sr-only"
                              tabIndex={-1}
                              aria-label="Attach files"
                              type="file"
                              multiple
                              accept="image/png,image/jpeg,image/webp,application/pdf,text/plain"
                              onChange={(e) => {
                                addFiles(e.target.files);
                                e.target.value = "";
                              }}
                            />
                            <button
                              className="secondary support-back"
                              onClick={() => fileInput.current?.click()}
                            >
                              <SupportIcon name="attach" />
                              Attach file
                            </button>
                          </>
                        )}
                        <button className="secondary" onClick={saveDraft}>
                          Save draft
                        </button>
                        <button className="primary" onClick={sendReply}>
                          <SupportIcon name="send" />
                          {isNote ? "Save note" : "Send reply"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="support-empty">
                      This ticket is resolved.{" "}
                      <button
                        className="text-link"
                        onClick={() => changeView("resolve")}
                      >
                        View resolution
                      </button>
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        )}
        <aside className="support-aside">
          {view === "resolve" ? (
            <>
              <Card title="Ticket Summary" icon="info">
                <Facts
                  entries={[
                    ["Ticket #", ticket.id],
                    ["Customer", ticket.user],
                    ["Role", ticket.type],
                    ["Created", data.createdAt],
                    ["Assigned agent", data.assignment.agent],
                    [
                      "Trip ID",
                      data.tripId ? (
                        <button
                          className="text-link"
                          onClick={() => onTrip(data.tripId!)}
                        >
                          {data.tripId}
                        </button>
                      ) : (
                        "No related trip"
                      ),
                    ],
                    ["City", data.customer.city],
                  ]}
                />
              </Card>
              <Card title="Ticket Progress" icon="clock">
                <ol className="support-progress">
                  {progress.map(([label, time]) => (
                    <li key={label} className={time ? "done" : ""}>
                      <span>{time ? <SupportIcon name="check" /> : null}</span>
                      <div>
                        <strong>{label}</strong>
                        <small>{time || "Pending"}</small>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
              <Card title="Satisfaction Follow-up" icon="star">
                <label className="support-checkbox support-survey">
                  <span>
                    Send CSAT survey after closing.
                    <small>Recorded as a preference in this preview.</small>
                  </span>
                  <input
                    role="switch"
                    type="checkbox"
                    disabled={resolved}
                    checked={resolution.survey}
                    onChange={(e) =>
                      setResolution({ ...resolution, survey: e.target.checked })
                    }
                  />
                </label>
              </Card>
            </>
          ) : (
            <>
              {customerCard}
              {view === "reply" && (
                <>
                  <Card title="Suggested Actions" icon="bolt">
                    <div className="support-checklist">
                      {[
                        "Check app version",
                        "Review last trip events",
                        "Confirm network status",
                      ].map((item) => (
                        <label className="support-checkbox" key={item}>
                          <input
                            type="checkbox"
                            disabled={resolved}
                            checked={data.checks.includes(item)}
                            onChange={(e) =>
                              onUpdate({
                                ...data,
                                checks: e.target.checked
                                  ? [...data.checks, item]
                                  : data.checks.filter(
                                      (check) => check !== item,
                                    ),
                              })
                            }
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </Card>
                  <Card title="Quick Responses" icon="chat">
                    <div className="support-quick">
                      {[
                        "Request screenshot",
                        "Share troubleshooting steps",
                        "Escalate to engineering",
                      ].map((item, i) => (
                        <button
                          className="secondary"
                          key={item}
                          disabled={resolved}
                          onClick={() => {
                            if (i === 2) {
                              setDrawer("engineering");
                              return;
                            }
                            const text =
                              i === 0
                                ? `Hi ${ticket.user.split(" ")[0]},\nCould you share a screenshot of the issue? Please hide any passwords or verification codes.`
                                : `Hi ${ticket.user.split(" ")[0]},\nPlease check that your connection is stable, update the Vooma app, and reopen it. Let us know whether the issue continues.`;
                            setReply(reply ? `${reply}\n\n${text}` : text);
                            setTab("Conversation");
                            requestAnimationFrame(() =>
                              editor.current?.focus(),
                            );
                          }}
                        >
                          <SupportIcon name={i === 2 ? "up" : "chat"} />
                          {item}
                          <SupportIcon name="arrow" />
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}
              {tripCard}
              {view === "details" && (
                <>
                  <Card title="Device & App Information" icon="phone">
                    <Facts
                      entries={[
                        ["Device", data.device],
                        ["OS", data.os],
                        ["App version", data.app],
                      ]}
                    />
                  </Card>
                  <Card
                    title={`Attachments (${attachments.length})`}
                    icon="attach"
                  >
                    {attachments.length ? (
                      <ul className="support-attachments">
                        {attachments.map((attachment) => (
                          <li key={attachment.id}>
                            <SupportIcon name="file" />
                            <div>
                              <button
                                className="text-link"
                                onClick={() => setPreview(attachment)}
                              >
                                {attachment.file.name}
                              </button>
                              <small>
                                {(attachment.file.size / 1024).toFixed(1)} KB ·{" "}
                                {attachment.file.type}
                              </small>
                            </div>
                            <button
                              className="icon-button"
                              aria-label={`View ${attachment.file.name}`}
                              onClick={() => setPreview(attachment)}
                            >
                              <SupportIcon name="arrow" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="support-empty">No attachments yet.</p>
                    )}
                  </Card>
                </>
              )}
            </>
          )}
        </aside>
      </div>
      {drawer && (
        <AssignmentDrawer
          initial={
            drawer === "engineering"
              ? { ...data.assignment, team: "Engineering" }
              : data.assignment
          }
          escalate={drawer !== "assign"}
          actor={actor}
          ticketId={ticket.id}
          onClose={() => setDrawer(null)}
          onSave={(assignment) => {
            const time = supportNow();
            onUpdate(
              {
                ...data,
                assignment,
                assignedAt: time,
                messages: [
                  ...data.messages,
                  {
                    id: supportId(),
                    kind: "note",
                    author: `${actor} (Support)`,
                    body: assignment.note,
                    time,
                    attachments: [],
                  },
                ],
                activity: addActivity(
                  `${assignment.escalated ? "Escalated" : "Assigned"} to ${assignment.agent} · ${assignment.team} · ${assignment.level}`,
                ),
              },
              {
                priority: assignment.priority,
                status:
                  ticket.status === "Open" ? "In progress" : ticket.status,
              },
            );
            setDrawer(null);
            onToast("Sample assignment saved");
          }}
        />
      )}
      {preview && (
        <AttachmentPreview
          attachment={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
