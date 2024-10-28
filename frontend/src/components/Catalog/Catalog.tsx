import { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText, Grid, Alert, List, ListItem, ListItemText, TextField, Rating, Card, CardMedia, CardContent, CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating'; 
import SearchBar from '../SearchBar'; // Import SearchBar component

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
  const [filteredItems, setFilteredItems] = useState<ItunesItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [searchTerm, setSearchTerm] = useState(''); // We now use setSearchTerm for filtering the catalog
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review>({ user_name: '', comment: '', rating: 5 });
  const [sortOption, setSortOption] = useState('highest');
  const navigate = useNavigate();

  // Function to calculate the overall average rating
  const calculateAverageRating = (reviews: Review[]) => {
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    return reviews.length ? (totalRatings / reviews.length).toFixed(1) : '0.0';
  };

  // Function to sort reviews
  const sortReviews = (reviews: Review[], option: string) => {
    return [...reviews].sort((a, b) => {
      if (option === 'lowest') return a.rating - b.rating;
      return b.rating - a.rating; // default to highest rating first
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm || 'music')}&media=${selectedCategory}&limit=50`;
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (!response.ok) throw new Error(`Error fetching items: ${response.status} ${response.statusText}`);
        const data: ItunesApiResponse = await response.json();

        const fetchedItems = data.resultCount > 0 ? data.results.filter(item => item.collectionPrice && item.collectionPrice > 0) : [];
        setItems(fetchedItems);
        setFilteredItems(fetchedItems); // Initialize filtered items to be the same as fetched items
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // Use the error message if it's an Error object
        }
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
          setReviews(data);
        } catch {
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

        const response = await fetch(REVIEW_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewPayload),
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(`Error submitting review: ${JSON.stringify(errorDetails)}`);
        }

        setReviews(prevReviews => [...prevReviews, { user_name: newReview.user_name, rating: newReview.rating, comment: newReview.comment }]);
        setNewReview({ user_name: '', comment: '', rating: 5 });
        setAlertMessage('Review submitted successfully!');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
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
  
    // Trigger the storage event to notify all listeners
    window.dispatchEvent(new Event('storage'));
    
    setAlertMessage(`${item.trackName || item.collectionName} added to cart!`);
  };
  

  const handleViewDetails = (item: ItunesItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const sortedReviews = sortReviews(reviews, sortOption); // Sort reviews based on the selected option

  // Filter items based on the search term
  useEffect(() => {
    const filtered = items.filter((item) =>
      (item.trackName?.toLowerCase().includes(searchTerm.toLowerCase()) || item.collectionName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  return (
    <Box sx={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: '40px' }}>
        Discover Your Favorite Media
      </Typography>

      {/* Add SearchBar component and pass options */}
      <SearchBar setSearchTerm={setSearchTerm} options={categories.map(category => category.name)} />

      <Box sx={{ marginBottom: '20px' }}>
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
        {filteredItems.map((item: ItunesItem) => (
          <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image={item.artworkUrl100}
                alt={item.trackName || item.collectionName}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {item.trackName || item.collectionName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Artist:</strong> {item.artistName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Price:</strong> {item.collectionPrice?.toFixed(2)} {item.currency || 'USD'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleViewDetails(item)}>View Details</Button>
                <Button size="small" color="secondary" onClick={() => handleAddToCart(item)}>Add to Cart</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedItem && (
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedItem.trackName || selectedItem.collectionName}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src={selectedItem.artworkUrl100} alt={selectedItem.trackName} style={{ width: '200px', marginBottom: '20px' }} />
              <DialogContentText>
                <strong>Artist:</strong> {selectedItem.artistName} <br />
                <strong>Price:</strong> {selectedItem.collectionPrice} {selectedItem.currency}
              </DialogContentText>

              <Typography variant="h6" sx={{ marginTop: '20px' }}>
                Overall Rating: {calculateAverageRating(reviews)} / 5
              </Typography>
              <Rating value={parseFloat(calculateAverageRating(reviews))} readOnly precision={0.5} sx={{ marginBottom: '20px' }} />
            </Box>

            <Typography variant="h6">User Reviews</Typography>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              fullWidth
              sx={{ marginBottom: '10px' }}
            >
              <MenuItem value="highest">Highest Rating</MenuItem>
              <MenuItem value="lowest">Lowest Rating</MenuItem>
            </Select>

            <List>
              {sortedReviews.length > 0 ? (
                sortedReviews.map((review, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={<StarRating rating={review.rating} />}
                      secondary={`${review.user_name || 'Anonymous'}: ${review.comment || 'No review text available'}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No reviews yet. Be the first to leave one!" />
                </ListItem>
              )}
            </List>

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

              <Button variant="contained" onClick={handleSubmitReview} sx={{ marginTop: '10px', width: '100%' }}>Submit Review</Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => handleBuyNow(selectedItem)}>Buy Now</Button>
            <Button variant="outlined" onClick={() => handleAddToCart(selectedItem)}>Add to Cart</Button>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Catalog;
