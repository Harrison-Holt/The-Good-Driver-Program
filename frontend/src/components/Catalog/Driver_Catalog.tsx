import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid, Button } from '@mui/material';
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

// API endpoint for fetching the driver catalog
const DRIVER_CATALOG_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/driver_catalog';

const DriverCatalog = () => {
  const [catalog, setCatalog] = useState<ItunesItem[]>([]); // Driver's catalog
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null); // For item details dialog

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

        const data: ItunesItem[] = await response.json(); // Typed response
        setCatalog(data);
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
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
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
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">Item Details</Typography>
          <Typography>
            <strong>Name:</strong> {selectedItem.trackName || selectedItem.collectionName}
          </Typography>
          <Typography>
            <strong>Artist:</strong> {selectedItem.artistName}
          </Typography>
          <Typography>
            <strong>Price:</strong> {selectedItem.collectionPrice} {selectedItem.currency}
          </Typography>
          <Button onClick={handleDialogClose}>Close</Button>
        </Box>
      )}
    </Box>
  );
};

export default DriverCatalog;
