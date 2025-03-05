import React, { ButtonHTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white hover:bg-gray-800",
        outline: "border border-gray-200 hover:bg-gray-100 hover:text-gray-900",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "underline-offset-4 hover:underline text-gray-900",
        // Neon variants
        neonBlue:
          "bg-transparent border border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:shadow-neon-blue transition-all duration-300",
        neonPink:
          "bg-transparent border border-neon-pink text-neon-pink hover:bg-neon-pink/10 hover:shadow-neon-pink transition-all duration-300",
        neonGreen:
          "bg-transparent border border-neon-green text-neon-green hover:bg-neon-green/10 hover:shadow-neon-green transition-all duration-300",
        neonPurple:
          "bg-transparent border border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:shadow-neon-purple transition-all duration-300",
        // Solid neon variants
        solidNeonBlue: "bg-neon-blue text-white hover:shadow-neon-blue transition-all duration-300",
        solidNeonPink: "bg-neon-pink text-white hover:shadow-neon-pink transition-all duration-300",
        solidNeonGreen: "bg-neon-green text-black hover:shadow-neon-green transition-all duration-300",
        solidNeonPurple: "bg-neon-purple text-white hover:shadow-neon-purple transition-all duration-300",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
