import * as React from "react"
import { cn } from "@/lib/utils"

interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  className?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className
        )}
        style={{
          fontSize: '26px',
          lineHeight: '2',
          fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: '400'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
FormTextarea.displayName = "FormTextarea"

export { FormTextarea }