import React, { useState, ReactNode, useEffect } from 'react';
import { Settings, SettingsContext } from './settings_context';
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Effect to fetch settings from the database when the user logs in
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings?username=${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        console.log('Fetched settings from DB:', data);

        if (data) {
          const dbSettings = {
            isGreyscale: data.is_greyscale === 1,
            isHighContrast: data.is_high_contrast === 1,
            isDarkMode: data.is_dark_mode === 1,
            zoomLevel: parseFloat(data.zoom_level),
            timezone: data.timezone,
            lineHeight: parseFloat(data.line_height),
            textAlign: data.text_align,
            audioFeedback: data.is_audio_enabled === 1,
          };
          setSettings(dbSettings); // Apply settings from the database
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setSnackbarMessage('Failed to load user settings. Using defaults.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchSettings();
  }, [username]);

  // Effect to apply the fetched settings to the UI
  useEffect(() => {
    console.log('Applying settings:', settings);

    // Apply Greyscale Mode
    if (settings.isGreyscale) {
      document.body.style.filter = 'grayscale(100%)';
    } else {
      document.body.style.filter = 'none';
    }

    // Apply High Contrast Mode
    if (settings.isHighContrast) {
      document.body.style.backgroundColor = '#000';
      document.body.style.color = '#FFF';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }

    // Apply Dark Mode
    if (settings.isDarkMode) {
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#FFF';
    }

    // Apply Zoom Level
    document.body.style.zoom = settings.zoomLevel.toString();

    // Apply Line Height
    document.body.style.lineHeight = settings.lineHeight.toString();

    // Apply Text Alignment
    document.body.style.textAlign = settings.textAlign;
  }, [settings]); // Re-run this effect whenever settings change

  const saveSettings = async () => {
    const updatedSettings = {
      ...(settings.isGreyscale !== undefined && { isGreyscale: settings.isGreyscale ? 1 : 0 }),
      ...(settings.isHighContrast !== undefined && { isHighContrast: settings.isHighContrast ? 1 : 0 }),
      ...(settings.isDarkMode !== undefined && { isDarkMode: settings.isDarkMode ? 1 : 0 }),
      ...(settings.zoomLevel !== undefined && { zoomLevel: settings.zoomLevel }),
      ...(settings.lineHeight !== undefined && { lineHeight: settings.lineHeight }),
      ...(settings.textAlign !== undefined && { textAlign: settings.textAlign }),
      ...(settings.audioFeedback !== undefined && { isAudioEnabled: settings.audioFeedback ? 1 : 0 }),
      ...(settings.timezone !== undefined && { timezone: settings.timezone }),
    };

    console.log('Settings to save (PATCH):', updatedSettings);

    try {
      const response = await fetch(
        'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username, // Include username
            ...updatedSettings,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      console.log('Settings saved successfully!');
      setSnackbarMessage('Settings saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSnackbarMessage('Failed to save settings. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
