import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ItunesItem {
    trackId?: string;
    collectionId?: string;
    trackName?: string;
    collectionName?: string;
    artistName: string;
    artworkUrl100: string;
    trackViewUrl?: string;
    collectionViewUrl?: string;
    collectionPrice?: number;
    currency?: string;
}

interface CatalogItemProps {
    item: ItunesItem; 
    onViewDetails: (id: string) => void; 
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails }) => {
    const itemId = item.trackId || item.collectionId;
    const itemName = item.trackName || item.collectionName || 'Unknown Title';

    return (
        <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <img src={item.artworkUrl100} alt={itemName} style={{ width: '100%' }} />
            <Typography variant="h6">{itemName}</Typography>
            <Typography variant="body1">Artist: {item.artistName}</Typography>
            <Typography variant="body2">
                Price: {item.collectionPrice ? `${item.collectionPrice} ${item.currency}` : 'N/A'}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => onViewDetails(itemId ?? '')}>
                View Details
            </Button>
        </Box>
    );
};

export default CatalogItem;

