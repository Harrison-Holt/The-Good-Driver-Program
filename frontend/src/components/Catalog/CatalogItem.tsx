import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

interface ItunesItem {
  collectionId: string; // Always required
  trackId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
  discount?: number;
  discountedPrice?: number;
  points?: number;
}

interface CatalogItemProps {
  item: ItunesItem;
  onViewDetails: (item: ItunesItem) => void; // To handle "View Details"
  conversionRate: number; // Points per dollar
  userRole: string;
  onAddToCatalog?: (item: ItunesItem) => void; // Handles adding to catalog
  onSaveDiscount?: (item: ItunesItem, discount: number) => void; // Handles saving the discount
}

const CatalogItem: React.FC<CatalogItemProps> = ({
  item,
  onAddToCatalog,
  onViewDetails,
  conversionRate,
  onSaveDiscount,
}) => {
  const [discount, setDiscount] = useState<number>(0);
  const [discountSaved, setDiscountSaved] = useState<boolean>(false);

  const calculateBasePoints = () => {
    const originalPrice = item.collectionPrice || item.trackPrice || 0;
    return Math.round(originalPrice * conversionRate);
  };

  const calculateDiscountedPoints = () => {
    const originalPrice = item.collectionPrice || item.trackPrice || 0;
    const discountedPrice = originalPrice * (1 - discount / 100);
    return Math.round(discountedPrice * conversionRate);
  };

  const handleAddWithDiscount = () => {
    if (onAddToCatalog) {
      const updatedItem = {
        ...item,
        discount,
        points: calculateDiscountedPoints(),
      };
      onAddToCatalog(updatedItem);
    }
  };

  const handleSaveDiscount = () => {
    if (onSaveDiscount) {
      onSaveDiscount(item, discount);
      setDiscountSaved(true); // Mark as saved
    }
  };

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
      <Typography variant="body1" sx={{ marginBottom: '5px' }}>
        <strong>Base Points:</strong> {calculateBasePoints()}
      </Typography>
      <TextField
        type="number"
        label="Discount (%)"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
        fullWidth
        sx={{ marginBottom: '10px' }}
      />
      <Typography variant="body1" sx={{ marginBottom: '10px' }}>
        <strong>Discounted Points:</strong> {calculateDiscountedPoints()}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => onViewDetails(item)} // Use `onViewDetails` here
        sx={{ marginBottom: '10px' }}
      >
        View Details
      </Button>
      {onSaveDiscount && (
        <Button
          variant="outlined"
          color="success"
          onClick={handleSaveDiscount}
          disabled={discountSaved} // Disable button if discount is saved
          sx={{ marginBottom: '10px' }}
        >
          {discountSaved ? 'Discount Saved' : 'Save Discount'}
        </Button>
      )}
      {onAddToCatalog && (
        <Button variant="outlined" color="success" onClick={handleAddWithDiscount}>
          Add to Catalog
        </Button>
      )}
    </Box>
  );
};

export default CatalogItem;
