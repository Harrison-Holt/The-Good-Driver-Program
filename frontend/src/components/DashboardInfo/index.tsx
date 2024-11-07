import React from 'react';
import Applications from '../Applications';
import SearchBar from '../../components/SearchBar';
import { Box, Typography, useTheme } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart';
import PointChange from '../PointChange.tsx';
import Settings from '../../pages/Settings/settings.tsx';
import { useSettings } from '../../components/Settings/settings_context';

interface Props {
  currentDisplay: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
  const theme = useTheme();  // Access MUI theme
  const { settings } = useSettings();  // Access custom settings for modes

  // Define styles based on settings and theme
  const containerStyles = {
    width: '80%',
    padding: '20px',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
    transform: `scale(${settings.zoomLevel})`,  // Apply zoom level from settings
    transformOrigin: 'top left',
    minHeight: '100vh',
    transition: 'all 0.3s ease',  // Smooth transition for theme changes
  };

  const textStyle = {
    color: theme.palette.text.primary,
    marginBottom: '10px',
  };

  let dashJsx;

  switch (currentDisplay) {
    case "search":
      dashJsx = (
        <>
          <Typography variant="h6" sx={textStyle}>Search</Typography>
          <SearchBar setSearchTerm={setSearchTerm} label="search" options={[]} />
        </>
      );
      break;

    case "cart":
      dashJsx = (
        <>
          <Typography variant="h6" sx={textStyle}>Your Cart</Typography>
          <Cart />
        </>
      );
      break;

    case "catalog":
      dashJsx = (
        <>
          <Typography variant="h6" sx={textStyle}>Catalog</Typography>
          <Catalog />
        </>
      );
      break;

    case "applications":
      dashJsx = (
        <>
          <Typography variant="h6" sx={textStyle}>Applications</Typography>
          <Applications />
        </>
      );
      break;

    case "pointChange":
      dashJsx = (
        <>
          <Typography variant="h6" sx={textStyle}>Point Change</Typography>
          <PointChange />
        </>
      );
      break;

    case "settings":
      dashJsx = (
        <>
          <Typography variant="h6" sx={textStyle}>Settings</Typography>
          <Settings />
        </>
      );
      break;

    default:
      dashJsx = (
        <>
          <Typography variant="h6" sx={textStyle}>Home</Typography>
        </>
      );
      break;
  }

  return (
    <Box sx={containerStyles}>
      {dashJsx}
    </Box>
  );
};

export default DashboardInfo;

