import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AppShell({ children, header, footer, className = "" }: AppShellProps) {
  return (
    <div className={`min-h-screen flex flex-col w-full ${className}`} style={{ height: '100dvh' }}>
      {header && (
        <header 
          className="shrink-0 w-full" 
          style={{ height: 'var(--header-height)' }}
        >
          {header}
        </header>
      )}
      
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden w-full">
        {children}
      </main>
      
      {footer && (
        <footer 
          className="shrink-0 w-full" 
          style={{ height: 'var(--footer-height)' }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}