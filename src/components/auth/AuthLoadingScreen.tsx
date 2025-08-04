
import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AuthLoadingScreen = () => {
  const [loadingMessage, setLoadingMessage] = useState("Sprawdzanie sesji...");
  const [showExtendedMessage, setShowExtendedMessage] = useState(false);

  useEffect(() => {
    const messageTimeout = setTimeout(() => {
      setLoadingMessage("Łączenie z serwerem...");
    }, 2000);

    const extendedTimeout = setTimeout(() => {
      setShowExtendedMessage(true);
    }, 5000);

    return () => {
      clearTimeout(messageTimeout);
      clearTimeout(extendedTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="flex flex-col items-center space-y-4 max-w-md text-center">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">
            {loadingMessage}
          </p>
          {showExtendedMessage && (
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Jeśli ładowanie trwa dłużej niż zwykle:</p>
              <ul className="space-y-1">
                <li>• Sprawdź połączenie internetowe</li>
                <li>• Odśwież stronę (F5)</li>
                <li>• Spróbuj ponownie za moment</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
