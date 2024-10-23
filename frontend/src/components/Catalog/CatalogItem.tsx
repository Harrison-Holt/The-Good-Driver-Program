import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ItunesItem {
  trackId?: string;
  collectionId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
  trackPrice?: number;
  collectionPrice?: number;
}

interface CatalogItemProps {
    item: ItunesItem;
    onViewDetails: (item: ItunesItem) => void;
    conversionRate: number; // Add the conversion rate prop
  }
  
  const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails, conversionRate }) => {
      // Calculate the price in points using the conversion rate
      const priceInPoints = (item.collectionPrice || item.trackPrice) ? Math.round((item.collectionPrice || item.trackPrice) * conversionRate) : null;
  
      return (
          <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
              <img src={item.artworkUrl100} alt={item.trackName || item.collectionName} style={{ width: '100%' }} />
              <Typography variant="h6">{item.trackName || item.collectionName}</Typography>
              <Typography variant="body1">Artist: {item.artistName}</Typography>
              <Typography variant="body1">
                  Points: {priceInPoints !== null ? priceInPoints : 'N/A'} Points
              </Typography>
              <Button variant="contained" color="primary" onClick={() => onViewDetails(item)}>
                  View Details
              </Button>
          </Box>
      );
  };
  
  export default CatalogItem;
  
