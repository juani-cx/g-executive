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
    console.log('🕒 [Timeout Debug] resetTimeout called, timeoutEnabled:', timeoutSettings.timeoutEnabled);
    
    if (timeoutRef.current) {
      console.log('🕒 [Timeout Debug] Clearing existing timeout');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (modalTimeoutRef.current) {
      console.log('🕒 [Timeout Debug] Clearing existing modal timeout');
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    
    setShowTimeoutModal(false);
    
    if (timeoutSettings.timeoutEnabled) {
      console.log('🕒 [Timeout Debug] Starting new 8-second timeout');
      timeoutRef.current = setTimeout(() => {
        console.log('🕒 [Timeout Debug] 8 seconds elapsed - showing modal');
        setShowTimeoutModal(true);
        // Auto redirect to home after additional 10 seconds if no response
        modalTimeoutRef.current = setTimeout(() => {
          console.log('🕒 [Timeout Debug] 10 seconds elapsed in modal - redirecting');
          // Clear modal state before redirecting
          setShowTimeoutModal(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          onTimeout();
        }, 10000);
      }, 8000); // 8 seconds
    } else {
      console.log('🕒 [Timeout Debug] Timeout disabled - not starting timer');
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
    console.log('🕒 [Timeout Debug] Activity detected - timeoutEnabled:', timeoutSettings.timeoutEnabled, 'showTimeoutModal:', showTimeoutModal);
    if (timeoutSettings.timeoutEnabled && !showTimeoutModal) {
      console.log('🕒 [Timeout Debug] Resetting timeout due to activity');
      resetTimeout();
    }
  }, [timeoutSettings.timeoutEnabled, showTimeoutModal, resetTimeout]);

  // Set up activity listeners
  useEffect(() => {
    console.log('🕒 [Timeout Debug] Setting up activity listeners, timeoutEnabled:', timeoutSettings.timeoutEnabled);
    
    if (!timeoutSettings.timeoutEnabled) {
      console.log('🕒 [Timeout Debug] Timeout disabled - not adding listeners');
      return;
    }
    
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    
    console.log('🕒 [Timeout Debug] Adding event listeners for:', events);
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
    
    return () => {
      console.log('🕒 [Timeout Debug] Removing event listeners');
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity, timeoutSettings.timeoutEnabled]);

  // Initialize timeout when enabled
  useEffect(() => {
    console.log('🕒 [Timeout Debug] Initialize timeout effect - timeoutEnabled:', timeoutSettings.timeoutEnabled);
    
    if (timeoutSettings.timeoutEnabled) {
      console.log('🕒 [Timeout Debug] Initializing timeout on mount/enable');
      resetTimeout();
    }
    
    return () => {
      console.log('🕒 [Timeout Debug] Cleanup timeouts on unmount/disable');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
        modalTimeoutRef.current = null;
      }
    };
  }, [timeoutSettings.timeoutEnabled, resetTimeout]);

  return {
    showTimeoutModal,
    handleStayHere,
    handleGoHome,
    handleModalClose,
    setShowTimeoutModal
  };
}