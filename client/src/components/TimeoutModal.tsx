import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface TimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStayHere: () => void;
  onGoHome: () => void;
}

export default function TimeoutModal({ isOpen, onClose, onStayHere, onGoHome }: TimeoutModalProps) {
  const [countdown, setCountdown] = useState(10);

  // Reset countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleStayHere = () => {
    onStayHere();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        style={{ zIndex: 99998 }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 w-full mx-4"
        style={{ zIndex: 99999, maxWidth: '1000px', padding: '64px' }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 
            style={{ fontFamily: 'Google Sans', fontSize: '48px', lineHeight: 1.2, fontWeight: 500, margin: '16px 0 16px', color: '#1f2937' }}
          >
            Are you still there?
          </h2>
          <p style={{ fontFamily: 'Google Sans', fontSize: '36px', color: '#6b7280', marginBottom: '8px' }}>
            We haven't seen any activity for a while.
          </p>
          <p style={{ fontFamily: 'Google Sans', fontSize: '32px', color: '#6b7280', marginBottom: '32px' }}>
            Would you like to continue working on your project?
          </p>
        </div>
        
        {/* Countdown */}
        <div className="bg-red-50 border border-red-200 rounded-xl text-center" style={{ padding: '48px', marginBottom: '48px' }}>
          <p style={{ fontFamily: 'Google Sans', fontSize: '28px', color: '#6b7280', marginBottom: '16px' }}>
            Auto-redirect in:
          </p>
          <div 
            style={{ fontFamily: 'Google Sans', fontSize: '96px', lineHeight: 1, fontWeight: 'bold', color: '#dc2626' }}
          >
            {countdown} seconds
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-8 justify-center mb-8">
          <Button
            onClick={handleStayHere}
            className="bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-full shadow-lg transition-all focus:outline-none focus:ring-0 focus-visible:ring-0"
            style={{ 
              fontFamily: 'Google Sans', 
              fontSize: '32px', 
              fontWeight: 400, 
              lineHeight: '2',
              height: 'auto',
              padding: '16px 68px'
            }}
            data-testid="button-stay-here"
          >
            Yes, I'm here!
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full transition-all focus:outline-none focus:ring-0 focus-visible:ring-0"
            style={{ 
              fontFamily: 'Google Sans', 
              fontSize: '32px', 
              fontWeight: 400, 
              lineHeight: '2',
              height: 'auto',
              padding: '16px 68px'
            }}
            data-testid="button-go-home"
          >
            Take me home
          </Button>
        </div>
        
        <p className="text-center" style={{ fontFamily: 'Google Sans', fontSize: '28px', color: '#9ca3af' }}>
          You will be automatically redirected to the homepage when the timer reaches zero.
        </p>
      </div>
    </>,
    document.body
  );
}