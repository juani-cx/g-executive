import { useEffect, useRef } from 'react';

interface GoogleLogoAnimationProps {
  size?: number;
  loop?: boolean;
  speed?: number;
  className?: string;
}

export default function GoogleLogoAnimation({ 
  size = 200, 
  loop = true, 
  speed = 1.0,
  className = '' 
}: GoogleLogoAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const dots = svg.querySelectorAll('.dot');
    const arcs = svg.querySelectorAll('.arc');
    const gLine = svg.querySelector('.g-line') as SVGPathElement;

    // Initialize stroke dash arrays based on path lengths
    arcs.forEach((arc) => {
      const pathElement = arc as SVGPathElement;
      const length = pathElement.getTotalLength();
      pathElement.style.strokeDasharray = `${length}`;
      pathElement.style.strokeDashoffset = `${length}`;
      pathElement.style.opacity = '0';
    });

    if (gLine) {
      const length = gLine.getTotalLength();
      gLine.style.strokeDasharray = `${length}`;
      gLine.style.strokeDashoffset = `${length}`;
      gLine.style.opacity = '0';
    }

    // Animation timeline (3.6 seconds total)
    const duration = 3600 / speed;
    
    const animateSequence = () => {
      // Phase 1: Dots pulse and fade (0-400ms)
      dots.forEach((dot, index) => {
        const dotElement = dot as HTMLElement;
        dotElement.animate([
          { transform: 'scale(1)', opacity: '1' },
          { transform: 'scale(1.2)', opacity: '0.8', offset: 0.1 },
          { transform: 'scale(0.8)', opacity: '0', offset: 0.4 },
          { transform: 'scale(0.8)', opacity: '0', offset: 0.8 },
          { transform: 'scale(1)', opacity: '1' }
        ], {
          duration,
          delay: index * 50,
          iterations: loop ? Infinity : 1,
          easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          fill: 'forwards'
        });
      });

      // Phase 2: Arcs draw in sequence (400ms-1600ms)
      arcs.forEach((arc, index) => {
        const pathElement = arc as SVGPathElement;
        const length = pathElement.getTotalLength();
        
        pathElement.animate([
          { strokeDashoffset: `${length}`, opacity: '0' },
          { strokeDashoffset: `${length}`, opacity: '1', offset: 0.15 },
          { strokeDashoffset: '0', opacity: '1', offset: 0.6 },
          { strokeDashoffset: '0', opacity: '1', offset: 0.7 },
          { strokeDashoffset: `${length}`, opacity: '1', offset: 0.9 },
          { strokeDashoffset: `${length}`, opacity: '0' }
        ], {
          duration,
          delay: 400 + (index * 150),
          iterations: loop ? Infinity : 1,
          easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          fill: 'forwards'
        });
      });

      // Phase 3: G-line appears (1300ms-1700ms)
      if (gLine) {
        const length = gLine.getTotalLength();
        gLine.animate([
          { strokeDashoffset: `${length}`, opacity: '0' },
          { strokeDashoffset: '0', opacity: '1', offset: 0.3 },
          { strokeDashoffset: '0', opacity: '1', offset: 0.6 },
          { strokeDashoffset: `${length}`, opacity: '1', offset: 0.9 },
          { strokeDashoffset: `${length}`, opacity: '0' }
        ], {
          duration,
          delay: 1300,
          iterations: loop ? Infinity : 1,
          easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          fill: 'forwards'
        });
      }
    };

    // Start animation
    animateSequence();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loop, speed]);

  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '48px'
      }}
      role="img"
      aria-label="Loading Google-style animation"
    >
      <svg
        ref={svgRef}
        width={size}
        height={size * 0.75}
        viewBox="0 0 256 192"
        style={{ overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Dots */}
        <g className="dots">
          <circle className="dot" fill="#4285F4" cx="64" cy="96" r="12" />
          <circle className="dot" fill="#EA4335" cx="112" cy="96" r="12" />
          <circle className="dot" fill="#FBBC05" cx="160" cy="96" r="12" />
          <circle className="dot" fill="#34A853" cx="208" cy="96" r="12" />
        </g>

        {/* Google G Arcs */}
        <g className="arcs">
          {/* Blue arc - top right */}
          <path className="arc" fill="none" stroke="#4285F4" strokeWidth="24" 
                strokeLinecap="round" strokeLinejoin="round"
                d="M 128 48 A 48 48 0 0 1 164 76" />
          {/* Red arc - top left */}
          <path className="arc" fill="none" stroke="#EA4335" strokeWidth="24" 
                strokeLinecap="round" strokeLinejoin="round"
                d="M 92 76 A 48 48 0 0 1 128 48" />
          {/* Yellow arc - bottom left */}
          <path className="arc" fill="none" stroke="#FBBC05" strokeWidth="24" 
                strokeLinecap="round" strokeLinejoin="round"
                d="M 128 144 A 48 48 0 0 1 92 116" />
          {/* Green arc - bottom right */}
          <path className="arc" fill="none" stroke="#34A853" strokeWidth="24" 
                strokeLinecap="round" strokeLinejoin="round"
                d="M 164 116 A 48 48 0 0 1 128 144" />
        </g>

        {/* G horizontal line */}
        <g className="g-line-group">
          <path className="g-line" fill="none" stroke="#4285F4" strokeWidth="24" 
                strokeLinecap="round" strokeLinejoin="round"
                d="M 128 96 L 164 96" />
        </g>
      </svg>
    </div>
  );
}