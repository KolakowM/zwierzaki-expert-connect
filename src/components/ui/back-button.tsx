
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export function BackButton({ to, label, className }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      variant="ghost" 
      className={`flex items-center gap-1 hover:bg-accent px-2 ${className}`} 
      onClick={handleClick}
      type="button"
    >
      <ArrowLeft className="h-4 w-4" />
      {label || "Powrót"}
    </Button>
  );
}
