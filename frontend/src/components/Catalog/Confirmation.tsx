import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useSettings } from '../../components/Settings/settings_context';

interface ItunesItem {
  collectionId: string; // Always required
  trackId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  trackPrice?: number;
  collectionPrice?: number;
  currency?: string;
  discount?: number;
  discountedPrice?: number;
}

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems: ItunesItem[] = location.state?.cartItems || [];
  const { settings } = useSettings(); 

  const handleBackToCatalog = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: settings.isHighContrast ? '#000' : '#fff',
        color: settings.isHighContrast ? '#fff' : '#000',
        lineHeight: settings.lineHeight || 1.5, 
        textAlign: settings.textAlign || 'left',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ lineHeight: settings.lineHeight || 1.5 }}>
        Purchase Confirmation
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ lineHeight: settings.lineHeight || 1.5 }}>
        Thank you for your purchase!
      </Typography>

      {cartItems.length > 0 ? (
        <List>
          {cartItems.map((item, index) => (
            <Box key={item.trackId || item.collectionId}>
              <ListItem>
                <img
                  src={item.artworkUrl100}
                  alt={item.trackName || item.collectionName}
                  style={{ marginRight: '10px' }}
                />
                <ListItemText
                  primary={item.trackName || item.collectionName}
                  secondary={`Artist: ${item.artistName} - Price: ${item.collectionPrice || item.trackPrice} ${item.currency}`}
                  sx={{ lineHeight: settings.lineHeight || 1.5 }}
                />
              </ListItem>
              {index < cartItems.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      ) : (
        <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
          No items in your purchase list.
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToCatalog}
        sx={{
          marginTop: '20px',
          backgroundColor: settings.isHighContrast ? '#fff' : undefined,
          color: settings.isHighContrast ? '#000' : undefined,
        }}
      >
        Back to Catalog
      </Button>
    </Box>
  );
};

export default Confirmation;

