import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrdersList } from '@/components/OrdersList';
import { Wishlist } from '@/components/Wishlist';
import { EditProfileForm } from '@/components/EditProfileForm';

export function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-16">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="w-24 h-24">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} />
          ) : (
            <span className="font-bold text-2xl">{user.name.charAt(0)}</span>
          )}
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <Button variant="outline" className="mt-2" onClick={() => {/* Open edit modal */}}>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <OrdersList userId={user.id} />
        </TabsContent>
        <TabsContent value="wishlist">
          <Wishlist userId={user.id} />
        </TabsContent>
        <TabsContent value="settings">
          <EditProfileForm user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
