
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AuthLoadingScreen = () => {
  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <LoadingSpinner size="lg" />
      </div>
    </MainLayout>
  );
};

export default AuthLoadingScreen;
