import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from "http";
import { flights, bookings, lockedSeats, getSeats } from "./data.js";
import { generatePNR, recommendationScore } from "./utils.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" }
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SmartFlight API is running" });
});

app.get("/api/flights", (req, res) => {
  const { source, destination, sort = "recommended" } = req.query;

  let result = flights.filter(f =>
    (!source || f.source.toLowerCase() === source.toLowerCase()) &&
    (!destination || f.destination.toLowerCase() === destination.toLowerCase())
  );

  const minPrice = Math.min(...result.map(f => f.price), 0);
  const maxDuration = Math.max(...result.map(f => f.durationMinutes), 1);

  result = result.map(f => ({
    ...f,
    recommendationScore: recommendationScore(f, minPrice, maxDuration)
  }));

  if (sort === "price") result.sort((a, b) => a.price - b.price);
  else if (sort === "duration") result.sort((a, b) => a.durationMinutes - b.durationMinutes);
  else result.sort((a, b) => b.recommendationScore - a.recommendationScore);

  const cheapest = [...result].sort((a, b) => a.price - b.price)[0]?.id;
  const fastest = [...result].sort((a, b) => a.durationMinutes - b.durationMinutes)[0]?.id;

  result = result.map(f => ({
    ...f,
    badge:
      f.id === cheapest && f.id === fastest
        ? "Best Overall"
        : f.id === cheapest
        ? "Cheapest"
        : f.id === fastest
        ? "Fastest"
        : null,
    availableSeats: getSeats(f.id).filter(s => s.status === "AVAILABLE").length
  }));

  res.json(result);
});

app.get("/api/flights/:id/seats", (req, res) => {
  const flight = flights.find(f => f.id === req.params.id);
  if (!flight) return res.status(404).json({ message: "Flight not found" });
  res.json(getSeats(flight.id));
});

app.post("/api/flights/:id/lock-seats", (req, res) => {
  const flightId = req.params.id;
  const { seats } = req.body;

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Select at least one seat" });
  }

  const currentSeats = getSeats(flightId);
  const invalid = seats.find(
    seat => !currentSeats.some(s => s.number === seat && s.status === "AVAILABLE")
  );

  if (invalid) {
    return res.status(409).json({ message: `Seat ${invalid} is no longer available` });
  }

  const expiresAt = Date.now() + 5 * 60 * 1000;

  for (const seat of seats) {
    lockedSeats.set(`${flightId}:${seat}`, { expiresAt });
  }

  io.emit("seat-updated", { flightId });
  res.json({ success: true, expiresAt });
});

app.post("/api/bookings", (req, res) => {
  const { flightId, seats, passenger } = req.body;

  const flight = flights.find(f => f.id === flightId);
  if (!flight) return res.status(404).json({ message: "Flight not found" });

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "No seats selected" });
  }

  for (const seat of seats) {
    const lock = lockedSeats.get(`${flightId}:${seat}`);
    if (!lock || lock.expiresAt < Date.now()) {
      return res.status(409).json({
        message: `Seat ${seat} is not locked for this booking. Please select again.`
      });
    }
  }

  const booking = {
    id: `BK-${Date.now()}`,
    pnr: generatePNR(),
    flightId,
    flightNumber: flight.flightNumber,
    airline: flight.airline,
    source: flight.source,
    destination: flight.destination,
    seats,
    passenger,
    amount: flight.price * seats.length,
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);

  for (const seat of seats) {
    lockedSeats.delete(`${flightId}:${seat}`);
  }

  io.emit("seat-updated", { flightId });
  res.status(201).json(booking);
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings.slice().reverse());
});

app.get("/api/admin/stats", (req, res) => {
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const confirmed = bookings.filter(b => b.status === "CONFIRMED").length;

  res.json({
    totalFlights: flights.length,
    totalBookings: bookings.length,
    confirmedBookings: confirmed,
    revenue: totalRevenue,
    occupancyRate: bookings.length
      ? Math.min(100, Math.round((confirmed / Math.max(flights.length * 30, 1)) * 100))
      : 0
  });
});

io.on("connection", socket => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

setInterval(() => {
  for (const [key, lock] of lockedSeats.entries()) {
    if (lock.expiresAt <= Date.now()) lockedSeats.delete(key);
  }
}, 30_000);

server.listen(PORT, () => {
  console.log(`SmartFlight API running on http://localhost:${PORT}`);
});
