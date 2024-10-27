import { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText, Grid, Alert, List, ListItem, ListItemText, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';

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

interface ItunesApiResponse {
  resultCount: number;
  results: ItunesItem[];
}

interface Review {
  user_name: string;
  rating: number;
  comment: string;
}

const categories = [
  { id: 'music', name: 'Music' },
  { id: 'podcast', name: 'Podcast' },
  { id: 'tvShow', name: 'TV Show' },
  { id: 'movie', name: 'Movie' },
  { id: 'software', name: 'Software' },
];

const API_BASE_URL = 'https://itunes.apple.com/search';
const REVIEW_API_URL = 'https://dtnha4rfd4.execute-api.us-east-1.amazonaws.com/dev/reviews';

const Catalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review>({ user_name: '', comment: '', rating: 5 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm || 'music')}&media=${selectedCategory}&limit=50`;
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (!response.ok) throw new Error(`Error fetching items: ${response.status} ${response.statusText}`);
        const data: ItunesApiResponse = await response.json();

        setItems(data.resultCount > 0 ? data.results.filter(item => item.collectionPrice && item.collectionPrice > 0) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    if (selectedItem) {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${REVIEW_API_URL}?itemId=${selectedItem.trackId || selectedItem.collectionId}`, { method: 'GET' });
          if (!response.ok) throw new Error('Error fetching reviews');
          const data = await response.json();
          console.log('Fetched Reviews:', data); // Log fetched reviews
          setReviews(data); // Ensure data is in the expected array format
        } catch (err) {
          console.error(err);
          setError('Failed to load reviews');
        }
      };
      fetchReviews();
    }
  }, [selectedItem]);

  const handleSubmitReview = async () => {
    if (selectedItem) {
      try {
        const itemId = selectedItem.trackId || selectedItem.collectionId;

        if (!itemId) {
          setError("Item ID is missing, cannot submit review.");
          return;
        }

        const reviewPayload = { itemId, user_name: newReview.user_name, rating: newReview.rating, comment: newReview.comment };
        console.log('Review Payload:', JSON.stringify(reviewPayload, null, 2));

        const response = await fetch(REVIEW_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewPayload),
        });
        
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(`Error submitting review: ${JSON.stringify(errorDetails)}`);
        }

        const result = await response.json();
        console.log(result);
        setReviews(prevReviews => [...prevReviews, { user_name: newReview.user_name, rating: newReview.rating, comment: newReview.comment }]); // Append new review
        setNewReview({ user_name: '', comment: '', rating: 5 });
        setAlertMessage('Review submitted successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(error);
        setError(errorMessage);
      }
    }
  };

  const handleBuyNow = (item: ItunesItem) => {
    setAlertMessage(`Purchased ${item.trackName || item.collectionName}!`);
    navigate('/confirmation', { state: { item } });
  };

  const handleAddToCart = (item: ItunesItem) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = [...currentCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setAlertMessage(`${item.trackName || item.collectionName} added to cart!`);
    setShowModal(false);
    window.dispatchEvent(new Event('storage'));
  };

  const handleViewDetails = (item: ItunesItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <SearchBar setSearchTerm={setSearchTerm} options={categories.map(cat => cat.name)} />
      <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>Select Category:</Typography>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} fullWidth variant="outlined">
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
          ))}
        </Select>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error" align="center">Error: {error}</Typography>}
      {alertMessage && <Alert severity="success" onClose={() => setAlertMessage(null)}>{alertMessage}</Alert>}

      <Grid container spacing={4}>
        {items.map((item: ItunesItem) => (
          <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4} lg={3}>
            <CatalogItem item={item} onViewDetails={handleViewDetails} />
          </Grid>
        ))}
      </Grid>

      {!loading && items.length === 0 && !error && (
        <Typography align="center" variant="h6" sx={{ marginTop: '20px' }}>
          No items found. Try searching with a different term or category.
        </Typography>
      )}

      {selectedItem && (
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedItem.trackName || selectedItem.collectionName} (ID: {selectedItem.trackId || selectedItem.collectionId})</DialogTitle>
          <DialogContent>
            <img src={selectedItem.artworkUrl100} alt={selectedItem.trackName} style={{ width: '100%', marginBottom: '20px' }} />
            <DialogContentText>
              <strong>Artist:</strong> {selectedItem.artistName} <br />
              <strong>Price:</strong> {selectedItem.collectionPrice} {selectedItem.currency} <br />
            </DialogContentText>

            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              <a href={selectedItem.collectionViewUrl || selectedItem.trackViewUrl} target="_blank" rel="noopener noreferrer">
                View iTunes Reviews
              </a>
            </Typography>

            <Box sx={{ marginTop: '20px' }}>
              <Typography variant="h6">User Reviews</Typography>
              <List>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${review.user_name || 'Anonymous'} (${review.rating || 0} stars)`} 
                        secondary={review.comment || 'No review text available'} 
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No reviews yet. Be the first to leave one!" />
                  </ListItem>
                )}
              </List>
            </Box>

            <Box sx={{ marginTop: '20px' }}>
              <Typography variant="h6">Leave a Review</Typography>
              
              <TextField
                fullWidth
                label="Username"
                value={newReview.user_name}
                onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
                sx={{ marginBottom: '10px' }}
              />
              
              <TextField
                fullWidth
                label="Review"
                multiline
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                sx={{ marginBottom: '10px' }}
              />
              
              <Typography component="legend">Rating (0-5)</Typography>
              <Select
                fullWidth
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                sx={{ marginBottom: '10px' }}
              >
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>{value} Star{value > 1 ? 's' : ''}</MenuItem>
                ))}
              </Select>

              <Button variant="contained" onClick={handleSubmitReview}>Submit Review</Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => handleBuyNow(selectedItem)}>Buy Now</Button>
            <Button variant="outlined" color="secondary" onClick={() => handleAddToCart(selectedItem)}>Add to Cart</Button>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Catalog;
