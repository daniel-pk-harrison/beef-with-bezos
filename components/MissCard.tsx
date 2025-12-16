'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme/hooks';
import type { MissedDelivery } from '@/types';

interface MissCardProps {
  miss: MissedDelivery;
  index: number;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
  disabled?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function MissCard({
  miss,
  index,
  onDelete,
  showDelete,
  disabled,
}: MissCardProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={
        theme.effects.card3D
          ? {
              rotateY: 5,
              rotateX: -2,
              scale: 1.02,
              z: 20,
            }
          : { scale: 1.01 }
      }
      className="group relative backdrop-blur-sm rounded-lg p-3 sm:p-4 transition-all duration-300"
      style={{
        backgroundColor: theme.colors.surface,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme.colors.border,
        transformStyle: theme.effects.card3D ? 'preserve-3d' : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <span
              className="font-mono text-sm"
              style={{ color: theme.colors.primary[400] }}
            >
              #{index + 1}
            </span>
            <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
              {formatDate(miss.date)}
            </span>
            <span
              className="text-xs hidden sm:inline"
              style={{ color: theme.colors.textMuted }}
            >
              ({getRelativeTime(miss.date)})
            </span>
          </div>
          {miss.note && (
            <p
              className="text-sm truncate"
              style={{ color: theme.colors.textPrimary }}
            >
              {miss.note}
            </p>
          )}
          {!miss.note && (
            <p className="text-sm italic" style={{ color: theme.colors.textMuted }}>
              No details provided
            </p>
          )}
        </div>

        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(miss.id)}
            disabled={disabled}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: theme.colors.primary[400],
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.primary[900]}4d`;
              e.currentTarget.style.color = theme.colors.primary[300];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.primary[400];
            }}
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
