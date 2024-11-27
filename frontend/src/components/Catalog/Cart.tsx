import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
} from '@mui/material';
import { useSettings } from '../../components/Settings/settings_context';
import { useAppSelector } from '../../store/hooks';
import { selectEmail, selectUserName } from '../../store/userSlice';
import audioFeedbackFile from '../../assets/audio_feedback.wav';
import { fetchUserPoints } from '../../utils/api';

interface ItunesItem {
  collectionId: string; // Always required
  trackId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  points?: number; // Represent the cost in points
}

const Cart: React.FC = () => {
  const { settings } = useSettings(); // Access settings from context
  const theme = useTheme();
  const userEmail = useAppSelector(selectEmail); // Fetch email from store
  const username = useAppSelector(selectUserName); // Fetch username from store

  const [cartItems, setCartItems] = useState<ItunesItem[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [insufficientPoints, setInsufficientPoints] = useState<boolean>(false);

  const API_ENDPOINT = 'https://z5q02l6av1.execute-api.us-east-1.amazonaws.com/dev/order_confirmation';

  // Load cart items from localStorage
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
  }, []);

  // Calculate total points for cart items
  useEffect(() => {
    const calculatedTotal = cartItems.reduce((acc, item) => acc + (item.points || 0), 0);
    setTotalPoints(calculatedTotal);
  }, [cartItems]);

  // Fetch user's available points
  useEffect(() => {
    const getUserPoints = async () => {
      if (!username) {
        setErrorMessage('User not logged in. Unable to fetch points.');
        return;
      }

      try {
        const points = await fetchUserPoints(username);
        if (points !== null) {
          setUserPoints(points);
          console.log(`User points fetched: ${points}`);
        } else {
          setErrorMessage('Failed to fetch user points. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching user points:', error);
        setErrorMessage('An error occurred while fetching user points.');
      }
    };

    getUserPoints();
  }, [username]);

  const playAudioFeedback = () => {
    if (settings.audioFeedback) {
      try {
        const audio = new Audio(audioFeedbackFile);
        audio.play();
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    }
  };

  const handleCancel = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    window.dispatchEvent(new Event('storage'));
    setErrorMessage(`This order has been cancelled`);
  };

  const handleCheckout = () => {
    playAudioFeedback();
    if (userPoints !== null && userPoints >= totalPoints) {
      setShowConfirmationDialog(true);
      setErrorMessage(null);
    } else {
      setInsufficientPoints(true);
    }
  };

  const confirmCheckout = async () => {
    playAudioFeedback();
    try {
      const orderDetails = {
        orderId: `ORD-${Date.now()}`,
        items: cartItems.map((item) => item.trackName || item.collectionName),
        totalPoints,
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          orderDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send order confirmation email.');
      }

      const currentHist = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const updatedHist = [...currentHist, orderDetails];
      localStorage.setItem('orderHistory', JSON.stringify(updatedHist));

      setCheckoutSuccess(true);
      setShowConfirmationDialog(false);
      setCartItems([]);
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error sending order confirmation email. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
        lineHeight: settings.lineHeight || 1.5,
        textAlign: settings.textAlign || 'left',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ lineHeight: settings.lineHeight || 1.5 }}>
        Your Cart
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2, lineHeight: settings.lineHeight || 1.5 }}>
          {errorMessage}
        </Alert>
      )}

      {checkoutSuccess && (
        <Alert severity="success" sx={{ mb: 2, lineHeight: settings.lineHeight || 1.5 }}>
          Checkout successful! Thank you for your purchase.
        </Alert>
      )}

      {insufficientPoints && (
        <Alert severity="error" sx={{ mb: 2, lineHeight: settings.lineHeight || 1.5 }}>
          You do not have enough points to complete the purchase.
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>No items in the cart.</Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={item.trackName || item.collectionName}
                  secondary={`Points: ${item.points || 0}`}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total Points: {totalPoints}</Typography>
          <Typography variant="h6">Available Points: {userPoints !== null ? userPoints : 'Loading...'}</Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Email: {userEmail || 'Loading...'}
          </Typography>

          <Button variant="contained" color="secondary" onClick={handleCancel} sx={{ mt: 2 }}>
            Cancel Order
          </Button>
          <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ mt: 2 }}>
            Proceed to Checkout
          </Button>

          <Dialog
            open={showConfirmationDialog}
            onClose={() => setShowConfirmationDialog(false)}
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.background.default, // Match theme
                color: theme.palette.text.primary, // Match text color
              },
            }}
          >
            <DialogTitle>Email Confirmation</DialogTitle>
            <DialogContent>
              <Typography>Please confirm your email before proceeding with the purchase:</Typography>
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
