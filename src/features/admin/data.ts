export type Driver = {
  live?: boolean;
  applicationVersion?: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle: string;
  plate: string;
  registeredVehicleId: string | null;
  status: string;
  joined: string;
  trips: number;
  rating: string;
};

export type Vehicle = {
  live?: boolean;
  id: string;
  driverId: string;
  driver: string;
  name: string;
  plate: string;
  make: string;
  model: string;
  year: number | null;
  colour: string;
  status: string;
  submitted: string;
};

// Deterministic demo records keep the reference totals, filters and pagination consistent.
const names = [
  "Olivier Mvondo",
  "Claire Ngono",
  "Jean Fotso",
  "Sandra Bissou",
  "Eric Tchoua",
  "Marie Abena",
  "Paul Ndongo",
  "Alice Manga",
  "David Kamga",
  "Estelle Njoya",
  "Daniel Ewane",
  "Grace Atanga",
];
const phones = [
  "+237 6 71 23 45 67",
  "+237 6 98 76 54 32",
  "+237 6 54 32 10 98",
  "+237 6 77 88 99 00",
];
export const initialDrivers: Driver[] = Array.from(
  { length: 2630 },
  (_, i) => ({
    id: `DR-${String(1234 + i).padStart(6, "0")}`,
    name:
      i < names.length
        ? names[i]
        : `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    email:
      i === 0 ? "olivier.mvondo@email.com" : `driver.${1234 + i}@example.test`,
    phone:
      i < 4
        ? phones[i]
        : `+237 6 ${String(10000000 + i * 197)
            .slice(-8)
            .replace(/(\d{2})(?=\d)/g, "$1 ")}`,
    city: i % 3 === 1 ? "Douala" : "Yaoundé",
    vehicle: ["Toyota Corolla", "Kia Picanto", "Yamaha Moto", "Toyota Yaris"][
      i % 4
    ],
    plate: ["CA 123 456", "LT 456 789", "MT 321 654", "CE 987 654"][i % 4],
    registeredVehicleId: `VH-${1001 + i}`,
    status:
      i === 1 || (i >= 4 && i < 187)
        ? "Pending review"
        : i === 3 || (i >= 187 && i < 324)
          ? "Suspended"
          : "Approved",
    joined: `${[12, 14, 10, 8][i % 4]} Jan 2025`,
    trips: Math.max(12, 256 - (i % 12) * 17),
    rating: (4.8 - (i % 4) * 0.1).toFixed(1),
  }),
);
const passengerNames = [
  "Aminata Bello",
  "Paul Tchoua",
  "Marie Ewane",
  "Guy Nkoum",
  "Luc Mba",
  "Sarah Abena",
  "Alex Njoya",
  "Juliette Owona",
];
export const passengers = Array.from({ length: 8320 }, (_, i) => ({
  id: `PS-${String(4501 + i).padStart(6, "0")}`,
  name:
    i < passengerNames.length
      ? passengerNames[i]
      : `${passengerNames[i % 8]} ${Math.floor(i / 8) + 1}`,
  email: `passenger.${4501 + i}@example.test`,
  phone: [
    "+237 6 55 44 33 22",
    "+237 6 66 77 88 99",
    "+237 6 12 34 56 78",
    "+237 6 98 76 54 32",
  ][i % 4],
  trips: [42, 27, 18, 10][i % 4],
  status: i % 8 === 3 ? "Blocked" : "Active",
  joined: `${[10, 11, 12, 5][i % 4]} Jan 2025`,
}));
export const trips = Array.from({ length: 12480 }, (_, i) => {
  const driver = initialDrivers[[0, 2, 1, 3, 0][i % 5]];
  const passenger = passengers[i % 8];
  return {
    id: `TR-${894321 - i}`,
    date: `${30 - (Math.floor(i / 5) % 30)} Jan, ${["14:20", "13:05", "12:11", "11:02", "09:48"][i % 5]}`,
    day: 30 - (Math.floor(i / 5) % 30),
    driver: driver.name,
    driverId: driver.id,
    passenger: passenger.name,
    passengerPhone: passenger.phone,
    type: ["Car", "Moto", "Car", "Tricycle", "Car"][i % 5],
    fare: [2000, 1000, 2500, 1500, 2000][i % 5],
    status: i % 7 === 3 ? "Cancelled" : "Completed",
    pickup: ["Bastos, Yaoundé", "Nlongkak", "Ngousso"][i % 3],
    dropoff: ["Melen, Yaoundé", "Centre Ville", "Etoudi"][i % 3],
  };
});
export const initialVehicles: Vehicle[] = Array.from(
  { length: 5578 },
  (_, i) => {
    const driverIndex = i % initialDrivers.length;
    const driver = initialDrivers[driverIndex];
    const [make, ...model] = driver.vehicle.split(" ");
    return {
      id: `VH-${1001 + i}`,
      driverId: driver.id,
      driver: driver.name,
      name: driver.vehicle,
      plate: driver.plate,
      make,
      model: model.join(" "),
      year: [2021, 2020, 2022, 2019][driverIndex % 4],
      colour: ["White", "Silver", "Black", "Blue"][driverIndex % 4],
      status: i < 96 ? "Pending review" : i < 5516 ? "Approved" : "Rejected",
      submitted: `${30 - (i % 3)} Jan 2025`,
    };
  },
);
const ticketSamples = [
  ["Unable to start trip", "Olivier Mvondo", "Driver"],
  ["Payment not received", "Aminata Bello", "Passenger"],
  ["Update vehicle documents", "Jean Fotso", "Driver"],
  ["Trip fare dispute", "Paul Tchoua", "Passenger"],
  ["Lost item on trip", "Marie Ewane", "Passenger"],
  ["Account access", "Claire Ngono", "Driver"],
];
export const initialTickets = Array.from({ length: 320 }, (_, i) => ({
  id: `SUP-${String(984 - i).padStart(5, "0")}`,
  subject: ticketSamples[i % 6][0],
  user: ticketSamples[i % 6][1],
  type: ticketSamples[i % 6][2],
  status:
    i === 0 || i === 2 || (i >= 4 && i < 44)
      ? "Open"
      : i === 1 || (i >= 44 && i < 61)
        ? "In progress"
        : "Resolved",
  priority: i % 3 === 0 ? "High" : "Normal",
  created: `${30 - (Math.floor(i / 2) % 28)} Jan 2025`,
}));
export const money = (value: number) => `${value.toLocaleString("en-US")} XAF`;
