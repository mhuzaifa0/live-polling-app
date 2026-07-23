import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-3xl font-bold dark:text-white">⚡ Live Polling App</h1>
      <p className="text-gray-500 text-center max-w-md">
        Create a poll, share the link or QR code, and watch votes come in live.
      </p>
      <Link
        to="/create"
        className="bg-primary text-white px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
      >
        Create a Poll
      </Link>
    </div>
  );
}
