
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { SkipLink } from "@/components/ui/skip-link";
import { LiveRegion } from "@/components/ui/live-region";
import { useAnnouncements } from "@/hooks/useAnnouncements";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { announcement } = useAnnouncements();

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink href="#main-content">
        Przejdź do głównej treści
      </SkipLink>
      <SkipLink href="#navigation">
        Przejdź do nawigacji
      </SkipLink>
      
      <Header />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      
      <Footer />
      
      {announcement && (
        <LiveRegion level="polite">
          {announcement}
        </LiveRegion>
      )}
    </div>
  );
}
