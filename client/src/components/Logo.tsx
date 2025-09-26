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
      <div 
        className={`${getSizeClasses()} flex items-center text-gray-800 font-semibold tracking-tight`}
        data-testid="logo-text"
        style={{ fontFamily: 'Google Sans, sans-serif' }}
      >
        <span className="text-2xl lg:text-3xl">Campaign AI Gen</span>
      </div>
    </div>
  );
}