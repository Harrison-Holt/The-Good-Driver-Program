import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useState } from 'react';

interface ItunesItem {
  trackId?: string;
  collectionId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  collectionPrice?: number;
  currency?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<ItunesItem[]>(() => {
    // Retrieve the cart items from localStorage or set an empty array
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const handleClearCart = () => {
    setCartItems([]); // Clear cart items in the component
    localStorage.removeItem('cartItems'); // Clear the cart items in localStorage
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <List>
          {cartItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.trackName || item.collectionName}
                secondary={`Artist: ${item.artistName} | Price: ${item.collectionPrice} ${item.currency}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {cartItems.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleClearCart}>
          Clear Cart
        </Button>
      )}
    </Box>
  );
};

export default Cart;
