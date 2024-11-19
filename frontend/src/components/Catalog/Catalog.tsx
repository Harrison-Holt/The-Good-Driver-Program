import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid, Button, Tabs, Tab } from '@mui/material';
import CatalogItem from './CatalogItem';
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
  discount?: number;
  discountedPrice?: number;
  id?: string;
}

const API_BASE_URL = 'https://itunes.apple.com/search';
const SPONSOR_CATALOG_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsor_catalog';

const Catalog = () => {
  const [conversionRate] = useState(100); // Default conversion rate
  const [currentTab, setCurrentTab] = useState(0);
  const [items, setItems] = useState<ItunesItem[]>([]); // Items from external API
  const [catalog, setCatalog] = useState<ItunesItem[]>([]); // Sponsor's catalog
  const [searchTerm] = useState('');
  const [selectedCategory] = useState('music');
  const [loading, setLoading] = useState(false);
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
      } catch (err: unknown) {
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

  const handleAddToCatalog = async (item: ItunesItem) => {
    const newItem = {
      ...item,
      discountedPrice: item.collectionPrice || item.trackPrice,
      discount: 0,
    };

    try {
      const response = await fetch(SPONSOR_CATALOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          items: [
            {
              item_id: item.trackId || item.collectionId,
              item_name: item.trackName || item.collectionName,
              artist_name: item.artistName,
              price: item.collectionPrice || item.trackPrice,
              discounted_price: newItem.discountedPrice,
              discount: newItem.discount,
              currency: item.currency,
              points: Math.round((item.collectionPrice || item.trackPrice || 0) * 100),
              image_url: item.artworkUrl100,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to catalog.');
      }

      setCatalog((prev) => [...prev, newItem]);
      alert('Item added to catalog successfully.');
    } catch (error) {
      console.error('Error adding item to catalog:', error);
      alert('Failed to add item to catalog.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(SPONSOR_CATALOG_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, item_id: itemId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }

      setCatalog((prev) => prev.filter((item) => item.id !== itemId));
      alert('Item deleted successfully.');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
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

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} centered>
        <Tab label="Manage Catalog" />
        <Tab label="Search and Add Items" />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={4} sx={{ marginTop: '20px' }}>
          {catalog.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
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
                  onClick={() => handleDeleteItem(item.id || '')}
                  sx={{ marginTop: '10px' }}
                >
                  Delete Item
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {currentTab === 1 && (
        <Box>
          <Grid container spacing={4} sx={{ marginTop: '20px' }}>
            {items.map((item) => (
              <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4}>
               <CatalogItem
        item={item}
        onAddToCatalog={() => handleAddToCatalog(item)}
        onViewDetails={() => console.log(`View details for ${item.trackName || item.collectionName}`)} // Placeholder
        conversionRate={conversionRate} // Pass the conversionRate from state
        userRole="sponsor" // Specify the user role
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