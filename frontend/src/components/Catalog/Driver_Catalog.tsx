import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import CatalogGrid from './CatalogGrid';
import ItemDetailsDialog from './ItemDetailsDialog';
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
  discount?: number;
  discountedPrice?: number;
}

interface Review {
  user_name: string;
  rating: number;
  comment: string;
}

// API endpoint for fetching the driver catalog
const DRIVER_CATALOG_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/driver_catalog';

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

        const data = await response.json();
        setCatalog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [username]);

  const handleViewDetails = async (item: ItunesItem) => {
    setSelectedItem(item);
    // Fetch reviews for the selected item (optional)
    try {
      const response = await fetch(`https://dtnha4rfd4.execute-api.us-east-1.amazonaws.com/dev/reviews?itemId=${item.collectionId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
    setReviews([]); // Clear reviews when dialog closes
  };

  const handleBuyNow = () => {
    alert('Buy Now functionality will be implemented here!');
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
          <CatalogGrid
            items={catalog}
            onViewDetails={handleViewDetails}
            conversionRate={100} // Adjust as necessary
            userRole="driver"
          />
        )}
      </Grid>

      {selectedItem && (
        <ItemDetailsDialog
          open={!!selectedItem}
          onClose={handleDialogClose}
          item={selectedItem}
          reviews={reviews}
          onSubmitReview={(review) => setReviews((prev: Review[]) => [...prev, review])}
          onRemoveFromCatalog={() => alert('Drivers cannot remove items.')}
          onBuyNow={handleBuyNow}
        />
      )}
    </Box>
  );
};

export default DriverCatalog;
