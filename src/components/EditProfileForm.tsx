import { useState } from 'react';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface EditProfileFormProps {
  user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email,
  });
  const [loading, setLoading] = useState(false);
  const { } = useAuth();

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // TODO: Update user profile via API
      // This would typically call your backend API to update the user profile
      console.log('Updating profile:', form);
      // await updateUserProfile(user.id, form);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
