
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const PetNotFound = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Nie znaleziono zwierzęcia</h2>
          <p className="text-muted-foreground mt-2">Zwierzę o podanym ID nie istnieje</p>
          <Button asChild className="mt-4">
            <Link to="/pets">Wróć do listy zwierząt</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetNotFound;
