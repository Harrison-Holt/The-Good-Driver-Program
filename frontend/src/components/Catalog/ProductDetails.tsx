import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

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
  description: string;
}

const ProductDetails = () => {
  const { itemId } = useParams<{ itemId: string }>(); 
  const [item, setItem] = useState<EbayItem | null>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev/item/${itemId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data: EbayItem = await response.json(); // Ensure the fetched data matches the EbayItem type
        setItem(data);  // Set the item details
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      {item ? (
        <>
          <img src={item.image.imageUrl} alt={item.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
          <Typography variant="h4" sx={{ marginTop: '20px' }}>{item.title}</Typography>
          <Typography variant="h6" sx={{ marginTop: '10px' }}>${item.price.value} {item.price.currency}</Typography>
          <Typography variant="body1" sx={{ marginTop: '20px' }}>{item.description}</Typography>
        </>
      ) : (
        <Typography variant="h6">Item not found</Typography>
      )}
    </Box>
  );
};

export default ProductDetails;

