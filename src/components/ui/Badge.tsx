import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  
  const variants = {
    default: 'bg-sandstone-dark text-charcoal',
    success: 'bg-muted-green/20 text-muted-green',
    warning: 'bg-saffron/20 text-saffron',
    info: 'bg-earth-brown/20 text-earth-brown',
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
