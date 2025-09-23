import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Loading() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to canvas after 3 seconds
    const timer = setTimeout(() => {
      navigate('/canvas');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-page" style={{
      fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      height: '100vh',
      width: '100%',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Dots */}
      <div className="dots-container" style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '48px'
      }}>
        <div className="dot dot-blue" style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#4285F4'
        }} />
        <div className="dot dot-red" style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#EA4335'
        }} />
        <div className="dot dot-yellow" style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#FBBC05'
        }} />
        <div className="dot dot-green" style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#34A853'
        }} />
      </div>

      {/* Loading Text */}
      <h1 style={{
        color: '#5f6368',
        textAlign: 'center',
        fontFamily: 'Google Sans',
        fontSize: '32px',
        fontWeight: '400',
        lineHeight: '40px',
        margin: 0,
        maxWidth: '600px'
      }}>
        Working on it... you'll see results shortly.
      </h1>

      {/* Decorative Shapes */}
      <div className="shapes-container" style={{
        position: 'absolute',
        bottom: '80px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        padding: '0 80px',
        pointerEvents: 'none'
      }}>
        {/* Green Triangle */}
        <div style={{
          width: '0',
          height: '0',
          borderLeft: '80px solid transparent',
          borderRight: '80px solid transparent',
          borderBottom: '120px solid #34A853',
          opacity: '0.8'
        }} />

        {/* Orange Circle */}
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          opacity: '0.8'
        }} />
      </div>
    </div>
  );
}