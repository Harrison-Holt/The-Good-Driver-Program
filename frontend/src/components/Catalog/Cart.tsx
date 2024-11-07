import React from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, Grid, Divider, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, useTheme
} from '@mui/material';
import { useSettings } from '../../components/Settings/settings_context';

interface ItunesItem {
  artworkUrl100: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
}

interface CartProps {
  cartItems: ItunesItem[];
  total: number;
  userPoints: number | null;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  handleCheckout: () => void;
  showConfirmationDialog: boolean;
  setShowConfirmationDialog: React.Dispatch<React.SetStateAction<boolean>>;
  confirmCheckout: () => void;
  errorMessage: string | null;
  checkoutSuccess: boolean;
  insufficientPoints: boolean;
}

const Cart: React.FC<CartProps> = ({
  cartItems, total, userPoints, userEmail, setUserEmail, handleCheckout,
  showConfirmationDialog, setShowConfirmationDialog, confirmCheckout,
  errorMessage, checkoutSuccess, insufficientPoints
}) => {
  const { settings } = useSettings(); // Access settings from context
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
      }}
    >
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
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              },
            }}
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
