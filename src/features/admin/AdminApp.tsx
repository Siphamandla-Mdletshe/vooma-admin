import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import palette from "../../brand/tokens.json";
import { VoomaMark } from "../../brand/VoomaMark";
import {
  initialDrivers,
  initialTickets,
  initialVehicles,
  money,
  passengers,
  trips,
  type Driver,
  type Vehicle,
} from "./data";
import { adminCss } from "./styles";
import { AdminLogin } from "./AdminLogin";
import { DashboardCharts } from "./DashboardCharts";

const pages = [
  "Dashboard",
  "Drivers",
  "Passengers",
  "Vehicles",
  "Trips",
  "Payments",
  "Support",
  "Reports",
  "Settings",
] as const;
type Page = (typeof pages)[number];
type Detail = { kind: string; id: string } | null;
const paths: Record<string, string> = {
  Dashboard: "M3 10 12 3l9 7v11h-6v-7H9v7H3Z",
  Drivers:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 8a3 3 0 0 1 0 6M22 21v-2a4 4 0 0 0-3-4",
  Passengers: "M20 21v-2a7 7 0 0 0-14 0v2M13 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  Vehicles: "m3 11 2-7h14l2 7v8H3ZM3 11h18M6 15h2M16 15h2M5 19v3M19 19v3",
  Trips:
    "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8 7h8M8 12h8M8 17h4M6 3v18",
  Payments: "M3 5h18v14H3ZM3 10h18M7 15h3",
  Support: "M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v7H3ZM17 12h4v7h-4ZM17 19v2h-5",
  Reports: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  Settings:
    "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  Search: "m21 21-5-5M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14",
  Bell: "M18 8a6 6 0 0 0-12 0v7l-3 3h18l-3-3ZM10 21h4",
  Arrow: "M4 12h16M14 6l6 6-6 6",
  Chevron: "m9 5 7 7-7 7",
  Close: "m5 5 14 14M5 19 19 5",
  Check: "m4 12 5 5L20 6",
  Filter: "M3 4h18l-7 8v6l-4 2v-8Z",
  Plus: "M12 4v16M4 12h16",
  Download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
  Back: "M20 12H4m6-6-6 6 6 6",
  Users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M17 4a3 3 0 0 1 0 6M22 21v-2a4 4 0 0 0-3-4",
  Down: "m6 9 6 6 6-6",
  More: "M4 12h.01M12 12h.01M20 12h.01",
  Phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.7-3.1 20 20 0 0 1-6-6A20 20 0 0 1 2 4.1 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 2.1L7.6 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5l3 .5a2 2 0 0 1 2 2.2Z",
  Mail: "M3 5h18v14H3ZM3 5l9 7 9-7",
  Pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  Calendar: "M3 5h18v16H3ZM7 2v6M17 2v6M3 11h18M7 15h3",
  Star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1Z",
  Layers: "m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5",
  Menu: "M3 6h18M3 12h18M3 18h18",
  Logout: "M9 3H3v18h6M9 12h12m-5-5 5 5-5 5",
};
function Icon({ name, size = 19 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.Reports} />
    </svg>
  );
}
const portraitNames = [
  "Olivier Mvondo",
  "Claire Ngono",
  "Jean Fotso",
  "Sandra Bissou",
  "Aminata Bello",
  "Paul Tchoua",
  "Marie Ewane",
  "Guy Nkoum",
];
function Avatar({
  name,
  large = false,
  admin = false,
}: {
  name: string;
  large?: boolean;
  admin?: boolean;
}) {
  const index = admin ? 8 : portraitNames.indexOf(name);
  return (
    <span
      className={`avatar ${large ? "large" : ""} ${index >= 0 ? "photo-avatar" : ""}`}
      aria-hidden="true"
      style={
        index >= 0
          ? {
              backgroundPosition: `${((index % 4) * 100) / 3}% ${Math.floor(index / 4) * 50}%`,
            }
          : undefined
      }
    >
      {index < 0 &&
        name
          .split(" ")
          .map((x) => x[0])
          .slice(0, 2)
          .join("")}
    </span>
  );
}
function VehicleArt({ name }: { name: string }) {
  const col = name.includes("Moto") ? 3 : name.includes("Kia") ? 2 : 1;
  return (
    <span
      className="vehicle-art"
      role="img"
      aria-label={name}
      style={{ backgroundPosition: `${(col * 100) / 3}% 100%` }}
    />
  );
}
function Badge({ children }: { children: string }) {
  return (
    <span
      className={`badge ${["Approved", "Active", "Completed", "Resolved"].includes(children) ? "good" : ["Suspended", "Blocked", "Rejected", "Cancelled", "Open"].includes(children) ? "bad" : children === "In progress" ? "progress" : "pending"}`}
    >
      <i />
      {children === "Pending review"
        ? "Pending Review"
        : children === "In progress"
          ? "In Progress"
          : children}
    </span>
  );
}
function Person({ name, sub }: { name: string; sub: string }) {
  return (
    <span className="person">
      <Avatar name={name} />
      <span>
        <strong>{name}</strong>
        <small>{sub}</small>
      </span>
    </span>
  );
}
function VehicleDetails({ vehicle }: { vehicle: Vehicle }) {
  const groups = [
    {
      title: "Vehicle specifications",
      fields: [
        ["Make", vehicle.make],
        ["Model", vehicle.model],
        ["Year", vehicle.year],
        ["Color", vehicle.color],
        ["Vehicle type", vehicle.type],
        ["Seats (including driver)", vehicle.seats],
        ["Fuel type", vehicle.fuel],
        ["Transmission", vehicle.transmission],
        ["VIN / chassis number", vehicle.chassisNumber],
      ],
    },
    {
      title: "Registration details",
      fields: [
        ["Vehicle ID", vehicle.id],
        ["License plate", vehicle.plate],
        ["Registration number", vehicle.registrationNumber],
        ["Registered owner", vehicle.registeredOwner],
        ["Assigned driver", vehicle.driver],
        ["Driver ID", vehicle.driverId],
        ["Registration city", vehicle.registrationCity],
        ["Registration date", vehicle.registrationDate],
        ["Submitted for review", vehicle.submitted],
      ],
    },
    {
      title: "Insurance and inspection",
      fields: [
        ["Insurance provider", vehicle.insuranceProvider],
        ["Policy number", vehicle.insurancePolicy],
        ["Insurance expiry", vehicle.insuranceExpiry],
        ["Inspection certificate", vehicle.inspectionNumber],
        ["Inspection date", vehicle.inspectionDate],
        ["Inspection expiry", vehicle.inspectionExpiry],
      ],
    },
  ];
  return (
    <div className="vehicle-details">
      {groups.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          <dl className="vehicle-detail-fields">
            {group.fields.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value ?? "Not provided"}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
function Table({
  headers,
  rows,
  empty = "No records match your search.",
}: {
  headers: ReactNode[];
  rows: ReactNode[][];
  empty?: string;
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {headers.map((h, index) => (
              <th key={index} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <div className="empty">
          <Icon name="Search" size={28} />
          <p>{empty}</p>
        </div>
      )}
    </div>
  );
}
function readPage(): Page {
  const name = window.location.hash.slice(1);
  return pages.find((p) => p.toLowerCase() === name) ?? "Dashboard";
}

export default function AdminApp() {
  const [preview, setPreview] = useState(false);
  return preview ? (
    <AdminWorkspace onSignOut={() => setPreview(false)} />
  ) : (
    <AdminLogin onPreview={() => setPreview(true)} />
  );
}

function AdminWorkspace({ onSignOut }: { onSignOut: () => void }) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<Page>(readPage);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [tickets, setTickets] = useState(initialTickets);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(
    readPage() === "Vehicles" ? "Pending review" : "All",
  );
  const [city, setCity] = useState("All cities");
  const [filterOpen, setFilterOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [driverTab, setDriverTab] = useState("Overview");
  const [detail, setDetail] = useState<Detail>(null);
  const [period, setPeriod] = useState("Last 30 days");
  const [notifications, setNotifications] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [usersOpen, setUsersOpen] = useState(true);
  const [userMenu, setUserMenu] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driverMessages, setDriverMessages] = useState<Record<string, string>>(
    {},
  );
  const [toast, setToast] = useState("");
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.test");
  useEffect(() => {
    const listener = () => {
      setPage(readPage());
      setSelected(null);
      setQuery("");
      setTab(readPage() === "Vehicles" ? "Pending review" : "All");
      setCity("All cities");
      setFilterOpen(false);
      setCurrent(1);
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  useEffect(() => {
    document.title = selected ? selected.name : page;
    scrollContainer.current?.scrollTo({ top: 0 });
  }, [page, selected]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!detail) return;
    const old = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLDialogElement>(".admin-dialog");
    dialog?.showModal();
    return () => {
      dialog?.close();
      old?.focus();
    };
  }, [detail]);
  function navigate(next: Page) {
    setPage(next);
    window.history.pushState(null, "", `#${next.toLowerCase()}`);
    setQuery("");
    setTab(next === "Vehicles" ? "Pending review" : "All");
    setFilterOpen(false);
    setUserMenu(false);
    setCity("All cities");
    setSelected(null);
    setCurrent(1);
    setMobileNav(false);
  }
  const match = (value: unknown) =>
    JSON.stringify(value).toLowerCase().includes(query.toLowerCase());
  const driver = selected ? drivers.find((d) => d.id === selected.id)! : null;
  const driverVehicles = driver
    ? vehicles.filter((vehicle) => vehicle.driverId === driver.id)
    : [];
  const visibleDrivers = drivers.filter(
    (d) =>
      match(d) &&
      (tab === "All" || d.status === tab) &&
      (city === "All cities" || d.city === city),
  );
  const visibleTrips = trips.filter(
    (d) =>
      match(d) &&
      (tab === "All" || d.status === tab) &&
      (period !== "Last 7 days" || d.day >= 24),
  );
  const visiblePassengers = passengers.filter(
    (d) => match(d) && (tab === "All" || d.status === tab),
  );
  const visibleVehicles = vehicles.filter(
    (d) => match(d) && (tab === "All" || d.status === tab),
  );
  const visibleTickets = tickets.filter(
    (d) => match(d) && (tab === "All" || d.status === tab),
  );
  const counts = {
    drivers: drivers.length,
    pending: drivers.filter((d) => d.status === "Pending review").length,
    trips: trips.filter((t) => t.status === "Completed").length,
    revenue: trips
      .filter((t) => t.status === "Completed")
      .reduce((sum, t) => sum + t.fare, 0),
  };
  const stats = [
    ["Vehicles", "12,480", "Total Trips", "+14%", "blue"],
    [
      "Users",
      passengers.length.toLocaleString("en-US"),
      "Passengers",
      "+9%",
      "green",
    ],
    [
      "Passengers",
      drivers.length.toLocaleString("en-US"),
      "Drivers",
      "+12%",
      "orange",
    ],
    ["Layers", "17,850,000", "Revenue (XAF)", "+18%", "purple"],
  ] as const;
  const showDriver = (d: Driver) => {
    setSelected(d);
    setDriverTab("Overview");
  };
  function tabs(options: string[], records: { status: string }[]) {
    return (
      <div className="tabs" role="tablist" aria-label="Status">
        {options.map((option) => (
          <button
            key={option}
            role="tab"
            aria-selected={tab === option}
            className={tab === option ? "active" : ""}
            onClick={() => {
              setTab(option);
              setCurrent(1);
            }}
          >
            {option === "Pending review"
              ? page === "Vehicles"
                ? "Pending"
                : "Pending Review"
              : option === "In progress"
                ? "In Progress"
                : option}{" "}
            <span>
              (
              {(option === "All"
                ? records.length
                : records.filter((r) => r.status === option).length
              ).toLocaleString("en-US")}
              )
            </span>
          </button>
        ))}
      </div>
    );
  }
  const pageSize = 10;
  function pager(total: number) {
    const pagesCount = Math.max(1, Math.ceil(total / pageSize));
    const pageNumbers = [
      ...new Set([
        1,
        current > 3 ? current - 1 : 2,
        current > 3 ? current : 3,
        ...(current > 3 && current < pagesCount ? [current + 1] : []),
        pagesCount,
      ]),
    ]
      .filter((n) => n <= pagesCount)
      .sort((a, b) => a - b);
    return (
      <div className="pager">
        <span>
          {total
            ? `Showing ${(current - 1) * pageSize + 1}–${Math.min(current * pageSize, total)} of ${total.toLocaleString("en-US")}`
            : "0 records"}
        </span>
        <div>
          <button
            className="icon-button pager-arrow"
            aria-label="Previous page"
            disabled={current === 1}
            onClick={() => setCurrent(current - 1)}
          >
            <Icon name="Chevron" size={15} />
          </button>
          {pageNumbers.map((number, i) => (
            <span className="pagination-slot" key={number}>
              {i > 0 && number - pageNumbers[i - 1] > 1 && (
                <span className="pagination-gap">…</span>
              )}
              <button
                aria-label={`Page ${number}`}
                aria-current={current === number ? "page" : undefined}
                className={`page-number ${current === number ? "active" : ""}`}
                onClick={() => setCurrent(number)}
              >
                {number.toLocaleString("en-US")}
              </button>
            </span>
          ))}
          <button
            className="icon-button"
            aria-label="Next page"
            disabled={current === pagesCount}
            onClick={() => setCurrent(current + 1)}
          >
            <Icon name="Chevron" size={15} />
          </button>
        </div>
      </div>
    );
  }
  const slice = <T,>(rows: T[]) =>
    rows.slice((current - 1) * pageSize, current * pageSize);
  const search = (
    <div className="search">
      <Icon name="Search" />
      <input
        aria-label={`Search ${page.toLowerCase()}`}
        placeholder={
          page === "Drivers"
            ? "Search by name, phone or ID..."
            : page === "Passengers"
              ? "Search by name, phone or email..."
              : page === "Trips"
                ? "Search by trip ID, driver or passenger..."
                : `Search ${page.toLowerCase()}...`
        }
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setCurrent(1);
        }}
      />
      {query && (
        <button
          className="icon-button"
          aria-label="Clear search"
          onClick={() => setQuery("")}
        >
          <Icon name="Close" size={14} />
        </button>
      )}
    </div>
  );
  const range = (
    <select
      aria-label={page === "Trips" ? "Trip period" : "Chart period"}
      value={period}
      onChange={(e) => {
        setPeriod(e.target.value);
        setCurrent(1);
      }}
    >
      <option>Last 30 days</option>
      <option>Last 7 days</option>
    </select>
  );
  const filterControl = (
    <>
      <button
        className="secondary"
        aria-expanded={filterOpen}
        onClick={() => setFilterOpen(!filterOpen)}
      >
        <Icon name="Filter" size={16} />
        Filter
      </button>
      {filterOpen && (
        <select
          aria-label="Filter by status"
          value={tab}
          onChange={(e) => {
            setTab(e.target.value);
            setCurrent(1);
          }}
        >
          {(page === "Passengers"
            ? ["All", "Active", "Blocked"]
            : ["All", "Completed", "Cancelled"]
          ).map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      )}
    </>
  );
  const tripTable = (data: typeof trips) => (
    <Table
      headers={[
        "Trip ID",
        "Date & Time",
        "Driver",
        "Passenger",
        "Vehicle Type",
        "Fare",
        "Status",
      ]}
      rows={data.map((t) => [
        <button
          key="id"
          className="record-link"
          onClick={() => setDetail({ kind: "trip", id: t.id })}
        >
          {t.id}
        </button>,
        t.date,
        <span key="driver" className="stack">
          <strong>{t.driver}</strong>
          <small>{t.driverId}</small>
        </span>,
        <span key="passenger" className="stack">
          <strong>{t.passenger}</strong>
          <small>{t.passengerPhone}</small>
        </span>,
        t.type,
        money(t.fare),
        <Badge key="status">{t.status}</Badge>,
      ])}
    />
  );
  function downloadReport() {
    const rows = [
      ["Trip ID", "Driver", "Passenger", "Fare (XAF)", "Status"],
      ...trips.map((t) => [
        t.id,
        t.driver,
        t.passenger,
        String(t.fare),
        t.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "vooma-demo-trips.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Sample trip report downloaded");
  }
  return (
    <div
      className="admin-app"
      ref={scrollContainer}
      style={
        {
          "--navy": "#10213a",
          "--ink": "#0c1934",
          "--muted": "#304d77",
          "--line": "#dfe7f2",
          "--tint": palette.tint,
          "--sky": palette.sky,
          "--orange": palette.orange,
        } as CSSProperties
      }
    >
      <style>{adminCss}</style>
      {mobileNav && (
        <button
          className="nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <a
          className="brand"
          href="#dashboard"
          onClick={(event) => {
            event.preventDefault();
            navigate("Dashboard");
          }}
        >
          <VoomaMark inverse />
          <span>vooma</span>
          <small>Admin</small>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={`nav-item ${page === "Dashboard" ? "active" : ""}`}
            aria-current={page === "Dashboard" ? "page" : undefined}
            onClick={() => navigate("Dashboard")}
          >
            <Icon name="Dashboard" />
            <span>Dashboard</span>
          </button>
          <button
            className="nav-item"
            aria-expanded={usersOpen}
            onClick={() => setUsersOpen(!usersOpen)}
          >
            <Icon name="Users" />
            <span>Users</span>
            <Icon name="Down" size={15} />
          </button>
          {usersOpen && (
            <div className="nav-children">
              {(["Drivers", "Passengers"] as Page[]).map((p) => (
                <button
                  key={p}
                  className={`nav-item ${page === p ? "active" : ""}`}
                  aria-current={page === p ? "page" : undefined}
                  onClick={() => navigate(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          {(
            [
              "Vehicles",
              "Trips",
              "Payments",
              "Support",
              "Reports",
              "Settings",
            ] as Page[]
          ).map((p) => (
            <button
              key={p}
              className={`nav-item ${page === p ? "active" : ""}`}
              aria-current={page === p ? "page" : undefined}
              onClick={() => navigate(p)}
            >
              <Icon name={p} />
              <span>{p}</span>
              {["Vehicles", "Payments", "Settings"].includes(p) && (
                <Icon name="Down" size={15} />
              )}
            </button>
          ))}
        </nav>
      </aside>
      <div className="admin-body">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button menu-button"
              aria-label="Toggle navigation"
              aria-expanded={mobileNav}
              onClick={() => setMobileNav(!mobileNav)}
            >
              <Icon name="Menu" />
            </button>
            {selected ? (
              <div className="breadcrumb">
                <button
                  className="icon-button"
                  aria-label="Back to drivers"
                  onClick={() => setSelected(null)}
                >
                  <Icon name="Back" />
                </button>
                <button onClick={() => setSelected(null)}>Drivers</button>
                <Icon name="Chevron" size={13} />
                <h1>Driver Details</h1>
              </div>
            ) : page === "Dashboard" ? (
              <div className="topbar-welcome">
                <h1>Welcome back, Admin</h1>
                <p>Here's what's happening on Vooma in Cameroon.</p>
              </div>
            ) : (
              <h1>
                {page === "Vehicles"
                  ? "Vehicle Verification"
                  : page === "Support"
                    ? "Support Tickets"
                    : page}
              </h1>
            )}
          </div>
          <div className="topbar-right">
            <div className="notification-anchor">
              <button
                className="icon-button notification"
                aria-label="Notifications"
                aria-expanded={notifications}
                onClick={() => {
                  setNotifications(!notifications);
                  setUserMenu(false);
                }}
              >
                <Icon name="Bell" size={23} />
              </button>
              {notifications && (
                <div className="notification-panel">
                  <h3>Notifications</h3>
                  <button
                    onClick={() => {
                      navigate("Drivers");
                      setTab("Pending review");
                      setNotifications(false);
                    }}
                  >
                    {counts.pending} driver applications awaiting review
                    <Icon name="Arrow" size={16} />
                  </button>
                  <button
                    onClick={() => {
                      navigate("Support");
                      setTab("Open");
                      setNotifications(false);
                    }}
                  >
                    {tickets.filter((t) => t.status === "Open").length} open
                    support tickets
                    <Icon name="Arrow" size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="user-menu-anchor">
              <button
                className="user-button"
                aria-label="Account menu"
                aria-expanded={userMenu}
                onClick={() => {
                  setUserMenu(!userMenu);
                  setNotifications(false);
                }}
              >
                <Avatar name={name} admin />
                <span>{name}</span>
                <Icon name="Down" size={15} />
              </button>
              {userMenu && (
                <div className="user-menu">
                  <small>Administrator · Demo workspace</small>
                  <button onClick={() => navigate("Settings")}>
                    <Icon name="Settings" size={17} />
                    Account settings
                  </button>
                  <button onClick={onSignOut}>
                    <Icon name="Logout" size={17} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main
          id="admin-main"
          className={`page-${page.toLowerCase()} ${driver ? "page-driver-detail" : ""}`}
        >
          {!selected &&
            ["Dashboard", "Trips", "Reports", "Support"].includes(page) && (
              <div className="page-heading">
                <div className="heading-actions">
                  {(page === "Dashboard" || page === "Trips") && range}
                  {page === "Reports" && (
                    <button className="primary" onClick={downloadReport}>
                      <Icon name="Download" />
                      Export CSV
                    </button>
                  )}
                  {page === "Support" && (
                    <button
                      className="primary"
                      onClick={() => setDetail({ kind: "addTicket", id: "" })}
                    >
                      <Icon name="Plus" size={17} />
                      New Ticket
                    </button>
                  )}
                </div>
              </div>
            )}
          {page === "Dashboard" && (
            <>
              <div className="stats-grid dashboard-stats">
                {stats.map(([icon, value, label, growth, color]) => (
                  <div className="stat" key={label}>
                    <span className={`stat-icon ${color}`}>
                      <Icon name={icon} size={25} />
                    </span>
                    <div className="stat-content">
                      <strong>
                        {period === "Last 7 days" && label === "Total Trips"
                          ? "3,120"
                          : value}
                      </strong>
                      <span>{label}</span>
                      <small className="stat-growth">↑ {growth}</small>
                    </div>
                  </div>
                ))}
              </div>
              <DashboardCharts period={period} />
            </>
          )}
          {page === "Drivers" && !driver && (
            <section className="panel records">
              {tabs(
                ["All", "Pending review", "Approved", "Suspended"],
                drivers,
              )}
              <div className="toolbar">
                {search}
                <button
                  className="secondary"
                  aria-expanded={filterOpen}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Icon name="Filter" size={16} />
                  Filter
                </button>
                {filterOpen && (
                  <select
                    aria-label="Filter by city"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setCurrent(1);
                    }}
                  >
                    <option>All cities</option>
                    <option>Yaoundé</option>
                    <option>Douala</option>
                  </select>
                )}
              </div>
              {selectedDrivers.length > 0 && (
                <div className="selection-bar">
                  <span>{selectedDrivers.length} selected</span>
                  <button
                    className="text-link"
                    onClick={() => setSelectedDrivers([])}
                  >
                    Clear selection
                  </button>
                </div>
              )}
              <Table
                headers={[
                  <input
                    type="checkbox"
                    aria-label="Select all drivers on this page"
                    checked={
                      slice(visibleDrivers).length > 0 &&
                      slice(visibleDrivers).every((d) =>
                        selectedDrivers.includes(d.id),
                      )
                    }
                    onChange={(e) =>
                      setSelectedDrivers(
                        e.target.checked
                          ? [
                              ...new Set([
                                ...selectedDrivers,
                                ...slice(visibleDrivers).map((d) => d.id),
                              ]),
                            ]
                          : selectedDrivers.filter(
                              (id) =>
                                !slice(visibleDrivers).some((d) => d.id === id),
                            ),
                      )
                    }
                  />,
                  "Driver",
                  "Phone",
                  "Vehicle",
                  "Status",
                  "Joined",
                  "Actions",
                ]}
                rows={slice(visibleDrivers).map((d) => [
                  <input
                    key="select"
                    type="checkbox"
                    aria-label={`Select ${d.name}`}
                    checked={selectedDrivers.includes(d.id)}
                    onChange={(e) =>
                      setSelectedDrivers(
                        e.target.checked
                          ? [...selectedDrivers, d.id]
                          : selectedDrivers.filter((id) => id !== d.id),
                      )
                    }
                  />,
                  <button
                    key="cell-847"
                    className="person-button"
                    onClick={() => showDriver(d)}
                  >
                    <Person name={d.name} sub={d.id} />
                  </button>,
                  d.phone,
                  <span key="cell-854" className="stack">
                    <strong>{d.vehicle}</strong>
                    <small>{d.plate}</small>
                  </span>,
                  <Badge key="cell-858">{d.status}</Badge>,
                  d.joined,
                  <button
                    key="cell-860"
                    className="icon-button"
                    aria-label={`View ${d.name}`}
                    onClick={() => showDriver(d)}
                  >
                    <Icon name="More" size={18} />
                  </button>,
                ])}
              />
              {pager(visibleDrivers.length)}
            </section>
          )}
          {page === "Drivers" && driver && (
            <div className="driver-layout">
              <aside className="panel profile-card">
                <Avatar name={driver.name} large />
                <h2>{driver.name}</h2>
                <p>{driver.id}</p>
                <Badge>{driver.status}</Badge>
                <dl className="profile-facts">
                  {[
                    ["Phone", driver.phone],
                    ["Mail", driver.email],
                    ["Pin", `${driver.city}, Centre`],
                    ["Calendar", `Joined: ${driver.joined}`],
                    ["Star", `${driver.rating} (${driver.trips} trips)`],
                  ].map(([icon, value]) => (
                    <div key={icon}>
                      <dt>
                        <Icon name={icon} size={18} />
                        <span className="sr-only">{icon}</span>
                      </dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="profile-actions">
                  <button
                    className="danger"
                    onClick={() =>
                      setDetail({ kind: "driverStatus", id: driver.id })
                    }
                  >
                    {driver.status === "Suspended"
                      ? "Reactivate"
                      : driver.status === "Pending review"
                        ? "Review"
                        : "Suspend"}
                  </button>
                  <button
                    className="primary"
                    onClick={() =>
                      setDetail({ kind: "message", id: driver.id })
                    }
                  >
                    Send Message
                  </button>
                </div>
              </aside>
              <div className="driver-main">
                <div
                  className="tabs"
                  role="tablist"
                  aria-label="Driver details"
                >
                  {[
                    "Overview",
                    "Documents",
                    "Vehicle",
                    "Trips",
                    "Earnings",
                  ].map((t) => (
                    <button
                      key={t}
                      role="tab"
                      aria-selected={driverTab === t}
                      className={driverTab === t ? "active" : ""}
                      onClick={() => setDriverTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {driverTab === "Overview" && (
                  <>
                    <div className="stats-grid mini profile-stats">
                      {[
                        [
                          "Vehicles",
                          String(driver.trips),
                          "Total Trips",
                          "blue",
                        ],
                        ["Star", driver.rating, "Rating", "orange"],
                        [
                          "Layers",
                          money(
                            driver.id === "DR-001234"
                              ? 1250000
                              : driver.trips * 4800,
                          ),
                          "Total Earnings",
                          "green",
                        ],
                      ].map(([icon, value, label, color]) => (
                        <div className="stat" key={label}>
                          <span className={`stat-icon ${color}`}>
                            <Icon name={icon} size={24} />
                          </span>
                          <div className="stat-content">
                            <strong>{value}</strong>
                            <span>{label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Panel title="Recent Trips">
                      <Table
                        headers={[
                          "Date & Time",
                          "Pick-up",
                          "Drop-off",
                          "Fare",
                          "Status",
                        ]}
                        rows={trips
                          .filter((t) => t.driver === driver.name)
                          .slice(0, 3)
                          .map((t) => [
                            t.date,
                            t.pickup,
                            t.dropoff,
                            money(t.fare),
                            <Badge key="status">{t.status}</Badge>,
                          ])}
                      />
                      <div className="panel-foot">
                        <button
                          className="text-link"
                          onClick={() => setDriverTab("Trips")}
                        >
                          View all trips
                          <Icon name="Arrow" size={16} />
                        </button>
                      </div>
                    </Panel>
                  </>
                )}
                {driverTab === "Documents" && (
                  <Panel title="Verification documents">
                    <p className="panel-note">
                      Sample document records. No personal documents are stored
                      in this preview.
                    </p>
                    {[
                      "Identity document",
                      "Driver’s licence",
                      "Professional driving permit",
                      "Driver photo",
                    ].map((d) => (
                      <div className="document-row" key={d}>
                        <span className="document-icon">
                          <Icon name="Reports" />
                        </span>
                        <strong>{d}</strong>
                        <Badge>
                          {driver.status === "Approved"
                            ? "Approved"
                            : "Pending review"}
                        </Badge>
                      </div>
                    ))}
                    <div className="panel-padding">
                      <button
                        className="primary"
                        onClick={() =>
                          setDetail({ kind: "driverStatus", id: driver.id })
                        }
                      >
                        Review application
                      </button>
                    </div>
                  </Panel>
                )}
                {driverTab === "Vehicle" && (
                  <Panel title={`Registered vehicles (${driverVehicles.length})`}>
                    <p className="panel-note">
                      Sample registration records. Document files are not available
                      in this demo.
                    </p>
                    <div className="registered-vehicles">
                      {driverVehicles.map((vehicle) => (
                        <article className="registered-vehicle" key={vehicle.id}>
                          <header className="registered-vehicle-heading">
                            <VehicleArt name={vehicle.name} />
                            <div>
                              <h3>{vehicle.name}</h3>
                              <p>{vehicle.plate}</p>
                            </div>
                            <Badge>{vehicle.status}</Badge>
                          </header>
                          <VehicleDetails vehicle={vehicle} />
                          <button
                            className="secondary"
                            onClick={() =>
                              setDetail({ kind: "vehicle", id: vehicle.id })
                            }
                          >
                            Review vehicle registration
                            <Icon name="Arrow" size={16} />
                          </button>
                        </article>
                      ))}
                      {!driverVehicles.length && (
                        <div className="empty">
                          No registered vehicles for this driver.
                        </div>
                      )}
                    </div>
                  </Panel>
                )}
                {driverTab === "Trips" && (
                  <Panel title="Trip history">
                    {tripTable(
                      trips
                        .filter((t) => t.driver === driver.name)
                        .slice(0, 20),
                    )}
                  </Panel>
                )}
                {driverTab === "Earnings" && (
                  <Panel title="Earnings summary">
                    <div className="panel-padding">
                      <p className="eyebrow">ILLUSTRATIVE GROSS EARNINGS</p>
                      <h2>
                        {money(
                          driver.id === "DR-001234"
                            ? 1250000
                            : driver.trips * 4800,
                        )}
                      </h2>
                      <p>
                        Calculated from this sample profile. Payouts and fees
                        are not connected.
                      </p>
                      <button
                        className="secondary"
                        onClick={() => navigate("Payments")}
                      >
                        Open payments
                      </button>
                    </div>
                  </Panel>
                )}
              </div>
            </div>
          )}
          {page === "Passengers" && (
            <section className="panel records">
              <div className="toolbar">
                {search}
                {filterControl}
              </div>
              <Table
                headers={["Passenger", "Phone", "Trips", "Status", "Joined"]}
                rows={slice(visiblePassengers).map((p) => [
                  <button
                    key="person"
                    className="person-button"
                    onClick={() => setDetail({ kind: "passenger", id: p.id })}
                  >
                    <Person name={p.name} sub={p.id} />
                  </button>,
                  p.phone,
                  p.trips,
                  <Badge key="cell-1051">{p.status}</Badge>,
                  p.joined,
                ])}
              />
              {pager(visiblePassengers.length)}
            </section>
          )}
          {page === "Trips" && (
            <section className="panel records">
              <div className="toolbar">
                {search}
                {filterControl}
              </div>
              {tripTable(slice(visibleTrips))}
              {pager(visibleTrips.length)}
            </section>
          )}
          {page === "Vehicles" && (
            <section className="panel records">
              {tabs(["Pending review", "Approved", "Rejected"], vehicles)}
              <div className="vehicle-list">
                {slice(visibleVehicles).map((v) => (
                  <button
                    className="vehicle-row"
                    key={v.id}
                    onClick={() => setDetail({ kind: "vehicle", id: v.id })}
                  >
                    <VehicleArt name={v.name} />
                    <span className="vehicle-info">
                      <strong>{v.name}</strong>
                      <span>{v.plate}</span>
                      <small>Driver: {v.driver}</small>
                    </span>
                    <span className="submitted">Submitted {v.submitted}</span>
                    <Badge>{v.status}</Badge>
                    <Icon name="Chevron" size={18} />
                  </button>
                ))}
                {!visibleVehicles.length && (
                  <div className="empty">No vehicles match your search.</div>
                )}
              </div>
              {pager(visibleVehicles.length)}
            </section>
          )}
          {page === "Support" && (
            <section className="panel records">
              {tabs(["All", "Open", "In progress", "Resolved"], tickets)}
              <Table
                headers={[
                  "Ticket #",
                  "Subject",
                  "User",
                  "Type",
                  "Status",
                  "Created",
                ]}
                rows={slice(visibleTickets).map((t) => [
                  <button
                    key="ticket"
                    className="record-link"
                    onClick={() => setDetail({ kind: "ticket", id: t.id })}
                  >
                    {t.id}
                  </button>,
                  <button
                    key="subject"
                    className="record-link"
                    onClick={() => setDetail({ kind: "ticket", id: t.id })}
                  >
                    {t.subject}
                  </button>,
                  t.user,
                  t.type,
                  <Badge key="status">{t.status}</Badge>,
                  t.created,
                ])}
              />
              {pager(visibleTickets.length)}
            </section>
          )}
          {page === "Payments" && (
            <>
              <div className="stats-grid mini">
                <div className="stat">
                  <span>Completed trip fares</span>
                  <strong>{money(counts.revenue)}</strong>
                </div>
                <div className="stat">
                  <span>Cash trips</span>
                  <strong>
                    {trips.filter((t) => t.status === "Completed").length}
                  </strong>
                </div>
                <div className="stat">
                  <span>Payment environment</span>
                  <strong>Preview</strong>
                  <small>No live transactions</small>
                </div>
              </div>
              <Panel title="Sample transactions">
                <Table
                  headers={["Trip", "Driver", "Method", "Amount", "Status"]}
                  rows={trips
                    .filter((t) => t.status === "Completed")
                    .slice(0, 8)
                    .map((t) => [
                      t.id,
                      t.driver,
                      "Cash",
                      money(t.fare),
                      <Badge key="cell-1180">Completed</Badge>,
                    ])}
                />
              </Panel>
            </>
          )}
          {page === "Reports" && (
            <>
              <div className="stats-grid">
                {stats.map(([icon, value, label]) => (
                  <div className="stat" key={icon}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>January 2025 ? Demo data</small>
                  </div>
                ))}
              </div>
              <Panel title="Trip activity report">
                <div className="panel-padding">
                  <h2>Your operations, in one download.</h2>
                  <p>
                    Export the sample trip records, including fares and
                    completion status, as a CSV spreadsheet.
                  </p>
                  <button className="primary" onClick={downloadReport}>
                    <Icon name="Download" />
                    Download report
                  </button>
                </div>
              </Panel>
            </>
          )}
          {page === "Settings" && (
            <Panel title="Workspace profile">
              <form
                className="settings-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setToast("Profile updated for this preview session");
                }}
              >
                <label>
                  Display name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <div className="settings-info">
                  <span>
                    Region<strong>Cameroon</strong>
                  </span>
                  <span>
                    Currency<strong>XAF / FCFA</strong>
                  </span>
                </div>
                <p>
                  Changes apply to this preview session. Administrator accounts
                  and permissions will be connected to the backend.
                </p>
                <button className="primary" type="submit">
                  Save preferences
                </button>
              </form>
            </Panel>
          )}
        </main>
      </div>
      {toast && (
        <div role="status" className="toast">
          <Icon name="Check" />
          {toast}
        </div>
      )}
      {detail && (
        <dialog
          className="admin-dialog"
          aria-label="Record details"
          onCancel={() => setDetail(null)}
        >
          <div className="dialog-header">
            <span className="eyebrow">VOOMA / SAMPLE RECORD</span>
            <button
              className="icon-button"
              autoFocus
              aria-label="Close dialog"
              onClick={() => setDetail(null)}
            >
              <Icon name="Close" />
            </button>
          </div>
          {(() => {
            if (detail.kind === "message")
              return (
                <>
                  <h2>Message {driver?.name}</h2>
                  <p>
                    Draft a message for this sample driver. Messages stay in
                    this preview.
                  </p>
                  <form
                    className="dialog-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const message = String(
                        new FormData(event.currentTarget).get("message"),
                      ).trim();
                      if (!message) return;
                      setDriverMessages((previous) => ({
                        ...previous,
                        [detail.id]: message,
                      }));
                      setDetail(null);
                      setToast("Message saved in this demo session");
                    }}
                  >
                    <label>
                      Message
                      <textarea
                        name="message"
                        defaultValue={driverMessages[detail.id] ?? ""}
                        required
                        rows={5}
                        placeholder="Write your message..."
                      />
                    </label>
                    <button className="primary" type="submit">
                      Save demo message
                    </button>
                  </form>
                </>
              );
            if (detail.kind === "addDriver" || detail.kind === "addTicket")
              return (
                <>
                  <h2>
                    {detail.kind === "addDriver"
                      ? "Add sample driver"
                      : "Create sample ticket"}
                  </h2>
                  <p>This creates a record in the UI preview only.</p>
                  <form
                    className="dialog-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.currentTarget);
                      const title = String(data.get("title")).trim();
                      if (!title) return;
                      if (detail.kind === "addDriver")
                        setDrivers([
                          {
                            ...initialDrivers[0],
                            id: `DR-DEMO-${drivers.length + 1}`,
                            name: title,
                            email: String(data.get("email")),
                            phone: String(data.get("phone")),
                            status: "Pending review",
                            trips: 0,
                            rating: "—",
                            joined: "Today",
                            vehicle: "Not provided",
                            plate: "Not provided",
                          },
                          ...drivers,
                        ]);
                      else
                        setTickets([
                          {
                            id: `SUP-DEMO-${tickets.length + 1}`,
                            subject: title,
                            user: name,
                            type: "Admin",
                            status: "Open",
                            priority: "Normal",
                            created: "Today",
                          },
                          ...tickets,
                        ]);
                      setTab("All");
                      setQuery("");
                      setCurrent(1);
                      setDetail(null);
                      setToast("Sample record created");
                    }}
                  >
                    <label>
                      {detail.kind === "addDriver" ? "Full name" : "Subject"}
                      <input name="title" required maxLength={100} />
                    </label>
                    {detail.kind === "addDriver" && (
                      <>
                        <label>
                          Email
                          <input name="email" type="email" required />
                        </label>
                        <label>
                          Phone
                          <input name="phone" type="tel" required />
                        </label>
                      </>
                    )}
                    <button className="primary" type="submit">
                      Create sample record
                    </button>
                  </form>
                </>
              );
            if (detail.kind === "driverStatus") {
              const d = drivers.find((x) => x.id === detail.id)!;
              return (
                <>
                  <h2>{d.name}</h2>
                  <p>
                    Update this sample driver’s status. No live account will be
                    affected.
                  </p>
                  <Badge>{d.status}</Badge>
                  <div className="dialog-actions">
                    {["Approved", "Suspended"].map((status) => (
                      <button
                        key={status}
                        className={status === "Approved" ? "primary" : "danger"}
                        onClick={() => {
                          setDrivers(
                            drivers.map((x) =>
                              x.id === d.id ? { ...x, status } : x,
                            ),
                          );
                          setDetail(null);
                          setToast("Sample driver status updated");
                        }}
                      >
                        {status === "Approved"
                          ? "Approve driver"
                          : "Suspend driver"}
                      </button>
                    ))}
                  </div>
                </>
              );
            }
            if (detail.kind === "vehicle") {
              const v = vehicles.find((x) => x.id === detail.id)!;
              return (
                <>
                  <h2>{v.name}</h2>
                  <p>
                    {v.plate} · {v.driver}
                  </p>
                  <Badge>{v.status}</Badge>
                  <VehicleDetails vehicle={v} />
                  <div className="dialog-info">
                    Sample registration records. Document files are not available
                    in this demo.
                  </div>
                  <div className="dialog-actions">
                    {["Approved", "Rejected"].map((status) => (
                      <button
                        key={status}
                        className={status === "Approved" ? "primary" : "danger"}
                        onClick={() => {
                          setVehicles(
                            vehicles.map((x) =>
                              x.id === v.id ? { ...x, status } : x,
                            ),
                          );
                          setDetail(null);
                          setToast("Sample vehicle status updated");
                        }}
                      >
                        {status === "Approved"
                          ? "Approve sample"
                          : "Reject sample"}
                      </button>
                    ))}
                  </div>
                </>
              );
            }
            if (detail.kind === "ticket") {
              const ticket = tickets.find((x) => x.id === detail.id)!;
              return (
                <>
                  <p className="eyebrow">{ticket.id}</p>
                  <h2>{ticket.subject}</h2>
                  <p>
                    Reported by {ticket.user} · {ticket.type}
                  </p>
                  <Badge>{ticket.status}</Badge>
                  <div className="dialog-info">
                    Sample support case. Messages and live case assignments are
                    not connected.
                  </div>
                  <label className="field-label">
                    Status
                    <select
                      value={ticket.status}
                      onChange={(e) => {
                        setTickets(
                          tickets.map((t) =>
                            t.id === ticket.id
                              ? { ...t, status: e.target.value }
                              : t,
                          ),
                        );
                        setToast("Sample ticket updated");
                      }}
                    >
                      <option>Open</option>
                      <option>In progress</option>
                      <option>Resolved</option>
                    </select>
                  </label>
                </>
              );
            }
            if (detail.kind === "passenger") {
              const p = passengers.find((x) => x.id === detail.id)!;
              return (
                <>
                  <Person name={p.name} sub={p.id} />
                  <dl className="detail-list">
                    <dt>Email</dt>
                    <dd>{p.email}</dd>
                    <dt>Phone</dt>
                    <dd>{p.phone}</dd>
                    <dt>Trips</dt>
                    <dd>{p.trips}</dd>
                    <dt>Status</dt>
                    <dd>
                      <Badge>{p.status}</Badge>
                    </dd>
                  </dl>
                </>
              );
            }
            const t = trips.find((x) => x.id === detail.id)!;
            return (
              <>
                <h2>{t.id}</h2>
                <Badge>{t.status}</Badge>
                <dl className="detail-list">
                  <dt>Driver</dt>
                  <dd>{t.driver}</dd>
                  <dt>Passenger</dt>
                  <dd>{t.passenger}</dd>
                  <dt>Pickup</dt>
                  <dd>{t.pickup}</dd>
                  <dt>Drop-off</dt>
                  <dd>{t.dropoff}</dd>
                  <dt>Fare</dt>
                  <dd>{money(t.fare)}</dd>
                  <dt>Date</dt>
                  <dd>{t.date}</dd>
                </dl>
              </>
            );
          })()}
        </dialog>
      )}
    </div>
  );
}
