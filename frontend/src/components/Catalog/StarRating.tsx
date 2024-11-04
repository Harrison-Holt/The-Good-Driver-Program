import React from 'react';
import { Box } from '@mui/material';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} style={{ color: i < rating ? 'gold' : 'lightgray' }}>
        ★
      </span>
    );
  }

  return <Box>{stars}</Box>;
};

export default StarRating;
