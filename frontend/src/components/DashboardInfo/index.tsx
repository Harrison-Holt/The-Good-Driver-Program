import React from 'react';
import { Box, Typography } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart'; // Assuming Cart is imported here

interface Props {
  currentDisplay: string;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay }) => {
  let dashJsx;

  switch (currentDisplay) {
    case "search":
      dashJsx = (
        <>
          <Typography variant="h6">Search</Typography>
          {/* Search functionality could be added here */}
        </>
      );
      break;

    case "cart":
      dashJsx = (
        <>
          <Typography variant="h6">Your Cart</Typography>
          <Cart /> {/* Render the Cart component */}
        </>
      );
      break;

    case "catalog":
      dashJsx = (
        <>
          <Typography variant="h6">Catalog</Typography>
          <Catalog /> {/* Render the Catalog component */}
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
    <Box sx={{ width: '80%', padding: '20px' }}>
      {dashJsx}
    </Box>
  );
};

export default DashboardInfo;
