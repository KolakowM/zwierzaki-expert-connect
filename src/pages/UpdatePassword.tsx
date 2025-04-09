
import React from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UpdatePassword = () => {
  return (
    <MainLayout>
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Update Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                <Input id="newPassword" type="password" placeholder="Enter your new password" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your new password" />
              </div>
              <Button type="submit" className="w-full">Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UpdatePassword;
