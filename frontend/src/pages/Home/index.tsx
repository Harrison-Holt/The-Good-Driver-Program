import { Stack, Box, Divider, List, ListItem, ListItemButton, Typography, Badge } from '@mui/material';
import Navibar from '../../components/Navibar';
import React, { useState, useEffect } from 'react';
import DashboardInfo from '../../components/DashboardInfo';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 

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

const Home: React.FC = () => {
  const [cartItems, setCartItems] = useState<ItunesItem[]>([]); 
  const [selectedDisplay, setSelectedDisplay] = useState("home");
  const [searchTerm, setSearchTerm] = useState(""); // Track search term

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
  }, []);

  // Handle navigation to Cart
  const handleCartClick = () => {
    setSelectedDisplay("cart");
  };

  const cartItemCount = cartItems.length;


  useEffect(() => {
    if (searchTerm) {
      // Perform your search logic here
      console.log("Searching for:", searchTerm);
    }
  }, [searchTerm]);

  const dashboardList = (
    <Box sx={{ width: '250px', backgroundColor: '#f5f5f5', padding: '10px' }}>
      <List>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("home")}>
            Home
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
          <DashboardInfo currentDisplay={selectedDisplay} setSearchTerm={setSearchTerm} />
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;




