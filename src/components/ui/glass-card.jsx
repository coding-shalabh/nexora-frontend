'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  delay = 0,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={hover ? { 
        y: -4,
        transition: { duration: 0.2 }
      } : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5',
        glow && 'shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GradientCard({ 
  children, 
  className = '',
  variant = 'primary',
  ...props 
}) {
  const variants = {
    primary: 'from-primary/10 to-brand-600/10',
    success: 'from-green-500/10 to-emerald-500/10',
    warning: 'from-orange-500/10 to-amber-500/10',
    danger: 'from-red-500/10 to-rose-500/10',
    info: 'from-blue-500/10 to-cyan-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/20 p-6 shadow-soft',
        `bg-gradient-to-br ${variants[variant]}`,
        'backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function BentoCard({ 
  children, 
  className = '',
  span = 1,
  ...props 
}) {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-3',
    'row': 'row-span-2',
    'full': 'col-span-full',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-soft transition-colors hover:border-primary/20',
        spanClasses[span],
        className
      )}
      {...props}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  className = '',
  delay = 0,
}) {
  const changeColors = {
    positive: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    negative: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    neutral: 'text-muted-foreground bg-muted',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-soft transition-all hover:shadow-soft-lg',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
            className="mt-2 text-3xl font-bold tracking-tight"
          >
            {value}
          </motion.p>
          {change && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={cn(
                'mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                changeColors[changeType]
              )}
            >
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </motion.div>
          )}
        </div>
        {Icon && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.1, type: 'spring' }}
            className="rounded-xl bg-primary/10 p-3 text-primary"
          >
            <Icon className="h-6 w-6" />
          </motion.div>
        )}
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
