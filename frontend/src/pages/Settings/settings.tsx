import React from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  Slider,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useSettings } from '../../components/Settings/settings_context';
import Navibar from '../../components/Navibar';
import moment from 'moment-timezone';

// Comprehensive list of time zones
const timeZones: string[] = moment.tz.names();

const Settings: React.FC = () => {
  const { settings, setSettings, saveSettings } = useSettings();

  const handleTimezoneChange = (event: SelectChangeEvent<string>) => {
    setSettings(prev => ({ ...prev, timezone: event.target.value }));
  };

  const handleToggleGreyscale = () => {
    setSettings(prev => ({ ...prev, isGreyscale: !prev.isGreyscale }));
  };

  const handleToggleHighContrast = () => {
    setSettings(prev => ({ ...prev, isHighContrast: !prev.isHighContrast }));
  };

  const handleToggleDarkMode = () => {
    setSettings(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    setSettings(prev => ({ ...prev, zoomLevel: newValue as number }));
  };

  const handleTextHeightChange = (_event: Event, newValue: number | number[]) => {
    setSettings(prev => ({ ...prev, textHeight: newValue as number }));
  };

  const handleSaveSettings = async () => {
    await saveSettings();
  };

  const containerStyle = {
    padding: '20px',
    backgroundColor: settings.isHighContrast ? '#000' : '#fff',
    color: settings.isHighContrast ? '#fff' : '#000',
    minHeight: '100vh',
    lineHeight: settings.textHeight || 1.5, // Apply user-selected text height
  };

  const buttonStyle = {
    backgroundColor: settings.isHighContrast ? '#fff' : undefined,
    color: settings.isHighContrast ? '#000' : undefined,
    marginTop: '20px',
  };

  return (
    <div>
      <Navibar />
      <Box sx={containerStyle}>
        <Typography variant="h6">Settings</Typography>

        {/* Greyscale Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>Greyscale Mode</Typography>
          <Switch
            checked={settings.isGreyscale}
            onChange={handleToggleGreyscale}
          />
        </Box>

        {/* High Contrast Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>High Contrast Mode</Typography>
          <Switch
            checked={settings.isHighContrast}
            onChange={handleToggleHighContrast}
          />
        </Box>

        {/* Dark Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>Dark Mode</Typography>
          <Switch
            checked={settings.isDarkMode}
            onChange={handleToggleDarkMode}
          />
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

        {/* Text Height */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>Text Height</Typography>
          <Slider
            value={settings.textHeight || 1.5}
            onChange={handleTextHeightChange}
            min={1}
            max={2}
            step={0.1}
            aria-labelledby="text-height-slider"
          />
        </Box>

        {/* Timezone */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography>Timezone</Typography>
          <Select
            value={settings.timezone || 'UTC'}
            onChange={handleTimezoneChange}
            fullWidth
          >
            {timeZones.map((zone: string) => (
              <MenuItem key={zone} value={zone}>
                {zone}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Save Settings Button */}
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          sx={buttonStyle}
        >
          Save Settings
        </Button>
      </Box>
    </div>
  );
};

export default Settings;
