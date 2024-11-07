import React from 'react';
import Applications from '../Applications';
import SearchBar from '../../components/SearchBar';
import { Box, Typography, useTheme } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart';
import PointChange from '../PointChange.tsx';
import Settings from '../../pages/Settings/settings.tsx';
import { useSettings } from '../../components/Settings/settings_context'; // Import the settings context

interface Props {
  currentDisplay: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
  const { settings } = useSettings(); // Use the settings context
  const theme = useTheme();

  // Define conditional styles based on settings
  const containerStyles = {
    width: '80%',
    padding: '20px',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
    transform: `scale(${settings.zoomLevel})`,
    transformOrigin: 'top left',
    minHeight: '100vh',
    transition: 'all 0.3s ease',
  };

  let dashJsx;

  switch (currentDisplay) {
    case "search":
      dashJsx = (
        <>
          <Typography variant="h6">Search</Typography>
          <SearchBar setSearchTerm={setSearchTerm} label="search" options={[]} />
        </>
      );
      break;

    case "cart":
      dashJsx = (
        <>
          <Typography variant="h6">Your Cart</Typography>
          <Cart cartItems={[]} total={0} userPoints={null} userEmail={''} setUserEmail={function (): void {
            throw new Error('Function not implemented.');
          } } handleCheckout={function (): void {
            throw new Error('Function not implemented.');
          } } showConfirmationDialog={false} setShowConfirmationDialog={function (): void {
            throw new Error('Function not implemented.');
          } } confirmCheckout={function (): void {
            throw new Error('Function not implemented.');
          } } errorMessage={null} checkoutSuccess={false} insufficientPoints={false} />
        </>
      );
      break;

    case "catalog":
      dashJsx = (
        <>
          <Typography variant="h6">Catalog</Typography>
          <Catalog />
        </>
      );
      break;

    case "applications":
      dashJsx = (
        <>
          <Typography variant="h6">Applications</Typography>
          <Applications />
        </>
      );
      break;

    case "pointChange":
      dashJsx = (
        <>
          <Typography variant="h6">Point Change</Typography>
          <PointChange />
        </>
      );
      break;

    case "settings":
      dashJsx = (
        <>
          <Typography variant="h6">Settings</Typography>
          <Settings />
        </>
      );
      break;

    default:
      dashJsx = (
        <>
          <Typography variant="h6">Home</Typography>
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
