import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface InternalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  "data-testid"?: string;
}

export function InternalButton({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  "data-testid": testId 
}: InternalButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={`bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full focus:outline-none focus:ring-0 focus-visible:ring-0 ${className}`}
      style={{
        fontSize: '32px',
        lineHeight: '2',
        height: 'auto',
        padding: '0 34px'
      }}
    >
      {children}
    </Button>
  );
}