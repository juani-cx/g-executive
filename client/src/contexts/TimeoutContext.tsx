import { createContext, useContext, useState, ReactNode } from 'react';
import { TimeoutSettings } from '@/hooks/useTimeout';

const TimeoutContext = createContext<TimeoutSettings | undefined>(undefined);

export function TimeoutProvider({ children }: { children: ReactNode }) {
  const [timeoutEnabled, setTimeoutEnabled] = useState(true);

  return (
    <TimeoutContext.Provider value={{ timeoutEnabled, setTimeoutEnabled }}>
      {children}
    </TimeoutContext.Provider>
  );
}

export function useTimeoutSettings() {
  const context = useContext(TimeoutContext);
  if (context === undefined) {
    // Return default values when context is not available (e.g., on landing pages)
    return { timeoutEnabled: false, setTimeoutEnabled: () => {} };
  }
  return context;
}