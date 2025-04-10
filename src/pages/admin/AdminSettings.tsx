import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Save,
  Mail,
  Database,
  Bell,
  Lock,
  Download,
  Upload,
  RefreshCcw,
  AlertTriangle,
  Languages
} from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  const handleSaveSettings = (tab: string) => {
    toast({
      title: "Ustawienia zapisane",
      description: `Ustawienia ${getTabName(tab)} zostały pomyślnie zaktualizowane.`
    });
  };
  
  const getTabName = (tab: string) => {
    switch(tab) {
      case 'general': return 'ogólne';
      case 'notification': return 'powiadomień';
      case 'security': return 'bezpieczeństwa';
      case 'backup': return 'kopii zapasowych';
      case 'language': return 'języka';
      default: return '';
    }
  };

  return (
    <>
      <AdminHeader 
        title="Ustawienia Systemu" 
        description="Zarządzaj ustawieniami platformy"
      />
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="notification">Powiadomienia</TabsTrigger>
          <TabsTrigger value="security">Bezpieczeństwo</TabsTrigger>
          <TabsTrigger value="backup">Kopie zapasowe</TabsTrigger>
          <TabsTrigger value="language">Język</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia Ogólne</CardTitle>
              <CardDescription>
                Podstawowe ustawienia platformy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Nazwa Platformy</Label>
                    <Input id="platform-name" defaultValue="Pets Flow" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-url">URL Platformy</Label>
                    <Input id="platform-url" defaultValue="https://petsflow.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Administratora</Label>
                    <Input id="admin-email" defaultValue="admin@petsflow.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Email Wsparcia</Label>
                    <Input id="support-email" defaultValue="support@petsflow.com" type="email" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenance-mode">Tryb Konserwacji</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="maintenance-mode" />
                    <label
                      htmlFor="maintenance-mode"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Włącz tryb konserwacji (strona będzie niedostępna dla użytkowników)
                    </label>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('general')}>
                <Save className="mr-2 h-4 w-4" />
                Zapisz Ustawienia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia Powiadomień</CardTitle>
              <CardDescription>
                Konfiguracja systemu powiadomień email i SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Ustawienia Email
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-server">Serwer SMTP</Label>
                      <Input id="smtp-server" defaultValue="smtp.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Port SMTP</Label>
                      <Input id="smtp-port" defaultValue="587" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Nazwa Użytkownika SMTP</Label>
                      <Input id="smtp-username" defaultValue="user@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Hasło SMTP</Label>
                      <Input id="smtp-password" type="password" defaultValue="password" />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label>Opcje Powiadomień Email</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-new-client" defaultChecked />
                        <label htmlFor="email-new-client">Nowy klient</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-new-visit" defaultChecked />
                        <label htmlFor="email-new-visit">Nowa wizyta</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-visit-reminder" defaultChecked />
                        <label htmlFor="email-visit-reminder">Przypomnienia o wizytach</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-system-alerts" />
                        <label htmlFor="email-system-alerts">Alerty systemowe</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Ustawienia SMS
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sms-provider">Dostawca SMS</Label>
                      <Input id="sms-provider" defaultValue="Twillio" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-api-key">Klucz API</Label>
                      <Input id="sms-api-key" defaultValue="your-api-key-here" />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label>Opcje Powiadomień SMS</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sms-visit-reminder" defaultChecked />
                        <label htmlFor="sms-visit-reminder">Przypomnienia o wizytach</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sms-urgent-alerts" />
                        <label htmlFor="sms-urgent-alerts">Nagłe alerty</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('notification')}>
                <Save className="mr-2 h-4 w-4" />
                Zapisz Ustawienia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia Bezpieczeństwa</CardTitle>
              <CardDescription>
                Skonfiguruj ustawienia bezpieczeństwa platformy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Polityka Haseł
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min-password-length">Minimalna długość hasła</Label>
                    <Input id="min-password-length" type="number" defaultValue="8" min="6" max="32" />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label>Wymagania dotyczące hasła</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="require-uppercase" defaultChecked />
                        <label htmlFor="require-uppercase">Wielkie litery</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="require-lowercase" defaultChecked />
                        <label htmlFor="require-lowercase">Małe litery</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="require-numbers" defaultChecked />
                        <label htmlFor="require-numbers">Cyfry</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="require-special-chars" />
                        <label htmlFor="require-special-chars">Znaki specjalne</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="password-expiry">Wygaśnięcie hasła (dni)</Label>
                    <Input id="password-expiry" type="number" defaultValue="90" min="0" />
                    <p className="text-xs text-muted-foreground">
                      Ustaw na 0, aby hasła nigdy nie wygasały
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Uwierzytelnianie</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enable-2fa" />
                    <div>
                      <Label htmlFor="enable-2fa">Włącz dwuskładnikowe uwierzytelnianie (2FA)</Label>
                      <p className="text-xs text-muted-foreground">
                        Wymaga od użytkowników dodatkowego kodu podczas logowania
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox id="limit-login-attempts" defaultChecked />
                    <div>
                      <Label htmlFor="limit-login-attempts">Limit nieudanych prób logowania</Label>
                      <p className="text-xs text-muted-foreground">
                        Blokuje konto po 5 nieudanych próbach logowania
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Sesje</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Czas wygaśnięcia sesji (minuty)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" min="5" />
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('security')}>
                <Save className="mr-2 h-4 w-4" />
                Zapisz Ustawienia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Kopie Zapasowe</CardTitle>
              <CardDescription>
                Zarządzaj kopiami zapasowymi danych
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Automatyczne kopie zapasowe</h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enable-auto-backup" defaultChecked />
                  <div>
                    <Label htmlFor="enable-auto-backup">Włącz automatyczne kopie zapasowe</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatycznie tworzy kopie zapasowe według harmonogramu
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Częstotliwość kopii zapasowych</Label>
                    <select
                      id="backup-frequency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="daily"
                    >
                      <option value="hourly">Co godzinę</option>
                      <option value="daily">Codziennie</option>
                      <option value="weekly">Co tydzień</option>
                      <option value="monthly">Co miesiąc</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-time">Czas wykonania kopii</Label>
                    <Input id="backup-time" type="time" defaultValue="02:00" />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="backup-retention">Okres przechowywania kopii (dni)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" min="1" />
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Ręczne kopie zapasowe</h3>
                
                <div className="flex flex-col space-y-4">
                  <Button className="w-full sm:w-auto">
                    <Database className="mr-2 h-4 w-4" />
                    Utwórz pełną kopię zapasową
                  </Button>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Pobierz kopię zapasową
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Upload className="mr-2 h-4 w-4" />
                      Przywróć z kopii zapasowej
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-amber-50">
                <div className="flex items-center text-amber-800 mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Strefa zagrożenia</h3>
                </div>
                
                <p className="text-sm text-amber-800 mb-4">
                  Te operacje są nieodwracalne i mogą mieć poważne konsekwencje. Upewnij się, że wiesz co robisz.
                </p>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full sm:w-auto bg-white text-amber-800 border-amber-300 hover:bg-amber-100">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Zresetuj bazę danych
                  </Button>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('backup')}>
                <Save className="mr-2 h-4 w-4" />
                Zapisz Ustawienia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia Językowe</CardTitle>
              <CardDescription>
                Skonfiguruj opcje językowe dla platformy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Languages className="mr-2 h-5 w-5" />
                    Język Platformy
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Domyślny język platformy</Label>
                    <select
                      id="default-language"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="pl"
                    >
                      <option value="pl">Polski</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label>Dostępne języki dla użytkowników</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="lang-pl" defaultChecked />
                        <label htmlFor="lang-pl">Polski</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="lang-en" defaultChecked />
                        <label htmlFor="lang-en">English</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="lang-de" />
                        <label htmlFor="lang-de">Deutsch</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="lang-fr" />
                        <label htmlFor="lang-fr">Français</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="lang-es" />
                        <label htmlFor="lang-es">Español</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Tłumaczenia</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="translation-service">Usługa tłumaczeniowa</Label>
                    <select
                      id="translation-service"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="none"
                    >
                      <option value="none">Brak (ręczne tłumaczenia)</option>
                      <option value="google">Google Translate API</option>
                      <option value="deepl">DeepL API</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="api-key">Klucz API</Label>
                    <Input id="api-key" type="password" placeholder="Wprowadź klucz API dla usługi tłumaczeniowej" />
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox id="auto-translate" />
                    <div>
                      <Label htmlFor="auto-translate">Automatyczne tłumaczenie treści</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatycznie tłumacz treść na język preferowany przez użytkownika
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings('language')}>
                <Save className="mr-2 h-4 w-4" />
                Zapisz Ustawienia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AdminSettings;
