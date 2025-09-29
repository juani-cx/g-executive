import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimeoutSettings {
  timeoutEnabled: boolean;
  setTimeoutEnabled: (enabled: boolean) => void;
}

export function useTimeout(timeoutSettings: TimeoutSettings, onTimeout: () => void) {
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    
    setShowTimeoutModal(false);
    
    if (timeoutSettings.timeoutEnabled) {
      timeoutRef.current = setTimeout(() => {
        setShowTimeoutModal(true);
        // Auto redirect to home after additional 10 seconds if no response
        modalTimeoutRef.current = setTimeout(() => {
          // Clear modal state before redirecting
          setShowTimeoutModal(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          onTimeout();
        }, 10000);
      }, 8000); // 8 seconds
    }
  }, [timeoutSettings.timeoutEnabled, onTimeout]);

  const handleStayHere = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  const handleGoHome = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    setShowTimeoutModal(false);
    onTimeout();
  }, [onTimeout]);

  const handleModalClose = useCallback(() => {
    // Treat modal close as explicit "stay" action - clear auto-redirect timer
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    setShowTimeoutModal(false);
    // Reset the inactivity timer
    resetTimeout();
  }, [resetTimeout]);

  // Activity event handlers
  const handleActivity = useCallback(() => {
    if (timeoutSettings.timeoutEnabled && !showTimeoutModal) {
      resetTimeout();
    }
  }, [timeoutSettings.timeoutEnabled, showTimeoutModal, resetTimeout]);

  // Set up activity listeners
  useEffect(() => {
    if (!timeoutSettings.timeoutEnabled) return;
    
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity, timeoutSettings.timeoutEnabled]);

  // Initialize timeout when enabled
  useEffect(() => {
    if (timeoutSettings.timeoutEnabled) {
      resetTimeout();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
        modalTimeoutRef.current = null;
      }
    };
  }, [timeoutSettings.timeoutEnabled]); // Removed resetTimeout dependency to prevent infinite loop

  return {
    showTimeoutModal,
    handleStayHere,
    handleGoHome,
    handleModalClose,
    setShowTimeoutModal
  };
}