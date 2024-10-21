import { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ItunesItem {
  trackId?: string;
  collectionId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<ItunesItem[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCart);
  }, []);

  const handleCheckout = () => {
    localStorage.removeItem('cartItems'); // Clear cart after checkout
    setAlertMessage('Your purchase was successful! Redirecting to confirmation...');
    setTimeout(() => {
      navigate('/confirmation', { state: { cartItems } }); // Pass the cart items to the confirmation page
    }, 2000);
  };

  const handleRemoveFromCart = (itemId: string | undefined) => {
    const updatedCart = cartItems.filter(item => item.trackId !== itemId && item.collectionId !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {alertMessage && (
        <Alert severity="success" onClose={() => setAlertMessage(null)}>
          {alertMessage}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Typography variant="h6" align="center">
          Your cart is empty.
        </Typography>
      ) : (
        <List>
          {cartItems.map((item, index) => (
            <Box key={item.trackId || item.collectionId}>
              <ListItem>
                <img src={item.artworkUrl100} alt={item.trackName || item.collectionName} style={{ marginRight: '10px' }} />
                <ListItemText
                  primary={item.trackName || item.collectionName}
                  secondary={`Artist: ${item.artistName} - Price: ${item.collectionPrice || item.trackPrice} ${item.currency}`}
                />
                <Button variant="outlined" color="secondary" onClick={() => handleRemoveFromCart(item.trackId || item.collectionId)}>
                  Remove
                </Button>
              </ListItem>
              {index < cartItems.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}

      {cartItems.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ marginTop: '20px' }}>
          Proceed to Checkout
        </Button>
      )}
    </Box>
  );
};

export default Cart;
