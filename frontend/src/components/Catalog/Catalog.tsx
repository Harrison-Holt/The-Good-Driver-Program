import { useState, useEffect } from 'react';
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';
import { Box, Typography, CircularProgress, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

interface EbayItem {
  itemId: string;
  title: string;
  image: {
    imageUrl: string;
  };
  price: {
    value: string;
    currency: string;
  };
  itemWebUrl: string;
}

const categories = [
  { id: '11450', name: 'Clothing, Shoes & Accessories' },
  { id: '58058', name: 'Cell Phones & Accessories' },
  { id: '267', name: 'Books' },
  { id: '888', name: 'Sporting Goods' },
  { id: '26395', name: 'Health & Beauty' },
];

const Catalog = () => {
  const [items, setItems] = useState<EbayItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev/catalog?category=${selectedCategory}&q=${searchTerm}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setItems(data.itemSummaries || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);

  return (
    <Box sx={{ padding: '20px' }}>
      <SearchBar setSearchTerm={setSearchTerm} options={categories.map(cat => cat.name)} />

      <Box sx={{ margin: '20px 0' }}>
        <FormControl fullWidth>
          <InputLabel>Select Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.itemId} xs={12} sm={6} md={4} lg={3}>
            <Box sx={{ height: '100%' }}>
              <CatalogItem item={item} />
            </Box>
          </Grid>
        ))}
      </Grid>

      {!loading && items.length === 0 && !error && (
        <Typography align="center" variant="h6" sx={{ marginTop: '20px' }}>
          No items found. Try searching with a different term or category.
        </Typography>
      )}
    </Box>
  );
};

export default Catalog;
