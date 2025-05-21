import { useState } from 'react';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditProfileFormProps {
  user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    // Other fields like address, phone, etc.
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Update user profile in Firebase or your API
      // If using Firebase:
      await user.updateProfile({ displayName: form.name });
      await user.updateEmail(form.email);
      // Update local user state if needed
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4">
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {/* Other fields */}
      <Button onClick={handleUpdateProfile} disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
