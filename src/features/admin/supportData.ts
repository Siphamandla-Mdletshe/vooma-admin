import { initialDrivers, initialTickets, passengers, trips } from "./data";

export type SupportTicket = (typeof initialTickets)[number];
export type SupportAttachment = { id: string; file: File };
export type SupportMessage = {
  id: string;
  kind: "customer" | "reply" | "system" | "note";
  author: string;
  time: string;
  body: string;
  attachments: SupportAttachment[];
};
export type SupportAssignment = {
  agent: string;
  team: string;
  priority: string;
  level: string;
  category: string;
  due: string;
  tags: string[];
  note: string;
  notify: boolean;
  escalated: boolean;
};
export type SupportResolution = {
  type: string;
  cause: string;
  action: string;
  communication: string;
  compensate: boolean;
  amount: string;
  notified: boolean;
  close: boolean;
  survey: boolean;
};
export type SupportCase = {
  customer: { email: string; phone: string; city: string };
  tripId: string | null;
  device: string;
  os: string;
  app: string;
  createdAt: string;
  assignedAt: string;
  assignment: SupportAssignment;
  messages: SupportMessage[];
  activity: { id: string; text: string; time: string }[];
  replyDraft: string;
  noteDraft: string;
  draftAttachments: SupportAttachment[];
  checks: string[];
  resolutionDraft: SupportResolution;
  resolution: SupportResolution | null;
  resolvedAt: string | null;
};

export const supportNow = () =>
  new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());

export const supportId = () => crypto.randomUUID();

export const emptyResolution = (): SupportResolution => ({
  type: "",
  cause: "",
  action: "",
  communication: "",
  compensate: false,
  amount: "",
  notified: false,
  close: true,
  survey: true,
});

const customerReports: Record<string, string> = {
  "Unable to start trip":
    "Hi Support,\nI’m unable to start a trip. I tap “Start Trip” but the button doesn’t respond. I’ve tried restarting the app, but the issue is still there. Please help.",
  "Payment not received":
    "Hi Support,\nI’m unable to find the payment for my recent trip. Could you help me check its status?",
  "Update vehicle documents":
    "Hi Support,\nI need help updating my vehicle documents. Please let me know which documents are required.",
  "Trip fare dispute":
    "Hi Support,\nThe fare on my recent trip doesn’t match the amount I expected. Please review the trip with me.",
  "Lost item on trip":
    "Hi Support,\nI left an item in the vehicle after my last trip. Could you help me contact the driver?",
  "Account access":
    "Hi Support,\nI’m having trouble accessing my account. Please help me sign in again.",
};

export function createSupportCase(ticket: SupportTicket): SupportCase {
  const customer =
    ticket.type === "Driver"
      ? initialDrivers.find((driver) => driver.name === ticket.user)
      : passengers.find((passenger) => passenger.name === ticket.user);
  const trip = trips.find((record) =>
    ticket.type === "Driver"
      ? record.driver === ticket.user
      : record.passenger === ticket.user,
  );
  const createdAt = `${ticket.created}, 09:42`;
  const assignedAt = `${ticket.created}, 09:44`;
  const resolvedAt =
    ticket.status === "Resolved" ? `${ticket.created}, 10:30` : null;
  const resolution = resolvedAt
    ? {
        ...emptyResolution(),
        type: "Information provided",
        cause: "Customer guidance needed",
        action: "Reviewed the sample case and provided the requested guidance.",
        communication:
          "The customer confirmed that their question was answered.",
        notified: true,
      }
    : null;
  return {
    customer: {
      email: customer?.email ?? "Not provided",
      phone: customer?.phone ?? "Not provided",
      city:
        customer && "city" in customer && typeof customer.city === "string"
          ? customer.city
          : "Douala",
    },
    tripId: trip?.id ?? null,
    device: "Samsung Galaxy A54",
    os: "Android 14",
    app: `Vooma ${ticket.type === "Driver" ? "Driver" : "Passenger"} 3.6.0 (build 620)`,
    createdAt,
    assignedAt,
    assignment: {
      agent: "Estelle Ngono",
      team: "Customer Support",
      priority: ticket.priority,
      level: "Level 1",
      category: ticket.type === "Driver" ? "Driver App Issue" : "Trip Issue",
      due: "",
      tags:
        ticket.subject === "Unable to start trip"
          ? ["start-trip", "app-bug"]
          : [],
      note: "",
      notify: true,
      escalated: false,
    },
    messages: [
      {
        id: supportId(),
        kind: "customer",
        author: `${ticket.user} (${ticket.type})`,
        time: createdAt,
        body:
          customerReports[ticket.subject] ??
          `Hi Support,\nI need assistance with: ${ticket.subject}.`,
        attachments: [],
      },
      {
        id: supportId(),
        kind: "system",
        author: "System update",
        time: createdAt,
        body: `Ticket created\nSupport ticket ${ticket.id} was created from an in-app report by ${ticket.user}.`,
        attachments: [],
      },
      {
        id: supportId(),
        kind: "reply",
        author: "Estelle Ngono (Support)",
        time: `${ticket.created}, 10:07`,
        body: `Hi ${ticket.user.split(" ")[0]},\nThanks for contacting Vooma Support. I’m looking into this issue now and will get back to you shortly.`,
        attachments: [],
      },
    ],
    activity: [
      { id: supportId(), text: "Ticket created", time: createdAt },
      {
        id: supportId(),
        text: "Assigned to Estelle Ngono · Customer Support",
        time: assignedAt,
      },
      ...(resolvedAt
        ? [{ id: supportId(), text: "Ticket resolved", time: resolvedAt }]
        : []),
    ],
    replyDraft: "",
    noteDraft: "",
    draftAttachments: [],
    checks: [],
    resolutionDraft: resolution ?? emptyResolution(),
    resolution,
    resolvedAt,
  };
}
