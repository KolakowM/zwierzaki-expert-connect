
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { mockClients, mockPets, mockVisits } from "@/data/mockData";
import { Client, Pet, Visit } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Plus,
  PawPrint,
  FileText,
  Clipboard,
} from "lucide-react";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";

const ClientDetails = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby przeglądać szczegóły klienta",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    // Fetch client details
    const foundClient = mockClients.find(c => c.id === id);
    if (!foundClient) {
      toast({
        title: "Nie znaleziono klienta",
        description: "Klient o podanym identyfikatorze nie istnieje",
        variant: "destructive"
      });
      navigate("/clients");
      return;
    }
    setClient(foundClient);

    // Fetch client's pets
    const clientPets = mockPets.filter(p => p.clientId === id);
    setPets(clientPets);

    // Fetch client's visits
    const clientVisits = mockVisits.filter(v => v.clientId === id);
    setVisits(clientVisits);
  }, [id, isAuthenticated, navigate, toast]);

  const handlePetSaved = (newPet: Pet) => {
    setPets(prevPets => [newPet, ...prevPets]);
    toast({
      title: "Zwierzak dodany pomyślnie",
      description: `${newPet.name} został dodany do klientów ${client?.firstName} ${client?.lastName}`
    });
  };

  const handleClientUpdated = (updatedClient: Client) => {
    setClient(updatedClient);
    toast({
      title: "Dane klienta zaktualizowane",
      description: "Zmiany zostały zapisane pomyślnie"
    });
  };

  if (!client) {
    return null; // Could add a loading skeleton here
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <User className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">{client.firstName} {client.lastName}</h1>
          </div>
          <ResponsiveClientForm 
            buttonText="Edytuj klienta" 
            buttonVariant="outline" 
            buttonSize="default"
            title={`Edytuj dane: ${client.firstName} ${client.lastName}`}
            defaultValues={client}
            onClientSaved={handleClientUpdated}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Dane kontaktowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{client.address}</p>
                    {client.city && client.postCode && (
                      <p>{client.postCode} {client.city}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Klient od: {new Date(client.createdAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </CardFooter>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Notatki</CardTitle>
            </CardHeader>
            <CardContent>
              {client.notes ? (
                <p>{client.notes}</p>
              ) : (
                <p className="text-muted-foreground">Brak notatek dla tego klienta.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edytuj notatki
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="pets">Zwierzęta ({pets.length})</TabsTrigger>
            <TabsTrigger value="visits">Historia wizyt ({visits.length})</TabsTrigger>
            <TabsTrigger value="documents">Dokumenty</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Zwierzęta klienta</CardTitle>
                  <CardDescription>
                    Lista zwierząt zarejestrowanych dla tego klienta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pets.length > 0 ? (
                    <div className="space-y-2">
                      {pets.map(pet => (
                        <div key={pet.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center">
                            <PawPrint className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{pet.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {pet.species} • {pet.breed || "Nieznana rasa"}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/pets/${pet.id}`}>Szczegóły</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <PawPrint className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Brak zarejestrowanych zwierząt dla tego klienta
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {client.id && (
                    <ResponsivePetForm 
                      clientId={client.id}
                      buttonText="Dodaj zwierzę"
                      buttonSize="sm"
                      onPetSaved={handlePetSaved}
                    />
                  )}
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ostatnie wizyty</CardTitle>
                  <CardDescription>
                    Najnowsze wizyty i konsultacje
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {visits.length > 0 ? (
                    <div className="space-y-2">
                      {visits.slice(0, 3).map(visit => {
                        const pet = pets.find(p => p.id === visit.petId);
                        return (
                          <div key={visit.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="font-medium">{new Date(visit.date).toLocaleDateString('pl-PL')}</p>
                              <p className="text-sm text-muted-foreground">
                                {visit.type} • {pet?.name || "Nieznane zwierzę"}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Szczegóły
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Calendar className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Brak zarejestrowanych wizyt dla tego klienta
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj wizytę
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pets" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lista zwierząt</CardTitle>
                  <CardDescription>
                    Wszystkie zwierzęta należące do tego klienta
                  </CardDescription>
                </div>
                {client.id && (
                  <ResponsivePetForm 
                    clientId={client.id}
                    buttonText="Dodaj zwierzę"
                    onPetSaved={handlePetSaved}
                  />
                )}
              </CardHeader>
              <CardContent>
                {pets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imię</TableHead>
                        <TableHead>Gatunek</TableHead>
                        <TableHead>Rasa</TableHead>
                        <TableHead>Wiek</TableHead>
                        <TableHead>Płeć</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pets.map((pet) => (
                        <TableRow key={pet.id}>
                          <TableCell className="font-medium">
                            <Link to={`/pets/${pet.id}`} className="hover:underline">
                              {pet.name}
                            </Link>
                          </TableCell>
                          <TableCell>{pet.species}</TableCell>
                          <TableCell>{pet.breed || '—'}</TableCell>
                          <TableCell>{pet.age ? `${pet.age} lat` : '—'}</TableCell>
                          <TableCell>{pet.sex || '—'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/pets/${pet.id}`}>Szczegóły</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <PawPrint className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">Brak zwierząt</h3>
                    <p className="text-muted-foreground mt-1">
                      Ten klient nie ma jeszcze zarejestrowanych zwierząt
                    </p>
                    {client.id && (
                      <ResponsivePetForm 
                        clientId={client.id}
                        buttonText="Dodaj pierwsze zwierzę"
                        className="mt-4"
                        onPetSaved={handlePetSaved}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historia wizyt</CardTitle>
                  <CardDescription>
                    Wszystkie wizyty i konsultacje tego klienta
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj wizytę
                </Button>
              </CardHeader>
              <CardContent>
                {visits.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Zwierzę</TableHead>
                        <TableHead>Notatki</TableHead>
                        <TableHead>Kontrola</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visits.map((visit) => {
                        const pet = pets.find(p => p.id === visit.petId);
                        return (
                          <TableRow key={visit.id}>
                            <TableCell className="font-medium">
                              {new Date(visit.date).toLocaleDateString('pl-PL')}
                            </TableCell>
                            <TableCell>{visit.type}</TableCell>
                            <TableCell>
                              {pet ? (
                                <Link to={`/pets/${pet.id}`} className="hover:underline">
                                  {pet.name}
                                </Link>
                              ) : '—'}
                            </TableCell>
                            <TableCell>{visit.notes ? visit.notes.substring(0, 30) + '...' : '—'}</TableCell>
                            <TableCell>
                              {visit.followUpNeeded ? (
                                <span className="text-amber-600">
                                  {new Date(visit.followUpDate || '').toLocaleDateString('pl-PL')}
                                </span>
                              ) : 'Nie wymagana'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Szczegóły
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">Brak wizyt</h3>
                    <p className="text-muted-foreground mt-1">
                      Ten klient nie ma jeszcze zarejestrowanych wizyt
                    </p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Zaplanuj pierwszą wizytę
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Dokumenty i plany opieki</CardTitle>
                  <CardDescription>
                    Dokumenty i plany opieki przypisane do tego klienta
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj dokument
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-lg font-medium">Brak dokumentów</h3>
                  <p className="text-muted-foreground mt-1">
                    Ten klient nie ma jeszcze żadnych dokumentów ani planów opieki
                  </p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Utwórz nowy plan opieki
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClientDetails;
