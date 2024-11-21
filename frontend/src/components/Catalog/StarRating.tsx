import React from 'react';
import { Rating } from '@mui/material';

interface StarRatingProps {
  rating: number;
  onChange?: (newValue: number) => void; // Define optional onChange callback
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange }) => {
  return (
    <Rating
      name="star-rating"
      value={rating}
      onChange={(_, newValue) => {
        if (newValue !== null) {
          onChange?.(newValue);
        }
      }}
    />
  );
};

export default StarRating;
