
import { Stack, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import Navibar from '../../components/Navibar';
import React, { useState } from 'react';
import DashboardInfo from '../../components/DashboardInfo';

const Home: React.FC = () => {
  const [selectedDisplay, setselectedDisplay] = useState("home");

  const dashboardList = (
    <Box>
      <List>
        <ListItem>
          <ListItemButton onClick={() => {setselectedDisplay("home")}}>
            Home
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => {setselectedDisplay("notifications")}}>
            Notifications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => {setselectedDisplay("search")}}>
            Search
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => {setselectedDisplay("applications")}}>
            Applications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => {setselectedDisplay("applications")}}>
            Profile
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <Box>
        <Navibar />
        <Stack direction={"row"} spacing={5}>
          {dashboardList}
          <Divider orientation='vertical' variant='middle' flexItem/>
          <DashboardInfo currentDisplay={selectedDisplay}/>
        </Stack>
      </Box>
    </>
  );
};

export default Home;

