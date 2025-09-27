import { ReactNode } from "react";

interface PageBodyProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  centerContent?: boolean;
  background?: string;
  style?: React.CSSProperties;
}

export function PageBody({ 
  children, 
  className = "", 
  padding = true,
  centerContent = false,
  background = "transparent",
  style = {}
}: PageBodyProps) {
  const paddingClass = padding ? `px-[var(--space-xl)]` : "";
  const centerClass = centerContent ? "flex items-start justify-center" : "";
  
  return (
    <div 
      className={`flex-1 ${paddingClass} ${centerClass} ${className}`}
      style={{ 
        backgroundColor: 'transparent', 
        paddingTop: 0, 
        paddingBottom: 0,
        ...(centerContent ? {} : { justifyContent: 'flex-start' }),
        ...style 
      }}
    >
      {children}
    </div>
  );
}