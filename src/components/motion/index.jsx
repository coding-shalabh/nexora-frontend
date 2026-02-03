'use client';

import { motion, AnimatePresence } from 'framer-motion';

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Scale animations
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const popIn = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.5 },
};

// Stagger container
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
};

// Page transition wrapper
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Animated card with hover effects
export function AnimatedCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated button with press effect
export function AnimatedButton({ children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Animated list item
export function AnimatedListItem({ children, index = 0, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Number counter animation
export function AnimatedNumber({ value, className = '' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

// Pulse dot animation
export function PulseDot({ color = 'bg-green-500', size = 'w-2 h-2' }) {
  return (
    <span className="relative flex">
      <motion.span
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
      />
      <span className={`relative inline-flex rounded-full ${size} ${color}`} />
    </span>
  );
}

// Shimmer loading effect
export function Shimmer({ className = 'h-4 w-full' }) {
  return (
    <motion.div
      className={`rounded bg-muted ${className}`}
      animate={{ 
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        background: 'linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
}

// Progress bar with animation
export function AnimatedProgress({ value, className = '' }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full gradient-primary"
      />
    </div>
  );
}

// Floating animation wrapper
export function FloatingElement({ children, className = '' }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Reveal on scroll
export function RevealOnScroll({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Export AnimatePresence for use in layouts
export { motion, AnimatePresence };
