import React, { useState, useEffect } from 'react';
import { Box, Stack, Divider, List, ListItem, ListItemButton, Typography, Badge } from '@mui/material';
import axios from 'axios';  // Import Axios
import Navibar from '../../components/Navibar';
import DashboardInfo from '../../components/DashboardInfo';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getUsernameFromToken } from '../../utils/tokenUtils';  // Import the utility function

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
  const [username, setUsername] = useState<string | null>(null);  // State for username
  const [userInfo, setUserInfo] = useState<any>(null);  // State for storing user info from Lambda

  // Add the logout function
  const handleLogout = () => {
    const clientId = 'ff8qau87sidn42svsuj51v4l4';  // Replace with your Cognito App Client ID
    const cognitoDomain = 'team08-domain';  // Replace with your Cognito domain name
    const logoutUrl = `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=https://anthony-test-branch.d3ggpwrnl4m4is.amplifyapp.com`;

    // Clear any stored tokens to simulate logout in the app
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');

    // Redirect the user to the Cognito logout URL
    window.location.href = logoutUrl;
  };

  // Fetch user info from the API based on the username
  const fetchUserInfo = async (username: string) => {
    try {
      const response = await axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/get-user-info/${username}`);
      setUserInfo(response.data);  // Store the fetched user info in state
      console.log('User Info:', response.data);  // Log the user info
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

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

  useEffect(() => {
    // Retrieve the idToken from local storage
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
      const decodedUsername = getUsernameFromToken(idToken);  // Decode the username from the token
      setUsername(decodedUsername);  // Update the state with the decoded username

      // Once username is available, fetch the user info from the Lambda function
      if (decodedUsername) {
        fetchUserInfo(decodedUsername);  // Fetch user info based on username
      }
    }
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
      <ListItem>
        <ListItemButton onClick={() => setSelectedDisplay("pointChange")}>
          Point Change
        </ListItemButton>
      </ListItem>
        <ListItem>
          <ListItemButton onClick={handleLogout}>
            Logout
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
          <DashboardInfo setSearchTerm={()=>{}} currentDisplay={selectedDisplay} />
        </Box>
        <Box>
            {username && <p>Welcome, {username}!</p>}
            {userInfo && (
              <div>
                <p>Name: {userInfo.first_name} {userInfo.last_name}</p>
                <p>Email: {userInfo.email}</p>
                <p>Role: {userInfo.role}</p>
              </div>
            )}
          </Box>
      </Stack>
    </Box>
  );
};

export default Home;
