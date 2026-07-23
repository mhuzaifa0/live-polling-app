import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPollApi, votePollApi } from "../api";
import { useSocket } from "../context/SocketContext";
import PollCard from "../components/PollCard";
import ResultsChart from "../components/ResultsChart";
import QRDisplay from "../components/QRDisplay";

export default function PollView() {
  const { slug } = useParams();
  const socketRef = useSocket();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPollApi(slug).then(({ data }) => {
      setPoll(data.poll);
      setHasVoted(data.hasVoted);
    });

    const socket = socketRef?.current;
    if (socket) {
      socket.emit("joinPoll", slug);
      socket.on("pollUpdated", (updatedPoll) => {
        setPoll(updatedPoll);
      });
    }

    return () => {
      if (socket) {
        socket.emit("leavePoll", slug);
        socket.off("pollUpdated");
      }
    };
  }, [slug, socketRef]);

  const handleVote = async (optionIndex) => {
    try {
      await votePollApi(slug, optionIndex);
      setHasVoted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Vote failed");
    }
  };

  if (!poll) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;

  const shareUrl = `${window.location.origin}/poll/${slug}`;

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 py-10 px-4">
      <PollCard poll={poll} hasVoted={hasVoted} onVote={handleVote} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {(hasVoted || poll.isClosed) && (
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h3 className="font-medium mb-2 dark:text-white">Live Results</h3>
          <ResultsChart options={poll.options} />
        </div>
      )}

      <QRDisplay url={shareUrl} />
    </div>
  );
}
