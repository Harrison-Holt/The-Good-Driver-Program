import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';  // Import Button here

interface ProductDetailsProps {
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
  itemWebUrl: string;  // Add the purchase link
}

const ProductDetails: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>(); // Get itemId from the URL
  const [product, setProduct] = useState<ProductDetailsProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev/item/${itemId}`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err); 
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [itemId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return product ? (
    <Box>
      <Typography variant="h4" gutterBottom>{product.title}</Typography>
      <img src={product.image.imageUrl} alt={product.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
      <Typography variant="h6" gutterBottom>
        Price: {product.price.value} {product.price.currency}
      </Typography>
      <Typography variant="body1" gutterBottom>{product.description}</Typography>
      <a href={product.itemWebUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="contained" color="primary">Buy Now</Button>  {/* Button is used here */}
      </a>
    </Box>
  ) : (
    <Typography variant="h6">Product not found</Typography>
  );
};

export default ProductDetails;
