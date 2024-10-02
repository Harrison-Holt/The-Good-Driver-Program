
import { Stack, Typography, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import Navibar from '../../components/Navibar';
import React, { useState } from 'react';
import DashboardInfo from '../../components/DashboardInfo';

const Home: React.FC = () => {
  const [selectedDisplay, setselectedDisplay] = useState("search");

  const dashboardList = (
    <Box>
      <List>
        <ListItem>
          <ListItemButton>
            Home
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            Notifications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            Search
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            Applications
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
          <DashboardInfo/>
        </Stack>
      </Box>
    </>
  );
};

export default Home;

