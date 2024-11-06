import React from 'react';
import { Box, Typography, Switch, Button, Slider } from '@mui/material';
import { useSettings } from '../../components/Settings/settings_context';

const Settings: React.FC = () => {
    const { settings, setSettings, saveSettings } = useSettings();

    const handleToggleGreyscale = () => {
      setSettings((prev) => ({ ...prev, isGreyscale: !prev.isGreyscale }));
    };

    const handleToggleHighContrast = () => {
      setSettings((prev) => ({ ...prev, isHighContrast: !prev.isHighContrast }));
    };

    const handleToggleDarkMode = () => {
      setSettings((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
    };

    // Include `event` parameter but ignore it
    const handleZoomChange = (_event: Event, newValue: number | number[]) => {
      setSettings((prev) => ({ ...prev, zoomLevel: newValue as number }));
    };    

    const handleSaveSettings = async () => {
      await saveSettings();
    };

    const containerStyle = {
      padding: '20px',
      backgroundColor: settings.isHighContrast ? '#000' : '#fff',
      color: settings.isHighContrast ? '#fff' : '#000',
      minHeight: '100vh',
    };

    const buttonStyle = {
      backgroundColor: settings.isHighContrast ? '#fff' : undefined,
      color: settings.isHighContrast ? '#000' : undefined,
      marginTop: '20px',
    };

    return (
      <Box sx={containerStyle}>
        <Typography variant="h6">Settings</Typography>

        {/* Greyscale Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>Greyscale Mode</Typography>
          <Switch checked={settings.isGreyscale} onChange={handleToggleGreyscale} />
        </Box>

        {/* High Contrast Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>High Contrast Mode</Typography>
          <Switch checked={settings.isHighContrast} onChange={handleToggleHighContrast} />
        </Box>

        {/* Dark Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>Dark Mode</Typography>
          <Switch checked={settings.isDarkMode} onChange={handleToggleDarkMode} />
        </Box>

        {/* Zoom Level */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>Zoom Level</Typography>
          <Slider
            value={settings.zoomLevel}
            onChange={handleZoomChange}
            min={1}
            max={2}
            step={0.1}
            aria-labelledby="zoom-slider"
          />
        </Box>

        {/* Save Settings Button */}
        <Button variant="contained" onClick={handleSaveSettings} sx={buttonStyle}>
          Save Settings
        </Button>
      </Box>
    );
};

export default Settings;

