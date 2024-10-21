import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom'; 
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';

interface iTunesItem {
    trackId: string;
    trackName: string;
    artworkUrl100: string;
    trackViewUrl: string;
    collectionPrice: number;
    currency: string;
}

const categories = [
    { id: 'music', name: 'Music' },
    { id: 'podcast', name: 'Podcasts' },
    { id: 'tvShow', name: 'TV Shows' },
    { id: 'movie', name: 'Movies' },
    { id: 'software', name: 'Software' },
];

const API_BASE_URL = 'https://itunes.apple.com/search';

const Catalog = () => {
    const [items, setItems] = useState<iTunesItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id); // Default to 'music'
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchItems = async (category: string) => {
            const response = await fetch(
                `${API_BASE_URL}?term=${encodeURIComponent(searchTerm)}&media=${category}&limit=50`,
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

            const data = await response.json();
            return data.results as iTunesItem[];
        };

        const fetchAllItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const itemsFromCategory = await fetchItems(selectedCategory);
                setItems(itemsFromCategory.slice(0, 44));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAllItems();
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
                    <Grid item key={item.trackId} xs={12} sm={6} md={4} lg={3}>
                        <CatalogItem 
                            item={{
                                id: item.trackId,
                                title: item.trackName,
                                image: item.artworkUrl100,
                                link: item.trackViewUrl,
                                price: item.collectionPrice,
                                currency: item.currency,
                            }}
                            onViewDetails={handleViewDetails} 
                        />
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
