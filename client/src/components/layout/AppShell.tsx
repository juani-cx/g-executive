import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AppShell({ children, header, footer, className = "", style = {} }: AppShellProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`} style={{ height: '100dvh', ...style }}>
      {header && (
        <header 
          className="shrink-0 relative z-50" 
          style={{ height: 'auto' }}
        >
          {header}
        </header>
      )}
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      
      {footer && (
        <footer 
          className="shrink-0" 
          style={{ height: 'auto' }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}