
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { partners, contributors } from "@/data/partnersData";
import { ExternalLink, Linkedin, Twitter } from "lucide-react";

export function PartnersSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t('partners.section_title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t('partners.section_description')}
          </p>
        </div>

        {/* Company Partners */}
        <div className="mb-16">
          <h3 className="mb-8 text-center text-2xl font-semibold">
            {t('partners.company_partners')}
          </h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {partners.map((partner) => (
              <Card
                key={partner.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <CardContent className="flex h-24 items-center justify-center p-4">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                      {partner.name}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Individual Contributors */}
        <div>
          <h3 className="mb-8 text-center text-2xl font-semibold">
            {t('partners.contributors')}
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {contributors.map((contributor) => (
              <Card key={contributor.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Avatar className="mx-auto mb-4 h-20 w-20">
                    <AvatarImage
                      src={contributor.avatar}
                      alt={contributor.name}
                    />
                    <AvatarFallback className="text-lg">
                      {contributor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="mb-1 text-lg font-semibold">
                    {contributor.name}
                  </h4>
                  <p className="mb-3 text-sm font-medium text-primary">
                    {contributor.role}
                  </p>
                  {contributor.bio && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      {contributor.bio}
                    </p>
                  )}
                  <div className="flex justify-center space-x-2">
                    {contributor.linkedin && (
                      <a
                        href={contributor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`${contributor.name} LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {contributor.twitter && (
                      <a
                        href={contributor.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`${contributor.name} Twitter`}
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
