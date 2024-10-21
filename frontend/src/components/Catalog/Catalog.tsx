import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom'; 
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';

interface EbayItem {
    itemId: string;
    title: string;
    galleryURL: string;
    viewItemURL: string;
    price: {
        value: string;
        currency: string;
    };
}

interface ApiItem {
    itemId: string[];
    title: string[];
    galleryURL: string[];
    viewItemURL: string[];
    sellingStatus: {
        currentPrice: {
            __value__: string;
            '@currencyId': string;
        }[];
    }[];
}

const categories = [
    { id: '11450', name: 'Clothing, Shoes & Accessories' },
    { id: '58058', name: 'Cell Phones & Accessories' },
    { id: '267', name: 'Books' },
    { id: '888', name: 'Sporting Goods' },
    { id: '26395', name: 'Health & Beauty' },
];

const API_BASE_URL = 'https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev/catalog';

const Catalog = () => {
    const [items, setItems] = useState<EbayItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchItems = async (categoryId: string) => {
            const response = await fetch(
                `${API_BASE_URL}?category=${categoryId}&q=${searchTerm}&paginationInput.entriesPerPage=44`,
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
            const itemSummaries = data.findItemsByKeywordsResponse[0].searchResult[0].item || [];
            return itemSummaries as ApiItem[]; // Cast the item summaries to ApiItem[]
        };

        const fetchAllItems = async () => {
            setLoading(true);
            setError(null);
            let allItems: EbayItem[] = [];

            try {
                for (const category of categories) {
                    const itemsFromCategory = await fetchItems(category.id);
                    
                    const formattedItems = itemsFromCategory.map((item: ApiItem) => ({
                        itemId: item.itemId[0],
                        title: item.title[0],
                        galleryURL: item.galleryURL[0],
                        viewItemURL: item.viewItemURL[0],
                        price: {
                            value: item.sellingStatus[0].currentPrice[0].__value__,
                            currency: item.sellingStatus[0].currentPrice[0]['@currencyId'],
                        },
                    }));

                    allItems = [...allItems, ...formattedItems];

                    if (allItems.length >= 44) {
                        break;
                    }
                }

                setItems(allItems.slice(0, 44));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAllItems();
    }, [selectedCategory, searchTerm]);

    const handleViewDetails = (itemId: string) => {
        console.log("Navigating to item with ID:", itemId);
        const encodedItemId = encodeURIComponent(itemId);
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
                    <Grid item key={item.itemId} xs={12} sm={6} md={4} lg={3}>
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
