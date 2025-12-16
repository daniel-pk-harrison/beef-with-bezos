"use client";

import { motion } from "framer-motion";
import { Counter } from "./Counter";
import { SarcasticTagline } from "./SarcasticTagline";
import { MissCard } from "./MissCard";
import type { MissedDelivery } from "@/types";

interface HomeContentProps {
  initialMisses: MissedDelivery[];
}

export function HomeContent({ initialMisses }: HomeContentProps) {
  const count = initialMisses.length;
  const recentMisses = initialMisses.slice(0, 5);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-rage-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-rage-800/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4 relative z-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
          Amazon Missed Deliveries
        </h1>
        <p className="text-white/50 text-sm mt-1">
          A public record of disappointment
        </p>
      </motion.div>

      {/* Main Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 my-8"
      >
        <Counter count={count} />
      </motion.div>

      {/* Times label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-white/70 -mt-4 mb-4 relative z-10"
      >
        {count === 1 ? "time" : "times"}
      </motion.p>

      {/* Sarcastic tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 mb-12"
      >
        <SarcasticTagline count={count} />
      </motion.div>

      {/* Recent misses timeline */}
      {recentMisses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-lg relative z-10"
        >
          <h2 className="text-lg font-semibold text-white/70 mb-4 text-center">
            Recent Incidents
          </h2>
          <div className="space-y-3">
            {recentMisses.map((miss, index) => (
              <MissCard key={miss.id} miss={miss} index={index} />
            ))}
          </div>
          {count > 5 && (
            <p className="text-center text-white/40 text-sm mt-4">
              ...and {count - 5} more
            </p>
          )}
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-4 text-center text-white/30 text-xs"
      >
        Tracking the chaos, one missed delivery at a time.
      </motion.footer>
    </main>
  );
}
