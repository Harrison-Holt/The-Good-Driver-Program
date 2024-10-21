import { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText, List, ListItem, ListItemText, Grid, Alert
} from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; // Use navigate for post-action navigation
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';

interface ItunesItem {
  trackId?: string;  // For tracks
  collectionId?: string;  // For collections
  trackName?: string;  // Track name for tracks
  collectionName?: string;  // Collection name for albums
  artistName: string;
  artworkUrl100: string;
  trackViewUrl?: string;  // URL for tracks
  collectionViewUrl?: string;  // URL for collections
  trackPrice?: number;  // Price for tracks
  collectionPrice?: number;  // Price for collections
  currency?: string;
}

interface ItunesApiResponse {
  resultCount: number;
  results: ItunesItem[];
}

const categories = [
  { id: 'music', name: 'Music' },
  { id: 'podcast', name: 'Podcast' },
  { id: 'tvShow', name: 'TV Show' },
  { id: 'movie', name: 'Movie' },
  { id: 'software', name: 'Software' },
];

const API_BASE_URL = 'https://itunes.apple.com/search';

const Catalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id); // Default to 'music'
  const [searchTerm, setSearchTerm] = useState(''); // Empty initial search term
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // Alert for user feedback
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null); // Selected item for modal
  const navigate = useNavigate(); // For navigation

  // Fetch items when category or search term changes
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${API_BASE_URL}?category=${selectedCategory}&keyword=${searchTerm || 'music'}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.status} ${response.statusText}`);
        }

        const data: ItunesApiResponse = await response.json();

        if (data.resultCount > 0) {
          const filteredItems = data.results.filter(
            item => item.collectionPrice && item.collectionPrice > 0
          ); // Only include paid items
          setItems(filteredItems);
        } else {
          setItems([]); // No items found
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);

  // Handle Buy Now action
  const handleBuyNow = () => {
    setAlertMessage('Purchase successful! Thank you for buying.');
    navigate('/confirmation'); // Navigate to a confirmation page after purchase
  };

  // Handle Add to Cart action
  const handleAddToCart = () => {
    setAlertMessage('Item added to cart!');
    navigate('/cart'); // Navigate to cart after adding an item
  };

  // Handle opening modal
  const handleViewDetails = (item: ItunesItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Search bar */}
      <SearchBar setSearchTerm={setSearchTerm} options={categories.map(cat => cat.name)} />
      <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Select Category:
        </Typography>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          fullWidth
          variant="outlined"
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Loading spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error alert */}
      {error && (
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      )}

      {/* Success Alert */}
      {alertMessage && (
        <Alert severity="success" onClose={() => setAlertMessage(null)}>
          {alertMessage}
        </Alert>
      )}

      {/* Item Grid */}
      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4} lg={3}>
            <CatalogItem item={item} onViewDetails={handleViewDetails} />
          </Grid>
        ))}
      </Grid>

      {!loading && items.length === 0 && !error && (
        <Typography align="center" variant="h6" sx={{ marginTop: '20px' }}>
          No items found. Try searching with a different term or category.
        </Typography>
      )}

      {/* Modal for viewing item details */}
      {selectedItem && (
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedItem.trackName || selectedItem.collectionName}</DialogTitle>
          <DialogContent>
            <img src={selectedItem.artworkUrl100} alt={selectedItem.trackName} style={{ width: '100%', marginBottom: '20px' }} />
            <DialogContentText>
              <strong>Artist:</strong> {selectedItem.artistName} <br />
              <strong>Price:</strong> {selectedItem.collectionPrice} {selectedItem.currency} <br />
            </DialogContentText>
            <List>
              <ListItem>
                <ListItemText primary="More details about the track/album can go here." />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleBuyNow}>
              Buy Now
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Catalog;
