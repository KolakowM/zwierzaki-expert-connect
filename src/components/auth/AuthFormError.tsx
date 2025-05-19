
import React from "react";

interface AuthFormErrorProps {
  error: string;
}

const AuthFormError = ({ error }: AuthFormErrorProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">{error}</div>
  );
};

export default AuthFormError;
