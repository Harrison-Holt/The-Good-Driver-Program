import { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';  
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';
import { SelectChangeEvent } from '@mui/material';

interface EbayItem {
  itemId: string;
  title: string;
  image_url: string;
  price: string;
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
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id); // Default to first category
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching items for category: ${selectedCategory}`); // Log selected category
        const response = await fetch(
          `https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev/catalog?category=${selectedCategory}&q=${searchTerm}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Log the fetched data for debugging
        setItems(data.items || []);  // Set items from API response
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]); // Trigger useEffect when category or search term changes

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const newCategory = event.target.value; // Already typed as string
    console.log(`Category changed to: ${newCategory}`);
    setSelectedCategory(newCategory); // Update selected category
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Search Bar */}
      <SearchBar setSearchTerm={setSearchTerm} options={categories.map(cat => cat.name)} />

      {/* Category Selection */}
      <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Select Category:
        </Typography>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}  // Update category on change
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

      {/* Loading and Error Messages */}
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

      {/* Catalog Grid */}
      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.itemId} xs={12} sm={6} md={4} lg={3}>
            <CatalogItem item={item} />
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

