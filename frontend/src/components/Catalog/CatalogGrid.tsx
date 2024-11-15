import React from 'react';
import { Grid } from '@mui/material';
import CatalogItem from './CatalogItem';

interface ItunesItem {
  trackId?: string;
  collectionId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
}

interface CatalogGridProps {
  items: ItunesItem[];
  onViewDetails: (item: ItunesItem) => void;
  conversionRate: number;
  userRole: string;
}

const CatalogGrid: React.FC<CatalogGridProps> = ({
  items,
  onViewDetails,
  conversionRate,
  userRole,
}) => {
  return (
    <Grid container spacing={4}>
      {items.map((item: ItunesItem) => (
        <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4}>
          <CatalogItem
            item={item}
            onViewDetails={onViewDetails}
            conversionRate={conversionRate}
            userRole={userRole} // Pass userRole here
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CatalogGrid;
