export const flights = [
  {
    id: "AI101",
    airline: "Air India",
    flightNumber: "AI-101",
    source: "Delhi",
    sourceCode: "DEL",
    destination: "Mumbai",
    destinationCode: "BOM",
    departure: "2026-11-15T08:30:00",
    arrival: "2026-11-15T10:45:00",
    durationMinutes: 135,
    stops: 0,
    price: 5420,
    baggage: "15 kg",
    aircraft: "Airbus A320",
    totalSeats: 30
  },
  {
    id: "6E202",
    airline: "IndiGo",
    flightNumber: "6E-202",
    source: "Delhi",
    sourceCode: "DEL",
    destination: "Mumbai",
    destinationCode: "BOM",
    departure: "2026-11-15T11:15:00",
    arrival: "2026-11-15T13:25:00",
    durationMinutes: 130,
    stops: 0,
    price: 5180,
    baggage: "15 kg",
    aircraft: "Airbus A320neo",
    totalSeats: 30
  },
  {
    id: "6E310",
    airline: "IndiGo",
    flightNumber: "6E-310",
    source: "Delhi",
    sourceCode: "DEL",
    destination: "Bangalore",
    destinationCode: "BLR",
    departure: "2026-11-15T07:20:00",
    arrival: "2026-11-15T10:05:00",
    durationMinutes: 165,
    stops: 0,
    price: 6100,
    baggage: "15 kg",
    aircraft: "Airbus A321",
    totalSeats: 36
  },
  {
    id: "AI405",
    airline: "Air India",
    flightNumber: "AI-405",
    source: "Mumbai",
    sourceCode: "BOM",
    destination: "Bangalore",
    destinationCode: "BLR",
    departure: "2026-11-15T14:10:00",
    arrival: "2026-11-15T15:55:00",
    durationMinutes: 105,
    stops: 0,
    price: 4720,
    baggage: "20 kg",
    aircraft: "Airbus A320",
    totalSeats: 30
  },
  {
    id: "6E501",
    airline: "IndiGo",
    flightNumber: "6E-501",
    source: "Delhi",
    sourceCode: "DEL",
    destination: "Kolkata",
    destinationCode: "CCU",
    departure: "2026-11-15T16:00:00",
    arrival: "2026-11-15T18:20:00",
    durationMinutes: 140,
    stops: 0,
    price: 4980,
    baggage: "15 kg",
    aircraft: "Airbus A320",
    totalSeats: 30
  }
];

export const bookings = [];
export const lockedSeats = new Map();

export function getSeats(flightId) {
  const flight = flights.find(f => f.id === flightId);
  if (!flight) return [];

  const seats = [];
  const rows = Math.ceil(flight.totalSeats / 6);

  for (let row = 1; row <= rows; row++) {
    for (const letter of ["A", "B", "C", "D", "E", "F"]) {
      const number = `${row}${letter}`;
      const booked = bookings.some(
        b => b.flightId === flightId && b.seats.includes(number) && b.status === "CONFIRMED"
      );
      const lock = lockedSeats.get(`${flightId}:${number}`);
      const locked = lock && lock.expiresAt > Date.now();

      seats.push({
        number,
        status: booked ? "BOOKED" : locked ? "LOCKED" : "AVAILABLE"
      });
    }
  }

  return seats;
}
