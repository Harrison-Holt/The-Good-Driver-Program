import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

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
  const { title, image, price, itemWebUrl, itemId } = item;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Internal Routing Link for product details */}
      <RouterLink to={`/product/${itemId}`}>
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
      </RouterLink>

      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {/* External Link to the item's URL */}
          <Link href={itemWebUrl} target="_blank" rel="noopener">
            {title}
          </Link>
        </Typography>
        {price && (
          <Typography variant="body2" color="text.secondary">
            Price: {price.value} {price.currency}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <RouterLink to={`/product/${itemId}`}>
          <Button size="small" color="primary">
            View Details
          </Button>
        </RouterLink>
      </CardActions>
    </Card>
  );
};

export default CatalogItem;




