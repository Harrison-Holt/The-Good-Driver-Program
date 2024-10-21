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
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
}

interface CatalogItemProps {
  item: ItunesItem;
  onViewDetails: (item: ItunesItem) => void;
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item, onViewDetails }) => {
    return (
        <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <img src={item.artworkUrl100} alt={item.trackName || item.collectionName} style={{ width: '100%' }} />
            <Typography variant="h6">{item.trackName || item.collectionName}</Typography>
            <Typography variant="body1">Artist: {item.artistName}</Typography>
            <Typography variant="body1">
                Price: {item.collectionPrice || item.trackPrice} {item.currency}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => onViewDetails(item)}>
                View Details
            </Button>
        </Box>
    );
};

export default CatalogItem;

