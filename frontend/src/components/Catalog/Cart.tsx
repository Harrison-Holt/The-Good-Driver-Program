import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Grid, Divider, Alert, TextField } from '@mui/material';

interface ItunesItem {
  trackId?: string;  // For tracks
  collectionId?: string;  // For collections
  trackName?: string;  // Track name for tracks
  collectionName?: string;  // Collection name for albums
  artistName: string;
  artworkUrl100: string;
  trackViewUrl?: string;  // URL for tracks
  collectionViewUrl?: string;  // URL for collections
  trackPrice?: number;  // Price for tracks
  collectionPrice?: number;  // Price for collections
  currency?: string;
  primaryGenreName?: string;  // Genre of the track/album
  releaseDate?: string;  // Release date of the track/album
  country?: string;  // Country of origin
  copyright?: string;  // Copyright information
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<ItunesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const updateCart = () => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);

    const cartTotal = storedCartItems.reduce((acc: number, item: ItunesItem) => {
      return acc + (item.collectionPrice || item.trackPrice || 0);
    }, 0);
    setTotal(cartTotal);
  };

  useEffect(() => {
    updateCart();

    // Check if the user is logged in by looking for the JWT token
    const jwtToken = localStorage.getItem('jwtToken'); // Adjust this as per your authentication flow
    if (jwtToken) {
      setIsLoggedIn(true); // User is logged in if token exists
    }

    const handleStorageChange = () => {
      updateCart();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setErrorMessage('You must be logged in to make a purchase.'); // Set error message if not logged in
      return;
    }

    try {
      const orderDetails = {
        orderId: new Date().getTime(),
        items: cartItems.map(item => item.trackName || item.collectionName),
        total: total,
      };

      const response = await fetch('https://your-lambda-api-endpoint/order_confirmation', { // Replace with your actual Lambda endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, // Include the JWT token in the Authorization header
        },
        body: JSON.stringify({
          orderDetails: orderDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send order confirmation email');
      }

      setCheckoutSuccess(true);
      localStorage.removeItem('cartItems');
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while processing your order.');
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {checkoutSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Checkout successful! Thank you for your purchase.
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Typography>No items in the cart.</Typography>
      ) : (
        <>
          <List sx={{ backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px' }}>
            {cartItems.map((item, index) => (
              <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #ddd' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <img src={item.artworkUrl100} alt={item.trackName || item.collectionName} style={{ width: '100%', borderRadius: '4px' }} />
                  </Grid>
                  <Grid item xs={7}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.trackName || item.collectionName}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Artist:</strong> {item.artistName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Genre:</strong> {item.primaryGenreName || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Release Date:</strong> {new Date(item.releaseDate || '').toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="h6" sx={{ textAlign: 'right' }}>
                      {(item.collectionPrice || item.trackPrice)?.toFixed(2)} {item.currency || 'USD'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ textAlign: 'right', marginBottom: '20px' }}>
            Total: {total.toFixed(2)} USD
          </Typography>

          <TextField
            fullWidth
            label="Email for Order Confirmation"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            sx={{ mt: 2, width: '100%', padding: '12px', fontSize: '16px' }}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
