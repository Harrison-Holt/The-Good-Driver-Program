import { Stack, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import { useState } from 'react'
import DashboardInfo from '../../components/DashboardInfo';
import Navibar from '../../components/Navibar';

const Home: React.FC = () => {
  const [selectedDisplay, setselectedDisplay] = useState("home");
  const [searchTerm, setSearchTerm] = useState(""); // Keep both searchTerm and setSearchTerm

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



