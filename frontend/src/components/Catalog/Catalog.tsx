import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid, Button } from '@mui/material';
import CatalogItem from './CatalogItem';
import CatalogControls from './CatalogControls';
import { useAppSelector } from "../../store/hooks";
import { selectUserName } from '../../store/userSlice';

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
const PUBLISH_API_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsor_catalog';

const Catalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [catalog, setCatalog] = useState<ItunesItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('music');
  const [conversionRate, setConversionRate] = useState(100); // Default conversion rate
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const username = useAppSelector(selectUserName);

  // Filter items dynamically
  const filteredItems = items.filter(
    (item) =>
      item.trackName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.collectionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleAddToCatalog = (item: ItunesItem) => {
    if (catalog.find((catalogItem) => catalogItem.trackId === item.trackId)) {
      alert(`${item.trackName || item.collectionName} is already in the catalog.`);
      return;
    }
    setCatalog((prev) => [...prev, item]);
    alert(`${item.trackName || item.collectionName} added to the catalog.`);
  };

  const handlePublishCatalog = async () => {
    if (catalog.length === 0) {
      alert('No items to publish.');
      return;
    }

    try {
      const response = await fetch(PUBLISH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username, // Send the username with the API request
          items: catalog,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish catalog.');
      }

      alert('Catalog published successfully!');
      setCatalog([]);
    } catch (error) {
      console.error('Error publishing catalog:', error);
      alert('Error publishing catalog. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sponsor Catalog Management
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
        {filteredItems.map((item) => (
          <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4}>
            <CatalogItem
              item={item}
              onViewDetails={() => console.log('View details clicked')}
              conversionRate={conversionRate}
              userRole="sponsor"
              onAddToCatalog={() => handleAddToCatalog(item)} // Add item to catalog
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Items in Catalog: {catalog.length}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublishCatalog}
          disabled={catalog.length === 0 || !username} // Disable if no catalog items or no username
        >
          Publish Catalog
        </Button>
      </Box>
    </Box>
  );
};

export default Catalog;

