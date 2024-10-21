import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';

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
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);
            
            try {
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
                    const filteredItems = data.results.filter(item => {
                        return (item.trackPrice && item.trackPrice > 0) || (item.collectionPrice && item.collectionPrice > 0);
                    });

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

    const handleViewDetails = (item: ItunesItem) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
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

            {/* Modal for Item Details */}
            {selectedItem && (
                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>{selectedItem.trackName || selectedItem.collectionName}</DialogTitle>
                    <DialogContent>
                        <img src={selectedItem.artworkUrl100} alt={selectedItem.trackName || selectedItem.collectionName} style={{ width: '100px', marginBottom: '10px' }} />
                        <Typography>Artist: {selectedItem.artistName}</Typography>
                        <Typography>Price: {selectedItem.collectionPrice || selectedItem.trackPrice} {selectedItem.currency}</Typography>
                        <Typography>
                            <a href={selectedItem.trackViewUrl || selectedItem.collectionViewUrl} target="_blank" rel="noopener noreferrer">
                                View on iTunes
                            </a>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default Catalog;
