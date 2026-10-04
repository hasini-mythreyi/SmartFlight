# SmartFlight — Flight Ticket Booking System

A full-stack flight reservation project built for a web-development resume.

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (optional for the first UI/demo run)
- Authentication: JWT-ready structure
- Real-time: Socket.IO-ready structure

## Current implementation
- Responsive landing page
- Flight search
- Search results with sorting/filtering
- Smart recommendation labels: Best Overall / Cheapest / Fastest
- Flight details
- Interactive seat selection
- Temporary seat-lock API (in-memory for demo)
- Passenger details
- Booking creation
- Booking confirmation / PNR
- My Bookings
- Admin dashboard UI
- REST API structure

## Run

### 1. Backend
```bash
cd server
npm install
npm run dev
```

Backend runs on http://localhost:5000

### 2. Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

Frontend runs on the URL shown by Vite, normally http://localhost:5173

## Notes
This version deliberately keeps payment and persistent MongoDB storage out of the first runnable version so you can understand the complete flow before adding production integrations.

The backend currently uses demo in-memory flight/booking data. MongoDB can be added in the next stage without changing the frontend architecture.
