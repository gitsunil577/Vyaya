interface CircleLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CircleLoader({ size = "md", className = "" }: CircleLoaderProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const spinnerSizeClasses = {
    sm: "h-3 w-3",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Outer spinning circle */}
      <div className={`absolute inset-0 rounded-full border-2 border-brass/20 border-t-brass animate-spin`} />
      
      {/* Inner symbol/container */}
      <div className={`flex items-center justify-center rounded-full bg-ink-900 border border-brass/40 ${spinnerSizeClasses[size]} animate-pulse text-brass-light`}>
        <span className="font-mono text-[10px] font-bold">₹</span>
      </div>
    </div>
  );
}
