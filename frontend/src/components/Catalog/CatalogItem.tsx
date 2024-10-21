import React from 'react';
import { Box, Typography, Button } from '@mui/material';

// Define the iTunesItem interface if it's not imported from elsewhere
interface iTunesItem {
    id: string; // Track or item ID
    title: string; // Title of the item
    image: string; // Field for the item's image URL
    price: number; // Price of the item
    currency: string; // Currency for the item price
    link: string; // URL for the item's detailed page
}

interface CatalogItemProps {
    item: iTunesItem; // Use the defined iTunesItem type
    onViewDetails: (itemId: string) => void; // Define the function type
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails }) => {
    return (
        <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <img src={item.image} alt={item.title} style={{ width: '100%' }} />
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body1">
                Price: {item.price} {item.currency}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => onViewDetails(item.id)}>
                View Details
            </Button>
        </Box>
    );
};

export default CatalogItem;

