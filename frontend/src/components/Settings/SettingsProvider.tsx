// src/components/Settings/SettingsProvider.tsx
import React, { useState, ReactNode } from 'react';
import { Settings, SettingsContext } from './settings_context';
import axios from 'axios';
import { getSession } from '../../utils/cognitoAuth';  // Import the getSession function

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
      const session = await getSession();  // Get the current session
      const userId = session.getIdToken().payload.sub; // Get the user ID from the token payload

      // Prepare the settings payload
      const payload = {
        user_id: userId,  
        is_greyscale: settings.isGreyscale ? 1 : 0,
        is_high_contrast: settings.isHighContrast ? 1 : 0,
        is_dark_mode: settings.isDarkMode ? 1 : 0,
        zoom_level: settings.zoomLevel,
      };

      // Send the settings payload to your API Gateway endpoint
      const response = await axios.post('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings', payload);

      console.log('Settings saved successfully:', response.data);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
