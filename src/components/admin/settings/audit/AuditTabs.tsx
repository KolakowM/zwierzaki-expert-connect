
import { TabsContent } from "@/components/ui/tabs";
import { AuditResult } from "@/services/audit/databaseAudit";
import AuditOverviewTab from "./tabs/AuditOverviewTab";
import AuditTablesTab from "./tabs/AuditTablesTab";
import AuditRelationshipsTab from "./tabs/AuditRelationshipsTab";
import AuditRolesTab from "./tabs/AuditRolesTab";
import AuditSecurityTab from "./tabs/AuditSecurityTab";
import AuditRecommendationsTab from "./tabs/AuditRecommendationsTab";

interface AuditTabsProps {
  auditResult: AuditResult | null;
  activeTab: string;
}

const AuditTabs = ({ auditResult, activeTab }: AuditTabsProps) => {
  if (!auditResult) return null;

  return (
    <>
      <TabsContent value="overview">
        <AuditOverviewTab auditResult={auditResult} />
      </TabsContent>
      
      <TabsContent value="tables">
        <AuditTablesTab tables={auditResult.tables} />
      </TabsContent>
      
      <TabsContent value="relationships">
        <AuditRelationshipsTab relationships={auditResult.relationships} />
      </TabsContent>
      
      <TabsContent value="roles">
        <AuditRolesTab roles={auditResult.roles} specialistProfiles={auditResult.specialistProfiles} />
      </TabsContent>
      
      <TabsContent value="security">
        <AuditSecurityTab security={auditResult.security} />
      </TabsContent>
      
      <TabsContent value="recommendations">
        <AuditRecommendationsTab recommendations={auditResult.recommendations} />
      </TabsContent>
    </>
  );
};

export default AuditTabs;
