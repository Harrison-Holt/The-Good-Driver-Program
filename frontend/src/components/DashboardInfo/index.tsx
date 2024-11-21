import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import SponsorCatalog from '../Catalog/Sponsor_Catalog';
import DriverCatalog from '../Catalog/Driver_Catalog';
import Cart from '../Catalog/Cart';
import SearchBar from '../../components/SearchBar';
import Applications from '../Applications';
import PointChange from '../PointChange.tsx';
import Settings from '../../pages/Settings/settings';
import Profile from '../Profile';
import PointHistory from '../PointHistory';
import DriverManagement from '../DriverManagement';
import { useSettings } from '../../components/Settings/settings_context';
import { selectUserName, selectUserType } from '../../store/userSlice';
import FAQ from '../FAQ';

interface Props {
  currentDisplay: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const username = useAppSelector(selectUserName);
  const userType = useAppSelector(selectUserType); // Get user type from Redux

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
    lineHeight: settings.lineHeight || 1.5,
    textAlign: settings.textAlign || 'left',
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
    case 'search':
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Search
          </Typography>
          <SearchBar setSearchTerm={setSearchTerm} label="search" options={[]} />
        </Paper>
      );
      break;

    case 'cart':
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Your Cart
          </Typography>
          <Cart />
        </Paper>
      );
      break;

    case 'catalog':
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Catalog
          </Typography>
          {userType === 'sponsor' ? (
            <SponsorCatalog /> // Render Sponsor Catalog if user is a sponsor
          ) : (
            <DriverCatalog /> // Render Driver Catalog if user is a driver
          )}
        </Paper>
      );
      break;

    case 'applications':
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Applications
          </Typography>
          <Applications />
        </Paper>
      );
      break;

    case "driverManagement":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>Driver Management</Typography>
          <DriverManagement />
        </Paper>
      );
    break;

    case 'pointChange':
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Point Change
          </Typography>
          <PointChange />
        </Paper>
      );
    break;

    case 'pointHistory':
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Point History
          </Typography>
          {username && <PointHistory driverUsername={username} />}
        </Paper>
      );
      break;

    case 'profile':
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Profile
          </Typography>
          <Profile />
        </Paper>
      );
      break;

    case "faq":
      dashJsx = (
        <Paper sx={paperStyles}>
          <FAQ />
        </Paper>
      );
      break;

    case "settings":
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Settings
          </Typography>
          <Settings />
        </Paper>
      );
      break;

    default:
      dashJsx = (
        <Paper sx={paperStyles}>
          <Typography variant="h6" sx={textStyle}>
            Home
          </Typography>
        </Paper>
      );
      break;
  }

  return <Box sx={containerStyles}>{dashJsx}</Box>;
};

export default DashboardInfo;
