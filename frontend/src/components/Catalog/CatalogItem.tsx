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
    onViewDetails: (itemId: string) => void; // Ensure this is included
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails }) => {
    return (
        <Box>
            <img src={item.image.imageUrl} alt={item.title} style={{ maxWidth: '100%', height: 'auto' }} />
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body1">
                Price: {item.price.value} {item.price.currency}
            </Typography>
            <Button variant="contained" onClick={() => onViewDetails(item.itemId)}>
                View Details
            </Button>
        </Box>
    );
};

export default CatalogItem;
