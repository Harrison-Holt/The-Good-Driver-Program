import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

// Define the type for a catalog item
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

// Define the type for a review
interface Review {
  user_name: string;
  rating: number;
  comment: string;
}

// Define the props for ReviewForm
interface ReviewFormProps {
  onSubmit: (review: Review) => void; // Callback for submitting a review
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [review, setReview] = useState<Review>({ user_name: '', comment: '', rating: 5 });

  const handleSubmit = () => {
    if (!review.user_name || !review.comment || review.rating < 1 || review.rating > 5) {
      alert('Please provide valid inputs for all fields.');
      return;
    }
    onSubmit(review);
    setReview({ user_name: '', comment: '', rating: 5 }); // Reset the form
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Username"
        value={review.user_name}
        onChange={(e) => setReview({ ...review, user_name: e.target.value })}
        sx={{ marginBottom: '10px' }}
      />
      <TextField
        fullWidth
        label="Comment"
        multiline
        rows={4}
        value={review.comment}
        onChange={(e) => setReview({ ...review, comment: e.target.value })}
        sx={{ marginBottom: '10px' }}
      />
      <TextField
        fullWidth
        label="Rating"
        type="number"
        value={review.rating}
        onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
        sx={{ marginBottom: '20px' }}
        inputProps={{ min: 1, max: 5 }}
      />
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit Review
      </Button>
    </Box>
  );
};

// Define the props for ReviewList
interface ReviewListProps {
  reviews: Review[]; // Array of reviews
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews.length) {
    return <Typography>No reviews yet. Be the first to leave one!</Typography>;
  }

  return (
    <List>
      {reviews.map((review, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={`${review.user_name || 'Anonymous'}: ${review.comment}`}
            secondary={`Rating: ${review.rating}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

// Define the props for ItemDetailsDialog
interface ItemDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  item: ItunesItem;
  reviews: Review[];
  onSubmitReview: (review: Review) => void;
  onRemoveFromCatalog: () => void;
  onBuyNow: () => void;
}

const ItemDetailsDialog: React.FC<ItemDetailsDialogProps> = ({
  open,
  onClose,
  item,
  reviews,
  onSubmitReview,
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
        <ReviewList reviews={reviews} />
        <ReviewForm onSubmit={onSubmitReview} />
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

