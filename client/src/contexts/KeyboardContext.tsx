import { createContext, useContext, useState, ReactNode } from 'react';

interface KeyboardContextType {
  keyboardEnabled: boolean;
  setKeyboardEnabled: (enabled: boolean) => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);

  return (
    <KeyboardContext.Provider value={{ keyboardEnabled, setKeyboardEnabled }}>
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
}