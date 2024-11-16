import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import CatalogItem from './CatalogItem';
import CatalogControls from './CatalogControls';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'; // Adjust the import path based on your file structure

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

const API_BASE_URL = 'https://itunes.apple.com/search';

const Catalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('music');
  const [conversionRate, setConversionRate] = useState(100); // Default conversion rate
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Access userType from Redux store
  const userType = useSelector((state: RootState) => state.currentUser.userType);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}?term=${encodeURIComponent(
          searchTerm || 'music'
        )}&media=${selectedCategory}&limit=50`;

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.statusText}`);
        }

        const data = await response.json();
        const fetchedItems = data.results.filter(
          (item: ItunesItem) => item.collectionPrice && item.collectionPrice > 0
        );

        setItems(fetchedItems);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);

  // Render different messages based on user type
  if (userType !== 'sponsor') {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
        {userType === 'driver' ? (
          <>
            <Typography variant="h4" gutterBottom>
              Access Restricted
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Drivers cannot view the catalog. Please apply to become a sponsor to gain access.
            </Typography>
          </>
        ) : userType === 'admin' ? (
          <>
            <Typography variant="h4" gutterBottom>
              Action Required
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Admins need to select a sponsor to view the catalog.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You do not have permission to view this catalog.
            </Typography>
          </>
        )}
      </Box>
    );
  }

  // If user is a sponsor, render the catalog
  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sponsor Catalog View
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      <CatalogControls
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setSearchTerm={setSearchTerm}
        conversionRate={conversionRate}
        setConversionRate={setConversionRate}
      />

      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4}>
            <CatalogItem
              item={item}
              onViewDetails={() => console.log('View details clicked')}
              conversionRate={conversionRate}
              userRole="sponsor" // Ensures role-based behavior for CatalogItem
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Catalog;

