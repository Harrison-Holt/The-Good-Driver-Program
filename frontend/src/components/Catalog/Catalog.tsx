import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import CatalogItem from './CatalogItem'; // Adjust the path based on your project structure
import CatalogControls from './CatalogControls'; // Adjust the path
import ItemDetailsDialog from './ItemDetailsDialog'; // Adjust the path

interface ItunesItem {
  trackId?: string;
  collectionId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
}

const API_BASE_URL = 'https://itunes.apple.com/search';

const Catalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('music');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionRate, setConversionRate] = useState(100);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null);

  // Dynamically filter items based on the search term
  const filteredItems = items.filter(
    (item) =>
      item.trackName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.collectionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch items from the iTunes API
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

        // Filter valid items directly
        const fetchedItems = data.results.filter(
          (item: ItunesItem) => item.collectionPrice && item.collectionPrice > 0
        );

        setItems(fetchedItems);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);

  // Handle item selection
  const handleViewDetails = (item: ItunesItem) => {
    setSelectedItem(item);
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
        conversionRate={conversionRate}
        setConversionRate={setConversionRate}
        setSearchTerm={setSearchTerm}
      />

      <Grid container spacing={4}>
        {filteredItems.map((item) => (
          <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4}>
            <CatalogItem
              item={item}
              onViewDetails={handleViewDetails}
              conversionRate={conversionRate}
              userRole="sponsor"
            />
          </Grid>
        ))}
      </Grid>

      {selectedItem && (
        <ItemDetailsDialog
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          reviews={[]} // Fetch and pass reviews if required
          onSubmitReview={() => {}}
          onRemoveFromCatalog={() => {}}
          onBuyNow={() => {}}
        />
      )}
    </Box>
  );
};

export default Catalog;
