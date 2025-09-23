interface SimpleLoadingAnimationProps {
  size?: number;
  className?: string;
}

export default function SimpleLoadingAnimation({ 
  size = 100, 
  className = '' 
}: SimpleLoadingAnimationProps) {
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
      aria-label="Loading animation"
    >
      <div 
        className="loading-container"
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        <span className="loading-circle one"></span>
        <span className="loading-circle two"></span>
        <span className="loading-circle three"></span>
        <span className="loading-circle four"></span>
      </div>
    </div>
  );
}