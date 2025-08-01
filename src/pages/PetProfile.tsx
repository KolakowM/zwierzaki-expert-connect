import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
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
  FileText,
  Clipboard,
  Edit,
  Plus,
  Eye,
  Microchip
} from "lucide-react";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import ResponsiveVisitForm from "@/components/visits/ResponsiveVisitForm";
import ResponsiveCareProgramForm from "@/components/care-programs/ResponsiveCareProgramForm";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import CareProgramDetailsDialog from "@/components/care-programs/CareProgramDetailsDialog";
import VisitDetailsDialog from "@/components/visits/VisitDetailsDialog";
import { usePetProfile } from "@/hooks/use-pet-profile";
import PetProfileLoader from "@/components/pets/PetProfileLoader";
import PetNotFound from "@/components/pets/PetNotFound";
import PetNotes from "@/components/pets/PetNotes";
import { getFormattedPetAge } from '@/utils/petAgeUtils';

const PetProfile = () => {
  const {
    pet,
    owner,
    visits,
    carePrograms,
    isLoading,
    activeTab,
    setActiveTab,
    handlePetUpdated,
    handleVisitAdded,
    handleVisitUpdated,
    handleCareProgramAdded,
    handleDeletePet
  } = usePetProfile();

  if (isLoading) {
    return <PetProfileLoader />;
  }

  if (!pet) {
    return <PetNotFound />;
  }

  const petAge = pet.dateOfBirth ? getFormattedPetAge(pet.dateOfBirth) : "Nieznany";
  const petWeight = pet.weight ? `${pet.weight} kg` : "Nieznana";

  const totalVisits = visits.length;
  const totalCarePrograms = carePrograms.length;
  
  let deleteWarning = '';

  if (totalVisits > 0 || totalCarePrograms > 0) {
    deleteWarning = `Wraz ze zwierzęciem zostaną również usunięte:
    ${totalVisits > 0 ? `\n- ${totalVisits} wizyt` : ''}
    ${totalCarePrograms > 0 ? `\n- ${totalCarePrograms} programów opieki` : ''}`;
  }

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
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Mikrochip</p>
                  <div className="flex items-center">
                    {pet.hasMicrochip ? (
                      <>
                        <Microchip className="h-4 w-4 mr-2 text-green-600" />
                        <p className="font-medium">{pet.microchipNumber || "Tak (brak numeru)"}</p>
                      </>
                    ) : (
                      <p className="font-medium">Nie</p>
                    )}
                  </div>
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
                  <p className="text-sm font-semibold">Alergie:</p>
                  <p className="text-sm">{pet.allergies}</p>
                </div>
              )}
              {pet.vaccinationDescription && (
                <div className="mt-4">
                  <p className="text-sm font-semibold">Historia szczepień:</p>
                  <p className="text-sm">{pet.vaccinationDescription}</p>
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
                      <h4 className="font-semibold mb-1">Ograniczenia dietetyczne:</h4>
                      <p>{pet.dietaryRestrictions}</p>
                    </div>
                  )}
                  
                  {pet.behavioralNotes && (
                    <div>
                      <h4 className="font-semibold mb-1">Notatki behawioralne:</h4>
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
                              <CareProgramDetailsDialog programId={program.id}>
                                <Button variant="ghost" size="sm">Szczegóły</Button>
                              </CareProgramDetailsDialog>
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
                            <VisitDetailsDialog
                              visit={visit}
                              petId={pet.id}
                              clientId={pet.clientId}
                              onVisitUpdated={handleVisitUpdated}
                            />
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
                            <VisitDetailsDialog
                              visit={visit}
                              petId={pet.id}
                              clientId={pet.clientId}
                              onVisitUpdated={handleVisitUpdated}
                            />
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
                          <p className="font-medium text-sm mb-1">Cel:</p>
                          <p className="text-sm mb-4">{program.goal}</p>
                          
                          {program.instructions && (
                            <>
                              <p className="font-medium text-sm mb-1">Instrukcje:</p>
                              <p className="text-sm whitespace-pre-line">{program.instructions}</p>
                            </>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <ResponsiveCareProgramForm
                            petId={program.petId}
                            isEditing={true}
                            defaultValues={program}
                            onCareProgramSaved={handleCareProgramAdded}
                            buttonVariant="outline"
                            buttonSize="sm"
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Edytuj
                            </Button>
                          </ResponsiveCareProgramForm>

                          <CareProgramDetailsDialog programId={program.id}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Szczegóły
                            </Button>
                          </CareProgramDetailsDialog>
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
          
          <TabsContent value="notes" className="space-y-4">
            <PetNotes pet={pet} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PetProfile;
