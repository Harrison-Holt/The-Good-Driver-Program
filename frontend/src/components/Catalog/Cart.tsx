import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Grid, Divider, Alert, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

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

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<ItunesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // Now we just ask for the user's email
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false); // State for email confirmation dialog

  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [insufficientPoints, setInsufficientPoints] = useState(false);

  // Fetch user points from the backend
  const fetchUserPoints = async (user_Id: string) => {
  try {
    const url = `https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/team08-points-connection?user_id=${user_Id}`;
    console.log('Fetching from URL:', url); // Log to confirm correct URL
    const response = await fetch(url);
    const data = await response.json();
    console.log('Fetched data:', data); 
    setUserPoints(data.points);
  } catch (error) {
    console.error('Error fetching user points:', error);
    setUserPoints(0); // Default to 0 points on error
  }
};


  // Update cart items and total dynamically
  const updateCart = () => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);

    const cartTotal = storedCartItems.reduce((acc: number, item: ItunesItem) => {
      return acc + (item.collectionPrice || item.trackPrice || 0);
    }, 0);
    setTotal(cartTotal);
  };

  useEffect(() => {
    const user_Id = '11';
    updateCart();
    fetchUserPoints(user_Id);

    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const handleCheckout = async () => {
    // Just show the confirmation dialog asking for email confirmation
    setShowConfirmationDialog(true);
  };

  const confirmCheckout = async () => {
    try {
      const orderDetails = {
        orderId: new Date().getTime(),
        items: cartItems.map(item => item.trackName || item.collectionName),
        total: total,
      };

      if (userPoints !== null && userPoints < total) {
        setInsufficientPoints(true);
        return;
      }

      const response = await fetch('https://z5q02l6av1.execute-api.us-east-1.amazonaws.com/dev/order_confirmation', { // Replace with your actual Lambda endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail, // Use the entered email
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
      setShowConfirmationDialog(false); // Close the dialog
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while processing your order.');
      setShowConfirmationDialog(false); // Close the dialog even if there's an error
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

      {insufficientPoints && (
        <Alert severity="error" sx={{ mb: 2 }}>
          You do not have enough points to complete the purchase.
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
                          <Typography component="span" variant="body2" color="textSecondary">
                            <strong>Artist:</strong> {item.artistName}
                          </Typography>
                          <br />
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
            Total: {total.toFixed(2)} points
          </Typography>

          <Typography variant="h6" sx={{ textAlign: 'right', marginBottom: '10px' }}>
            Your Points: {userPoints !== null ? userPoints : 'Loading...'}
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
            disabled={userPoints === null || userPoints < total}
            sx={{ mt: 2, width: '100%', padding: '12px', fontSize: '16px' }}
          >
            Proceed to Checkout
          </Button>

          {/* Email Confirmation Dialog */}
          <Dialog
            open={showConfirmationDialog}
            onClose={() => setShowConfirmationDialog(false)}
          >
            <DialogTitle>Email Confirmation</DialogTitle>
            <DialogContent>
              <Typography>
                Please confirm your email before proceeding with the purchase:
              </Typography>
              <Typography>
                <strong>{userEmail}</strong>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowConfirmationDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={confirmCheckout} color="primary">
                Confirm and Purchase
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Cart;
