"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface CounterProps {
  count: number;
}

export function Counter({ count }: CounterProps) {
  const [isHovered, setIsHovered] = useState(false);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 1.5,
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.round(latest)
  );

  useEffect(() => {
    springValue.set(count);
  }, [count, springValue]);

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Glow effect behind the number */}
      <motion.div
        className="absolute inset-0 blur-3xl bg-rage-500/30 rounded-full"
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* The counter number */}
      <motion.div
        className="relative"
        animate={
          isHovered
            ? {
                x: [0, -3, 3, -3, 3, 0],
                transition: { duration: 0.4, repeat: 0 },
              }
            : {}
        }
      >
        <motion.span className="text-[7rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-rage-400 via-rage-500 to-rage-700 counter-glow leading-none">
          <motion.span>{displayValue}</motion.span>
        </motion.span>
      </motion.div>

      {/* Fire emoji decorations for high counts */}
      {count >= 5 && (
        <motion.div
          className="absolute -top-4 sm:-top-8 left-1/2 transform -translate-x-1/2 text-2xl sm:text-4xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {count >= 10 ? "🔥🔥🔥" : count >= 5 ? "🔥" : ""}
        </motion.div>
      )}
    </motion.div>
  );
}
