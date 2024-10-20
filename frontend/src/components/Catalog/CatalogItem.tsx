import React from 'react';
import { Card, CardMedia, CardContent, Typography, Link } from '@mui/material';

interface CatalogItemProps {
  item: {
    itemId: string;
    title: string;
    image?: { imageUrl?: string };
    price?: { value: string; currency: string };
    itemWebUrl: string;
  };
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item }) => {
  const { title, image, price, itemWebUrl } = item;

  return (
    <Card>
      <Link href={itemWebUrl} target="_blank" rel="noopener">
        {image?.imageUrl ? (
          <CardMedia
            component="img"
            height="140"
            image={image.imageUrl}
            alt={title}
          />
        ) : (
          <Typography>No Image Available</Typography>
        )}
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <Link href={itemWebUrl} target="_blank" rel="noopener">
            {title}
          </Link>
        </Typography>
        {price && price.value && price.currency ? (
          <Typography variant="body2" color="text.secondary">
            Price: {price.value} {price.currency}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Price Not Available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogItem;





