import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import { Pet, Client, Visit, CareProgram } from "@/types";
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
  PawPrint,
  User,
  Calendar,
  Weight,
  FileText,
  Stethoscope,
  Edit,
  Plus,
  Clipboard,
  Trash2,
  FileDown
} from "lucide-react";
import { getPetById, deletePet } from "@/services/petService";
import { getClientById } from "@/services/clientService";
import { getVisitsByPetId } from "@/services/visitService";
import { getCareProgramsByPetId } from "@/services/careProgramService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import ResponsiveVisitForm from "@/components/visits/ResponsiveVisitForm";
import ResponsiveCareProgramForm from "@/components/care-programs/ResponsiveCareProgramForm";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import DocumentUpload from "@/components/documents/DocumentUpload";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PetProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby przeglądać profile zwierząt",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const { 
    data: pet, 
    isLoading: isLoadingPet,
    isError: isPetError,
  } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => id ? getPetById(id) : null,
    enabled: !!id && isAuthenticated,
  });

  const { 
    data: owner, 
    isLoading: isLoadingOwner 
  } = useQuery({
    queryKey: ['client', pet?.clientId],
    queryFn: () => pet?.clientId ? getClientById(pet.clientId) : null,
    enabled: !!pet?.clientId && isAuthenticated,
  });

  const { 
    data: visits = [], 
    isLoading: isLoadingVisits 
  } = useQuery({
    queryKey: ['visits', id],
    queryFn: () => id ? getVisitsByPetId(id) : Promise.resolve([]),
    enabled: !!id && isAuthenticated,
  });

  const { 
    data: carePrograms = [], 
    isLoading: isLoadingCarePrograms 
  } = useQuery({
    queryKey: ['carePrograms', id],
    queryFn: () => id ? getCareProgramsByPetId(id) : Promise.resolve([]),
    enabled: !!id && isAuthenticated,
  });

  const isLoading = isLoadingPet || isLoadingOwner || isLoadingVisits || isLoadingCarePrograms;

  useEffect(() => {
    if (isPetError) {
      toast({
        title: "Nie znaleziono zwierzęcia",
        description: "Profil zwierzęcia o podanym identyfikatorze nie istnieje lub wystąpił błąd",
        variant: "destructive"
      });
      navigate("/clients");
    }
  }, [isPetError, navigate, toast]);

  const handlePetUpdated = (updatedPet: Pet) => {
    toast({
      title: "Dane zwierzęcia zaktualizowane",
      description: "Zmiany zostały zapisane pomyślnie"
    });
  };

  const handleVisitAdded = (visit: Visit) => {
    queryClient.invalidateQueries({ queryKey: ['visits', id] });
    toast({
      title: "Wizyta dodana pomyślnie",
      description: "Nowa wizyta została zapisana"
    });
  };

  const handleCareProgramAdded = (careProgram: CareProgram) => {
    queryClient.invalidateQueries({ queryKey: ['carePrograms', id] });
    toast({
      title: "Plan opieki utworzony pomyślnie",
      description: "Nowy plan opieki został zapisany"
    });
  };

  const handleDeletePet = async () => {
    try {
      if (!pet?.id) return;
      
      await deletePet(pet.id);
      
      toast({
        title: "Zwierzę usunięte",
        description: `${pet.name} oraz wszystkie powiązane dane zostały pomyślnie usunięte`
      });
      
      if (pet.clientId) {
        navigate(`/clients/${pet.clientId}`);
      } else {
        navigate("/clients");
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Błąd podczas usuwania zwierzęcia",
        description: "Wystąpił błąd podczas usuwania zwierzęcia. Spróbuj ponownie później.",
        variant: "destructive"
      });
    }
  };

  const exportCareProgramToPDF = async (program: CareProgram) => {
    if (!careProgramRef.current || !pet || !owner) return;
    
    try {
      toast({
        title: "Generowanie PDF",
        description: "Trwa generowanie dokumentu PDF...",
      });

      const canvas = await html2canvas(careProgramRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const currentDate = new Date().toLocaleDateString('pl-PL');
      const currentUser = "Administrator"; // Replace with actual user info when auth is implemented
      
      pdf.setFontSize(16);
      pdf.text("Plan Opieki", 105, 15, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Data wygenerowania: ${currentDate}`, 15, 25);
      pdf.text(`Użytkownik: ${currentUser}`, 15, 30);
      
      pdf.setFontSize(12);
      pdf.text("Dane właściciela:", 15, 40);
      pdf.setFontSize(10);
      pdf.text(`${owner.firstName} ${owner.lastName}`, 15, 45);
      pdf.text(`Tel: ${owner.phone || "Brak"}`, 15, 50);
      pdf.text(`Email: ${owner.email || "Brak"}`, 15, 55);
      
      pdf.setFontSize(12);
      pdf.text("Dane zwierzęcia:", 15, 65);
      pdf.setFontSize(10);
      pdf.text(`Imię: ${pet.name}`, 15, 70);
      pdf.text(`Gatunek: ${pet.species}`, 15, 75);
      pdf.text(`Rasa: ${pet.breed || "Nieznana"}`, 15, 80);
      
      pdf.addImage(imgData, 'PNG', 0, 90, imgWidth, imgHeight);
      
      pdf.save(`Plan_opieki_${pet.name}_${program.name.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "Dokument PDF wygenerowany",
        description: "Plan opieki został wyeksportowany do PDF",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Błąd podczas generowania PDF",
        description: "Spróbuj ponownie później",
        variant: "destructive",
      });
    }
  };

  const handleDocumentUpload = async (files: File[]) => {
    // Implement your document upload logic here
    console.log('Uploading files:', files);
    toast({
      title: "Przesyłanie plików",
      description: `Przesyłanie ${files.length} plików...`,
    });
    // You can use a service function to handle the actual upload
    // Example: await uploadDocuments(pet.id, files);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-muted/50 animate-pulse"></div>
            <div className="h-8 w-48 bg-muted/50 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-32 bg-muted/50 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/50 rounded"></div>
                    <div className="h-4 w-3/4 bg-muted/50 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!pet) {
    return null;
  }

  const petAge = pet.age ? `${pet.age} lat` : "Nieznany";
  const petWeight = pet.weight ? `${pet.weight} kg` : "Nieznana";

  const totalVisits = visits.length;
  const totalCarePrograms = carePrograms.length;
  let deleteWarning = '';
  
  if (totalVisits > 0 || totalCarePrograms > 0) {
    deleteWarning = `Wraz ze zwierzęciem zostaną również usunięte:
    ${totalVisits > 0 ? `\n- ${totalVisits} wizyt` : ''}
    ${totalCarePrograms > 0 ? `\n- ${totalCarePrograms} programów opieki` : ''}`;
  }

  const careProgramRef = useRef<HTMLDivElement>(null);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PawPrint className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">{pet.name}</h1>
          </div>
          <div className="flex space-x-2">
            {pet.id && pet.clientId && (
              <ResponsivePetForm
                clientId={pet.clientId}
                buttonText="Edytuj profil"
                buttonVariant="outline"
                defaultValues={pet}
                isEditing={true}
                onPetSaved={handlePetUpdated}
              />
            )}
            
            <ConfirmDeleteDialog
              title={`Usuń zwierzę: ${pet.name}`}
              description="Czy na pewno chcesz usunąć to zwierzę?"
              additionalWarning={deleteWarning}
              onConfirm={handleDeletePet}
              triggerButtonVariant="destructive"
              triggerButtonText="Usuń zwierzę"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacje podstawowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gatunek</p>
                  <p className="font-medium">{pet.species}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rasa</p>
                  <p className="font-medium">{pet.breed || "Nieznana"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wiek</p>
                  <p className="font-medium">{petAge}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Waga</p>
                  <p className="font-medium">{petWeight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Płeć</p>
                  <p className="font-medium">{pet.sex || "Nieznana"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sterylizacja</p>
                  <p className="font-medium">{pet.neutered ? "Tak" : "Nie"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Właściciel</CardTitle>
            </CardHeader>
            <CardContent>
              {owner ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Link to={`/clients/${owner.id}`} className="font-medium hover:underline">
                      {owner.firstName} {owner.lastName}
                    </Link>
                  </div>
                  {owner.phone && (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span>{owner.phone}</span>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link to={`/clients/${owner.id}`}>
                      Profil właściciela
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Brak informacji o właścicielu</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historia zdrowia</CardTitle>
            </CardHeader>
            <CardContent>
              {pet.medicalHistory ? (
                <p className="text-sm">{pet.medicalHistory}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Brak historii zdrowia</p>
              )}
              {pet.allergies && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Alergie:</p>
                  <p className="text-sm">{pet.allergies}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="visits">Wizyty ({visits.length})</TabsTrigger>
            <TabsTrigger value="care-plans">Plany opieki ({carePrograms.length})</TabsTrigger>
            <TabsTrigger value="documents">Dokumenty</TabsTrigger>
            <TabsTrigger value="notes">Notatki</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ogólne informacje o zwierzęciu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pet.dietaryRestrictions && (
                    <div>
                      <h4 className="font-medium mb-1">Ograniczenia dietetyczne:</h4>
                      <p>{pet.dietaryRestrictions}</p>
                    </div>
                  )}
                  
                  {pet.behavioralNotes && (
                    <div>
                      <h4 className="font-medium mb-1">Notatki behawioralne:</h4>
                      <p>{pet.behavioralNotes}</p>
                    </div>
                  )}
                  
                  {!pet.dietaryRestrictions && !pet.behavioralNotes && (
                    <p className="text-muted-foreground">Brak dodatkowych informacji o zwierzęciu</p>
                  )}
                </CardContent>
                <CardFooter>
                  {pet.id && pet.clientId && (
                    <ResponsivePetForm
                      clientId={pet.clientId}
                      buttonText="Edytuj informacje"
                      buttonVariant="outline"
                      buttonSize="sm"
                      defaultValues={pet}
                      isEditing={true}
                      onPetSaved={handlePetUpdated}
                    />
                  )}
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Aktywne plany opieki</CardTitle>
                </CardHeader>
                <CardContent>
                  {carePrograms.filter(cp => cp.status === "aktywny").length > 0 ? (
                    <div className="space-y-4">
                      {carePrograms
                        .filter(cp => cp.status === "aktywny")
                        .map(program => (
                          <div key={program.id} className="border rounded-md p-3">
                            <h4 className="font-medium">{program.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{program.goal}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Aktywny
                              </span>
                              <Button variant="ghost" size="sm">Szczegóły</Button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clipboard className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Brak aktywnych planów opieki
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {pet.id && (
                    <ResponsiveCareProgramForm
                      petId={pet.id}
                      buttonText="Dodaj plan opieki"
                      buttonSize="sm"
                      onCareProgramSaved={handleCareProgramAdded}
                    />
                  )}
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Ostatnie wizyty</CardTitle>
              </CardHeader>
              <CardContent>
                {visits.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Notatki</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visits.slice(0, 3).map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell className="font-medium">
                            {new Date(visit.date).toLocaleDateString('pl-PL')}
                          </TableCell>
                          <TableCell>{visit.type}</TableCell>
                          <TableCell>{visit.notes ? visit.notes.substring(0, 30) + '...' : '—'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Szczegóły
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Brak wizyt dla tego zwierzęcia
                    </p>
                  </div>
                )}
              </CardContent>
              {visits.length > 0 && (
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("visits")}>
                    Zobacz wszystkie wizyty
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historia wizyt</CardTitle>
                  <CardDescription>
                    Wszystkie wizyty i konsultacje dla {pet.name}
                  </CardDescription>
                </div>
                {pet.id && pet.clientId && (
                  <ResponsiveVisitForm
                    petId={pet.id}
                    clientId={pet.clientId}
                    buttonText="Dodaj wizytę"
                    onVisitSaved={handleVisitAdded}
                  />
                )}
              </CardHeader>
              <CardContent>
                {visits.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Notatki</TableHead>
                        <TableHead>Zalecenia</TableHead>
                        <TableHead>Kontrola</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visits.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell className="font-medium">
                            {new Date(visit.date).toLocaleDateString('pl-PL')}
                          </TableCell>
                          <TableCell>{visit.type}</TableCell>
                          <TableCell>{visit.notes ? visit.notes.substring(0, 20) + '...' : '—'}</TableCell>
                          <TableCell>{visit.recommendations ? visit.recommendations.substring(0, 20) + '...' : '—'}</TableCell>
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
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">Brak wizyt</h3>
                    <p className="text-muted-foreground mt-1">
                      Dla tego zwierzęcia nie ma jeszcze zarejestrowanych wizyt
                    </p>
                    {pet.id && pet.clientId && (
                      <ResponsiveVisitForm
                        petId={pet.id}
                        clientId={pet.clientId}
                        buttonText="Zaplanuj pierwszą wizytę"
                        className="mt-4"
                        onVisitSaved={handleVisitAdded}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="care-plans" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Plany opieki</CardTitle>
                  <CardDescription>
                    Wszystkie plany opieki dla {pet.name}
                  </CardDescription>
                </div>
                {pet.id && (
                  <ResponsiveCareProgramForm
                    petId={pet.id}
                    buttonText="Nowy plan opieki"
                    onCareProgramSaved={handleCareProgramAdded}
                  />
                )}
              </CardHeader>
              <CardContent>
                {carePrograms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carePrograms.map((program) => (
                      <Card key={program.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{program.name}</CardTitle>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              program.status === "aktywny"
                                ? "bg-green-100 text-green-800"
                                : program.status === "zakończony"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {program.status}
                            </span>
                          </div>
                          <CardDescription className="mt-1">
                            {new Date(program.startDate).toLocaleDateString('pl-PL')} 
                            {program.endDate && ` - ${new Date(program.endDate).toLocaleDateString('pl-PL')}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div ref={careProgramRef}>
                            <p className="font-medium text-sm mb-1">Cel:</p>
                            <p className="text-sm mb-4">{program.goal}</p>
                            
                            {program.instructions && (
                              <>
                                <p className="font-medium text-sm mb-1">Instrukcje:</p>
                                <p className="text-sm whitespace-pre-line">{program.instructions}</p>
                              </>
                            )}
                            
                            {program.recommendations && (
                              <>
                                <p className="font-medium text-sm mt-4 mb-1">Zalecenia:</p>
                                <p className="text-sm whitespace-pre-line">{program.recommendations}</p>
                              </>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          {program.id && pet.id && (
                            <ResponsiveCareProgramForm
                              petId={pet.id}
                              buttonText="Edytuj"
                              buttonVariant="outline"
                              buttonSize="sm"
                              defaultValues={program}
                              isEditing={true}
                              onCareProgramSaved={handleCareProgramAdded}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Edytuj
                              </Button>
                            </ResponsiveCareProgramForm>
                          )}
                          <Button variant="outline" size="sm" onClick={() => exportCareProgramToPDF(program)}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Eksportuj PDF
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clipboard className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">Brak planów opieki</h3>
                    <p className="text-muted-foreground mt-1">
                      Dla tego zwierzęcia nie utworzono jeszcze planów opieki
                    </p>
                    {pet.id && (
                      <ResponsiveCareProgramForm
                        petId={pet.id}
                        buttonText="Utwórz pierwszy plan opieki"
                        className="mt-4"
                        onCareProgramSaved={handleCareProgramAdded}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dokumenty</CardTitle>
                <CardDescription>
                  Prześlij dokumenty związane ze zwierzęciem
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pet.id && (
                  <DocumentUpload
                    onUpload={handleDocumentUpload}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notatki</CardTitle>
                <CardDescription>
                  Dodatkowe informacje i uwagi dotyczące {pet.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-lg font-medium">Brak dodatkowych notatek</h3>
                  <p className="text-muted-foreground mt-1">
                    Dodaj notatki dotyczące zachowania, preferencji czy innych ważnych informacji
                  </p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj notatkę
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

export default PetProfile;
