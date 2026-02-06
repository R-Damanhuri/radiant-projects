'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

// Primary Button
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', loading, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
      outline: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        {...props as any}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {icon} {label}
          </label>
        )}
        <motion.input
          ref={ref}
          whileFocus={{ scale: 1.01 }}
          className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${className}`}
          {...props as any}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

// Card Component
interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = ({ children, hover = false, className = '', ...props }: CardProps) => {
  const Component = motion.div as any;
  
  return (
    <Component
      className={`p-6 bg-gray-800/50 rounded-xl border border-gray-700 ${hover ? 'hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10' : ''} ${className}`}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </Component>
  );
};

// Skeleton Component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <motion.div
      className={`bg-gray-700 ${variants[variant]} ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

// Feature Card
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card hover className="text-center">
      <motion.div
        className="text-4xl mb-4"
        whileHover={{ scale: 1.2, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </Card>
  );
}

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ children, variant = 'info' }: BadgeProps) {
  const variants = {
    success: 'bg-green-900/50 text-green-300',
    warning: 'bg-yellow-900/50 text-yellow-300',
    error: 'bg-red-900/50 text-red-300',
    info: 'bg-purple-900/50 text-purple-300'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${variants[variant]}`}>
      {children}
    </span>
  );
}
