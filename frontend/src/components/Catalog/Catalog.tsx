import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

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

interface ItunesApiResponse {
  resultCount: number;
  results: ItunesItem[];
}

const categories = [
  { id: 'music', name: 'Music' },
  { id: 'podcast', name: 'Podcast' },
  { id: 'movie', name: 'Movies' },
  { id: 'software', name: 'Software' },
];

const API_BASE_URL = 'https://itunes.apple.com/search';
const CATALOG_API_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsor-catalog';

const SponsorCatalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ItunesItem[]>([]);
  const [category, setCategory] = useState(categories[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch iTunes items based on category and search term
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}?term=${encodeURIComponent(searchTerm || 'music')}&media=${category}&limit=20`
        );

        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.statusText}`);
        }

        const data: ItunesApiResponse = await response.json();
        setItems(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category, searchTerm]);

  // Add item to the sponsor's catalog using API
  const handleAddToCatalog = async (item: ItunesItem) => {
    try {
      const response = await fetch(CATALOG_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsor_username: 'currentSponsor', // Replace with the current sponsor's username
          item_id: item.trackId || item.collectionId,
          item_name: item.trackName || item.collectionName,
          artist_name: item.artistName,
          price: item.collectionPrice || item.trackPrice,
          currency: item.currency,
          image_url: item.artworkUrl100,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to the catalog.');
      }

      const result = await response.json();
      setSelectedItems((prev) => [...prev, item]);
      setAlertMessage(result.message || 'Item successfully added to your catalog!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  const handleRemoveFromCatalog = (item: ItunesItem) => {
    setSelectedItems((prev) => prev.filter((selected) => selected.trackId !== item.trackId));
    setAlertMessage('Item removed from your catalog!');
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center' }}>
        Manage Your Sponsor Catalog
      </Typography>

      {alertMessage && <Alert severity="success" onClose={() => setAlertMessage(null)}>{alertMessage}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Search for items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} sx={{ minWidth: '150px' }}>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Items Grid */}
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.trackId || item.collectionId}>
            <Box
              sx={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={item.artworkUrl100}
                alt={item.trackName || item.collectionName}
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <Typography variant="h6" sx={{ margin: '10px 0' }}>
                {item.trackName || item.collectionName}
              </Typography>
              <Typography variant="body2">Artist: {item.artistName}</Typography>
              <Typography variant="body2">
                Price: {item.collectionPrice || item.trackPrice} {item.currency}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: '10px' }}
                onClick={() => handleAddToCatalog(item)}
              >
                Add to Catalog
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Selected Catalog */}
      <Typography variant="h5" sx={{ marginTop: '40px' }}>
        Selected Catalog
      </Typography>
      <Grid container spacing={2}>
        {selectedItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.trackId || item.collectionId}>
            <Box
              sx={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography variant="body1">{item.trackName || item.collectionName}</Typography>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginTop: '10px' }}
                onClick={() => handleRemoveFromCatalog(item)}
              >
                Remove
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SponsorCatalog;
