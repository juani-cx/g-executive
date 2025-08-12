interface FloatingOrbProps {
  size: number;
  color: string;
  delay: number;
  duration: number;
  x: string;
  y: string;
}

function FloatingOrb({ size, color, delay, duration, x, y }: FloatingOrbProps) {
  return (
    <div
      className="absolute rounded-full opacity-30 blur-xl animate-pulse"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        left: x,
        top: y,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

export default function GlassBackground() {
  const orbs = [
    {
      size: 400,
      color: 'rgba(99, 102, 241, 0.3)',
      delay: 0,
      duration: 20,
      x: '20%',
      y: '30%',
    },
    {
      size: 300,
      color: 'rgba(139, 92, 246, 0.25)',
      delay: 5,
      duration: 25,
      x: '80%',
      y: '60%',
    },
    {
      size: 350,
      color: 'rgba(236, 72, 153, 0.2)',
      delay: 10,
      duration: 22,
      x: '60%',
      y: '20%',
    },
    {
      size: 200,
      color: 'rgba(79, 172, 254, 0.25)',
      delay: 2,
      duration: 18,
      x: '30%',
      y: '80%',
    },
    {
      size: 250,
      color: 'rgba(168, 85, 247, 0.2)',
      delay: 8,
      duration: 28,
      x: '90%',
      y: '15%',
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main background orbs */}
      {orbs.map((orb, index) => (
        <FloatingOrb key={index} {...orb} />
      ))}
      
      {/* Additional floating elements */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{
          background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animationDuration: '15s',
          animationDelay: '3s',
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)
          `,
          animation: 'float 30s ease-in-out infinite reverse',
        }}
      />
    </div>
  );
}