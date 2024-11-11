import React, { useState, ReactNode, useEffect } from 'react';
import { Settings, SettingsContext } from './settings_context';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import { selectUserName } from '../../store/userSlice';
import { Snackbar, Alert } from '@mui/material';

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
  lineHeight: 1.5,
  textAlign: 'left',
  audioFeedback: false,
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const username = useAppSelector(selectUserName);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success'); // Snackbar severity

  // Effect to load settings from local storage
  useEffect(() => {
    const localStorageSettings = localStorage.getItem('userSettings');
    if (localStorageSettings) {
      setSettings(JSON.parse(localStorageSettings));
    }
  }, []);

  const saveSettings = async () => {
    try {
      console.log('Settings to save:', {
        username,
        timezone: settings.timezone,
        isGreyscale: settings.isGreyscale ? 1 : 0,
        isHighContrast: settings.isHighContrast ? 1 : 0,
        isDarkMode: settings.isDarkMode ? 1 : 0,
        zoomLevel: settings.zoomLevel,
        lineHeight: settings.lineHeight,
        isAudioEnabled: settings.audioFeedback ? 1 : 0,
        textAlign: settings.textAlign,
      });

      const response = await axios.post(
        'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings',
        {
          username,
          timezone: settings.timezone,
          isGreyscale: settings.isGreyscale ? 1 : 0,
          isHighContrast: settings.isHighContrast ? 1 : 0,
          isDarkMode: settings.isDarkMode ? 1 : 0,
          zoomLevel: settings.zoomLevel,
          lineHeight: settings.lineHeight,
          isAudioEnabled: settings.audioFeedback ? 1 : 0,
          textAlign: settings.textAlign,
        }
      );
      console.log('Settings saved successfully:', response.data);
      setSnackbarMessage('Settings saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true); // Open success message
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSnackbarMessage('Failed to save settings. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Open error message

      // Save settings to localStorage as a fallback
      const localStorageSettings = {
        ...settings,
      };
      localStorage.setItem('userSettings', JSON.stringify(localStorageSettings));
      console.log('Settings saved to local storage:', localStorageSettings);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SettingsContext.Provider>
  );
};
