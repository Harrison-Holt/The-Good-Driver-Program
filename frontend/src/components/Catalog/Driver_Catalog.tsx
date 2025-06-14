import React, { useState, useEffect } from 'react';
import {
  Box,
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
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import StarRating from './StarRating';
import { useAppSelector } from '../../store/hooks';
import { selectUserName } from '../../store/userSlice';

interface ItunesItem {
  collectionId: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  collectionPrice?: number;
  points?: number;
  rating?: number;
}

interface Review {
  user_name: string;
  rating: number;
  comment: string;
}

interface SponsorCatalog {
  sponsorUsername: string;
  items: ItunesItem[];
}

const DRIVER_CATALOG_URL = 'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/driver_catalog';
const REVIEW_API_URL = 'https://dtnha4rfd4.execute-api.us-east-1.amazonaws.com/dev/reviews';

const DriverCatalog = () => {
  const username = useAppSelector(selectUserName) || 'Guest';
  const [catalogs, setCatalogs] = useState<SponsorCatalog[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review>({
    user_name: '',
    comment: '',
    rating: 5,
  });
  
  // Fetch and group catalog items by sponsor_username
  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${DRIVER_CATALOG_URL}?username=${username}`);
        if (!response.ok) {
          throw new Error('Error fetching driver catalog.');
        }

        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groupedCatalogs: SponsorCatalog[] = data.reduce((acc: SponsorCatalog[], item: any) => {
          const sponsor = acc.find((group) => group.sponsorUsername === item.sponsor_username);

          const catalogItem: ItunesItem = {
            collectionId: item.catalog_id,
            trackName: item.item_name,
            artistName: item.artist,
            artworkUrl100: item.artwork,
            points: item.points,
          };

          if (sponsor) {
            sponsor.items.push(catalogItem);
          } else {
            acc.push({
              sponsorUsername: item.sponsor_username,
              items: [catalogItem],
            });
          }

          return acc;
        }, []);

        setCatalogs(groupedCatalogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, [username]);

  const handleAddToCart = (item: ItunesItem) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = [...currentCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    alert(`${item.trackName || item.collectionName} added to cart!`);
  };

  const handleViewDetails = async (item: ItunesItem) => {
    setSelectedItem(item);

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

  const handleSubmitReview = async () => {
    if (selectedItem) {
      try {
        const payload = {
          itemId: selectedItem.collectionId,
          user_name: newReview.user_name,
          rating: newReview.rating,
          comment: newReview.comment,
        };

        const response = await fetch(REVIEW_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to submit review.');
        }

        // Refresh reviews after submitting
        handleViewDetails(selectedItem);
        setNewReview({ user_name: '', comment: '', rating: 5 });
        alert('Review submitted successfully!');
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review.');
      }
    }
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
    setReviews([]);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Driver Catalog
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && catalogs.length > 0 && (
        <>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Sponsor Tabs">
            {catalogs.map((catalog, index) => (
              <Tab key={index} label={catalog.sponsorUsername} />
            ))}
          </Tabs>

          <Grid container spacing={4}>
            {catalogs[selectedTab]?.items.map((item) => (
              <Grid item key={item.collectionId} xs={12} sm={6} md={4}>
                <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
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
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAddToCart(item)}
                    sx={{ marginTop: '10px' }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {selectedItem && (
   <Dialog
   open={!!selectedItem}
   onClose={handleDialogClose}
   maxWidth="md"
   fullWidth
   PaperProps={{
     sx: { backgroundColor: 'white', color: 'black' }, // Explicitly set the background and text color
   }}
 >
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
               secondary={`${review.user_name}: ${review.comment}`}
             />
           </ListItem>
         ))
       ) : (
         <ListItem>
           <ListItemText primary="No reviews yet." />
         </ListItem>
       )}
     </List>
     <Box sx={{ marginTop: '20px' }}>
       <Typography variant="h6">Submit a Review</Typography>
       <TextField
         fullWidth
         label="Your Username"
         value={newReview.user_name}
         onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
         sx={{ marginBottom: '10px' }}
       />
       <TextField
         fullWidth
         label="Comment"
         value={newReview.comment}
         onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
         sx={{ marginBottom: '10px' }}
       />
       <StarRating
         rating={newReview.rating}
         onChange={(rating) => setNewReview({ ...newReview, rating })}
       />
       <Button variant="contained" color="primary" onClick={handleSubmitReview} sx={{ marginTop: '10px' }}>
         Submit Review
       </Button>
     </Box>
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
