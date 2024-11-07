// src/components/Settings/SettingsProvider.tsx
import React, { useState, ReactNode } from 'react';
import { Settings, SettingsContext } from './settings_context';
import axios from 'axios';

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
    try {
      const userId = 'exampleUserId'; // Get the user ID from your authentication context or store

      const response = await axios.post('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings', {
        user_id: userId,
        is_greyscale: settings.isGreyscale ? 1 : 0,
        is_high_contrast: settings.isHighContrast ? 1 : 0,
        is_dark_mode: settings.isDarkMode ? 1 : 0,
        zoom_level: settings.zoomLevel,
      });

      console.log('Settings saved successfully', response.data);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
