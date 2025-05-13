
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book } from "lucide-react";

const BlogHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-10 text-center">
      <div className="flex justify-center">
        <Book className="h-12 w-12 text-primary" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        Blog PetsFlow
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Artykuły, porady i aktualności dla specjalistów behawiorystyki zwierząt
      </p>
    </div>
  );
};

export default BlogHeader;
