import logoImage from '@assets/logoGcloud_1758920769431.png';

interface LogoProps {
  size?: "small" | "medium" | "large" | "xlarge";
  className?: string;
}

export default function Logo({ size = "medium", className = "" }: LogoProps) {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: 'calc(var(--space-2xl) * 3)', height: 'auto' };
      case "large":
        return { width: 'calc(var(--space-2xl) * 4)', height: 'auto' };
      case "xlarge":
        return { width: 'calc(var(--space-2xl) * 5)', height: 'auto' };
      default:
        return { width: 'calc(var(--space-2xl) * 3.5)', height: 'auto' };
    }
  };

  return (
    <div className={className}>
      <img 
        src={logoImage} 
        alt="Google Cloud" 
        className="logo-image"
        style={getSizeStyles()}
        data-testid="logo-image"
      />
    </div>
  );
}