import React, { InputHTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-200 focus-visible:ring-gray-950",
        neonBlue:
          "border-neon-blue bg-white/5 focus-visible:ring-neon-blue focus:border-neon-blue focus:shadow-neon-blue",
        neonPink:
          "border-neon-pink bg-white/5 focus-visible:ring-neon-pink focus:border-neon-pink focus:shadow-neon-pink",
        neonGreen:
          "border-neon-green bg-white/5 focus-visible:ring-neon-green focus:border-neon-green focus:shadow-neon-green",
        neonPurple:
          "border-neon-purple bg-white/5 focus-visible:ring-neon-purple focus:border-neon-purple focus:shadow-neon-purple",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
      <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} {...props} />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
})

Input.displayName = "Input"

export { Input, inputVariants }
