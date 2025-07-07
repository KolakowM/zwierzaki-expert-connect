
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ShoppingCart, Package, Users, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import { 
  getActiveAddons, 
  getUserAddons, 
  purchaseAddon, 
  updateAddonQuantity,
  cancelAddon 
} from "@/services/addonService";
import AddonCard from "./AddonCard";
import UserAddonCard from "./UserAddonCard";

const AddonManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [purchasingAddonId, setPurchasingAddonId] = useState<string | null>(null);
  const [updatingAddonId, setUpdatingAddonId] = useState<string | null>(null);

  // Fetch available add-ons
  const { 
    data: availableAddons = [], 
    isLoading: isLoadingAddons,
    error: addonsError 
  } = useQuery({
    queryKey: ['available-addons'],
    queryFn: getActiveAddons,
  });

  // Fetch user's purchased add-ons
  const { 
    data: userAddons = [], 
    isLoading: isLoadingUserAddons,
    error: userAddonsError 
  } = useQuery({
    queryKey: ['user-addons', user?.id],
    queryFn: () => user?.id ? getUserAddons(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  // Purchase add-on mutation
  const purchaseAddonMutation = useMutation({
    mutationFn: ({ addonId, quantity }: { addonId: string; quantity: number }) => 
      purchaseAddon(addonId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addons'] });
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      toast({
        title: "Dodatek zakupiony pomyślnie",
        description: "Twoje limity zostały zwiększone.",
      });
    },
    onError: (error) => {
      console.error('Error purchasing addon:', error);
      toast({
        title: "Błąd zakupu",
        description: "Nie udało się zakupić dodatku. Spróbuj ponownie.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setPurchasingAddonId(null);
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ userAddonId, newQuantity }: { userAddonId: string; newQuantity: number }) => 
      updateAddonQuantity(userAddonId, newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addons'] });
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      toast({
        title: "Ilość zaktualizowana",
        description: "Twoje limity zostały odpowiednio dostosowane.",
      });
    },
    onError: (error) => {
      console.error('Error updating addon quantity:', error);
      toast({
        title: "Błąd aktualizacji",
        description: "Nie udało się zaktualizować ilości. Spróbuj ponownie.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUpdatingAddonId(null);
    },
  });

  // Cancel add-on mutation
  const cancelAddonMutation = useMutation({
    mutationFn: (userAddonId: string) => cancelAddon(userAddonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addons'] });
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      toast({
        title: "Dodatek anulowany",
        description: "Dodatek został anulowany i nie będzie już naliczany.",
      });
    },
    onError: (error) => {
      console.error('Error cancelling addon:', error);
      toast({
        title: "Błąd anulowania",
        description: "Nie udało się anulować dodatku. Spróbuj ponownie.",
        variant: "destructive",
      });
    },
  });

  const handlePurchaseAddon = (addon: any) => {
    setPurchasingAddonId(addon.id);
    purchaseAddonMutation.mutate({ addonId: addon.id, quantity: 1 });
  };

  const handleUpdateQuantity = (userAddonId: string, newQuantity: number) => {
    setUpdatingAddonId(userAddonId);
    updateQuantityMutation.mutate({ userAddonId, newQuantity });
  };

  const handleCancelAddon = (userAddonId: string) => {
    cancelAddonMutation.mutate(userAddonId);
  };

  if (addonsError || userAddonsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Wystąpił błąd podczas ładowania dodatków. Spróbuj odświeżyć stronę.
        </AlertDescription>
      </Alert>
    );
  }

  const clientAddons = availableAddons.filter(addon => addon.addon_type === 'clients');
  const petAddons = availableAddons.filter(addon => addon.addon_type === 'pets');

  const userClientAddons = userAddons.filter(ua => ua.addon?.addon_type === 'clients');
  const userPetAddons = userAddons.filter(ua => ua.addon?.addon_type === 'pets');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Zarządzanie dodatkami</h2>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Dodatki pozwalają na zwiększenie limitów klientów i zwierząt w ramach Twojego obecnego planu. 
          Opłaty za dodatki są naliczane miesięcznie.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Dostępne dodatki
          </TabsTrigger>
          <TabsTrigger value="purchased" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Moje dodatki ({userAddons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {isLoadingAddons ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Ładowanie dodatków...</span>
            </div>
          ) : (
            <>
              {/* Client Add-ons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Dodatki dla klientów
                  </CardTitle>
                  <CardDescription>
                    Zwiększ limit klientów w ramach swojego planu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clientAddons.map((addon) => (
                      <AddonCard
                        key={addon.id}
                        addon={addon}
                        onPurchase={handlePurchaseAddon}
                        isPurchasing={purchasingAddonId === addon.id}
                      />
                    ))}
                  </div>
                  {clientAddons.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Brak dostępnych dodatków dla klientów
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Pet Add-ons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Dodatki dla zwierząt
                  </CardTitle>
                  <CardDescription>
                    Zwiększ limit zwierząt w ramach swojego planu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {petAddons.map((addon) => (
                      <AddonCard
                        key={addon.id}
                        addon={addon}
                        onPurchase={handlePurchaseAddon}
                        isPurchasing={purchasingAddonId === addon.id}
                      />
                    ))}
                  </div>
                  {petAddons.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Brak dostępnych dodatków dla zwierząt
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="purchased" className="space-y-6">
          {isLoadingUserAddons ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Ładowanie Twoich dodatków...</span>
            </div>
          ) : (
            <>
              {userAddons.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Nie masz jeszcze żadnych dodatków. Przejdź do zakładki "Dostępne dodatki", aby je zakupić.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* User's Client Add-ons */}
                  {userClientAddons.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Moje dodatki dla klientów
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userClientAddons.map((userAddon) => (
                            <UserAddonCard
                              key={userAddon.id}
                              userAddon={userAddon}
                              onUpdateQuantity={handleUpdateQuantity}
                              onCancel={handleCancelAddon}
                              isUpdating={updatingAddonId === userAddon.id}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* User's Pet Add-ons */}
                  {userPetAddons.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Moje dodatki dla zwierząt
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userPetAddons.map((userAddon) => (
                            <UserAddonCard
                              key={userAddon.id}
                              userAddon={userAddon}
                              onUpdateQuantity={handleUpdateQuantity}
                              onCancel={handleCancelAddon}
                              isUpdating={updatingAddonId === userAddon.id}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddonManagement;
