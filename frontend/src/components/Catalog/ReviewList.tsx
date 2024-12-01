import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

interface Review {
  user_name: string;
  comment: string;
  rating: number;
}

interface ReviewFormProps {
  onSubmit: (review: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [review, setReview] = useState<Review>({ user_name: '', comment: '', rating: 5 });

  const handleSubmit = () => {
    if (!review.user_name.trim() || !review.comment.trim() || review.rating < 1 || review.rating > 5) {
      alert('Please provide valid inputs for all fields.');
      return;
    }
    onSubmit(review);
    setReview({ user_name: '', comment: '', rating: 5 });
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
        Submit
      </Button>
    </Box>
  );
};

interface ReviewListProps {
  reviews: Review[];
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
            primary={`${review.user_name || 'Anonymous'}: ${review.comment}`} // Ensure fallback for undefined `user_name`
            secondary={`Rating: ${review.rating}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

const REVIEW_API_URL = 'https://dtnha4rfd4.execute-api.us-east-1.amazonaws.com/dev/reviews';

const ReviewManager: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${REVIEW_API_URL}?itemId=${itemId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        console.log('Fetched reviews:', data); // Log to confirm `user_name` is present
    
        // Map reviews to ensure consistent structure
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setReviews(data.map((review: any) => ({
          user_name: review.user_name, // Map `user_name` directly
          comment: review.comment,
          rating: review.rating,
        })));
      } catch (err: unknown) {
        setError((err as Error).message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [itemId]);

  // Add useEffect to log the reviews state
  useEffect(() => {
    console.log('Current reviews state:', reviews);
  }, [reviews]);

  const handleReviewSubmit = async (review: Review) => {
    try {
      const response = await fetch(REVIEW_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, ...review }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
  
      const newReview = await response.json(); 
      setReviews((prev) => [...prev, newReview]); 
    } catch (err: unknown) {
      setError((err as Error).message || 'An unknown error occurred');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reviews
      </Typography>
      {error && (
        <Typography color="error" onClick={() => setError(null)} style={{ cursor: 'pointer' }}>
          {error} (Click to dismiss)
        </Typography>
      )}
      {loading ? (
        <Typography>Loading reviews...</Typography>
      ) : (
        <ReviewList reviews={reviews} />
      )}
      <ReviewForm onSubmit={handleReviewSubmit} />
    </Box>
  );
};

export default ReviewManager;
