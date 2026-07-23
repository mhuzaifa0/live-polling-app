import { motion } from "framer-motion";

export default function PollCard({ poll, hasVoted, onVote }) {
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">{poll.question}</h2>

      <div className="flex flex-col gap-3">
        {poll.options.map((opt, i) => {
          const pct = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <button
              key={i}
              disabled={hasVoted || poll.isClosed}
              onClick={() => onVote(i)}
              className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 text-left px-4 py-3 disabled:cursor-not-allowed"
            >
              {(hasVoted || poll.isClosed) && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                  className="absolute left-0 top-0 h-full bg-primary/20"
                />
              )}
              <div className="relative flex justify-between">
                <span className="dark:text-white">{opt.text}</span>
                {(hasVoted || poll.isClosed) && (
                  <span className="text-sm text-gray-500">
                    {opt.votes} ({pct}%)
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
        {poll.isClosed && " · Poll closed"}
      </p>
    </div>
  );
}
