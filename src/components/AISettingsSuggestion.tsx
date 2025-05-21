import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function AISettingsSuggestion() {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState<string>('');

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const response = await fetch('/api/ai/setting-suggestion', {
          method: 'POST',
          body: JSON.stringify({ userId: user?.id }),
        });
        const data = await response.json();
        setSuggestion(data.suggestion);
      } catch (error) {
        // Handle error
      }
    };
    fetchSuggestion();
  }, [user?.id]);

  if (!suggestion) return null;

  return (
    <div className="p-4 bg-muted rounded-lg">
      <p>{suggestion}</p>
      <Button variant="link" onClick={() => {/* Apply suggested settings */}}>
        Apply Settings
      </Button>
    </div>
  );
}
