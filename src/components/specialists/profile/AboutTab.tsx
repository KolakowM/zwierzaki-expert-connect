
import { Card, CardContent } from "@/components/ui/card";

interface AboutTabProps {
  description: string;
  experience: string;
}

export function AboutTab({ description, experience }: AboutTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">O mnie</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {description}
        </p>
        
        <h3 className="text-xl font-bold mt-8 mb-3">Doświadczenie</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {experience}
        </p>
      </CardContent>
    </Card>
  );
}
