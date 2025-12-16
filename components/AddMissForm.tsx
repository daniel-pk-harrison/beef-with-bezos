"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { addMissAction } from "@/lib/actions";

interface AddMissFormProps {
  onAdd: () => Promise<void>;
}

export function AddMissForm({ onAdd }: AddMissFormProps) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await addMissAction(date, note);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      await onAdd();
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-sm border border-rage-900/30 rounded-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-white mb-4">
        Report a Missed Delivery
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-white/70 mb-1"
          >
            When did it happen?
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isPending}
            className="w-full bg-black/30 border border-rage-900/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-rage-500 focus:ring-1 focus:ring-rage-500 transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-white/70 mb-1"
          >
            What happened? (optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='e.g., "Marked delivered but never arrived" or "Left in the rain AGAIN"'
            rows={3}
            disabled={isPending}
            className="w-full bg-black/30 border border-rage-900/50 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-rage-500 focus:ring-1 focus:ring-rage-500 transition-colors resize-none disabled:opacity-50"
          />
        </div>
      </div>

      {error && <p className="text-rage-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-rage-600 to-rage-700 hover:from-rage-500 hover:to-rage-600 disabled:from-rage-800 disabled:to-rage-900 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPending ? "Adding..." : "Add to the Count"}
      </button>
    </motion.form>
  );
}
