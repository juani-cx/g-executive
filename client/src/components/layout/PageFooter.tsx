import { ReactNode } from "react";

interface PageFooterProps {
  children: ReactNode;
  className?: string;
  background?: string;
}

export function PageFooter({ 
  children, 
  className = "", 
  background = "transparent" 
}: PageFooterProps) {
  return (
    <div 
      className={`w-full flex items-center justify-center px-[var(--space-xl)] ${className}`}
      style={{ 
        height: '100%',
        backgroundColor: background,
        fontSize: '64px',
        paddingBottom: 'var(--space-2xl)'
      }}
    >
      {children}
    </div>
  );
}