"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SarcasticTaglineProps {
  count: number;
}

const getTaglines = (count: number): string[] => {
  if (count === 0) {
    return [
      "No misses yet. Bezos is watching.",
      "A clean slate... for now.",
      "The calm before the storm.",
    ];
  }

  if (count === 1) {
    return [
      "And so it begins...",
      "First blood. There will be more.",
      "One package. One betrayal.",
      "The first of many.",
    ];
  }

  if (count <= 3) {
    return [
      `${count} times. That's ${count} too many.`,
      `Bezos owes you ${count} apologies.`,
      `${count} strikes. How many until they're out?`,
      `${count} packages. ${count} disappointments.`,
    ];
  }

  if (count <= 5) {
    return [
      `${count} times. At this point it's personal.`,
      `Jeff Bezos has personally wronged you ${count} times.`,
      `Prime? More like crime.`,
      `${count} failures. But who's counting? Oh right, we are.`,
      `Somewhere, ${count} packages are crying.`,
    ];
  }

  if (count <= 10) {
    return [
      `${count} TIMES. This is a pattern, not a mistake.`,
      `${count} misses. Have you considered carrier pigeons?`,
      `At ${count} failures, you've earned a grudge.`,
      `${count}. That's not bad luck. That's a broken system.`,
      `They sent rockets to space but can't find your porch. ${count} times.`,
    ];
  }

  // High counts get increasingly unhinged
  return [
    `${count} TIMES. This is war.`,
    `${count} failures. Bezos trembles.`,
    `${count}?! At this point, ARE THEY EVEN TRYING?`,
    `${count} misses. You're not a customer, you're a target.`,
    `${count}. Somewhere, a logistics algorithm is laughing at you.`,
    `${count} times. Your package is in another dimension.`,
    `${count}. You should frame this number.`,
    `At ${count} misses, you've transcended customer. You're a legend.`,
  ];
};

export function SarcasticTagline({ count }: SarcasticTaglineProps) {
  const [currentTagline, setCurrentTagline] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);

  const taglines = getTaglines(count);

  useEffect(() => {
    // Set initial tagline
    setCurrentTagline(taglines[0]);

    // Rotate taglines every 5 seconds
    const interval = setInterval(() => {
      setTaglineIndex((prev) => {
        const next = (prev + 1) % taglines.length;
        setCurrentTagline(taglines[next]);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [count]); // Re-initialize when count changes

  return (
    <div className="h-16 md:h-20 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentTagline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-2xl text-rage-300/80 text-center font-medium italic px-4"
        >
          "{currentTagline}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
