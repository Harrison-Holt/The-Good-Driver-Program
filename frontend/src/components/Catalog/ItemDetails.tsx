// src/components/Catalog/ProductDetails.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

interface Item {
  title: string;
  image: {
    imageUrl: string;
  };
  price: {
    value: string;
    currency: string;
  };
  description: string;
}

const ItemDetails = () => {
  const { itemId } = useParams<{ itemId: string }>(); // Ensure this matches the route
  const navigate = useNavigate();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`https://ph2fd5spla.execute-api.us-east-1.amazonaws.com/prod/item_details?itemId=${itemId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetails();
    } else {
      setLoading(false);
      setError('Item ID is missing.');
    }
  }, [itemId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  if (!item) {
    return <Typography color="error">Item not found.</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4">{item.title}</Typography>
      <img src={item.image.imageUrl} alt={item.title} style={{ maxWidth: '100%', height: 'auto' }} />
      <Typography variant="h6">Price: {item.price.value} {item.price.currency}</Typography>
      <Typography variant="body1">{item.description}</Typography>

      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ marginTop: '20px' }}>Back to Catalog</Button>
    </Box>
  );
};

export default ItemDetails;
