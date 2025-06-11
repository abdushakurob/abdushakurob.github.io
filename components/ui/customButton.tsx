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
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lapis-600/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      primary: "bg-lapis-DEFAULT text-white hover:bg-lapis-600 dark:bg-lapis-700 dark:hover:bg-lapis-600",
      secondary: "bg-verdigris-DEFAULT text-white hover:bg-verdigris-600 dark:bg-verdigris-600 dark:hover:bg-verdigris-500",
      outline: "border border-lapis-200 bg-transparent text-lapis-DEFAULT hover:bg-lapis-DEFAULT/10 dark:border-tea-800 dark:text-tea-800 dark:hover:bg-tea-800/10",
      ghost: "text-lapis-DEFAULT hover:bg-lapis-DEFAULT/10 dark:text-tea-800 dark:hover:bg-tea-800/10",
      link: "text-verdigris-DEFAULT dark:text-verdigris-600 underline-offset-4 hover:underline"
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