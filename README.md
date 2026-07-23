# Live Polling App (MERN + Socket.io)

Real-time polling/voting app — create a poll, share the link or QR code, and watch results update live as people vote.

## Features
- Create poll with question + multiple options
- Unique shareable link + auto-generated QR code
- Vote without login (IP-based duplicate vote prevention)
- Live results via Socket.io — no refresh needed
- Animated bar chart results (Recharts)
- Optional poll expiry (auto-closes after N minutes)
- Dark mode ready (Tailwind `dark:` classes)

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Recharts, qrcode.react, Socket.io-client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io

## Project Structure
```
polling-app/
├── server/          # Express + Socket.io backend
│   ├── models/       # Poll.js (Mongoose schema)
│   ├── controllers/  # pollController.js
│   ├── routes/        # poll.js
│   ├── socket/         # socket room handling
│   └── server.js
└── client/          # React + Vite frontend
    └── src/
        ├── pages/       # Home, CreatePoll, PollView
        ├── components/  # PollCard, ResultsChart, QRDisplay
        ├── context/      # SocketContext
        └── api.js
```

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env with your MongoDB Atlas connection string
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

App will run on `http://localhost:5173` (frontend) and `http://localhost:5000` (backend API).

### 3. MongoDB
Use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and paste the connection string into `server/.env` as `MONGO_URI`.

## How Voting Works
- Each vote is tied to a hash of `IP + poll slug`, stored in the poll's `voters[]` array — prevents the same visitor from voting twice without requiring login.
- On vote, the server emits a `pollUpdated` socket event to everyone in that poll's room, so all connected clients see results update instantly.

## Possible Extensions
- User auth + "my polls" dashboard
- Multiple-choice / ranked-choice voting
- Poll categories or public poll discovery page
- Export results as CSV/PDF
