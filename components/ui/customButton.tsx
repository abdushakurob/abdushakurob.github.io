import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md',
    icon, 
    iconPosition = 'right',
    className,
    children, 
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none btn-hover-effect";
    
    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
      outline: "border border-input bg-background hover:bg-accent hover:border-accent",
      ghost: "hover:bg-accent/10 text-foreground",
      link: "text-blue-500 dark:text-blue-400 underline-offset-4 hover:underline"
    };
    
    const sizeStyles = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-5 text-base",
      lg: "h-12 px-8 text-lg"
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton };