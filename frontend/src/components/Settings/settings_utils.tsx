// settings_utils.ts

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
  
  export const LOCAL_STORAGE_KEY = 'userSettings';
  
  // Function to load settings from local storage
  export const loadSettingsFromLocalStorage = (): Settings => {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedSettings
      ? JSON.parse(storedSettings)
      : {
          timezone: '',
          isGreyscale: false,
          isHighContrast: false,
          isDarkMode: false,
          zoomLevel: 1,
          lineHeight: 1.5,
          isAudioEnabled: false,
          textAlign: 'left',
        };
  };
  
  // Save settings to local storage
  export const saveSettingsToLocalStorage = (settings: Settings) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  };
  