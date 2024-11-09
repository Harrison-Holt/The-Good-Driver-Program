import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSettings } from '../Settings/settings_context';

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
  currency?: string;
}

interface CatalogItemProps {
  item: ItunesItem;
  onViewDetails: (item: ItunesItem) => void;
  conversionRate: number; // Add the conversion rate prop
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails, conversionRate }) => {
  const { settings } = useSettings(); // Access settings for lineHeight

  // Filter out items not in the sponsor's catalog
  const removedItems = JSON.parse(localStorage.getItem('remItems') || '[]');

  for (const i in removedItems) {
    if (removedItems[i].trackId === item.trackId) {
      // Item removed, keep going...
      return null; // Return null to avoid rendering
    }
  }

  // Calculate the price in points using the conversion rate
  const priceInPoints = Math.round((item.collectionPrice || item.trackPrice || 0) * conversionRate);

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        lineHeight: settings.lineHeight || 1.5, // Apply lineHeight globally
      }}
    >
      <img
        src={item.artworkUrl100}
        alt={item.trackName || item.collectionName}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <Typography variant="h6" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
        {item.trackName || item.collectionName}
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
        Artist: {item.artistName}
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
        Points: {priceInPoints} Points
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onViewDetails(item)}
        sx={{ lineHeight: settings.lineHeight || 1.5 }}
      >
        View Details
      </Button>
    </Box>
  );
};

export default CatalogItem;
