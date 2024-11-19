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

  // Fetch sponsor's catalog
  useEffect(() => {
    if (!username) return;

    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${SPONSOR_CATALOG_URL}?username=${username}`, { method: 'GET' });

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
      const payload = {
        username,
        items: [
          {
            item_id: item.collectionId,
            item_name: item.trackName || item.collectionName,
            artist_name: item.artistName,
            price: item.collectionPrice || item.trackPrice,
            discounted_price: item.discountedPrice || null, 
            discount: item.discount || null,
            currency: item.currency,
            points: Math.round((item.collectionPrice || item.trackPrice || 0) * conversionRate),
            image_url: item.artworkUrl100,
          },
        ],
      };
    
      console.log('Payload being sent to backend:', payload); // Log the payload
    
      const response = await fetch(SPONSOR_CATALOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to catalog.');
      }
    
      setCatalog((prev) => [...prev, item]);
      alert('Item added to catalog successfully.');
    } catch (error) {
      console.error('Error adding item to catalog:', error);
      alert('Failed to add item to catalog.');
    } finally {
      setOperationLoading(false);
    }
  }
    

  const handleDeleteItem = async (collectionId: string) => {
    if (!username || !collectionId) {
      console.error('Username or collectionId is missing:', { username, collectionId });
      alert('Username and valid collectionId are required.');
      return;
    }
  
    setOperationLoading(true);
    try {
      const payload = { username, item_id: collectionId };
      console.log('Payload being sent to delete item:', payload);
  
      const response = await fetch(SPONSOR_CATALOG_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete item.');
      }
  
      setCatalog((prev) => prev.filter((item) => item.collectionId !== collectionId));
      alert('Item deleted successfully.');
    } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting item:', error.message);
          alert(error.message || 'Failed to delete item.');
        } else {
          console.error('Unknown error:', error);
          alert('An unknown error occurred.');
        }
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
                  Discounted Price: $
                  {(item.discountedPrice && !isNaN(Number(item.discountedPrice))
                    ? Number(item.discountedPrice).toFixed(2)
                    : 'N/A')}
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
