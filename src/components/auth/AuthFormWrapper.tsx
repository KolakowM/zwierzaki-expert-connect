
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
}

const AuthFormWrapper = ({ 
  title, 
  description, 
  children, 
  footer 
}: AuthFormWrapperProps) => {
  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            {children}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthFormWrapper;
