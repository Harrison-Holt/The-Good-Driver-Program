import { Stack, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import Navibar from '../../components/Navibar';
import React, { useState, useEffect } from 'react';
import DashboardInfo from '../../components/DashboardInfo';
import { getUsernameFromToken } from '../../utils/tokenUtils';  // Import the utility function
import axios from 'axios';  // Import Axios for making API calls

const Home: React.FC = () => {
  const [selectedDisplay, setselectedDisplay] = useState("home");
  const [searchTerm, setSearchTerm] = useState(""); // Keep both searchTerm and setSearchTerm
  const [username, setUsername] = useState<string | null>(null);  // State for username
  const [userData, setUserData] = useState<any>(null);  // State to hold user data fetched from backend

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

  // Fetch username from token and then call API to fetch user data
  useEffect(() => {
    // Retrieve the idToken from local storage
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
      const username = getUsernameFromToken(idToken);  // Decode the username
      setUsername(username);  // Update the state with the decoded username

      // Fetch user data from backend API using username
      if (username) {
        axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/get-user-info/{username}`)  // Replace with your actual API Gateway URL
          .then(response => {
            setUserData(response.data);  // Store user data in state
          })
          .catch(error => {
            console.error('Error fetching user data:', error);  // Handle any error from API
          });
      }
    }
  }, []);  // Empty dependency array to ensure this runs only once on component mount

  const dashboardList = (
    <Box>
      <List>
        <ListItem>
          <ListItemButton onClick={() => { setselectedDisplay("home") }}>
            Home
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setselectedDisplay("notifications") }}>
            Notifications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setselectedDisplay("search") }}>
            Search
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setselectedDisplay("applications") }}>
            Applications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => { setselectedDisplay("catalog") }}>
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

          {/* Display the username */}
          <Box>{username && <p>Welcome, {username}!</p>}</Box>  {/* Show the username */}

          {/* Display fetched user data */}
          {userData && (
            <Box>
              <p>User Data:</p>
              <p>Username: {userData.username}</p>  {/* Adjust this to match your data structure */}
              <p>Email: {userData.email}</p>  {/* Adjust this to match your data structure */}
              {/* Add more fields as necessary */}
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default Home;
