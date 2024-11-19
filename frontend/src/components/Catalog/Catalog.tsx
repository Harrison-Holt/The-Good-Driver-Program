import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import CatalogItem from './CatalogItem';
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


const API_BASE_URL = 'https://itunes.apple.com/search';
const SPONSOR_CATALOG_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsor_catalog';

const Catalog = () => {
  const [conversionRate] = useState(100); // Default conversion rate
  const [currentTab, setCurrentTab] = useState(0);
  const [items, setItems] = useState<ItunesItem[]>([]); // Items from external API
  const [catalog, setCatalog] = useState<ItunesItem[]>([]); // Sponsor's catalog
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('music');
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false); // Loading for add/delete actions
  const [error, setError] = useState<string | null>(null);

  const username = useAppSelector(selectUserName);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`${SPONSOR_CATALOG_URL}?username=${username}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching catalog: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        // Transform API response to ensure required fields are present
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedCatalog = data.map((item: any) => ({
          id: item.id || 0,
          item_name: item.item_name || 'Unknown Item',
          artist_name: item.artist_name || 'Unknown Artist',
          price: item.price ? parseFloat(item.price).toFixed(2) : '0.00',
          currency: item.currency || 'USD',
          discount: item.discount || 0,
          discounted_price: item.discounted_price
            ? parseFloat(item.discounted_price).toFixed(2)
            : parseFloat(item.price || '0').toFixed(2), // Fallback to original price
          image_url: item.image_url || '', // Provide an empty string if no URL
        }));
  
        setCatalog(transformedCatalog);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
  
    if (username) {
      fetchCatalog();
    }
  }, [username]);
  // Fetch items from external API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm || 'music')}&media=${selectedCategory}&limit=50`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.statusText}`);
        }

        const data = await response.json();
        const fetchedItems = data.results.filter(
          (item: ItunesItem) => item.collectionPrice && item.collectionPrice > 0
        );

        setItems(fetchedItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);
  const handleAddToCatalog = async (item: ItunesItem) => {
    setOperationLoading(true);
  
    try {
      // Calculate discount and discounted price
      const discount = item.discount || 0; // Default to 0 if no discount is provided
      const originalPrice = item.collectionPrice || item.trackPrice || 0;
      const discountedPrice = originalPrice * (1 - discount / 100);
  
      // Prepare the item with updated discount and discounted price
      const newItem = {
        ...item,
        discount, // Store the discount value
        discountedPrice: parseFloat(discountedPrice.toFixed(2)), // Ensure proper formatting
      };
  
      // Send the item to the backend
      const response = await fetch(SPONSOR_CATALOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          items: [
            {
              item_id: newItem.collectionId,
              item_name: newItem.trackName || newItem.collectionName,
              artist_name: newItem.artistName,
              price: originalPrice,
              discounted_price: newItem.discountedPrice,
              discount: newItem.discount,
              currency: newItem.currency,
              points: Math.round(originalPrice * conversionRate),
              image_url: newItem.artworkUrl100,
            },
          ],
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to catalog.');
      }
  
      // Update the local catalog state
      setCatalog((prev) => [...prev, newItem]);
      alert('Item added to catalog successfully.');
    } catch (error) {
      console.error('Error adding item to catalog:', error);
      alert('Failed to add item to catalog.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteItem = async (collectionId: string) => {
    setOperationLoading(true);
    try {
      const response = await fetch(SPONSOR_CATALOG_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, item_id: collectionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete item.');
      }

      setCatalog((prev) => prev.filter((item) => item.collectionId !== collectionId));
      alert('Item deleted successfully.');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handlePublishCatalog = async () => {
    if (catalog.length === 0) {
      alert('No items to publish.');
      return;
    }

    alert('Catalog published successfully!');
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

      <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} centered>
        <Tab label="Manage Catalog" />
        <Tab label="Search and Add Items" />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={4} sx={{ marginTop: '20px' }}>
          {catalog.map((item) => (
            <Grid item key={item.collectionId} xs={12} sm={6} md={4}>
              <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <Typography variant="h6">{item.trackName || item.collectionName}</Typography>
                <Typography variant="body2">Artist: {item.artistName}</Typography>
                <Typography variant="body2">Price: ${item.trackPrice || item.collectionPrice}</Typography>
                <Typography variant="body2">Discount: {item.discount || 0}%</Typography>
                <Typography variant="body2">
                  Discounted Price: ${item.discountedPrice?.toFixed(2) || 'N/A'}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteItem(item.collectionId)}
                  disabled={operationLoading}
                  sx={{ marginTop: '10px' }}
                >
                  {operationLoading ? 'Deleting...' : 'Delete Item'}
                </Button>
              </Box>
            </Grid>
          ))}
          <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePublishCatalog}
              disabled={catalog.length === 0 || operationLoading}
            >
              Publish Catalog
            </Button>
          </Box>
        </Grid>
      )}

      {currentTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <TextField
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ marginRight: '10px' }}
            />
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <MenuItem value="music">Music</MenuItem>
              <MenuItem value="movie">Movies</MenuItem>
              <MenuItem value="podcast">Podcasts</MenuItem>
            </Select>
          </Box>
          <Grid container spacing={4} sx={{ marginTop: '20px' }}>
            {items.map((item) => (
              <Grid item key={item.collectionId} xs={12} sm={6} md={4}>
           <CatalogItem
  item={item}
  onAddToCatalog={() => handleAddToCatalog(item)}
  onViewDetails={(item) => console.log(`View details for ${item.trackName || item.collectionName}`)} // Properly implement onViewDetails
  conversionRate={conversionRate}
  userRole="sponsor"
/>

              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Catalog;
