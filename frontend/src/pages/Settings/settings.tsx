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

const timeZones: string[] = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Moscow',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Perth',
  'Australia/Adelaide',
  'Pacific/Auckland',
  'Pacific/Fiji',
  'Pacific/Guam',
  'Africa/Johannesburg',
  'Africa/Cairo',
  'Africa/Nairobi',
  'Atlantic/Reykjavik',
  'Atlantic/Azores',
  'America/Toronto',
  'America/Vancouver',
  'America/Monterrey',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  'America/Santiago',
  'America/Bogota',
  'America/Lima',
  'America/Mexico_City',
  'Asia/Bangkok',
  'Asia/Hong_Kong',
  'Asia/Manila',
  'Asia/Kuala_Lumpur',
  'Asia/Jakarta',
  'Asia/Karachi',
  'Asia/Colombo',
  'Asia/Riyadh',
  'Europe/Istanbul',
  'Europe/Warsaw',
  'Europe/Prague',
  'Europe/Helsinki',
  'Europe/Vienna',
  'Europe/Stockholm',
  'Europe/Zurich',
];

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

  const handleLineHeightChange = (_event: Event, newValue: number | number[]) => {
    setSettings(prev => ({ ...prev, lineHeight: newValue as number }));
  };

  const handleTextAlignChange = (event: SelectChangeEvent<string>) => {
    const newAlign = event.target.value as "center" | "left" | "right";
    setSettings((prev) => ({
      ...prev,
      textAlign: newAlign,
    }));
  };

  const handleSaveSettings = async () => {
    await saveSettings();
  };

  const containerStyle = {
    padding: '20px',
    backgroundColor: settings.isHighContrast ? '#000' : '#fff',
    color: settings.isHighContrast ? '#fff' : '#000',
    minHeight: '100vh',
    lineHeight: settings.lineHeight || 1.5,
    textAlign: settings.textAlign || 'left',
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
        <Typography variant="h6" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
          Settings
        </Typography>

        {/* Greyscale Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>Greyscale Mode</Typography>
          <Switch
            checked={settings.isGreyscale}
            onChange={handleToggleGreyscale}
          />
        </Box>

        {/* High Contrast Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>High Contrast Mode</Typography>
          <Switch
            checked={settings.isHighContrast}
            onChange={handleToggleHighContrast}
          />
        </Box>

        {/* Dark Mode */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>Dark Mode</Typography>
          <Switch
            checked={settings.isDarkMode}
            onChange={handleToggleDarkMode}
          />
        </Box>

        {/* Zoom Level */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>Zoom Level</Typography>
          <Slider
            value={settings.zoomLevel}
            onChange={handleZoomChange}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="zoom-slider"
          />
        </Box>

        {/* Line Height */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>Line Height</Typography>
          <Slider
            value={settings.lineHeight || 1.5}
            onChange={handleLineHeightChange}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="line-height-slider"
          />
        </Box>

        {/* Text Alignment */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>Text Alignment</Typography>
          <Select
            value={settings.textAlign || 'left'}
            onChange={handleTextAlignChange}
            fullWidth
          >
            <MenuItem value="left">Left</MenuItem>
            <MenuItem value="center">Center</MenuItem>
            <MenuItem value="right">Right</MenuItem>
          </Select>
        </Box>

        {/* Timezone */}
        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>Timezone</Typography>
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
