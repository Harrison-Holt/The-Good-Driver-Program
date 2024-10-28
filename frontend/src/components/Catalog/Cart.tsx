import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Grid, Divider, Alert } from '@mui/material';
import { jwtDecode } from 'jwt-decode'; // Make sure to install this package

interface ItunesItem {
  trackId?: string;  
  collectionId?: string;  
  trackName?: string;  
  collectionName?: string;  
  artistName: string;
  artworkUrl100: string;
  trackViewUrl?: string;  
  collectionViewUrl?: string;  
  trackPrice?: number;  
  collectionPrice?: number;  
  currency?: string;
  primaryGenreName?: string;  
  releaseDate?: string;  
  country?: string;  
  copyright?: string;  
}

interface TokenPayload {
  email: string; 
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<ItunesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 

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

    const jwtToken = localStorage.getItem('jwtToken'); 
    if (jwtToken) {
      const decodedToken = jwtDecode<TokenPayload>(jwtToken); // Decode the JWT token
      setUserEmail(decodedToken.email); 
      setIsLoggedIn(true); 
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
      setErrorMessage('You must be logged in to make a purchase.'); 
      return;
    }

    try {
      const orderDetails = {
        orderId: new Date().getTime(),
        items: cartItems.map(item => item.trackName || item.collectionName),
        total: total,
      };

      const response = await fetch('https://z5q02l6av1.execute-api.us-east-1.amazonaws.com/dev/order_confirmation', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, 
        },
        body: JSON.stringify({
          email: userEmail, 
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
      setErrorMessage('An error occurred during checkout. Please try again.'); 
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
