
import React from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResetPassword = () => {
  return (
    <MainLayout>
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
