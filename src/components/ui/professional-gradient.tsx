import React from 'react';
import { cn } from '@/lib/utils';

interface ProfessionalGradientProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'accent';
}

export function ProfessionalGradient({ 
  children, 
  className, 
  variant = 'default' 
}: ProfessionalGradientProps) {
  const gradients = {
    default: 'bg-gradient-to-br from-background via-background to-card',
    subtle: 'bg-gradient-to-br from-background via-secondary/50 to-background',
    accent: 'bg-gradient-to-br from-background via-primary/10 to-background',
  };

  return (
    <div className={cn(
      'relative overflow-hidden',
      gradients[variant],
      className
    )}>
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Professional card component with enhanced styling
export function ProfessionalCard({ 
  children, 
  className,
  hover = true 
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm',
      hover && 'transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10',
      className
    )}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}

// Professional button with enhanced styling
export function ProfessionalButton({ 
  children, 
  className,
  variant = 'default',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
}) {
  const variants = {
    default: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25',
    outline: 'border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50',
    ghost: 'text-primary hover:bg-primary/10',
  };

  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-lg px-4 py-2 font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background',
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10" />
      
      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
} 