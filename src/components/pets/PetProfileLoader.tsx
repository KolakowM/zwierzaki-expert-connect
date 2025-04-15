
import MainLayout from "@/components/layout/MainLayout";

const PetProfileLoader = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetProfileLoader;
