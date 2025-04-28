
import { Button } from "@/components/ui/button";
import { AuditResult } from "@/services/audit/databaseAudit";

interface AuditActionButtonsProps {
  auditResult: AuditResult | null;
  isLoading: boolean;
  isFixing: boolean;
  onRunAudit: () => void;
  onFixIssues: () => void;
}

const AuditActionButtons = ({
  auditResult,
  isLoading,
  isFixing,
  onRunAudit,
  onFixIssues,
}: AuditActionButtonsProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button 
        onClick={onRunAudit}
        disabled={isLoading}
        className="min-w-[120px]"
      >
        {isLoading ? "Analizowanie..." : "Rozpocznij audyt"}
      </Button>
      
      {auditResult && auditResult.recommendations.length > 0 && (
        <Button 
          onClick={onFixIssues}
          disabled={isFixing || isLoading}
          variant="outline"
          className="min-w-[120px]"
        >
          {isFixing ? "Naprawianie..." : "Napraw problemy"}
        </Button>
      )}
    </div>
  );
};

export default AuditActionButtons;
