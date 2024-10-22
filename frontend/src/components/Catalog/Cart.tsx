import { Box, Typography, Button, List, ListItem, ListItemText, Divider, Alert, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
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

interface CartProps {
  cartItems: ItunesItem[];  // Expect cartItems as a prop
}

const Cart: React.FC<CartProps> = ({ cartItems }) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate total price
    const total = cartItems.reduce((acc, item) => acc + (item.collectionPrice || item.trackPrice || 0), 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleCheckout = () => {
    localStorage.removeItem('cartItems'); // Clear cart after checkout
    setAlertMessage('Your purchase was successful! Redirecting to confirmation...');
    setTimeout(() => {
      navigate('/confirmation', { state: { cartItems } }); // Pass cart items to the confirmation page
    }, 2000);
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {alertMessage && (
        <Alert severity="success" onClose={() => setAlertMessage(null)} sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Typography variant="h6" align="center">
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item, index) => (
              <Box key={item.trackId || item.collectionId}>
                <ListItem>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img src={item.artworkUrl100} alt={item.trackName || item.collectionName} style={{ width: '100%' }} />
                    </Grid>
                    <Grid item xs={6}>
                      <ListItemText
                        primary={item.trackName || item.collectionName}
                        secondary={`Artist: ${item.artistName} - Price: ${item.collectionPrice || item.trackPrice} ${item.currency}`}
                      />
                    </Grid>
                    <Grid item xs={3} textAlign="right">
                      <Button variant="outlined" color="secondary">
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
                {index < cartItems.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Display total price */}
          <Typography variant="h6" textAlign="right" sx={{ mt: 2 }}>
            Total: {totalPrice.toFixed(2)} {cartItems[0]?.currency || 'USD'}
          </Typography>

          <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ mt: 2, width: '100%' }}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
