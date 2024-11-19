import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

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
  discount?: number; // Discount in percentage
  discountedPrice?: number; // Final price after discount
}

interface CatalogItemProps {
  item: ItunesItem;
  onViewDetails: (item: ItunesItem) => void; // To handle "View Details"
  conversionRate: number;
  userRole: string;
  onAddToCatalog?: (item: ItunesItem) => void; // Handles adding to catalog
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onAddToCatalog }) => {
  const [discount, setDiscount] = useState<number>(0);

  const calculateDiscountedPrice = () => {
    const originalPrice = item.collectionPrice || item.trackPrice || 0;
    const discountedPrice = originalPrice * (1 - discount / 100);
    return discountedPrice.toFixed(2);
  };

  const handleAddWithDiscount = () => {
    if (onAddToCatalog) {
      const updatedItem = {
        ...item,
        discount,
        discountedPrice: parseFloat(calculateDiscountedPrice()),
      };
      onAddToCatalog(updatedItem);
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
        <strong>Price:</strong> {item.collectionPrice} {item.currency}
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
        <strong>Discounted Price:</strong> {calculateDiscountedPrice()} {item.currency}
      </Typography>
      {onAddToCatalog && (
        <Button
          variant="outlined"
          color="success"
          onClick={handleAddWithDiscount}
        >
          Add to Catalog
        </Button>
      )}
    </Box>
  );
};

export default CatalogItem;
