
import { cn } from "@/lib/utils";

interface AccessibleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  decorative?: boolean;
  className?: string;
}

export function AccessibleImage({ 
  alt, 
  decorative = false, 
  className, 
  ...props 
}: AccessibleImageProps) {
  return (
    <img
      {...props}
      alt={decorative ? "" : alt}
      role={decorative ? "presentation" : undefined}
      className={cn("max-w-full h-auto", className)}
    />
  );
}
