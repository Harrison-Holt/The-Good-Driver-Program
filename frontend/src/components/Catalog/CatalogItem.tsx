import React from 'react';
import { Box, Typography, Button } from '@mui/material';

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

interface CatalogItemProps {
  item: ItunesItem;
  onViewDetails: (item: ItunesItem) => void; // Add this property
  conversionRate: number;
  userRole: string, 
  onAddToCatalog?: (item: ItunesItem) => void; // Added this property
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onAddToCatalog }) => {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
      }}
    >
      <img
        src={item.artworkUrl100}
        alt={item.trackName || item.collectionName}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <Typography variant="h6" sx={{ marginBottom: '8px' }}>
        {item.trackName || item.collectionName}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '5px' }}>
        <strong>Artist:</strong> {item.artistName}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '10px' }}>
        <strong>Price:</strong> {item.collectionPrice} {item.currency}
      </Typography>
      {onAddToCatalog && (
        <Button
          variant="outlined"
          color="success"
          onClick={() => onAddToCatalog(item)}
        >
          Add to Catalog
        </Button>
      )}
    </Box>
  );
};

export default CatalogItem;



