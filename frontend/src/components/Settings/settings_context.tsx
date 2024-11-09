/* eslint-disable react-refresh/only-export-components */
// src/components/Settings/settings_context.ts
import { createContext, useContext } from 'react';

export interface Settings {
  timezone: string;
  isGreyscale: boolean;
  isHighContrast: boolean;
  isDarkMode: boolean;
  zoomLevel: number;
  lineHeight: number;
  textAlign: "center" | "left" | "right"; 
}


export interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  saveSettings: () => Promise<void>;
}

// Context creation
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Custom hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

