import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

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
    itemWebUrl: string;
  };
  onViewDetails: (itemId: string) => void; // Function type for the view details handler
}

const CatalogItem = ({ item, onViewDetails }: CatalogItemProps) => {
  return (
    <Card>
      <CardMedia
        component="img"
        image={item.image.imageUrl}
        alt={item.title}
        title={item.title}
        sx={{ height: 140 }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.title}
        </Typography>
        <Typography variant="body2">
          {item.price.value} {item.price.currency}
        </Typography>
        <Button variant="contained" onClick={() => onViewDetails(item.itemId)} sx={{ marginTop: '10px' }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CatalogItem;