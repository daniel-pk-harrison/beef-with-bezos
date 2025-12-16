'use client';

import { motion } from 'framer-motion';
import { Counter } from './Counter';
import { SarcasticTagline } from './SarcasticTagline';
import { MissCard } from './MissCard';
import { ThemeSwitcher } from './theme/ThemeSwitcher';
import { CanvasEffects } from './theme/CanvasEffects';
import { useTheme, useThemeSpring } from '@/lib/theme/hooks';
import type { MissedDelivery } from '@/types';

interface HomeContentProps {
  initialMisses: MissedDelivery[];
}

export function HomeContent({ initialMisses }: HomeContentProps) {
  const count = initialMisses.length;
  const recentMisses = initialMisses.slice(0, 5);
  const { theme } = useTheme();
  const spring = useThemeSpring();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.colors.primary[900]}33` }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.colors.primary[800]}1a` }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ...spring }}
        className="text-center mb-4 relative z-10"
      >
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{ color: theme.colors.textPrimary }}
        >
          Amazon Missed Deliveries
        </h1>
        <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
          A public record of disappointment
        </p>
      </motion.div>

      {/* Main Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ...spring }}
        className="relative z-10 my-4 sm:my-8"
      >
        <Counter count={count} />
      </motion.div>

      {/* Times label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold -mt-2 sm:-mt-4 mb-4 relative z-10"
        style={{ color: theme.colors.textSecondary }}
      >
        {count === 1 ? 'time' : 'times'}
      </motion.p>

      {/* Sarcastic tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mb-8 sm:mb-12"
      >
        <SarcasticTagline count={count} />
      </motion.div>

      {/* Recent misses timeline */}
      {recentMisses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-lg relative z-10 px-1"
        >
          <h2
            className="text-lg font-semibold mb-4 text-center"
            style={{ color: theme.colors.textSecondary }}
          >
            Recent Incidents
          </h2>
          <div className="space-y-3">
            {recentMisses.map((miss, index) => (
              <MissCard key={miss.id} miss={miss} index={index} />
            ))}
          </div>
          {count > 5 && (
            <p
              className="text-center text-sm mt-4"
              style={{ color: theme.colors.textMuted }}
            >
              ...and {count - 5} more
            </p>
          )}
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 sm:mt-0 sm:absolute sm:bottom-4 text-center text-xs pb-4 sm:pb-0"
        style={{ color: theme.colors.textMuted }}
      >
        <p>Tracking the chaos, one missed delivery at a time.</p>
        <p className="mt-1" style={{ color: `${theme.colors.textMuted}88` }}>
          v{process.env.NEXT_PUBLIC_VERSION} ({process.env.NEXT_PUBLIC_COMMIT_SHA})
        </p>
      </motion.footer>

      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Canvas effects for special themes */}
      <CanvasEffects />
    </main>
  );
}
