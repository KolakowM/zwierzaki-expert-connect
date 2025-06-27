
import React from 'react';
import { LoadingSpinner } from './loading-spinner';

export const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Ładowanie aplikacji...</p>
      </div>
    </div>
  );
};
