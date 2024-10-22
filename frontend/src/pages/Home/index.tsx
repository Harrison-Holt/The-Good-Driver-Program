import React, { useState, useEffect } from 'react';
import { Box, Stack, Divider, List, ListItem, ListItemButton, Typography, Badge } from '@mui/material';
import Navibar from '../../components/Navibar';
import DashboardInfo from '../../components/DashboardInfo';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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

const Home: React.FC = () => {
  const [cartItems, setCartItems] = useState<ItunesItem[]>([]);
  const [selectedDisplay, setSelectedDisplay] = useState("home");

  // Load cart from localStorage (if any) on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems); // Update state with items from localStorage
  }, []);

  // Add a storage event listener to update cart when changes are detected in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(storedCartItems); // Update the cart items
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle navigation to Cart
  const handleCartClick = () => {
    setSelectedDisplay("cart");
  };

  // Get the total number of items in the cart
  const cartItemCount = cartItems.length;

  const dashboardList = (
    <Box sx={{ width: '250px', backgroundColor: '#f5f5f5', padding: '10px' }}>
      <List>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("home")}>
            Home
          </ListItemButton>
        </ListItem>
        <ListItem>
        <ListItemButton onClick={() => setSelectedDisplay("notifications")}>
          Notifications
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton onClick={() => setSelectedDisplay("applications")}>
          Applications
        </ListItemButton>
      </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("catalog")}>
            Catalog
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={handleCartClick}>
            <Badge badgeContent={cartItemCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
            <Typography sx={{ ml: 1 }}>Cart</Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Navibar />
      <Stack direction={"row"} spacing={5} sx={{ padding: '20px' }}>
        {dashboardList}
        <Divider orientation='vertical' variant='middle' flexItem />
        <Box sx={{ flex: 1, padding: '20px' }}>
          {/* Pass the currentDisplay prop to DashboardInfo */}
          <DashboardInfo currentDisplay={selectedDisplay} />
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;



