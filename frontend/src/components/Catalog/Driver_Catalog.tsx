import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import StarRating from './StarRating';
import { useAppSelector } from '../../store/hooks';
import { selectUserName } from '../../store/userSlice';

interface ItunesItem {
  collectionId: string;
  trackName: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  points?: number;
  sponsor_username: string; // Added for grouping
}

interface Review {
  username: string;
  rating: number;
  comment: string;
}

const DRIVER_CATALOG_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/driver_catalog';
const REVIEW_API_URL = 'https://dtnha4rfd4.execute-api.us-east-1.amazonaws.com/dev/reviews';

const DriverCatalog: React.FC = () => {
  const username = useAppSelector(selectUserName) || 'Guest';
  const [catalog, setCatalog] = useState<ItunesItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState(0); // For tab selection

  // Fetch the driver's catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${DRIVER_CATALOG_URL}?username=${username}`);
        if (!response.ok) {
          throw new Error(`Error fetching catalog: ${response.statusText}`);
        }

        const data: ItunesItem[] = await response.json();
        setCatalog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [username]);

  // Group catalog by sponsor_username
  const groupedCatalog = catalog.reduce((groups: { [key: string]: ItunesItem[] }, item) => {
    const sponsor = item.sponsor_username;
    if (!groups[sponsor]) {
      groups[sponsor] = [];
    }
    groups[sponsor].push(item);
    return groups;
  }, {});

  const sponsorTabs = Object.keys(groupedCatalog);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = async (item: ItunesItem) => {
    setSelectedItem(item);

    // Fetch reviews for the selected item
    try {
      const response = await fetch(`${REVIEW_API_URL}?itemId=${item.collectionId}`);
      if (response.ok) {
        const data: Review[] = await response.json();
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    }
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
    setReviews([]);
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Driver Catalog
      </Typography>

      {/* Display errors or loading state */}
      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Sponsor Tabs */}
      {!loading && sponsorTabs.length > 0 && (
        <>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            {sponsorTabs.map((sponsor) => (
              <Tab label={sponsor} key={sponsor} />
            ))}
          </Tabs>

          {/* Display items for the active tab */}
          {sponsorTabs.map((sponsor, index) => (
            <Box
              key={sponsor}
              sx={{ display: activeTab === index ? 'block' : 'none', marginTop: '20px' }}
            >
              <Grid container spacing={4}>
                {groupedCatalog[sponsor].map((item) => (
                  <Grid item key={item.collectionId} xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '15px',
                      }}
                    >
                      <img
                        src={item.artworkUrl100}
                        alt={item.trackName || item.collectionName}
                        style={{ width: '100%', marginBottom: '10px' }}
                      />
                      <Typography variant="h6" sx={{ marginBottom: '8px' }}>
                        {item.trackName || item.collectionName}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: '5px' }}>
                        <strong>Artist:</strong> {item.artistName}
                      </Typography>
                      <Typography variant="body2">Points: {item.points || 0}</Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewDetails(item)}
                        sx={{ marginTop: '10px', marginRight: '10px' }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </>
      )}

      {/* No data fallback */}
      {!loading && sponsorTabs.length === 0 && (
        <Typography variant="body1" align="center">
          No items available in the catalog.
        </Typography>
      )}

      {/* Item Details Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onClose={handleDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>{selectedItem.trackName || selectedItem.collectionName}</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={selectedItem.artworkUrl100}
                alt={selectedItem.trackName || selectedItem.collectionName}
                style={{ width: '200px', marginBottom: '20px' }}
              />
              <Typography>
                <strong>Artist:</strong> {selectedItem.artistName}
              </Typography>
              <Typography variant="body2">Points: {selectedItem.points || 0}</Typography>
            </Box>
            <Typography variant="h6" sx={{ marginTop: '20px' }}>
              Reviews
            </Typography>
            <List>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={<StarRating rating={review.rating} />}
                      secondary={`${review.username}: ${review.comment}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No reviews yet." />
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default DriverCatalog;
