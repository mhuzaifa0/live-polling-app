import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPollApi } from "../api";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresInMinutes, setExpiresInMinutes] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateOption = (i, value) => {
    const updated = [...options];
    updated[i] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i) => setOptions(options.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || cleanOptions.length < 2) {
      setError("Question aur kam se kam 2 options chahiye.");
      return;
    }

    try {
      const { data } = await createPollApi({
        question: question.trim(),
        options: cleanOptions,
        expiresInMinutes: expiresInMinutes ? Number(expiresInMinutes) : null,
      });
      navigate(`/poll/${data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 w-full max-w-lg flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold dark:text-white">Create a Poll</h2>

        <input
          type="text"
          placeholder="Your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
        />

        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="text-red-500 px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="text-sm text-primary self-start"
        >
          + Add option
        </button>

        <input
          type="number"
          placeholder="Expires in minutes (optional)"
          value={expiresInMinutes}
          onChange={(e) => setExpiresInMinutes(e.target.value)}
          className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-primary text-white rounded-lg py-2 hover:opacity-90 transition"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
}
