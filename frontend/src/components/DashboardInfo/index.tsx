import React from 'react';
import { Box, Typography } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart'; // Assuming Cart is imported here

interface ItunesItem {
  trackId?: string;
  collectionId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
}

interface Props {
  currentDisplay: string;
  cartItems: ItunesItem[]; // Make sure cartItems is part of Props
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, cartItems }) => {
  let dashJsx;

  switch (currentDisplay) {
    case "cart":
      dashJsx = (
        <>
          <Typography variant="h6">Your Cart</Typography>
          <Cart cartItems={cartItems} /> {/* Pass cartItems as prop to Cart component */}
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

  return <Box sx={{ width: '80%', padding: '20px' }}>{dashJsx}</Box>;
};

export default DashboardInfo;

