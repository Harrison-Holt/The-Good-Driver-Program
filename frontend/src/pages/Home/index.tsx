import { Stack, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import Navibar from '../../components/Navibar';
import React, { useState } from 'react';
import DashboardInfo from '../../components/DashboardInfo';

const Home: React.FC = () => {
  const [selectedDisplay, setselectedDisplay] = useState("home");
  const [searchTerm, setSearchTerm] = useState(""); // Keep both searchTerm and setSearchTerm

    // Add the logout function
    const handleLogout = () => {
      const clientId = 'ff8qau87sidn42svsuj51v4l4';  // Replace with your Cognito App Client ID
      const cognitoDomain = 'team08-domain';  // Replace with your Cognito domain name
      const logoutUrl = `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/logout?client_id=${clientId}&logout_uri=https://master.d3ggpwrnl4m4is.amplifyapp.com`;
  
      // Redirect the user to the Cognito logout URL
      window.location.href = logoutUrl;
    };

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
        </Stack>
      </Box>
    </>
  );
};

export default Home;



