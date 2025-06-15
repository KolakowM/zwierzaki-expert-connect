
import { useTranslation } from "react-i18next";

export function BenefitsSection() {
  const { t } = useTranslation();

  const benefitsData = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-primary"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: t("benefits.verified_specialists_title"),
      description: t("benefits.verified_specialists_desc")
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-primary"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: t("benefits.experienced_professionals_title"),
      description: t("benefits.experienced_professionals_desc")
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-primary"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
      title: t("benefits.easy_appointments_title"),
      description: t("benefits.easy_appointments_desc")
    }
  ];

  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('home.why_platform')}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t('home.platform_description')}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {benefitsData.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="mb-2 text-xl font-medium">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
