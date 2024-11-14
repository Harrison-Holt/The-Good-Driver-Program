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
  conversionRate: number;
  userRole: string; // Add userRole prop to handle role-specific actions
  onAddToCatalog?: (item: ItunesItem) => void; // Optional for sponsors
  onRemoveFromCatalog?: (item: ItunesItem) => void; // Optional for sponsors
}

const CatalogItem: React.FC<CatalogItemProps> = ({
  item,
  onViewDetails,
  conversionRate,
  userRole,
  onAddToCatalog,
  onRemoveFromCatalog,
}) => {
  const { settings } = useSettings();

  // Filter out items not in the catalog if they are in the "removed" list
  const removedItems = JSON.parse(localStorage.getItem('remItems') || '[]');
  const isRemoved = removedItems.some((removedItem: ItunesItem) => removedItem.trackId === item.trackId);

  if (isRemoved) return null; // Skip rendering if the item is marked as removed

  // Calculate the price in points using the conversion rate
  const priceInPoints = Math.round((item.collectionPrice || item.trackPrice || 0) * conversionRate);

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        lineHeight: settings.lineHeight || 1.5,
        textAlign: settings.textAlign || 'left',
        marginBottom: '15px',
      }}
    >
      <img
        src={item.artworkUrl100}
        alt={item.trackName || item.collectionName}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <Typography variant="h6" sx={{ lineHeight: settings.lineHeight || 1.5, marginBottom: '8px' }}>
        {item.trackName || item.collectionName}
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5, marginBottom: '5px' }}>
        <strong>Artist:</strong> {item.artistName}
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5, marginBottom: '10px' }}>
        <strong>Points:</strong> {priceInPoints} Points
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onViewDetails(item)}
        sx={{ lineHeight: settings.lineHeight || 1.5, marginBottom: '8px' }}
      >
        View Details
      </Button>

      {/* Role-specific actions */}
      {userRole === 'sponsor' && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {onAddToCatalog && (
            <Button
              variant="outlined"
              color="success"
              onClick={() => onAddToCatalog(item)}
              sx={{ lineHeight: settings.lineHeight || 1.5 }}
            >
              Add to Catalog
            </Button>
          )}
          {onRemoveFromCatalog && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => onRemoveFromCatalog(item)}
              sx={{ lineHeight: settings.lineHeight || 1.5 }}
            >
              Remove
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CatalogItem;

