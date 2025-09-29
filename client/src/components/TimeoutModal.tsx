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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-lg w-full mx-4"
        style={{ zIndex: 99999 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-medium text-gray-900 mb-2"
            style={{ fontFamily: 'Google Sans', fontSize: '28px', lineHeight: 1.2, fontWeight: 500 }}
          >
            Are you still there?
          </h2>
          <p className="text-gray-600 mb-1" style={{ fontFamily: 'Google Sans', fontSize: '18px' }}>
            We haven't seen any activity for a while.
          </p>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'Google Sans', fontSize: '16px' }}>
            Would you like to continue working on your project?
          </p>
        </div>
        
        {/* Countdown */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Google Sans' }}>
            Auto-redirect in:
          </p>
          <div 
            className="text-5xl font-bold text-red-600"
            style={{ fontFamily: 'Google Sans', fontSize: '48px', lineHeight: 1 }}
          >
            {countdown} seconds
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-4">
          <Button
            onClick={handleStayHere}
            className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg transition-all"
            style={{ fontFamily: 'Google Sans', fontSize: '16px', fontWeight: 400 }}
            data-testid="button-stay-here"
          >
            Yes, I'm here!
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full text-lg font-medium transition-all"
            style={{ fontFamily: 'Google Sans', fontSize: '16px', fontWeight: 400 }}
            data-testid="button-go-home"
          >
            Take me home
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 text-center" style={{ fontFamily: 'Google Sans', fontSize: '14px' }}>
          You will be automatically redirected to the homepage when the timer reaches zero.
        </p>
      </div>
    </>,
    document.body
  );
}