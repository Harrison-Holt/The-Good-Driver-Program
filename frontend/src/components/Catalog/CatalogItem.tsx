// src/components/Catalog/CatalogItem.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/product/${item.itemId}`); // Navigate to the item details page
    };

    return (
        <Box>
            <img src={item.image.imageUrl} alt={item.title} style={{ maxWidth: '100%', height: 'auto' }} />
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body1">
                Price: {item.price.value} {item.price.currency}
            </Typography>
            <Button variant="contained" onClick={handleViewDetails}>
                View Details
            </Button>
        </Box>
    );
};

export default CatalogItem;
