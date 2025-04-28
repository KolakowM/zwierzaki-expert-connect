
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Database, Wrench, Shield } from "lucide-react";
import DatabaseAuditReport from "@/components/admin/settings/DatabaseAuditReport";

const AdminDatabaseAudit = () => {
  return (
    <AdminLayout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audyt bazy danych</h1>
            <p className="text-muted-foreground">
              Sprawdź strukturę bazy danych i zgodność z dokumentacją techniczną
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <DatabaseAuditReport />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Bezpieczeństwo danych
              </CardTitle>
              <CardDescription>
                Informacje na temat polityk Row Level Security (RLS) i zabezpieczeń
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                System PetsFlow wykorzystuje zaawansowane mechanizmy bezpieczeństwa dostępu do danych.
                Polityki Row Level Security (RLS) gwarantują, że użytkownicy mają dostęp tylko do swoich danych
                lub danych, do których zostali specjalnie upoważnieni.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Kluczowe mechanizmy bezpieczeństwa:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Polityki RLS na poziomie tabeli dla wszystkich danych użytkowników</li>
                <li>Funkcje Security Definer do bezpiecznego wykonywania operacji uprzywilejowanych</li>
                <li>System ról (admin, user, specialist) z różnymi poziomami dostępu</li>
                <li>Autentykacja użytkowników przez Supabase Auth</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" /> Narzędzia administracyjne
              </CardTitle>
              <CardDescription>
                Zaawansowane funkcje dla administratorów systemu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Panel administratora zawiera narzędzia do zarządzania strukturą bazy danych,
                monitorowania wydajności i wykonywania zadań konserwacyjnych.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Button variant="outline" className="justify-start">
                  <Database className="h-4 w-4 mr-2" /> 
                  Konsola SQL
                </Button>
                
                <Button variant="outline" disabled className="justify-start opacity-50">
                  <Shield className="h-4 w-4 mr-2" /> 
                  Audyt bezpieczeństwa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDatabaseAudit;
