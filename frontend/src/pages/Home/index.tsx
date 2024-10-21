import { Stack, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import Navibar from '../../components/Navibar';
import React, { useState, useEffect } from 'react';
import DashboardInfo from '../../components/DashboardInfo';
import { getUsernameFromToken } from '../../utils/tokenUtils';  // Import the utility function
import axios from 'axios';  // Import Axios

const Home: React.FC = () => {
  const [selectedDisplay, setSelectedDisplay] = useState("home");
  const [searchTerm, setSearchTerm] = useState(""); // Keep both searchTerm and setSearchTerm
  const [username, setUsername] = useState<string | null>(null);  // State for username
  const [userInfo, setUserInfo] = useState<any>(null);  // State for storing user info from Lambda

  // Add the logout function
  const handleLogout = () => {
    const clientId = 'ff8qau87sidn42svsuj51v4l4';  // Replace with your Cognito App Client ID
    const cognitoDomain = 'team08-domain';  // Replace with your Cognito domain name
    const logoutUrl = `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=https://master.d3ggpwrnl4m4is.amplifyapp.com`;

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

  const dashboardList = (
    <Box>
      <List>
        <ListItem>
          <ListItemButton onClick={() => { setSelectedDisplay("home") }}>
            Home
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setSelectedDisplay("notifications") }}>
            Notifications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setSelectedDisplay("search") }}>
            Search
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setSelectedDisplay("applications") }}>
            Applications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setSelectedDisplay("catalog") }}>
            Catalog
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
    <>
      <Box>
        <Navibar />
        <Stack direction={"row"} spacing={5}>
          {dashboardList}
          <Divider orientation='vertical' variant='middle' flexItem />
          <DashboardInfo currentDisplay={selectedDisplay} setSearchTerm={setSearchTerm} />
          {/* Optionally use searchTerm in Home */}
          <Box>{searchTerm && <p>Search Term: {searchTerm}</p>}</Box> {/* Display searchTerm */}
          {/* Display the username and fetched user info */}
          <Box>
            {username && <p>Welcome, {username}!</p>}
            {userInfo && (
              <div>
                <p>Name: {userInfo.first_name} {userInfo.last_name}</p>
                <p>Email: {userInfo.email}</p>
                <p>Role: {userInfo.role}</p>
              </div>
            )}
          </Box>  {/* Show the username and user info */}
        </Stack>
      </Box>
    </>
  );
};

export default Home;
