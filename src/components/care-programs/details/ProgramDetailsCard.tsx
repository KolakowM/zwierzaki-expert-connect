
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CareProgram } from "@/types";

interface ProgramDetailsCardProps {
  program: CareProgram;
}

const ProgramDetailsCard = ({ program }: ProgramDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan opieki</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-1">Cel planu:</h4>
          <p>{program.goal}</p>
        </div>
        
        {program.description && (
          <div>
            <h4 className="font-medium text-sm mb-1">Opis:</h4>
            <p className="whitespace-pre-line">{program.description}</p>
          </div>
        )}
        
        {program.instructions && (
          <div>
            <h4 className="font-medium text-sm mb-1">Instrukcje:</h4>
            <p className="whitespace-pre-line">{program.instructions}</p>
          </div>
        )}
        
        {program.recommendations && (
          <div>
            <h4 className="font-medium text-sm mb-1">Rekomendacje:</h4>
            <p className="whitespace-pre-line">{program.recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgramDetailsCard;
