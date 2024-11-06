// src/components/Settings/SettingsProvider.tsx
import React, { useState, ReactNode } from 'react';
import { Settings, SettingsContext } from './settings_context';

interface SettingsProviderProps {
  children: ReactNode;
}

// Default settings configuration
const defaultSettings: Settings = {
  isGreyscale: false,
  isHighContrast: false,
  isDarkMode: false,
  zoomLevel: 1,
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const saveSettings = async () => {
    // Add save logic if needed
    console.log('Settings saved');
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
