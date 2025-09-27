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

  // Calculate responsive keyboard width - 4K first design with larger scale
  const keyboardWidth = 'clamp(800px, 35vw, 1800px)';
  
  const keyboardElement = (
    <div 
      className={`virtual-keyboard fixed left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out z-[10003] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`} 
      style={{ bottom }}
    >
      <div className="p-8" style={{ width: keyboardWidth }}>
        <div className="space-y-4">
          {keyboardKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-4">
              {row.map((key, keyIndex) => (
                <div
                  key={keyIndex}
                  className={`
                    bg-white rounded-lg flex items-center justify-center text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200
                    ${key === '⎵' ? 'px-20 py-4' : key === '123?' || key === '🔍' ? 'px-6 py-4' : 'w-14 h-14'}
                    ${key === '↑' || key === '⌫' ? 'text-xl' : 'text-lg'}
                  `}
                  style={{
                    fontSize: 'clamp(18px, 1.8vw, 32px)',
                    width: key === '⎵' ? 'auto' : 'clamp(60px, 5vw, 100px)',
                    height: key === '⎵' || key === '123?' || key === '🔍' ? 'auto' : 'clamp(60px, 5vw, 100px)',
                    padding: key === '⎵' ? 'clamp(16px, 1.5vw, 28px) clamp(80px, 8vw, 160px)' : 
                            key === '123?' || key === '🔍' ? 'clamp(16px, 1.5vw, 28px) clamp(30px, 2.5vw, 50px)' : 
                            'clamp(16px, 1.5vw, 28px)'
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