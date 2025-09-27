import * as React from "react"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.ComponentProps<"input"> {
  className?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          fontSize: '26px',
          lineHeight: '2',
          fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: '400',
          height: '60px'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }