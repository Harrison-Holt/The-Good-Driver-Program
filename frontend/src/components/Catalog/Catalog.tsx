import { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText, Grid, Alert, List, ListItem, ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';

// Define ItunesItem with additional details for pricing and cart management
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
  const [alertMessage, setAlertMessage] = useState<string | null>(null); 
  const [showModal, setShowModal] = useState(false); 
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm || 'music')}&media=${selectedCategory}&limit=50`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.status} ${response.statusText}`);
        }

        const data: ItunesApiResponse = await response.json();

        if (data.resultCount > 0) {
          const filteredItems = data.results.filter(
            item => item.collectionPrice && item.collectionPrice > 0
          ); 
          setItems(filteredItems);
        } else {
          setItems([]); 
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);

  const handleBuyNow = (item: ItunesItem) => {
    setAlertMessage(`Purchased ${item.trackName || item.collectionName}!`);
    navigate('/confirmation', { state: { item } });
  };

  const handleAddToCart = (item: ItunesItem) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = [...currentCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setAlertMessage(`${item.trackName || item.collectionName} added to cart!`);
    setShowModal(false); 
    window.dispatchEvent(new Event('storage')); 
  };

  const handleViewDetails = (item: ItunesItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Search Bar */}
      <SearchBar setSearchTerm={setSearchTerm} label={"Search Catalog"} options={categories.map(cat => cat.name)} />

      {/* Category Selection */}
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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      )}

      {alertMessage && (
        <Alert severity="success" onClose={() => setAlertMessage(null)}>
          {alertMessage}
        </Alert>
      )}

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

            {/* Link to iTunes Reviews */}
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              <a
                href={selectedItem.collectionViewUrl || selectedItem.trackViewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View iTunes Reviews
              </a>
            </Typography>

            {/* User Review Placeholder */}
            <Box sx={{ marginTop: '20px' }}>
              <Typography variant="h6">User Reviews (Placeholder)</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="No user reviews yet. Be the first to leave one!" />
                </ListItem>
              </List>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => handleBuyNow(selectedItem)}>
              Buy Now
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => handleAddToCart(selectedItem)}>
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
