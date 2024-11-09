import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
} from '@mui/material';
import { useSettings } from '../../components/Settings/settings_context';
import audioFeedbackFile from '../../assets/audio_feedback.mp3'; // Import the audio file

interface ItunesItem {
  artworkUrl100: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
}

const Cart: React.FC = () => {
  const { settings } = useSettings(); // Access settings from context
  const theme = useTheme();

  // Internal state management
  const [cartItems, setCartItems] = useState<ItunesItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
  const [errorMessage] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [insufficientPoints, setInsufficientPoints] = useState<boolean>(false);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
  }, []);

  // Calculate total price
  useEffect(() => {
    const calculatedTotal = cartItems.reduce(
      (acc, item) => acc + (item.collectionPrice || item.trackPrice || 0),
      0
    );
    setTotal(calculatedTotal);
  }, [cartItems]);

  // Fetch user points (replace with your actual logic, e.g., API call)
  useEffect(() => {
    const fetchUserPoints = async () => {
      setUserPoints(1000); // Example value
    };
    fetchUserPoints();
  }, []);

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

  const handleCheckout = () => {
    playAudioFeedback(); // Play sound when "Proceed to Checkout" is clicked
    if (userPoints !== null && userPoints >= total) {
      setShowConfirmationDialog(true);
    } else {
      setInsufficientPoints(true);
    }
  };

  const confirmCheckout = () => {
    playAudioFeedback(); // Play sound when "Confirm and Purchase" is clicked
    setCheckoutSuccess(true);
    setShowConfirmationDialog(false);
    setCartItems([]);
    localStorage.removeItem('cartItems');
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
        <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>
          No items in the cart.
        </Typography>
      ) : (
        <>
          <List
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '10px',
              padding: '20px',
              lineHeight: settings.lineHeight || 1.5,
            }}
          >
            {cartItems.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  lineHeight: settings.lineHeight || 1.5,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <img
                      src={item.artworkUrl100}
                      alt={item.trackName || item.collectionName}
                      style={{ width: '100%', borderRadius: '4px' }}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            color: theme.palette.text.primary,
                            lineHeight: settings.lineHeight || 1.5,
                          }}
                        >
                          {item.trackName || item.collectionName}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: settings.lineHeight || 1.5,
                          }}
                        >
                          <strong>Artist:</strong> {item.artistName}
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: 'right',
                        color: theme.palette.text.primary,
                        lineHeight: settings.lineHeight || 1.5,
                      }}
                    >
                      {(item.collectionPrice || item.trackPrice)?.toFixed(2)}{' '}
                      {item.currency || 'USD'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            sx={{ textAlign: 'right', marginBottom: '20px', lineHeight: settings.lineHeight || 1.5 }}
          >
            Total: {total.toFixed(2)} points
          </Typography>

          <Typography
            variant="h6"
            sx={{ textAlign: 'right', marginBottom: '10px', lineHeight: settings.lineHeight || 1.5 }}
          >
            Your Points: {userPoints !== null ? userPoints : 'Loading...'}
          </Typography>

          <TextField
            fullWidth
            label="Email for Order Confirmation"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            sx={{ marginBottom: '20px', lineHeight: settings.lineHeight || 1.5 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            disabled={userPoints === null || userPoints < total}
            sx={{ mt: 2, width: '100%', padding: '12px', fontSize: '16px', lineHeight: settings.lineHeight || 1.5 }}
          >
            Proceed to Checkout
          </Button>

          <Dialog
            open={showConfirmationDialog}
            onClose={() => setShowConfirmationDialog(false)}
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                lineHeight: settings.lineHeight || 1.5,
              },
            }}
          >
            <DialogTitle sx={{ lineHeight: settings.lineHeight || 1.5 }}>
              Email Confirmation
            </DialogTitle>
            <DialogContent sx={{ lineHeight: settings.lineHeight || 1.5 }}>
              <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                Please confirm your email before proceeding with the purchase:
              </Typography>
              <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                <strong>{userEmail}</strong>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowConfirmationDialog(false)}
                color="secondary"
                sx={{ lineHeight: settings.lineHeight || 1.5 }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmCheckout}
                color="primary"
                sx={{ lineHeight: settings.lineHeight || 1.5 }}
              >
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

