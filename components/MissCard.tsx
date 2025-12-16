"use client";

import { motion } from "framer-motion";
import type { MissedDelivery } from "@/types";

interface MissCardProps {
  miss: MissedDelivery;
  index: number;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function MissCard({ miss, index, onDelete, showDelete }: MissCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white/5 backdrop-blur-sm border border-rage-900/30 rounded-lg p-4 hover:bg-white/10 hover:border-rage-700/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-rage-400 font-mono text-sm">
              #{index + 1}
            </span>
            <span className="text-white/60 text-sm">{formatDate(miss.date)}</span>
            <span className="text-white/40 text-xs">
              ({getRelativeTime(miss.date)})
            </span>
          </div>
          {miss.note && (
            <p className="text-white/80 text-sm truncate">{miss.note}</p>
          )}
          {!miss.note && (
            <p className="text-white/40 text-sm italic">No details provided</p>
          )}
        </div>

        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(miss.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-rage-400 hover:text-rage-300 text-sm px-2 py-1 rounded hover:bg-rage-900/30"
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
