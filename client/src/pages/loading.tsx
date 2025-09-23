import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Loading() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to canvas after 6 seconds to show full animation
    const timer = setTimeout(() => {
      navigate('/canvas');
    }, 6000);

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
      {/* Google Logo Animation */}
      <div className="google-logo-container" style={{
        marginBottom: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="200" 
          height="145"
          viewBox="200 150 242 145"
          className="google-logo-svg"
        >
          <defs>
            <clipPath id="cut-off-gline">
              <rect x="287.2" y="225.9" width="102.2" height="28.9"/>
            </clipPath>
          </defs>
          
          {/* Arc segments that form the Google logo */}
          <g id="circles">
            {/* Blue arc - top right quadrant */}
            <path id="blueG" className="circle" fill="none" stroke="#4285F4" strokeWidth="28" 
                  d="M 318 182.9 A 57 57 0 0 1 375.9 240.4"/>
            {/* Red arc - bottom left quadrant */}
            <path id="redG" className="circle" fill="none" stroke="#EA4335" strokeWidth="28" 
                  d="M 261 240.4 A 57 57 0 0 1 318 297.9"/>
            {/* Yellow arc - bottom right quadrant */}
            <path id="yellowG" className="circle" fill="none" stroke="#FBBC05" strokeWidth="28" 
                  d="M 318 297.9 A 57 57 0 0 1 375.9 240.4"/>
            {/* Green arc - top left quadrant */}
            <path id="greenG" className="circle" fill="none" stroke="#34A853" strokeWidth="28" 
                  d="M 375.9 240.4 A 57 57 0 0 1 318 182.9"/>
          </g>
          
          {/* Starting dots */}
          <g id="dots">
            <circle className="dot dotBlue" fill="#4285F4" cx="244.9" cy="240.4" r="14.5"/>
            <circle className="dot dotRed" fill="#EA4335" cx="302.7" cy="240.4" r="14.5"/>
            <circle className="dot dotYellow" fill="#FBBC05" cx="360.5" cy="240.4" r="14.5"/>
            <circle className="dot dotGreen" fill="#34A853" cx="418.3" cy="240.4" r="14.5"/>
          </g>
          
          {/* G line */}
          <g id="gLineGroup" clipPath="url(#cut-off-gline)">
            <path id="gLine" fill="none" stroke="#4285F4" strokeWidth="28.91" d="M319 240.4h68"/>
          </g>
        </svg>
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