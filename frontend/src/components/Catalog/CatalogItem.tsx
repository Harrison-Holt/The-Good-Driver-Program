import React from 'react';
import { Box, Typography, Button } from '@mui/material';

// Define the EbayItem interface if it's not imported from elsewhere
interface EbayItem {
    itemId: string;
    title: string;
    galleryURL: string; // Field for the item's image URL
    price: {
        value: string;
        currency: string;
    };
}

interface CatalogItemProps {
    item: EbayItem; // Use the defined EbayItem type
    onViewDetails: (itemId: string) => void; // Define the function type
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails }) => {
    return (
        <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <img src={item.galleryURL} alt={item.title} style={{ width: '100%' }} />
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body1">
                Price: {item.price.value} {item.price.currency}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => onViewDetails(item.itemId)}>
                View Details
            </Button>
        </Box>
    );
};

export default CatalogItem;

