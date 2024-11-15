import React from 'react'; // Import React for TypeScript
import { Box, Typography, TextField, Select, MenuItem, InputAdornment } from '@mui/material';

const categories = [
  { id: 'music', name: 'Music' },
  { id: 'podcast', name: 'Podcast' },
  { id: 'tvShow', name: 'TV Show' },
  { id: 'movie', name: 'Movie' },
  { id: 'software', name: 'Software' },
];

// Define the type for the props
interface CatalogControlsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  conversionRate: number;
  setConversionRate: (rate: number) => void;
  setSearchTerm: (term: string) => void;
}

const CatalogControls: React.FC<CatalogControlsProps> = ({
  selectedCategory,
  setSelectedCategory,
  conversionRate,
  setConversionRate,
  setSearchTerm,
}) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Set Conversion Rate
      </Typography>
      <TextField
        label="1 Dollar = X Points"
        type="number"
        value={conversionRate}
        onChange={(e) => setConversionRate(Number(e.target.value))}
        InputProps={{
          startAdornment: <InputAdornment position="start">$1 =</InputAdornment>,
          endAdornment: <InputAdornment position="end">Points</InputAdornment>,
        }}
        fullWidth
      />
      <Typography variant="h6" gutterBottom>Select Category:</Typography>
      <Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        fullWidth
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Search"
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginTop: '20px' }}
      />
    </Box>
  );
};

export default CatalogControls;
