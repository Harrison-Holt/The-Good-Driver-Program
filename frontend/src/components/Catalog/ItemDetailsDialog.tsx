import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import ReviewManager from './ReviewList'; // Import the ReviewManager component

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
}

interface ItemDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  item: ItunesItem;
  onRemoveFromCatalog: () => void;
  onBuyNow: () => void;
}

const ItemDetailsDialog: React.FC<ItemDetailsDialogProps> = ({
  open,
  onClose,
  item,
  onRemoveFromCatalog,
  onBuyNow,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{item.trackName || item.collectionName}</DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: 'white', // Set a solid background color
          color: 'black', // Ensure text is visible
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: 'white', // Match background to avoid transparency
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <img
            src={item.artworkUrl100}
            alt={item.trackName || item.collectionName}
            style={{
              width: '200px',
              marginBottom: '20px',
              borderRadius: '8px',
            }}
          />
          <Typography>
            <strong>Artist:</strong> {item.artistName}
          </Typography>
          <Typography>
            <strong>Price:</strong> {item.collectionPrice} {item.currency}
          </Typography>
        </Box>
        {/* Include ReviewManager and pass the collectionId or trackId */}
        <ReviewManager itemId={item.collectionId || item.trackId || ''} />
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: 'white', // Ensure dialog actions have the same background
        }}
      >
        <Button onClick={onRemoveFromCatalog} color="error">
          Unlist
        </Button>
        <Button onClick={onBuyNow} color="primary">
          Buy Now
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsDialog;
