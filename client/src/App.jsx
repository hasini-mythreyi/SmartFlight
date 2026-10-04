import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Plane, Search, ArrowRight, Clock3, Luggage, ShieldCheck, UserRound, LayoutDashboard, Ticket, ChevronRight, CheckCircle2 } from "lucide-react";
import { api } from "./api";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-blue-600">
          <Plane size={24} /> SmartFlight
        </Link>
        <div className="flex items-center gap-5 text-sm font-semibold text-slate-600">
          <Link to="/bookings" className="hover:text-blue-600">My Bookings</Link>
          <Link to="/admin" className="hover:text-blue-600">Admin</Link>
        </div>
      </div>
    </nav>
  );
}

function SearchBox() {
  const navigate = useNavigate();
  const [source, setSource] = useState("Delhi");
  const [destination, setDestination] = useState("Mumbai");

  function search() {
    navigate(`/flights?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
  }

  return (
    <div className="mx-auto mt-8 grid max-w-6xl gap-3 rounded-3xl bg-white p-4 shadow-2xl md:grid-cols-[1fr_auto_1fr_150px]">
      <label className="rounded-2xl bg-slate-50 p-3">
        <span className="text-xs font-bold text-slate-400">FROM</span>
        <input value={source} onChange={e => setSource(e.target.value)} className="mt-1 block w-full bg-transparent text-lg font-bold outline-none" />
      </label>
      <div className="hidden items-center justify-center md:flex">
        <div className="rounded-full bg-blue-50 p-3 text-blue-600"><ArrowRight size={18}/></div>
      </div>
      <label className="rounded-2xl bg-slate-50 p-3">
        <span className="text-xs font-bold text-slate-400">TO</span>
        <input value={destination} onChange={e => setDestination(e.target.value)} className="mt-1 block w-full bg-transparent text-lg font-bold outline-none" />
      </label>
      <button onClick={search} className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
        <Search size={18}/> Search
      </button>
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-blue-500/15 px-4 py-2 text-sm font-bold text-blue-300">SMART TRAVEL • SIMPLE BOOKING</p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Find the flight that fits <span className="text-blue-400">you.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Compare flights, discover the best option, choose your seat and manage your trip from one platform.
            </p>
          </div>
          <SearchBox />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-3">
        {[
          [ShieldCheck, "Secure booking", "Designed around a clear booking lifecycle and protected user actions."],
          [Clock3, "Smart comparison", "Quickly identify the cheapest, fastest and best overall flight."],
          [Ticket, "Easy management", "Keep your booking details and PNR in one convenient place."]
        ].map(([Icon, title, text]) => (
          <div key={title} className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="mb-5 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600"><Icon/></div>
            <h3 className="text-lg font-black">{title}</h3>
            <p className="mt-2 leading-7 text-slate-500">{text}</p>
          </div>
        ))}
      </section>
    </>
  );
}

function FlightCard({ flight }) {
  return (
    <Link to={`/flights/${flight.id}`} className="block rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-black">{flight.airline}</p>
          <p className="text-sm text-slate-400">{flight.flightNumber} • {flight.aircraft}</p>
        </div>
        {flight.badge && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{flight.badge}</span>}
      </div>

      <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div>
          <p className="text-2xl font-black">{new Date(flight.departure).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</p>
          <p className="font-bold text-slate-500">{flight.sourceCode}</p>
        </div>
        <div className="text-center text-slate-400">
          <p className="text-xs">{Math.floor(flight.durationMinutes/60)}h {flight.durationMinutes%60}m</p>
          <div className="my-2 flex items-center gap-2"><div className="h-px w-12 bg-slate-200"/><Plane size={16}/><div className="h-px w-12 bg-slate-200"/></div>
          <p className="text-xs">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black">{new Date(flight.arrival).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</p>
          <p className="font-bold text-slate-500">{flight.destinationCode}</p>
        </div>
      </div>

      <div className="flex items-end justify-between border-t pt-4">
        <div className="flex gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Luggage size={15}/>{flight.baggage}</span>
          <span>{flight.availableSeats} seats left</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">from</p>
          <p className="text-xl font-black">₹{flight.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}

function Flights() {
  const params = new URLSearchParams(location.search);
  const source = params.get("source") || "";
  const destination = params.get("destination") || "";
  const [sort, setSort] = useState("recommended");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/flights", { params: { source, destination, sort }})
      .then(r => setFlights(r.data))
      .finally(() => setLoading(false));
  }, [source, destination, sort]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-600">FLIGHT RESULTS</p>
          <h1 className="mt-1 text-3xl font-black">{source || "Any city"} → {destination || "Any city"}</h1>
          <p className="mt-1 text-slate-500">{flights.length} options available</p>
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl border bg-white px-4 py-3 font-semibold outline-none">
          <option value="recommended">Recommended</option>
          <option value="price">Cheapest</option>
          <option value="duration">Fastest</option>
        </select>
      </div>

      {loading ? <div className="rounded-3xl bg-white p-10 text-center">Loading flights...</div> :
       flights.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center"><p className="font-black">No flights found</p><p className="mt-2 text-slate-500">Try another route.</p></div> :
       <div className="grid gap-4">{flights.map(f => <FlightCard key={f.id} flight={f}/>)}</div>}
    </main>
  );
}

function SeatPicker({ flightId, onSelected }) {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");

  const load = () => api.get(`/flights/${flightId}/seats`).then(r => setSeats(r.data));
  useEffect(() => { load(); }, [flightId]);

  const toggle = async seat => {
    if (seat.status !== "AVAILABLE") return;
    const next = selected.includes(seat.number)
      ? selected.filter(s => s !== seat.number)
      : [...selected, seat.number];

    setSelected(next);

    if (next.length) {
      try {
        const r = await api.post(`/flights/${flightId}/lock-seats`, { seats: next });
        setMessage(`Selected seats locked for ${Math.ceil((r.data.expiresAt - Date.now())/60000)} minutes.`);
        onSelected(next);
      } catch (e) {
        setMessage(e.response?.data?.message || "Seat could not be locked.");
        setSelected([]);
        onSelected([]);
        load();
      }
    } else {
      setMessage("");
      onSelected([]);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Choose your seats</h2>
          <p className="text-sm text-slate-500">Green = available • Blue = selected • Gray = unavailable</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-2 font-black">{selected.length} selected</div>
      </div>
      <div className="mx-auto max-w-sm rounded-[2rem] border-4 border-slate-100 p-6">
        <div className="mb-7 text-center text-xs font-black text-slate-400">FRONT OF AIRCRAFT</div>
        <div className="grid grid-cols-6 gap-2">
          {seats.map(seat => {
            const isSelected = selected.includes(seat.number);
            const disabled = seat.status !== "AVAILABLE";
            return (
              <button
                key={seat.number}
                disabled={disabled}
                onClick={() => toggle(seat)}
                className={`rounded-lg p-2 text-xs font-black ${
                  isSelected ? "bg-blue-600 text-white" :
                  disabled ? "bg-slate-200 text-slate-400" :
                  "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {seat.number}
              </button>
            );
          })}
        </div>
      </div>
      {message && <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-700">{message}</p>}
    </div>
  );
}

function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passenger, setPassenger] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/flights`).then(r => setFlight(r.data.find(f => f.id === id)));
  }, [id]);

  if (!flight) return <main className="mx-auto max-w-6xl px-5 py-16">Loading...</main>;

  const book = async () => {
    setError("");
    if (!selectedSeats.length) return setError("Please select at least one seat.");
    if (!passenger.name || !passenger.email || !passenger.phone) return setError("Please complete passenger details.");

    try {
      const r = await api.post("/bookings", { flightId: id, seats: selectedSeats, passenger });
      navigate(`/confirmation/${r.data.id}`);
    } catch (e) {
      setError(e.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-7 rounded-3xl bg-slate-950 p-7 text-white">
        <p className="text-blue-300">{flight.airline} • {flight.flightNumber}</p>
        <div className="mt-5 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
          <div><p className="text-3xl font-black">{flight.sourceCode}</p><p className="text-slate-400">{flight.source}</p></div>
          <div className="text-center"><Plane className="mx-auto"/><p className="mt-2 text-sm text-slate-400">{Math.floor(flight.durationMinutes/60)}h {flight.durationMinutes%60}m</p></div>
          <div className="md:text-right"><p className="text-3xl font-black">{flight.destinationCode}</p><p className="text-slate-400">{flight.destination}</p></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <SeatPicker flightId={id} onSelected={setSelectedSeats}/>
        <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Passenger details</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["name", "Full name"],
              ["email", "Email"],
              ["phone", "Phone number"]
            ].map(([key, label]) => (
              <input key={key} value={passenger[key]} onChange={e => setPassenger({...passenger, [key]: e.target.value})} placeholder={label} className="rounded-xl border px-4 py-3 outline-none focus:border-blue-500"/>
            ))}
          </div>

          <div className="my-6 rounded-2xl bg-slate-50 p-4">
            <div className="flex justify-between text-slate-500"><span>Base fare</span><span>₹{(flight.price * selectedSeats.length).toLocaleString()}</span></div>
            <div className="mt-2 flex justify-between text-slate-500"><span>Taxes</span><span>₹0</span></div>
            <div className="mt-3 flex justify-between border-t pt-3 text-lg font-black"><span>Total</span><span>₹{(flight.price * selectedSeats.length).toLocaleString()}</span></div>
          </div>

          {error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
          <button onClick={book} className="w-full rounded-xl bg-blue-600 py-3 font-black text-white hover:bg-blue-700">Confirm Booking</button>
          <p className="mt-3 text-center text-xs text-slate-400">Payment is simulated in this first version.</p>
        </div>
      </div>
    </main>
  );
}

function Confirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.get("/bookings").then(r => setBooking(r.data.find(b => b.id === id)));
  }, [id]);

  if (!booking) return <main className="mx-auto max-w-xl px-5 py-16">Loading confirmation...</main>;

  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto text-emerald-500" size={60}/>
        <p className="mt-5 text-sm font-bold text-emerald-600">BOOKING CONFIRMED</p>
        <h1 className="mt-2 text-3xl font-black">You're ready to fly ✈️</h1>
        <div className="my-8 rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex justify-between"><span className="text-slate-500">PNR</span><strong>{booking.pnr}</strong></div>
          <div className="mt-3 flex justify-between"><span className="text-slate-500">Flight</span><strong>{booking.flightNumber}</strong></div>
          <div className="mt-3 flex justify-between"><span className="text-slate-500">Route</span><strong>{booking.source} → {booking.destination}</strong></div>
          <div className="mt-3 flex justify-between"><span className="text-slate-500">Seats</span><strong>{booking.seats.join(", ")}</strong></div>
          <div className="mt-3 flex justify-between"><span className="text-slate-500">Amount</span><strong>₹{booking.amount.toLocaleString()}</strong></div>
        </div>
        <Link to="/bookings" className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-black text-white">View My Bookings</Link>
      </div>
    </main>
  );
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { api.get("/bookings").then(r => setBookings(r.data)); }, []);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-black">My Bookings</h1>
      <p className="mt-1 text-slate-500">Your recent flight reservations.</p>
      <div className="mt-7 grid gap-4">
        {bookings.length === 0 ? <div className="rounded-3xl bg-white p-8">No bookings yet.</div> :
        bookings.map(b => (
          <div key={b.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-black">{b.source} → {b.destination}</p><p className="text-sm text-slate-500">{b.airline} • {b.flightNumber}</p></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{b.status}</span>
            </div>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
              <div><p className="text-slate-400">PNR</p><p className="font-black">{b.pnr}</p></div>
              <div><p className="text-slate-400">Seats</p><p className="font-black">{b.seats.join(", ")}</p></div>
              <div><p className="text-slate-400">Passenger</p><p className="font-black">{b.passenger.name}</p></div>
              <div><p className="text-slate-400">Amount</p><p className="font-black">₹{b.amount.toLocaleString()}</p></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Admin() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then(r => setStats(r.data)); }, []);

  if (!stats) return <main className="mx-auto max-w-6xl px-5 py-16">Loading dashboard...</main>;

  const cards = [
    ["Total Flights", stats.totalFlights],
    ["Total Bookings", stats.totalBookings],
    ["Confirmed", stats.confirmedBookings],
    ["Revenue", `₹${stats.revenue.toLocaleString()}`]
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-3"><LayoutDashboard className="text-blue-600"/><div><h1 className="text-3xl font-black">Admin Dashboard</h1><p className="text-slate-500">Flight and booking overview.</p></div></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => <div key={label} className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-bold text-slate-400">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}
      </div>
      <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
        <h2 className="font-black">System status</h2>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700"><CheckCircle2 size={18}/> Booking API is operational.</div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-blue-700"><UserRound size={18}/> Occupancy estimate: {stats.occupancyRate}%</div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/flights" element={<Flights/>}/>
        <Route path="/flights/:id" element={<FlightDetails/>}/>
        <Route path="/confirmation/:id" element={<Confirmation/>}/>
        <Route path="/bookings" element={<Bookings/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-slate-400">SmartFlight • Resume Web Development Project</div>
      </footer>
    </>
  );
}
