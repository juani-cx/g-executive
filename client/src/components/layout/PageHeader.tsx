import { ReactNode } from "react";

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
  background?: string;
}

export function PageHeader({ 
  children, 
  className = "", 
  background = "transparent" 
}: PageHeaderProps) {
  return (
    <div 
      className={`w-full flex items-center justify-between px-[var(--space-lg)] ${className}`}
      style={{ 
        height: '100%',
        backgroundColor: background,
        padding: `calc(var(--space-md) * 2) var(--space-xl) 0`
      }}
    >
      {children}
    </div>
  );
}