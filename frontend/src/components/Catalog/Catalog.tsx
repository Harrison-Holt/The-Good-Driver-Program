import { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText, Grid, Alert, List, ListItem, ListItemText, TextField, Rating, InputAdornment,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import CatalogItem from './CatalogItem'; 
import { useAppSelector } from "../../store/hooks"
import { selectUserType } from "../../store/userSlice"
import SearchBar from '../SearchBar';
import StarRating from './StarRating';
import { useSettings } from '../Settings/settings_context';  
import audioFeedbackFile from '../../assets/audio_feedback.wav'; 

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
}

interface ItunesApiResponse {
  resultCount: number;
  results: ItunesItem[];
}

interface Review {
  user_name: string;
  rating: number;
  comment: string;
}

const categories = [
  { id: 'music', name: 'Music' },
  { id: 'podcast', name: 'Podcast' },
  { id: 'tvShow', name: 'TV Show' },
  { id: 'movie', name: 'Movie' },
  { id: 'software', name: 'Software' },
];

const API_BASE_URL = 'https://itunes.apple.com/search';
const REVIEW_API_URL = 'https://dtnha4rfd4.execute-api.us-east-1.amazonaws.com/dev/reviews';



const Catalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItunesItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItunesItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review>({ user_name: '', comment: '', rating: 5 });
  const [conversionRate, setConversionRate] = useState(100); // Points system
  const [sortOption, setSortOption] = useState('highest');
  const navigate = useNavigate();

  const theme = useTheme();  // Access MUI theme
  const { settings } = useSettings();  // Access custom settings

  const usertype = useAppSelector(selectUserType); // 

  // Calculate points function remains the same

  const containerStyles = {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
    transition: 'all 0.3s ease',  // Smooth transitions for theme changes
  };

  const dialogContentStyles = {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  };

  const calculatePoints = (price?: number) => {
    return price ? (price * conversionRate).toFixed(2) : 'N/A';
  };

  const calculateAverageRating = (reviews: Review[]) => {
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    return reviews.length ? (totalRatings / reviews.length).toFixed(1) : '0.0';
  };

  const sortReviews = (reviews: Review[], option: string) => {
    return [...reviews].sort((a, b) => {
      if (option === 'lowest') return a.rating - b.rating;
      return b.rating - a.rating; // default to highest rating first
    });
  };


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

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm || 'music')}&media=${selectedCategory}&limit=50`;
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (!response.ok) throw new Error(`Error fetching items: ${response.status} ${response.statusText}`);
        const data: ItunesApiResponse = await response.json();

        const fetchedItems = data.resultCount > 0 ? data.results.filter(item => item.collectionPrice && item.collectionPrice > 0) : [];
        setItems(fetchedItems);
        setFilteredItems(fetchedItems);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    if (selectedItem) {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${REVIEW_API_URL}?itemId=${selectedItem.trackId || selectedItem.collectionId}`, { method: 'GET' });
          if (!response.ok) throw new Error('Error fetching reviews');
          const data = await response.json();
          setReviews(data);
        } catch {
          setError('Failed to load reviews');
        }
      };
      fetchReviews();
    }
  }, [selectedItem]);

  const handleSubmitReview = async () => {
    if (selectedItem) {
      try {
        const itemId = selectedItem.trackId || selectedItem.collectionId;

        if (!itemId) {
          setError("Item ID is missing, cannot submit review.");
          return;
        }

        const reviewPayload = { itemId, user_name: newReview.user_name, rating: newReview.rating, comment: newReview.comment };

        const response = await fetch(REVIEW_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewPayload),
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(`Error submitting review: ${JSON.stringify(errorDetails)}`);
        }

        setReviews(prevReviews => [...prevReviews, { user_name: newReview.user_name, rating: newReview.rating, comment: newReview.comment }]);
        setNewReview({ user_name: '', comment: '', rating: 5 });
        setAlertMessage('Review submitted successfully!');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    }
  };

  const handleRemFromCatalog = (item: ItunesItem) => {
    console.log(item.trackName);
    const removedItems = JSON.parse(localStorage.getItem('remItems') || '[]');

    const updateList = [...removedItems, item];
    localStorage.setItem('remItems', JSON.stringify(updateList));
    setAlertMessage(`${item.trackName || item.collectionName} has been removed from your catalog.`);
    setShowModal(false);
    window.dispatchEvent(new Event('storage'));
  };

  const handleBuyNow = (item: ItunesItem) => {
    setAlertMessage(`Purchased ${item.trackName || item.collectionName}!`);
    navigate('/confirmation', { state: { item } });
  };

  const handleAddToCart = (item: ItunesItem) => {
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = [...currentCart, item];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));

    // Trigger cart update and close modal
    window.dispatchEvent(new Event('storage'));
    setShowModal(false);

    setAlertMessage(`${item.trackName || item.collectionName} added to cart!`);
  };

  const handleAddToWishList = (item: ItunesItem) => {
    const currentWList = JSON.parse(localStorage.getItem('wishItems') || '[]');

    for (const i in currentWList) {
      if(currentWList[i].trackName == item.trackName) {
        setAlertMessage(`${item.trackName || item.collectionName} is already in your wish list...`);
        setShowModal(false);
        window.dispatchEvent(new Event('storage'));
        return;
      }
    }
    
    const updatedWList = [...currentWList, item];
    localStorage.setItem('wishItems', JSON.stringify(updatedWList));
    setAlertMessage(`${item.trackName || item.collectionName} added to wish list!`);
    setShowModal(false);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveForLater = (item: ItunesItem) => {
    const currentSList = JSON.parse(localStorage.getItem('savedItems') || '[]');

    for (const i in currentSList) {
      if(currentSList[i].trackName == item.trackName) {
        setAlertMessage(`${item.trackName || item.collectionName} is already saved for later...`);
        setShowModal(false);
        window.dispatchEvent(new Event('storage'));
        return;
      }
    }

    const updatedSList = [...currentSList, item];
    localStorage.setItem('savedItems', JSON.stringify(updatedSList));
    setAlertMessage(`${item.trackName || item.collectionName} saved for later!`);
    setShowModal(false);
    window.dispatchEvent(new Event('storage'));
  };

  let sponBtn = (<><Button variant="contained" color="primary">Catalog</Button></>);
  console.log("\"" + usertype + "\"");
  // Check User Role
  if (usertype === "sponsor") {
    console.log("Setting sponBtn");
    sponBtn = (<>
      <Button variant="contained" color="primary" onClick={() => selectedItem ? handleRemFromCatalog(selectedItem) : console.log("NULL")}>
        Unlist from Catalog
      </Button>
    </>)
    console.log("Set sponBtn");
  } else {
    console.log("\""+usertype+"\"" + ",\"sponsor\"")
  }

  const handleViewDetails = (item: ItunesItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const sortedReviews = sortReviews(reviews, sortOption);

  useEffect(() => {
    const filtered = items.filter((item) =>
      (item.trackName?.toLowerCase().includes(searchTerm.toLowerCase()) || item.collectionName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  return (
    <Box sx={containerStyles}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: '40px' }}>
        Discover Your Favorite Media
      </Typography>

      {/* Conversion Rate */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>Set Conversion Rate</Typography>
        <TextField
          label="1 Dollar = X Points"
          type="number"
          value={conversionRate}
          onChange={(e) => setConversionRate(parseInt(e.target.value, 10))}
          InputProps={{
            startAdornment: <InputAdornment position="start">$1 =</InputAdornment>,
            endAdornment: <InputAdornment position="end">Points</InputAdornment>
          }}
          fullWidth
        />
      </Box>

      <SearchBar setSearchTerm={setSearchTerm} options={categories.map(category => category.name)} label="Search for media" />

      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>Select Category:</Typography>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} fullWidth variant="outlined">
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
          ))}
        </Select>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error" align="center">Error: {error}</Typography>}
      {alertMessage && <Alert severity="success" onClose={() => setAlertMessage(null)}>{alertMessage}</Alert>}

      <Grid container spacing={4}>
        {filteredItems.map((item: ItunesItem) => (
          <Grid item key={item.trackId || item.collectionId} xs={12} sm={6} md={4}>
            <CatalogItem item={item} onViewDetails={handleViewDetails} conversionRate={conversionRate} />
          </Grid>
        ))}
      </Grid>

      {selectedItem && (
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth scroll="paper" >
          <DialogTitle sx={dialogContentStyles}>{selectedItem.trackName || selectedItem.collectionName}</DialogTitle>
          <DialogContent sx = {dialogContentStyles}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxHeight: '75vh'}}>
              <img src={selectedItem.artworkUrl100} alt={selectedItem.trackName} style={{ width: '200px', marginBottom: '20px' }} />
              <DialogContentText sx={dialogContentStyles}>
                <strong>Artist:</strong> {selectedItem.artistName} <br />
                <strong>Price:</strong> {selectedItem.collectionPrice} {selectedItem.currency} ({calculatePoints(selectedItem.collectionPrice)} points)
              </DialogContentText>

              <Typography variant="h6" sx={{ marginTop: '20px', backgroundColor: theme.palette.background.paper }}>
                Overall Rating: {calculateAverageRating(reviews)} / 5
              </Typography>
              <Rating value={parseFloat(calculateAverageRating(reviews))} readOnly precision={0.5} sx={{ marginBottom: '20px' }} />
            </Box>

            <Typography variant="h6" sx={dialogContentStyles}>User Reviews</Typography>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              fullWidth
              sx={{ marginBottom: '10px', backgroundColor: theme.palette.background.paper }}
            >
              <MenuItem value="highest">Highest Rating</MenuItem>
              <MenuItem value="lowest">Lowest Rating</MenuItem>
            </Select>

            <List>
              {sortedReviews.length > 0 ? (
                sortedReviews.map((review, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={<StarRating rating={review.rating} />}
                      secondary={`${review.user_name || 'Anonymous'}: ${review.comment || 'No review text available'}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No reviews yet. Be the first to leave one!" />
                </ListItem>
              )}
            </List>

            <Box sx={{ marginTop: '20px' }}>
              <Typography variant="h6">Leave a Review</Typography>
              <TextField
                fullWidth
                label="Username"
                value={newReview.user_name}
                onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
                sx={{ marginBottom: '10px', backgroundColor: theme.palette.background.paper}}
              />

              <TextField
                fullWidth
                label="Review"
                multiline
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                sx={{ marginBottom: '10px', backgroundColor: theme.palette.background.paper}}
              />

              <Typography component="legend" >Rating (0-5)</Typography>
              <Select
                fullWidth
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                sx={{ marginBottom: '10px', backgroundColor: theme.palette.background.paper}}
              >
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>{value} Star{value > 1 ? 's' : ''}</MenuItem>
                ))}
              </Select>

              <Button variant="contained" onClick={handleSubmitReview} sx={{ marginTop: '10px', width: '100%' }}>Submit Review</Button>
            </Box>
          </DialogContent>
<DialogActions sx={dialogContentStyles}>
  {sponBtn}
  <Button
    variant="contained"
    color="primary"
    onClick={() => {
      playAudioFeedback(); // Play sound
      handleBuyNow(selectedItem);
    }}
  >
    Buy Now
  </Button>
  <Button
    startIcon={<FontAwesomeIcon icon={faStar} />}
    onClick={() => {
      playAudioFeedback(); // Play sound
      handleSaveForLater(selectedItem);
    }}
  >
    Save for Later
  </Button>
  <Button
    variant="outlined"
    color="secondary"
    onClick={() => {
      playAudioFeedback(); // Play sound
      handleAddToWishList(selectedItem);
    }}
  >
    Add to Wish List
  </Button>
  <Button
    variant="outlined"
    color="secondary"
    onClick={() => {
      playAudioFeedback(); // Play sound
      handleAddToCart(selectedItem);
    }}
  >
    Add to Cart
  </Button>
  <Button
    onClick={() => {
      playAudioFeedback(); // Play sound
      setShowModal(false);
    }}
  >
    Close
  </Button>
</DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Catalog;
