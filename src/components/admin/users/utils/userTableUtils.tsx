
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Nigdy";
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusBadge = (status: string) => {
  switch(status) {
    case 'active':
      return <Badge variant="success">Aktywny</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Nieaktywny</Badge>;
    case 'pending':
      return <Badge variant="warning">Oczekujący</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getRoleBadge = (role: string) => {
  switch(role) {
    case 'admin':
      return (
        <div className="flex items-center">
          <Shield className="mr-1 h-3 w-3 text-red-500" />
          <span>Administrator</span>
        </div>
      );
    case 'specialist':
      return (
        <div className="flex items-center">
          <User className="mr-1 h-3 w-3 text-blue-500" />
          <span>Specjalista</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <User className="mr-1 h-3 w-3 text-gray-500" />
          <span>Użytkownik</span>
        </div>
      );
  }
};
