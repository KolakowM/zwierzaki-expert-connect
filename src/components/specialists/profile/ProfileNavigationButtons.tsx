
import { Button } from "@/components/ui/button";

interface ProfileNavigationButtonsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function ProfileNavigationButtons({
  activeTab,
  setActiveTab,
  isSubmitting,
  onSubmit
}: ProfileNavigationButtonsProps) {
  return (
    <div className="mt-8 flex justify-between">
      <Button
        variant="outline"
        onClick={() => {
          if (activeTab === "specializations") {
            setActiveTab("basic");
          } else if (activeTab === "contact") {
            setActiveTab("specializations");
          } else if (activeTab === "social") {
            setActiveTab("contact");
          }
        }}
        disabled={activeTab === "basic" || isSubmitting}
      >
        Wstecz
      </Button>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Zapisywanie..." : "Zapisz i kontynuuj"}
      </Button>
    </div>
  );
}
