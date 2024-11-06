// settings_context.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from './settings_utils';

interface Settings {
  timezone: string;
  isGreyscale: boolean;
  isHighContrast: boolean;
  isDarkMode: boolean;
  zoomLevel: number;
  lineHeight: number;
  isAudioEnabled: boolean;
  textAlign: string;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saveSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

// Retrieve JWT token from local storage
const token = localStorage.getItem('jwtToken');

// SettingsProvider component to wrap the application
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(loadSettingsFromLocalStorage);

  // Fetch settings from backend if JWT token is available
  useEffect(() => {
    if (token) {
      const fetchSettings = async () => {
        try {
          const response = await axios.get('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSettings(response.data);
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };
      fetchSettings();
    }
  }, []);

  // Save settings to backend or local storage based on token presence
  const saveSettings = async () => {
    if (token) {
      try {
        await axios.post(
          'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings',
          { ...settings },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Settings saved to backend successfully');
      } catch (error) {
        console.error('Error saving settings to backend:', error);
      }
    } else {
      // Save settings to local storage if no token
      saveSettingsToLocalStorage(settings);
      console.log('Settings saved to local storage');
    }
  };

  // Sync settings with local storage on change if no token
  useEffect(() => {
    if (!token) {
      saveSettingsToLocalStorage(settings);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
