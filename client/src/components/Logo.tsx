interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function Logo({ size = "medium", className = "" }: LogoProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-44 h-auto"; // Increased from w-32 to accommodate full text
      case "large":
        return "w-64 h-auto"; // Increased from w-48 to accommodate full text
      default:
        return "w-52 h-auto"; // Increased from w-40 to accommodate full text
    }
  };

  return (
    <div className={className}>
      <img 
        src="/images/logo.svg" 
        alt="Google Cloud" 
        className={getSizeClasses()}
        data-testid="logo-image"
      />
    </div>
  );
}