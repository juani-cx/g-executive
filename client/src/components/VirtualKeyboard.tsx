import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface VirtualKeyboardProps {
  isVisible?: boolean;
  autoShow?: boolean;
  autoShowDelay?: number;
  bottom?: string;
  usePortal?: boolean;
}

export function VirtualKeyboard({ 
  isVisible: externalIsVisible, 
  autoShow = false, 
  autoShowDelay = 800,
  bottom = '2rem',
  usePortal = false 
}: VirtualKeyboardProps) {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  
  const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible;

  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setInternalIsVisible(true);
      }, autoShowDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, autoShowDelay]);

  const keyboardKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
    ['↑', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '⌫'],
    ['123?', '◀', '▶', '⎵', '-', '_', '🔍']
  ];

  // Calculate responsive keyboard width - 4K first design
  const keyboardWidth = 'clamp(600px, 25vw, 1400px)';
  
  const keyboardElement = (
    <div 
      className={`virtual-keyboard fixed left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out z-[10003] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`} 
      style={{ bottom }}
    >
      <div className="p-6" style={{ width: keyboardWidth }}>
        <div className="space-y-3">
          {keyboardKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3">
              {row.map((key, keyIndex) => (
                <div
                  key={keyIndex}
                  className={`
                    bg-white rounded-lg flex items-center justify-center text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200
                    ${key === '⎵' ? 'px-20 py-4' : key === '123?' || key === '🔍' ? 'px-6 py-4' : 'w-14 h-14'}
                    ${key === '↑' || key === '⌫' ? 'text-xl' : 'text-lg'}
                  `}
                  style={{
                    fontSize: 'clamp(14px, 1.2vw, 24px)',
                    width: key === '⎵' ? 'auto' : 'clamp(40px, 3.5vw, 70px)',
                    height: key === '⎵' || key === '123?' || key === '🔍' ? 'auto' : 'clamp(40px, 3.5vw, 70px)',
                    padding: key === '⎵' ? 'clamp(12px, 1vw, 20px) clamp(60px, 5vw, 120px)' : 
                            key === '123?' || key === '🔍' ? 'clamp(12px, 1vw, 20px) clamp(20px, 1.5vw, 35px)' : 
                            'clamp(12px, 1vw, 20px)'
                  }}
                  data-testid={`key-${key}`}
                >
                  {key}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (usePortal) {
    return createPortal(keyboardElement, document.body);
  }

  return keyboardElement;
}