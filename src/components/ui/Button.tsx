import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '', 
  ...props 
}: ButtonProps) {
  
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-saffron disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-saffron text-white hover:bg-saffron-light',
    secondary: 'bg-earth-brown text-white hover:bg-opacity-90',
    outline: 'border-2 border-saffron text-saffron hover:bg-saffron hover:text-white',
    ghost: 'bg-transparent text-charcoal-light hover:bg-sandstone-dark hover:text-charcoal'
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-3',
    lg: 'text-lg px-6 py-4'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
