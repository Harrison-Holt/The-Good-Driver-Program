import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom'; 
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
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // iTunes API uses `term` for search and `media` for category
                const response = await fetch(
                    `${API_BASE_URL}?term=${encodeURIComponent(searchTerm || 'music')}&media=${selectedCategory}&limit=50`,
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
                    // Filter out items that are free (no price) and only include paid items
                    const filteredItems = data.results.filter(item => {
                        return (item.trackPrice && item.trackPrice > 0) || (item.collectionPrice && item.collectionPrice > 0);
                    });

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

        // Perform fetch when the component loads or when search term/category changes
        fetchItems();
    }, [selectedCategory, searchTerm]);

    const handleViewDetails = (trackId: string) => {
        console.log("Navigating to item with ID:", trackId);
        const encodedItemId = encodeURIComponent(trackId);
        navigate(`/product/${encodedItemId}`);
    };

    return (
        <Box sx={{ padding: '20px' }}>
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
        </Box>
    );
};

export default Catalog;
