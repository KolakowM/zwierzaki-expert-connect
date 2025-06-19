
import { cn } from "@/lib/utils";

interface LiveRegionProps {
  children: React.ReactNode;
  level?: "polite" | "assertive" | "off";
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({ 
  children, 
  level = "polite", 
  atomic = false,
  className 
}: LiveRegionProps) {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  );
}

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return (
    <span className={cn("sr-only", className)}>
      {children}
    </span>
  );
}
