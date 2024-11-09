import React, { useState, ReactNode, useEffect } from 'react';
import { Settings, SettingsContext } from './settings_context';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import { selectUserName } from '../../store/userSlice';

interface SettingsProviderProps {
  children: ReactNode;
}

// Default settings configuration
const defaultSettings: Settings = {
  isGreyscale: false,
  isHighContrast: false,
  isDarkMode: false,
  zoomLevel: 1,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  lineHeight: 1.5, // Default value for textHeight
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const username = useAppSelector(selectUserName);

  // Effect to load settings from local storage
  useEffect(() => {
    const localStorageSettings = localStorage.getItem('userSettings');
    if (localStorageSettings) {
      setSettings(JSON.parse(localStorageSettings));
    }
  }, []);

  const saveSettings = async () => {
    try {
      // Prepare the settings payload
      const payload = {
        username: username, // Use username instead of user ID
        is_greyscale: settings.isGreyscale ? 1 : 0,
        is_high_contrast: settings.isHighContrast ? 1 : 0,
        is_dark_mode: settings.isDarkMode ? 1 : 0,
        zoom_level: settings.zoomLevel,
        text_height: settings.lineHeight, // Include textHeight in the payload
      };

      // Log the payload to see the contents
      console.log('Payload to save:', payload);

      // Send the settings payload to your API Gateway endpoint
      const response = await axios.post(
        'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings',
        payload
      );

      console.log('Settings saved successfully:', response.data);
    } catch (error) {
      console.error('Failed to save settings:', error);

      // If user is not signed in, store settings in local storage
      const localStorageSettings = {
        ...settings, // Spread existing settings
      };

      // Save settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(localStorageSettings));
      console.log('Settings saved to local storage:', localStorageSettings);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
