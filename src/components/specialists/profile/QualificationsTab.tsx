
import { Card, CardContent } from "@/components/ui/card";

interface QualificationsTabProps {
  education: string[];
}

export function QualificationsTab({ education }: QualificationsTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Wykształcenie i certyfikaty</h2>
        {education && education.length > 0 ? (
          <ul className="space-y-4">
            {education.map((edu: string, index: number) => (
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
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <div>
                  <p className="font-medium">{edu}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Brak informacji o wykształceniu i certyfikatach</p>
        )}
      </CardContent>
    </Card>
  );
}
