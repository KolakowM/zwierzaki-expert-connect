
import React from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AuthLoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default AuthLoadingScreen;
