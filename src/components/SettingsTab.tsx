import React from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";

export function SettingsTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Appearance</h3>
        <DarkModeToggle />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Language</h3>
        <LanguageSelector />
      </div>
      {/* Other settings */}
    </div>
  );
}
