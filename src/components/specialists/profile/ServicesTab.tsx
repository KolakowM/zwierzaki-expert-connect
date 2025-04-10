
import { Card, CardContent } from "@/components/ui/card";

interface ServicesTabProps {
  services: string[];
}

export function ServicesTab({ services }: ServicesTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Oferowane usługi</h2>
        {services && services.length > 0 ? (
          <ul className="space-y-4">
            {services.map((service: string, index: number) => (
              <li key={index} className="flex">
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
                  className="mr-3 h-6 w-6 text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <div>
                  <p className="font-medium">{service}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Brak informacji o oferowanych usługach</p>
        )}
      </CardContent>
    </Card>
  );
}
