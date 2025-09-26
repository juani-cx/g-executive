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
      className={`w-full flex items-center justify-between px-[var(--space-lg)] relative z-50 ${className}`}
      style={{ 
        height: 'auto',
        backgroundColor: background,
        padding: `calc(var(--space-md) * 2) var(--space-xl) calc(var(--space-md) * 2)`,
        position: 'relative',
        zIndex: 50
      }}
    >
      {children}
    </div>
  );
}