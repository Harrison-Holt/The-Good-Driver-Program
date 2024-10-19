import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

interface EbayItem {
  itemId: string;
  title: string;
  image: {
    imageUrl: string;
  };
  price: {
    value: string;
    currency: string;
  };
}

interface Props {
  item: EbayItem;
}

const CatalogItem: React.FC<Props> = ({ item }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Link to={`/product/${item.itemId}`}>
        <CardMedia
          component="img"
          alt={item.title}
          height="140"
          image={item.image.imageUrl} 
        />
      </Link>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.price.value} {item.price.currency}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/product/${item.itemId}`}>
          <Button size="small" color="primary">
            View Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default CatalogItem;





