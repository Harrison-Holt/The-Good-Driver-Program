import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

interface EbayItem {
  itemId: string;
  title: string;
  image?: {
    imageUrl: string;
  };
  price: {
    value: string;
    currency: string;
  };
  itemWebUrl: string;
}

interface Props {
  item: EbayItem;
}

const CatalogItem: React.FC<Props> = ({ item }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {item.image?.imageUrl && (
        <img
          src={item.image.imageUrl}
          alt={item.title}
          style={{ width: '100%', height: '140px', objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.price.value} {item.price.currency}
        </Typography>
      </CardContent>
      <CardActions>
        {/* Link to the product page */}
        <Button size="small" color="primary" component={Link} to={`/product/${item.itemId}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default CatalogItem;




