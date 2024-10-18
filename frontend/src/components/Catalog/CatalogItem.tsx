import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Define the type for an Ebay item
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
  itemWebUrl: string;
}

interface Props {
  item: EbayItem;
}

const CatalogItem: React.FC<Props> = ({ item }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${item.itemId}`);  // Navigate to the product details page
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardMedia
        component="img"
        alt={item.title}
        height="140"
        image={item.image.imageUrl || 'https://via.placeholder.com/150'}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.price.value} {item.price.currency}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleViewDetails}>
          View Details
        </Button>
        <Button size="small" color="primary" href={item.itemWebUrl} target="_blank" rel="noopener noreferrer">
          Buy Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default CatalogItem;



