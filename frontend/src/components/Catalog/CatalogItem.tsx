// src/components/Catalog/CatalogItem.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface CatalogItemProps {
    item: {
        itemId: string;
        title: string;
        image: {
            imageUrl: string;
        };
        price: {
            value: string;
            currency: string;
        };
    };
    onViewDetails: (itemId: string) => void; // Define the function type
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails }) => {
    return (
        <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <img src={item.image.imageUrl} alt={item.title} style={{ width: '100%' }} />
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

