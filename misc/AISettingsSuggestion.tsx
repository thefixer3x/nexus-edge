import React from 'react';
import { Card } from '@/components/ui/card';

export function AISettingsSuggestion() {
  return (
    <div className="mb-6">
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium">AI Settings Suggestions</h3>
          <p className="text-sm text-gray-500">
            Feature coming soon - AI will analyze your usage and suggest optimal settings
          </p>
        </div>
      </Card>
    </div>
  );
}
