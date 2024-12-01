import React, { useState, useEffect } from 'react';
import { Box, Stack, Divider, List, ListItem, ListItemButton, Typography, Badge, useTheme } from '@mui/material';
import axios from 'axios';
import Navibar from '../../components/Navibar';
import DashboardInfo from '../../components/DashboardInfo';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getUsernameFromToken } from '../../utils/tokenUtils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, logout, selectGuestView, selectUserName, selectUserType, setEmail, setFirstName, setLastName, setUserType } from '../../store/userSlice';
import { useSettings } from '../../components/Settings/settings_context';
import { resetCart } from '../../store/userSlice';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userInfo, setUserInfo] = useState<any>(null);

  const guestView = useAppSelector(selectGuestView);
  const username = useAppSelector(selectUserName);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { settings } = useSettings(); // Access settings from context

  const userRole = useAppSelector(selectUserType);

  // Handle logout with redirect to Cognito
  const handleLogout = () => {
    const clientId = 'ff8qau87sidn42svsuj51v4l4';
    const cognitoDomain = 'team08-domain';

    const logoutUrl = `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=https://master.d3ggpwrnl4m4is.amplifyapp.com`;
    //const logoutUrl = `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=https://conner-working.d3ggpwrnl4m4is.amplifyapp.com`;
    
    // anthony's branch 
    //const logoutUrl = `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=https://anthony-test-branch.d3ggpwrnl4m4is.amplifyapp.com`;
    dispatch(resetCart());
    localStorage.removeItem('cartItems'); 
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
    window.location.href = logoutUrl;
  };

  // Fetch user info based on username
  const fetchUserInfo = async (username: string) => {
    try {
      const response = await axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/get-user-info/${username}`);
      setUserInfo(response.data);
      dispatch(setUserType(response.data.role));
      dispatch(setFirstName(response.data.first_name));
      dispatch(setLastName(response.data.last_name));
      dispatch(setEmail(response.data.email));
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
  }, []);

  // Add a storage event listener to update cart when changes are detected in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(storedCartItems);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!guestView) {
      const idToken = localStorage.getItem('idToken');
      if (idToken) {
        const decodedUsername = getUsernameFromToken(idToken); // Decode the username from the token
      //Tradd Login Hack - Don't uncomment
      //if (true) {
        //const decodedUsername = 'FastBuck';  
        //setUsername(decodedUsername);
        dispatch(login(decodedUsername));
        if (decodedUsername) fetchUserInfo(decodedUsername);
      }
    }
  }, [dispatch]);

  const handleCartClick = () => setSelectedDisplay("cart");
  const cartItemCount = cartItems.length;

  const dashboardList = (
    <Box
      sx={{
        width: '250px',
        backgroundColor: settings.isHighContrast ? '#000' : theme.palette.background.paper,
        padding: '10px',
        color: settings.isHighContrast ? '#FFF' : theme.palette.text.primary,
        lineHeight: settings.lineHeight || 1.5,
      }}
    >
      <List>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("home")}>Home</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("notifications")}>Notifications</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("applications")}>Applications</ListItemButton>
        </ListItem>
        {(userInfo?.role === 'admin' || userInfo?.role === 'sponsor') && (
          <ListItem>
            <ListItemButton onClick={() => setSelectedDisplay("driverManagement")}>Driver Management</ListItemButton>
          </ListItem>
        )}
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("reports")}>Reports</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("catalog")}>Catalog</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={handleCartClick}>
            <Badge badgeContent={cartItemCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
            <Typography sx={{ ml: 1 }}>Cart</Typography>
          </ListItemButton>
        </ListItem>
        {(userRole === "sponsor") && <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("pointChange")}>Point Change</ListItemButton>
        </ListItem>}
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("pointHistory")}>Point History</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("faq")}>FAQ</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("profile")}>Profile</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={handleLogout}>Logout</ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: settings.isHighContrast ? '#000' : settings.isDarkMode ? theme.palette.background.default : '#ffffff',
        color: settings.isHighContrast ? '#fff' : theme.palette.text.primary,
        minHeight: '100vh',
        filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
        lineHeight: settings.lineHeight || 1.5, // Apply lineHeight globally
        transition: 'all 0.3s ease',
      }}
    >
      <Navibar />
      <Stack direction={"row"} spacing={5} sx={{ padding: '20px' }}>
        {dashboardList}
        <Divider orientation='vertical' variant='middle' flexItem />
        <Box
          sx={{
            flex: 1,
            padding: '20px',
            backgroundColor: settings.isHighContrast ? '#111' : theme.palette.background.paper,
            lineHeight: settings.lineHeight || 1.5,
          }}
        >
          <DashboardInfo setSearchTerm={() => {}} currentDisplay={selectedDisplay} />
        </Box>
        <Box>
          {username && (
            <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>
              Welcome, {username}!
            </Typography>
          )}
          {userInfo && (
            <div>
              <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                Name: {userInfo.first_name} {userInfo.last_name}
              </Typography>
              <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                Email: {userInfo.email}
              </Typography>
              <Typography sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                Role: {userInfo.role}
              </Typography>
            </div>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;
