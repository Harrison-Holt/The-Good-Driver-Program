import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import StarRating from './StarRating';
import { useAppSelector } from '../../store/hooks';
import { selectUserName } from '../../store/userSlice';

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
  rating?: number; // Optional rating field for the star rating
}

interface APIResponseItem {
  catalog_id: string;
  item_name: string;
  artist: string;
  artwork: string;
  price: string;
  currency: string;
  rating?: number;
}

interface Review {
  user_name: string;
  rating: number;
  comment: string;
}

const DRIVER_CATALOG_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/driver_catalog';
const REVIEW_API_URL = 'https://dtnha4rfd4.execute-api.us-east-1.amazonaws.com/dev/reviews';

const DriverCatalog = () => {
  const [catalog, setCatalog] = useState<ItunesItem[]>([]); // Driver's catalog
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null); // For item details dialog
  const [reviews, setReviews] = useState<Review[]>([]); // Reviews for selected item

  const username = useAppSelector(selectUserName);

  // Fetch the driver's catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${DRIVER_CATALOG_URL}?username=${username}`);
        if (!response.ok) {
          throw new Error(`Error fetching catalog: ${response.statusText}`);
        }

        const data: APIResponseItem[] = await response.json();
        const mappedData: ItunesItem[] = data.map((item) => ({
          collectionId: item.catalog_id,
          trackName: item.item_name,
          collectionName: item.item_name,
          artistName: item.artist,
          artworkUrl100: item.artwork,
          collectionPrice: parseFloat(item.price),
          trackPrice: parseFloat(item.price),
          currency: item.currency,
          rating: item.rating || 0,
        }));
        setCatalog(mappedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [username]);

  const handleAddToCart = (item: ItunesItem) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = [...currentCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));

    // Trigger cart update
    window.dispatchEvent(new Event('storage'));
    alert(`${item.trackName || item.collectionName} added to cart!`);
  };

  const handleViewDetails = async (item: ItunesItem) => {
    setSelectedItem(item);

    // Fetch reviews for the selected item
    try {
      const response = await fetch(`${REVIEW_API_URL}?itemId=${item.collectionId}`);
      if (response.ok) {
        const data: Review[] = await response.json();
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    }
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
    setReviews([]); // Clear reviews when dialog closes
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Driver Catalog
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={4}>
        {!loading && catalog.length === 0 && (
          <Typography variant="body1" align="center" sx={{ width: '100%' }}>
            No items available in the catalog.
          </Typography>
        )}

        {!loading && catalog.length > 0 && (
          <Grid container spacing={4}>
            {catalog.map((item) => (
              <Grid item key={item.collectionId} xs={12} sm={6} md={4}>
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
                  {item.rating !== undefined && (
                    <StarRating rating={item.rating || 0} />
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewDetails(item)}
                    sx={{ marginTop: '10px', marginRight: '10px' }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAddToCart(item)}
                    sx={{ marginTop: '10px' }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>

      {selectedItem && (
        <Dialog open={!!selectedItem} onClose={handleDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>{selectedItem.trackName || selectedItem.collectionName}</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={selectedItem.artworkUrl100}
                alt={selectedItem.trackName || selectedItem.collectionName}
                style={{ width: '200px', marginBottom: '20px' }}
              />
              <Typography>
                <strong>Artist:</strong> {selectedItem.artistName}
              </Typography>
              <Typography>
                <strong>Price:</strong> {selectedItem.collectionPrice} {selectedItem.currency}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ marginTop: '20px' }}>
              Reviews
            </Typography>
            <List>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={<StarRating rating={review.rating} />}
                      secondary={`${review.user_name}: ${review.comment}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No reviews yet." />
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default DriverCatalog;
