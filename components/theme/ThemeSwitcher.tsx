'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme/hooks';
import { Theme } from '@/lib/theme/types';

// Theme preview card component
function ThemePreviewCard({
  theme,
  isActive,
  onSelect,
}: {
  theme: Theme;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border-2 text-left transition-all
        ${
          isActive
            ? 'border-white ring-2 ring-white/30'
            : 'border-white/10 hover:border-white/30'
        }
      `}
      style={{
        background: theme.colors.background,
        color: theme.colors.foreground,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Color swatches */}
      <div className="flex gap-1 mb-3">
        {[
          theme.colors.primary[500],
          theme.colors.primary[400],
          theme.colors.primary[600],
          theme.colors.accent,
        ].map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border border-white/20"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Theme name */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{theme.emoji}</span>
        <span className="font-semibold" style={{ color: theme.colors.foreground }}>
          {theme.name}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-xs mt-1 opacity-70"
        style={{ color: theme.colors.textSecondary }}
      >
        {theme.description}
      </p>

      {/* Warning label */}
      {theme.warningLabel && (
        <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">
          {theme.warningLabel}
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
      )}
    </motion.button>
  );
}

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'unhinged'>('standard');
  const { theme, themeId, setTheme, availableThemes, isHydrated } = useTheme();

  const standardThemes = availableThemes.filter((t) => t.category === 'standard');
  const unhingedThemes = availableThemes.filter((t) => t.category === 'unhinged');

  const displayedThemes = activeTab === 'standard' ? standardThemes : unhingedThemes;

  if (!isHydrated) return null;

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[700]})`,
          boxShadow: `0 4px 20px ${theme.colors.glow}`,
        }}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        🎨
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal content */}
            <motion.div
              className="fixed inset-4 md:inset-10 z-50 overflow-hidden rounded-2xl flex flex-col"
              style={{
                background: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: theme.colors.border }}
              >
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: theme.colors.foreground }}
                  >
                    Choose Your Vibe
                  </h2>
                  <p style={{ color: theme.colors.textSecondary }}>
                    Pick a theme. Some are normal. Some are... not.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-2xl hover:bg-white/10 transition-colors"
                  style={{ color: theme.colors.foreground }}
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div
                className="flex gap-2 p-4 border-b"
                style={{ borderColor: theme.colors.border }}
              >
                <button
                  onClick={() => setActiveTab('standard')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'standard'
                      ? 'text-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background:
                      activeTab === 'standard' ? theme.colors.primary[600] : 'transparent',
                    color: theme.colors.foreground,
                  }}
                >
                  Standard 🎯
                </button>
                <button
                  onClick={() => setActiveTab('unhinged')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'unhinged'
                      ? 'text-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background:
                      activeTab === 'unhinged'
                        ? `linear-gradient(135deg, #ff00ff, #00ffff)`
                        : 'transparent',
                    color: theme.colors.foreground,
                  }}
                >
                  UNHINGED 🤪
                </button>
              </div>

              {/* Theme grid */}
              <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedThemes.map((t) => (
                    <ThemePreviewCard
                      key={t.id}
                      theme={t}
                      isActive={t.id === themeId}
                      onSelect={() => {
                        setTheme(t.id);
                        // Brief delay before closing to show the change
                        setTimeout(() => setIsOpen(false), 300);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                className="p-4 border-t flex items-center justify-between"
                style={{ borderColor: theme.colors.border }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: theme.colors.textSecondary }}>
                    Current:
                  </span>
                  <span className="font-medium" style={{ color: theme.colors.foreground }}>
                    {theme.emoji} {theme.name}
                  </span>
                </div>
                {theme.category === 'unhinged' && (
                  <div className="text-sm px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 animate-pulse">
                    Chaos Mode Active
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
