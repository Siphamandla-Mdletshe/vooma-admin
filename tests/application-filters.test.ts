import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterApplications,
  initialApplicationFilters,
  applicationTabs,
} from "../src/features/admin/application-filters.ts";
import type { Driver } from "../src/features/admin/data.ts";
import { selectedDriversCsv } from "../src/features/admin/driver-export.ts";

function driver(value: Partial<Driver>): Driver {
  return {
    id: "application-1",
    name: "Alice Driver",
    email: "alice@example.test",
    phone: "+27712345678",
    city: "Johannesburg",
    vehicle: "Toyota Corolla",
    vehicleMake: "Toyota",
    plate: "TEST 001 GP",
    registeredVehicleId: "vehicle-1",
    status: "Pending review",
    joined: "10 Nov 2026",
    trips: 0,
    rating: "—",
    createdAt: new Date(2026, 10, 10, 9).getTime(),
    updatedAt: new Date(2026, 10, 10, 9).getTime(),
    ...value,
  };
}

const applications = [
  driver({ id: "pending" }),
  driver({
    id: "corrections",
    name: "Bongi Driver",
    city: "Pretoria",
    vehicleMake: "Ford",
    status: "Changes requested",
    createdAt: new Date(2026, 10, 8, 9).getTime(),
    updatedAt: new Date(2026, 10, 11, 9).getTime(),
  }),
  driver({
    id: "rejected",
    name: "Chris Driver",
    status: "Rejected",
    createdAt: new Date(2026, 10, 9, 9).getTime(),
  }),
  driver({ id: "unfinished", status: "Incomplete" }),
];

test("body type and pending appeal filters find the relevant vehicles and cases", () => {
  const pending = driver({
    id: "case",
    status: "Suspended",
    vehicleBodyType: "sedan",
    appeal: {
      status: "pending",
      message: "Please review.",
      submittedAt: 1,
      decisionReason: null,
      resolvedAt: null,
    },
  });
  assert.deepEqual(
    filterApplications([pending, ...applications], "", {
      ...initialApplicationFilters,
      bodyType: "sedan",
      appealsOnly: true,
    }).map((driver) => driver.id),
    ["case"],
  );
  assert.equal(
    filterApplications([pending], "", {
      ...initialApplicationFilters,
      bodyType: "suv",
    }).length,
    0,
  );
});

test("selected driver export quotes fields and prevents spreadsheet formula execution", () => {
  const csv = selectedDriversCsv([
    driver({
      name: "=SUM(1,2)",
      email: 'a"b@example.test',
      vehicleBodyType: "sedan",
    }),
  ]);
  assert.ok(csv.startsWith('\uFEFF"Application ID"'));
  assert.ok(csv.includes('"\'=SUM(1,2)"'));
  assert.ok(csv.includes('"a""b@example.test"'));
  assert.ok(csv.includes('"sedan"'));
  assert.equal(csv.split("\r\n").length, 2);
});

test("the review queue hides unsubmitted drafts and includes changes requested", () => {
  const found = filterApplications(applications, "", initialApplicationFilters);
  assert.ok(applicationTabs.includes("Changes requested"));
  assert.deepEqual(
    found.map((driver) => driver.id),
    ["pending", "rejected", "corrections"],
  );
  assert.equal(
    found.find((driver) => driver.id === "corrections")?.status,
    "Changes requested",
  );
});

test("city, make, and date filters combine across review statuses", () => {
  const found = filterApplications(applications, "", {
    ...initialApplicationFilters,
    city: "Johannesburg",
    make: "Toyota",
    from: "2026-11-09",
    until: "2026-11-10",
  });
  assert.deepEqual(
    found.map((driver) => driver.id),
    ["pending", "rejected"],
  );
  assert.deepEqual(
    filterApplications(applications, "", {
      ...initialApplicationFilters,
      city: "Pretoria",
      make: "Toyota",
    }),
    [],
  );
});

test("text search matches combined driver, contact, plate and application identifiers", () => {
  assert.deepEqual(
    filterApplications(
      applications,
      "chris TEST",
      initialApplicationFilters,
    ).map((driver) => driver.id),
    ["rejected"],
  );
  assert.deepEqual(
    filterApplications(
      applications,
      "alice@example.test Pretoria",
      initialApplicationFilters,
    ).map((driver) => driver.id),
    ["corrections"],
  );
  assert.deepEqual(
    filterApplications(applications, "PENDING", initialApplicationFilters).map(
      (driver) => driver.id,
    ),
    ["pending"],
  );
});

test("date boundaries include the whole local day and invalid ranges find nothing", () => {
  const dates = [
    driver({ id: "start", createdAt: new Date(2026, 10, 10).getTime() }),
    driver({
      id: "end",
      createdAt: new Date(2026, 10, 10, 23, 59, 59).getTime(),
    }),
  ];
  assert.equal(
    filterApplications(dates, "", {
      ...initialApplicationFilters,
      from: "2026-11-10",
      until: "2026-11-10",
    }).length,
    2,
  );
  assert.equal(
    filterApplications(dates, "", {
      ...initialApplicationFilters,
      from: "2026-11-11",
      until: "2026-11-10",
    }).length,
    0,
  );
});

test("oldest and recently updated ordering help prioritize the queue without mutating it", () => {
  assert.deepEqual(
    filterApplications(applications, "", {
      ...initialApplicationFilters,
      sort: "oldest",
    }).map((driver) => driver.id),
    ["corrections", "rejected", "pending"],
  );
  assert.equal(
    filterApplications(applications, "", {
      ...initialApplicationFilters,
      sort: "updated",
    })[0].id,
    "corrections",
  );
  assert.deepEqual(
    applications.map((driver) => driver.id),
    ["pending", "corrections", "rejected", "unfinished"],
  );
});
