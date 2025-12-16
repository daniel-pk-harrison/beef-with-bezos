'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme, useThemeAnimations } from '@/lib/theme/hooks';

interface CounterProps {
  count: number;
}

export function Counter({ count }: CounterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const animations = useThemeAnimations();

  const springValue = useSpring(0, {
    stiffness: animations.stiffness,
    damping: animations.damping,
    mass: animations.mass,
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.round(latest)
  );

  useEffect(() => {
    springValue.set(count);
  }, [count, springValue]);

  // Determine animation classes based on theme effects
  const getAnimationClasses = () => {
    const classes = [];
    if (theme.effects.counterShake) classes.push('animate-shake-infinite');
    if (animations.wobble && isHovered) classes.push('animate-wobble');
    if (animations.pulse) classes.push('animate-pulse-glow');
    return classes.join(' ');
  };

  // Get hover animation based on theme
  const getHoverAnimation = () => {
    return {
      scale: animations.hoverScale,
      rotate: animations.wobble ? [0, -2, 2, -2, 0] : 0,
      y: animations.bounce ? -10 : 0,
    };
  };

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${getAnimationClasses()}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={isHovered ? getHoverAnimation() : { scale: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: animations.stiffness,
        damping: animations.damping,
      }}
    >
      {/* Glow effect behind the number */}
      {theme.effects.counterGlow && (
        <motion.div
          className="absolute inset-0 blur-3xl rounded-full"
          style={{
            backgroundColor: theme.colors.glow,
            opacity: theme.effects.counterGlowIntensity * 0.6,
          }}
          animate={{
            scale: isHovered ? 1.3 : 1,
            opacity: isHovered
              ? theme.effects.counterGlowIntensity * 0.9
              : theme.effects.counterGlowIntensity * 0.4,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* The counter number */}
      <motion.div
        className="relative"
        animate={
          isHovered && animations.shake
            ? {
                x: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.4, repeat: 0 },
              }
            : {}
        }
      >
        <motion.span
          className="text-[7rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-black text-transparent bg-clip-text counter-glow leading-none"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${theme.colors.primary[400]}, ${theme.colors.primary[500]}, ${theme.colors.primary[700]})`,
          }}
        >
          <motion.span>{displayValue}</motion.span>
        </motion.span>
      </motion.div>

      {/* Decorations based on count and theme */}
      {count >= 5 && (
        <motion.div
          className="absolute -top-4 sm:-top-8 left-1/2 transform -translate-x-1/2 text-2xl sm:text-4xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: animations.wobble ? [0, -5, 5, -5, 0] : 0,
          }}
          transition={{
            delay: 0.5,
            rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {getDecorationEmoji(count, theme.id)}
        </motion.div>
      )}
    </motion.div>
  );
}

// Get theme-appropriate decoration emoji
function getDecorationEmoji(count: number, themeId: string): string {
  // Theme-specific decorations
  const themeDecorations: Record<string, Record<string, string>> = {
    ocean: { few: '🌊', many: '🌊🌊🌊' },
    forest: { few: '🌲', many: '🌲🌲🌲' },
    sunset: { few: '🌅', many: '🌅✨🌅' },
    disco: { few: '🕺', many: '🕺💃🕺' },
    rainbow: { few: '🌈', many: '🌈✨🌈' },
    acid: { few: '🍄', many: '🍄🌀🍄' },
    neon: { few: '💥', many: '💥⚡💥' },
    chaos: { few: '🎪', many: '🎪🤡🎪' },
    spiral: { few: '🌀', many: '🌀👁️🌀' },
    glitch: { few: '📺', many: '📺💀📺' },
    matrix: { few: '💚', many: '💚👁️💚' },
    comic: { few: '💥', many: '💥POW💥' },
    vaporwave: { few: '🗿', many: '🗿🌴🗿' },
    xp: { few: '🪟', many: '🪟💀🪟' },
    fire: { few: '🔥', many: '🔥👹🔥' },
    antigravity: { few: '🚀', many: '🚀🌌🚀' },
  };

  const decoration = themeDecorations[themeId];
  if (decoration) {
    return count >= 10 ? decoration.many : decoration.few;
  }

  // Default (rage theme)
  return count >= 10 ? '🔥🔥🔥' : '🔥';
}
