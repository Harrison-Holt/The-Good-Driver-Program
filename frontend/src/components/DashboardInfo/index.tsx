import React from 'react';
import { useAppSelector } from '../../store/hooks';
import Applications from '../Applications';
import SearchBar from '../../components/SearchBar';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart';
import PointChange from '../PointChange.tsx';
import Settings from '../../pages/Settings/settings.tsx';
import Profile from '../Profile';
import PointHistory from '../PointHistory';
import { useSettings } from '../../components/Settings/settings_context';
import { selectUserName } from '../../store/userSlice';

interface Props {
  currentDisplay: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const username = useAppSelector(selectUserName);

  // Main container styles
  const containerStyles = {
    width: '80%',
    padding: '20px',
    backgroundColor: settings.isHighContrast ? '#000' : theme.palette.background.default,
    color: settings.isHighContrast ? '#FFF' : theme.palette.text.primary,
    filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
    transform: `scale(${settings.zoomLevel})`,
    transformOrigin: 'top left',
    minHeight: '100vh',
    overflow: 'auto',
    transition: 'all 0.3s ease',
    lineHeight: settings.textHeight || 1.5
  };

  // Paper component styles
  const paperStyles = {
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: settings.isHighContrast ? '#333' : theme.palette.background.paper,
    color: settings.isHighContrast ? '#FFF' : theme.palette.text.primary,
    borderRadius: '10px',
    boxShadow: theme.shadows[3],
  };

  const textStyle = {
    color: settings.isHighContrast ? '#FFF' : theme.palette.text.primary,
    marginBottom: '10px',
  };

  let dashJsx;

  switch (currentDisplay) {
    case "search":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Search</Typography>
          <SearchBar setSearchTerm={setSearchTerm} label="search" options={[]} />
        </Paper>
      );
      break;

    case "cart":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Your Cart</Typography>
          <Cart />
        </Paper>
      );
      break;

    case "catalog":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Catalog</Typography>
          <Catalog />
        </Paper>
      );
      break;

    case "applications":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Applications</Typography>
          <Applications />
        </Paper>
      );
      break;

    case "pointChange":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Point Change</Typography>
          <PointChange />
        </Paper>
      );
      break;

    case "pointHistory":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Point History</Typography>
          {username && <PointHistory driverUsername={username} />}
        </Paper>
      );
      break;

    case "profile":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Profile</Typography>
          <Profile />
        </Paper>
      );
      break;

    case "settings":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Settings</Typography>
          <Settings />
        </Paper>
      );
      break;

    default:
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Home</Typography>
        </Paper>
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
