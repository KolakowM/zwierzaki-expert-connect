
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AccessibleImage } from "@/components/ui/accessible-image";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/40" role="contentinfo">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Logo i opis platformy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AccessibleImage
                src="/lovable-uploads/5bdd954f-63dd-4a66-8c3f-96d62e366662.png"
                alt="PetsFlow - logo platformy"
                className="w-6 h-6"
              />
              <span className="text-lg font-bold text-primary">PetsFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright")}
            </p>
          </div>

          {/* Nawigacja platformy */}
          <nav aria-label="Nawigacja platformy">
            <h3 className="mb-4 text-sm font-medium">{t("footer.platform")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.catalog")}
                </Link>
              </li>
              <li>
                <Link
                  to="/become-specialist"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.become_specialist")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Pomoc i wsparcie */}
          <nav aria-label="Wsparcie i pomoc">
            <h3 className="mb-4 text-sm font-medium">{t("footer.support")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Dane kontaktowe */}
          <div>
            <h3 className="mb-4 text-sm font-medium">{t("footer.contact_info")}</h3>
            <address className="not-italic">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-primary" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{t("footer.email")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-primary" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{t("footer.location")}</span>
                </li>
              </ul>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}
